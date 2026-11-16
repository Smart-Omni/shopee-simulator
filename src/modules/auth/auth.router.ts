import { Router, Request, Response } from "express";
import * as crypto from "crypto";
import { prisma } from "../../common/prisma";
import { createShopeeSuccessResponse, createShopeeErrorResponse } from "../../common/utils/envelope";
import { shopeeAuthGuard } from "../../common/middleware/auth-guard";
import { WebhookService } from "../webhook/webhook.service";
import { verifyPassword } from "../../common/utils/password";
import { BuyerUser, Shop } from "@prisma/client";

export const authRouter = Router();

// ============================================================================
// HELPER: Cookie Parser & HTML Renderers
// ============================================================================
function parseCookies(req: Request): Record<string, string> {
  const header = req.headers.cookie;
  if (!header) return {};
  const cookies: Record<string, string> = {};
  header.split(";").forEach((pair) => {
    const idx = pair.indexOf("=");
    if (idx > -1) {
      const key = pair.slice(0, idx).trim();
      const val = pair.slice(idx + 1).trim();
      try {
        cookies[key] = decodeURIComponent(val);
      } catch {
        cookies[key] = val;
      }
    }
  });
  return cookies;
}

function renderLoginScreen(params: {
  partnerId: string;
  redirectUri: string;
  state: string;
  appName: string;
  errorMessage?: string;
  shops: Array<{ shopId: bigint; shopName: string; username: string }>;
}): string {
  const { partnerId, redirectUri, state, appName, errorMessage, shops } = params;

  const quickLoginCards = shops
    .map(
      (s) => `
      <form method="POST" action="/api/v2/shop/auth_partner/login" style="margin: 0;">
        <input type="hidden" name="partner_id" value="${partnerId}" />
        <input type="hidden" name="redirect_uri" value="${redirectUri}" />
        <input type="hidden" name="state" value="${state}" />
        <input type="hidden" name="auto_select_shop_id" value="${s.shopId.toString()}" />
        <div class="quick-shop-card">
          <div class="quick-shop-info">
            <div class="quick-shop-name">${s.shopName}</div>
            <div class="quick-shop-meta">Shop ID: <strong>${s.shopId}</strong> &bull; User: <code>${s.username}</code></div>
          </div>
          <button type="submit" class="btn-select">Chọn Shop</button>
        </div>
      </form>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Đăng nhập Kênh Người Bán Shopee</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background: #f6f6f6; margin: 0; padding: 24px 16px; color: #333; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
          .header-bar { width: 100%; max-width: 480px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
          .shopee-brand { display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: bold; color: #ee4d2d; text-decoration: none; }
          .shopee-icon { width: 34px; height: 34px; background: #ee4d2d; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold; }
          .card { background: white; padding: 32px; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); width: 100%; max-width: 480px; }
          h2 { margin: 0 0 8px; font-size: 20px; color: #222; }
          p.subtitle { margin: 0 0 20px; font-size: 13.5px; color: #666; line-height: 1.45; }
          .alert-error { background: #fff2f0; border: 1px solid #ffccc7; color: #cf1322; padding: 10px 14px; border-radius: 6px; font-size: 13px; margin-bottom: 18px; }
          .form-group { margin-bottom: 14px; text-align: left; }
          label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #444; }
          input[type="text"], input[type="password"] { width: 100%; padding: 10px 12px; border: 1px solid #d9d9d9; border-radius: 4px; font-size: 14px; outline: none; transition: border-color .2s; }
          input[type="text"]:focus, input[type="password"]:focus { border-color: #ee4d2d; }
          .btn-primary { background: #ee4d2d; color: white; border: none; padding: 12px; width: 100%; border-radius: 4px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background .2s; margin-top: 6px; }
          .btn-primary:hover { background: #d03e20; }
          .divider { display: flex; align-items: center; text-align: center; margin: 24px 0 16px; color: #999; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
          .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid #eee; }
          .divider::before { margin-right: 10px; }
          .divider::after { margin-left: 10px; }
          .quick-shop-card { display: flex; align-items: center; justify-content: space-between; background: #fafafa; border: 1px solid #e8e8e8; border-radius: 6px; padding: 10px 14px; margin-bottom: 10px; transition: border-color .15s, background .15s; }
          .quick-shop-card:hover { border-color: #ee4d2d; background: #fffaf9; }
          .quick-shop-info { text-align: left; }
          .quick-shop-name { font-size: 13.5px; font-weight: 600; color: #222; }
          .quick-shop-meta { font-size: 12px; color: #777; margin-top: 2px; }
          .quick-shop-meta strong { color: #ee4d2d; }
          .btn-select { background: white; border: 1px solid #ee4d2d; color: #ee4d2d; font-size: 12.5px; font-weight: 600; padding: 6px 12px; border-radius: 4px; cursor: pointer; transition: all .15s; white-space: nowrap; }
          .btn-select:hover { background: #ee4d2d; color: white; }
          .footer-note { margin-top: 20px; font-size: 12px; color: #999; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header-bar">
          <div class="shopee-brand">
            <div class="shopee-icon">S</div>
            <span>Kênh Người Bán Shopee</span>
          </div>
          <span style="font-size: 12px; color: #888; background: #eee; padding: 3px 8px; border-radius: 4px;">Mock Simulator</span>
        </div>

        <div class="card">
          <h2>Đăng nhập để ủy quyền</h2>
          <p class="subtitle">Ứng dụng <strong>${appName}</strong> đang yêu cầu liên kết với tài khoản Shop của bạn.</p>

          ${errorMessage ? `<div class="alert-error">${errorMessage}</div>` : ""}

          <form method="POST" action="/api/v2/shop/auth_partner/login">
            <input type="hidden" name="partner_id" value="${partnerId}" />
            <input type="hidden" name="redirect_uri" value="${redirectUri}" />
            <input type="hidden" name="state" value="${state}" />

            <div class="form-group">
              <label for="identity">Tên đăng nhập / Email / Số điện thoại</label>
              <input type="text" id="identity" name="identity" placeholder="Ví dụ: seller, hanoiseller..." required />
            </div>

            <div class="form-group">
              <label for="password">Mật khẩu</label>
              <input type="password" id="password" name="password" placeholder="Mật khẩu mặc định: Shopiz@123" required />
            </div>

            <button type="submit" class="btn-primary">Đăng nhập và Tiếp tục</button>
          </form>

          <div class="divider">Hoặc chọn nhanh Shop thử nghiệm</div>

          <div class="quick-shops">
            ${quickLoginCards}
          </div>
        </div>

        <div class="footer-note">
          Shopee Open Platform Simulator &bull; SmartOmni Multi-tenant Partner Integration
        </div>
      </body>
    </html>
  `;
}

function renderConsentScreen(params: {
  partnerId: string;
  redirectUri: string;
  state: string;
  appName: string;
  shop: Shop;
  user: BuyerUser;
}): string {
  const { partnerId, redirectUri, state, appName, shop, user } = params;

  const cancelUrl = new URL(redirectUri);
  cancelUrl.searchParams.set("error", "access_denied");
  cancelUrl.searchParams.set("error_description", "User denied authorization");
  if (state) cancelUrl.searchParams.set("state", state);

  const switchAccountUrl = `/api/v2/shop/auth_partner?partner_id=${encodeURIComponent(
    partnerId
  )}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}&action=switch`;

  return `
    <!DOCTYPE html>
    <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shopee Open Platform - Ủy quyền ứng dụng</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background: #f6f6f6; margin: 0; padding: 24px 16px; color: #333; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
          .header-bar { width: 100%; max-width: 480px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
          .shopee-brand { display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: bold; color: #ee4d2d; text-decoration: none; }
          .shopee-icon { width: 34px; height: 34px; background: #ee4d2d; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold; }
          .card { background: white; padding: 32px; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); width: 100%; max-width: 480px; }
          h2 { margin: 0 0 8px; font-size: 20px; color: #222; }
          p.desc { margin: 0 0 18px; font-size: 13.5px; color: #666; line-height: 1.5; }
          .shop-info-box { background: #fffaf9; border: 1px solid #ffd8d2; border-radius: 6px; padding: 14px 16px; margin-bottom: 18px; text-align: left; }
          .shop-info-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; }
          .shop-info-row:last-child { margin-bottom: 0; }
          .shop-info-label { color: #777; }
          .shop-info-value { font-weight: 600; color: #222; }
          .switch-row { margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ffd8d2; text-align: right; }
          .switch-link { color: #ee4d2d; font-size: 12.5px; text-decoration: none; font-weight: 600; }
          .switch-link:hover { text-decoration: underline; }
          .permissions-box { background: #fafafa; border: 1px solid #eee; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px; text-align: left; }
          .permissions-title { font-size: 12px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
          .permission-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #444; margin-bottom: 6px; }
          .permission-item:last-child { margin-bottom: 0; }
          .check-icon { color: #52c41a; font-weight: bold; }
          .btn-primary { background: #ee4d2d; color: white; border: none; padding: 12px 20px; width: 100%; border-radius: 4px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background .2s; }
          .btn-primary:hover { background: #d03e20; }
          .btn-secondary { display: block; text-align: center; color: #888; text-decoration: none; font-size: 13.5px; margin-top: 12px; padding: 8px; border-radius: 4px; }
          .btn-secondary:hover { color: #444; }
          .footer-note { margin-top: 20px; font-size: 12px; color: #999; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header-bar">
          <div class="shopee-brand">
            <div class="shopee-icon">S</div>
            <span>Shopee Open Platform</span>
          </div>
          <span style="font-size: 12px; color: #888; background: #eee; padding: 3px 8px; border-radius: 4px;">Mock Server</span>
        </div>

        <div class="card">
          <h2>Ủy quyền cho Ứng dụng</h2>
          <p class="desc">
            Ứng dụng <strong>${appName}</strong> (Partner ID: <code>${partnerId}</code>) yêu cầu quyền truy cập dữ liệu để quản lý gian hàng của bạn.
          </p>

          <div class="shop-info-box">
            <div class="shop-info-row">
              <span class="shop-info-label">Tên gian hàng:</span>
              <span class="shop-info-value">${shop.shopName}</span>
            </div>
            <div class="shop-info-row">
              <span class="shop-info-label">Mã Shop (Shop ID):</span>
              <span class="shop-info-value" style="color: #ee4d2d;">${shop.shopId}</span>
            </div>
            <div class="shop-info-row">
              <span class="shop-info-label">Khu vực:</span>
              <span class="shop-info-value">${shop.region}</span>
            </div>
            <div class="shop-info-row">
              <span class="shop-info-label">Tài khoản đang đăng nhập:</span>
              <span class="shop-info-value">${user.name} (@${user.username})</span>
            </div>
            <div class="shop-info-row">
              <span class="shop-info-label">Thời hạn ủy quyền:</span>
              <span class="shop-info-value">365 Ngày (1 năm)</span>
            </div>
            <div class="switch-row">
              <a href="${switchAccountUrl}" class="switch-link">⇄ Đổi tài khoản Shop khác</a>
            </div>
          </div>

          <div class="permissions-box">
            <div class="permissions-title">Danh sách quyền yêu cầu</div>
            <div class="permission-item"><span class="check-icon">✓</span> Đồng bộ & quản lý danh mục sản phẩm</div>
            <div class="permission-item"><span class="check-icon">✓</span> Tiếp nhận và cập nhật trạng thái đơn hàng</div>
            <div class="permission-item"><span class="check-icon">✓</span> Xử lý khiếu nại, trả hàng và hoàn tiền</div>
            <div class="permission-item"><span class="check-icon">✓</span> Đồng bộ tồn kho và giá bán đa kênh</div>
          </div>

          <form method="POST" action="/api/v2/shop/auth_partner/confirm">
            <input type="hidden" name="partner_id" value="${partnerId}" />
            <input type="hidden" name="redirect_uri" value="${redirectUri}" />
            <input type="hidden" name="state" value="${state}" />
            <input type="hidden" name="shop_id" value="${shop.shopId.toString()}" />

            <button type="submit" class="btn-primary">Xác nhận Ủy quyền</button>
          </form>

          <a href="${cancelUrl.toString()}" class="btn-secondary">Hủy bỏ và quay lại</a>
        </div>

        <div class="footer-note">
          Shopee Open Platform Simulator &bull; SmartOmni Partner Authorization
        </div>
      </body>
    </html>
  `;
}

// ============================================================================
// 1. MOCK SELLER OAUTH AUTHORIZATION SCREEN / REDIRECT
// ============================================================================
authRouter.get(["/auth", "/api/v2/shop/auth_partner"], async (req: Request, res: Response) => {
  const partnerIdStr = (req.query.partner_id as string) || "";
  const redirectUri = (req.query.redirect_uri as string) || (req.query.redirect as string) || "";
  const state = (req.query.state as string) || "";
  const autoConfirm = req.query.auto_confirm === "true";
  const action = (req.query.action as string) || "";
  const errorParam = (req.query.error as string) || "";

  if (!partnerIdStr || !redirectUri) {
    res.status(400).send("<h3>Missing partner_id or redirect_uri parameters</h3>");
    return;
  }

  const partnerId = BigInt(partnerIdStr);
  const partner = await prisma.partner.findUnique({
    where: { partnerId },
    include: { shops: { orderBy: { shopId: "asc" } } }
  });

  if (!partner) {
    res.status(400).send(`<h3>Invalid partner_id: ${partnerIdStr}</h3>`);
    return;
  }

  // Handle Cancel action directly
  if (action === "cancel") {
    const cancelUrl = new URL(redirectUri);
    cancelUrl.searchParams.set("error", "access_denied");
    cancelUrl.searchParams.set("error_description", "User denied authorization");
    if (state) cancelUrl.searchParams.set("state", state);
    res.redirect(302, cancelUrl.toString());
    return;
  }

  // Backward-compatibility: auto_confirm bypasses UI immediately (for automated test suites)
  const requestedShopIdStr = req.query.shop_id as string | undefined;
  if (autoConfirm) {
    let shop = requestedShopIdStr
      ? partner.shops.find((s) => String(s.shopId) === requestedShopIdStr)
      : partner.shops[0];
    if (!shop) {
      shop = partner.shops[0] || (await prisma.shop.findFirst({ orderBy: { shopId: "asc" } }));
    }
    if (!shop) {
      res.status(500).send("<h3>No shops found for partner</h3>");
      return;
    }

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
    res.redirect(302, callbackUrl.toString());
    return;
  }

  // Check if seller requested to switch account or log out
  if (action === "switch" || action === "logout") {
    res.setHeader("Set-Cookie", "shopee_seller_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT");
  }

  // Query demo seller accounts for 1-click test shop selection
  const sellerUsers = await prisma.buyerUser.findMany({
    where: { role: "seller", shopId: { not: null } },
    orderBy: { id: "asc" }
  });

  const demoShops: Array<{ shopId: bigint; shopName: string; username: string }> = [];
  for (const u of sellerUsers) {
    if (u.shopId) {
      const s = partner.shops.find((ps) => ps.shopId === u.shopId) ||
        (await prisma.shop.findUnique({ where: { shopId: u.shopId } }));
      if (s) {
        demoShops.push({ shopId: s.shopId, shopName: s.shopName, username: u.username });
      }
    }
  }

  // If user switched account, display login screen
  if (action === "switch" || action === "logout") {
    res.send(
      renderLoginScreen({
        partnerId: partnerIdStr,
        redirectUri,
        state,
        appName: partner.appName,
        shops: demoShops
      })
    );
    return;
  }

  // Determine authenticated seller session
  const cookies = parseCookies(req);
  let loggedInUser: BuyerUser | null = null;
  let loggedInShop: Shop | null = null;

  if (cookies.shopee_seller_id) {
    try {
      const userId = BigInt(cookies.shopee_seller_id);
      const user = await prisma.buyerUser.findUnique({ where: { id: userId } });
      if (user && user.role === "seller" && user.shopId) {
        loggedInUser = user;
        loggedInShop =
          partner.shops.find((s) => s.shopId === user.shopId) ||
          (await prisma.shop.findUnique({ where: { shopId: user.shopId } }));
      }
    } catch {
      // Invalid cookie, ignore
    }
  }

  // If requestedShopIdStr is passed directly and no session cookie is set
  if (!loggedInShop && requestedShopIdStr) {
    const shop = partner.shops.find((s) => String(s.shopId) === requestedShopIdStr);
    if (shop) {
      loggedInShop = shop;
      loggedInUser = await prisma.buyerUser.findFirst({
        where: { shopId: shop.shopId, role: "seller" }
      });
    }
  }

  // If authenticated as a shop seller, render OAuth Consent Screen
  if (loggedInUser && loggedInShop) {
    res.send(
      renderConsentScreen({
        partnerId: partnerIdStr,
        redirectUri,
        state,
        appName: partner.appName,
        shop: loggedInShop,
        user: loggedInUser
      })
    );
    return;
  }

  // Otherwise, render Shopee Seller Centre Login Screen
  let errorMessage: string | undefined;
  if (errorParam === "invalid_credentials") {
    errorMessage = "Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.";
  }

  res.send(
    renderLoginScreen({
      partnerId: partnerIdStr,
      redirectUri,
      state,
      appName: partner.appName,
      errorMessage,
      shops: demoShops
    })
  );
});

// ============================================================================
// 1.1 SELLER OAUTH LOGIN HANDLER: POST /api/v2/shop/auth_partner/login
// ============================================================================
authRouter.post(
  ["/auth/login", "/api/v2/shop/auth_partner/login"],
  async (req: Request, res: Response): Promise<void> => {
    const { partner_id, redirect_uri, state, identity, password, auto_select_shop_id } = req.body || {};

    const redirectBack = (params: Record<string, string>) => {
      const url = new URL("/api/v2/shop/auth_partner", `http://${req.headers.host || "localhost"}`);
      if (partner_id) url.searchParams.set("partner_id", partner_id);
      if (redirect_uri) url.searchParams.set("redirect_uri", redirect_uri);
      if (state) url.searchParams.set("state", state);
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
      res.redirect(302, `${url.pathname}${url.search}`);
    };

    // 1-Click Quick Login by Shop ID
    if (auto_select_shop_id) {
      try {
        const targetShopId = BigInt(auto_select_shop_id);
        const user = await prisma.buyerUser.findFirst({
          where: { shopId: targetShopId, role: "seller" }
        });
        if (user) {
          res.setHeader("Set-Cookie", `shopee_seller_id=${user.id}; Path=/; HttpOnly; SameSite=Lax`);
          redirectBack({});
          return;
        }
      } catch {
        // Fall through to error
      }
    }

    // Standard credential authentication
    if (!identity || !password) {
      redirectBack({ error: "invalid_credentials" });
      return;
    }

    const cleanIdentity = String(identity).trim().toLowerCase();
    const cleanPhone = cleanIdentity.replace(/[\s().-]/g, "");

    const user = await prisma.buyerUser.findFirst({
      where: {
        role: "seller",
        OR: [
          { username: { equals: cleanIdentity, mode: "insensitive" } },
          { email: { equals: cleanIdentity, mode: "insensitive" } },
          { phone: cleanPhone }
        ]
      }
    });

    if (!user || !verifyPassword(password, user.passwordHash) || !user.shopId) {
      redirectBack({ error: "invalid_credentials" });
      return;
    }

    res.setHeader("Set-Cookie", `shopee_seller_id=${user.id}; Path=/; HttpOnly; SameSite=Lax`);
    redirectBack({});
  }
);

// ============================================================================
// 1.2 OAUTH CONFIRM AUTHORIZATION HANDLER: POST /api/v2/shop/auth_partner/confirm
// ============================================================================
authRouter.post(
  ["/auth/confirm", "/api/v2/shop/auth_partner/confirm"],
  async (req: Request, res: Response): Promise<void> => {
    const { partner_id, redirect_uri, state, shop_id } = req.body || {};

    if (!redirect_uri || !shop_id) {
      res.status(400).send("<h3>Missing redirect_uri or shop_id in confirmation</h3>");
      return;
    }

    const targetShopId = BigInt(shop_id);
    const shop = await prisma.shop.findUnique({ where: { shopId: targetShopId } });
    if (!shop) {
      res.status(404).send(`<h3>Shop ${shop_id} not found</h3>`);
      return;
    }

    // Generate single-use authorization code (10 min TTL)
    const authCode = crypto.randomBytes(16).toString("hex");
    const authCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.shop.update({
      where: { shopId: targetShopId },
      data: { authCode, authCodeExpiresAt }
    });

    const callbackUrl = new URL(redirect_uri);
    callbackUrl.searchParams.set("code", authCode);
    callbackUrl.searchParams.set("shop_id", targetShopId.toString());
    if (state) callbackUrl.searchParams.set("state", state);

    res.redirect(302, callbackUrl.toString());
  }
);

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
