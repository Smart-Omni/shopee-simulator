import { Router, Request, Response } from "express";
import { prisma } from "../../common/prisma";
import { createShopeeSuccessResponse, createShopeeErrorResponse } from "../../common/utils/envelope";
import { shopeeAuthGuard } from "../../common/middleware/auth-guard";
import { WebhookService } from "../webhook/webhook.service";
import { PromotionStatus } from "@prisma/client";

export const discountRouter = Router();

// Helper to update out-of-date discount statuses in the database
async function syncDiscountStatuses(shopId: bigint): Promise<void> {
  const now = new Date();
  await prisma.discount.updateMany({
    where: {
      shopId,
      status: PromotionStatus.UPCOMING,
      startTime: { lte: now },
      endTime: { gte: now }
    },
    data: { status: PromotionStatus.ONGOING }
  });

  await prisma.discount.updateMany({
    where: {
      shopId,
      status: { in: [PromotionStatus.UPCOMING, PromotionStatus.ONGOING] },
      endTime: { lt: now }
    },
    data: { status: PromotionStatus.EXPIRED }
  });
}

// Helper to determine status dynamically based on current time
function calculatePromotionStatus(startTime: Date, endTime: Date, currentStatus: PromotionStatus): PromotionStatus {
  if (currentStatus === PromotionStatus.DELETED) return PromotionStatus.DELETED;
  const now = new Date();
  if (now < startTime) return PromotionStatus.UPCOMING;
  if (now > endTime) return PromotionStatus.EXPIRED;
  return PromotionStatus.ONGOING;
}

// ============================================================================
// 1. ADD DISCOUNT: POST /api/v2/discount/add_discount
// ============================================================================
discountRouter.post("/api/v2/discount/add_discount", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
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

  // Check Holiday Mode
  if (shop.isVacation) {
    res.json(createShopeeErrorResponse("discount.error_holiday_mode", "Cannot add discount as holiday mode is turned on"));
    return;
  }

  const { discount_name, start_time, end_time } = req.body || {};

  if (!discount_name || typeof discount_name !== "string" || discount_name.trim().length === 0) {
    res.json(createShopeeErrorResponse("error_param", "discount_name is required"));
    return;
  }

  if (start_time === undefined || end_time === undefined) {
    res.json(createShopeeErrorResponse("error_param", "start_time and end_time are required"));
    return;
  }

  const startTimeNum = Number(start_time);
  const endTimeNum = Number(end_time);
  const nowSec = Math.floor(Date.now() / 1000);

  // Validate start_time > now
  if (startTimeNum <= nowSec) {
    res.json(createShopeeErrorResponse("discount.discount_start_time_smaller_than_now", "Discount start time is less than the current time."));
    return;
  }

  // Validate end_time > start_time
  if (endTimeNum <= startTimeNum) {
    res.json(createShopeeErrorResponse("discount.discount_end_time_smaller_than_start_time", "Discount end time should later than start time."));
    return;
  }

  // Validate end_time >= start_time + 1 hour (3600 sec)
  if (endTimeNum - startTimeNum < 3600) {
    res.json(createShopeeErrorResponse("discount.discount_period_too_short", "The end time should be later than 1 hour of start time."));
    return;
  }

  // Validate duration <= 180 days (180 * 24 * 3600 = 15552000 sec)
  if (endTimeNum - startTimeNum > 180 * 24 * 3600) {
    res.json(createShopeeErrorResponse("discount.discount_period_too_long", "Promotion duration must be within 180 days."));
    return;
  }

  // Check max 1000 active discounts (UPCOMING + ONGOING)
  await syncDiscountStatuses(shopId);
  const activeCount = await prisma.discount.count({
    where: {
      shopId,
      status: { in: [PromotionStatus.UPCOMING, PromotionStatus.ONGOING] }
    }
  });

  if (activeCount >= 1000) {
    res.json(createShopeeErrorResponse("discount.exceed_max_discount_count", "The upcoming and ongoing discount cannot exceed 1000."));
    return;
  }

  const discount = await prisma.discount.create({
    data: {
      shopId,
      discountName: discount_name.trim(),
      startTime: new Date(startTimeNum * 1000),
      endTime: new Date(endTimeNum * 1000),
      status: PromotionStatus.UPCOMING,
      source: 0
    }
  });

  res.json(createShopeeSuccessResponse({
    discount_id: Number(discount.discountId)
  }));
});

// ============================================================================
// 2. ADD DISCOUNT ITEM: POST /api/v2/discount/add_discount_item
// ============================================================================
discountRouter.post("/api/v2/discount/add_discount_item", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const partnerIdStr = req.query.partner_id as string;
  const shopId = BigInt(shopIdStr);
  const partnerId = BigInt(partnerIdStr);

  const { discount_id, item_list } = req.body || {};
  if (!discount_id) {
    res.json(createShopeeErrorResponse("error_param", "discount_id is required"));
    return;
  }

  if (!Array.isArray(item_list) || item_list.length === 0) {
    res.json(createShopeeErrorResponse("error_param", "item_list is required"));
    return;
  }

  // Validate batch limit (max 50 items)
  if (item_list.length > 50) {
    res.json(createShopeeErrorResponse("error_param", "You can add at most 50 items per call."));
    return;
  }

  const discountId = BigInt(discount_id);
  const discount = await prisma.discount.findUnique({
    where: { discountId }
  });

  if (!discount || discount.shopId !== shopId) {
    res.json(createShopeeErrorResponse("error_param", "Discount not found for this shop"));
    return;
  }

  if (discount.status === PromotionStatus.DELETED) {
    res.json(createShopeeErrorResponse("discount.discount_is_end", "The discount cannot be updated or deleted."));
    return;
  }

  const currentStatus = calculatePromotionStatus(discount.startTime, discount.endTime, discount.status);

  let successCount = 0;
  const errorList: Array<{ item_id: number; model_id: number; fail_error: string; fail_message: string }> = [];

  for (const item of item_list) {
    const itemIdNum = Number(item.item_id);
    const itemId = BigInt(itemIdNum);
    const purchaseLimit = Math.max(0, Number(item.purchase_limit || 0));

    const product = await prisma.product.findUnique({
      where: { itemId },
      include: { models: true }
    });

    if (!product || product.shopId !== shopId) {
      errorList.push({
        item_id: itemIdNum,
        model_id: 0,
        fail_error: "discount.item_not_found",
        fail_message: "Item does not exist or does not belong to this shop"
      });
      continue;
    }

    const hasModels = product.models.length > 0;

    if (hasModels) {
      // Must have models in request
      const modelList = item.model_list;
      if (!Array.isArray(modelList) || modelList.length === 0) {
        errorList.push({
          item_id: itemIdNum,
          model_id: 0,
          fail_error: "discount.model_list_empty",
          fail_message: "model_list is required for items with variations"
        });
        continue;
      }

      let modelError = false;
      for (const m of modelList) {
        const modelId = BigInt(m.model_id);
        const targetModel = product.models.find(mod => mod.modelId === modelId);
        if (!targetModel) {
          errorList.push({
            item_id: itemIdNum,
            model_id: Number(m.model_id),
            fail_error: "discount.model_not_found",
            fail_message: "Variation model not found"
          });
          modelError = true;
          break;
        }

        const promoPrice = Number(m.model_promotion_price);
        const originalPrice = Number(targetModel.originalPrice);
        if (promoPrice <= 0 || promoPrice > originalPrice) {
          errorList.push({
            item_id: itemIdNum,
            model_id: Number(m.model_id),
            fail_error: "discount.invalid_promo_price",
            fail_message: `Promotion price (${promoPrice}) must be greater than 0 and less than or equal to original price (${originalPrice})`
          });
          modelError = true;
          break;
        }
      }

      if (modelError) continue;

      // Upsert discount item and models
      const discountItem = await prisma.discountItem.upsert({
        where: {
          discountId_itemId: {
            discountId,
            itemId
          }
        },
        create: {
          discountId,
          itemId,
          purchaseLimit,
          status: currentStatus
        },
        update: {
          purchaseLimit,
          status: currentStatus
        }
      });

      for (const m of modelList) {
        const modelId = BigInt(m.model_id);
        const promoPrice = Number(m.model_promotion_price);
        const promoStock = m.model_promotion_stock !== undefined ? Number(m.model_promotion_stock) : null;
        const targetModel = product.models.find(mod => mod.modelId === modelId)!;

        await prisma.discountItemModel.upsert({
          where: {
            discountItemId_modelId: {
              discountItemId: discountItem.id,
              modelId
            }
          },
          create: {
            discountItemId: discountItem.id,
            modelId,
            modelPromotionPrice: promoPrice,
            modelPromotionStock: promoStock,
            modelNormalStock: targetModel.sellerStock
          },
          update: {
            modelPromotionPrice: promoPrice,
            modelPromotionStock: promoStock,
            modelNormalStock: targetModel.sellerStock
          }
        });

        // Webhook Push Code 9: promotion_update_push (action: added_in_promo)
        WebhookService.dispatch({
          partnerId,
          pushCode: 9,
          shopId,
          payload: {
            shop_id: Number(shopId),
            code: 9,
            timestamp: Math.floor(Date.now() / 1000),
            data: {
              shop_id: Number(shopId),
              promotion_id: Number(discountId),
              promotion_type: "seller_discount",
              start_time: Math.floor(discount.startTime.getTime() / 1000),
              end_time: Math.floor(discount.endTime.getTime() / 1000),
              action: "added_in_promo",
              item_id: itemIdNum,
              variation_id: Number(m.model_id)
            }
          }
        }).catch(err => console.error("Webhook Push 9 error:", err));

        // If reserved stock is specified, dispatch Push Code 7 (item_promotion_push)
        if (promoStock !== null && promoStock > 0) {
          WebhookService.dispatch({
            partnerId,
            pushCode: 7,
            shopId,
            payload: {
              shop_id: Number(shopId),
              code: 7,
              timestamp: Math.floor(Date.now() / 1000),
              data: {
                shop_id: Number(shopId),
                item_id: itemIdNum,
                variation_id: Number(m.model_id),
                promotion_type: "seller_discount",
                promotion_id: Number(discountId),
                action: "promo_lock_stock",
                update_time: Math.floor(Date.now() / 1000),
                start_time: Math.floor(discount.startTime.getTime() / 1000),
                end_time: Math.floor(discount.endTime.getTime() / 1000),
                reserved_stock: promoStock
              }
            }
          }).catch(err => console.error("Webhook Push 7 error:", err));
        }
      }

      successCount++;
    } else {
      // Item without variations
      const promoPrice = Number(item.item_promotion_price);
      const originalPrice = Number(product.originalPrice);

      if (promoPrice <= 0 || promoPrice > originalPrice) {
        errorList.push({
          item_id: itemIdNum,
          model_id: 0,
          fail_error: "discount.invalid_promo_price",
          fail_message: `Promotion price (${promoPrice}) must be greater than 0 and less than or equal to original price (${originalPrice})`
        });
        continue;
      }

      const promoStock = item.item_promotion_stock !== undefined ? Number(item.item_promotion_stock) : null;

      await prisma.discountItem.upsert({
        where: {
          discountId_itemId: {
            discountId,
            itemId
          }
        },
        create: {
          discountId,
          itemId,
          purchaseLimit,
          itemPromotionPrice: promoPrice,
          itemPromotionStock: promoStock,
          normalStock: 100,
          status: currentStatus
        },
        update: {
          purchaseLimit,
          itemPromotionPrice: promoPrice,
          itemPromotionStock: promoStock,
          normalStock: 100,
          status: currentStatus
        }
      });

      // Webhook Push Code 9: promotion_update_push (action: added_in_promo)
      WebhookService.dispatch({
        partnerId,
        pushCode: 9,
        shopId,
        payload: {
          shop_id: Number(shopId),
          code: 9,
          timestamp: Math.floor(Date.now() / 1000),
          data: {
            shop_id: Number(shopId),
            promotion_id: Number(discountId),
            promotion_type: "seller_discount",
            start_time: Math.floor(discount.startTime.getTime() / 1000),
            end_time: Math.floor(discount.endTime.getTime() / 1000),
            action: "added_in_promo",
            item_id: itemIdNum,
            variation_id: 0
          }
        }
      }).catch(err => console.error("Webhook Push 9 error:", err));

      if (promoStock !== null && promoStock > 0) {
        WebhookService.dispatch({
          partnerId,
          pushCode: 7,
          shopId,
          payload: {
            shop_id: Number(shopId),
            code: 7,
            timestamp: Math.floor(Date.now() / 1000),
            data: {
              shop_id: Number(shopId),
              item_id: itemIdNum,
              variation_id: 0,
              promotion_type: "seller_discount",
              promotion_id: Number(discountId),
              action: "promo_lock_stock",
              update_time: Math.floor(Date.now() / 1000),
              start_time: Math.floor(discount.startTime.getTime() / 1000),
              end_time: Math.floor(discount.endTime.getTime() / 1000),
              reserved_stock: promoStock
            }
          }
        }).catch(err => console.error("Webhook Push 7 error:", err));
      }

      successCount++;
    }
  }

  res.json(createShopeeSuccessResponse({
    discount_id: Number(discountId),
    count: successCount,
    error_list: errorList,
    warning: ""
  }));
});

// ============================================================================
// 3. GET DISCOUNT LIST: GET /api/v2/discount/get_discount_list
// ============================================================================
discountRouter.get("/api/v2/discount/get_discount_list", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  await syncDiscountStatuses(shopId);

  const statusParam = ((req.query.discount_status as string) || (req.body?.discount_status as string) || "all").toLowerCase();
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

  const [total, discounts] = await Promise.all([
    prisma.discount.count({ where: whereClause }),
    prisma.discount.findMany({
      where: whereClause,
      skip: offset,
      take: pageSize,
      orderBy: { createdAt: "desc" }
    })
  ]);

  const more = offset + discounts.length < total;

  const discountList = discounts.map(d => ({
    discount_id: Number(d.discountId),
    discount_name: d.discountName,
    start_time: Math.floor(d.startTime.getTime() / 1000),
    end_time: Math.floor(d.endTime.getTime() / 1000),
    status: d.status.toLowerCase(),
    source: d.source
  }));

  res.json(createShopeeSuccessResponse({
    more,
    discount_list: discountList
  }));
});

// ============================================================================
// 4. GET DISCOUNT DETAIL: GET /api/v2/discount/get_discount
// ============================================================================
discountRouter.get("/api/v2/discount/get_discount", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const discountIdParam = req.query.discount_id || req.body?.discount_id;
  if (!discountIdParam) {
    res.json(createShopeeErrorResponse("error_param", "discount_id is required"));
    return;
  }

  const discountId = BigInt(discountIdParam as string);
  await syncDiscountStatuses(shopId);

  const discount = await prisma.discount.findUnique({
    where: { discountId },
    include: {
      items: {
        include: {
          product: true,
          models: {
            include: {
              productModel: true
            }
          }
        }
      }
    }
  });

  if (!discount || discount.shopId !== shopId || discount.status === PromotionStatus.DELETED) {
    res.json(createShopeeErrorResponse("error_param", "Discount not found"));
    return;
  }

  const pageNo = Math.max(1, parseInt((req.query.page_no as string) || (req.body?.page_no as string) || "1", 10));
  const pageSize = Math.min(100, Math.max(1, parseInt((req.query.page_size as string) || (req.body?.page_size as string) || "50", 10)));
  const offset = (pageNo - 1) * pageSize;

  const pagedItems = discount.items.slice(offset, offset + pageSize);

  const itemList = pagedItems.map(item => {
    const hasModels = item.models.length > 0;
    return {
      item_id: Number(item.itemId),
      item_name: item.product.itemName,
      normal_stock: hasModels ? 0 : 100,
      item_promotion_stock: item.itemPromotionStock || 0,
      item_original_price: hasModels ? 0 : Number(item.product.originalPrice),
      item_promotion_price: hasModels ? 0 : Number(item.itemPromotionPrice || 0),
      purchase_limit: item.purchaseLimit,
      model_list: item.models.map(m => ({
        model_id: Number(m.modelId),
        model_name: m.productModel.modelName,
        model_normal_stock: m.productModel.sellerStock,
        model_promotion_stock: m.modelPromotionStock || 0,
        model_original_price: Number(m.productModel.originalPrice),
        model_promotion_price: Number(m.modelPromotionPrice)
      }))
    };
  });

  res.json(createShopeeSuccessResponse({
    discount_id: Number(discount.discountId),
    discount_name: discount.discountName,
    start_time: Math.floor(discount.startTime.getTime() / 1000),
    end_time: Math.floor(discount.endTime.getTime() / 1000),
    status: discount.status.toLowerCase(),
    item_list: itemList
  }));
});

// ============================================================================
// 5. UPDATE DISCOUNT: POST /api/v2/discount/update_discount
// ============================================================================
discountRouter.post("/api/v2/discount/update_discount", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const partnerIdStr = req.query.partner_id as string;
  const shopId = BigInt(shopIdStr);
  const partnerId = BigInt(partnerIdStr);

  const { discount_id, discount_name, start_time, end_time } = req.body || {};
  if (!discount_id) {
    res.json(createShopeeErrorResponse("error_param", "discount_id is required"));
    return;
  }

  const discountId = BigInt(discount_id);
  const discount = await prisma.discount.findUnique({ where: { discountId } });

  if (!discount || discount.shopId !== shopId || discount.status === PromotionStatus.DELETED) {
    res.json(createShopeeErrorResponse("error_param", "Discount not found"));
    return;
  }

  const currentStatus = calculatePromotionStatus(discount.startTime, discount.endTime, discount.status);
  if (currentStatus === PromotionStatus.EXPIRED) {
    res.json(createShopeeErrorResponse("discount.discount_is_end", "The end discount cannot be updated or deleted."));
    return;
  }

  const updateData: any = {};
  let timingChanged = false;

  if (discount_name && typeof discount_name === "string" && discount_name.trim().length > 0) {
    updateData.discountName = discount_name.trim();
  }

  const nowSec = Math.floor(Date.now() / 1000);
  let effectiveStartSec = Math.floor(discount.startTime.getTime() / 1000);
  let effectiveEndSec = Math.floor(discount.endTime.getTime() / 1000);

  if (start_time !== undefined) {
    const newStartSec = Number(start_time);
    if (currentStatus === PromotionStatus.ONGOING) {
      res.json(createShopeeErrorResponse("discount.error_ongoing_start_time", "Cannot change start time of an ongoing discount."));
      return;
    }
    if (newStartSec <= nowSec) {
      res.json(createShopeeErrorResponse("discount.discount_start_time_smaller_than_now", "Discount start time is less than the current time."));
      return;
    }
    effectiveStartSec = newStartSec;
    updateData.startTime = new Date(newStartSec * 1000);
    timingChanged = true;
  }

  if (end_time !== undefined) {
    const newEndSec = Number(end_time);
    if (newEndSec <= effectiveStartSec) {
      res.json(createShopeeErrorResponse("discount.discount_end_time_smaller_than_start_time", "Discount end time should later than start time."));
      return;
    }
    if (newEndSec - effectiveStartSec < 3600) {
      res.json(createShopeeErrorResponse("discount.discount_period_too_short", "The end time should be later than 1 hour of start time."));
      return;
    }
    if (newEndSec - effectiveStartSec > 180 * 24 * 3600) {
      res.json(createShopeeErrorResponse("discount.discount_period_too_long", "Promotion duration must be within 180 days."));
      return;
    }
    effectiveEndSec = newEndSec;
    updateData.endTime = new Date(newEndSec * 1000);
    timingChanged = true;
  }

  const updatedDiscount = await prisma.discount.update({
    where: { discountId },
    data: updateData
  });

  // If timings changed, dispatch Push Code 9: promo_time_updated
  if (timingChanged) {
    WebhookService.dispatch({
      partnerId,
      pushCode: 9,
      shopId,
      payload: {
        shop_id: Number(shopId),
        code: 9,
        timestamp: Math.floor(Date.now() / 1000),
        data: {
          shop_id: Number(shopId),
          promotion_id: Number(discountId),
          promotion_type: "seller_discount",
          start_time: effectiveStartSec,
          end_time: effectiveEndSec,
          action: "promo_time_updated"
        }
      }
    }).catch(err => console.error("Webhook Push 9 error:", err));
  }

  res.json(createShopeeSuccessResponse({
    discount_id: Number(updatedDiscount.discountId),
    modify_time: Math.floor(updatedDiscount.updatedAt.getTime() / 1000)
  }));
});

// ============================================================================
// 6. UPDATE DISCOUNT ITEM: POST /api/v2/discount/update_discount_item
// ============================================================================
discountRouter.post("/api/v2/discount/update_discount_item", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const { discount_id, item_list } = req.body || {};
  if (!discount_id) {
    res.json(createShopeeErrorResponse("error_param", "discount_id is required"));
    return;
  }

  if (!Array.isArray(item_list) || item_list.length === 0) {
    res.json(createShopeeErrorResponse("error_param", "item_list is required"));
    return;
  }

  if (item_list.length > 50) {
    res.json(createShopeeErrorResponse("error_param", "You can update at most 50 items per call."));
    return;
  }

  const discountId = BigInt(discount_id);
  const discount = await prisma.discount.findUnique({
    where: { discountId }
  });

  if (!discount || discount.shopId !== shopId || discount.status === PromotionStatus.DELETED) {
    res.json(createShopeeErrorResponse("error_param", "Discount not found"));
    return;
  }

  let successCount = 0;
  const errorList: Array<{ item_id: number; model_id: number; fail_error: string; fail_message: string }> = [];

  for (const item of item_list) {
    const itemId = BigInt(item.item_id);
    const existingItem = await prisma.discountItem.findUnique({
      where: {
        discountId_itemId: {
          discountId,
          itemId
        }
      },
      include: {
        product: {
          include: { models: true }
        },
        models: true
      }
    });

    if (!existingItem) {
      errorList.push({
        item_id: Number(item.item_id),
        model_id: 0,
        fail_error: "discount.item_not_found",
        fail_message: "Item does not exist in this discount"
      });
      continue;
    }

    const hasModels = existingItem.models.length > 0;
    if (hasModels) {
      const modelList = item.model_list;
      if (!Array.isArray(modelList) || modelList.length === 0) {
        errorList.push({
          item_id: Number(item.item_id),
          model_id: 0,
          fail_error: "discount.model_list_empty",
          fail_message: "model_list is required for variations"
        });
        continue;
      }

      let modelErr = false;
      for (const m of modelList) {
        const modelId = BigInt(m.model_id);
        const targetModel = existingItem.product.models.find(mod => mod.modelId === modelId);
        if (!targetModel) {
          errorList.push({
            item_id: Number(item.item_id),
            model_id: Number(m.model_id),
            fail_error: "discount.model_not_found",
            fail_message: "Model variation not found"
          });
          modelErr = true;
          break;
        }

        const promoPrice = Number(m.model_promotion_price);
        const originalPrice = Number(targetModel.originalPrice);
        if (promoPrice <= 0 || promoPrice > originalPrice) {
          errorList.push({
            item_id: Number(item.item_id),
            model_id: Number(m.model_id),
            fail_error: "discount.invalid_promo_price",
            fail_message: `Promotion price (${promoPrice}) must be greater than 0 and less than or equal to original price (${originalPrice})`
          });
          modelErr = true;
          break;
        }
      }

      if (modelErr) continue;

      if (item.purchase_limit !== undefined) {
        await prisma.discountItem.update({
          where: { id: existingItem.id },
          data: { purchaseLimit: Math.max(0, Number(item.purchase_limit)) }
        });
      }

      for (const m of modelList) {
        const modelId = BigInt(m.model_id);
        const promoPrice = Number(m.model_promotion_price);

        await prisma.discountItemModel.updateMany({
          where: {
            discountItemId: existingItem.id,
            modelId
          },
          data: {
            modelPromotionPrice: promoPrice
          }
        });
      }

      successCount++;
    } else {
      const promoPrice = Number(item.item_promotion_price);
      const originalPrice = Number(existingItem.product.originalPrice);

      if (promoPrice <= 0 || promoPrice > originalPrice) {
        errorList.push({
          item_id: Number(item.item_id),
          model_id: 0,
          fail_error: "discount.invalid_promo_price",
          fail_message: `Promotion price (${promoPrice}) must be greater than 0 and less than or equal to original price (${originalPrice})`
        });
        continue;
      }

      const updateData: any = {
        itemPromotionPrice: promoPrice
      };
      if (item.purchase_limit !== undefined) {
        updateData.purchaseLimit = Math.max(0, Number(item.purchase_limit));
      }

      await prisma.discountItem.update({
        where: { id: existingItem.id },
        data: updateData
      });

      successCount++;
    }
  }

  res.json(createShopeeSuccessResponse({
    discount_id: Number(discountId),
    count: successCount,
    error_list: errorList
  }));
});

// ============================================================================
// 7. DELETE DISCOUNT: POST /api/v2/discount/delete_discount
// ============================================================================
discountRouter.post("/api/v2/discount/delete_discount", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const partnerIdStr = req.query.partner_id as string;
  const shopId = BigInt(shopIdStr);
  const partnerId = BigInt(partnerIdStr);

  const { discount_id } = req.body || {};
  if (!discount_id) {
    res.json(createShopeeErrorResponse("error_param", "discount_id is required"));
    return;
  }

  const discountId = BigInt(discount_id);
  const discount = await prisma.discount.findUnique({
    where: { discountId },
    include: {
      items: {
        include: { models: true }
      }
    }
  });

  if (!discount || discount.shopId !== shopId || discount.status === PromotionStatus.DELETED) {
    res.json(createShopeeErrorResponse("error_param", "Discount not found"));
    return;
  }

  const currentStatus = calculatePromotionStatus(discount.startTime, discount.endTime, discount.status);

  // Only upcoming discounts can be deleted (ongoing/ended discounts cannot be deleted)
  if (currentStatus !== PromotionStatus.UPCOMING) {
    res.json(createShopeeErrorResponse("discount.discount_is_end", "The end or ongoing discount cannot be deleted."));
    return;
  }

  // Mark discount as DELETED
  const updatedDiscount = await prisma.discount.update({
    where: { discountId },
    data: { status: PromotionStatus.DELETED }
  });

  // Notify webhook for items removed
  for (const item of discount.items) {
    if (item.models.length > 0) {
      for (const m of item.models) {
        WebhookService.dispatch({
          partnerId,
          pushCode: 9,
          shopId,
          payload: {
            shop_id: Number(shopId),
            code: 9,
            timestamp: Math.floor(Date.now() / 1000),
            data: {
              shop_id: Number(shopId),
              promotion_id: Number(discountId),
              promotion_type: "seller_discount",
              action: "removed_from_promo",
              item_id: Number(item.itemId),
              variation_id: Number(m.modelId)
            }
          }
        }).catch(err => console.error("Webhook Push 9 error:", err));

        if (m.modelPromotionStock && m.modelPromotionStock > 0) {
          WebhookService.dispatch({
            partnerId,
            pushCode: 7,
            shopId,
            payload: {
              shop_id: Number(shopId),
              code: 7,
              timestamp: Math.floor(Date.now() / 1000),
              data: {
                shop_id: Number(shopId),
                item_id: Number(item.itemId),
                variation_id: Number(m.modelId),
                promotion_type: "seller_discount",
                promotion_id: Number(discountId),
                action: "promo_cancelled",
                update_time: Math.floor(Date.now() / 1000),
                start_time: Math.floor(discount.startTime.getTime() / 1000),
                end_time: Math.floor(discount.endTime.getTime() / 1000),
                reserved_stock: 0
              }
            }
          }).catch(err => console.error("Webhook Push 7 error:", err));
        }
      }
    } else {
      WebhookService.dispatch({
        partnerId,
        pushCode: 9,
        shopId,
        payload: {
          shop_id: Number(shopId),
          code: 9,
          timestamp: Math.floor(Date.now() / 1000),
          data: {
            shop_id: Number(shopId),
            promotion_id: Number(discountId),
            promotion_type: "seller_discount",
            action: "removed_from_promo",
            item_id: Number(item.itemId),
            variation_id: 0
          }
        }
      }).catch(err => console.error("Webhook Push 9 error:", err));

      if (item.itemPromotionStock && item.itemPromotionStock > 0) {
        WebhookService.dispatch({
          partnerId,
          pushCode: 7,
          shopId,
          payload: {
            shop_id: Number(shopId),
            code: 7,
            timestamp: Math.floor(Date.now() / 1000),
            data: {
              shop_id: Number(shopId),
              item_id: Number(item.itemId),
              variation_id: 0,
              promotion_type: "seller_discount",
              promotion_id: Number(discountId),
              action: "promo_cancelled",
              update_time: Math.floor(Date.now() / 1000),
              start_time: Math.floor(discount.startTime.getTime() / 1000),
              end_time: Math.floor(discount.endTime.getTime() / 1000),
              reserved_stock: 0
            }
          }
        }).catch(err => console.error("Webhook Push 7 error:", err));
      }
    }
  }

  res.json(createShopeeSuccessResponse({
    discount_id: Number(updatedDiscount.discountId),
    modify_time: Math.floor(updatedDiscount.updatedAt.getTime() / 1000)
  }));
});

// ============================================================================
// 8. DELETE DISCOUNT ITEM: POST /api/v2/discount/delete_discount_item
// ============================================================================
discountRouter.post("/api/v2/discount/delete_discount_item", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const partnerIdStr = req.query.partner_id as string;
  const shopId = BigInt(shopIdStr);
  const partnerId = BigInt(partnerIdStr);

  const { discount_id, item_id, model_id } = req.body || {};
  if (!discount_id || !item_id) {
    res.json(createShopeeErrorResponse("error_param", "discount_id and item_id are required"));
    return;
  }

  const discountId = BigInt(discount_id);
  const itemId = BigInt(item_id);
  const modelId = model_id ? BigInt(model_id) : BigInt(0);

  const discount = await prisma.discount.findUnique({ where: { discountId } });
  if (!discount || discount.shopId !== shopId || discount.status === PromotionStatus.DELETED) {
    res.json(createShopeeErrorResponse("error_param", "Discount not found"));
    return;
  }

  const discountItem = await prisma.discountItem.findUnique({
    where: {
      discountId_itemId: {
        discountId,
        itemId
      }
    },
    include: { models: true }
  });

  if (!discountItem) {
    res.json(createShopeeErrorResponse("error_param", "Item not found in this discount"));
    return;
  }

  if (modelId > 0 && discountItem.models.length > 0) {
    // Delete single model
    await prisma.discountItemModel.deleteMany({
      where: {
        discountItemId: discountItem.id,
        modelId
      }
    });

    // If no models remain, delete the item as well
    const remainingCount = await prisma.discountItemModel.count({
      where: { discountItemId: discountItem.id }
    });
    if (remainingCount === 0) {
      await prisma.discountItem.delete({ where: { id: discountItem.id } });
    }

    // Webhook Push 9
    WebhookService.dispatch({
      partnerId,
      pushCode: 9,
      shopId,
      payload: {
        shop_id: Number(shopId),
        code: 9,
        timestamp: Math.floor(Date.now() / 1000),
        data: {
          shop_id: Number(shopId),
          promotion_id: Number(discountId),
          promotion_type: "seller_discount",
          action: "removed_from_promo",
          item_id: Number(itemId),
          variation_id: Number(modelId)
        }
      }
    }).catch(err => console.error("Webhook Push 9 error:", err));
  } else {
    // Delete full item and all its models
    await prisma.discountItem.delete({
      where: { id: discountItem.id }
    });

    WebhookService.dispatch({
      partnerId,
      pushCode: 9,
      shopId,
      payload: {
        shop_id: Number(shopId),
        code: 9,
        timestamp: Math.floor(Date.now() / 1000),
        data: {
          shop_id: Number(shopId),
          promotion_id: Number(discountId),
          promotion_type: "seller_discount",
          action: "removed_from_promo",
          item_id: Number(itemId),
          variation_id: 0
        }
      }
    }).catch(err => console.error("Webhook Push 9 error:", err));
  }

  res.json(createShopeeSuccessResponse({
    discount_id: Number(discountId),
    error_list: []
  }));
});

// ============================================================================
// 9. END DISCOUNT: POST /api/v2/discount/end_discount
// ============================================================================
discountRouter.post("/api/v2/discount/end_discount", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const partnerIdStr = req.query.partner_id as string;
  const shopId = BigInt(shopIdStr);
  const partnerId = BigInt(partnerIdStr);

  const { discount_id } = req.body || {};
  if (!discount_id) {
    res.json(createShopeeErrorResponse("error_param", "discount_id is required"));
    return;
  }

  const discountId = BigInt(discount_id);
  const discount = await prisma.discount.findUnique({
    where: { discountId },
    include: {
      items: {
        include: { models: true }
      }
    }
  });

  if (!discount || discount.shopId !== shopId || discount.status === PromotionStatus.DELETED) {
    res.json(createShopeeErrorResponse("error_param", "Discount not found"));
    return;
  }

  const currentStatus = calculatePromotionStatus(discount.startTime, discount.endTime, discount.status);

  // Can only end ongoing discount
  if (currentStatus !== PromotionStatus.ONGOING) {
    res.json(createShopeeErrorResponse("discount.discount_is_ongoing", "Only the ongoing discount can be ended."));
    return;
  }

  const now = new Date();
  const updatedDiscount = await prisma.discount.update({
    where: { discountId },
    data: {
      status: PromotionStatus.EXPIRED,
      endTime: now
    }
  });

  // Dispatch Push Code 7: promo_end
  for (const item of discount.items) {
    if (item.models.length > 0) {
      for (const m of item.models) {
        WebhookService.dispatch({
          partnerId,
          pushCode: 7,
          shopId,
          payload: {
            shop_id: Number(shopId),
            code: 7,
            timestamp: Math.floor(now.getTime() / 1000),
            data: {
              shop_id: Number(shopId),
              item_id: Number(item.itemId),
              variation_id: Number(m.modelId),
              promotion_type: "seller_discount",
              promotion_id: Number(discountId),
              action: "promo_end",
              update_time: Math.floor(now.getTime() / 1000),
              start_time: Math.floor(discount.startTime.getTime() / 1000),
              end_time: Math.floor(now.getTime() / 1000),
              reserved_stock: 0
            }
          }
        }).catch(err => console.error("Webhook Push 7 error:", err));
      }
    } else {
      WebhookService.dispatch({
        partnerId,
        pushCode: 7,
        shopId,
        payload: {
          shop_id: Number(shopId),
          code: 7,
          timestamp: Math.floor(now.getTime() / 1000),
          data: {
            shop_id: Number(shopId),
            item_id: Number(item.itemId),
            variation_id: 0,
            promotion_type: "seller_discount",
            promotion_id: Number(discountId),
            action: "promo_end",
            update_time: Math.floor(now.getTime() / 1000),
            start_time: Math.floor(discount.startTime.getTime() / 1000),
            end_time: Math.floor(now.getTime() / 1000),
            reserved_stock: 0
          }
        }
      }).catch(err => console.error("Webhook Push 7 error:", err));
    }
  }

  res.json(createShopeeSuccessResponse({
    discount_id: Number(updatedDiscount.discountId),
    modify_time: Math.floor(now.getTime() / 1000)
  }));
});
