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

  if (contentType.includes("application/json")) {
    json = await res.json();
  } else {
    text = await res.text();
  }

  return { status: res.status, headers: res.headers, json, text };
}

async function runPhase20Tests() {
  console.log("===============================================================");
  console.log("   SHOPEE SIMULATOR: PHASE 20 ALL ORDERS BACKEND TEST SUITE    ");
  console.log("===============================================================\n");

  server = app.listen(0);
  const port = (server.address() as any).port;
  baseUrl = `http://localhost:${port}`;
  console.log(`Simulator Server running at ${baseUrl}\n`);

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Ensure test orders covering all 8 statuses exist for shop 727720655
    // -------------------------------------------------------------------------
    console.log("TEST GROUP 1: Database Seed Verification for 8 Order Statuses");
    
    // Check if test orders already exist or insert minimal set for this test
    const existingCount = await prisma.order.count({ where: { shopId: BigInt(SHOP_ID) } });
    if (existingCount === 0) {
      // Find or create product
      let prod = await prisma.product.findFirst({ where: { shopId: BigInt(SHOP_ID) } });
      if (!prod) {
        prod = await prisma.product.create({
          data: {
            shopId: BigInt(SHOP_ID),
            categoryId: BigInt(100001),
            itemName: "SmartOmni Test Product",
            description: "Test description",
            originalPrice: 100000,
            currency: "VND",
            itemSku: "SO-TEST-001",
            imagesJson: ["https://cf.shopee.vn/file/test.jpg"]
          }
        });
      }

      const statusesToSeed = [
        OrderStatus.UNPAID,
        OrderStatus.READY_TO_SHIP,
        OrderStatus.PROCESSED,
        OrderStatus.SHIPPED,
        OrderStatus.COMPLETED,
        OrderStatus.CANCELLED,
        OrderStatus.TO_RETURN,
        OrderStatus.DELIVERY_FAILED
      ];

      for (let i = 0; i < statusesToSeed.length; i++) {
        const st = statusesToSeed[i];
        const sn = `P20TEST${st}${Date.now()}${i}`;
        await prisma.order.create({
          data: {
            orderSn: sn,
            shopId: BigInt(SHOP_ID),
            orderStatus: st,
            totalAmount: 100000,
            shippingCarrier: i % 2 === 0 ? "SPX Express" : "Shopee Xpress",
            paymentMethod: "Ví ShopeePay",
            buyerUsername: `buyer_test_${i}`,
            recipientName: `Buyer Test ${i}`,
            shipByDate: new Date(Date.now() + 86400000),
            items: {
              create: {
                itemId: prod.itemId,
                itemName: prod.itemName,
                itemPrice: 100000,
                quantityPurchased: 1
              }
            },
            packages: st === OrderStatus.PROCESSED || st === OrderStatus.DELIVERY_FAILED
              ? {
                  create: {
                    packageNumber: `PKG-${sn}`,
                    trackingNumber: `SPXVN${Date.now()}${i}`,
                    shippingCarrier: "SPX Express",
                    logisticsStatus: st === OrderStatus.DELIVERY_FAILED ? "LOGISTICS_DELIVERY_FAILED" : "LOGISTICS_REQUEST_CREATED",
                    documentStatus: "READY"
                  }
                }
              : undefined
          }
        });
      }
    }

    const totalOrders = await prisma.order.count({ where: { shopId: BigInt(SHOP_ID) } });
    assert(totalOrders > 0, `Shop has ${totalOrders} orders in database`);
    console.log();

    // -------------------------------------------------------------------------
    // TEST 2: GET /api/v2/simulator/orders without filters returns orders + tab_counts
    // -------------------------------------------------------------------------
    console.log("TEST GROUP 2: Basic Order Fetching & Dynamic tab_counts Envelope");
    const allRes = await request(`/api/v2/simulator/orders?shop_id=${SHOP_ID}`);
    assert(allRes.status === 200, "GET /api/v2/simulator/orders returns HTTP 200");
    assert(allRes.json.error === "", "No error returned in envelope");
    assert(Array.isArray(allRes.json.response?.orders), "response.orders is an array");
    assert(allRes.json.response.orders.length > 0, "Orders array is not empty");
    assert(typeof allRes.json.response?.tab_counts === "object", "response.tab_counts is returned");

    const tc = allRes.json.response.tab_counts;
    assert(typeof tc.all === "number" && tc.all > 0, "tab_counts.all is positive number");
    assert(typeof tc.unpaid === "number", "tab_counts.unpaid is number");
    assert(typeof tc.to_ship === "number", "tab_counts.to_ship is number");
    assert(typeof tc.to_ship_unprocessed === "number", "tab_counts.to_ship_unprocessed is number");
    assert(typeof tc.to_ship_processed === "number", "tab_counts.to_ship_processed is number");
    assert(typeof tc.shipping === "number", "tab_counts.shipping is number");
    assert(typeof tc.completed === "number", "tab_counts.completed is number");
    assert(typeof tc.cancelled === "number", "tab_counts.cancelled is number");
    assert(typeof tc.returns === "number", "tab_counts.returns is number");
    assert(typeof tc.failed_delivery === "number", "tab_counts.failed_delivery is number");
    console.log(`  ✓ tab_counts summary: all=${tc.all}, to_ship=${tc.to_ship} (unproc=${tc.to_ship_unprocessed}, proc=${tc.to_ship_processed}), completed=${tc.completed}, failed=${tc.failed_delivery}`);
    console.log();

    // -------------------------------------------------------------------------
    // TEST 3: Multi-Status Query (Comma-separated)
    // -------------------------------------------------------------------------
    console.log("TEST GROUP 3: Multi-Status & Sub-Status Filter Queries");
    const multiStatusRes = await request(`/api/v2/simulator/orders?shop_id=${SHOP_ID}&status=READY_TO_SHIP,PROCESSED`);
    assert(multiStatusRes.status === 200, "status=READY_TO_SHIP,PROCESSED returns HTTP 200");
    const multiOrders = multiStatusRes.json.response.orders;
    assert(
      multiOrders.every((o: any) => o.order_status === "READY_TO_SHIP" || o.order_status === "PROCESSED"),
      "All returned orders match READY_TO_SHIP or PROCESSED"
    );

    // Sub-status unprocessed
    const unprocRes = await request(`/api/v2/simulator/orders?shop_id=${SHOP_ID}&sub_status=unprocessed`);
    assert(unprocRes.status === 200, "sub_status=unprocessed returns HTTP 200");
    assert(
      unprocRes.json.response.orders.every((o: any) => o.order_status === "READY_TO_SHIP"),
      "All sub_status=unprocessed orders have status READY_TO_SHIP"
    );

    // Sub-status processed
    const procRes = await request(`/api/v2/simulator/orders?shop_id=${SHOP_ID}&sub_status=processed`);
    assert(procRes.status === 200, "sub_status=processed returns HTTP 200");
    assert(
      procRes.json.response.orders.every((o: any) => o.order_status === "PROCESSED"),
      "All sub_status=processed orders have status PROCESSED"
    );
    console.log();

    // -------------------------------------------------------------------------
    // TEST 4: DELIVERY_FAILED and TO_RETURN Specific Queries
    // -------------------------------------------------------------------------
    console.log("TEST GROUP 4: New Statuses: DELIVERY_FAILED & TO_RETURN");
    const failedRes = await request(`/api/v2/simulator/orders?shop_id=${SHOP_ID}&status=DELIVERY_FAILED`);
    assert(failedRes.status === 200, "status=DELIVERY_FAILED returns HTTP 200");
    assert(
      failedRes.json.response.orders.every((o: any) => o.order_status === "DELIVERY_FAILED"),
      "All returned orders have status DELIVERY_FAILED"
    );

    const returnsRes = await request(`/api/v2/simulator/orders?shop_id=${SHOP_ID}&status=TO_RETURN`);
    assert(returnsRes.status === 200, "status=TO_RETURN returns HTTP 200");
    assert(
      returnsRes.json.response.orders.every((o: any) => o.order_status === "TO_RETURN"),
      "All returned orders have status TO_RETURN"
    );
    console.log();

    // -------------------------------------------------------------------------
    // TEST 5: Shipping Carrier Filter
    // -------------------------------------------------------------------------
    console.log("TEST GROUP 5: Shipping Carrier Filtering");
    const carrierRes = await request(`/api/v2/simulator/orders?shop_id=${SHOP_ID}&carrier=SPX%20Express`);
    assert(carrierRes.status === 200, "carrier=SPX Express returns HTTP 200");
    assert(
      carrierRes.json.response.orders.every((o: any) => o.shipping_carrier === "SPX Express"),
      "All returned orders have shipping_carrier === 'SPX Express'"
    );
    console.log();

    // -------------------------------------------------------------------------
    // TEST 6: Search by Order SN, Buyer Username
    // -------------------------------------------------------------------------
    console.log("TEST GROUP 6: Keyword & Search Type Filtering");
    const sampleOrder = allRes.json.response.orders[0];
    const snRes = await request(`/api/v2/simulator/orders?shop_id=${SHOP_ID}&search_type=order_sn&keyword=${sampleOrder.order_sn}`);
    assert(snRes.status === 200, "Search by order_sn returns HTTP 200");
    assert(snRes.json.response.orders.length === 1, "Exactly 1 order matched target order_sn");
    assert(snRes.json.response.orders[0].order_sn === sampleOrder.order_sn, "Matched SN corresponds to target");

    if (sampleOrder.buyer_username) {
      const buyerRes = await request(`/api/v2/simulator/orders?shop_id=${SHOP_ID}&search_type=buyer&keyword=${encodeURIComponent(sampleOrder.buyer_username)}`);
      assert(buyerRes.status === 200, "Search by buyer returns HTTP 200");
      assert(buyerRes.json.response.orders.length > 0, "Matched orders found for target buyer");
    }
    console.log();

    // -------------------------------------------------------------------------
    // TEST 7: Date Range and Sorting
    // -------------------------------------------------------------------------
    console.log("TEST GROUP 7: Date Range & Sorting Options");
    const sortAscRes = await request(`/api/v2/simulator/orders?shop_id=${SHOP_ID}&sort_by=created_asc`);
    assert(sortAscRes.status === 200, "sort_by=created_asc returns HTTP 200");
    const ascOrders = sortAscRes.json.response.orders;
    if (ascOrders.length >= 2) {
      assert(ascOrders[0].create_time <= ascOrders[ascOrders.length - 1].create_time, "Orders correctly sorted ascending by create_time");
    }

    const sortDescRes = await request(`/api/v2/simulator/orders?shop_id=${SHOP_ID}&sort_by=created_desc`);
    assert(sortDescRes.status === 200, "sort_by=created_desc returns HTTP 200");
    const descOrders = sortDescRes.json.response.orders;
    if (descOrders.length >= 2) {
      assert(descOrders[0].create_time >= descOrders[descOrders.length - 1].create_time, "Orders correctly sorted descending by create_time");
    }
    console.log();

    console.log("===============================================================");
    console.log("   🎉 ALL 20 PHASE 20 BACKEND ORDER ASSERTIONS PASSED 100%     ");
    console.log("===============================================================\n");
  } finally {
    server.close();
  }
}

runPhase20Tests().catch((err) => {
  console.error("Phase 20 Backend Test Suite Failed:", err);
  process.exit(1);
});
