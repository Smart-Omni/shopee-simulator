import { app } from "../src/index";
import { prisma } from "../src/common/prisma";
import { calculateHmacSha256, buildBaseString } from "../src/common/utils/crypto";
import * as http from "http";

const PARTNER_ID = 1001141;
const PARTNER_KEY = "shopee_mock_secret_key_2026";
const SHOP_ID = 727720655;

let server: http.Server;
let baseUrl: string;
let accessToken: string;
let testOrderSn1 = "ORD261019ESCROW01";
let testOrderSn2 = "ORD261019ESCROW02";
let testOrderSn3 = "ORD261019ESCROW03";

function assert(condition: any, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(message);
  }
  console.log(`  ✓ ${message}`);
}

async function request(path: string, options: { method?: string; body?: any; headers?: Record<string, string> } = {}) {
  const url = `${baseUrl}${path}`;
  const res = await fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    redirect: "manual"
  });

  const contentType = res.headers.get("content-type") || "";
  let json: any = null;
  let text = "";

  if (contentType.includes("application/json")) {
    json = await res.json();
  } else {
    text = await res.text();
  }

  return { status: res.status, headers: res.headers, json, text };
}

function makeSignedUrl(path: string, additionalParams: Record<string, any> = {}): string {
  const now = Math.floor(Date.now() / 1000);
  const baseStr = buildBaseString(PARTNER_ID, path, now, accessToken, SHOP_ID);
  const sign = calculateHmacSha256(PARTNER_KEY, baseStr);

  const query = new URLSearchParams();
  query.set("partner_id", String(PARTNER_ID));
  query.set("timestamp", String(now));
  query.set("access_token", accessToken);
  query.set("shop_id", String(SHOP_ID));
  query.set("sign", sign);

  for (const [k, v] of Object.entries(additionalParams)) {
    query.set(k, String(v));
  }

  return `${path}?${query.toString()}`;
}

async function runPhase12Tests() {
  console.log("=======================================================");
  console.log("   SHOPEE SIMULATOR: PHASE 12 PAYMENT & ESCROW SUITE   ");
  console.log("=======================================================\n");

  server = app.listen(0);
  const port = (server.address() as any).port;
  baseUrl = `http://localhost:${port}`;
  console.log(`Test server running at ${baseUrl}\n`);

  try {
    // -------------------------------------------------------------------------
    // PREPARATION: Fetch Access Token & Clean Up Old Test Data
    // -------------------------------------------------------------------------
    console.log("PREPARATION: Setting up active token and test orders...");
    const shop = await prisma.shop.findUnique({ where: { shopId: BigInt(SHOP_ID) } });
    if (!shop || !shop.accessToken) {
      throw new Error("Target shop or access token not found");
    }
    accessToken = shop.accessToken;

    // Purge previous test orders
    await prisma.packageItem.deleteMany({
      where: { package: { orderSn: { in: [testOrderSn1, testOrderSn2, testOrderSn3] } } }
    });
    await prisma.orderPackage.deleteMany({
      where: { orderSn: { in: [testOrderSn1, testOrderSn2, testOrderSn3] } }
    });
    await prisma.orderItem.deleteMany({
      where: { orderSn: { in: [testOrderSn1, testOrderSn2, testOrderSn3] } }
    });
    await prisma.order.deleteMany({
      where: { orderSn: { in: [testOrderSn1, testOrderSn2, testOrderSn3] } }
    });

    const testProduct = await prisma.product.findFirst({
      where: { shopId: BigInt(SHOP_ID) },
      include: { models: true }
    });
    if (!testProduct) throw new Error("No products found in shop");

    // Create Order 1: Completed order (Settled escrow)
    const createRes1 = await request("/api/v2/simulator/order/create", {
      method: "POST",
      body: {
        order_sn: testOrderSn1,
        shop_id: SHOP_ID,
        order_status: "READY_TO_SHIP",
        recipient_name: "Nguyen Van A",
        recipient_phone: "+84901234567",
        recipient_address: "123 Le Loi, D1, HCMC",
        recipient_city: "Ho Chi Minh City",
        channel_id: 30001,
        items: [
          {
            item_id: Number(testProduct.itemId),
            quantity: 2
          }
        ]
      }
    });
    assert(createRes1.json?.response?.order_sn === testOrderSn1, "Test Order 1 created successfully");

    // Deliver Order 1 to transition to COMPLETED and stamp escrowReleaseTime
    const deliverRes1 = await request("/api/v2/simulator/order/deliver", {
      method: "POST",
      body: { order_sn: testOrderSn1 }
    });
    assert(deliverRes1.json?.response?.order_status === "COMPLETED", "Order 1 transitioned to COMPLETED");

    // Create Order 2: In-transit order (Pending escrow)
    const createRes2 = await request("/api/v2/simulator/order/create", {
      method: "POST",
      body: {
        order_sn: testOrderSn2,
        shop_id: SHOP_ID,
        order_status: "READY_TO_SHIP",
        recipient_name: "Tran Thi B",
        recipient_phone: "+84909888777",
        recipient_address: "456 Hoang Hoa Tham, Hanoi",
        recipient_city: "Hà Nội",
        channel_id: 30001,
        items: [
          {
            item_id: Number(testProduct.itemId),
            quantity: 1
          }
        ]
      }
    });
    assert(createRes2.json?.response?.order_sn === testOrderSn2, "Test Order 2 created in READY_TO_SHIP (Pending Escrow)");

    // Create Order 3: Completed order for batch escrow test
    const createRes3 = await request("/api/v2/simulator/order/create", {
      method: "POST",
      body: {
        order_sn: testOrderSn3,
        shop_id: SHOP_ID,
        order_status: "READY_TO_SHIP",
        recipient_name: "Le Van C",
        recipient_phone: "+84912333444",
        recipient_address: "789 Nguyen Van Linh, Da Nang",
        recipient_city: "Đà Nẵng",
        channel_id: 30001,
        items: [
          {
            item_id: Number(testProduct.itemId),
            quantity: 1
          }
        ]
      }
    });
    const deliverRes3 = await request("/api/v2/simulator/order/deliver", {
      method: "POST",
      body: { order_sn: testOrderSn3 }
    });
    assert(deliverRes3.json?.response?.order_status === "COMPLETED", "Test Order 3 created and delivered");

    console.log("\n-------------------------------------------------------");
    console.log("TEST GROUP 1: Official Order Escrow Detail (POST & GET)");
    console.log("-------------------------------------------------------");
    // POST /api/v2/payment/get_escrow_detail
    const postDetailUrl = makeSignedUrl("/api/v2/payment/get_escrow_detail");
    const detailRes = await request(postDetailUrl, {
      method: "POST",
      body: { order_sn: testOrderSn1 }
    });

    assert(detailRes.status === 200, "get_escrow_detail returns HTTP 200");
    assert(detailRes.json.error === "", "get_escrow_detail returns empty error code");
    assert(detailRes.json.response?.order_sn === testOrderSn1, "Echoes requested order_sn");
    assert(Array.isArray(detailRes.json.response?.return_order_sn_list), "return_order_sn_list is array");
    
    const income = detailRes.json.response?.order_income;
    assert(income !== undefined, "order_income object is present");
    assert(income.buyer_total_amount > 0, "buyer_total_amount is positive");
    assert(income.cost_of_goods_sold > 0, "cost_of_goods_sold matches items subtotal");
    assert(income.commission_fee === Math.round(income.cost_of_goods_sold * 0.02), "commission_fee matches 2% formula");
    assert(income.seller_transaction_fee === Math.round(income.buyer_total_amount * 0.025), "seller_transaction_fee matches 2.5% formula");
    
    // Mathematical equality assertion
    const expectedEscrow = income.cost_of_goods_sold - income.voucher_from_seller + income.buyer_paid_shipping_fee - income.actual_shipping_fee + income.shopee_shipping_rebate - income.commission_fee - income.service_fee - income.seller_transaction_fee;
    assert(income.escrow_amount === Math.max(0, expectedEscrow), "escrow_amount strictly equals mathematical accounting formula");
    assert(Array.isArray(income.items) && income.items.length > 0, "income.items array contains itemized line breakdowns");
    assert(income.items[0].item_id === Number(testProduct.itemId), "Line item item_id matches");

    // GET /api/v2/payment/get_escrow_detail
    const getDetailUrl = makeSignedUrl("/api/v2/payment/get_escrow_detail", { order_sn: testOrderSn1 });
    const getDetailRes = await request(getDetailUrl, { method: "GET" });
    assert(getDetailRes.status === 200, "GET /api/v2/payment/get_escrow_detail returns HTTP 200");
    assert(getDetailRes.json.response?.order_income?.escrow_amount === income.escrow_amount, "GET returns identical escrow calculation");

    console.log("\n-------------------------------------------------------");
    console.log("TEST GROUP 2: Official Batch Escrow Detail (POST)");
    console.log("-------------------------------------------------------");
    const batchUrl = makeSignedUrl("/api/v2/payment/get_escrow_detail_batch");
    const batchRes = await request(batchUrl, {
      method: "POST",
      body: { order_sn_list: [testOrderSn1, testOrderSn3] }
    });

    assert(batchRes.status === 200, "get_escrow_detail_batch returns HTTP 200");
    assert(batchRes.json.error === "", "get_escrow_detail_batch returns empty error code");
    assert(Array.isArray(batchRes.json.response), "Batch response is array");
    assert(batchRes.json.response.length === 2, "Batch response contains exactly 2 orders");
    assert(batchRes.json.response[0].escrow_detail?.order_sn === testOrderSn1, "First batch item matches Order 1");
    assert(batchRes.json.response[1].escrow_detail?.order_sn === testOrderSn3, "Second batch item matches Order 3");

    // Rejection on empty order_sn_list
    const emptyBatchRes = await request(batchUrl, {
      method: "POST",
      body: { order_sn_list: [] }
    });
    assert(emptyBatchRes.json.error === "error_param", "Empty order_sn_list rejected with error_param");

    console.log("\n-------------------------------------------------------");
    console.log("TEST GROUP 3: Released Escrow Orders List (GET & POST)");
    console.log("-------------------------------------------------------");
    const nowSec = Math.floor(Date.now() / 1000);
    const fromSec = nowSec - 3600; // 1 hour ago
    const toSec = nowSec + 3600;   // 1 hour in future

    const listUrl = makeSignedUrl("/api/v2/payment/get_escrow_list", {
      release_time_from: fromSec,
      release_time_to: toSec,
      page_size: 50,
      page_no: 1
    });

    const listRes = await request(listUrl, { method: "GET" });
    assert(listRes.status === 200, "get_escrow_list returns HTTP 200");
    assert(listRes.json.error === "", "get_escrow_list returns empty error");
    assert(Array.isArray(listRes.json.response?.escrow_list), "escrow_list is array");
    
    const releasedOrders = listRes.json.response.escrow_list.map((e: any) => e.order_sn);
    assert(releasedOrders.includes(testOrderSn1), "Completed Order 1 is present in released escrow list");
    assert(releasedOrders.includes(testOrderSn3), "Completed Order 3 is present in released escrow list");
    assert(!releasedOrders.includes(testOrderSn2), "Pending Order 2 (READY_TO_SHIP) is EXCLUDED from released escrow list");

    const order1Item = listRes.json.response.escrow_list.find((e: any) => e.order_sn === testOrderSn1);
    assert(order1Item.payout_amount === income.escrow_amount, "Payout amount matches calculated escrow");
    assert(typeof order1Item.escrow_release_time === "number", "escrow_release_time is numeric timestamp");

    // Missing release_time_from rejection
    const invalidListUrl = makeSignedUrl("/api/v2/payment/get_escrow_list");
    const invalidListRes = await request(invalidListUrl, { method: "GET" });
    assert(invalidListRes.json.error === "error_param", "Missing time range rejected with error_param");

    console.log("\n-------------------------------------------------------");
    console.log("TEST GROUP 4: Shop Income Overview (GET)");
    console.log("-------------------------------------------------------");
    const overviewUrl = makeSignedUrl("/api/v2/payment/get_income_overview");
    const overviewRes = await request(overviewUrl, { method: "GET" });

    assert(overviewRes.status === 200, "get_income_overview returns HTTP 200");
    assert(overviewRes.json.error === "", "get_income_overview returns empty error");
    
    const totalIncome = overviewRes.json.response?.total_income;
    assert(totalIncome !== undefined, "total_income object returned");
    assert(totalIncome.released_amount > 0, "released_amount is greater than 0");
    assert(totalIncome.pending_amount > 0, "pending_amount reflects in-progress orders");

    // Filter by status 1 (Released)
    const releasedOverviewUrl = makeSignedUrl("/api/v2/payment/get_income_overview", { income_status: 1 });
    const releasedOverviewRes = await request(releasedOverviewUrl, { method: "GET" });
    assert(releasedOverviewRes.json.response?.total_income?.released_amount !== undefined, "income_status=1 returns released_amount");
    assert(releasedOverviewRes.json.response?.total_income?.pending_amount === undefined, "income_status=1 omits pending_amount");

    console.log("\n-------------------------------------------------------");
    console.log("TEST GROUP 5: Simulator Public Endpoints (Layer B)");
    console.log("-------------------------------------------------------");
    const simOverviewRes = await request(`/api/v2/simulator/payment/overview?shop_id=${SHOP_ID}`);
    assert(simOverviewRes.status === 200, "Simulator payment overview returns HTTP 200 without HMAC");
    assert(simOverviewRes.json.response?.summary?.released_amount > 0, "Summary has released_amount");
    assert(simOverviewRes.json.response?.summary?.total_platform_fees > 0, "Summary has total_platform_fees");
    assert(Array.isArray(simOverviewRes.json.response?.ledger), "Ledger array returned");

    const simEscrowDetailRes = await request(`/api/v2/simulator/payment/escrow_detail?order_sn=${testOrderSn1}`);
    assert(simEscrowDetailRes.status === 200, "Simulator escrow detail returns HTTP 200 without HMAC");
    assert(simEscrowDetailRes.json.response?.order_income?.escrow_amount === income.escrow_amount, "Simulator detail matches Layer A calculation");

    console.log("\n-------------------------------------------------------");
    console.log("TEST GROUP 6: Protocol Security & Signature Verification");
    console.log("-------------------------------------------------------");
    // Invalid signature rejection
    const now = Math.floor(Date.now() / 1000);
    const badSignUrl = `/api/v2/payment/get_escrow_detail?partner_id=${PARTNER_ID}&timestamp=${now}&access_token=${accessToken}&shop_id=${SHOP_ID}&sign=invalid_hex_signature`;
    const badSignRes = await request(badSignUrl, {
      method: "POST",
      body: { order_sn: testOrderSn1 }
    });
    assert(badSignRes.json.error === "error_sign", "Wrong HMAC rejected with error_sign");

    // Expired timestamp rejection (>300s drift)
    const expiredTimestamp = now - 600;
    const expiredBaseStr = buildBaseString(PARTNER_ID, "/api/v2/payment/get_escrow_detail", expiredTimestamp, accessToken, SHOP_ID);
    const expiredSign = calculateHmacSha256(PARTNER_KEY, expiredBaseStr);
    const expiredUrl = `/api/v2/payment/get_escrow_detail?partner_id=${PARTNER_ID}&timestamp=${expiredTimestamp}&access_token=${accessToken}&shop_id=${SHOP_ID}&sign=${expiredSign}`;
    const expiredRes = await request(expiredUrl, {
      method: "POST",
      body: { order_sn: testOrderSn1 }
    });
    assert(expiredRes.json.error === "error_param", "Expired timestamp rejected with error_param");
    assert(expiredRes.json.message === "Timestamp is expired.", "Error message confirms timestamp expiration");

    console.log("\n=======================================================");
    console.log("   🎉 ALL PHASE 12 PAYMENT & ESCROW TESTS PASSED!     ");
    console.log("=======================================================\n");

  } finally {
    server.close();
  }
}

runPhase12Tests().catch(err => {
  console.error("❌ TEST SUITE FAILED:", err);
  process.exit(1);
});
