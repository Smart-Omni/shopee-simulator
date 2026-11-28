import * as http from "http";
import { app } from "../src/index";
import { prisma } from "../src/common/prisma";
import { buildBaseString, calculateHmacSha256 } from "../src/common/utils/crypto";

const PARTNER_ID = 1001141;
const PARTNER_KEY = "shopee_mock_secret_key_2026";
const SHOP_ID = 727720655;
const ACCESS_TOKEN = "mock_access_token_account_health";

function assert(condition: any, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(message);
  }
  console.log(`  ✓ ${message}`);
}

function signedUrl(baseUrl: string, apiPath: string, extraQuery: Record<string, string | number> = {}) {
  const ts = Math.floor(Date.now() / 1000);
  const baseStr = buildBaseString(PARTNER_ID, apiPath, ts, ACCESS_TOKEN, SHOP_ID);
  const sign = calculateHmacSha256(PARTNER_KEY, baseStr);
  const params = new URLSearchParams({
    partner_id: String(PARTNER_ID),
    timestamp: String(ts),
    access_token: ACCESS_TOKEN,
    shop_id: String(SHOP_ID),
    sign,
    ...Object.fromEntries(Object.entries(extraQuery).map(([k, v]) => [k, String(v)]))
  });
  return `${baseUrl}${apiPath}?${params.toString()}`;
}

async function run() {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 3600 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 72 * 3600 * 1000);

  // Stub prisma methods so tests run deterministically with or without DB
  const orig = {
    simulatorConfigFindFirst: prisma.simulatorConfig.findFirst,
    partnerFindUnique: prisma.partner.findUnique,
    shopFindUnique: prisma.shop.findUnique,
    orderFindMany: prisma.order.findMany,
    returnFindMany: prisma.return.findMany,
    productFindMany: prisma.product.findMany,
    productCount: prisma.product.count,
    penaltyCount: prisma.shopPenaltyPoint.count,
    penaltyFindMany: prisma.shopPenaltyPoint.findMany,
    punishmentCount: prisma.shopPunishment.count,
    punishmentFindMany: prisma.shopPunishment.findMany
  };

  (prisma.simulatorConfig as any).findFirst = async () => ({ id: 1, strictTimestamp: false, rateLimitEnabled: false, artificialDelayMs: 0 });
  (prisma.partner as any).findUnique = async () => ({ partnerId: BigInt(PARTNER_ID), partnerKey: PARTNER_KEY, status: "ACTIVE" });
  (prisma.shop as any).findUnique = async () => ({
    shopId: BigInt(SHOP_ID),
    partnerId: BigInt(PARTNER_ID),
    status: "NORMAL",
    accessToken: ACCESS_TOKEN,
    accessTokenExpiresAt: new Date(now.getTime() + 3600 * 1000),
    rating: 4.8
  });

  const allOrders = [
    {
      orderSn: "ORD_LATE_1",
      shopId: BigInt(SHOP_ID),
      orderStatus: "READY_TO_SHIP",
      createdAt: threeDaysAgo,
      shipByDate: oneDayAgo,
      cancelBy: null,
      cancelReason: null,
      shippingCarrier: "Shopee Xpress",
      packages: []
    },
    {
      orderSn: "ORD_SELLER_CANCEL",
      shopId: BigInt(SHOP_ID),
      orderStatus: "CANCELLED",
      createdAt: oneDayAgo,
      shipByDate: now,
      cancelBy: "SELLER",
      cancelReason: "OUT_OF_STOCK",
      shippingCarrier: "Shopee Xpress",
      packages: []
    },
    {
      orderSn: "ORD_OK",
      shopId: BigInt(SHOP_ID),
      orderStatus: "COMPLETED",
      createdAt: oneDayAgo,
      shipByDate: now,
      cancelBy: null,
      cancelReason: null,
      shippingCarrier: "Shopee Xpress",
      packages: [{ pickupTime: oneDayAgo, shippingType: "pickup" }]
    }
  ];
  (prisma.order as any).findMany = async (args: any) => {
    const inStatuses = args?.where?.orderStatus?.in;
    if (Array.isArray(inStatuses)) {
      return allOrders.filter(o => inStatuses.includes(o.orderStatus));
    }
    return allOrders;
  };
  (prisma.return as any).findMany = async () => [
    { returnSn: "RET_1", orderSn: "ORD_OK", reason: "ITEM_DAMAGED", status: "ACCEPTED", isNfrExempt: false, createdAt: oneDayAgo }
  ];
  (prisma.product as any).findMany = async () => [
    { itemId: BigInt(101), itemStatus: "NORMAL", isPreorder: false, updatedAt: now },
    { itemId: BigInt(102), itemStatus: "BANNED", isPreorder: false, updatedAt: now }
  ];
  (prisma.product as any).count = async () => 1;
  (prisma.shopPenaltyPoint as any).count = async () => 1;
  (prisma.shopPenaltyPoint as any).findMany = async () => [
    { referenceId: BigInt(9001), violationType: 5, originalPointNum: 1, latestPointNum: 1, issueTime: oneDayAgo }
  ];
  (prisma.shopPunishment as any).count = async () => 1;
  (prisma.shopPunishment as any).findMany = async () => [
    { referenceId: BigInt(8001), punishmentType: 107, reason: 1, status: 1, issueTime: oneDayAgo, startTime: oneDayAgo, endTime: now, listingLimit: null, orderLimit: null }
  ];

  const server: http.Server = await new Promise(resolve => {
    const s = app.listen(0, () => resolve(s));
  });

  try {
    const addr = server.address() as any;
    const baseUrl = `http://127.0.0.1:${addr.port}`;

    // 1. get_shop_performance
    const perfRes = await fetch(signedUrl(baseUrl, "/api/v2/account_health/get_shop_performance"));
    const perfJson: any = await perfRes.json();
    assert(perfRes.status === 200 && !perfJson.error, `get_shop_performance returns 200 without error (status=${perfRes.status}, error=${perfJson.error}, msg=${perfJson.message})`);
    const lsr = perfJson.response.metric_list.find((m: any) => m.metric_id === 1);
    const nfr = perfJson.response.metric_list.find((m: any) => m.metric_id === 3);
    assert(lsr && lsr.current_period === 33.3, `LSR computed as 33.3% (got ${lsr?.current_period})`);
    assert(nfr && nfr.current_period === 66.7, `NFR computed as 66.7% (got ${nfr?.current_period})`);

    // 2. get_penalty_point_history
    const penRes = await fetch(signedUrl(baseUrl, "/api/v2/account_health/get_penalty_point_history"));
    const penJson: any = await penRes.json();
    assert(penJson.response.total_count === 1 && penJson.response.penalty_point_list[0].violation_type === 5, "get_penalty_point_history returns seeded violation");

    // 3. get_punishment_history
    const punRes = await fetch(signedUrl(baseUrl, "/api/v2/account_health/get_punishment_history", { punishment_status: 1 }));
    const punJson: any = await punRes.json();
    assert(punJson.response.total_count === 1 && punJson.response.punishment_list[0].punishment_type === 107, "get_punishment_history returns ongoing punishment");

    // 4. get_late_orders
    const lateRes = await fetch(signedUrl(baseUrl, "/api/v2/account_health/get_late_orders"));
    const lateJson: any = await lateRes.json();
    assert(lateJson.response.total_count === 1 && lateJson.response.late_order_list[0].order_sn === "ORD_LATE_1", "get_late_orders returns overdue order");

    // 5. get_metric_source_detail
    const srcRes = await fetch(signedUrl(baseUrl, "/api/v2/account_health/get_metric_source_detail", { metric_id: 3 }));
    const srcJson: any = await srcRes.json();
    assert(srcJson.response.total_count === 2 && srcJson.response.nfr_order_list.length === 2, "get_metric_source_detail(3) returns seller cancel + return");

    console.log("✅ All Phase 23 AccountHealth assertions passed!");
  } finally {
    server.close();
    prisma.simulatorConfig.findFirst = orig.simulatorConfigFindFirst;
    prisma.partner.findUnique = orig.partnerFindUnique;
    prisma.shop.findUnique = orig.shopFindUnique;
    prisma.order.findMany = orig.orderFindMany;
    prisma.return.findMany = orig.returnFindMany;
    prisma.product.findMany = orig.productFindMany;
    prisma.product.count = orig.productCount;
    prisma.shopPenaltyPoint.count = orig.penaltyCount;
    prisma.shopPenaltyPoint.findMany = orig.penaltyFindMany;
    prisma.shopPunishment.count = orig.punishmentCount;
    prisma.shopPunishment.findMany = orig.punishmentFindMany;
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
