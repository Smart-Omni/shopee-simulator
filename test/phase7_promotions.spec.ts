import { app } from "../src/index";
import { prisma } from "../src/common/prisma";
import { calculateHmacSha256, buildBaseString } from "../src/common/utils/crypto";
import * as http from "http";
import { PromotionStatus } from "@prisma/client";

const PARTNER_ID = 1001141;
const PARTNER_KEY = "shopee_mock_secret_key_2026";
const SHOP_ID = 727720655;

let server: http.Server;
let baseUrl: string;
let accessToken: string;
let testProduct: any;
let testProductWithModel: any;

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

async function runTests() {
  console.log("\n=======================================================");
  console.log("   SHOPEE SIMULATOR: PHASE 7 PROMOTIONS & MARKETING   ");
  console.log("=======================================================\n");

  server = app.listen(0);
  const addr = server.address() as any;
  baseUrl = `http://localhost:${addr.port}`;
  console.log(`Test server running at ${baseUrl}\n`);

  try {
    // ------------------------------------------------------------------------
    console.log("PREPARATION: Fetch Shop & Active Token, Seed Test Products");
    // ------------------------------------------------------------------------
    let shop = await prisma.shop.findUnique({ where: { shopId: BigInt(SHOP_ID) } });
    if (!shop || !shop.accessToken) {
      // Ensure partner & shop exist
      await prisma.partner.upsert({
        where: { partnerId: BigInt(PARTNER_ID) },
        create: {
          partnerId: BigInt(PARTNER_ID),
          partnerKey: PARTNER_KEY,
          appName: "Test Partner App",
          testRedirectUrl: "https://partner.test/callback",
          liveRedirectUrl: "https://partner.live/callback"
        },
        update: {}
      });

      const now = new Date();
      shop = await prisma.shop.upsert({
        where: { shopId: BigInt(SHOP_ID) },
        create: {
          shopId: BigInt(SHOP_ID),
          partnerId: BigInt(PARTNER_ID),
          shopName: "SmartOmni Test Store",
          accessToken: "mock_test_token_promo_2026",
          accessTokenExpiresAt: new Date(now.getTime() + 14400 * 1000),
          isVacation: false
        },
        update: {
          accessToken: "mock_test_token_promo_2026",
          accessTokenExpiresAt: new Date(now.getTime() + 14400 * 1000),
          isVacation: false
        }
      });
    }

    accessToken = shop.accessToken!;
    console.log(`Using active accessToken: ${accessToken}`);

    // Clean up previous test promotions for idempotency
    await prisma.discount.deleteMany({ where: { shopId: BigInt(SHOP_ID) } });
    await prisma.voucher.deleteMany({ where: { shopId: BigInt(SHOP_ID) } });

    // Create test products
    const category = await prisma.category.upsert({
      where: { categoryId: BigInt(1001) },
      create: { categoryId: BigInt(1001), categoryName: "Electronics" },
      update: {}
    });

    testProduct = await prisma.product.create({
      data: {
        shopId: BigInt(SHOP_ID),
        categoryId: category.categoryId,
        itemName: "SmartOmni Wireless Earbuds",
        description: "High quality noise cancelling earbuds",
        originalPrice: 200000,
        imagesJson: { image_id_list: [], image_url_list: [] },
        hasModel: false
      }
    });

    testProductWithModel = await prisma.product.create({
      data: {
        shopId: BigInt(SHOP_ID),
        categoryId: category.categoryId,
        itemName: "SmartOmni Smartwatch Pro",
        description: "Fitness smartwatch with multi-color straps",
        originalPrice: 500000,
        imagesJson: { image_id_list: [], image_url_list: [] },
        hasModel: true,
        models: {
          create: [
            {
              modelName: "Black / Silicone",
              originalPrice: 500000,
              tierIndex: [0],
              sellerStock: 50
            },
            {
              modelName: "Silver / Leather",
              originalPrice: 550000,
              tierIndex: [1],
              sellerStock: 30
            }
          ]
        }
      },
      include: { models: true }
    });

    console.log(`Created test products: Single (${testProduct.itemId}), Variation (${testProductWithModel.itemId})`);

    // ========================================================================
    console.log("\nTEST SUITE 1: DISCOUNT CREATION & VALIDATION");
    // ========================================================================
    const nowSec = Math.floor(Date.now() / 1000);

    // 1.1 Reject start_time in the past
    const pastUrl = makeSignedUrl("/api/v2/discount/add_discount");
    const pastRes = await request(pastUrl, {
      method: "POST",
      body: {
        discount_name: "Past Promo",
        start_time: nowSec - 100,
        end_time: nowSec + 7200
      }
    });
    assert(pastRes.json.error === "discount.discount_start_time_smaller_than_now", "Rejects start_time in the past");

    // 1.2 Reject duration < 1 hour
    const shortUrl = makeSignedUrl("/api/v2/discount/add_discount");
    const shortRes = await request(shortUrl, {
      method: "POST",
      body: {
        discount_name: "Short Promo",
        start_time: nowSec + 100,
        end_time: nowSec + 1000 // < 3600
      }
    });
    assert(shortRes.json.error === "discount.discount_period_too_short", "Rejects discount period < 1 hour");

    // 1.3 Reject duration > 180 days
    const longUrl = makeSignedUrl("/api/v2/discount/add_discount");
    const longRes = await request(longUrl, {
      method: "POST",
      body: {
        discount_name: "Too Long Promo",
        start_time: nowSec + 100,
        end_time: nowSec + 100 + (181 * 24 * 3600)
      }
    });
    assert(longRes.json.error === "discount.discount_period_too_long", "Rejects discount period > 180 days");

    // 1.4 Reject when shop is on vacation
    await prisma.shop.update({ where: { shopId: BigInt(SHOP_ID) }, data: { isVacation: true } });
    const vacUrl = makeSignedUrl("/api/v2/discount/add_discount");
    const vacRes = await request(vacUrl, {
      method: "POST",
      body: {
        discount_name: "Vacation Promo",
        start_time: nowSec + 100,
        end_time: nowSec + 7200
      }
    });
    assert(vacRes.json.error === "discount.error_holiday_mode", "Rejects discount creation when shop is on vacation");

    // Reset vacation mode
    await prisma.shop.update({ where: { shopId: BigInt(SHOP_ID) }, data: { isVacation: false } });

    // 1.5 Successfully create valid discount
    const validUrl = makeSignedUrl("/api/v2/discount/add_discount");
    const validRes = await request(validUrl, {
      method: "POST",
      body: {
        discount_name: "Flash Mega Sale 2026",
        start_time: nowSec + 100,
        end_time: nowSec + 7200
      }
    });
    assert(validRes.json.error === "", "Successfully created valid discount");
    const discountId = validRes.json.response.discount_id;
    assert(discountId > 0, `Returned discount_id: ${discountId}`);

    // ========================================================================
    console.log("\nTEST SUITE 2: ADDING DISCOUNT ITEMS & VARIATIONS");
    // ========================================================================
    const addItemUrl = makeSignedUrl("/api/v2/discount/add_discount_item");

    // 2.1 Reject promo price > original price
    const invalidPriceRes = await request(addItemUrl, {
      method: "POST",
      body: {
        discount_id: discountId,
        item_list: [
          {
            item_id: Number(testProduct.itemId),
            item_promotion_price: 250000, // Original is 200000
            purchase_limit: 2
          }
        ]
      }
    });
    assert(invalidPriceRes.json.response.error_list.length > 0, "Rejects promo price > original price");
    assert(invalidPriceRes.json.response.count === 0, "Item was not added");

    // 2.2 Successfully add single product and variation product items
    const model1 = testProductWithModel.models[0];
    const model2 = testProductWithModel.models[1];

    const addSuccessRes = await request(addItemUrl, {
      method: "POST",
      body: {
        discount_id: discountId,
        item_list: [
          {
            item_id: Number(testProduct.itemId),
            item_promotion_price: 150000, // discounted from 200000
            item_promotion_stock: 20,
            purchase_limit: 3
          },
          {
            item_id: Number(testProductWithModel.itemId),
            purchase_limit: 2,
            model_list: [
              {
                model_id: Number(model1.modelId),
                model_promotion_price: 420000, // discounted from 500000
                model_promotion_stock: 10
              },
              {
                model_id: Number(model2.modelId),
                model_promotion_price: 480000, // discounted from 550000
                model_promotion_stock: 15
              }
            ]
          }
        ]
      }
    });

    assert(addSuccessRes.json.response.count === 2, "Successfully added 2 discount items");
    assert(addSuccessRes.json.response.error_list.length === 0, "No errors adding discount items");

    // ========================================================================
    console.log("\nTEST SUITE 3: GET DISCOUNT LIST & GET DISCOUNT DETAIL");
    // ========================================================================
    const listUrl = makeSignedUrl("/api/v2/discount/get_discount_list", {
      discount_status: "upcoming",
      page_no: 1,
      page_size: 10
    });
    const listRes = await request(listUrl);
    assert(listRes.json.error === "", "Successfully fetched discount list");
    assert(listRes.json.response.discount_list.some((d: any) => d.discount_id === discountId), "New discount present in upcoming list");

    const getDetailUrl = makeSignedUrl("/api/v2/discount/get_discount", {
      discount_id: discountId
    });
    const detailRes = await request(getDetailUrl);
    assert(detailRes.json.error === "", "Successfully fetched discount detail");
    assert(detailRes.json.response.discount_id === discountId, "Matches requested discount ID");
    assert(detailRes.json.response.item_list.length === 2, "Returned attached items");

    // ========================================================================
    console.log("\nTEST SUITE 4: UPDATE DISCOUNT & UPDATE DISCOUNT ITEM");
    // ========================================================================
    const updateDiscountUrl = makeSignedUrl("/api/v2/discount/update_discount");
    const updateDiscountRes = await request(updateDiscountUrl, {
      method: "POST",
      body: {
        discount_id: discountId,
        discount_name: "Flash Mega Sale 2026 - Updated Title"
      }
    });
    assert(updateDiscountRes.json.error === "", "Successfully updated discount name");

    const updateItemUrl = makeSignedUrl("/api/v2/discount/update_discount_item");
    const updateItemRes = await request(updateItemUrl, {
      method: "POST",
      body: {
        discount_id: discountId,
        item_list: [
          {
            item_id: Number(testProduct.itemId),
            item_promotion_price: 140000,
            purchase_limit: 5
          }
        ]
      }
    });
    assert(updateItemRes.json.response.count === 1, "Successfully updated item promotional price and limit");

    // ========================================================================
    console.log("\nTEST SUITE 5: DELETE DISCOUNT ITEM");
    // ========================================================================
    const deleteItemUrl = makeSignedUrl("/api/v2/discount/delete_discount_item");
    const deleteItemRes = await request(deleteItemUrl, {
      method: "POST",
      body: {
        discount_id: discountId,
        item_id: Number(testProduct.itemId)
      }
    });
    assert(deleteItemRes.json.error === "", "Successfully deleted item from discount");

    // ========================================================================
    console.log("\nTEST SUITE 6: VOUCHER CREATION & VALIDATION");
    // ========================================================================
    const addVoucherUrl = makeSignedUrl("/api/v2/voucher/add_voucher");

    // 6.1 Reject invalid voucher code (longer than 5 chars or special chars)
    const badCodeRes = await request(addVoucherUrl, {
      method: "POST",
      body: {
        voucher_name: "Bad Code Voucher",
        voucher_code: "TOOLONGCODE",
        start_time: nowSec,
        end_time: nowSec + 86400,
        voucher_type: 1,
        reward_type: 1,
        usage_quantity: 10,
        min_basket_price: 100000,
        discount_amount: 20000
      }
    });
    assert(badCodeRes.json.error === "voucher.voucher_code_error", "Rejects voucher code > 5 characters");

    // 6.2 Reject min_basket_price <= fix_amount
    const badMinPriceRes = await request(addVoucherUrl, {
      method: "POST",
      body: {
        voucher_name: "Invalid Min Price",
        voucher_code: "FIX50",
        start_time: nowSec,
        end_time: nowSec + 86400,
        voucher_type: 1,
        reward_type: 1,
        usage_quantity: 10,
        min_basket_price: 50000,
        discount_amount: 50000 // Cannot be >= min_basket_price
      }
    });
    assert(badMinPriceRes.json.error === "voucher.voucher_min_price_error", "Rejects min_basket_price <= fix_amount");

    // 6.3 Successfully create fixed amount voucher (ongoing)
    const validVoucherRes = await request(addVoucherUrl, {
      method: "POST",
      body: {
        voucher_name: "Save 30k Voucher",
        voucher_code: "SAV30",
        start_time: nowSec - 10,
        end_time: nowSec + 86400,
        voucher_type: 1,
        reward_type: 1,
        usage_quantity: 50,
        min_basket_price: 100000,
        discount_amount: 30000
      }
    });
    assert(validVoucherRes.json.error === "", "Successfully created fixed amount voucher");
    const voucherId = validVoucherRes.json.response.voucher_id;
    assert(voucherId > 0, `Returned voucher_id: ${voucherId}`);

    // 6.4 Reject duplicate voucher code
    const dupRes = await request(addVoucherUrl, {
      method: "POST",
      body: {
        voucher_name: "Duplicate Voucher",
        voucher_code: "SAV30",
        start_time: nowSec,
        end_time: nowSec + 86400,
        voucher_type: 1,
        reward_type: 1,
        usage_quantity: 10,
        min_basket_price: 100000,
        discount_amount: 20000
      }
    });
    assert(dupRes.json.error === "voucher.voucher_code_duplicate_error", "Rejects duplicate voucher code");

    // 6.5 Successfully create percentage voucher
    const validPctRes = await request(addVoucherUrl, {
      method: "POST",
      body: {
        voucher_name: "15 Percent Off",
        voucher_code: "PCT15",
        start_time: nowSec - 10,
        end_time: nowSec + 86400,
        voucher_type: 1,
        reward_type: 2,
        usage_quantity: 100,
        min_basket_price: 200000,
        percentage: 15,
        max_price: 50000
      }
    });
    assert(validPctRes.json.error === "", "Successfully created percentage voucher");

    // 6.6 Create Upcoming Voucher to test delete
    const upcomingVoucherRes = await request(addVoucherUrl, {
      method: "POST",
      body: {
        voucher_name: "Upcoming Promo",
        voucher_code: "UPCOM",
        start_time: nowSec + 3600,
        end_time: nowSec + 7200,
        voucher_type: 1,
        reward_type: 1,
        usage_quantity: 10,
        min_basket_price: 50000,
        discount_amount: 10000
      }
    });
    const upcomingVoucherId = upcomingVoucherRes.json.response.voucher_id;

    // ========================================================================
    console.log("\nTEST SUITE 7: GET VOUCHER LIST & GET VOUCHER DETAIL");
    // ========================================================================
    const vListUrl = makeSignedUrl("/api/v2/voucher/get_voucher_list", { status: "all" });
    const vListRes = await request(vListUrl);
    assert(vListRes.json.error === "", "Successfully retrieved voucher list");
    assert(vListRes.json.response.voucher_list.some((v: any) => v.voucher_id === voucherId), "Created voucher appears in list");

    const vDetailUrl = makeSignedUrl("/api/v2/voucher/get_voucher", { voucher_id: voucherId });
    const vDetailRes = await request(vDetailUrl);
    assert(vDetailRes.json.error === "", "Successfully retrieved voucher detail");
    assert(vDetailRes.json.response.voucher_code === "SAV30", "Voucher detail has correct code");
    assert(vDetailRes.json.response.discount_amount === 30000, "Voucher detail has correct discount amount");

    // ========================================================================
    console.log("\nTEST SUITE 8: VOUCHER LIFECYCLE (DELETE UPCOMING & END ONGOING)");
    // ========================================================================
    const deleteVoucherUrl = makeSignedUrl("/api/v2/voucher/delete_voucher");

    // 8.1 Ongoing voucher cannot be deleted
    const badDeleteRes = await request(deleteVoucherUrl, {
      method: "POST",
      body: { voucher_id: voucherId }
    });
    assert(badDeleteRes.json.error === "voucher.delete_voucher_error", "Rejects deleting ongoing voucher");

    // 8.2 Upcoming voucher CAN be deleted
    const goodDeleteRes = await request(deleteVoucherUrl, {
      method: "POST",
      body: { voucher_id: upcomingVoucherId }
    });
    assert(goodDeleteRes.json.error === "", "Successfully deleted upcoming voucher");

    // 8.3 Ongoing voucher can be ended
    const endVoucherUrl = makeSignedUrl("/api/v2/voucher/end_voucher");
    const endVoucherRes = await request(endVoucherUrl, {
      method: "POST",
      body: { voucher_id: voucherId }
    });
    assert(endVoucherRes.json.error === "", "Successfully ended ongoing voucher");

    // ========================================================================
    console.log("\nTEST SUITE 9: END DISCOUNT & DELETE DISCOUNT");
    // ========================================================================
    // Set discount to ongoing by adjusting startTime to now - 100s
    await prisma.discount.update({
      where: { discountId },
      data: {
        startTime: new Date(Date.now() - 100 * 1000),
        status: PromotionStatus.ONGOING
      }
    });

    const endDiscountUrl = makeSignedUrl("/api/v2/discount/end_discount");
    const endDiscountRes = await request(endDiscountUrl, {
      method: "POST",
      body: { discount_id: discountId }
    });
    assert(endDiscountRes.json.error === "", "Successfully ended ongoing discount");

    // Ended/expired discount cannot be deleted (returns discount.discount_is_end)
    const deleteDiscountUrl = makeSignedUrl("/api/v2/discount/delete_discount");
    const deleteDiscountRes = await request(deleteDiscountUrl, {
      method: "POST",
      body: { discount_id: discountId }
    });
    assert(deleteDiscountRes.json.error === "discount.discount_is_end", "Rejects deleting ended discount with discount.discount_is_end");

    // ========================================================================
    console.log("\nTEST SUITE 10: PROMOTIONAL ORDER CHECKOUT & VOUCHER DEDUCTION");
    // ========================================================================
    // Set up an active ongoing discount for testProduct
    const activeDiscount = await prisma.discount.create({
      data: {
        shopId: BigInt(SHOP_ID),
        discountName: "Active Cart Promo",
        startTime: new Date(Date.now() - 60 * 1000),
        endTime: new Date(Date.now() + 3600 * 1000),
        status: PromotionStatus.ONGOING,
        items: {
          create: {
            itemId: testProduct.itemId,
            purchaseLimit: 2,
            itemPromotionPrice: 160000 // Original is 200000
          }
        }
      }
    });

    // Set up an active ongoing voucher
    const cartVoucher = await prisma.voucher.create({
      data: {
        shopId: BigInt(SHOP_ID),
        voucherCode: "ORDER",
        voucherName: "Order 25k off",
        voucherType: 1,
        rewardType: 1,
        usageQuantity: 10,
        currentUsage: 0,
        minBasketPrice: 300000,
        discountAmount: 25000,
        startTime: new Date(Date.now() - 60 * 1000),
        endTime: new Date(Date.now() + 3600 * 1000),
        status: PromotionStatus.ONGOING
      }
    });

    // Create order with 3 items of testProduct:
    // First 2 items get promoPrice 160,000 = 320,000
    // 3rd item exceeds purchaseLimit (2), gets originalPrice 200,000 = 200,000
    // Items subtotal = 520,000
    // Voucher ORDER applied: -25,000 => subtotal after voucher = 495,000
    // Shipping fee = +15,000 => totalAmount = 510,000
    const orderCreateRes = await request("/api/v2/simulator/order/create", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        voucher_code: "ORDER",
        items: [
          {
            item_id: Number(testProduct.itemId),
            quantity_purchased: 3
          }
        ]
      }
    });

    assert(orderCreateRes.json.error === "", "Order checkout succeeded with promotional pricing and voucher");
    const orderSn = orderCreateRes.json.response.order_sn;

    const createdOrder = await prisma.order.findUnique({
      where: { orderSn },
      include: { items: true }
    });

    assert(createdOrder !== null, "Order exists in database");
    assert(Number(createdOrder!.voucherFromSeller) === 25000, `Recorded voucherFromSeller: ${createdOrder!.voucherFromSeller} (Expected: 25000)`);
    assert(Number(createdOrder!.totalAmount) === 510000, `Recorded totalAmount: ${createdOrder!.totalAmount} (Expected: 510000)`);

    // Verify voucher usage incremented
    const updatedCartVoucher = await prisma.voucher.findUnique({ where: { voucherId: cartVoucher.voucherId } });
    assert(updatedCartVoucher!.currentUsage === 1, "Voucher currentUsage incremented to 1");

    // ========================================================================
    console.log("\nTEST SUITE 11: SIMULATOR PROMOTIONS OVERVIEW HELPER");
    // ========================================================================
    const simPromoRes = await request(`/api/v2/simulator/promotions?shop_id=${SHOP_ID}`);
    assert(simPromoRes.json.error === "", "Successfully queried /api/v2/simulator/promotions");
    assert(Array.isArray(simPromoRes.json.response.discounts), "Returned discounts array");
    assert(Array.isArray(simPromoRes.json.response.vouchers), "Returned vouchers array");
    assert(simPromoRes.json.response.discounts.some((d: any) => d.discount_id === Number(activeDiscount.discountId)), "Active discount present in simulator view");

    console.log("\nTEST SUITE 12: PROTOCOL SECURITY & HMAC / TIMESTAMP REJECTIONS");
    // ========================================================================
    // 12.1 Wrong signature on discount endpoint
    const wrongSignUrl = `/api/v2/discount/get_discount?partner_id=${PARTNER_ID}&timestamp=${nowSec}&access_token=${accessToken}&shop_id=${SHOP_ID}&sign=invalid_hmac_signature_hex&discount_id=${discountId}`;
    const wrongSignRes = await request(wrongSignUrl);
    assert(wrongSignRes.json.error === "error_sign", "Discount endpoint with invalid signature returns error_sign");

    // 12.2 Expired timestamp on voucher endpoint (> 300s in the past)
    const expiredTimestamp = nowSec - 600;
    const baseExpired = buildBaseString(PARTNER_ID, "/api/v2/voucher/get_voucher", expiredTimestamp, accessToken, SHOP_ID);
    const signExpired = calculateHmacSha256(PARTNER_KEY, baseExpired);
    const expiredUrl = `/api/v2/voucher/get_voucher?partner_id=${PARTNER_ID}&timestamp=${expiredTimestamp}&access_token=${accessToken}&shop_id=${SHOP_ID}&sign=${signExpired}&voucher_id=${voucherId}`;
    const expiredRes = await request(expiredUrl);
    assert(expiredRes.json.error === "error_param", "Voucher endpoint with expired timestamp returns error_param");
    assert(expiredRes.json.message.includes("expired"), "Message indicates timestamp is expired");

    // ========================================================================
    console.log("\nTEST SUITE 13: ADVANCED PROMOTIONAL CHECKOUT & EDGE CASES");
    // ========================================================================
    // 13.1 Min basket price threshold rejection (order subtotal too low)
    const minBasketVoucher = await prisma.voucher.create({
      data: {
        shopId: BigInt(SHOP_ID),
        voucherCode: "MIN50",
        voucherName: "Min 500k Spend",
        voucherType: 1,
        rewardType: 1,
        usageQuantity: 10,
        currentUsage: 0,
        minBasketPrice: 500000,
        discountAmount: 50000,
        startTime: new Date(Date.now() - 60 * 1000),
        endTime: new Date(Date.now() + 3600 * 1000),
        status: PromotionStatus.ONGOING
      }
    });

    const lowSpendRes = await request("/api/v2/simulator/order/create", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        voucher_code: "MIN50",
        items: [
          {
            item_id: Number(testProduct.itemId),
            quantity_purchased: 1
          }
        ]
      }
    });
    assert(lowSpendRes.json.error === "", "Order checkout proceeds even if voucher threshold is not met");
    const lowSpendOrder = await prisma.order.findUnique({ where: { orderSn: lowSpendRes.json.response.order_sn } });
    assert(Number(lowSpendOrder!.voucherFromSeller) === 0, "Voucher not applied when itemsSubtotal < minBasketPrice");

    // Verify voucher usage NOT incremented
    const minBasketVoucherAfter = await prisma.voucher.findUnique({ where: { voucherId: minBasketVoucher.voucherId } });
    assert(minBasketVoucherAfter!.currentUsage === 0, "Voucher usage not incremented when threshold not met");

    // 13.2 Quota Exhaustion
    const exhaustedVoucher = await prisma.voucher.create({
      data: {
        shopId: BigInt(SHOP_ID),
        voucherCode: "EXHST",
        voucherName: "Fully Claimed Voucher",
        voucherType: 1,
        rewardType: 1,
        usageQuantity: 1,
        currentUsage: 1,
        minBasketPrice: 100000,
        discountAmount: 20000,
        startTime: new Date(Date.now() - 60 * 1000),
        endTime: new Date(Date.now() + 3600 * 1000),
        status: PromotionStatus.ONGOING
      }
    });

    const exhaustedOrderRes = await request("/api/v2/simulator/order/create", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        voucher_code: "EXHST",
        items: [
          {
            item_id: Number(testProduct.itemId),
            quantity_purchased: 1
          }
        ]
      }
    });
    const exhaustedOrder = await prisma.order.findUnique({ where: { orderSn: exhaustedOrderRes.json.response.order_sn } });
    assert(Number(exhaustedOrder!.voucherFromSeller) === 0, "Exhausted voucher (currentUsage >= usageQuantity) is not deducted");

    // 13.3 Percentage voucher with maxPrice cap
    await prisma.voucher.create({
      data: {
        shopId: BigInt(SHOP_ID),
        voucherCode: "CAP30",
        voucherName: "50% off capped at 30k",
        voucherType: 1,
        rewardType: 2,
        usageQuantity: 10,
        currentUsage: 0,
        minBasketPrice: 100000,
        percentage: 50,
        maxPrice: 30000,
        startTime: new Date(Date.now() - 60 * 1000),
        endTime: new Date(Date.now() + 3600 * 1000),
        status: PromotionStatus.ONGOING
      }
    });

    const capOrderRes = await request("/api/v2/simulator/order/create", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        voucher_code: "CAP30",
        items: [
          {
            item_id: Number(testProduct.itemId),
            quantity_purchased: 1
          }
        ]
      }
    });
    const capOrder = await prisma.order.findUnique({ where: { orderSn: capOrderRes.json.response.order_sn } });
    assert(Number(capOrder!.voucherFromSeller) === 30000, `Percentage discount capped at max_price: ${capOrder!.voucherFromSeller} (Expected: 30000)`);

    // 13.4 Negative Balance Clamp (Math.max(0, subtotal - discount))
    await prisma.voucher.create({
      data: {
        shopId: BigInt(SHOP_ID),
        voucherCode: "BIG01",
        voucherName: "Gigantic Voucher",
        voucherType: 1,
        rewardType: 1,
        usageQuantity: 5,
        currentUsage: 0,
        minBasketPrice: 100000,
        discountAmount: 999999999,
        startTime: new Date(Date.now() - 60 * 1000),
        endTime: new Date(Date.now() + 3600 * 1000),
        status: PromotionStatus.ONGOING
      }
    });

    const clampOrderRes = await request("/api/v2/simulator/order/create", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        voucher_code: "BIG01",
        items: [
          {
            item_id: Number(testProduct.itemId),
            quantity_purchased: 1
          }
        ]
      }
    });
    const clampOrder = await prisma.order.findUnique({ where: { orderSn: clampOrderRes.json.response.order_sn } });
    assert(Number(clampOrder!.totalAmount) === 15000, `Clamped order total cannot be negative: ${clampOrder!.totalAmount} (Expected: 15000)`);

    // 13.5 Holiday Mode checkout rejection
    await prisma.shop.update({ where: { shopId: BigInt(SHOP_ID) }, data: { isVacation: true } });
    const vacationCheckoutRes = await request("/api/v2/simulator/order/create", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        items: [
          {
            item_id: Number(testProduct.itemId),
            quantity_purchased: 1
          }
        ]
      }
    });
    assert(vacationCheckoutRes.json.error === "error_business", "Order creation rejected when shop is in vacation mode");
    await prisma.shop.update({ where: { shopId: BigInt(SHOP_ID) }, data: { isVacation: false } });

    console.log("\n=======================================================");
    console.log("   ✅ ALL 53 PHASE 7 PROMOTIONS TESTS PASSED SUCCESSFULLY!   ");
    console.log("=======================================================\n");

  } finally {
    server.close();
  }
}

runTests().catch(err => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
