import { Router, Request, Response } from "express";
import { prisma } from "../../common/prisma";
import { createShopeeSuccessResponse, createShopeeErrorResponse } from "../../common/utils/envelope";
import { shopeeAuthGuard } from "../../common/middleware/auth-guard";
import { PromotionStatus } from "@prisma/client";

export const voucherRouter = Router();

// Helper to keep voucher statuses in sync with the current time
async function syncVoucherStatuses(shopId: bigint): Promise<void> {
  const now = new Date();
  await prisma.voucher.updateMany({
    where: {
      shopId,
      status: PromotionStatus.UPCOMING,
      startTime: { lte: now },
      endTime: { gte: now }
    },
    data: { status: PromotionStatus.ONGOING }
  });

  await prisma.voucher.updateMany({
    where: {
      shopId,
      status: { in: [PromotionStatus.UPCOMING, PromotionStatus.ONGOING] },
      endTime: { lt: now }
    },
    data: { status: PromotionStatus.EXPIRED }
  });
}

function calculateVoucherStatus(startTime: Date, endTime: Date, currentStatus: PromotionStatus): PromotionStatus {
  if (currentStatus === PromotionStatus.DELETED) return PromotionStatus.DELETED;
  const now = new Date();
  if (now < startTime) return PromotionStatus.UPCOMING;
  if (now > endTime) return PromotionStatus.EXPIRED;
  return PromotionStatus.ONGOING;
}

// ============================================================================
// 1. ADD VOUCHER: POST /api/v2/voucher/add_voucher
// ============================================================================
voucherRouter.post("/api/v2/voucher/add_voucher", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  if (!shopIdStr) {
    res.json(createShopeeErrorResponse("error_param", "shop_id is required"));
    return;
  }
  const shopId = BigInt(shopIdStr);

  const shop = await prisma.shop.findUnique({ where: { shopId } });
  if (!shop) {
    res.json(createShopeeErrorResponse("error_param", "Shop not found"));
    return;
  }

  const {
    voucher_name,
    voucher_code,
    start_time,
    end_time,
    voucher_type = 1,
    reward_type = 1,
    usage_quantity = 1,
    min_basket_price = 0,
    discount_amount,
    percentage,
    max_price,
    display_channel_list,
    item_id_list,
    display_start_time
  } = req.body || {};

  if (!voucher_name || typeof voucher_name !== "string" || voucher_name.trim().length === 0) {
    res.json(createShopeeErrorResponse("error_param", "voucher_name is required"));
    return;
  }

  if (!voucher_code || typeof voucher_code !== "string") {
    res.json(createShopeeErrorResponse("error_param", "voucher_code is required"));
    return;
  }

  // Validate voucher_code: 1-5 chars [A-Za-z0-9]
  const cleanCode = voucher_code.trim();
  const codeRegex = /^[A-Za-z0-9]{1,5}$/;
  if (!codeRegex.test(cleanCode)) {
    res.json(createShopeeErrorResponse(
      "voucher.voucher_code_error",
      "Voucher code doesn't meet the requirement. Only support 0-9 or A-Z or a-z. Up to 5 characters."
    ));
    return;
  }

  // Validate unique code per shop
  const existingCode = await prisma.voucher.findFirst({
    where: {
      shopId,
      voucherCode: cleanCode,
      status: { not: PromotionStatus.DELETED }
    }
  });

  if (existingCode) {
    res.json(createShopeeErrorResponse("voucher.voucher_code_duplicate_error", "Duplicated voucher code."));
    return;
  }

  if (start_time === undefined || end_time === undefined) {
    res.json(createShopeeErrorResponse("error_param", "start_time and end_time are required"));
    return;
  }

  const startTimeNum = Number(start_time);
  const endTimeNum = Number(end_time);

  if (endTimeNum <= startTimeNum) {
    res.json(createShopeeErrorResponse("error_param", "end_time must be later than start_time"));
    return;
  }

  // Check valid duration <= 3 months (approx 93 days = 8,035,200 sec)
  const maxDurationSec = 93 * 24 * 3600;
  if (endTimeNum - startTimeNum > maxDurationSec) {
    res.json(createShopeeErrorResponse("voucher.voucher_end_time_error", "Voucher valid period can not be longer than 3 months."));
    return;
  }

  const minBasketPriceNum = Number(min_basket_price || 0);

  // For fix_amount voucher: min_basket_price must be > fix_amount if min_basket_price > 0
  if (Number(reward_type) === 1) {
    const fixAmountNum = Number(discount_amount || 0);
    if (minBasketPriceNum > 0 && fixAmountNum >= minBasketPriceNum) {
      res.json(createShopeeErrorResponse(
        "voucher.voucher_min_price_error",
        "Min_basket_price must be higher than the fix amount if Min_basket_price is not 0."
      ));
      return;
    }
  }

  // Max 1000 vouchers per shop
  await syncVoucherStatuses(shopId);
  const activeVoucherCount = await prisma.voucher.count({
    where: {
      shopId,
      status: { in: [PromotionStatus.UPCOMING, PromotionStatus.ONGOING] }
    }
  });

  if (activeVoucherCount >= 1000) {
    res.json(createShopeeErrorResponse("voucher.voucher_over_limit", "The total number of ongoing voucher and upcoming voucher cannot exceed 1000."));
    return;
  }

  const nowSec = Math.floor(Date.now() / 1000);
  let initialStatus: PromotionStatus = PromotionStatus.UPCOMING;
  if (nowSec >= startTimeNum && nowSec <= endTimeNum) {
    initialStatus = PromotionStatus.ONGOING;
  } else if (nowSec > endTimeNum) {
    initialStatus = PromotionStatus.EXPIRED;
  }

  const voucher = await prisma.voucher.create({
    data: {
      shopId,
      voucherCode: cleanCode,
      voucherName: voucher_name.trim(),
      voucherType: Number(voucher_type),
      rewardType: Number(reward_type),
      usageQuantity: Math.max(1, Number(usage_quantity)),
      currentUsage: 0,
      minBasketPrice: minBasketPriceNum,
      discountAmount: discount_amount !== undefined ? Number(discount_amount) : null,
      percentage: percentage !== undefined ? Number(percentage) : null,
      maxPrice: max_price !== undefined ? Number(max_price) : null,
      displayChannelList: Array.isArray(display_channel_list) ? display_channel_list : [1],
      displayStartTime: display_start_time ? new Date(Number(display_start_time) * 1000) : null,
      startTime: new Date(startTimeNum * 1000),
      endTime: new Date(endTimeNum * 1000),
      status: initialStatus
    }
  });

  // Attach items if product voucher
  if (Number(voucher_type) === 2 && Array.isArray(item_id_list) && item_id_list.length > 0) {
    for (const itemId of item_id_list) {
      await prisma.voucherItem.create({
        data: {
          voucherId: voucher.voucherId,
          itemId: BigInt(itemId)
        }
      }).catch(err => console.warn("Failed to attach voucher item:", err.message));
    }
  }

  res.json(createShopeeSuccessResponse({
    voucher_id: Number(voucher.voucherId)
  }));
});

// ============================================================================
// 2. GET VOUCHER LIST: GET /api/v2/voucher/get_voucher_list
// ============================================================================
voucherRouter.get("/api/v2/voucher/get_voucher_list", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  await syncVoucherStatuses(shopId);

  const statusParam = ((req.query.status as string) || (req.body?.status as string) || "all").toLowerCase();
  const pageNo = Math.max(1, parseInt((req.query.page_no as string) || (req.body?.page_no as string) || "1", 10));
  const pageSize = Math.min(100, Math.max(1, parseInt((req.query.page_size as string) || (req.body?.page_size as string) || "20", 10)));
  const offset = (pageNo - 1) * pageSize;

  const whereClause: any = {
    shopId,
    status: { not: PromotionStatus.DELETED }
  };

  if (statusParam === "upcoming") {
    whereClause.status = PromotionStatus.UPCOMING;
  } else if (statusParam === "ongoing") {
    whereClause.status = PromotionStatus.ONGOING;
  } else if (statusParam === "expired") {
    whereClause.status = PromotionStatus.EXPIRED;
  }

  const [total, vouchers] = await Promise.all([
    prisma.voucher.count({ where: whereClause }),
    prisma.voucher.findMany({
      where: whereClause,
      skip: offset,
      take: pageSize,
      orderBy: { createdAt: "desc" }
    })
  ]);

  const more = offset + vouchers.length < total;

  const voucherList = vouchers.map(v => ({
    voucher_id: Number(v.voucherId),
    voucher_code: v.voucherCode,
    voucher_name: v.voucherName,
    voucher_type: v.voucherType,
    reward_type: v.rewardType,
    usage_quantity: v.usageQuantity,
    current_usage: v.currentUsage,
    start_time: Math.floor(v.startTime.getTime() / 1000),
    end_time: Math.floor(v.endTime.getTime() / 1000),
    is_admin: v.isAdmin,
    voucher_purpose: v.voucherPurpose,
    discount_amount: v.discountAmount ? Number(v.discountAmount) : 0,
    percentage: v.percentage || 0,
    display_start_time: v.displayStartTime ? Math.floor(v.displayStartTime.getTime() / 1000) : 0
  }));

  res.json(createShopeeSuccessResponse({
    more,
    voucher_list: voucherList
  }));
});

// ============================================================================
// 3. GET VOUCHER DETAIL: GET /api/v2/voucher/get_voucher
// ============================================================================
voucherRouter.get("/api/v2/voucher/get_voucher", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const voucherIdParam = req.query.voucher_id || req.body?.voucher_id;
  if (!voucherIdParam) {
    res.json(createShopeeErrorResponse("error_param", "voucher_id is required"));
    return;
  }

  const voucherId = BigInt(voucherIdParam as string);
  await syncVoucherStatuses(shopId);

  const voucher = await prisma.voucher.findUnique({
    where: { voucherId },
    include: { items: true }
  });

  if (!voucher || voucher.shopId !== shopId || voucher.status === PromotionStatus.DELETED) {
    res.json(createShopeeErrorResponse("error_param", "Voucher not found"));
    return;
  }

  const responseObj: any = {
    voucher_id: Number(voucher.voucherId),
    voucher_code: voucher.voucherCode,
    voucher_name: voucher.voucherName,
    voucher_type: voucher.voucherType,
    reward_type: voucher.rewardType,
    usage_quantity: voucher.usageQuantity,
    current_usage: voucher.currentUsage,
    start_time: Math.floor(voucher.startTime.getTime() / 1000),
    end_time: Math.floor(voucher.endTime.getTime() / 1000),
    is_admin: voucher.isAdmin,
    voucher_purpose: voucher.voucherPurpose,
    display_channel_list: voucher.displayChannelList || [1],
    min_basket_price: Number(voucher.minBasketPrice),
    display_start_time: voucher.displayStartTime ? Math.floor(voucher.displayStartTime.getTime() / 1000) : 0
  };

  if (voucher.discountAmount !== null) {
    responseObj.discount_amount = Number(voucher.discountAmount);
  }
  if (voucher.percentage !== null) {
    responseObj.percentage = voucher.percentage;
  }
  if (voucher.maxPrice !== null) {
    responseObj.max_price = Number(voucher.maxPrice);
  }
  if (voucher.voucherType === 2) {
    responseObj.item_id_list = voucher.items.map(it => Number(it.itemId));
  }

  res.json(createShopeeSuccessResponse(responseObj));
});

// ============================================================================
// 4. UPDATE VOUCHER: POST /api/v2/voucher/update_voucher
// ============================================================================
voucherRouter.post("/api/v2/voucher/update_voucher", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const {
    voucher_id,
    voucher_name,
    start_time,
    end_time,
    usage_quantity,
    min_basket_price,
    discount_amount,
    percentage,
    max_price,
    display_channel_list,
    item_id_list,
    display_start_time
  } = req.body || {};

  if (!voucher_id) {
    res.json(createShopeeErrorResponse("error_param", "voucher_id is required"));
    return;
  }

  const voucherId = BigInt(voucher_id);
  const voucher = await prisma.voucher.findUnique({ where: { voucherId } });

  if (!voucher || voucher.shopId !== shopId || voucher.status === PromotionStatus.DELETED) {
    res.json(createShopeeErrorResponse("error_param", "Voucher not found"));
    return;
  }

  const currentStatus = calculateVoucherStatus(voucher.startTime, voucher.endTime, voucher.status);
  const updateData: any = {};

  if (voucher_name && typeof voucher_name === "string" && voucher_name.trim().length > 0) {
    updateData.voucherName = voucher_name.trim();
  }

  if (start_time !== undefined) {
    if (currentStatus !== PromotionStatus.UPCOMING) {
      res.json(createShopeeErrorResponse("voucher.voucher_ongoing_param_error", "Only limited fields can be modified when the voucher is ongoing."));
      return;
    }
    updateData.startTime = new Date(Number(start_time) * 1000);
  }

  if (end_time !== undefined) {
    updateData.endTime = new Date(Number(end_time) * 1000);
  }

  if (usage_quantity !== undefined) {
    updateData.usageQuantity = Math.max(1, Number(usage_quantity));
  }

  if (min_basket_price !== undefined) {
    updateData.minBasketPrice = Number(min_basket_price);
  }

  if (discount_amount !== undefined) {
    updateData.discountAmount = Number(discount_amount);
  }

  if (percentage !== undefined) {
    updateData.percentage = Number(percentage);
  }

  if (max_price !== undefined) {
    updateData.maxPrice = Number(max_price);
  }

  if (Array.isArray(display_channel_list)) {
    updateData.displayChannelList = display_channel_list;
  }

  if (display_start_time !== undefined) {
    updateData.displayStartTime = display_start_time ? new Date(Number(display_start_time) * 1000) : null;
  }

  await prisma.voucher.update({
    where: { voucherId },
    data: updateData
  });

  if (voucher.voucherType === 2 && Array.isArray(item_id_list)) {
    await prisma.voucherItem.deleteMany({ where: { voucherId } });
    for (const itemId of item_id_list) {
      await prisma.voucherItem.create({
        data: {
          voucherId,
          itemId: BigInt(itemId)
        }
      }).catch(err => console.warn("Failed to update voucher item:", err.message));
    }
  }

  res.json(createShopeeSuccessResponse({
    voucher_id: Number(voucherId)
  }));
});

// ============================================================================
// 5. DELETE VOUCHER: POST /api/v2/voucher/delete_voucher
// ============================================================================
voucherRouter.post("/api/v2/voucher/delete_voucher", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const { voucher_id } = req.body || {};
  if (!voucher_id) {
    res.json(createShopeeErrorResponse("error_param", "voucher_id is required"));
    return;
  }

  const voucherId = BigInt(voucher_id);
  const voucher = await prisma.voucher.findUnique({ where: { voucherId } });

  if (!voucher || voucher.shopId !== shopId || voucher.status === PromotionStatus.DELETED) {
    res.json(createShopeeErrorResponse("error_param", "Voucher not found"));
    return;
  }

  const currentStatus = calculateVoucherStatus(voucher.startTime, voucher.endTime, voucher.status);

  // Shopee rule: Only UPCOMING vouchers can be deleted
  if (currentStatus !== PromotionStatus.UPCOMING) {
    res.json(createShopeeErrorResponse("voucher.delete_voucher_error", "Can only delete upcoming voucher."));
    return;
  }

  await prisma.voucher.update({
    where: { voucherId },
    data: { status: PromotionStatus.DELETED }
  });

  res.json(createShopeeSuccessResponse({
    voucher_id: Number(voucherId)
  }));
});

// ============================================================================
// 6. END VOUCHER: POST /api/v2/voucher/end_voucher
// ============================================================================
voucherRouter.post("/api/v2/voucher/end_voucher", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const { voucher_id } = req.body || {};
  if (!voucher_id) {
    res.json(createShopeeErrorResponse("error_param", "voucher_id is required"));
    return;
  }

  const voucherId = BigInt(voucher_id);
  const voucher = await prisma.voucher.findUnique({ where: { voucherId } });

  if (!voucher || voucher.shopId !== shopId || voucher.status === PromotionStatus.DELETED) {
    res.json(createShopeeErrorResponse("error_param", "Voucher not found"));
    return;
  }

  const currentStatus = calculateVoucherStatus(voucher.startTime, voucher.endTime, voucher.status);

  // Shopee rule: Can only end ongoing voucher
  if (currentStatus !== PromotionStatus.ONGOING) {
    res.json(createShopeeErrorResponse("voucher.end_voucher_status_error", "Can only end the ongoing voucher."));
    return;
  }

  const now = new Date();
  await prisma.voucher.update({
    where: { voucherId },
    data: {
      status: PromotionStatus.EXPIRED,
      endTime: now
    }
  });

  res.json(createShopeeSuccessResponse({
    voucher_id: Number(voucherId)
  }));
});

// ============================================================================
// 7. PUBLIC SIMULATOR VOUCHER VALIDATE: POST /api/v2/simulator/voucher/validate
// ============================================================================
voucherRouter.post("/api/v2/simulator/voucher/validate", async (req: Request, res: Response): Promise<void> => {
  try {
    const { voucher_code, shop_id, basket_amount = 0 } = req.body || {};
    if (!voucher_code) {
      res.json(createShopeeErrorResponse("error_param", "Missing voucher_code"));
      return;
    }

    const now = new Date();
    const whereClause: any = {
      voucherCode: voucher_code.trim(),
      status: { not: PromotionStatus.DELETED },
      startTime: { lte: now },
      endTime: { gte: now }
    };
    if (shop_id) {
      whereClause.shopId = BigInt(shop_id);
    }

    const voucher = await prisma.voucher.findFirst({
      where: whereClause,
      include: { shop: true }
    });

    if (!voucher) {
      res.json(createShopeeErrorResponse("error_not_found", "Voucher is invalid or has expired"));
      return;
    }

    const minBasket = Number(voucher.minBasketPrice);
    const basket = Number(basket_amount);
    if (basket < minBasket) {
      res.json(createShopeeErrorResponse("error_business", `Minimum spend of ${minBasket} VND not reached`));
      return;
    }

    let discountAmount = 0;
    if (voucher.rewardType === 1 || voucher.discountAmount) {
      discountAmount = Math.min(Number(voucher.discountAmount || 0), basket);
    } else if (voucher.percentage) {
      const computed = (basket * Number(voucher.percentage)) / 100;
      discountAmount = voucher.maxPrice ? Math.min(computed, Number(voucher.maxPrice)) : computed;
    }

    res.json(createShopeeSuccessResponse({
      valid: true,
      voucher_id: Number(voucher.voucherId),
      voucher_code: voucher.voucherCode,
      voucher_name: voucher.voucherName,
      voucher_type: voucher.voucherType,
      discount_amount: Math.round(discountAmount),
      shop_id: Number(voucher.shopId),
      shop_name: voucher.shop.shopName,
      min_basket_price: minBasket
    }));
  } catch (err: any) {
    res.status(500).json(createShopeeErrorResponse("error_server", err.message));
  }
});
