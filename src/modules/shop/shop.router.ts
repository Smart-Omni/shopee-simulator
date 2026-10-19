import { Router, Request, Response } from "express";
import { prisma } from "../../common/prisma";
import { createShopeeSuccessResponse, createShopeeErrorResponse } from "../../common/utils/envelope";
import { shopeeAuthGuard } from "../../common/middleware/auth-guard";

export const shopRouter = Router();

// ============================================================================
// 1. GET SHOP INFO: GET /api/v2/shop/get_shop_info
// ============================================================================
shopRouter.get("/api/v2/shop/get_shop_info", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const shop = await prisma.shop.findUnique({
    where: { shopId }
  });

  if (!shop) {
    res.json(createShopeeErrorResponse("error_param", "Invalid shop_id"));
    return;
  }

  const authTime = Math.floor(shop.createdAt.getTime() / 1000);
  const expireTime = shop.authExpiresAt
    ? Math.floor(shop.authExpiresAt.getTime() / 1000)
    : authTime + 365 * 24 * 60 * 60;

  res.json(createShopeeSuccessResponse({
    shop_name: shop.shopName,
    region: shop.region,
    status: shop.status,
    is_cb: false,
    is_sip: false,
    is_upgraded_cbsc: false,
    auth_time: authTime,
    expire_time: expireTime,
    merchant_id: null,
    is_one_awb: true,
    shop_fulfillment_flag: "PFF - 3PF Shop",
    is_vacation: shop.isVacation
  }));
});

// ============================================================================
// 2. GET SHOP PROFILE: GET /api/v2/shop/get_profile
// ============================================================================
shopRouter.get("/api/v2/shop/get_profile", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const shop = await prisma.shop.findUnique({
    where: { shopId }
  });

  if (!shop) {
    res.json(createShopeeErrorResponse("error_param", "Invalid shop_id"));
    return;
  }

  res.json(createShopeeSuccessResponse({
    shop_name: shop.shopName,
    shop_logo: "https://cf.shopee.vn/file/shop_logo_default",
    description: "SmartOmni Official Store - Leading multi-category e-commerce partner."
  }));
});

// ============================================================================
// 3. SET SHOP HOLIDAY MODE: POST /api/v2/shop/set_shop_holiday_mode
// ============================================================================
shopRouter.post("/api/v2/shop/set_shop_holiday_mode", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);
  const { holiday_mode_on } = req.body || {};

  if (typeof holiday_mode_on !== "boolean") {
    res.json(createShopeeErrorResponse("error_param", "holiday_mode_on must be a boolean"));
    return;
  }

  const shop = await prisma.shop.findUnique({
    where: { shopId }
  });

  if (!shop) {
    res.json(createShopeeErrorResponse("error_param", "Invalid shop_id"));
    return;
  }

  await prisma.shop.update({
    where: { shopId },
    data: { isVacation: holiday_mode_on }
  });

  res.json(createShopeeSuccessResponse({
    debug_msg: ""
  }));
});

// ============================================================================
// 4. GET WAREHOUSE DETAIL: GET /api/v2/shop/get_warehouse_detail
// ============================================================================
shopRouter.get("/api/v2/shop/get_warehouse_detail", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const addresses = await prisma.shopAddress.findMany({
    where: { shopId }
  });

  const warehouseList = addresses.map((addr) => ({
    warehouse_id: Number(addr.addressId),
    warehouse_name: addr.name,
    address_type: addr.addressType,
    address: addr.address,
    city: addr.city,
    district: addr.district,
    state: addr.state,
    region: addr.region,
    zipcode: addr.zipcode
  }));

  res.json(createShopeeSuccessResponse({
    warehouse_list: warehouseList
  }));
});
