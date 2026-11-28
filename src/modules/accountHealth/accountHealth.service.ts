import { OrderStatus } from "@prisma/client";
import { prisma } from "../../common/prisma";

const DAY_MS = 24 * 60 * 60 * 1000;

function quarterStartUtc(now: Date): Date {
  const qMonth = Math.floor(now.getUTCMonth() / 3) * 3;
  return new Date(Date.UTC(now.getUTCFullYear(), qMonth, 1, 0, 0, 0, 0));
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function isLateOrder(order: any, now: Date): boolean {
  const deadline = order.shipByDate || new Date(order.createdAt.getTime() + 2 * DAY_MS);
  const pickupTime = order.packages?.[0]?.pickupTime as Date | null | undefined;
  if (pickupTime) {
    return pickupTime.getTime() > deadline.getTime();
  }
  if (order.orderStatus === OrderStatus.READY_TO_SHIP || order.orderStatus === OrderStatus.PROCESSED) {
    return deadline.getTime() < now.getTime();
  }
  return false;
}

function isSellerOrSystemCancel(order: any): boolean {
  return order.orderStatus === OrderStatus.CANCELLED
    && (order.cancelBy === "SELLER" || order.cancelBy === "SYSTEM");
}

function isNonExemptReturn(ret: any): boolean {
  return !ret.isNfrExempt && ret.status !== "CANCELLED";
}

function mapReturnReasonCode(reason: string): number {
  switch (reason) {
    case "NOT_RECEIPT": return 10015;
    case "WRONG_ITEM": return 10016;
    case "ITEM_DAMAGED":
    case "PHYSICAL_DMG": return 10017;
    case "ITEM_MISSING": return 10018;
    case "COUNTERFEIT": return 10019;
    case "FUNCTIONAL_DMG": return 10020;
    default: return 10021;
  }
}

function mapCancelReasonCode(reason: string | null | undefined): number {
  switch (reason) {
    case "OUT_OF_STOCK": return 10005;
    case "UNDELIVERABLE_AREA": return 10006;
    case "CANNOT_SUPPORT_COD": return 10007;
    case "LOGISTICS_PICKUP_FAILED": return 10009;
    default: return 10012;
  }
}

async function computeWindowRates(shopId: bigint, from: Date, to: Date, now: Date) {
  const [orders, returns] = await Promise.all([
    prisma.order.findMany({
      where: {
        shopId,
        orderStatus: { not: OrderStatus.UNPAID },
        createdAt: { gte: from, lt: to }
      },
      include: { packages: true }
    }),
    prisma.return.findMany({
      where: {
        shopId,
        createdAt: { gte: from, lt: to }
      }
    })
  ]);

  const totalOrders = orders.length;
  const lateOrders = orders.filter(o => isLateOrder(o, now));
  const sellerCancels = orders.filter(isSellerOrSystemCancel);
  const nonExemptReturns = returns.filter(isNonExemptReturn);

  const lsr = totalOrders > 0 ? round1((lateOrders.length / totalOrders) * 100) : 0;
  const crr = totalOrders > 0 ? round1((sellerCancels.length / totalOrders) * 100) : 0;
  const rrr = totalOrders > 0 ? round1((nonExemptReturns.length / totalOrders) * 100) : 0;
  const nfr = totalOrders > 0 ? round1(((sellerCancels.length + nonExemptReturns.length) / totalOrders) * 100) : 0;

  return { lsr, nfr, crr, rrr, lateOrders, sellerCancels, nonExemptReturns };
}

export async function getShopPerformance(shopId: bigint, now = new Date()) {
  const currentStart = new Date(now.getTime() - 7 * DAY_MS);
  const prevStart = new Date(now.getTime() - 14 * DAY_MS);

  const [curr, prev, products, shop] = await Promise.all([
    computeWindowRates(shopId, currentStart, now, now),
    computeWindowRates(shopId, prevStart, currentStart, now),
    prisma.product.findMany({
      where: { shopId, itemStatus: { not: "DELETED" } },
      select: { itemStatus: true, isPreorder: true }
    }),
    prisma.shop.findUnique({ where: { shopId }, select: { rating: true } })
  ]);

  const normalProducts = products.filter(p => p.itemStatus === "NORMAL");
  const preorderCount = normalProducts.filter(p => p.isPreorder).length;
  const preorderPct = normalProducts.length > 0 ? round1((preorderCount / normalProducts.length) * 100) : 0;
  const severeViolations = products.filter(p => p.itemStatus === "BANNED").length;
  const otherViolations = products.filter(p => p.itemStatus === "UNLIST").length;

  const shopRating = shop ? Number(shop.rating) : 5.0;

  const fulfillmentFailed = (curr.nfr >= 10 ? 1 : 0) + (curr.lsr >= 10 ? 1 : 0);
  const listingFailed = (severeViolations > 0 ? 1 : 0) + (preorderPct > 5 ? 1 : 0);
  const customServiceFailed = shopRating < 4.5 ? 1 : 0;
  const totalFailed = fulfillmentFailed + listingFailed + customServiceFailed;

  const rating = totalFailed === 0 ? 4 : totalFailed === 1 ? 3 : totalFailed === 2 ? 2 : 1;

  return {
    overall_performance: {
      rating,
      fulfillment_failed: fulfillmentFailed,
      listing_failed: listingFailed,
      custom_service_failed: customServiceFailed
    },
    metric_list: [
      { metric_type: 1, metric_id: 3, parent_metric_id: 0, metric_name: "non_fulfillment_rate", current_period: curr.nfr, last_period: prev.nfr, unit: 2, target: { value: 10, comparator: "<" } },
      { metric_type: 1, metric_id: 42, parent_metric_id: 3, metric_name: "cancellation_rate", current_period: curr.crr, last_period: prev.crr, unit: 2, target: { value: 5, comparator: "<" } },
      { metric_type: 1, metric_id: 43, parent_metric_id: 3, metric_name: "return_refund_rate", current_period: curr.rrr, last_period: prev.rrr, unit: 2, target: { value: 5, comparator: "<" } },
      { metric_type: 1, metric_id: 1, parent_metric_id: 0, metric_name: "late_shipment_rate", current_period: curr.lsr, last_period: prev.lsr, unit: 2, target: { value: 10, comparator: "<" } },
      { metric_type: 2, metric_id: 52, parent_metric_id: 0, metric_name: "severe_listing_violations", current_period: severeViolations, last_period: severeViolations, unit: 1, target: { value: 0, comparator: "<=" } },
      { metric_type: 2, metric_id: 12, parent_metric_id: 0, metric_name: "pre_order_listing_rate", current_period: preorderPct, last_period: preorderPct, unit: 2, target: { value: 5, comparator: "<=" } },
      { metric_type: 2, metric_id: 53, parent_metric_id: 0, metric_name: "other_listing_violations", current_period: otherViolations, last_period: otherViolations, unit: 1, target: { value: 0, comparator: "<=" } },
      { metric_type: 3, metric_id: 22, parent_metric_id: 0, metric_name: "shop_rating", current_period: shopRating, last_period: shopRating, unit: 1, target: { value: 4.5, comparator: ">=" } }
    ]
  };
}

export async function getPenaltyPointHistory(shopId: bigint, pageNo: number, pageSize: number, violationType?: number, now = new Date()) {
  const qStart = quarterStartUtc(now);
  const where: any = { shopId, issueTime: { gte: qStart } };
  if (violationType !== undefined && !Number.isNaN(violationType)) {
    where.violationType = violationType;
  }

  const [totalCount, rows] = await Promise.all([
    prisma.shopPenaltyPoint.count({ where }),
    prisma.shopPenaltyPoint.findMany({
      where,
      orderBy: { issueTime: "desc" },
      skip: (pageNo - 1) * pageSize,
      take: pageSize
    })
  ]);

  return {
    penalty_point_list: rows.map(r => ({
      issue_time: Math.floor(r.issueTime.getTime() / 1000),
      latest_point_num: r.latestPointNum,
      original_point_num: r.originalPointNum,
      reference_id: Number(r.referenceId),
      violation_type: r.violationType
    })),
    total_count: totalCount
  };
}

export async function getPunishmentHistory(shopId: bigint, punishmentStatus: number, pageNo: number, pageSize: number, now = new Date()) {
  const qStart = quarterStartUtc(now);
  const where = { shopId, status: punishmentStatus, issueTime: { gte: qStart } };

  const [totalCount, rows] = await Promise.all([
    prisma.shopPunishment.count({ where }),
    prisma.shopPunishment.findMany({
      where,
      orderBy: { issueTime: "desc" },
      skip: (pageNo - 1) * pageSize,
      take: pageSize
    })
  ]);

  return {
    punishment_list: rows.map(r => ({
      issue_time: Math.floor(r.issueTime.getTime() / 1000),
      start_time: Math.floor(r.startTime.getTime() / 1000),
      end_time: Math.floor(r.endTime.getTime() / 1000),
      punishment_type: r.punishmentType,
      reason: r.reason,
      reference_id: Number(r.referenceId),
      ...(r.listingLimit !== null ? { listing_limit: r.listingLimit } : {}),
      ...(r.orderLimit !== null ? { order_limit: r.orderLimit } : {})
    })),
    total_count: totalCount
  };
}

export async function getLateOrders(shopId: bigint, pageNo: number, pageSize: number, now = new Date()) {
  const openOrders = await prisma.order.findMany({
    where: {
      shopId,
      orderStatus: { in: [OrderStatus.READY_TO_SHIP, OrderStatus.PROCESSED] }
    },
    orderBy: { shipByDate: "asc" }
  });

  const overdue = openOrders.filter(o => {
    const deadline = o.shipByDate || new Date(o.createdAt.getTime() + 2 * DAY_MS);
    return deadline.getTime() < now.getTime();
  });

  const paged = overdue.slice((pageNo - 1) * pageSize, pageNo * pageSize);

  return {
    late_order_list: paged.map(o => {
      const deadline = o.shipByDate || new Date(o.createdAt.getTime() + 2 * DAY_MS);
      const lateDays = Math.max(1, Math.ceil((now.getTime() - deadline.getTime()) / DAY_MS));
      return {
        order_sn: o.orderSn,
        shipping_deadline: Math.floor(deadline.getTime() / 1000),
        late_by_days: lateDays
      };
    }),
    total_count: overdue.length
  };
}

export async function getListingsWithIssues(shopId: bigint, pageNo: number, pageSize: number) {
  const where = {
    shopId,
    itemStatus: { in: ["BANNED", "UNLIST"] }
  };

  const [totalCount, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (pageNo - 1) * pageSize,
      take: pageSize
    })
  ]);

  return {
    listing_list: items.map(it => ({
      item_id: Number(it.itemId),
      reason: it.itemStatus === "BANNED" ? 1 : 7
    })),
    total_count: totalCount
  };
}

export async function getMetricSourceDetail(shopId: bigint, metricId: number, pageNo: number, pageSize: number, now = new Date()) {
  const currentStart = new Date(now.getTime() - 7 * DAY_MS);
  const { lateOrders, sellerCancels, nonExemptReturns } = await computeWindowRates(shopId, currentStart, now, now);

  if (metricId === 1) {
    const paged = lateOrders.slice((pageNo - 1) * pageSize, pageNo * pageSize);
    return {
      metric_id: metricId,
      lsr_order_list: paged.map(o => {
        const deadline = o.shipByDate || new Date(o.createdAt.getTime() + 2 * DAY_MS);
        const pickup = o.packages?.[0]?.pickupTime as Date | null | undefined;
        const actualMs = pickup ? pickup.getTime() : now.getTime();
        return {
          order_sn: o.orderSn,
          shipping_deadline: Math.floor(deadline.getTime() / 1000),
          actual_shipping_time: pickup ? Math.floor(pickup.getTime() / 1000) : 0,
          actual_pick_up_time: pickup ? Math.floor(pickup.getTime() / 1000) : 0,
          late_by_days: Math.max(1, Math.ceil((actualMs - deadline.getTime()) / DAY_MS)),
          shipping_channel: o.shippingCarrier,
          first_mile_type: o.packages?.[0]?.shippingType === "dropoff" ? "Drop off" : "Pickup",
          diagnosis_scenario: pickup ? ["LATE_HANDOVER"] : ["NOT_SHIPPED_PAST_DEADLINE"]
        };
      }),
      total_count: lateOrders.length
    };
  }

  if (metricId === 3) {
    const combined = [
      ...sellerCancels.map(o => ({
        order_sn: o.orderSn,
        non_fulfillment_type: o.cancelBy === "SYSTEM" ? 1 : 2,
        detailed_reason: mapCancelReasonCode(o.cancelReason)
      })),
      ...nonExemptReturns.map(r => ({
        order_sn: r.orderSn,
        non_fulfillment_type: 3,
        detailed_reason: mapReturnReasonCode(r.reason)
      }))
    ];
    return {
      metric_id: metricId,
      nfr_order_list: combined.slice((pageNo - 1) * pageSize, pageNo * pageSize),
      total_count: combined.length
    };
  }

  if (metricId === 42) {
    const paged = sellerCancels.slice((pageNo - 1) * pageSize, pageNo * pageSize);
    return {
      metric_id: metricId,
      cancellation_order_list: paged.map(o => ({
        order_sn: o.orderSn,
        cancellation_type: o.cancelBy === "SYSTEM" ? 1 : 2,
        detailed_reason: mapCancelReasonCode(o.cancelReason)
      })),
      total_count: sellerCancels.length
    };
  }

  if (metricId === 43) {
    const paged = nonExemptReturns.slice((pageNo - 1) * pageSize, pageNo * pageSize);
    return {
      metric_id: metricId,
      return_refund_order_list: paged.map(r => ({
        order_sn: r.orderSn,
        detailed_reason: mapReturnReasonCode(r.reason)
      })),
      total_count: nonExemptReturns.length
    };
  }

  if (metricId === 52 || metricId === 53) {
    const status = metricId === 52 ? "BANNED" : "UNLIST";
    const items = await prisma.product.findMany({ where: { shopId, itemStatus: status }, orderBy: { updatedAt: "desc" } });
    const paged = items.slice((pageNo - 1) * pageSize, pageNo * pageSize);
    return {
      metric_id: metricId,
      violation_listing_list: paged.map(it => ({
        item_id: Number(it.itemId),
        detailed_reason: metricId === 52 ? 1 : 7,
        update_time: Math.floor(it.updatedAt.getTime() / 1000)
      })),
      total_count: items.length
    };
  }

  if (metricId === 12) {
    const items = await prisma.product.findMany({ where: { shopId, itemStatus: "NORMAL", isPreorder: true } });
    const paged = items.slice((pageNo - 1) * pageSize, pageNo * pageSize);
    return {
      metric_id: metricId,
      pre_order_listing_list: paged.map(it => ({
        item_id: Number(it.itemId),
        current_pre_order_status: 1
      })),
      total_count: items.length
    };
  }

  return { metric_id: metricId, total_count: 0 };
}
