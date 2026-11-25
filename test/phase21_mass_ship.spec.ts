import { app } from "../src/index";
import { prisma } from "../src/common/prisma";
import { OrderStatus } from "@prisma/client";
import * as http from "http";

const SHOP_ID = 727720655;

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
    const arrBuf = await res.arrayBuffer();
    buffer = Buffer.from(arrBuf);
  } else {
    text = await res.text();
  }

  return { status: res.status, headers: res.headers, json, text, buffer };
}

async function runPhase21Tests() {
  console.log("===============================================================");
  console.log("   SHOPEE SIMULATOR: PHASE 21 MASS SHIP BACKEND TEST SUITE     ");
  console.log("===============================================================\n");

  server = app.listen(0);
  const port = (server.address() as any).port;
  baseUrl = `http://localhost:${port}`;
  console.log(`Simulator Server running at ${baseUrl}\n`);

  try {
    // -------------------------------------------------------------------------
    // SETUP: Create unique test orders for mass ship
    // -------------------------------------------------------------------------
    console.log("TEST GROUP 1: Database Setup with Mass Ship Test Orders");

    const ts = Date.now();
    const orderSnSPX1 = `MASS_SPX_1_${ts}`;
    const orderSnSPX2 = `MASS_SPX_2_${ts}`;
    const orderSnGHN1 = `MASS_GHN_1_${ts}`;

    // Get an existing product
    const product = await prisma.product.findFirst({
      where: { shopId: BigInt(SHOP_ID) }
    });
    if (!product) {
      throw new Error("No product found for shop " + SHOP_ID);
    }

    // Insert test orders
    await prisma.order.createMany({
      data: [
        {
          orderSn: orderSnSPX1,
          shopId: BigInt(SHOP_ID),
          buyerUserId: BigInt(12345),
          buyerUsername: "buyer_mass_spx1",
          orderStatus: OrderStatus.READY_TO_SHIP,
          totalAmount: 150000,
          currency: "VND",
          shippingCarrier: "Shopee Xpress",
          recipientName: "Nguyen Van Test 1",
          recipientPhone: "0901111222",
          recipientAddress: "123 Le Loi",
          recipientDistrict: "Quan 1",
          recipientCity: "TP Ho Chi Minh"
        },
        {
          orderSn: orderSnSPX2,
          shopId: BigInt(SHOP_ID),
          buyerUserId: BigInt(12346),
          buyerUsername: "buyer_mass_spx2",
          orderStatus: OrderStatus.READY_TO_SHIP,
          totalAmount: 250000,
          currency: "VND",
          shippingCarrier: "Shopee Xpress",
          recipientName: "Tran Thi Test 2",
          recipientPhone: "0902222333",
          recipientAddress: "456 Nguyen Hue",
          recipientDistrict: "Quan 1",
          recipientCity: "TP Ho Chi Minh"
        },
        {
          orderSn: orderSnGHN1,
          shopId: BigInt(SHOP_ID),
          buyerUserId: BigInt(12347),
          buyerUsername: "buyer_mass_ghn1",
          orderStatus: OrderStatus.READY_TO_SHIP,
          totalAmount: 350000,
          currency: "VND",
          shippingCarrier: "Giao Hàng Nhanh",
          recipientName: "Le Van Test 3",
          recipientPhone: "0903333444",
          recipientAddress: "789 Hai Ba Trung",
          recipientDistrict: "Quan 3",
          recipientCity: "TP Ho Chi Minh"
        }
      ]
    });

    // Add items for each order
    for (const sn of [orderSnSPX1, orderSnSPX2, orderSnGHN1]) {
      await prisma.orderItem.create({
        data: {
          orderSn: sn,
          itemId: product.itemId,
          itemName: product.itemName,
          itemPrice: 150000,
          quantityPurchased: 1
        }
      });
    }

    assert(true, "Successfully inserted 3 mass ship test orders");

    // -------------------------------------------------------------------------
    // TEST 2: GET /api/v2/simulator/orders includes carrier counts
    // -------------------------------------------------------------------------
    console.log("\nTEST GROUP 2: Carrier Counts Breakdown in Orders API");

    const ordersRes = await request(`/api/v2/simulator/orders?shop_id=${SHOP_ID}`);
    assert(ordersRes.status === 200, "GET /api/v2/simulator/orders returns 200");
    const data = ordersRes.json?.response;
    assert(data && data.carrier_counts, "orders response includes carrier_counts");
    assert(data.carrier_counts["Shopee Xpress"] >= 2, "Shopee Xpress has >= 2 count");
    assert(data.carrier_counts["Giao Hàng Nhanh"] >= 1, "Giao Hàng Nhanh has >= 1 count");
    assert(data.carrier_counts_ready["Shopee Xpress"] >= 2, "carrier_counts_ready has >= 2 for Shopee Xpress");

    // -------------------------------------------------------------------------
    // TEST 3: POST /api/v2/simulator/order/batch_ship validation
    // -------------------------------------------------------------------------
    console.log("\nTEST GROUP 3: Batch Ship API Validation");

    const emptyRes = await request("/api/v2/simulator/order/batch_ship", {
      method: "POST",
      body: { order_sn_list: [] }
    });
    assert(emptyRes.json?.error === "error_param", "Empty order_sn_list returns error_param");

    const nonArrayRes = await request("/api/v2/simulator/order/batch_ship", {
      method: "POST",
      body: { order_sn_list: "invalid" }
    });
    assert(nonArrayRes.json?.error === "error_param", "Non-array order_sn_list returns error_param");

    // -------------------------------------------------------------------------
    // TEST 4: POST /api/v2/simulator/order/batch_ship execution
    // -------------------------------------------------------------------------
    console.log("\nTEST GROUP 4: Batch Ship Execution (READY_TO_SHIP -> PROCESSED)");

    const batchShipRes = await request("/api/v2/simulator/order/batch_ship", {
      method: "POST",
      body: {
        order_sn_list: [orderSnSPX1, orderSnSPX2, orderSnGHN1, "NON_EXISTING_SN"],
        shipping_type: "pickup"
      }
    });

    assert(batchShipRes.status === 200, "batch_ship returns 200");
    const shipData = batchShipRes.json?.response;
    assert(shipData.total_processed === 4, "total_processed === 4");
    assert(shipData.success_count === 3, "success_count === 3");
    assert(shipData.fail_count === 1, "fail_count === 1 (non-existing SN)");
    assert(shipData.fail_list[0].order_sn === "NON_EXISTING_SN", "fail_list identified non-existing order");

    // Verify tracking number prefixes
    const spx1Success = shipData.success_list.find((s: any) => s.order_sn === orderSnSPX1);
    const ghn1Success = shipData.success_list.find((s: any) => s.order_sn === orderSnGHN1);
    assert(spx1Success && spx1Success.tracking_number.startsWith("SPXVN"), "SPX order gets SPXVN tracking number prefix");
    assert(ghn1Success && ghn1Success.tracking_number.startsWith("GHN"), "GHN order gets GHN tracking number prefix");

    // Verify DB states
    const updatedSPX1 = await prisma.order.findUnique({
      where: { orderSn: orderSnSPX1 },
      include: { packages: true }
    });
    assert(updatedSPX1?.orderStatus === OrderStatus.PROCESSED, "orderSnSPX1 is now PROCESSED in DB");
    assert(updatedSPX1?.packages.length! > 0, "orderSnSPX1 has package created");
    assert(updatedSPX1?.packages[0].trackingNumber === spx1Success.tracking_number, "package trackingNumber matches");
    assert(updatedSPX1?.packages[0].shippingType === "pickup", "shippingType is 'pickup'");

    // -------------------------------------------------------------------------
    // TEST 5: POST /api/v2/simulator/order/batch_generate_awb
    // -------------------------------------------------------------------------
    console.log("\nTEST GROUP 5: Batch Generate AWB Document");

    const batchGenRes = await request("/api/v2/simulator/order/batch_generate_awb", {
      method: "POST",
      body: {
        order_sn_list: [orderSnSPX1, orderSnSPX2],
        document_type: "shipping_label",
        print_format: "thermal"
      }
    });

    assert(batchGenRes.status === 200, "batch_generate_awb returns 200");
    const genData = batchGenRes.json?.response;
    assert(genData.success_count === 2, "genData.success_count === 2");
    assert(typeof genData.download_url === "string", "genData returns download_url");
    assert(genData.download_url.includes("order_sn_list="), "download_url includes order_sn_list");

    // -------------------------------------------------------------------------
    // TEST 6: GET /api/v2/simulator/order/batch_download_awb (Multi-page PDF)
    // -------------------------------------------------------------------------
    console.log("\nTEST GROUP 6: Multi-Page AWB PDF Binary Generation");

    // Normal format
    const normalPdfRes = await request(`/api/v2/simulator/order/batch_download_awb?order_sn_list=${orderSnSPX1},${orderSnSPX2}&doc_type=shipping_label&print_format=normal`);
    assert(normalPdfRes.status === 200, "batch_download_awb normal format returns 200");
    assert(normalPdfRes.headers.get("content-type") === "application/pdf", "Content-Type is application/pdf");
    assert(normalPdfRes.buffer && normalPdfRes.buffer.length > 500, "PDF buffer generated with size > 500 bytes");
    const pdfHeader = normalPdfRes.buffer!.toString("utf-8", 0, 8);
    assert(pdfHeader.startsWith("%PDF-1.4"), "PDF starts with standard %PDF-1.4 header");
    const pdfContent = normalPdfRes.buffer!.toString("utf-8");
    assert(pdfContent.includes("/Count 2"), "Multi-page PDF has /Count 2 pages for 2 orders");
    assert(pdfContent.includes(orderSnSPX1), "PDF contains orderSnSPX1");
    assert(pdfContent.includes(orderSnSPX2), "PDF contains orderSnSPX2");

    // Thermal format
    const thermalPdfRes = await request(`/api/v2/simulator/order/batch_download_awb?order_sn_list=${orderSnSPX1},${orderSnSPX2}&doc_type=shipping_label&print_format=thermal`);
    assert(thermalPdfRes.status === 200, "batch_download_awb thermal format returns 200");
    const thermalContent = thermalPdfRes.buffer!.toString("utf-8");
    assert(thermalContent.includes("[0 0 283 425]"), "Thermal PDF has 100x150 MediaBox [0 0 283 425]");

    // -------------------------------------------------------------------------
    // TEST 7: GET /api/v2/simulator/order/manifest (Handover Sheet / Manifest)
    // -------------------------------------------------------------------------
    console.log("\nTEST GROUP 7: Handover Manifest PDF Generation");

    const manifestRes = await request(`/api/v2/simulator/order/manifest?order_sn_list=${orderSnSPX1},${orderSnSPX2}&carrier=Shopee+Xpress&shop_id=${SHOP_ID}`);
    assert(manifestRes.status === 200, "manifest returns 200");
    assert(manifestRes.headers.get("content-type") === "application/pdf", "Content-Type is application/pdf");
    const manifestPdf = manifestRes.buffer!.toString("utf-8");
    assert(manifestPdf.startsWith("%PDF-1.4"), "Manifest PDF starts with %PDF-1.4");
    assert(manifestPdf.includes("BIEN BAN BAN GIAO HANG HOA"), "Manifest contains title header");
    assert(manifestPdf.includes(orderSnSPX1), "Manifest contains orderSnSPX1");

    console.log("\n===============================================================");
    console.log("   ALL 18 PHASE 21 MASS SHIP TESTS PASSED SUCCESSFULLY! ✓      ");
    console.log("===============================================================\n");

  } finally {
    if (server) {
      server.close();
    }
  }
}

runPhase21Tests().catch((err) => {
  console.error("FATAL ERROR in Phase 21 test runner:", err);
  process.exit(1);
});
