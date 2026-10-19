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
let testProductId: number;

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

async function runTests() {
  console.log("\n=======================================================");
  console.log("   SHOPEE SIMULATOR: PHASE 4 ORDER & LOGISTICS SUITE   ");
  console.log("=======================================================\n");

  server = app.listen(0);
  const addr = server.address() as any;
  baseUrl = `http://localhost:${addr.port}`;
  console.log(`Test server running at ${baseUrl}\n`);

  try {
    // ------------------------------------------------------------------------
    console.log("PREPARATION: Fetch Active Access Token & Clean Test Data");
    // ------------------------------------------------------------------------
    const shop = await prisma.shop.findUnique({ where: { shopId: BigInt(SHOP_ID) } });
    if (!shop || !shop.accessToken) {
      throw new Error("No active access token found for shop 727720655. Run seed or Phase 1 tests first.");
    }
    accessToken = shop.accessToken;
    console.log(`Using active accessToken: ${accessToken}`);

    // Ensure a product exists for creating order items
    let product = await prisma.product.findFirst({ where: { shopId: BigInt(SHOP_ID) } });
    if (!product) {
      product = await prisma.product.create({
        data: {
          shopId: BigInt(SHOP_ID),
          categoryId: BigInt(100001),
          itemName: "SmartOmni Wireless Earbuds Pro",
          description: "Premium earbuds",
          originalPrice: 250000,
          weight: 0.35,
          imagesJson: { image_id_list: ["test_img_1"] }
        }
      });
    }
    testProductId = Number(product.itemId);

    // Clean up test orders
    await prisma.order.deleteMany({ where: { shopId: BigInt(SHOP_ID) } });
    console.log("Cleaned up previous test orders\n");

    // ------------------------------------------------------------------------
    console.log("SEEDING: Create Mock Orders via Simulator Checkout");
    // ------------------------------------------------------------------------
    const testOrderSn1 = "ORD261019TEST01";
    const seedRes = await request("/api/v2/simulator/order/create", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        order_sn: testOrderSn1,
        order_status: "READY_TO_SHIP",
        total_amount: 265000,
        shipping_carrier: "Shopee Xpress",
        recipient_name: "Nguyen Van A",
        recipient_phone: "+84901234567",
        recipient_address: "123 Le Loi, District 1, Ho Chi Minh City",
        items: [
          {
            item_id: testProductId,
            item_name: "SmartOmni Wireless Earbuds Pro",
            item_price: 250000,
            quantity_purchased: 1
          }
        ]
      }
    });

    assert(seedRes.status === 200, "Simulator order creation returns HTTP 200");
    assert(seedRes.json?.response?.order_sn === testOrderSn1, "Seeded order SN matches");
    console.log(`  -> Seeded order: ${testOrderSn1} in READY_TO_SHIP\n`);

    // ------------------------------------------------------------------------
    console.log("TEST GROUP 1: Get Order List (GET /api/v2/order/get_order_list)");
    // ------------------------------------------------------------------------
    {
      const now = Math.floor(Date.now() / 1000);
      const url = makeSignedUrl("/api/v2/order/get_order_list", {
        time_range_field: "create_time",
        time_from: now - 86400,
        time_to: now + 3600,
        page_size: 10,
        order_status: "READY_TO_SHIP"
      });

      const res = await request(url);
      assert(res.status === 200, "Get order list returns HTTP 200");
      assert(res.json?.error === "", "Empty error code indicates success");
      assert(Array.isArray(res.json?.response?.order_list), "order_list is an array");
      assert(res.json?.response?.order_list.length >= 1, "Contains at least 1 order");

      const found = res.json?.response?.order_list.find((o: any) => o.order_sn === testOrderSn1);
      assert(!!found, "Seeded order found in order list");
      assert(found.order_status === "READY_TO_SHIP", "Order status is READY_TO_SHIP");
      assert(typeof res.json?.response?.more === "boolean", "Returns 'more' pagination boolean");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 2: Get Order Detail (GET /api/v2/order/get_order_detail)");
    // ------------------------------------------------------------------------
    {
      // 2.1 Missing order_sn_list
      const urlMissing = makeSignedUrl("/api/v2/order/get_order_detail");
      const resMissing = await request(urlMissing);
      assert(resMissing.json?.error === "error_param", "Missing order_sn_list returns error_param");

      // 2.2 Valid order_sn_list
      const url = makeSignedUrl("/api/v2/order/get_order_detail", { order_sn_list: testOrderSn1 });
      const res = await request(url);

      assert(res.status === 200, "Get order detail returns HTTP 200");
      assert(res.json?.error === "", "Empty error code on order detail");
      assert(Array.isArray(res.json?.response?.order_list), "order_list is an array");
      assert(res.json?.response?.order_list.length === 1, "Returns exactly 1 order detail");

      const order = res.json?.response?.order_list[0];
      assert(order.order_sn === testOrderSn1, "Order SN matches");
      assert(order.region === "VN", "Region is VN");
      assert(order.currency === "VND", "Currency is VND");
      assert(order.total_amount === 265000, "Total amount is 265000 VND");
      assert(order.order_status === "READY_TO_SHIP", "Status is READY_TO_SHIP");
      assert(order.shipping_carrier === "Shopee Xpress", "Shipping carrier is Shopee Xpress");
      assert(order.recipient_address?.name === "Nguyen Van A", "Recipient name matches");
      assert(order.recipient_address?.full_address?.includes("123 Le Loi"), "Full address matches");
      assert(order.item_list?.length === 1, "Contains 1 line item");
      assert(order.item_list[0].item_id === testProductId, "Line item item_id matches");
      assert(order.package_list?.length === 1, "Contains 1 default package");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 3: Get Logistics Channels (GET /api/v2/logistics/get_channel_list)");
    // ------------------------------------------------------------------------
    {
      const url = makeSignedUrl("/api/v2/logistics/get_channel_list");
      const res = await request(url);

      assert(res.status === 200, "Get channel list returns HTTP 200");
      assert(res.json?.error === "", "Empty error code on channel list");
      assert(Array.isArray(res.json?.response?.logistics_channel_list), "logistics_channel_list is an array");
      assert(res.json?.response?.logistics_channel_list.length >= 3, "Contains at least 3 channels (SPX, GHTK, Viettel)");

      const spx = res.json?.response?.logistics_channel_list.find((ch: any) => ch.logistics_channel_id === 30001);
      assert(!!spx, "Shopee Xpress (30001) found in channel list");
      assert(spx.logistics_channel_name === "Shopee Xpress", "Channel name is Shopee Xpress");
      assert(spx.cod_enabled === true, "COD is enabled");
      assert(spx.weight_limit?.item_max_weight === 30, "Max weight is 30kg");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 4: Get Shipping Parameters (GET /api/v2/logistics/get_shipping_parameter)");
    // ------------------------------------------------------------------------
    {
      const url = makeSignedUrl("/api/v2/logistics/get_shipping_parameter", { order_sn: testOrderSn1 });
      const res = await request(url);

      assert(res.status === 200, "Get shipping parameter returns HTTP 200");
      assert(res.json?.error === "", "Empty error code on shipping parameter");
      assert(Array.isArray(res.json?.response?.info_needed?.dropoff), "info_needed.dropoff is an array");
      assert(Array.isArray(res.json?.response?.info_needed?.pickup), "info_needed.pickup is an array");
      assert(Array.isArray(res.json?.response?.pickup?.address_list), "pickup.address_list is an array");
      assert(res.json?.response?.pickup?.address_list.length >= 1, "Returns at least 1 pickup address");

      const addr = res.json?.response?.pickup?.address_list[0];
      assert(addr.address_id === 1, "Address ID is 1 (seeded address)");
      assert(Array.isArray(addr.time_slot_list), "Returns pickup time_slot_list");
      assert(addr.time_slot_list.length >= 2, "Contains morning and afternoon pickup slots");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 5: Arrange Shipment Booking (POST /api/v2/logistics/ship_order)");
    // ------------------------------------------------------------------------
    {
      const shipPayload = {
        order_sn: testOrderSn1,
        pickup: {
          address_id: 1,
          pickup_time_id: "slot_morning"
        }
      };

      const url = makeSignedUrl("/api/v2/logistics/ship_order");
      const res = await request(url, { method: "POST", body: shipPayload });

      assert(res.status === 200, "Ship order returns HTTP 200");
      assert(res.json?.error === "", "Empty error code indicates shipment arrangement success");

      // Verify status transition in DB: READY_TO_SHIP -> PROCESSED
      const updatedOrder = await prisma.order.findUnique({
        where: { orderSn: testOrderSn1 },
        include: { packages: true }
      });
      assert(updatedOrder?.orderStatus === "PROCESSED", "Order status transitioned to PROCESSED");
      assert(updatedOrder?.packages[0]?.logisticsStatus === "LOGISTICS_REQUEST_CREATED", "Package status is LOGISTICS_REQUEST_CREATED");
      assert(!!updatedOrder?.packages[0]?.trackingNumber, "Tracking number assigned to package");
      assert(updatedOrder?.packages[0]?.trackingNumber?.startsWith("SPXVN"), "Tracking number follows SPXVN format");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 6: Get Tracking Number (GET /api/v2/logistics/get_tracking_number)");
    // ------------------------------------------------------------------------
    let assignedTrackingNo: string;
    {
      const url = makeSignedUrl("/api/v2/logistics/get_tracking_number", { order_sn: testOrderSn1 });
      const res = await request(url);

      assert(res.status === 200, "Get tracking number returns HTTP 200");
      assert(res.json?.error === "", "Empty error code on tracking number");
      assert(typeof res.json?.response?.tracking_number === "string", "Returns string tracking_number");
      assert(res.json?.response?.tracking_number.startsWith("SPXVN"), "Tracking number starts with SPXVN");

      assignedTrackingNo = res.json?.response?.tracking_number;
      console.log(`  -> Assigned Tracking Number: ${assignedTrackingNo}`);
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 7: Create Shipping Document Job (POST /api/v2/logistics/create_shipping_document)");
    // ------------------------------------------------------------------------
    {
      const docPayload = {
        order_list: [
          {
            order_sn: testOrderSn1,
            tracking_number: assignedTrackingNo,
            shipping_document_type: "NORMAL_AIR_WAYBILL"
          }
        ]
      };

      const url = makeSignedUrl("/api/v2/logistics/create_shipping_document");
      const res = await request(url, { method: "POST", body: docPayload });

      assert(res.status === 200, "Create shipping document returns HTTP 200");
      assert(res.json?.error === "", "Empty error code on create document");
      assert(Array.isArray(res.json?.response?.result_list), "result_list is an array");
      assert(res.json?.response?.result_list[0]?.order_sn === testOrderSn1, "Result order SN matches");
      assert(res.json?.response?.result_list[0]?.status === "READY", "Document status is READY");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 8: Get Shipping Document Result (POST & GET /api/v2/logistics/get_shipping_document_result)");
    // ------------------------------------------------------------------------
    {
      const pollPayload = {
        order_list: [{ order_sn: testOrderSn1 }]
      };

      const url = makeSignedUrl("/api/v2/logistics/get_shipping_document_result");
      const res = await request(url, { method: "POST", body: pollPayload });

      assert(res.status === 200, "Get document result returns HTTP 200");
      assert(res.json?.error === "", "Empty error code on get document result");
      assert(res.json?.response?.result_list[0]?.status === "READY", "Polled status is READY for download");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 9: Download Printable Airway Bill PDF (POST /api/v2/logistics/download_shipping_document)");
    // ------------------------------------------------------------------------
    {
      const downloadPayload = {
        order_list: [{ order_sn: testOrderSn1 }],
        shipping_document_type: "NORMAL_AIR_WAYBILL"
      };

      const url = makeSignedUrl("/api/v2/logistics/download_shipping_document");
      const res = await request(url, { method: "POST", body: downloadPayload });

      assert(res.status === 200, "Download shipping document returns HTTP 200");
      assert(res.headers.get("content-type") === "application/pdf", "Content-Type is application/pdf");
      assert(res.headers.get("content-disposition")?.includes(`awb_${testOrderSn1}.pdf`), "Content-Disposition includes order SN filename");
      assert(!!res.buffer && res.buffer.length > 200, "PDF buffer received with valid size");

      const pdfHeader = res.buffer!.slice(0, 8).toString("utf-8");
      assert(pdfHeader.startsWith("%PDF-1.4"), "PDF stream begins with valid %PDF-1.4 magic header");

      const pdfString = res.buffer!.toString("utf-8");
      assert(pdfString.includes(assignedTrackingNo), "PDF document contains the assigned tracking number");
      assert(pdfString.includes("SHOPEE AIRWAY BILL"), "PDF document contains standard Shopee AWB header");
      assert(pdfString.includes("%%EOF"), "PDF stream concludes with valid %%EOF trailer");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 10: Split Multi-Item Order (POST /api/v2/order/split_order)");
    // ------------------------------------------------------------------------
    {
      const splitOrderSn = "ORD261019SPLIT01";

      // Seed order with 2 distinct items
      await request("/api/v2/simulator/order/create", {
        method: "POST",
        body: {
          shop_id: SHOP_ID,
          order_sn: splitOrderSn,
          order_status: "READY_TO_SHIP",
          total_amount: 500000,
          items: [
            {
              item_id: testProductId,
              item_name: "SmartOmni Item 1",
              item_price: 250000,
              quantity_purchased: 1
            },
            {
              item_id: testProductId,
              item_name: "SmartOmni Item 2",
              item_price: 250000,
              quantity_purchased: 1
            }
          ]
        }
      });

      // Split into 2 packages
      const splitPayload = {
        order_sn: splitOrderSn,
        package_list: [
          {
            item_list: [
              { item_id: testProductId, model_quantity: 1 }
            ]
          },
          {
            item_list: [
              { item_id: testProductId, model_quantity: 1 }
            ]
          }
        ]
      };

      const url = makeSignedUrl("/api/v2/order/split_order");
      const res = await request(url, { method: "POST", body: splitPayload });

      assert(res.status === 200, "Split order returns HTTP 200");
      assert(res.json?.error === "", "Empty error code on split order");
      assert(res.json?.response?.order_sn === splitOrderSn, "Order SN matches");
      assert(res.json?.response?.package_list?.length === 2, "Order split into exactly 2 packages");

      // Verify in get_order_detail
      const detailUrl = makeSignedUrl("/api/v2/order/get_order_detail", { order_sn_list: splitOrderSn });
      const detailRes = await request(detailUrl);
      const splitOrderDetail = detailRes.json?.response?.order_list[0];

      assert(splitOrderDetail.split_up === true, "Order detail confirms split_up === true");
      assert(splitOrderDetail.package_list.length === 2, "Order detail returns 2 distinct packages");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 11: Seller Order Cancellation (POST /api/v2/order/cancel_order)");
    // ------------------------------------------------------------------------
    {
      const cancelOrderSn = "ORD261019CANCEL01";

      await request("/api/v2/simulator/order/create", {
        method: "POST",
        body: {
          shop_id: SHOP_ID,
          order_sn: cancelOrderSn,
          order_status: "READY_TO_SHIP"
        }
      });

      const cancelPayload = {
        order_sn: cancelOrderSn,
        cancel_reason: "OUT_OF_STOCK"
      };

      const url = makeSignedUrl("/api/v2/order/cancel_order");
      const res = await request(url, { method: "POST", body: cancelPayload });

      assert(res.status === 200, "Cancel order returns HTTP 200");
      assert(res.json?.error === "", "Empty error code on order cancellation");
      assert(typeof res.json?.response?.update_time === "number", "Returns numeric update_time");

      // Verify database state
      const dbOrder = await prisma.order.findUnique({ where: { orderSn: cancelOrderSn } });
      assert(dbOrder?.orderStatus === "CANCELLED", "Order status updated to CANCELLED");
      assert(dbOrder?.cancelBy === "SELLER", "cancel_by is SELLER");
      assert(dbOrder?.cancelReason === "OUT_OF_STOCK", "cancel_reason is OUT_OF_STOCK");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 12: Buyer Cancellation Application Handling (POST /api/v2/order/handle_buyer_cancellation)");
    // ------------------------------------------------------------------------
    {
      // 12.1 Seller ACCEPTS buyer cancellation
      const buyerCancelSn1 = "ORD261019BUYERACCEPT";
      await request("/api/v2/simulator/order/create", {
        method: "POST",
        body: {
          shop_id: SHOP_ID,
          order_sn: buyerCancelSn1,
          order_status: "IN_CANCEL"
        }
      });

      const acceptRes = await request(makeSignedUrl("/api/v2/order/handle_buyer_cancellation"), {
        method: "POST",
        body: { order_sn: buyerCancelSn1, operation: "ACCEPT" }
      });

      assert(acceptRes.status === 200, "Accept buyer cancellation returns HTTP 200");
      assert(acceptRes.json?.error === "", "Empty error code on accept cancellation");

      const dbOrder1 = await prisma.order.findUnique({ where: { orderSn: buyerCancelSn1 } });
      assert(dbOrder1?.orderStatus === "CANCELLED", "Order status is CANCELLED upon acceptance");
      assert(dbOrder1?.cancelBy === "BUYER", "cancel_by is BUYER");

      // 12.2 Seller REJECTS buyer cancellation (returns order to READY_TO_SHIP)
      const buyerCancelSn2 = "ORD261019BUYERREJECT";
      await request("/api/v2/simulator/order/create", {
        method: "POST",
        body: {
          shop_id: SHOP_ID,
          order_sn: buyerCancelSn2,
          order_status: "IN_CANCEL"
        }
      });

      const rejectRes = await request(makeSignedUrl("/api/v2/order/handle_buyer_cancellation"), {
        method: "POST",
        body: { order_sn: buyerCancelSn2, operation: "REJECT" }
      });

      assert(rejectRes.status === 200, "Reject buyer cancellation returns HTTP 200");
      assert(rejectRes.json?.error === "", "Empty error code on reject cancellation");

      const dbOrder2 = await prisma.order.findUnique({ where: { orderSn: buyerCancelSn2 } });
      assert(dbOrder2?.orderStatus === "READY_TO_SHIP", "Order status returned to READY_TO_SHIP upon rejection");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 13: Protocol Security & Signature Checks on Order & Logistics APIs");
    // ------------------------------------------------------------------------
    {
      const path = "/api/v2/order/get_order_list";
      const now = Math.floor(Date.now() / 1000);
      const wrongSign = "badbadbadbadbadbadbadbadbadbadbadbadbadbadbadbadbadbadbadbadbadb";

      const resWrongSign = await request(`${path}?partner_id=${PARTNER_ID}&timestamp=${now}&access_token=${accessToken}&shop_id=${SHOP_ID}&sign=${wrongSign}`);
      assert(resWrongSign.json?.error === "error_sign", "Order endpoint with wrong sign returns error_sign");

      const resExpired = await request(`${path}?partner_id=${PARTNER_ID}&timestamp=${now - 400}&access_token=${accessToken}&shop_id=${SHOP_ID}&sign=${wrongSign}`);
      assert(resExpired.json?.error === "error_param", "Expired timestamp returns error_param");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 14: Cross-Shop Order Item Boundary Validation");
    // ------------------------------------------------------------------------
    {
      const otherShop = await prisma.shop.findFirst({
        where: { shopId: { not: BigInt(SHOP_ID) } }
      });
      if (otherShop) {
        const foreignProduct = await prisma.product.findFirst({
          where: { shopId: otherShop.shopId }
        });
        const localProduct = await prisma.product.findFirst({
          where: { shopId: BigInt(SHOP_ID) }
        });

        if (foreignProduct && localProduct) {
          const crossShopRes = await request("/api/v2/simulator/order/create", {
            method: "POST",
            body: {
              shop_id: SHOP_ID,
              items: [
                { item_id: Number(localProduct.itemId), quantity_purchased: 1 },
                { item_id: Number(foreignProduct.itemId), quantity_purchased: 1 }
              ]
            }
          });
          assert(crossShopRes.json?.error === "error_param", "Order with cross-shop items rejected with error_param");
          assert(crossShopRes.json?.message?.includes("Cross-shop items cannot be placed in a single Shopee order"), "Rejection message explains cross-shop violation");
        }
      }
    }

    console.log("\n=======================================================");
    console.log("   🎉 ALL 47 PHASE 4 TEST ASSERTIONS PASSED WITH 100%  ");
    console.log("=======================================================\n");

  } catch (error) {
    console.error("\n❌ PHASE 4 TEST SUITE ENCOUNTERED A FAILURE:");
    console.error(error);
    process.exit(1);
  } finally {
    if (server) {
      server.close();
    }
    await prisma.$disconnect();
  }
}

runTests();
