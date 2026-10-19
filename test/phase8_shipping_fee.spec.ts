import { app } from "../src/index";
import { prisma } from "../src/common/prisma";
import { calculateHmacSha256, buildBaseString } from "../src/common/utils/crypto";
import { LogisticsEngine, ShippingZone } from "../src/modules/logistics/logistics.engine";
import * as http from "http";

const PARTNER_ID = 1001141;
const PARTNER_KEY = "shopee_mock_secret_key_2026";
const SHOP_ID = 727720655;

let server: http.Server;
let baseUrl: string;
let accessToken: string;
let testProduct: any;

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

async function runPhase8Tests() {
  console.log("\n=======================================================");
  console.log("   SHOPEE SIMULATOR: PHASE 8 DYNAMIC SHIPPING FEE ENGINE");
  console.log("=======================================================\n");

  server = http.createServer(app);
  await new Promise<void>((resolve) => {
    server.listen(0, () => resolve());
  });

  const address = server.address() as any;
  baseUrl = `http://localhost:${address.port}`;
  console.log(`Test server running at ${baseUrl}`);

  try {
    // ------------------------------------------------------------------------
    // PREPARATION
    // ------------------------------------------------------------------------
    console.log("PREPARATION: Fetch Shop & Active Token, Seed Test Product");
    const shop = await prisma.shop.findUnique({
      where: { shopId: BigInt(SHOP_ID) },
      include: { addresses: true }
    });
    assert(shop !== null, "Found seeded test shop 727720655");
    accessToken = shop!.accessToken || "phase8_mock_token";

    // Ensure shop has a pickup address in Ho Chi Minh City
    let pickupAddr: any = shop!.addresses?.find(a => a.addressType === "PICKUP" || a.addressType === "DEFAULT") || shop!.addresses?.[0];
    if (!pickupAddr) {
      pickupAddr = await prisma.shopAddress.findFirst({ where: { shopId: BigInt(SHOP_ID) } });
    }
    if (pickupAddr) {
      if (pickupAddr.city !== "Ho Chi Minh City" || pickupAddr.addressType !== "PICKUP") {
        await prisma.shopAddress.update({
          where: { addressId: pickupAddr.addressId },
          data: { city: "Ho Chi Minh City", addressType: "PICKUP" }
        });
      }
    }

    // Seed test product with dimensions and weight
    testProduct = await prisma.product.create({
      data: {
        shopId: BigInt(SHOP_ID),
        categoryId: BigInt(1001),
        itemName: "Logistics Engine Test Item (Bulky)",
        description: "Package for verifying volumetric and actual weight math",
        itemSku: "LOG-ITEM-01",
        originalPrice: 200000,
        weight: 0.4, // 400g actual weight
        dimensionsJson: {
          package_length: 30,
          package_width: 20,
          package_height: 10 // Volumetric = (30 * 20 * 10) / 5 = 1200g
        },
        hasModel: false,
        imagesJson: { image_id_list: ["img1"], image_url_list: ["http://img.test/1"] }
      }
    });
    assert(testProduct !== null, `Created bulky test product (ID: ${testProduct.itemId})`);

    // ========================================================================
    console.log("\nTEST SUITE 1: WEIGHT CALCULATION FORMULAS (ACTUAL VS VOLUMETRIC)");
    // ========================================================================
    // Case 1: Heavy compact item (Actual > Volumetric)
    const heavyCompact = LogisticsEngine.calculatePackageWeight([
      {
        weightKg: 2.5, // 2500g
        dimensions: { length: 15, width: 10, height: 10 }, // (15 * 10 * 10)/5 = 300g
        quantity: 1
      }
    ]);
    assert(heavyCompact.actualWeightGram === 2500, `Actual weight correct: ${heavyCompact.actualWeightGram}g`);
    assert(heavyCompact.volumetricWeightGram === 300, `Volumetric weight correct: ${heavyCompact.volumetricWeightGram}g`);
    assert(heavyCompact.chargeableWeightGram === 2500, `Chargeable weight takes max(actual, vol): ${heavyCompact.chargeableWeightGram}g`);

    // Case 2: Light bulky item (Volumetric > Actual)
    const lightBulky = LogisticsEngine.calculatePackageWeight([
      {
        weightKg: 0.3, // 300g
        dimensions: { length: 40, width: 30, height: 20 }, // (40 * 30 * 20)/5 = 4800g
        quantity: 1
      }
    ]);
    assert(lightBulky.actualWeightGram === 300, `Light bulky actual weight: ${lightBulky.actualWeightGram}g`);
    assert(lightBulky.volumetricWeightGram === 4800, `Light bulky volumetric weight: ${lightBulky.volumetricWeightGram}g`);
    assert(lightBulky.chargeableWeightGram === 4800, `Chargeable weight correctly scales to volumetric: ${lightBulky.chargeableWeightGram}g`);

    // Case 3: Multiple items with quantities
    const multiItemWeight = LogisticsEngine.calculatePackageWeight([
      {
        weightKg: 0.5, // 500g
        dimensions: { length: 20, width: 10, height: 10 }, // 400g
        quantity: 3
      }
    ]);
    assert(multiItemWeight.actualWeightGram === 1500, `Multi-quantity actual weight: 1500g (got: ${multiItemWeight.actualWeightGram}g)`);
    assert(multiItemWeight.volumetricWeightGram === 1200, `Multi-quantity volumetric weight: 1200g (got: ${multiItemWeight.volumetricWeightGram}g)`);
    assert(multiItemWeight.chargeableWeightGram === 1500, `Multi-quantity chargeable weight: 1500g (got: ${multiItemWeight.chargeableWeightGram}g)`);

    // ========================================================================
    console.log("\nTEST SUITE 2: VIETNAM GEOGRAPHIC ZONE ROUTING MATRIX");
    // ========================================================================
    // Intra-Province
    const intra1 = LogisticsEngine.resolveShippingZone("Ho Chi Minh City", "TP. Hồ Chí Minh");
    assert(intra1 === ShippingZone.INTRA_PROVINCE, "HCMC to TP. Hồ Chí Minh resolves to INTRA_PROVINCE");
    const intra2 = LogisticsEngine.resolveShippingZone("Hà Nội", "Thành phố Hà Nội");
    assert(intra2 === ShippingZone.INTRA_PROVINCE, "Hà Nội to TP Hà Nội resolves to INTRA_PROVINCE");

    // Intra-Region (Same Macro-Region)
    const intraRegionSouth = LogisticsEngine.resolveShippingZone("Hồ Chí Minh", "Cần Thơ");
    assert(intraRegionSouth === ShippingZone.INTRA_REGION, "HCMC (South) to Cần Thơ (South) resolves to INTRA_REGION");
    const intraRegionNorth = LogisticsEngine.resolveShippingZone("Hà Nội", "Hải Phòng");
    assert(intraRegionNorth === ShippingZone.INTRA_REGION, "Hà Nội (North) to Hải Phòng (North) resolves to INTRA_REGION");

    // Inter-Region (Cross Macro-Regions)
    const interRegion = LogisticsEngine.resolveShippingZone("Hồ Chí Minh", "Hà Nội");
    assert(interRegion === ShippingZone.INTER_REGION, "HCMC (South) to Hà Nội (North) resolves to INTER_REGION");
    const interRegionCentral = LogisticsEngine.resolveShippingZone("Đà Nẵng", "Hồ Chí Minh");
    assert(interRegionCentral === ShippingZone.INTER_REGION, "Đà Nẵng (Central) to HCMC (South) resolves to INTER_REGION");

    // ========================================================================
    console.log("\nTEST SUITE 3: CARRIER RATE MATRICES (STANDARD, INSTANT, ECONOMY)");
    // ========================================================================
    // 3.1 SPX Express (30001) Standard
    // Intra-Province 500g: 16,500 VND
    const stdIntraBase = LogisticsEngine.calculateChannelFee(30001, ShippingZone.INTRA_PROVINCE, 500);
    assert(stdIntraBase.actualFee === 16500, `Standard Intra-Province 500g fee: 16,500 ₫ (got: ${stdIntraBase.actualFee})`);

    // Intra-Province 1200g: 16,500 + 2 steps * 2,500 = 21,500 VND
    const stdIntraHeavy = LogisticsEngine.calculateChannelFee(30001, ShippingZone.INTRA_PROVINCE, 1200);
    assert(stdIntraHeavy.actualFee === 21500, `Standard Intra-Province 1200g fee: 21,500 ₫ (got: ${stdIntraHeavy.actualFee})`);

    // Intra-Region 500g: 22,000 VND
    const stdRegionBase = LogisticsEngine.calculateChannelFee(30001, ShippingZone.INTRA_REGION, 500);
    assert(stdRegionBase.actualFee === 22000, `Standard Intra-Region 500g fee: 22,000 ₫ (got: ${stdRegionBase.actualFee})`);

    // Inter-Region 500g: 32,000 VND; 1200g: 32,000 + 2 * 5,000 = 42,000 VND
    const stdInterBase = LogisticsEngine.calculateChannelFee(30001, ShippingZone.INTER_REGION, 500);
    assert(stdInterBase.actualFee === 32000, `Standard Inter-Region 500g fee: 32,000 ₫ (got: ${stdInterBase.actualFee})`);
    const stdInterHeavy = LogisticsEngine.calculateChannelFee(30001, ShippingZone.INTER_REGION, 1200);
    assert(stdInterHeavy.actualFee === 42000, `Standard Inter-Region 1200g fee: 42,000 ₫ (got: ${stdInterHeavy.actualFee})`);

    // 3.2 SPX Instant (30002) Hỏa Tốc
    // Same-City 1500g (under 2kg): 25,000 VND
    const instIntraBase = LogisticsEngine.calculateChannelFee(30002, ShippingZone.INTRA_PROVINCE, 1500);
    assert(instIntraBase.enabled === true, "Instant enabled for same-city");
    assert(instIntraBase.actualFee === 25000, `Instant base fee <=2kg: 25,000 ₫ (got: ${instIntraBase.actualFee})`);

    // Same-City 3500g (extra 2kg): 25,000 + 2 * 10,000 = 45,000 VND
    const instIntraHeavy = LogisticsEngine.calculateChannelFee(30002, ShippingZone.INTRA_PROVINCE, 3500);
    assert(instIntraHeavy.actualFee === 45000, `Instant 3.5kg fee: 45,000 ₫ (got: ${instIntraHeavy.actualFee})`);

    // Same-City > 5kg: Rejected
    const instIntraOver = LogisticsEngine.calculateChannelFee(30002, ShippingZone.INTRA_PROVINCE, 5500);
    assert(instIntraOver.enabled === false, "Instant disabled when weight > 5kg");
    assert(instIntraOver.disabledReason!.includes("limit"), `Instant weight limit reason provided: "${instIntraOver.disabledReason}"`);

    // Cross-City (Intra-Region / Inter-Region): Rejected
    const instCrossCity = LogisticsEngine.calculateChannelFee(30002, ShippingZone.INTRA_REGION, 1000);
    assert(instCrossCity.enabled === false, "Instant disabled for cross-city delivery");
    assert(instCrossCity.disabledReason!.includes("same-city"), `Instant route reason provided: "${instCrossCity.disabledReason}"`);

    // 3.3 SPX Economy (30003)
    // Intra-Province 800g: 13,000 VND
    const ecoIntra = LogisticsEngine.calculateChannelFee(30003, ShippingZone.INTRA_PROVINCE, 800);
    assert(ecoIntra.actualFee === 13000, `Economy Intra-Province 800g fee: 13,000 ₫ (got: ${ecoIntra.actualFee})`);
    // Inter-Region 2500g: 25,000 + 2 steps * 4,000 = 33,000 VND
    const ecoInterHeavy = LogisticsEngine.calculateChannelFee(30003, ShippingZone.INTER_REGION, 2500);
    assert(ecoInterHeavy.actualFee === 33000, `Economy Inter-Region 2500g fee: 33,000 ₫ (got: ${ecoInterHeavy.actualFee})`);

    // ========================================================================
    console.log("\nTEST SUITE 4: SHOPEE FREESHIP XTRA PLATFORM SUBSIDIES");
    // ========================================================================
    // Subtotal < 150k: 0 VND subsidy
    const rebateLow = LogisticsEngine.calculateFreeshipRebate(120000, 22000);
    assert(rebateLow === 0, `No Freeship subsidy below 150k: ${rebateLow} ₫`);

    // Subtotal 150k - 299k: up to 15k VND subsidy
    const rebateMid = LogisticsEngine.calculateFreeshipRebate(180000, 22000);
    assert(rebateMid === 15000, `15k Freeship subsidy for subtotal 180k: ${rebateMid} ₫`);

    // Subtotal 150k but actual shipping is 10k: clamped to 10k
    const rebateClamp = LogisticsEngine.calculateFreeshipRebate(180000, 10000);
    assert(rebateClamp === 10000, `Subsidy clamped to actual fee (10k): ${rebateClamp} ₫`);

    // Subtotal >= 300k: up to 30k VND subsidy
    const rebateHigh = LogisticsEngine.calculateFreeshipRebate(350000, 32000);
    assert(rebateHigh === 30000, `30k Freeship subsidy for subtotal 350k: ${rebateHigh} ₫`);

    // ========================================================================
    console.log("\nTEST SUITE 5: OFFICIAL OPENAPI LOGISTICS RATE QUOTE ENDPOINT");
    // ========================================================================
    // 5.1 POST /api/v2/logistics/calculate_shipping_fee with HMAC authentication
    const signedCalcPath = makeSignedUrl("/api/v2/logistics/calculate_shipping_fee");
    const quoteApiRes = await request(signedCalcPath, {
      method: "POST",
      body: {
        recipient_city: "Hà Nội",
        items: [
          {
            item_id: Number(testProduct.itemId),
            quantity: 2
          }
        ]
      }
    });

    assert(quoteApiRes.json.error === "", "calculate_shipping_fee succeeded with valid HMAC");
    const quoteData = quoteApiRes.json.response;
    assert(quoteData.shop_city === "Ho Chi Minh City", `Resolved warehouse city: ${quoteData.shop_city}`);
    assert(quoteData.buyer_city === "Hà Nội", `Resolved delivery city: ${quoteData.buyer_city}`);
    assert(quoteData.shipping_zone === "INTER_REGION", `Correct zone: ${quoteData.shipping_zone}`);
    assert(quoteData.chargeable_weight_gram === 2400, `Bulky items chargeable weight (2 * 1200g): ${quoteData.chargeable_weight_gram}g`);
    assert(Array.isArray(quoteData.channels) && quoteData.channels.length === 3, "Returned 3 carrier channel quotes");

    const stdChan = quoteData.channels.find((c: any) => c.channel_id === 30001);
    assert(stdChan !== undefined && stdChan.enabled === true, "SPX Express Standard available");
    assert(stdChan.actual_shipping_fee > 0, `Standard fee: ${stdChan.actual_shipping_fee} ₫`);

    const instChan = quoteData.channels.find((c: any) => c.channel_id === 30002);
    assert(instChan !== undefined && instChan.enabled === false, "SPX Instant disabled for HCMC -> Hanoi");

    // 5.2 Protocol Security Rejections (Invalid Sign, Expired Timestamp)
    const badSignPath = `/api/v2/logistics/calculate_shipping_fee?partner_id=${PARTNER_ID}&timestamp=${Math.floor(Date.now() / 1000)}&access_token=${accessToken}&shop_id=${SHOP_ID}&sign=invalid_hex_sign`;
    const badSignRes = await request(badSignPath, { method: "POST", body: {} });
    assert(badSignRes.json.error === "error_sign", "Rejected calculate_shipping_fee with invalid HMAC");

    const expiredTs = Math.floor(Date.now() / 1000) - 600;
    const expBaseStr = buildBaseString(PARTNER_ID, "/api/v2/logistics/calculate_shipping_fee", expiredTs, accessToken, SHOP_ID);
    const expSign = calculateHmacSha256(PARTNER_KEY, expBaseStr);
    const expPath = `/api/v2/logistics/calculate_shipping_fee?partner_id=${PARTNER_ID}&timestamp=${expiredTs}&access_token=${accessToken}&shop_id=${SHOP_ID}&sign=${expSign}`;
    const expRes = await request(expPath, { method: "POST", body: {} });
    assert(expRes.json.error === "error_param", "Rejected calculate_shipping_fee with expired timestamp");

    // ========================================================================
    console.log("\nTEST SUITE 6: SIMULATOR PUBLIC LOGISTICS QUOTE HELPER");
    // ========================================================================
    const simQuoteRes = await request("/api/v2/simulator/logistics/calculate_fee", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        recipient_city: "Ho Chi Minh City",
        items: [
          {
            item_id: Number(testProduct.itemId),
            quantity: 1
          }
        ]
      }
    });

    assert(simQuoteRes.json.error === "", "Simulator calculate_fee helper succeeded without HMAC");
    const simInstant = simQuoteRes.json.response.channels.find((c: any) => c.channel_id === 30002);
    assert(simInstant.enabled === true, "SPX Instant enabled for same-city delivery in simulator helper");

    // ========================================================================
    console.log("\nTEST SUITE 7: DYNAMIC ORDER CHECKOUT & ESCROW INTEGRATION");
    // ========================================================================
    // 7.1 Checkout order with SPX Express Standard (30001) for cross-region route (HCMC -> Hanoi)
    // Subtotal: 2 * 200,000 = 400,000 VND -> Eligible for 30,000 VND Freeship subsidy!
    // Chargeable weight: 2 * 1200g = 2400g.
    // Inter-region rate: 32,000 + ceil((2400 - 500)/500) * 5,000 = 32,000 + 4 * 5,000 = 52,000 VND.
    // Freeship subsidy: 30,000 VND.
    // Buyer paid shipping fee: 52,000 - 30,000 = 22,000 VND.
    // Total Order Amount: 400,000 + 22,000 = 422,000 VND.
    const crossOrderRes = await request("/api/v2/simulator/order/create", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        channel_id: 30001,
        recipient_city: "Hà Nội",
        items: [
          {
            item_id: Number(testProduct.itemId),
            quantity: 2
          }
        ]
      }
    });

    assert(crossOrderRes.json.error === "", "Cross-region standard order created successfully");
    const crossSn = crossOrderRes.json.response.order_sn;
    assert(crossOrderRes.json.response.chargeable_weight_gram === 2400, "Response indicates 2400g chargeable weight");
    assert(crossOrderRes.json.response.actual_shipping_fee === 52000, `Actual shipping fee calculated as 52,000 ₫ (got: ${crossOrderRes.json.response.actual_shipping_fee})`);
    assert(crossOrderRes.json.response.shopee_shipping_rebate === 30000, `Freeship Xtra subsidy calculated as 30,000 ₫ (got: ${crossOrderRes.json.response.shopee_shipping_rebate})`);
    assert(crossOrderRes.json.response.buyer_paid_shipping_fee === 22000, `Buyer paid shipping fee calculated as 22,000 ₫ (got: ${crossOrderRes.json.response.buyer_paid_shipping_fee})`);

    const crossDbOrder = await prisma.order.findUnique({ where: { orderSn: crossSn } });
    assert(crossDbOrder !== null, "Order stored in database");
    assert(Number(crossDbOrder!.totalAmount) === 422000, `Order totalAmount recorded correctly: 422,000 ₫ (got: ${crossDbOrder!.totalAmount})`);
    assert(Number(crossDbOrder!.buyerPaidShippingFee) === 22000, `Order buyerPaidShippingFee recorded: 22,000 ₫`);
    assert(Number(crossDbOrder!.actualShippingFee) === 52000, `Order actualShippingFee recorded: 52,000 ₫`);
    assert(Number(crossDbOrder!.voucherFromShopee) === 30000, `Order voucherFromShopee (Freeship) recorded: 30,000 ₫`);
    assert(Number(crossDbOrder!.channelId) === 30001, `Channel ID recorded as 30001`);
    assert(crossDbOrder!.shippingCarrier === "SPX Express", `Carrier recorded as SPX Express`);

    // 7.2 Rejection of SPX Instant (30002) for Cross-City Route
    const invalidInstantRes = await request("/api/v2/simulator/order/create", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        channel_id: 30002,
        recipient_city: "Hà Nội",
        items: [
          {
            item_id: Number(testProduct.itemId),
            quantity: 1
          }
        ]
      }
    });
    assert(invalidInstantRes.json.error === "error_param", "Order rejected with error_param when Instant is requested across cities");
    assert(invalidInstantRes.json.message.includes("same-city"), `Rejection reason states same-city requirement: "${invalidInstantRes.json.message}"`);

    // 7.3 Checkout order with SPX Instant (30002) for Same-City Route (HCMC -> HCMC)
    // 1 item: subtotal 200,000 VND (eligible for 15,000 VND Freeship subsidy).
    // Chargeable weight: 1200g (under 2kg base).
    // Instant base fee: 25,000 VND.
    // Freeship subsidy: 15,000 VND.
    // Net shipping: 25,000 - 15,000 = 10,000 VND.
    // Total Amount: 200,000 + 10,000 = 210,000 VND.
    const instantOrderRes = await request("/api/v2/simulator/order/create", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        channel_id: 30002,
        recipient_city: "Ho Chi Minh City",
        items: [
          {
            item_id: Number(testProduct.itemId),
            quantity: 1
          }
        ]
      }
    });
    assert(instantOrderRes.json.error === "", "Instant order for same-city checkout succeeded");
    const instantSn = instantOrderRes.json.response.order_sn;
    const instantDbOrder = await prisma.order.findUnique({ where: { orderSn: instantSn } });
    assert(Number(instantDbOrder!.totalAmount) === 210000, `Instant order total: 210,000 ₫ (got: ${instantDbOrder!.totalAmount})`);
    assert(Number(instantDbOrder!.buyerPaidShippingFee) === 10000, `Instant net shipping: 10,000 ₫`);
    assert(instantDbOrder!.shippingCarrier === "SPX Instant (Hỏa Tốc)", "Carrier stored as SPX Instant (Hỏa Tốc)");

    // 7.4 Checkout order with SPX Economy (30003)
    const economyOrderRes = await request("/api/v2/simulator/order/create", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        channel_id: 30003,
        recipient_city: "Ho Chi Minh City",
        items: [
          {
            item_id: Number(testProduct.itemId),
            quantity: 1
          }
        ]
      }
    });
    assert(economyOrderRes.json.error === "", "Economy order checkout succeeded");
    const economyDbOrder = await prisma.order.findUnique({ where: { orderSn: economyOrderRes.json.response.order_sn } });
    assert(Number(economyDbOrder!.channelId) === 30003, "Channel ID stored as 30003");
    assert(economyDbOrder!.shippingCarrier === "SPX Economy (Tiết Kiệm)", "Carrier stored as SPX Economy (Tiết Kiệm)");

    // ========================================================================
    console.log("\nTEST SUITE 8: ORDER DETAIL API INSPECTION (OFFICIAL & SIMULATOR)");
    // ========================================================================
    // 8.1 Official get_order_detail endpoint
    const getDetailPath = makeSignedUrl("/api/v2/order/get_order_detail", {
      order_sn_list: crossSn,
      response_optional_fields: "buyer_user_id,buyer_username,estimated_shipping_fee,actual_shipping_fee"
    });
    const detailRes = await request(getDetailPath);
    assert(detailRes.json.error === "", "get_order_detail query succeeded");
    const retrievedOrder = detailRes.json.response.order_list[0];
    assert(retrievedOrder.order_sn === crossSn, "Retrieved target order SN");
    assert(retrievedOrder.actual_shipping_fee === 52000, `get_order_detail returned actual_shipping_fee: 52,000 ₫`);
    assert(retrievedOrder.buyer_paid_shipping_fee === 22000, `get_order_detail returned buyer_paid_shipping_fee: 22,000 ₫`);
    assert(retrievedOrder.shopee_shipping_rebate === 30000, `get_order_detail returned shopee_shipping_rebate: 30,000 ₫`);
    assert(retrievedOrder.logistics_channel_id === 30001, `get_order_detail returned logistics_channel_id: 30001`);

    // 8.2 Simulator order/detail inspection endpoint
    const simDetailRes = await request(`/api/v2/simulator/order/detail?order_sn=${crossSn}`);
    assert(simDetailRes.json.error === "", "simulator/order/detail query succeeded");
    assert(simDetailRes.json.response.actual_shipping_fee === 52000, "Simulator detail has actual_shipping_fee");
    assert(simDetailRes.json.response.buyer_paid_shipping_fee === 22000, "Simulator detail has buyer_paid_shipping_fee");
    assert(simDetailRes.json.response.voucher_from_shopee === 30000, "Simulator detail has voucher_from_shopee (Freeship)");
    assert(simDetailRes.json.response.channel_id === 30001, "Simulator detail has channel_id");

    // ========================================================================
    console.log("\nTEST SUITE 9: BACKWARD COMPATIBILITY INVARIANT (PHASE 1-7 ZERO REGRESSIONS)");
    // ========================================================================
    // Verify that legacy orders created without channel_id maintain standard 15,000 fee
    const legacyOrderRes = await request("/api/v2/simulator/order/create", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        items: [
          {
            item_id: Number(testProduct.itemId),
            quantity: 1
          }
        ]
      }
    });
    assert(legacyOrderRes.json.error === "", "Legacy checkout without channel_id succeeds");
    const legacyDbOrder = await prisma.order.findUnique({ where: { orderSn: legacyOrderRes.json.response.order_sn } });
    assert(Number(legacyDbOrder!.buyerPaidShippingFee) === 15000, `Legacy fallback shipping fee is 15,000 ₫ (got: ${legacyDbOrder!.buyerPaidShippingFee})`);
    assert(Number(legacyDbOrder!.totalAmount) === 200000 + 15000, `Legacy fallback totalAmount matches 215,000 ₫ (got: ${legacyDbOrder!.totalAmount})`);

    console.log("\n=======================================================");
    console.log("   ✅ ALL 40+ PHASE 8 LOGISTICS & SHIPPING TESTS PASSED!   ");
    console.log("=======================================================\n");

  } finally {
    if (testProduct) {
      await prisma.orderItem.deleteMany({ where: { itemId: testProduct.itemId } }).catch(() => {});
      await prisma.product.delete({ where: { itemId: testProduct.itemId } }).catch(() => {});
    }
    server.close();
  }
}

if (require.main === module) {
  runPhase8Tests().catch((err) => {
    console.error("Test execution failed:", err);
    process.exit(1);
  });
}
