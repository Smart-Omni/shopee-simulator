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
let testProduct: any;
let testOrderSn: string | null = null;

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

async function runPhase10Tests() {
  console.log("\n=======================================================");
  console.log("PHASE 10 TEST SUITE: SKU LIFECYCLE & ORDER DEADLINES");
  console.log("=======================================================\n");

  server = app.listen(0);
  const addr = server.address() as any;
  baseUrl = `http://127.0.0.1:${addr.port}`;

  try {
    const shop = await prisma.shop.findUnique({ where: { shopId: BigInt(SHOP_ID) } });
    assert(shop !== null, "Target Shop exists");
    accessToken = shop!.accessToken || "test_access_token";

    // Setup base product
    testProduct = await prisma.product.create({
      data: {
        shopId: BigInt(SHOP_ID),
        categoryId: BigInt(100001),
        itemName: "Lifecycle & Deadline Test Watch",
        description: "Testing active/unlist and SLA deadlines",
        originalPrice: 500000,
        currency: "VND",
        itemStatus: "NORMAL",
        itemSku: `PH10-WATCH-${Date.now()}`,
        imagesJson: { image_id_list: [], image_url_list: [] }
      }
    });
    assert(testProduct !== null, "Test product created");

    // -------------------------------------------------------------
    // Test 1: Unlist Item via Official OpenAPI v2.product.unlist_item
    // -------------------------------------------------------------
    console.log("\n[Test 1] Unlist Item via Official v2.product.unlist_item");
    const unlistPath = makeSignedUrl("/api/v2/product/unlist_item");
    const unlistRes = await request(unlistPath, {
      method: "POST",
      body: {
        item_list: [
          { item_id: Number(testProduct.itemId), unlist: true }
        ]
      }
    });

    assert(unlistRes.json.error === "", "unlist_item succeeds without error");
    assert(Array.isArray(unlistRes.json.response.success_list), "success_list is array");
    assert(unlistRes.json.response.success_list[0].item_id === Number(testProduct.itemId), "success_list contains item_id");
    assert(unlistRes.json.response.success_list[0].unlist === true, "success_list confirms unlist=true");

    const unlistedProduct = await prisma.product.findUnique({ where: { itemId: testProduct.itemId } });
    assert(unlistedProduct?.itemStatus === "UNLIST", "Product itemStatus updated to 'UNLIST' in DB");

    // -------------------------------------------------------------
    // Test 2: Buyer Catalog Filtering (view_mode=buyer hides UNLIST items)
    // -------------------------------------------------------------
    console.log("\n[Test 2] Buyer Catalog Filtering (view_mode=buyer excludes UNLIST)");
    const buyerCatalogRes = await request(`/api/v2/simulator/products?shop_id=${SHOP_ID}&view_mode=buyer`);
    const buyerFound = buyerCatalogRes.json.response.products.some((p: any) => p.item_id === Number(testProduct.itemId));
    assert(buyerFound === false, "Unlisted item is HIDDEN from buyer catalog (view_mode=buyer)");

    const sellerCatalogRes = await request(`/api/v2/simulator/products?shop_id=${SHOP_ID}&view_mode=seller`);
    const sellerItem = sellerCatalogRes.json.response.products.find((p: any) => p.item_id === Number(testProduct.itemId));
    assert(sellerItem !== undefined, "Unlisted item is VISIBLE to seller");
    assert(sellerItem.item_status === "UNLIST", "Seller catalog displays item_status as 'UNLIST'");

    // -------------------------------------------------------------
    // Test 3: Relist Item (unlist: false)
    // -------------------------------------------------------------
    console.log("\n[Test 3] Relist Item (unlist: false)");
    const relistRes = await request(unlistPath, {
      method: "POST",
      body: {
        item_list: [
          { item_id: Number(testProduct.itemId), unlist: false }
        ]
      }
    });
    assert(relistRes.json.error === "", "Relist succeeds without error");
    const relistedProduct = await prisma.product.findUnique({ where: { itemId: testProduct.itemId } });
    assert(relistedProduct?.itemStatus === "NORMAL", "Product itemStatus restored to 'NORMAL' in DB");

    // -------------------------------------------------------------
    // Test 4: Order Creation Generates Explicit shipByDate
    // -------------------------------------------------------------
    console.log("\n[Test 4] Order Creation Populates payTime and shipByDate (+2 Days DTS)");
    const orderCreateRes = await request("/api/v2/simulator/order/create", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        order_status: "READY_TO_SHIP",
        recipient_name: "Tran Van Test",
        recipient_phone: "+84988776655",
        recipient_city: "Ho Chi Minh City",
        items: [
          {
            item_id: Number(testProduct.itemId),
            quantity: 1
          }
        ]
      }
    });

    assert(orderCreateRes.json.error === "", "Order creation succeeds");
    testOrderSn = orderCreateRes.json.response.order_sn;
    assert(Boolean(testOrderSn), "order_sn generated");

    const dbOrder = await prisma.order.findUnique({ where: { orderSn: testOrderSn! } });
    assert(dbOrder !== null, "Order stored in DB");
    assert(dbOrder?.payTime !== null, "payTime is recorded on order");
    assert(dbOrder?.shipByDate !== null, "shipByDate is recorded on order");

    const diffHours = (dbOrder!.shipByDate!.getTime() - dbOrder!.payTime!.getTime()) / (1000 * 3600);
    assert(Math.round(diffHours) === 48, "shipByDate is exactly 48 hours (2 Days to Ship) from payTime");

    // -------------------------------------------------------------
    // Test 5: Overdue Orders Auto-Cancellation Engine (expire_overdue)
    // -------------------------------------------------------------
    console.log("\n[Test 5] SLA Deadline Expiry Worker Cancels Overdue Orders");
    // Manually wind order's shipByDate to 1 hour in the past
    const pastTime = new Date(Date.now() - 3600 * 1000);
    await prisma.order.update({
      where: { orderSn: testOrderSn! },
      data: { shipByDate: pastTime }
    });

    // Run expire_overdue worker
    const expireRes = await request("/api/v2/simulator/order/expire_overdue", {
      method: "POST",
      body: {
        shop_id: SHOP_ID
      }
    });

    assert(expireRes.json.error === "", "expire_overdue executed successfully");
    assert(expireRes.json.response.expired_count >= 1, "At least 1 overdue order detected and cancelled");
    assert(expireRes.json.response.expired_orders.includes(testOrderSn), "Test order was in expired_orders list");

    const cancelledOrder = await prisma.order.findUnique({ where: { orderSn: testOrderSn! } });
    assert(cancelledOrder?.orderStatus === "CANCELLED", "Order status updated to 'CANCELLED'");
    assert(cancelledOrder?.cancelBy === "SYSTEM", "cancelBy is 'SYSTEM'");
    assert(cancelledOrder?.cancelReason === "Seller did not ship order on time", "cancelReason records seller SLA failure");

    console.log("\n✅ ALL 16 PHASE 10 ASSERTIONS PASSED!\n");
  } finally {
    if (testOrderSn) {
      await prisma.orderItem.deleteMany({ where: { orderSn: testOrderSn } }).catch(() => {});
      await prisma.order.delete({ where: { orderSn: testOrderSn } }).catch(() => {});
    }
    if (testProduct) {
      await prisma.productModel.deleteMany({ where: { itemId: testProduct.itemId } }).catch(() => {});
      await prisma.product.delete({ where: { itemId: testProduct.itemId } }).catch(() => {});
    }
    server.close();
  }
}

if (require.main === module) {
  runPhase10Tests().catch(err => {
    console.error("Test execution failed:", err);
    process.exit(1);
  });
}

export { runPhase10Tests };
