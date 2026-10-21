import { Router, Request, Response } from "express";
import { prisma } from "../../common/prisma";
import { createShopeeSuccessResponse, createShopeeErrorResponse } from "../../common/utils/envelope";
import { shopeeAuthGuard } from "../../common/middleware/auth-guard";
import { OrderStatus } from "@prisma/client";

export const paymentRouter = Router();

// ============================================================================
// ============================================================================
// REVERSE SHIPPING FEE POLICY (Official Shopee Vietnam Policy from 01/04/2025)
// ============================================================================
export function calculateReverseShippingFee(order: any, returnReq: any): number {
  if (!returnReq) return 0;

  // 1. Exemption: NOT_RECEIVED reason (Chưa nhận được hàng)
  if (returnReq.reason === "NOT_RECEIVED" || returnReq.reason === "NOT_RECEIPT") {
    return 0;
  }

  // 2. Exemption: Refund Only (Hoàn tiền ngay, không yêu cầu trả hàng)
  if (returnReq.solution === "REFUND" || returnReq.needsLogistics === false) {
    return 0;
  }

  // 3. Exemption: Carrier or Platform compensation
  if (returnReq.compensationStatus === "COMPENSATION_APPROVED") {
    return 0;
  }

  // 4. Exemption: Partial return (Shopee waives/reimburses return shipping fee for partial returns)
  if (returnReq.refundAmount && order.totalAmount && Number(returnReq.refundAmount) < Number(order.totalAmount)) {
    return 0;
  }

  // Channel rate cap:
  // - Instant / Same-Day (channelId 30004 or carrier SPX Instant): max 20,000 VND
  // - Standard shipping (all other channels): max 40,000 VND
  const isInstant =
    order.channelId === BigInt(30004) ||
    (order.shippingCarrier && order.shippingCarrier.toLowerCase().includes("instant"));

  return isInstant ? 20000 : 40000;
}

// ============================================================================
// HELPER: BUILD ITEMIZED ORDER INCOME BREAKDOWN
// ============================================================================
export function buildOrderIncomeBreakdown(order: any) {
  const itemsSubtotal = order.items.reduce(
    (sum: number, it: any) => sum + Number(it.itemPrice) * it.quantityPurchased,
    0
  );

  const buyerTotal = Number(order.totalAmount);
  const voucherSeller = Number(order.voucherFromSeller || 0);
  const voucherShopee = Number(order.voucherFromShopee || 0);
  const buyerShipping = Number(order.buyerPaidShippingFee || 0);
  const actualShipping = Number(order.actualShippingFee || 0);

  const acceptedReturns = (order.returns || []).filter((r: any) => r.status === "ACCEPTED");
  const totalReturnRefund = acceptedReturns.reduce((sum: number, r: any) => sum + Number(r.refundAmount || 0), 0);
  const sellerReturnRefund = totalReturnRefund > 0 ? -totalReturnRefund : 0;

  // Calculate reverse shipping fees:
  const totalReverseShippingFee = acceptedReturns.reduce((sum: number, r: any) => {
    const fee = r.reverseShippingFee !== undefined && r.reverseShippingFee !== null
      ? Number(r.reverseShippingFee)
      : calculateReverseShippingFee(order, r);
    return sum + fee;
  }, 0);

  const hasNotReceivedReturn = acceptedReturns.some(
    (r: any) => r.reason === "NOT_RECEIVED" || r.reason === "NOT_RECEIPT"
  );

  let commissionFee = Number(order.commissionFee || Math.round(itemsSubtotal * 0.02));
  let serviceFee = Number(order.serviceFee || (voucherShopee > 0 ? Math.round(itemsSubtotal * 0.015) : 0));
  let transactionFee = Number(order.sellerTransactionFee || Math.round(buyerTotal * 0.025));

  if (acceptedReturns.length > 0) {
    if (hasNotReceivedReturn) {
      // Reason: "Chưa nhận được hàng" -> Seller NOT charged service fee, fixed fee, or transaction fee!
      commissionFee = 0;
      serviceFee = 0;
      transactionFee = 0;
    } else {
      // Reason: "Hàng có vấn đề" or "Đổi ý":
      // Seller still bears transaction fee for the order!
      // Fixed fee and service fee apply only to retained value (0 if 100% refunded)
      const retainedSubtotal = Math.max(0, itemsSubtotal - totalReturnRefund);
      commissionFee = Math.round(retainedSubtotal * 0.02);
      serviceFee = voucherShopee > 0 ? Math.round(retainedSubtotal * 0.015) : 0;
    }
  }

  const calculatedEscrow = Number(
    order.escrowAmount !== null && order.escrowAmount !== undefined
      ? order.escrowAmount
      : (
          itemsSubtotal - voucherSeller + buyerShipping - actualShipping + voucherShopee
          - totalReturnRefund
          - totalReverseShippingFee
          - commissionFee
          - serviceFee
          - transactionFee
        )
  );

  const itemsBreakdown = order.items.map((it: any) => ({
    item_id: Number(it.itemId),
    item_name: it.itemName,
    item_sku: it.product?.itemSku || "",
    model_id: it.modelId ? Number(it.modelId) : 0,
    model_name: it.modelName || "",
    model_sku: it.modelSku || "",
    line_item_id: Number(it.orderItemId),
    original_price: Number(it.product?.originalPrice || it.itemPrice),
    selling_price: Number(it.itemPrice),
    discounted_price: Number(it.itemPrice),
    seller_discount: Math.max(0, Number(it.product?.originalPrice || it.itemPrice) - Number(it.itemPrice)),
    shopee_discount: 0,
    discount_from_coin: 0,
    discount_from_voucher_shopee: 0,
    discount_from_voucher_seller: voucherSeller > 0 ? voucherSeller / order.items.length : 0,
    activity_type: "",
    activity_id: 0,
    is_main_item: false,
    quantity_purchased: it.quantityPurchased
  }));

  return {
    order_income: {
      escrow_amount: calculatedEscrow,
      buyer_total_amount: buyerTotal,
      order_original_price: itemsSubtotal,
      original_price: itemsSubtotal,
      order_discounted_price: itemsSubtotal - voucherSeller,
      order_selling_price: itemsSubtotal,
      order_seller_discount: voucherSeller,
      seller_discount: voucherSeller,
      shopee_discount: 0,
      voucher_from_seller: voucherSeller,
      voucher_from_shopee: voucherShopee,
      voucher_from_external_party: 0,
      coins: 0,
      buyer_paid_shipping_fee: buyerShipping,
      buyer_transaction_fee: 0,
      cross_border_tax: 0,
      payment_promotion: 0,
      commission_fee: commissionFee,
      service_fee: serviceFee,
      seller_transaction_fee: transactionFee,
      seller_lost_compensation: 0,
      seller_coin_cash_back: 0,
      escrow_tax: 0,
      estimated_shipping_fee: actualShipping,
      final_shipping_fee: buyerShipping - actualShipping,
      actual_shipping_fee: actualShipping,
      shipping_fee_sst: 0,
      order_chargeable_weight: 500,
      shopee_shipping_rebate: voucherShopee,
      shipping_fee_discount_from_3pl: 0,
      seller_shipping_discount: 0,
      seller_voucher_code: [],
      drc_adjustable_refund: 0,
      cost_of_goods_sold: itemsSubtotal,
      original_cost_of_goods_sold: itemsSubtotal,
      original_shopee_discount: 0,
      seller_return_refund: sellerReturnRefund,
      reverse_shipping_fee: totalReverseShippingFee,
      final_return_to_seller_shipping_fee: totalReverseShippingFee,
      buyer_payment_method: order.paymentMethod || "ShopeePay",
      items: itemsBreakdown
    }
  };
}

// ============================================================================
// 1. GET ESCROW DETAIL: POST & GET /api/v2/payment/get_escrow_detail
// ============================================================================
async function handleGetEscrowDetail(req: Request, res: Response): Promise<void> {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const orderSn = (req.body?.order_sn as string) || (req.query.order_sn as string);

  if (!orderSn) {
    res.json(createShopeeErrorResponse("error_param", "order_sn is required"));
    return;
  }

  const order = await prisma.order.findFirst({
    where: {
      orderSn,
      shopId
    },
    include: {
      items: {
        include: {
          product: true,
          productModel: true
        }
      },
      shop: true,
      returns: true
    }
  });

  if (!order) {
    res.json(createShopeeErrorResponse("error_param", "The information you queried is not found."));
    return;
  }

  const breakdown = buildOrderIncomeBreakdown(order);

  res.json(createShopeeSuccessResponse({
    order_sn: order.orderSn,
    buyer_user_name: order.buyerUsername,
    return_order_sn_list: (order.returns || []).map((r: any) => r.returnSn),
    order_income: breakdown.order_income
  }));
}

paymentRouter.post("/api/v2/payment/get_escrow_detail", shopeeAuthGuard, handleGetEscrowDetail);
paymentRouter.get("/api/v2/payment/get_escrow_detail", shopeeAuthGuard, handleGetEscrowDetail);

// ============================================================================
// 2. GET ESCROW DETAIL BATCH: POST /api/v2/payment/get_escrow_detail_batch
// ============================================================================
paymentRouter.post("/api/v2/payment/get_escrow_detail_batch", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const orderSnList = req.body?.order_sn_list as string[];

  if (!orderSnList || !Array.isArray(orderSnList) || orderSnList.length === 0) {
    res.json(createShopeeErrorResponse("error_param", "order_sn_list must be a non-empty array"));
    return;
  }

  if (orderSnList.length > 50) {
    res.json(createShopeeErrorResponse("error_param", "order_sn_list exceeds maximum limit of 50 orders"));
    return;
  }

  const orders = await prisma.order.findMany({
    where: {
      orderSn: { in: orderSnList },
      shopId
    },
    include: {
      items: {
        include: {
          product: true,
          productModel: true
        }
      },
      shop: true,
      returns: true
    }
  });

  const orderMap = new Map(orders.map(o => [o.orderSn, o]));
  const escrowDetails = orderSnList
    .map(sn => orderMap.get(sn))
    .filter((o): o is NonNullable<typeof o> => Boolean(o))
    .map(order => {
      const breakdown = buildOrderIncomeBreakdown(order);
      return {
        escrow_detail: {
          order_sn: order.orderSn,
          buyer_user_name: order.buyerUsername,
          return_order_sn_list: (order.returns || []).map((r: any) => r.returnSn),
          order_income: breakdown.order_income
        }
      };
    });

  res.json(createShopeeSuccessResponse(escrowDetails));
});

// ============================================================================
// 3. GET ESCROW LIST: POST & GET /api/v2/payment/get_escrow_list
// ============================================================================
async function handleGetEscrowList(req: Request, res: Response): Promise<void> {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const releaseTimeFromRaw = req.query.release_time_from || req.body?.release_time_from;
  const releaseTimeToRaw = req.query.release_time_to || req.body?.release_time_to;
  const pageSize = parseInt(String(req.query.page_size || req.body?.page_size || "40"), 10);
  const pageNo = parseInt(String(req.query.page_no || req.body?.page_no || "1"), 10);

  if (releaseTimeFromRaw === undefined || releaseTimeToRaw === undefined) {
    res.json(createShopeeErrorResponse("error_param", "release_time_from and release_time_to are required"));
    return;
  }

  const fromTimestamp = Number(releaseTimeFromRaw);
  const toTimestamp = Number(releaseTimeToRaw);

  const fromDate = new Date(fromTimestamp * 1000);
  const toDate = new Date(toTimestamp * 1000);

  const whereClause: any = {
    shopId,
    orderStatus: OrderStatus.COMPLETED,
    escrowReleaseTime: {
      gte: fromDate,
      lte: toDate
    }
  };

  const totalCount = await prisma.order.count({ where: whereClause });
  const orders = await prisma.order.findMany({
    where: whereClause,
    orderBy: { escrowReleaseTime: "desc" },
    skip: (pageNo - 1) * pageSize,
    take: pageSize
  });

  const escrowList = orders.map(o => ({
    order_sn: o.orderSn,
    payout_amount: Number(o.escrowAmount || 0),
    escrow_release_time: o.escrowReleaseTime ? Math.floor(o.escrowReleaseTime.getTime() / 1000) : Math.floor(o.updatedAt.getTime() / 1000)
  }));

  const more = (pageNo * pageSize) < totalCount;

  res.json(createShopeeSuccessResponse({
    more,
    escrow_list: escrowList
  }));
}

paymentRouter.get("/api/v2/payment/get_escrow_list", shopeeAuthGuard, handleGetEscrowList);
paymentRouter.post("/api/v2/payment/get_escrow_list", shopeeAuthGuard, handleGetEscrowList);

// ============================================================================
// 4. GET INCOME OVERVIEW: GET /api/v2/payment/get_income_overview
// ============================================================================
paymentRouter.get("/api/v2/payment/get_income_overview", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const incomeStatusRaw = req.query.income_status as string | undefined;
  const incomeStatus = incomeStatusRaw ? parseInt(incomeStatusRaw, 10) : undefined;

  // Query all non-cancelled orders for shop, including returns
  const orders = await prisma.order.findMany({
    where: {
      shopId,
      orderStatus: { not: OrderStatus.CANCELLED }
    },
    include: { returns: true }
  });

  let releasedAmount = 0;
  let pendingAmount = 0;

  for (const o of orders) {
    const amount = Number(o.escrowAmount || 0);
    const hasAcceptedReturn = (o.returns || []).some((r: any) => r.status === "ACCEPTED");
    const isFullyRefunded = hasAcceptedReturn && (amount <= 0 || (o.returns || []).some((r: any) => Number(r.refundAmount) >= Number(o.totalAmount)));
    const isToReturn = o.orderStatus === OrderStatus.TO_RETURN;

    if (o.orderStatus === OrderStatus.COMPLETED && !isFullyRefunded) {
      releasedAmount += amount;
    } else if (!isToReturn && !isFullyRefunded) {
      pendingAmount += amount;
    }
  }

  const totalIncome: Record<string, number> = {};

  if (incomeStatus === 1) {
    // 1: Released
    totalIncome.released_amount = releasedAmount;
  } else if (incomeStatus === 2) {
    // 2: Pending
    totalIncome.pending_amount = pendingAmount;
  } else {
    // All
    totalIncome.pending_amount = pendingAmount;
    totalIncome.to_release_amount = 0;
    totalIncome.released_amount = releasedAmount;
  }

  res.json(createShopeeSuccessResponse({
    total_income: totalIncome
  }));
});

// ============================================================================
// 5. SIMULATOR PUBLIC HELPER: GET /api/v2/simulator/payment/overview
// ============================================================================
paymentRouter.get("/api/v2/simulator/payment/overview", async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  if (!shopIdStr) {
    res.json(createShopeeErrorResponse("error_param", "shop_id is required"));
    return;
  }

  const shopId = BigInt(shopIdStr);
  const orders = await prisma.order.findMany({
    where: { shopId },
    orderBy: { createdAt: "desc" },
    include: { items: true, returns: true }
  });

  let releasedAmount = 0;
  let pendingAmount = 0;
  let totalCommissionFees = 0;
  let totalServiceFees = 0;
  let totalTransactionFees = 0;
  let totalReverseShippingFees = 0;
  let settledOrdersCount = 0;
  let returnedOrdersCount = 0;

  const orderLedger = orders.map(o => {
    const isCompleted = o.orderStatus === OrderStatus.COMPLETED;
    const isCancelled = o.orderStatus === OrderStatus.CANCELLED;
    const isToReturn = o.orderStatus === OrderStatus.TO_RETURN;
    const acceptedReturns = (o.returns || []).filter((r: any) => r.status === "ACCEPTED");
    const activeReturns = (o.returns || []).filter((r: any) => ["REQUESTED", "JUDGING", "PROCESSING", "SELLER_DISPUTE"].includes(r.status));
    const hasAcceptedReturn = acceptedReturns.length > 0;
    const hasActiveReturn = activeReturns.length > 0;
    const totalRefundAmount = acceptedReturns.reduce((sum: number, r: any) => sum + Number(r.refundAmount || 0), 0);
    const isFullyRefunded = hasAcceptedReturn && (totalRefundAmount >= Number(o.totalAmount) || Number(o.escrowAmount || 0) <= 0);

    const totalReverseShippingFee = acceptedReturns.reduce((sum: number, r: any) => {
      const fee = r.reverseShippingFee !== undefined && r.reverseShippingFee !== null
        ? Number(r.reverseShippingFee)
        : calculateReverseShippingFee(o, r);
      return sum + fee;
    }, 0);

    const hasNotReceivedReturn = acceptedReturns.some(
      (r: any) => r.reason === "NOT_RECEIVED" || r.reason === "NOT_RECEIPT"
    );

    const escrow = Number(o.escrowAmount !== null && o.escrowAmount !== undefined ? o.escrowAmount : 0);
    const comm = Number(o.commissionFee || 0);
    const serv = Number(o.serviceFee || 0);
    const tran = Number(o.sellerTransactionFee || 0);

    const orderPlatformFees = isFullyRefunded
      ? (hasNotReceivedReturn ? 0 : tran)
      : (comm + serv + tran);

    if (hasAcceptedReturn) {
      returnedOrdersCount += 1;
      totalReverseShippingFees += totalReverseShippingFee;
    }

    // Only count as settled sold order if COMPLETED and NOT fully refunded!
    if (isCompleted && !isFullyRefunded) {
      releasedAmount += escrow;
      totalCommissionFees += comm;
      totalServiceFees += serv;
      totalTransactionFees += tran;
      settledOrdersCount += 1;
    } else if (!isCancelled && !isToReturn && !isFullyRefunded) {
      pendingAmount += escrow;
    }

    return {
      order_sn: o.orderSn,
      buyer_username: o.buyerUsername,
      order_status: o.orderStatus,
      total_amount: Number(o.totalAmount),
      voucher_from_seller: Number(o.voucherFromSeller || 0),
      voucher_from_shopee: Number(o.voucherFromShopee || 0),
      buyer_paid_shipping_fee: Number(o.buyerPaidShippingFee || 0),
      actual_shipping_fee: Number(o.actualShippingFee || 0),
      commission_fee: comm,
      service_fee: serv,
      seller_transaction_fee: tran,
      total_platform_fees: orderPlatformFees,
      reverse_shipping_fee: totalReverseShippingFee,
      has_not_received_return: hasNotReceivedReturn,
      escrow_amount: escrow,
      escrow_release_time: o.escrowReleaseTime ? Math.floor(o.escrowReleaseTime.getTime() / 1000) : null,
      created_at: Math.floor(o.createdAt.getTime() / 1000),
      has_return: (o.returns || []).length > 0,
      has_accepted_return: hasAcceptedReturn,
      has_active_return: hasActiveReturn,
      is_fully_refunded: isFullyRefunded,
      refund_amount: totalRefundAmount,
      seller_return_refund: -totalRefundAmount,
      return_sn: (o.returns || [])[0]?.returnSn || null,
      return_status: (o.returns || [])[0]?.status || null
    };
  });

  res.json(createShopeeSuccessResponse({
    summary: {
      released_amount: releasedAmount,
      pending_amount: pendingAmount,
      total_platform_fees: totalCommissionFees + totalServiceFees + totalTransactionFees,
      total_reverse_shipping_fees: totalReverseShippingFees,
      settled_orders_count: settledOrdersCount,
      returned_orders_count: returnedOrdersCount,
      total_orders_count: orders.length
    },
    ledger: orderLedger
  }));
});

paymentRouter.get("/api/v2/simulator/payment/escrow_detail", async (req: Request, res: Response): Promise<void> => {
  const orderSn = req.query.order_sn as string;
  if (!orderSn) {
    res.json(createShopeeErrorResponse("error_param", "order_sn is required"));
    return;
  }

  const order = await prisma.order.findUnique({
    where: { orderSn },
    include: {
      items: {
        include: {
          product: true,
          productModel: true
        }
      },
      shop: true,
      returns: true
    }
  });

  if (!order) {
    res.json(createShopeeErrorResponse("error_param", "Order not found"));
    return;
  }

  const breakdown = buildOrderIncomeBreakdown(order);
  res.json(createShopeeSuccessResponse({
    order_sn: order.orderSn,
    buyer_user_name: order.buyerUsername,
    return_order_sn_list: [],
    order_income: breakdown.order_income
  }));
});

