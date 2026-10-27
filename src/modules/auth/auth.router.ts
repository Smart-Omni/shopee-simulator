import { Router, Request, Response } from "express";
import * as crypto from "crypto";
import { prisma } from "../../common/prisma";
import { createShopeeSuccessResponse, createShopeeErrorResponse } from "../../common/utils/envelope";
import { shopeeAuthGuard } from "../../common/middleware/auth-guard";
import { WebhookService } from "../webhook/webhook.service";

export const authRouter = Router();

// ============================================================================
// 1. MOCK SELLER OAUTH AUTHORIZATION SCREEN / REDIRECT
// ============================================================================
authRouter.get(["/auth", "/api/v2/shop/auth_partner"], async (req: Request, res: Response) => {
  const partnerIdStr = (req.query.partner_id as string) || "";
  const redirectUri = (req.query.redirect_uri as string) || (req.query.redirect as string) || "";
  const state = (req.query.state as string) || "";
  const autoConfirm = req.query.auto_confirm === "true";

  if (!partnerIdStr || !redirectUri) {
    res.status(400).send("<h3>Missing partner_id or redirect_uri parameters</h3>");
    return;
  }

  const requestedShopIdStr = req.query.shop_id as string | undefined;
  const partnerId = BigInt(partnerIdStr);
  const partner = await prisma.partner.findUnique({
    where: { partnerId },
    include: { shops: { orderBy: { shopId: "asc" } } }
  });

  if (!partner) {
    res.status(400).send(`<h3>Invalid partner_id: ${partnerIdStr}</h3>`);
    return;
  }

  let shop = requestedShopIdStr 
    ? partner.shops.find(s => String(s.shopId) === requestedShopIdStr)
    : partner.shops[0];

  if (!shop) {
    shop = partner.shops[0] || (await prisma.shop.findFirst({ orderBy: { shopId: "asc" } }));
  }
  if (!shop) {
    res.status(500).send("<h3>No shops found for partner</h3>");
    return;
  }

  // Generate single-use authorization code (10 min TTL)
  const authCode = crypto.randomBytes(16).toString("hex");
  const authCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.shop.update({
    where: { shopId: shop.shopId },
    data: { authCode, authCodeExpiresAt }
  });

  const callbackUrl = new URL(redirectUri);
  callbackUrl.searchParams.set("code", authCode);
  callbackUrl.searchParams.set("shop_id", shop.shopId.toString());
  if (state) callbackUrl.searchParams.set("state", state);

  if (autoConfirm) {
    res.redirect(302, callbackUrl.toString());
    return;
  }

  // Render HTML Consent Screen
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Shopee Partner Authorization (Mock)</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f6f6f6; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .card { background: white; padding: 32px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 420px; }
          .logo { color: #ee4d2d; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
          .btn { background: #ee4d2d; color: white; border: none; padding: 12px 20px; width: 100%; border-radius: 4px; font-size: 16px; cursor: pointer; text-decoration: none; display: block; text-align: center; margin-top: 20px; }
          .shop-info { background: #fafafa; border: 1px solid #eee; padding: 12px; border-radius: 4px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">Shopee Open Platform</div>
          <h3>Authorize Application</h3>
          <p>Application <strong>${partner.appName}</strong> is requesting permission to access your shop data.</p>
          <div class="shop-info">
            <div><strong>Shop:</strong> ${shop.shopName}</div>
            <div><strong>Shop ID:</strong> ${shop.shopId}</div>
            <div><strong>Region:</strong> ${shop.region}</div>
            <div><strong>Validity:</strong> 365 Days</div>
          </div>
          <a class="btn" href="${callbackUrl.toString()}">Confirm Authorization</a>
        </div>
      </body>
    </html>
  `);
});

// ============================================================================
// 2. TOKEN EXCHANGE: POST /api/v2/auth/token/get
// ============================================================================
authRouter.post("/api/v2/auth/token/get", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const { code, partner_id, shop_id } = req.body || {};

  if (!code) {
    res.json(createShopeeErrorResponse("error_param", "Missing code in request body"));
    return;
  }

  const shop = await prisma.shop.findFirst({
    where: {
      authCode: code,
      partnerId: BigInt(partner_id)
    }
  });

  if (!shop || !shop.authCodeExpiresAt || shop.authCodeExpiresAt < new Date()) {
    res.json(createShopeeErrorResponse("invalid_code", "The code is expired or used or invalid, please check the code."));
    return;
  }

  // Generate dynamic tokens
  const accessToken = crypto.randomBytes(16).toString("hex");
  const refreshToken = crypto.randomBytes(16).toString("hex");
  const expireIn = 14400; // 4 hours in seconds
  const accessTokenExpiresAt = new Date(Date.now() + expireIn * 1000);
  const refreshTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  // Invalidate authorization code (single-use) and persist tokens
  await prisma.shop.update({
    where: { shopId: shop.shopId },
    data: {
      authCode: null,
      authCodeExpiresAt: null,
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt
    }
  });

  // Asynchronously dispatch shop_authorization_push (Push Code 1)
  WebhookService.dispatch({
    partnerId: shop.partnerId,
    pushCode: 1,
    shopId: shop.shopId,
    payload: {
      shop_id: Number(shop.shopId),
      code: 1,
      timestamp: Math.floor(Date.now() / 1000),
      data: {
        shop_id: Number(shop.shopId),
        success: 1
      }
    }
  }).catch(err => console.warn("[WebhookTrigger] shop_authorization_push delivery failed:", err.message));

  res.json(createShopeeSuccessResponse({
    access_token: accessToken,
    refresh_token: refreshToken,
    expire_in: expireIn,
    shop_id_list: [Number(shop.shopId)],
    merchant_id_list: [],
    supplier_id_list: [],
    user_id_list: []
  }));
});

// ============================================================================
// 3. TOKEN REFRESH: POST /api/v2/auth/access_token/get
// ============================================================================
authRouter.post("/api/v2/auth/access_token/get", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const { refresh_token, partner_id, shop_id } = req.body || {};

  if (!refresh_token) {
    res.json(createShopeeErrorResponse("error_param", "Missing refresh_token in request body"));
    return;
  }

  const shop = await prisma.shop.findFirst({
    where: {
      refreshToken: refresh_token,
      partnerId: BigInt(partner_id)
    }
  });

  if (!shop || !shop.refreshTokenExpiresAt || shop.refreshTokenExpiresAt < new Date()) {
    res.json(createShopeeErrorResponse("error_auth", "Invalid or expired refresh_token."));
    return;
  }

  // Dual-Token Grace Period: preserve old token for 5 minutes (300 seconds)
  const oldAccessToken = shop.accessToken;
  const oldTokenExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

  const newAccessToken = crypto.randomBytes(16).toString("hex");
  const newRefreshToken = crypto.randomBytes(16).toString("hex");
  const expireIn = 14400;
  const accessTokenExpiresAt = new Date(Date.now() + expireIn * 1000);
  const refreshTokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await prisma.shop.update({
    where: { shopId: shop.shopId },
    data: {
      oldAccessToken,
      oldTokenExpiresAt,
      accessToken: newAccessToken,
      accessTokenExpiresAt,
      refreshToken: newRefreshToken,
      refreshTokenExpiresAt
    }
  });

  res.json(createShopeeSuccessResponse({
    access_token: newAccessToken,
    refresh_token: newRefreshToken,
    expire_in: expireIn,
    partner_id: Number(partner_id),
    shop_id: Number(shop.shopId)
  }));
});

// ============================================================================
// 4. GET SHOPS BY PARTNER: GET /api/v2/public/get_shops_by_partner
// ============================================================================
authRouter.get("/api/v2/public/get_shops_by_partner", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const partnerIdStr = req.query.partner_id as string;
  const pageSize = parseInt((req.query.page_size as string) || "50", 10);
  const pageNo = parseInt((req.query.page_no as string) || "1", 10);

  const partnerId = BigInt(partnerIdStr);
  const shops = await prisma.shop.findMany({
    where: { partnerId },
    skip: (pageNo - 1) * pageSize,
    take: pageSize
  });

  const authedShops = shops.map((s) => ({
    shop_id: Number(s.shopId),
    shop_name: s.shopName,
    region: s.region,
    status: s.status,
    auth_time: Math.floor(s.createdAt.getTime() / 1000),
    expire_time: s.authExpiresAt ? Math.floor(s.authExpiresAt.getTime() / 1000) : 0
  }));

  res.json(createShopeeSuccessResponse({
    authed_shops: authedShops,
    more: false,
    page_no: pageNo,
    page_size: pageSize
  }));
});
