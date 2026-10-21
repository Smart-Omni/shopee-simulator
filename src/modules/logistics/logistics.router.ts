import { Router, Request, Response } from "express";
import { prisma } from "../../common/prisma";
import { createShopeeSuccessResponse, createShopeeErrorResponse } from "../../common/utils/envelope";
import { shopeeAuthGuard } from "../../common/middleware/auth-guard";
import { generateShopeeAwbPdf } from "../../common/utils/pdf";
import { OrderStatus } from "@prisma/client";
import { WebhookService } from "../webhook/webhook.service";
import { LogisticsEngine, ShippingZone } from "./logistics.engine";

export const logisticsRouter = Router();

// ============================================================================
// 1. GET CHANNEL LIST: GET /api/v2/logistics/get_channel_list
// ============================================================================
logisticsRouter.get("/api/v2/logistics/get_channel_list", shopeeAuthGuard, async (_req: Request, res: Response): Promise<void> => {
  const channels = await prisma.logisticsChannel.findMany({
    orderBy: { channelId: "asc" }
  });

  const channelList = channels.map((ch) => ({
    logistics_channel_id: Number(ch.channelId),
    logistics_channel_name: ch.channelName,
    cod_enabled: ch.codEnabled,
    enabled: ch.enabled,
    fee_type: ch.feeType,
    weight_limit: {
      item_max_weight: ch.weightLimitMax ? Number(ch.weightLimitMax) : 30.0,
      item_min_weight: ch.weightLimitMin ? Number(ch.weightLimitMin) : 0.01
    }
  }));

  res.json(createShopeeSuccessResponse({
    logistics_channel_list: channelList
  }));
});

// ============================================================================
// 1B. PUBLIC SIMULATOR CHANNELS: GET /api/v2/simulator/logistics/channels
// ============================================================================
logisticsRouter.get("/api/v2/simulator/logistics/channels", async (_req: Request, res: Response): Promise<void> => {
  const channels = await prisma.logisticsChannel.findMany({
    orderBy: { channelId: "asc" }
  });

  res.json(createShopeeSuccessResponse({
    channels: channels.map((ch) => ({
      channel_id: Number(ch.channelId),
      channel_name: ch.channelName,
      cod_enabled: ch.codEnabled,
      enabled: ch.enabled,
      estimated_shipping_fee: ch.channelId === BigInt(30004) ? 40000 : 21500,
      fee_type: ch.feeType
    }))
  }));
});

// ============================================================================
// 2. GET SHIPPING PARAMETER: GET /api/v2/logistics/get_shipping_parameter
// ============================================================================
logisticsRouter.get("/api/v2/logistics/get_shipping_parameter", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);
  const orderSn = req.query.order_sn as string;

  if (!orderSn) {
    res.json(createShopeeErrorResponse("error_param", "order_sn is required"));
    return;
  }

  const order = await prisma.order.findFirst({
    where: { orderSn, shopId }
  });

  if (!order) {
    res.json(createShopeeErrorResponse("error_param", "Order not found"));
    return;
  }

  // Fetch shop pickup addresses
  const addresses = await prisma.shopAddress.findMany({
    where: { shopId }
  });

  const tomorrow = Math.floor(Date.now() / 1000) + 86400;

  const addressList = addresses.map((addr) => ({
    address_id: Number(addr.addressId),
    region: addr.region,
    state: addr.state,
    city: addr.city,
    address: addr.address,
    district: addr.district,
    zipcode: addr.zipcode,
    time_slot_list: [
      {
        pickup_time_id: "slot_morning",
        date: tomorrow,
        time_text: "09:00 - 12:00"
      },
      {
        pickup_time_id: "slot_afternoon",
        date: tomorrow,
        time_text: "14:00 - 18:00"
      }
    ]
  }));

  res.json(createShopeeSuccessResponse({
    info_needed: {
      dropoff: ["branch_id"],
      pickup: ["address_id", "pickup_time_id"],
      non_integrated: []
    },
    dropoff: {
      branch_list: [
        {
          branch_id: 101,
          region: "VN",
          state: "Ho Chi Minh",
          city: "Ho Chi Minh City",
          address: "Shopee Xpress Dropoff Point 01, District 1",
          zipcode: "700000",
          district: "District 1"
        }
      ]
    },
    pickup: {
      address_list: addressList
    }
  }));
});

// ============================================================================
// 3. SHIP ORDER (INIT LOGISTICS): POST /api/v2/logistics/ship_order
// ============================================================================
logisticsRouter.post("/api/v2/logistics/ship_order", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const { order_sn, package_number, pickup, dropoff } = req.body || {};

  if (!order_sn) {
    res.json(createShopeeErrorResponse("error_param", "order_sn is required"));
    return;
  }

  const order = await prisma.order.findFirst({
    where: { orderSn: order_sn, shopId },
    include: { packages: true }
  });

  if (!order) {
    res.json(createShopeeErrorResponse("error_param", "Order not found"));
    return;
  }

  if (order.orderStatus === OrderStatus.CANCELLED) {
    res.json(createShopeeErrorResponse("error_param", "Order is already cancelled"));
    return;
  }

  // Generate unique tracking number (e.g. SPXVN + 9 random digits)
  const randomSuffix = Math.floor(100000000 + Math.random() * 900000000);
  const trackingNumber = `SPXVN${randomSuffix}`;
  const shippingType = pickup ? "pickup" : "dropoff";

  // Target specific package or default package
  let targetPkg = order.packages[0];
  if (package_number) {
    const found = order.packages.find(p => p.packageNumber === package_number);
    if (found) targetPkg = found;
  }

  if (targetPkg) {
    await prisma.orderPackage.update({
      where: { packageNumber: targetPkg.packageNumber },
      data: {
        trackingNumber,
        logisticsStatus: "LOGISTICS_REQUEST_CREATED",
        shippingType,
        documentStatus: "NOT_CREATED"
      }
    });
  } else {
    const newPkgNum = package_number || `PKG-${order.orderSn}`;
    await prisma.orderPackage.create({
      data: {
        packageNumber: newPkgNum,
        orderSn: order.orderSn,
        trackingNumber,
        logisticsStatus: "LOGISTICS_REQUEST_CREATED",
        shippingType,
        documentStatus: "NOT_CREATED"
      }
    });
  }

  // Transition Order status from READY_TO_SHIP to PROCESSED
  await prisma.order.update({
    where: { orderSn: order.orderSn },
    data: { orderStatus: OrderStatus.PROCESSED }
  });

  // Asynchronously dispatch order_status_push (Code 3) and order_trackingno_push (Code 4)
  const shop = await prisma.shop.findUnique({ where: { shopId } });
  if (shop) {
    WebhookService.dispatch({
      partnerId: shop.partnerId,
      pushCode: 3,
      shopId,
      ordersn: order.orderSn,
      payload: {
        shop_id: Number(shopId),
        code: 3,
        timestamp: Math.floor(Date.now() / 1000),
        data: {
          ordersn: order.orderSn,
          status: "PROCESSED",
          update_time: Math.floor(Date.now() / 1000)
        }
      }
    }).catch(err => console.warn("[WebhookTrigger] ship_order status push failed:", err.message));

    WebhookService.dispatch({
      partnerId: shop.partnerId,
      pushCode: 4,
      shopId,
      ordersn: order.orderSn,
      payload: {
        shop_id: Number(shopId),
        code: 4,
        timestamp: Math.floor(Date.now() / 1000),
        data: {
          ordersn: order.orderSn,
          tracking_no: trackingNumber
        }
      }
    }).catch(err => console.warn("[WebhookTrigger] ship_order tracking push failed:", err.message));
  }

  res.json(createShopeeSuccessResponse({}));
});

// ============================================================================
// 4. GET TRACKING NUMBER: GET /api/v2/logistics/get_tracking_number
// ============================================================================
logisticsRouter.get("/api/v2/logistics/get_tracking_number", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);
  const orderSn = req.query.order_sn as string;
  const packageNumber = req.query.package_number as string | undefined;

  if (!orderSn) {
    res.json(createShopeeErrorResponse("error_param", "order_sn is required"));
    return;
  }

  const order = await prisma.order.findFirst({
    where: { orderSn, shopId },
    include: { packages: true }
  });

  if (!order) {
    res.json(createShopeeErrorResponse("error_param", "Order not found"));
    return;
  }

  let pkg = order.packages[0];
  if (packageNumber && packageNumber !== "-" && packageNumber !== "") {
    const found = order.packages.find(p => p.packageNumber === packageNumber);
    if (found) pkg = found;
  }

  const trackingNumber = pkg?.trackingNumber || "";

  res.json(createShopeeSuccessResponse({
    tracking_number: trackingNumber,
    first_mile_tracking_number: trackingNumber ? `FM${trackingNumber}` : "",
    last_mile_tracking_number: trackingNumber
  }));
});

// ============================================================================
// 5. CREATE SHIPPING DOCUMENT: POST /api/v2/logistics/create_shipping_document
// ============================================================================
logisticsRouter.post("/api/v2/logistics/create_shipping_document", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const { order_list } = req.body || {};

  if (!Array.isArray(order_list) || order_list.length === 0) {
    res.json(createShopeeErrorResponse("error_param", "order_list is required"));
    return;
  }

  const resultList = [];
  for (const item of order_list) {
    const order = await prisma.order.findFirst({
      where: { orderSn: item.order_sn, shopId },
      include: { packages: true }
    });

    if (!order) {
      resultList.push({
        order_sn: item.order_sn,
        package_number: item.package_number || "",
        fail_error: "logistics.order_not_exist",
        fail_message: "The order_sn you provided does not exist."
      });
      continue;
    }

    let pkg = order.packages[0];
    if (item.package_number) {
      const found = order.packages.find(p => p.packageNumber === item.package_number);
      if (found) pkg = found;
    }

    if (!pkg || !pkg.trackingNumber) {
      resultList.push({
        order_sn: item.order_sn,
        package_number: item.package_number || "",
        fail_error: "logistics.tracking_number_not_exist",
        fail_message: "Tracking number does not exist. Call ship_order first."
      });
      continue;
    }

    // Set AWB Document status to READY
    await prisma.orderPackage.update({
      where: { packageNumber: pkg.packageNumber },
      data: { documentStatus: "READY" }
    });

    resultList.push({
      order_sn: item.order_sn,
      package_number: pkg.packageNumber,
      status: "READY"
    });
  }

  // Asynchronously dispatch shipping_document_status_push (Push Code 15)
  const shop = await prisma.shop.findUnique({ where: { shopId } });
  if (shop) {
    for (const resItem of resultList) {
      if (resItem.status === "READY") {
        WebhookService.dispatch({
          partnerId: shop.partnerId,
          pushCode: 15,
          shopId,
          ordersn: resItem.order_sn,
          payload: {
            shop_id: Number(shopId),
            code: 15,
            timestamp: Math.floor(Date.now() / 1000),
            data: {
              ordersn: resItem.order_sn,
              status: "READY"
            }
          }
        }).catch(err => console.warn("[WebhookTrigger] AWB ready push failed:", err.message));
      }
    }
  }

  res.json(createShopeeSuccessResponse({
    result_list: resultList
  }));
});

// ============================================================================
// 6. GET SHIPPING DOCUMENT RESULT: POST & GET /api/v2/logistics/get_shipping_document_result
// ============================================================================
const getShippingDocumentResultHandler = async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const orderListParam = req.body?.order_list || (req.query.order_sn ? [{ order_sn: req.query.order_sn }] : []);

  if (!Array.isArray(orderListParam) || orderListParam.length === 0) {
    res.json(createShopeeErrorResponse("error_param", "order_list is required"));
    return;
  }

  const resultList = [];
  for (const item of orderListParam) {
    const order = await prisma.order.findFirst({
      where: { orderSn: item.order_sn, shopId },
      include: { packages: true }
    });

    if (!order) {
      resultList.push({
        order_sn: item.order_sn,
        package_number: item.package_number || "",
        status: "FAILED",
        fail_error: "logistics.order_not_exist",
        fail_message: "The order_sn does not exist."
      });
      continue;
    }

    let pkg = order.packages[0];
    if (item.package_number) {
      const found = order.packages.find(p => p.packageNumber === item.package_number);
      if (found) pkg = found;
    }

    resultList.push({
      order_sn: item.order_sn,
      package_number: pkg?.packageNumber || "",
      status: pkg?.documentStatus || "NOT_CREATED"
    });
  }

  res.json(createShopeeSuccessResponse({
    result_list: resultList
  }));
};

logisticsRouter.post("/api/v2/logistics/get_shipping_document_result", shopeeAuthGuard, getShippingDocumentResultHandler);
logisticsRouter.get("/api/v2/logistics/get_shipping_document_result", shopeeAuthGuard, getShippingDocumentResultHandler);

// ============================================================================
// 7. DOWNLOAD SHIPPING DOCUMENT: POST & GET /api/v2/logistics/download_shipping_document
// ============================================================================
const downloadShippingDocumentHandler = async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const orderListParam = req.body?.order_list || (req.query.order_sn ? [{ order_sn: req.query.order_sn }] : []);
  if (!Array.isArray(orderListParam) || orderListParam.length === 0) {
    res.status(400).json(createShopeeErrorResponse("error_param", "order_list is required"));
    return;
  }

  const target = orderListParam[0];
  const order = await prisma.order.findFirst({
    where: { orderSn: target.order_sn, shopId },
    include: { packages: true }
  });

  if (!order) {
    res.status(404).json(createShopeeErrorResponse("error_param", "Order not found"));
    return;
  }

  let pkg = order.packages[0];
  if (target.package_number) {
    const found = order.packages.find(p => p.packageNumber === target.package_number);
    if (found) pkg = found;
  }

  if (!pkg || pkg.documentStatus !== "READY") {
    res.status(400).json(createShopeeErrorResponse("error_param", "Shipping document is not ready. Call create_shipping_document first."));
    return;
  }

  const pdfBuffer = generateShopeeAwbPdf({
    orderSn: order.orderSn,
    trackingNumber: pkg.trackingNumber || "SPXVN_PENDING",
    shippingCarrier: order.shippingCarrier,
    recipientName: order.recipientName,
    recipientAddress: order.recipientAddress,
    packageNumber: pkg.packageNumber
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="awb_${order.orderSn}.pdf"`);
  res.setHeader("Content-Length", pdfBuffer.length);
  res.send(pdfBuffer);
};

logisticsRouter.post("/api/v2/logistics/download_shipping_document", shopeeAuthGuard, downloadShippingDocumentHandler);
logisticsRouter.get("/api/v2/logistics/download_shipping_document", shopeeAuthGuard, downloadShippingDocumentHandler);

// ============================================================================
// 10. CALCULATE SHIPPING FEE: POST /api/v2/logistics/calculate_shipping_fee
// ============================================================================
logisticsRouter.post("/api/v2/logistics/calculate_shipping_fee", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const { channel_id = 30001, items = [], recipient_address, recipient_city } = req.body || {};

  const shopAddress = await prisma.shopAddress.findFirst({
    where: { shopId }
  });
  const originCity = shopAddress?.city || "Ho Chi Minh City";
  const destinationCity = recipient_city || recipient_address?.city || "Ho Chi Minh City";

  const itemIds = (items as any[]).map(i => i.item_id ? BigInt(i.item_id) : null).filter(Boolean) as bigint[];
  const products = await prisma.product.findMany({
    where: { itemId: { in: itemIds } }
  });

  let itemsSubtotal = 0;
  const weightInputs = (items as any[]).map(it => {
    const prod = products.find(p => p.itemId === BigInt(it.item_id));
    const price = it.item_price !== undefined ? Number(it.item_price) : (prod ? Number(prod.originalPrice) : 100000);
    const qty = Number(it.quantity || it.quantity_purchased || 1);
    itemsSubtotal += price * qty;

    return {
      weightKg: prod ? Number(prod.weight) : 0.5,
      dimensions: (prod?.dimensionsJson as any) || { length: 20, width: 15, height: 10 },
      quantity: qty
    };
  });

  const weightResult = LogisticsEngine.calculatePackageWeight(weightInputs);
  const zone = LogisticsEngine.resolveShippingZone(originCity, destinationCity);
  const quotes = LogisticsEngine.quoteAllChannels(originCity, destinationCity, weightResult.chargeableWeightGram, itemsSubtotal);

  const channelFee = LogisticsEngine.calculateChannelFee(Number(channel_id), zone, weightResult.chargeableWeightGram);
  const rebate = channelFee.enabled ? LogisticsEngine.calculateFreeshipRebate(itemsSubtotal, channelFee.actualFee) : 0;
  const buyerPaid = channelFee.enabled ? Math.max(0, channelFee.actualFee - rebate) : 0;

  res.json(createShopeeSuccessResponse({
    shop_id: Number(shopId),
    shop_city: originCity,
    buyer_city: destinationCity,
    shipping_zone: zone,
    zone,
    logistics_channel_id: Number(channel_id),
    shipping_carrier: channelFee.carrierName,
    service_type: channelFee.serviceType,
    actual_weight_gram: weightResult.actualWeightGram,
    volumetric_weight_gram: weightResult.volumetricWeightGram,
    chargeable_weight_gram: weightResult.chargeableWeightGram,
    estimated_shipping_fee: channelFee.actualFee,
    actual_shipping_fee: channelFee.actualFee,
    shopee_shipping_rebate: rebate,
    seller_shipping_discount: 0,
    buyer_paid_shipping_fee: buyerPaid,
    estimated_delivery_days: channelFee.estimatedDays,
    channels: quotes
  }));
});

// ============================================================================
// 11. SIMULATOR CALCULATE FEE HELPER: POST /api/v2/simulator/logistics/calculate_fee
// ============================================================================
logisticsRouter.post("/api/v2/simulator/logistics/calculate_fee", async (req: Request, res: Response): Promise<void> => {
  const { shop_id = 727720655, buyer_id = 1001, recipient_city, items = [] } = req.body || {};
  const shopId = BigInt(shop_id);

  const shopAddress = await prisma.shopAddress.findFirst({ where: { shopId } });
  const originCity = shopAddress?.city || (Number(shop_id) === 839910244 ? "Hà Nội" : "Ho Chi Minh City");

  let destinationCity = recipient_city;
  if (!destinationCity) {
    if (Number(buyer_id) === 1002) destinationCity = "Hà Nội";
    else if (Number(buyer_id) === 1003) destinationCity = "Đà Nẵng";
    else destinationCity = "Ho Chi Minh City";
  }

  const itemIds = (items as any[]).map(i => i.item_id ? BigInt(i.item_id) : null).filter(Boolean) as bigint[];
  const products = await prisma.product.findMany({
    where: { itemId: { in: itemIds } }
  });

  let itemsSubtotal = 0;
  const weightInputs = (items as any[]).map(it => {
    const prod = products.find(p => p.itemId === BigInt(it.item_id));
    const price = it.item_price !== undefined ? Number(it.item_price) : (prod ? Number(prod.originalPrice) : 100000);
    const qty = Number(it.quantity || it.quantity_purchased || 1);
    itemsSubtotal += price * qty;

    return {
      weightKg: prod ? Number(prod.weight) : 0.5,
      dimensions: (prod?.dimensionsJson as any) || { length: 20, width: 15, height: 10 },
      quantity: qty
    };
  });

  const weightResult = LogisticsEngine.calculatePackageWeight(weightInputs);
  const zone = LogisticsEngine.resolveShippingZone(originCity, destinationCity);
  const quotes = LogisticsEngine.quoteAllChannels(originCity, destinationCity, weightResult.chargeableWeightGram, itemsSubtotal);

  res.json(createShopeeSuccessResponse({
    shop_id: Number(shopId),
    shop_city: originCity,
    buyer_city: destinationCity,
    zone,
    items_subtotal: itemsSubtotal,
    actual_weight_gram: weightResult.actualWeightGram,
    volumetric_weight_gram: weightResult.volumetricWeightGram,
    chargeable_weight_gram: weightResult.chargeableWeightGram,
    channels: quotes
  }));
});
