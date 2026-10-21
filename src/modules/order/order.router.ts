import { Router, Request, Response } from "express";
import { prisma } from "../../common/prisma";
import { createShopeeSuccessResponse, createShopeeErrorResponse } from "../../common/utils/envelope";
import { shopeeAuthGuard } from "../../common/middleware/auth-guard";
import { OrderStatus, PromotionStatus } from "@prisma/client";
import { WebhookService } from "../webhook/webhook.service";
import { LogisticsEngine } from "../logistics/logistics.engine";

export const orderRouter = Router();

// Helper to parse query parameter lists that might be string, comma-separated, or JSON array
function parseListParam(param: any): string[] {
  if (!param) return [];
  if (Array.isArray(param)) {
    return param.flatMap(p => parseListParam(p));
  }
  if (typeof param === "string") {
    const trimmed = param.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch {
        return trimmed.slice(1, -1).split(",").map(s => s.trim()).filter(Boolean);
      }
    }
    return trimmed.split(",").map(s => s.trim()).filter(Boolean);
  }
  return [String(param)];
}

// ============================================================================
// 1. GET ORDER LIST: GET /api/v2/order/get_order_list
// ============================================================================
orderRouter.get("/api/v2/order/get_order_list", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const timeRangeField = (req.query.time_range_field as string) || "create_time";
  const timeFrom = req.query.time_from ? parseInt(req.query.time_from as string, 10) : undefined;
  const timeTo = req.query.time_to ? parseInt(req.query.time_to as string, 10) : undefined;
  const pageSize = Math.min(parseInt((req.query.page_size as string) || "20", 10), 100);
  const cursor = (req.query.cursor as string) || "0";
  const offset = parseInt(cursor, 10) || 0;
  const orderStatusFilter = req.query.order_status as string | undefined;

  const whereClause: any = { shopId };

  if (orderStatusFilter && orderStatusFilter.toUpperCase() !== "ALL") {
    whereClause.orderStatus = orderStatusFilter as OrderStatus;
  }

  const dateColumn = timeRangeField === "update_time" ? "updatedAt" : "createdAt";
  if (timeFrom || timeTo) {
    whereClause[dateColumn] = {};
    if (timeFrom) whereClause[dateColumn].gte = new Date(timeFrom * 1000);
    if (timeTo) whereClause[dateColumn].lte = new Date(timeTo * 1000);
  }

  const [totalCount, orders] = await Promise.all([
    prisma.order.count({ where: whereClause }),
    prisma.order.findMany({
      where: whereClause,
      skip: offset,
      take: pageSize,
      orderBy: { [dateColumn]: "desc" }
    })
  ]);

  const more = offset + orders.length < totalCount;
  const nextCursor = more ? String(offset + orders.length) : "";

  const orderList = orders.map((o) => ({
    order_sn: o.orderSn,
    order_status: o.orderStatus
  }));

  res.json(createShopeeSuccessResponse({
    more,
    order_list: orderList,
    next_cursor: nextCursor
  }));
});

// ============================================================================
// 2. GET ORDER DETAIL: GET /api/v2/order/get_order_detail
// ============================================================================
orderRouter.get("/api/v2/order/get_order_detail", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const orderSnStrings = parseListParam(req.query.order_sn_list);
  if (orderSnStrings.length === 0) {
    res.json(createShopeeErrorResponse("error_param", "order_sn_list is required"));
    return;
  }

  const orders = await prisma.order.findMany({
    where: {
      shopId,
      orderSn: { in: orderSnStrings }
    },
    include: {
      items: true,
      packages: {
        include: {
          packageItems: {
            include: {
              orderItem: true
            }
          }
        }
      }
    }
  });

  const orderList = orders.map((o) => {
    return {
      order_sn: o.orderSn,
      region: "VN",
      currency: o.currency,
      cod: false,
      total_amount: Number(o.totalAmount),
      order_status: o.orderStatus,
      shipping_carrier: o.shippingCarrier,
      payment_method: o.paymentMethod,
      estimated_shipping_fee: Number(o.buyerPaidShippingFee),
      actual_shipping_fee: Number(o.actualShippingFee),
      buyer_paid_shipping_fee: Number(o.buyerPaidShippingFee),
      shopee_shipping_rebate: Number(o.voucherFromShopee || 0),
      logistics_channel_id: Number(o.channelId),
      message_to_seller: o.messageToSeller || "",
      note: o.note || "",
      note_update_time: Math.floor(o.updatedAt.getTime() / 1000),
      create_time: Math.floor(o.createdAt.getTime() / 1000),
      update_time: Math.floor(o.updatedAt.getTime() / 1000),
      days_to_ship: 2,
      ship_by_date: o.shipByDate ? Math.floor(o.shipByDate.getTime() / 1000) : Math.floor(o.createdAt.getTime() / 1000) + 172800,
      buyer_user_id: Number(o.buyerUserId),
      buyer_username: o.buyerUsername,
      split_up: o.isSplitUp,
      cancel_by: o.cancelBy || null,
      cancel_reason: o.cancelReason || null,
      buyer_cancel_reason: o.buyerCancelReason || null,
      pay_time: o.payTime ? Math.floor(o.payTime.getTime() / 1000) : Math.floor(o.createdAt.getTime() / 1000),
      recipient_address: {
        name: o.recipientName,
        phone: o.recipientPhone,
        full_address: o.recipientAddress,
        district: o.recipientDistrict,
        city: o.recipientCity,
        state: o.recipientState,
        region: "VN",
        zipcode: o.recipientZipcode
      },
      item_list: o.items.map((it) => ({
        item_id: Number(it.itemId),
        item_name: it.itemName,
        item_sku: it.modelSku || "",
        model_id: it.modelId ? Number(it.modelId) : 0,
        model_name: it.modelName || "",
        model_sku: it.modelSku || "",
        model_quantity_purchased: it.quantityPurchased,
        model_original_price: Number(it.itemPrice),
        model_discounted_price: Number(it.itemPrice),
        order_item_id: Number(it.orderItemId),
        weight: 0.5
      })),
      package_list: o.packages.map((pkg) => ({
        package_number: pkg.packageNumber,
        logistics_status: pkg.logisticsStatus,
        shipping_carrier: pkg.shippingCarrier,
        logistics_channel_id: Number(pkg.channelId),
        tracking_number: pkg.trackingNumber || null,
        item_list: pkg.packageItems.map((pi) => ({
          item_id: Number(pi.orderItem.itemId),
          model_id: pi.orderItem.modelId ? Number(pi.orderItem.modelId) : 0,
          order_item_id: Number(pi.orderItemId),
          model_quantity: pi.modelQuantity
        }))
      }))
    };
  });

  res.json(createShopeeSuccessResponse({
    order_list: orderList
  }));
});

// ============================================================================
// 3. SPLIT ORDER: POST /api/v2/order/split_order
// ============================================================================
orderRouter.post("/api/v2/order/split_order", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const { order_sn, package_list } = req.body || {};

  if (!order_sn || !Array.isArray(package_list) || package_list.length === 0) {
    res.json(createShopeeErrorResponse("error_param", "order_sn and package_list are required"));
    return;
  }

  if (package_list.length > 5) {
    res.json(createShopeeErrorResponse("error_param", "Order can be split into 5 packages at most"));
    return;
  }

  const order = await prisma.order.findFirst({
    where: { orderSn: order_sn, shopId },
    include: { items: true, packages: true }
  });

  if (!order) {
    res.json(createShopeeErrorResponse("error_param", "Order not found"));
    return;
  }

  if (order.orderStatus !== OrderStatus.READY_TO_SHIP && order.orderStatus !== OrderStatus.UNPAID) {
    res.json(createShopeeErrorResponse("error_param", "Only UNPAID or READY_TO_SHIP orders can be split"));
    return;
  }

  // Delete previous packages for this order before re-splitting
  await prisma.orderPackage.deleteMany({ where: { orderSn: order.orderSn } });

  const createdPackages = [];
  for (let idx = 0; idx < package_list.length; idx++) {
    const p = package_list[idx];
    const pkgNum = `${order.orderSn}-PKG-${idx + 1}`;

    const createdPkg = await prisma.orderPackage.create({
      data: {
        packageNumber: pkgNum,
        orderSn: order.orderSn,
        logisticsStatus: "LOGISTICS_NOT_START",
        shippingCarrier: order.shippingCarrier,
        channelId: order.channelId,
        documentStatus: "NOT_CREATED"
      }
    });

    const packageItemList = [];
    for (const itemEntry of p.item_list || []) {
      const targetItem = order.items.find(
        (it) => Number(it.itemId) === Number(itemEntry.item_id) &&
                (itemEntry.model_id === undefined || Number(it.modelId || 0) === Number(itemEntry.model_id))
      );

      const orderItemId = targetItem ? targetItem.orderItemId : order.items[0].orderItemId;
      const modelQty = itemEntry.model_quantity ? Number(itemEntry.model_quantity) : 1;

      await prisma.packageItem.create({
        data: {
          packageNumber: pkgNum,
          orderItemId,
          modelQuantity: modelQty
        }
      });

      packageItemList.push({
        item_id: Number(itemEntry.item_id),
        model_id: itemEntry.model_id ? Number(itemEntry.model_id) : 0,
        order_item_id: Number(orderItemId),
        model_quantity: modelQty
      });
    }

    createdPackages.push({
      package_number: pkgNum,
      item_list: packageItemList
    });
  }

  // Mark order as split
  await prisma.order.update({
    where: { orderSn: order.orderSn },
    data: { isSplitUp: true }
  });

  res.json(createShopeeSuccessResponse({
    order_sn: order.orderSn,
    package_list: createdPackages
  }));
});

// ============================================================================
// 4. CANCEL ORDER: POST /api/v2/order/cancel_order
// ============================================================================
orderRouter.post("/api/v2/order/cancel_order", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const { order_sn, cancel_reason } = req.body || {};

  if (!order_sn || !cancel_reason) {
    res.json(createShopeeErrorResponse("error_param", "order_sn and cancel_reason are required"));
    return;
  }

  const order = await prisma.order.findFirst({
    where: { orderSn: order_sn, shopId }
  });

  if (!order) {
    res.json(createShopeeErrorResponse("error_param", "Order not found"));
    return;
  }

  if (order.orderStatus === OrderStatus.SHIPPED || order.orderStatus === OrderStatus.COMPLETED) {
    res.json(createShopeeErrorResponse("error_param", "Cannot cancel order that has already been shipped or completed"));
    return;
  }

  const now = new Date();
  await prisma.order.update({
    where: { orderSn: order_sn },
    data: {
      orderStatus: OrderStatus.CANCELLED,
      cancelBy: "SELLER",
      cancelReason: cancel_reason,
      updatedAt: now
    }
  });

  const shop = await prisma.shop.findUnique({ where: { shopId } });
  if (shop) {
    WebhookService.dispatch({
      partnerId: shop.partnerId,
      pushCode: 3,
      shopId,
      ordersn: order_sn,
      payload: {
        shop_id: Number(shopId),
        code: 3,
        timestamp: Math.floor(now.getTime() / 1000),
        data: {
          ordersn: order_sn,
          status: "CANCELLED",
          update_time: Math.floor(now.getTime() / 1000)
        }
      }
    }).catch(err => console.warn("[WebhookTrigger] cancel_order push failed:", err.message));
  }

  res.json(createShopeeSuccessResponse({
    update_time: Math.floor(now.getTime() / 1000)
  }));
});

// ============================================================================
// 5. HANDLE BUYER CANCELLATION: POST /api/v2/order/handle_buyer_cancellation
// ============================================================================
orderRouter.post("/api/v2/order/handle_buyer_cancellation", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const { order_sn, operation } = req.body || {};

  if (!order_sn || !operation) {
    res.json(createShopeeErrorResponse("error_param", "order_sn and operation are required"));
    return;
  }

  const op = operation.toUpperCase();
  if (op !== "ACCEPT" && op !== "REJECT") {
    res.json(createShopeeErrorResponse("error_param", "operation must be ACCEPT or REJECT"));
    return;
  }

  const order = await prisma.order.findFirst({
    where: { orderSn: order_sn, shopId }
  });

  if (!order) {
    res.json(createShopeeErrorResponse("error_param", "Order not found"));
    return;
  }

  const now = new Date();
  const finalStatus = op === "ACCEPT" ? OrderStatus.CANCELLED : OrderStatus.READY_TO_SHIP;
  if (op === "ACCEPT") {
    await prisma.order.update({
      where: { orderSn: order_sn },
      data: {
        orderStatus: OrderStatus.CANCELLED,
        cancelBy: "BUYER",
        cancelReason: order.buyerCancelReason || "BUYER_CANCELLED",
        updatedAt: now
      }
    });
  } else {
    // REJECT: return order to READY_TO_SHIP
    await prisma.order.update({
      where: { orderSn: order_sn },
      data: {
        orderStatus: OrderStatus.READY_TO_SHIP,
        buyerCancelReason: null,
        updatedAt: now
      }
    });
  }

  const shop = await prisma.shop.findUnique({ where: { shopId } });
  if (shop) {
    WebhookService.dispatch({
      partnerId: shop.partnerId,
      pushCode: 3,
      shopId,
      ordersn: order_sn,
      payload: {
        shop_id: Number(shopId),
        code: 3,
        timestamp: Math.floor(now.getTime() / 1000),
        data: {
          ordersn: order_sn,
          status: finalStatus,
          update_time: Math.floor(now.getTime() / 1000)
        }
      }
    }).catch(err => console.warn("[WebhookTrigger] buyer_cancellation push failed:", err.message));
  }

  res.json(createShopeeSuccessResponse({
    update_time: Math.floor(now.getTime() / 1000)
  }));
});

// ============================================================================
// SIMULATOR CONTROL / HELPER ENDPOINTS
// ============================================================================
// Mock Buyer Order Checkout: Directly seeds an order with items & initial package
orderRouter.post("/api/v2/simulator/order/create", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      shop_id = 727720655,
      order_sn,
      order_status = "READY_TO_SHIP",
      total_amount,
      shipping_fee,
      channel_id,
      recipient_city,
      shipping_carrier,
      recipient_name = "Nguyen Van A",
      recipient_phone = "+84901234567",
      recipient_address = "123 Le Loi, District 1, Ho Chi Minh City",
      buyer_user_id,
      buyer_username,
      voucher_code,
      items = []
    } = req.body || {};

    const shopId = BigInt(shop_id);

    const shop = await prisma.shop.findUnique({
      where: { shopId },
      include: { addresses: true }
    });
    if (!shop) {
      res.json(createShopeeErrorResponse("error_param", "Shop not found"));
      return;
    }
    if (shop.isVacation) {
      res.json(createShopeeErrorResponse("error_business", `Shop "${shop.shopName}" is currently on Holiday Mode (Vacation). Orders cannot be placed.`));
      return;
    }

    // Verify item shops if items are provided
    if (Array.isArray(items) && items.length > 0) {
      const itemIds = items.map((i: any) => i.item_id ? BigInt(i.item_id) : null).filter(Boolean) as bigint[];
      if (itemIds.length > 0) {
        const products = await prisma.product.findMany({
          where: { itemId: { in: itemIds } },
          include: { shop: true }
        });
        for (const p of products) {
          if (p.shopId !== shopId) {
            res.json(createShopeeErrorResponse(
              "error_param",
              `Item ${p.itemId} ("${p.itemName}") belongs to Shop ${p.shopId} ("${p.shop?.shopName || p.shopId}"), but order is requested for Shop ${shopId}. Cross-shop items cannot be placed in a single Shopee order.`
            ));
            return;
          }
          if (p.shop?.isVacation) {
            res.json(createShopeeErrorResponse("error_business", `Shop "${p.shop.shopName}" is currently on Holiday Mode (Vacation). Orders cannot be placed for its products.`));
            return;
          }
        }
      }
    }

    const sn = order_sn || `261019${Date.now().toString(36).toUpperCase()}`;
    const now = new Date();

    // Default product fallback if no items provided
    const defaultProduct = await prisma.product.findFirst({
      where: { shopId },
      include: { models: true }
    });
    const fallbackItemId = defaultProduct ? defaultProduct.itemId : (await prisma.product.findFirst())?.itemId || BigInt(1);

    // Prepare items with promotional pricing calculation
    interface PreparedItem {
      itemId: bigint;
      modelId: bigint | null;
      itemName: string;
      modelName: string | null;
      modelSku: string | null;
      effectivePrice: number;
      quantity: number;
      weightKg?: number;
      dimensions?: { length?: number; width?: number; height?: number } | null;
    }

    const preparedItems: PreparedItem[] = [];
    let itemsSubtotal = 0;

    const inputItems = Array.isArray(items) && items.length > 0 ? items : [{
      item_id: fallbackItemId,
      item_name: defaultProduct ? defaultProduct.itemName : "SmartOmni Product",
      item_price: total_amount !== undefined ? Number(total_amount) : (defaultProduct ? Number(defaultProduct.originalPrice) : 250000),
      quantity_purchased: 1
    }];

    for (const item of inputItems) {
      const itId = item.item_id ? BigInt(item.item_id) : fallbackItemId;
      const mId = item.model_id ? BigInt(item.model_id) : null;
      const qty = Math.max(1, Number(item.quantity_purchased || item.model_quantity_purchased || item.quantity || 1));

      // Fetch product and model details to know original prices
      const product = await prisma.product.findUnique({
        where: { itemId: itId },
        include: { models: true }
      });

      let basePrice = Number(item.item_price || item.model_discounted_price || total_amount || 250000);
      let itemName = item.item_name || (product ? product.itemName : "SmartOmni Product");
      let modelName = item.model_name || null;
      let modelSku = item.model_sku || null;

      if (product) {
        if (!item.item_name) itemName = product.itemName;
        if (mId) {
          const mod = product.models.find(m => m.modelId === mId);
          if (mod) {
            basePrice = Number(mod.originalPrice);
            modelName = mod.modelName;
            modelSku = mod.modelSku;
          }
        } else if (!product.hasModel) {
          basePrice = Number(product.originalPrice);
        }
      }

      // Check active item discount (status == ONGOING, startTime <= now <= endTime)
      const discountItem = await prisma.discountItem.findFirst({
        where: {
          itemId: itId,
          discount: {
            shopId,
            status: { not: PromotionStatus.DELETED },
            startTime: { lte: now },
            endTime: { gte: now }
          }
        },
        include: {
          models: mId ? { where: { modelId: mId } } : true
        }
      });

      let effectiveUnitPrice = basePrice;

      if (discountItem) {
        const purchaseLimit = discountItem.purchaseLimit;
        if (mId && discountItem.models.length > 0) {
          const mPromo = discountItem.models.find(m => m.modelId === mId);
          if (mPromo) {
            const promoPrice = Number(mPromo.modelPromotionPrice);
            if (purchaseLimit > 0 && qty > purchaseLimit) {
              const totalCost = (purchaseLimit * promoPrice) + ((qty - purchaseLimit) * basePrice);
              effectiveUnitPrice = totalCost / qty;
            } else {
              effectiveUnitPrice = promoPrice;
            }
          }
        } else if (discountItem.itemPromotionPrice !== null) {
          const promoPrice = Number(discountItem.itemPromotionPrice);
          if (purchaseLimit > 0 && qty > purchaseLimit) {
            const totalCost = (purchaseLimit * promoPrice) + ((qty - purchaseLimit) * basePrice);
            effectiveUnitPrice = totalCost / qty;
          } else {
            effectiveUnitPrice = promoPrice;
          }
        }
      }

      const dims = product?.dimensionsJson as any;
      const parsedDims = dims ? {
        length: Number(dims.package_length || dims.length || 20),
        width: Number(dims.package_width || dims.width || 15),
        height: Number(dims.package_height || dims.height || 10)
      } : null;
      const pWeight = product?.weight ? Number(product.weight) : 0.5;

      itemsSubtotal += effectiveUnitPrice * qty;
      preparedItems.push({
        itemId: itId,
        modelId: mId,
        itemName,
        modelName,
        modelSku,
        effectivePrice: effectiveUnitPrice,
        quantity: qty,
        weightKg: pWeight,
        dimensions: parsedDims
      });
    }

    // Voucher Calculation
    let voucherDiscount = 0;
    if (voucher_code) {
      const codeStr = String(voucher_code).trim();
      const voucher = await prisma.voucher.findFirst({
        where: {
          shopId,
          voucherCode: codeStr,
          status: { not: PromotionStatus.DELETED },
          startTime: { lte: now },
          endTime: { gte: now }
        },
        include: { items: true }
      });

      if (voucher && voucher.currentUsage < voucher.usageQuantity) {
        const minBasket = Number(voucher.minBasketPrice);
        if (itemsSubtotal >= minBasket) {
          let isEligible = true;
          if (voucher.voucherType === 2 && voucher.items.length > 0) {
            const voucherItemIds = new Set(voucher.items.map(it => it.itemId.toString()));
            isEligible = preparedItems.some(it => voucherItemIds.has(it.itemId.toString()));
          }

          if (isEligible) {
            if (voucher.rewardType === 1) {
              // Fixed amount discount
              voucherDiscount = Math.min(itemsSubtotal, Number(voucher.discountAmount || 0));
            } else if (voucher.rewardType === 2 || voucher.rewardType === 3) {
              // Percentage or coins discount
              let rawDiscount = (itemsSubtotal * Number(voucher.percentage || 0)) / 100;
              if (voucher.maxPrice && Number(voucher.maxPrice) > 0) {
                rawDiscount = Math.min(rawDiscount, Number(voucher.maxPrice));
              }
              voucherDiscount = Math.min(itemsSubtotal, rawDiscount);
            }

            if (voucherDiscount > 0) {
              await prisma.voucher.update({
                where: { voucherId: voucher.voucherId },
                data: { currentUsage: { increment: 1 } }
              });
            }
          }
        }
      }
    }

    // Weight Calculation
    const weightCalc = LogisticsEngine.calculatePackageWeight(
      preparedItems.map(p => ({
        weightKg: p.weightKg,
        dimensions: p.dimensions,
        quantity: p.quantity
      }))
    );

    // Geographic Zone Resolution
    const pickupAddress = shop.addresses?.find(a => a.addressType === "PICKUP" || a.addressType === "DEFAULT") || shop.addresses?.[0];
    const shopCity = pickupAddress?.city || "Ho Chi Minh City";
    const buyerCity = recipient_city || "Ho Chi Minh City";

    // Dynamic Shipping Calculation
    let chosenChannelId = channel_id !== undefined ? Number(channel_id) : undefined;
    let finalShippingCarrier = shipping_carrier;
    let actualShippingFee = 15000;
    let shopeeShippingRebate = 0;
    let buyerPaidShippingFee = 15000;

    if (chosenChannelId !== undefined) {
      const zone = LogisticsEngine.resolveShippingZone(shopCity, buyerCity);
      const quote = LogisticsEngine.calculateChannelFee(chosenChannelId, zone, weightCalc.chargeableWeightGram);

      if (!quote.enabled) {
        res.json(createShopeeErrorResponse("error_param", quote.disabledReason || "Selected logistics channel is not available for this package."));
        return;
      }

      actualShippingFee = quote.actualFee;
      shopeeShippingRebate = LogisticsEngine.calculateFreeshipRebate(itemsSubtotal, actualShippingFee);
      const netFee = Math.max(0, actualShippingFee - shopeeShippingRebate);
      buyerPaidShippingFee = shipping_fee !== undefined ? Number(shipping_fee) : netFee;
      if (!finalShippingCarrier) {
        finalShippingCarrier = quote.carrierName;
      }
    } else {
      chosenChannelId = 30001;
      buyerPaidShippingFee = shipping_fee !== undefined ? Number(shipping_fee) : 15000;
      actualShippingFee = buyerPaidShippingFee;
      if (!finalShippingCarrier) {
        finalShippingCarrier = "Shopee Xpress";
      }
    }

    let finalTotalAmount: number;
    if (total_amount !== undefined && channel_id === undefined) {
      finalTotalAmount = Number(total_amount);
    } else {
      finalTotalAmount = Math.max(0, itemsSubtotal - voucherDiscount) + buyerPaidShippingFee;
    }

    // Create Order
    const order = await prisma.order.create({
      data: {
        orderSn: sn,
        shopId,
        orderStatus: order_status as OrderStatus,
        totalAmount: finalTotalAmount,
        voucherFromSeller: voucherDiscount,
        voucherFromShopee: shopeeShippingRebate,
        shippingCarrier: finalShippingCarrier,
        channelId: BigInt(chosenChannelId),
        buyerUserId: buyer_user_id ? BigInt(buyer_user_id) : BigInt(1001),
        buyerUsername: buyer_username || recipient_name || "shopee_buyer_test",
        recipientName: recipient_name,
        recipientPhone: recipient_phone,
        recipientAddress: recipient_address,
        recipientDistrict: "District 1",
        recipientCity: buyerCity,
        recipientState: buyerCity,
        recipientZipcode: "700000",
        buyerPaidShippingFee: buyerPaidShippingFee,
        actualShippingFee: actualShippingFee,
        commissionFee: Math.round(itemsSubtotal * 0.02),
        serviceFee: shopeeShippingRebate > 0 ? Math.round(itemsSubtotal * 0.015) : 0,
        sellerTransactionFee: Math.round(finalTotalAmount * 0.025),
        escrowAmount: Math.max(0, itemsSubtotal - voucherDiscount + buyerPaidShippingFee - actualShippingFee + shopeeShippingRebate - Math.round(itemsSubtotal * 0.02) - (shopeeShippingRebate > 0 ? Math.round(itemsSubtotal * 0.015) : 0) - Math.round(finalTotalAmount * 0.025)),
        escrowReleaseTime: (order_status as OrderStatus) === OrderStatus.COMPLETED ? new Date() : null,
        currency: "VND",
        paymentMethod: "ShopeePay",
        payTime: new Date(),
        shipByDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      }
    });

    // Create OrderItems
    const createdItems = [];
    for (const pItem of preparedItems) {
      const oi = await prisma.orderItem.create({
        data: {
          orderSn: sn,
          itemId: pItem.itemId,
          modelId: pItem.modelId,
          itemName: pItem.itemName,
          modelName: pItem.modelName,
          modelSku: pItem.modelSku,
          itemPrice: pItem.effectivePrice,
          quantityPurchased: pItem.quantity
        }
      });
      createdItems.push(oi);
    }

    // Create initial default OrderPackage
    const pkgNum = `PKG-${sn}`;
    const pkg = await prisma.orderPackage.create({
      data: {
        packageNumber: pkgNum,
        orderSn: sn,
        logisticsStatus: "LOGISTICS_NOT_START",
        shippingCarrier: finalShippingCarrier,
        channelId: BigInt(chosenChannelId),
        documentStatus: "NOT_CREATED"
      }
    });

    for (const oi of createdItems) {
      await prisma.packageItem.create({
        data: {
          packageNumber: pkgNum,
          orderItemId: oi.orderItemId,
          modelQuantity: oi.quantityPurchased
        }
      });
    }

    // Asynchronously dispatch order_status_push (Push Code 3)
    if (shop) {
      WebhookService.dispatch({
        partnerId: shop.partnerId,
        pushCode: 3,
        shopId,
        ordersn: sn,
        payload: {
          shop_id: Number(shopId),
          code: 3,
          timestamp: Math.floor(Date.now() / 1000),
          data: {
            ordersn: sn,
            status: order.orderStatus,
            update_time: Math.floor(Date.now() / 1000)
          }
        }
      }).catch(err => console.warn("[WebhookTrigger] order_created push failed:", err.message));
    }

    res.json(createShopeeSuccessResponse({
      order_sn: sn,
      order_status: order.orderStatus,
      package_number: pkgNum,
      chargeable_weight_gram: weightCalc.chargeableWeightGram,
      buyer_paid_shipping_fee: buyerPaidShippingFee,
      actual_shipping_fee: actualShippingFee,
      shopee_shipping_rebate: shopeeShippingRebate
    }));
  } catch (err: any) {
    res.status(500).json(createShopeeErrorResponse("error_server", err.message));
  }
});

// ============================================================================
// SIMULATOR HELPER: EXPIRE OVERDUE ORDERS (SLA DEADLINE ENFORCEMENT)
// ============================================================================
orderRouter.post("/api/v2/simulator/order/expire_overdue", async (req: Request, res: Response): Promise<void> => {
  try {
    const { shop_id, simulated_now } = req.body || {};
    const cutoffTime = simulated_now ? new Date(simulated_now) : new Date();

    const whereClause: any = {
      orderStatus: OrderStatus.READY_TO_SHIP,
      shipByDate: {
        lt: cutoffTime
      }
    };

    if (shop_id) {
      whereClause.shopId = BigInt(shop_id);
    }

    const overdueOrders = await prisma.order.findMany({
      where: whereClause,
      include: {
        shop: true
      }
    });

    const expiredSnList: string[] = [];

    for (const ord of overdueOrders) {
      await prisma.order.update({
        where: { orderSn: ord.orderSn },
        data: {
          orderStatus: OrderStatus.CANCELLED,
          cancelBy: "SYSTEM",
          cancelReason: "Seller did not ship order on time"
        }
      });

      expiredSnList.push(ord.orderSn);

      // Dispatch Webhook Code 3
      if (ord.shop?.partnerId) {
        WebhookService.dispatch({
          partnerId: ord.shop.partnerId,
          pushCode: 3,
          shopId: ord.shopId,
          ordersn: ord.orderSn,
          payload: {
            shop_id: Number(ord.shopId),
            code: 3,
            timestamp: Math.floor(Date.now() / 1000),
            data: {
              ordersn: ord.orderSn,
              status: OrderStatus.CANCELLED,
              update_time: Math.floor(Date.now() / 1000)
            }
          }
        }).catch(err => console.warn("[WebhookTrigger] order_cancelled push failed:", err.message));
      }
    }

    res.json(createShopeeSuccessResponse({
      cutoff_time: cutoffTime.toISOString(),
      expired_count: expiredSnList.length,
      expired_orders: expiredSnList
    }));
  } catch (err: any) {
    res.status(500).json(createShopeeErrorResponse("error_server", err.message));
  }
});

