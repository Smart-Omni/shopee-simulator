import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma";
import { verifyShopeeSignature } from "../utils/crypto";
import { createShopeeErrorResponse } from "../utils/envelope";

export async function shopeeAuthGuard(req: Request, res: Response, next: NextFunction): Promise<void> {
  const query = req.query as Record<string, string | undefined>;
  const apiPath = req.path; // e.g. /api/v2/auth/token/get

  // 1. Check required common parameters
  const partnerIdStr = query.partner_id;
  const timestampStr = query.timestamp;
  const incomingSign = query.sign;
  const accessToken = query.access_token;
  const shopIdStr = query.shop_id;
  const merchantIdStr = query.merchant_id;

  if (!partnerIdStr) {
    res.json(createShopeeErrorResponse("error_param", "There is no partner_id in query."));
    return;
  }

  if (!timestampStr) {
    res.json(createShopeeErrorResponse("error_param", "no timestamp"));
    return;
  }

  if (!incomingSign) {
    res.json(createShopeeErrorResponse("error_param", "There is no sign in query."));
    return;
  }

  const partnerId = BigInt(partnerIdStr);
  const timestamp = parseInt(timestampStr, 10);

  // 2. Query simulator fault injection configuration
  const config = await prisma.simulatorConfig.findFirst({ where: { id: 1 } });
  
  if (config?.artificialDelayMs && config.artificialDelayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, config.artificialDelayMs));
  }

  if (config?.rateLimitEnabled) {
    res.status(429).json(createShopeeErrorResponse("error_rate_limit", "Too many requests. You have reached the rate limit."));
    return;
  }

  // 3. Check timestamp drift (5 minutes = 300 seconds)
  const strictTimestamp = config?.strictTimestamp ?? true;
  if (strictTimestamp) {
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - timestamp) > 300) {
      res.json(createShopeeErrorResponse("error_param", "Timestamp is expired."));
      return;
    }
  }

  // 4. Validate Partner existence
  const partner = await prisma.partner.findUnique({
    where: { partnerId }
  });

  if (!partner) {
    res.json(createShopeeErrorResponse("error_auth", "partner_id is invalid"));
    return;
  }

  // 5. Fault Injection: Force Invalid Sign
  if (config?.forceInvalidSign) {
    res.json(createShopeeErrorResponse("error_sign", "Wrong sign."));
    return;
  }

  // 6. Verify HMAC-SHA256 signature
  const isSignValid = verifyShopeeSignature(
    partner.partnerKey,
    partnerIdStr,
    apiPath,
    timestampStr,
    incomingSign,
    accessToken,
    shopIdStr,
    merchantIdStr
  );

  if (!isSignValid) {
    res.json(createShopeeErrorResponse("error_sign", "Wrong sign."));
    return;
  }

  // 7. If access_token and shop_id are passed (Shop API level)
  if (accessToken && shopIdStr) {
    if (config?.forceExpiredToken) {
      res.json(createShopeeErrorResponse("error_auth", "Invalid access_token."));
      return;
    }

    const shopId = BigInt(shopIdStr);
    const shop = await prisma.shop.findUnique({ where: { shopId } });

    if (!shop) {
      res.json(createShopeeErrorResponse("error_param", "Invalid shop_id"));
      return;
    }

    const now = new Date();
    const isCurrentValid = shop.accessToken === accessToken && (!shop.accessTokenExpiresAt || shop.accessTokenExpiresAt > now);
    const isGraceValid = shop.oldAccessToken === accessToken && shop.oldTokenExpiresAt && shop.oldTokenExpiresAt > now;

    if (!isCurrentValid && !isGraceValid) {
      res.json(createShopeeErrorResponse("error_auth", "Invalid access_token."));
      return;
    }
  }

  next();
}
