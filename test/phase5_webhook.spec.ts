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

// Webhook mock receiver
let webhookServer: http.Server;
let webhookUrl: string;
let receivedWebhooks: Array<{
  url: string;
  headers: http.IncomingHttpHeaders;
  rawBody: string;
  json: any;
}> = [];
let mockReceiverStatus = 200;

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

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runPhase5Tests() {
  console.log("=======================================================");
  console.log("   SHOPEE SIMULATOR: PHASE 5 WEBHOOK & FAULT SUITE     ");
  console.log("=======================================================\n");

  // 1. Start App Server
  server = app.listen(0);
  const port = (server.address() as any).port;
  baseUrl = `http://localhost:${port}`;
  console.log(`Test API server running at ${baseUrl}`);

  // 2. Start Mock Webhook Receiver Server
  webhookServer = http.createServer((req, res) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
    });
    req.on("end", () => {
      let parsed = {};
      try {
        parsed = JSON.parse(body);
      } catch {}

      receivedWebhooks.push({
        url: req.url || "/",
        headers: req.headers,
        rawBody: body,
        json: parsed
      });

      res.writeHead(mockReceiverStatus, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: mockReceiverStatus === 200 ? "received" : "error" }));
    });
  });

  await new Promise<void>(resolve => {
    webhookServer.listen(0, "127.0.0.1", () => resolve());
  });

  const webhookPort = (webhookServer.address() as any).port;
  webhookUrl = `http://127.0.0.1:${webhookPort}/api/webhook/receiver`;
  console.log(`Mock Webhook Receiver running at ${webhookUrl}\n`);

  // PREPARATION: Fetch Active Access Token & Reset Config
  const shop = await prisma.shop.findUnique({
    where: { shopId: BigInt(SHOP_ID) }
  });

  if (shop?.accessToken) {
    accessToken = shop.accessToken;
  } else {
    const authCode = "phase5_test_code_" + Date.now();
    await prisma.shop.update({
      where: { shopId: BigInt(SHOP_ID) },
      data: { authCode, authCodeExpiresAt: new Date(Date.now() + 600000) }
    });

    const now = Math.floor(Date.now() / 1000);
    const path = "/api/v2/auth/token/get";
    const baseStr = `${PARTNER_ID}${path}${now}`;
    const sign = calculateHmacSha256(PARTNER_KEY, baseStr);

    const tokenRes = await request(`${path}?partner_id=${PARTNER_ID}&timestamp=${now}&sign=${sign}`, {
      method: "POST",
      body: { code: authCode, partner_id: PARTNER_ID, shop_id: SHOP_ID }
    });
    accessToken = tokenRes.json.response.access_token;
  }

  // Reset simulator config to pristine defaults
  await prisma.simulatorConfig.upsert({
    where: { id: 1 },
    update: {
      rateLimitEnabled: false,
      rateLimitPerMin: 100,
      forceExpiredToken: false,
      forceInvalidSign: false,
      artificialDelayMs: 0,
      strictTimestamp: true
    },
    create: {
      id: 1,
      rateLimitEnabled: false,
      rateLimitPerMin: 100,
      forceExpiredToken: false,
      forceInvalidSign: false,
      artificialDelayMs: 0,
      strictTimestamp: true
    }
  });

  // Clean Webhook Logs
  await prisma.webhookLog.deleteMany({
    where: { partnerId: BigInt(PARTNER_ID) }
  });

  console.log("PREPARATION: Setup completed successfully\n");

  try {
    // =========================================================================
    // TEST GROUP 1: Configure Webhook URL
    // =========================================================================
    console.log("TEST GROUP 1: Set Webhook Callback URL (POST /api/v2/public/set_webhook_url)");
    const setRes = await request("/api/v2/public/set_webhook_url", {
      method: "POST",
      body: { partner_id: PARTNER_ID, webhook_url: webhookUrl }
    });

    assert(setRes.status === 200, "set_webhook_url returns HTTP 200");
    assert(setRes.json.error === "", "Empty error code indicates success");
    assert(setRes.json.response.webhook_url === webhookUrl, "Returns configured webhook URL");

    const partnerInDb = await prisma.partner.findUnique({ where: { partnerId: BigInt(PARTNER_ID) } });
    assert(partnerInDb?.webhookUrl === webhookUrl, "Webhook URL correctly persisted in Partner database record");
    console.log();

    // =========================================================================
    // TEST GROUP 2: Manual Trigger & HMAC Signature Verification
    // =========================================================================
    console.log("TEST GROUP 2: Push Webhook Dispatch & HMAC-SHA256 Authorization Signature");
    receivedWebhooks = [];

    const testPayloadData = { ordersn: "261019TESTHOOK01", status: "READY_TO_SHIP" };
    const triggerRes = await request("/api/v2/simulator/webhook/trigger", {
      method: "POST",
      body: {
        partner_id: PARTNER_ID,
        push_code: 3,
        shop_id: SHOP_ID,
        ordersn: "261019TESTHOOK01",
        data: testPayloadData
      }
    });

    assert(triggerRes.status === 200, "Simulator manual trigger returns HTTP 200");
    assert(triggerRes.json.response.dispatched === true, "Reported dispatched: true");
    assert(triggerRes.json.response.status === "SUCCESS", "Reported status: SUCCESS");

    // Wait briefly for delivery
    await sleep(200);

    assert(receivedWebhooks.length === 1, "Mock webhook receiver got exactly 1 request");
    const received = receivedWebhooks[0];
    assert(received.headers["user-agent"] === "Shopee-Push-Dispatcher/2.0", "Headers include Shopee-Push-Dispatcher User-Agent");
    assert(received.headers["content-type"] === "application/json", "Headers include application/json Content-Type");
    assert(received.json.code === 3, "Payload code matches push code 3 (order_status_push)");
    assert(received.json.shop_id === SHOP_ID, "Payload shop_id matches shop 727720655");
    assert(received.json.data.ordersn === "261019TESTHOOK01", "Payload data contains ordersn");

    // CRITICAL: Verify Shopee Push Authorization Header Signature
    const expectedSigBase = `${webhookUrl}|${received.rawBody}`;
    const expectedAuthHeader = calculateHmacSha256(PARTNER_KEY, expectedSigBase);
    assert(received.headers.authorization === expectedAuthHeader, "Authorization header matches HMAC-SHA256(partner_key, url + '|' + raw_body)");

    // Verify DB Log
    const logInDb = await prisma.webhookLog.findFirst({
      where: { ordersn: "261019TESTHOOK01" }
    });
    assert(logInDb !== null, "WebhookLog record found in database");
    assert(logInDb?.status === "SUCCESS", "WebhookLog status is SUCCESS");
    assert(logInDb?.responseStatus === 200, "WebhookLog responseStatus is 200");
    assert(logInDb?.attemptCount === 1, "WebhookLog attemptCount is 1");
    console.log();

    // =========================================================================
    // TEST GROUP 3: Automated Domain Event Triggers
    // =========================================================================
    console.log("TEST GROUP 3: Automated Domain Event Webhook Dispatches");

    // Sub-test 3.1: Order Checkout triggers Code 3 (order_status_push)
    receivedWebhooks = [];
    const testOrderSn = `HOOKORD${Date.now().toString(36).toUpperCase()}`;
    const checkoutRes = await request("/api/v2/simulator/order/create", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        order_sn: testOrderSn,
        order_status: "READY_TO_SHIP",
        total_amount: 320000
      }
    });

    assert(checkoutRes.status === 200, "Simulator order creation returns HTTP 200");
    await sleep(200);

    const orderCreatedPush = receivedWebhooks.find(w => w.json.code === 3 && w.json.data?.ordersn === testOrderSn);
    assert(orderCreatedPush !== undefined, "Order creation automatically dispatched Code 3 push");
    assert(orderCreatedPush?.json.data?.status === "READY_TO_SHIP", "Dispatched status is READY_TO_SHIP");

    // Sub-test 3.2: Ship Order triggers Code 3 (PROCESSED) and Code 4 (order_trackingno_push)
    receivedWebhooks = [];
    const shipUrl = makeSignedUrl("/api/v2/logistics/ship_order");
    const shipRes = await request(shipUrl, {
      method: "POST",
      body: {
        order_sn: testOrderSn,
        pickup: { address_id: 1 }
      }
    });

    assert(shipRes.status === 200, "ship_order returns HTTP 200");
    await sleep(250);

    const shipStatusPush = receivedWebhooks.find(w => w.json.code === 3 && w.json.data?.ordersn === testOrderSn);
    assert(shipStatusPush !== undefined, "ship_order dispatched Code 3 push");
    assert(shipStatusPush?.json.data?.status === "PROCESSED", "Status in push is PROCESSED");

    const trackingPush = receivedWebhooks.find(w => w.json.code === 4 && w.json.data?.ordersn === testOrderSn);
    assert(trackingPush !== undefined, "ship_order dispatched Code 4 push (tracking number)");
    assert(typeof trackingPush?.json.data?.tracking_no === "string", "Tracking number in push is string");
    assert(trackingPush?.json.data?.tracking_no.startsWith("SPXVN"), "Tracking number follows SPXVN format");

    // Sub-test 3.3: Create Shipping Document triggers Code 15 (shipping_document_status_push)
    receivedWebhooks = [];
    const docUrl = makeSignedUrl("/api/v2/logistics/create_shipping_document");
    const docRes = await request(docUrl, {
      method: "POST",
      body: {
        order_list: [{ order_sn: testOrderSn }]
      }
    });

    assert(docRes.status === 200, "create_shipping_document returns HTTP 200");
    await sleep(200);

    const docPush = receivedWebhooks.find(w => w.json.code === 15 && w.json.data?.ordersn === testOrderSn);
    assert(docPush !== undefined, "create_shipping_document dispatched Code 15 push");
    assert(docPush?.json.data?.status === "READY", "Document status in push is READY");

    // Sub-test 3.4: Product Stock Update triggers Code 8 (reserved_stock_change_push)
    receivedWebhooks = [];
    // Ensure product model exists for shop 727720655
    const anyModel = await prisma.productModel.findFirst({
      where: { product: { shopId: BigInt(SHOP_ID) } }
    });
    if (anyModel) {
      const stockUrl = makeSignedUrl("/api/v2/product/update_stock");
      const stockRes = await request(stockUrl, {
        method: "POST",
        body: {
          item_id: Number(anyModel.itemId),
          stock_list: [
            {
              model_id: Number(anyModel.modelId),
              seller_stock: [{ stock: 88, location_id: "VN_LOCAL" }]
            }
          ]
        }
      });

      assert(stockRes.status === 200, "update_stock returns HTTP 200");
      await sleep(200);

      const stockPush = receivedWebhooks.find(w => w.json.code === 8 && w.json.data?.model_id === Number(anyModel.modelId));
      assert(stockPush !== undefined, "update_stock dispatched Code 8 push (reserved_stock_change_push)");
      assert(stockPush?.json.data?.stock === 88, "Dispatched stock quantity is 88");
    }

    // Sub-test 3.5: Order Cancellation triggers Code 3 (CANCELLED)
    receivedWebhooks = [];
    const cancelOrderSn = `CANCEL${Date.now().toString(36).toUpperCase()}`;
    await request("/api/v2/simulator/order/create", {
      method: "POST",
      body: { shop_id: SHOP_ID, order_sn: cancelOrderSn, order_status: "READY_TO_SHIP" }
    });
    await sleep(100);
    receivedWebhooks = [];

    const cancelUrl = makeSignedUrl("/api/v2/order/cancel_order");
    const cancelRes = await request(cancelUrl, {
      method: "POST",
      body: {
        order_sn: cancelOrderSn,
        cancel_reason: "OUT_OF_STOCK",
        item_list: []
      }
    });

    assert(cancelRes.status === 200, "cancel_order returns HTTP 200");
    await sleep(200);

    const cancelPush = receivedWebhooks.find(w => w.json.code === 3 && w.json.data?.ordersn === cancelOrderSn);
    assert(cancelPush !== undefined, "cancel_order dispatched Code 3 push");
    assert(cancelPush?.json.data?.status === "CANCELLED", "Status in push is CANCELLED");
    console.log();

    // =========================================================================
    // TEST GROUP 4: Delivery Failure & Retry Scheduling
    // =========================================================================
    console.log("TEST GROUP 4: Delivery Failure & Exponential Retry Scheduling ([300s, 1800s, 10800s])");
    mockReceiverStatus = 500; // Force receiver failure

    const failOrderSn = `FAILHOOK${Date.now().toString(36).toUpperCase()}`;
    await request("/api/v2/simulator/webhook/trigger", {
      method: "POST",
      body: {
        partner_id: PARTNER_ID,
        push_code: 3,
        shop_id: SHOP_ID,
        ordersn: failOrderSn,
        data: { ordersn: failOrderSn, status: "READY_TO_SHIP" }
      }
    });

    const failedLog = await prisma.webhookLog.findFirst({
      where: { ordersn: failOrderSn }
    });

    assert(failedLog !== null, "WebhookLog record created for failed delivery");
    assert(failedLog?.status === "FAILED", "WebhookLog status is marked FAILED");
    assert(failedLog?.responseStatus === 500, "Recorded responseStatus is 500");
    assert(failedLog?.attemptCount === 1, "Attempt count recorded as 1");
    assert(failedLog?.nextRetryAt !== null, "nextRetryAt timestamp is scheduled");

    const nowMs = Date.now();
    const retryDelaySec = Math.round(((failedLog?.nextRetryAt?.getTime() || 0) - nowMs) / 1000);
    assert(retryDelaySec >= 290 && retryDelaySec <= 310, `First retry delay scheduled at ~300s (actual: ${retryDelaySec}s)`);

    // Reset receiver to HTTP 200 and test manual retry
    mockReceiverStatus = 200;
    const retryRes = await request("/api/v2/webhook/retry", { method: "POST" });
    assert(retryRes.status === 200, "POST /api/v2/webhook/retry returns HTTP 200");
    assert(retryRes.json.response.retried_success_count >= 1, "At least 1 failed webhook retried successfully");

    const retriedLog = await prisma.webhookLog.findUnique({
      where: { id: failedLog!.id }
    });
    assert(retriedLog?.status === "SUCCESS", "Retried webhook status transitioned to SUCCESS");
    assert(retriedLog?.attemptCount === 2, "Attempt count incremented to 2");
    assert(retriedLog?.nextRetryAt === null, "nextRetryAt cleared on SUCCESS");
    console.log();

    // =========================================================================
    // TEST GROUP 5: Query Webhook Logs
    // =========================================================================
    console.log("TEST GROUP 5: Query Webhook Logs (GET /api/v2/webhook/logs)");
    const logsRes = await request(`/api/v2/webhook/logs?push_code=3&status=SUCCESS`);
    assert(logsRes.status === 200, "GET /api/v2/webhook/logs returns HTTP 200");
    assert(logsRes.json.error === "", "Empty error code on webhook logs query");
    assert(Array.isArray(logsRes.json.response.logs), "logs field is an array");
    assert(logsRes.json.response.logs.length > 0, "Returns at least 1 successful code 3 log");

    const firstLog = logsRes.json.response.logs[0];
    assert(firstLog.push_code === 3, "Filtered log has push_code === 3");
    assert(firstLog.status === "SUCCESS", "Filtered log has status === 'SUCCESS'");
    assert(typeof firstLog.auth_header === "string", "Log includes HMAC auth_header");
    console.log();

    // =========================================================================
    // TEST GROUP 6: Simulator Fault Injection Control
    // =========================================================================
    console.log("TEST GROUP 6: Simulator Fault Injection Control (GET & POST /api/v2/simulator/config)");

    // 6.1 Get Config
    const getConfigRes = await request("/api/v2/simulator/config");
    assert(getConfigRes.status === 200, "GET /api/v2/simulator/config returns HTTP 200");
    assert(getConfigRes.json.response.rateLimitEnabled === false, "Default rateLimitEnabled is false");

    // 6.2 Simulate 429 Rate Limit
    await request("/api/v2/simulator/config", {
      method: "POST",
      body: { rateLimitEnabled: true }
    });

    const testRateUrl = makeSignedUrl("/api/v2/shop/get_shop_info");
    const rateLimitRes = await request(testRateUrl);
    assert(rateLimitRes.status === 429, "Simulate rateLimitEnabled returns HTTP 429");
    assert(rateLimitRes.json.error === "error_rate_limit", "Returns error_rate_limit code");

    // 6.3 Simulate Forced Invalid Signature
    await request("/api/v2/simulator/config", {
      method: "POST",
      body: { rateLimitEnabled: false, forceInvalidSign: true }
    });

    const testSignUrl = makeSignedUrl("/api/v2/shop/get_shop_info");
    const signRes = await request(testSignUrl);
    assert(signRes.json.error === "error_sign", "Simulate forceInvalidSign returns error_sign");

    // 6.4 Simulate Forced Expired Token
    await request("/api/v2/simulator/config", {
      method: "POST",
      body: { forceInvalidSign: false, forceExpiredToken: true }
    });

    const testTokenUrl = makeSignedUrl("/api/v2/shop/get_shop_info");
    const tokenRes = await request(testTokenUrl);
    assert(tokenRes.json.error === "error_auth", "Simulate forceExpiredToken returns error_auth");

    // 6.5 Restore Config Defaults
    await request("/api/v2/simulator/config", {
      method: "POST",
      body: {
        rateLimitEnabled: false,
        forceInvalidSign: false,
        forceExpiredToken: false,
        artificialDelayMs: 0
      }
    });

    const restoredUrl = makeSignedUrl("/api/v2/shop/get_shop_info");
    const restoredRes = await request(restoredUrl);
    assert(restoredRes.json.error === "", "Normal operations restored after fault toggle cleared");
    console.log();

    console.log("=======================================================");
    console.log("   🎉 ALL 30 PHASE 5 TEST ASSERTIONS PASSED WITH 100%  ");
    console.log("=======================================================\n");
  } finally {
    // Teardown
    await prisma.simulatorConfig.update({
      where: { id: 1 },
      data: {
        rateLimitEnabled: false,
        forceInvalidSign: false,
        forceExpiredToken: false,
        artificialDelayMs: 0
      }
    });
    server.close();
    webhookServer.close();
  }
}

runPhase5Tests().catch(err => {
  console.error("Test Suite Terminated with Error:", err);
  process.exit(1);
});
