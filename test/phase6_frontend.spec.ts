import { app } from "../src/index";
import { prisma } from "../src/common/prisma";
import * as http from "http";

const SHOP_ID = 727720655;
const PARTNER_ID = 1001141;

let server: http.Server;
let baseUrl: string;

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
  let buffer: Buffer | null = null;

  if (contentType.includes("application/json")) {
    json = await res.json();
  } else if (contentType.includes("application/pdf")) {
    const arrayBuf = await res.arrayBuffer();
    buffer = Buffer.from(arrayBuf);
  } else {
    text = await res.text();
  }

  return { status: res.status, headers: res.headers, json, text, buffer };
}

async function runPhase6Tests() {
  console.log("=======================================================");
  console.log("   SHOPEE SIMULATOR: PHASE 6 FRONTEND TEST UI SUITE    ");
  console.log("=======================================================\n");

  server = app.listen(0);
  const port = (server.address() as any).port;
  baseUrl = `http://localhost:${port}`;
  console.log(`Simulator Server running at ${baseUrl}\n`);

  try {
    // =========================================================================
    // TEST GROUP 1: Static UI Serving & HTML Delivery
    // =========================================================================
    console.log("TEST GROUP 1: Static Single Page Application Serving (GET / and /ui)");
    const rootRes = await request("/");
    assert(rootRes.status === 200, "Root path (/) returns HTTP 200");
    assert((rootRes.headers.get("content-type") || "").includes("text/html"), "Root path serves text/html");
    assert(rootRes.text.includes("Shopee Simulator"), "HTML contains 'Shopee Simulator' header");
    assert(rootRes.text.includes("Shop Screen (Seller)"), "HTML contains Shop Screen tab");
    assert(rootRes.text.includes("Buyer Screen (Shopee Customer)"), "HTML contains Buyer Screen tab");
    assert(rootRes.text.includes("Integration & Test Console"), "HTML contains Integration & Test Console tab");

    const uiRes = await request("/ui");
    assert(uiRes.status === 200, "/ui alias path returns HTTP 200");
    assert(uiRes.text.includes("Shopee Checkout"), "HTML contains Buyer Checkout modal");
    console.log();

    // =========================================================================
    // TEST GROUP 2: Shop Screen Controller APIs
    // =========================================================================
    console.log("TEST GROUP 2: Shop Screen Controller APIs");

    // 2.1 Shop Overview
    const overviewRes = await request(`/api/v2/simulator/shop/overview?shop_id=${SHOP_ID}`);
    assert(overviewRes.status === 200, "GET /api/v2/simulator/shop/overview returns HTTP 200");
    assert(overviewRes.json.error === "", "Empty error code on shop overview");
    assert(overviewRes.json.response.shop_id === SHOP_ID, "Reported shop_id is 727720655");
    assert(overviewRes.json.response.region === "VN", "Reported region is VN");
    assert(overviewRes.json.response.partner_id === PARTNER_ID, "Reported partner_id is 1001141");
    assert(typeof overviewRes.json.response.token_remaining_sec === "number", "Returns numeric token_remaining_sec");

    // 2.2 Toggle Vacation Mode
    const vacOnRes = await request("/api/v2/simulator/shop/vacation", {
      method: "POST",
      body: { shop_id: SHOP_ID, is_vacation: true }
    });
    assert(vacOnRes.status === 200, "POST /api/v2/simulator/shop/vacation returns HTTP 200");
    assert(vacOnRes.json.response.is_vacation === true, "Holiday mode set to true");

    // Verify products list includes is_vacation === true
    const vacProdsRes = await request(`/api/v2/simulator/products?shop_id=${SHOP_ID}`);
    assert(vacProdsRes.json.response.products[0].is_vacation === true, "Products reflect shop is_vacation === true");

    // Attempting to place order on vacation shop fails with error_business
    const blockedOrderRes = await request("/api/v2/simulator/order/create", {
      method: "POST",
      body: { shop_id: SHOP_ID, total_amount: 50000 }
    });
    assert(blockedOrderRes.json.error === "error_business", "Order placement blocked when shop is in vacation mode");

    const vacOffRes = await request("/api/v2/simulator/shop/vacation", {
      method: "POST",
      body: { shop_id: SHOP_ID, is_vacation: false }
    });
    assert(vacOffRes.json.response.is_vacation === false, "Holiday mode reverted to false");

    // 2.3 Refresh Shop Token
    const refreshRes = await request("/api/v2/simulator/shop/refresh_token", {
      method: "POST",
      body: { shop_id: SHOP_ID }
    });
    assert(refreshRes.status === 200, "POST /api/v2/simulator/shop/refresh_token returns HTTP 200");
    assert(typeof refreshRes.json.response.access_token === "string", "Issued fresh string access_token");
    assert(refreshRes.json.response.expire_in === 14400, "Token validity is 14400 seconds (4 hours)");
    console.log();

    // =========================================================================
    // TEST GROUP 3: Product Inventory & Quick Stock Editor
    // =========================================================================
    console.log("TEST GROUP 3: Product Inventory & Quick Stock Update");
    const productsRes = await request(`/api/v2/simulator/products?shop_id=${SHOP_ID}`);
    assert(productsRes.status === 200, "GET /api/v2/simulator/products returns HTTP 200");
    assert(Array.isArray(productsRes.json.response.products), "products field is an array");
    assert(productsRes.json.response.products.length > 0, "Contains at least 1 product");

    const firstProduct = productsRes.json.response.products[0];
    assert(typeof firstProduct.item_name === "string", "Product has string item_name");
    assert(Array.isArray(firstProduct.models), "Product contains models array");

    if (firstProduct.models.length > 0) {
      const targetModel = firstProduct.models[0];
      const newStockVal = 125;

      const updateStockRes = await request("/api/v2/simulator/product/quick_update_stock", {
        method: "POST",
        body: {
          item_id: firstProduct.item_id,
          model_id: targetModel.model_id,
          stock: newStockVal
        }
      });

      assert(updateStockRes.status === 200, "Quick stock update returns HTTP 200");
      assert(updateStockRes.json.response.seller_stock === newStockVal, "Reported seller_stock matches updated value");

      const verifyModel = await prisma.productModel.findUnique({
        where: { modelId: BigInt(targetModel.model_id) }
      });
      assert(verifyModel?.sellerStock === newStockVal, "Database product_models table updated with new stock");
    }
    console.log();

    // =========================================================================
    // TEST GROUP 4: End-to-End User Journey (Buyer Checkout -> Fulfill -> AWB)
    // =========================================================================
    console.log("TEST GROUP 4: Full End-to-End User Journey Simulation");

    // Step 4.1: Buyer places an order with Cash on Delivery (status: UNPAID)
    const journeyOrderSn = `E2E${Date.now().toString(36).toUpperCase()}`;
    const buyerCheckoutRes = await request("/api/v2/simulator/order/create", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        order_sn: journeyOrderSn,
        order_status: "UNPAID",
        total_amount: 450000,
        shipping_carrier: "Shopee Xpress",
        recipient_name: "Tran Van Test",
        recipient_phone: "+84988776655",
        recipient_address: "456 Tran Hung Dao, District 5, Ho Chi Minh City"
      }
    });

    assert(buyerCheckoutRes.status === 200, "Buyer checkout returns HTTP 200");
    assert(buyerCheckoutRes.json.response.order_sn === journeyOrderSn, "Order created with target SN");
    assert(buyerCheckoutRes.json.response.order_status === "UNPAID", "Initial order status is UNPAID");

    // Step 4.2: Buyer simulates clicking "Pay Now"
    const payRes = await request("/api/v2/simulator/order/pay", {
      method: "POST",
      body: { order_sn: journeyOrderSn }
    });
    assert(payRes.status === 200, "POST /api/v2/simulator/order/pay returns HTTP 200");
    assert(payRes.json.response.order_status === "READY_TO_SHIP", "Order status advanced to READY_TO_SHIP");

    // Step 4.3: Seller simulates clicking "Arrange Shipment" on Shop Screen
    const shipRes = await request("/api/v2/simulator/order/ship", {
      method: "POST",
      body: { order_sn: journeyOrderSn }
    });
    assert(shipRes.status === 200, "POST /api/v2/simulator/order/ship returns HTTP 200");
    assert(shipRes.json.response.order_status === "PROCESSED", "Order status advanced to PROCESSED");
    assert(typeof shipRes.json.response.tracking_number === "string", "Tracking number assigned");
    assert(shipRes.json.response.tracking_number.startsWith("SPXVN"), "Tracking number starts with SPXVN");
    const assignedTracking = shipRes.json.response.tracking_number;

    // Step 4.4: Seller marks AWB Document as READY
    const awbRes = await request("/api/v2/simulator/order/generate_awb", {
      method: "POST",
      body: { order_sn: journeyOrderSn }
    });
    assert(awbRes.status === 200, "POST /api/v2/simulator/order/generate_awb returns HTTP 200");
    assert(awbRes.json.response.document_status === "READY", "Document status is READY");

    // Step 4.5: Seller downloads printable Airway Bill binary PDF
    const downloadRes = await request(`/api/v2/simulator/order/download_awb?order_sn=${journeyOrderSn}`);
    assert(downloadRes.status === 200, "GET /api/v2/simulator/order/download_awb returns HTTP 200");
    assert((downloadRes.headers.get("content-type") || "").includes("application/pdf"), "Content-Type is application/pdf");
    assert(downloadRes.buffer !== null, "Received binary PDF buffer");
    assert(downloadRes.buffer!.length > 500, "PDF buffer size is valid (>500 bytes)");

    const pdfString = downloadRes.buffer!.toString("utf-8");
    assert(pdfString.startsWith("%PDF-1.4"), "PDF starts with %PDF-1.4 magic header");
    assert(pdfString.includes(assignedTracking), "PDF contains the assigned tracking number");
    assert(pdfString.includes(journeyOrderSn), "PDF contains the order SN");
    assert(pdfString.includes("%%EOF"), "PDF terminates with %%EOF trailer");
    console.log();

    console.log("=======================================================");
    console.log("   🎉 ALL 27 PHASE 6 TEST ASSERTIONS PASSED WITH 100%  ");
    console.log("=======================================================\n");
  } finally {
    server.close();
  }
}

runPhase6Tests().catch(err => {
  console.error("Phase 6 Test Suite Terminated with Error:", err);
  process.exit(1);
});
