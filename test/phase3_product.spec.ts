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
let createdItemId: number;
let createdModelIds: number[] = [];

function assert(condition: boolean, message: string) {
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
  console.log("   SHOPEE SIMULATOR: PHASE 3 PRODUCT TEST SUITE       ");
  console.log("=======================================================\n");

  server = app.listen(0);
  const addr = server.address() as any;
  baseUrl = `http://localhost:${addr.port}`;
  console.log(`Test server running at ${baseUrl}\n`);

  try {
    // ------------------------------------------------------------------------
    console.log("PREPARATION: Fetch Active Access Token from Database");
    // ------------------------------------------------------------------------
    const shop = await prisma.shop.findUnique({ where: { shopId: BigInt(SHOP_ID) } });
    if (!shop || !shop.accessToken) {
      throw new Error("No active access token found for shop 727720655. Run seed or Phase 1 tests first.");
    }
    accessToken = shop.accessToken;
    console.log(`Using active accessToken: ${accessToken}\n`);

    // Clean up test orders and products from previous runs for deterministic testing
    await prisma.order.deleteMany({ where: { shopId: BigInt(SHOP_ID) } });
    await prisma.product.deleteMany({ where: { shopId: BigInt(SHOP_ID) } });

    // ------------------------------------------------------------------------
    console.log("TEST GROUP 1: Get Categories (GET /api/v2/product/get_category)");
    // ------------------------------------------------------------------------
    {
      const url = makeSignedUrl("/api/v2/product/get_category");
      const res = await request(url);

      assert(res.status === 200, "Get category returns HTTP 200");
      assert(res.json?.error === "", "Empty error code indicates success");
      assert(Array.isArray(res.json?.response?.category_list), "category_list is an array");
      assert(res.json?.response?.category_list.length > 0, "Contains seeded categories");

      const elec = res.json?.response?.category_list.find((c: any) => c.category_id === 100001);
      assert(!!elec, "Electronics category (100001) found");
      assert(elec.original_category_name === "Electronics", "Category name is Electronics");
      assert(elec.display_category_name === "Electronics", "Display category name matches");
      assert(elec.has_children === false, "has_children is false");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 2: Get Attribute Tree (GET /api/v2/product/get_attribute_tree)");
    // ------------------------------------------------------------------------
    {
      // 2.1 Missing category_id_list
      const urlMissing = makeSignedUrl("/api/v2/product/get_attribute_tree");
      const resMissing = await request(urlMissing);
      assert(resMissing.json?.error === "error_param", "Missing category_id_list returns error_param");

      // 2.2 Valid category_id_list=100001
      const urlValid = makeSignedUrl("/api/v2/product/get_attribute_tree", { category_id_list: "100001" });
      const resValid = await request(urlValid);
      assert(resValid.status === 200, "Get attribute tree returns HTTP 200");
      assert(resValid.json?.error === "", "Empty error code on attribute tree fetch");
      assert(Array.isArray(resValid.json?.response?.list), "Returns response.list array");

      const tree = resValid.json?.response?.list[0];
      assert(tree?.category_id === 100001, "Attribute tree matches category 100001");
      assert(tree?.attribute_tree.length > 0, "Attribute tree contains attributes");

      const brandAttr = tree.attribute_tree.find((a: any) => a.attribute_id === 50001);
      assert(!!brandAttr, "Brand attribute (50001) found");
      assert(brandAttr.mandatory === true, "Brand attribute is mandatory");
      assert(brandAttr.attribute_value_list.length === 3, "Contains 3 allowed brand options");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 3: Get Brand List (GET /api/v2/product/get_brand_list)");
    // ------------------------------------------------------------------------
    {
      // 3.1 Missing category_id
      const urlMissing = makeSignedUrl("/api/v2/product/get_brand_list");
      const resMissing = await request(urlMissing);
      assert(resMissing.json?.error === "error_param", "Missing category_id returns error_param");

      // 3.2 Valid category_id=100001
      const urlValid = makeSignedUrl("/api/v2/product/get_brand_list", { category_id: 100001, status: 1 });
      const resValid = await request(urlValid);
      assert(resValid.status === 200, "Get brand list returns HTTP 200");
      assert(resValid.json?.error === "", "Empty error code on brand list get");
      assert(Array.isArray(resValid.json?.response?.brand_list), "brand_list is an array");
      assert(resValid.json?.response?.brand_list.length >= 3, "Returns seeded brands");
      assert(resValid.json?.response?.is_mandatory === true, "is_mandatory is true");
      assert(resValid.json?.response?.input_type === "DROP_DOWN", "input_type is DROP_DOWN");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 4: Add Item with Mandatory Attribute Enforcement (POST /api/v2/product/add_item)");
    // ------------------------------------------------------------------------
    {
      const addPath = "/api/v2/product/add_item";

      // 4.1 Missing mandatory attribute (Brand)
      const invalidPayload = {
        item_name: "SmartOmni Wireless Earbuds Pro",
        description: "High-fidelity noise cancelling wireless earbuds with charging case.",
        category_id: 100001,
        original_price: 250000,
        weight: 0.35,
        image: {
          image_id_list: ["sg-11134201-7rd5z-earbuds1"]
        },
        attribute_list: [] // Missing mandatory Brand attribute 50001!
      };

      const urlMissingAttr = makeSignedUrl(addPath);
      const resMissingAttr = await request(urlMissingAttr, { method: "POST", body: invalidPayload });
      assert(resMissingAttr.json?.error === "error_param", "Missing mandatory attribute returns error_param");
      assert(resMissingAttr.json?.message?.includes("Attribute is mandatory"), "Error message specifies mandatory attribute violation");

      // 4.2 Non-existent category_id
      const nonExistentCatPayload = {
        ...invalidPayload,
        category_id: 9999999
      };
      const resNonExistent = await request(makeSignedUrl(addPath), { method: "POST", body: nonExistentCatPayload });
      assert(resNonExistent.json?.error === "error_param", "Invalid category returns error_param");

      // 4.3 Valid payload with mandatory attribute
      const validPayload = {
        item_name: "SmartOmni Wireless Earbuds Pro",
        description: "High-fidelity noise cancelling wireless earbuds with charging case.",
        category_id: 100001,
        original_price: 250000,
        weight: 0.35,
        image: {
          image_id_list: ["sg-11134201-7rd5z-earbuds1"]
        },
        dimension: {
          package_length: 12,
          package_width: 8,
          package_height: 5
        },
        item_sku: "SMART-EARBUDS-01",
        item_status: "NORMAL",
        attribute_list: [
          {
            attribute_id: 50001,
            attribute_value_list: [
              {
                value_id: 1,
                original_value_name: "Apple"
              }
            ]
          }
        ],
        logistic_info: [
          {
            logistic_id: 30001,
            enabled: true,
            is_free: false
          }
        ]
      };

      const resValid = await request(makeSignedUrl(addPath), { method: "POST", body: validPayload });
      assert(resValid.status === 200, "Add item returns HTTP 200");
      assert(resValid.json?.error === "", "Empty error code indicates item creation success");
      assert(typeof resValid.json?.response?.item_id === "number", "Returns numeric item_id");
      assert(resValid.json?.response?.item_name === validPayload.item_name, "Item name matches payload");
      assert(resValid.json?.response?.category_id === 100001, "Category ID matches 100001");
      assert(resValid.json?.response?.item_status === "NORMAL", "Item status is NORMAL");
      assert(resValid.json?.response?.price_info?.[0]?.original_price === 250000, "Original price matches 250000");

      createdItemId = resValid.json?.response?.item_id;
      console.log(`  -> Successfully created item with item_id: ${createdItemId}`);
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 5: Get Item Base Info (GET /api/v2/product/get_item_base_info)");
    // ------------------------------------------------------------------------
    {
      const url = makeSignedUrl("/api/v2/product/get_item_base_info", { item_id_list: createdItemId });
      const res = await request(url);

      assert(res.status === 200, "Get item base info returns HTTP 200");
      assert(res.json?.error === "", "Empty error code on get_item_base_info");
      assert(Array.isArray(res.json?.response?.item_list), "item_list is an array");
      assert(res.json?.response?.item_list.length === 1, "Returns exactly 1 item");

      const item = res.json?.response?.item_list[0];
      assert(item.item_id === createdItemId, "Item ID matches created item");
      assert(item.has_model === false, "Product initially has no models (has_model = false)");
      assert(item.price_info?.length === 1, "Non-variant product returns price_info array");
      assert(item.price_info[0].original_price === 250000, "Price is 250000 VND");
      assert(item.stock_info_v2?.summary_info?.total_available_stock === 100, "Returns standard stock_info_v2 breakdown");
      assert(item.item_sku === "SMART-EARBUDS-01", "Item SKU matches");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 6: Get Item List & Pagination (GET /api/v2/product/get_item_list)");
    // ------------------------------------------------------------------------
    {
      const url = makeSignedUrl("/api/v2/product/get_item_list", {
        offset: 0,
        page_size: 10,
        item_status: "NORMAL"
      });
      const res = await request(url);

      assert(res.status === 200, "Get item list returns HTTP 200");
      assert(res.json?.error === "", "Empty error code on get_item_list");
      assert(Array.isArray(res.json?.response?.item), "response.item is an array");
      assert(res.json?.response?.total_count >= 1, "total_count is at least 1");

      const found = res.json?.response?.item.find((i: any) => i.item_id === createdItemId);
      assert(!!found, "Created item found in paginated item list");
      assert(found.item_status === "NORMAL", "Status in list is NORMAL");
      assert(typeof found.update_time === "number", "Returns valid update_time timestamp");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 7: Update Item (POST /api/v2/product/update_item)");
    // ------------------------------------------------------------------------
    {
      const updatePayload = {
        item_id: createdItemId,
        item_name: "SmartOmni Wireless Earbuds Pro [Updated Edition]",
        description: "Updated description: Ultra noise cancelling and spatial audio support.",
        weight: 0.4
      };

      const url = makeSignedUrl("/api/v2/product/update_item");
      const res = await request(url, { method: "POST", body: updatePayload });

      assert(res.status === 200, "Update item returns HTTP 200");
      assert(res.json?.error === "", "Empty error code on item update");
      assert(res.json?.response?.item_id === createdItemId, "Returns updated item_id");

      // Verify update in get_item_base_info
      const verifyUrl = makeSignedUrl("/api/v2/product/get_item_base_info", { item_id_list: createdItemId });
      const verifyRes = await request(verifyUrl);
      const updatedItem = verifyRes.json?.response?.item_list[0];
      assert(updatedItem.item_name === updatePayload.item_name, "Updated title reflected in base info");
      assert(updatedItem.description === updatePayload.description, "Updated description reflected in base info");
      assert(updatedItem.weight === "0.4", "Updated weight reflected as string '0.4'");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 8: Initialize Tier Variation & Price Ratio Enforcement (POST /api/v2/product/init_tier_variation)");
    // ------------------------------------------------------------------------
    {
      const initPath = "/api/v2/product/init_tier_variation";

      // 8.1 Price Ratio Guard: 50,000 VND vs 300,000 VND (ratio = 6.0x > 5.0x limit for VN)
      const invalidRatioPayload = {
        item_id: createdItemId,
        tier_variation: [
          {
            name: "Color",
            option_list: [{ option: "White" }, { option: "Black" }]
          }
        ],
        model: [
          {
            tier_index: [0],
            original_price: 50000,
            seller_stock: [{ stock: 50 }]
          },
          {
            tier_index: [1],
            original_price: 300000, // 300k / 50k = 6x > 5x limit!
            seller_stock: [{ stock: 50 }]
          }
        ]
      };

      const resInvalidRatio = await request(makeSignedUrl(initPath), { method: "POST", body: invalidRatioPayload });
      assert(resInvalidRatio.json?.error === "error_param", "Extreme price ratio returns error_param");
      assert(resInvalidRatio.json?.message?.includes("price ratio between variations exceeds limit"), "Price ratio error message matches specification");

      // 8.2 Valid 2-Tier Variation Grid: Color (White, Black) x Case (Standard, Wireless) = 4 Models
      const validTiersPayload = {
        item_id: createdItemId,
        tier_variation: [
          {
            name: "Color",
            option_list: [
              { option: "White" },
              { option: "Black" }
            ]
          },
          {
            name: "Edition",
            option_list: [
              { option: "Standard" },
              { option: "Wireless Charging" }
            ]
          }
        ],
        model: [
          {
            tier_index: [0, 0],
            original_price: 240000,
            seller_stock: [{ stock: 100 }],
            model_sku: "EARBUD-WHT-STD"
          },
          {
            tier_index: [0, 1],
            original_price: 280000,
            seller_stock: [{ stock: 80 }],
            model_sku: "EARBUD-WHT-WIR"
          },
          {
            tier_index: [1, 0],
            original_price: 240000,
            seller_stock: [{ stock: 100 }],
            model_sku: "EARBUD-BLK-STD"
          },
          {
            tier_index: [1, 1],
            original_price: 280000,
            seller_stock: [{ stock: 60 }],
            model_sku: "EARBUD-BLK-WIR"
          }
        ]
      };

      const resValidTiers = await request(makeSignedUrl(initPath), { method: "POST", body: validTiersPayload });
      assert(resValidTiers.status === 200, "Init tier variation returns HTTP 200");
      assert(resValidTiers.json?.error === "", "Empty error code on tier initialization");
      assert(resValidTiers.json?.response?.tier_variation?.length === 2, "Creates 2 variation tiers");
      assert(resValidTiers.json?.response?.model?.length === 4, "Generates 4 product models (2x2 grid)");

      createdModelIds = resValidTiers.json?.response?.model.map((m: any) => m.model_id);
      assert(createdModelIds.length === 4, "Stored all 4 created model IDs");
      console.log(`  -> Initialized 4 models: ${createdModelIds.join(", ")}`);
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 9: Get Model List (GET /api/v2/product/get_model_list)");
    // ------------------------------------------------------------------------
    {
      const url = makeSignedUrl("/api/v2/product/get_model_list", { item_id: createdItemId });
      const res = await request(url);

      assert(res.status === 200, "Get model list returns HTTP 200");
      assert(res.json?.error === "", "Empty error code on get_model_list");
      assert(res.json?.response?.tier_variation?.length === 2, "Returns 2 tiers");
      assert(res.json?.response?.model?.length === 4, "Returns all 4 models");

      const firstModel = res.json?.response?.model[0];
      assert(firstModel.model_id === createdModelIds[0], "First model ID matches");
      assert(firstModel.model_name === "White, Standard", "Model name derived accurately");
      assert(firstModel.model_sku === "EARBUD-WHT-STD", "Model SKU matches");
      assert(firstModel.price_info?.[0]?.original_price === 240000, "Model price matches 240,000 VND");
      assert(firstModel.stock_info_v2?.summary_info?.total_available_stock === 100, "Model stock is 100");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 10: Verify Item Base Info with Multi-Tier Variants");
    // ------------------------------------------------------------------------
    {
      const url = makeSignedUrl("/api/v2/product/get_item_base_info", { item_id_list: createdItemId });
      const res = await request(url);
      const item = res.json?.response?.item_list[0];

      assert(item.has_model === true, "Item now reports has_model = true");
      assert(Array.isArray(item.price_info) && item.price_info.length === 0, "Price info empty in base info when models exist (Shopee spec)");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 11: Update Stock (POST /api/v2/product/update_stock)");
    // ------------------------------------------------------------------------
    {
      const stockPath = "/api/v2/product/update_stock";
      const targetModelId = createdModelIds[0];

      // Update model 1 stock to 77 and include non-existent model 9999999 to test partial failure handling
      const stockPayload = {
        item_id: createdItemId,
        stock_list: [
          {
            model_id: targetModelId,
            seller_stock: [{ location_id: "VN_LOCAL", stock: 77 }]
          },
          {
            model_id: 9999999,
            seller_stock: [{ location_id: "VN_LOCAL", stock: 10 }]
          }
        ]
      };

      const resStock = await request(makeSignedUrl(stockPath), { method: "POST", body: stockPayload });
      assert(resStock.status === 200, "Update stock returns HTTP 200");
      assert(resStock.json?.error === "", "Empty error code on update_stock");
      assert(resStock.json?.response?.success_list?.length === 1, "1 model in success_list");
      assert(resStock.json?.response?.success_list[0].model_id === targetModelId, "Target model in success_list");
      assert(resStock.json?.response?.success_list[0].stock === 77, "Stock recorded as 77");
      assert(resStock.json?.response?.failure_list?.length === 1, "1 model in failure_list");
      assert(resStock.json?.response?.failure_list[0].model_id === 9999999, "Non-existent model reported in failure_list");

      // Confirm in get_model_list
      const verifyUrl = makeSignedUrl("/api/v2/product/get_model_list", { item_id: createdItemId });
      const verifyRes = await request(verifyUrl);
      const m1 = verifyRes.json?.response?.model.find((m: any) => m.model_id === targetModelId);
      assert(m1.stock_info_v2?.summary_info?.total_available_stock === 77, "Model 1 stock is now 77 in database");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 12: Update Price & Ratio Enforcement (POST /api/v2/product/update_price)");
    // ------------------------------------------------------------------------
    {
      const pricePath = "/api/v2/product/update_price";
      const targetModelId = createdModelIds[0]; // Currently 240,000 VND; other models are 280,000 VND

      // 12.1 Price ratio violation: Set model 1 to 40,000 VND (max is 280,000 VND -> 280k / 40k = 7.0x > 5.0x limit)
      const invalidRatioPricePayload = {
        item_id: createdItemId,
        price_list: [
          {
            model_id: targetModelId,
            original_price: 40000
          }
        ]
      };

      const resInvalid = await request(makeSignedUrl(pricePath), { method: "POST", body: invalidRatioPricePayload });
      assert(resInvalid.json?.error === "error_param", "Extreme price ratio on update_price returns error_param");
      assert(resInvalid.json?.message?.includes("price ratio between variations exceeds limit"), "Price ratio error message confirmed");

      // 12.2 Valid price update: Set model 1 to 250,000 VND (ratio 280k / 250k = 1.12x <= 5.0x)
      const validPricePayload = {
        item_id: createdItemId,
        price_list: [
          {
            model_id: targetModelId,
            original_price: 250000
          }
        ]
      };

      const resValid = await request(makeSignedUrl(pricePath), { method: "POST", body: validPricePayload });
      assert(resValid.status === 200, "Update price returns HTTP 200");
      assert(resValid.json?.error === "", "Empty error code on price update");
      assert(resValid.json?.response?.success_list?.length === 1, "Model in success_list");
      assert(resValid.json?.response?.success_list[0].original_price === 250000, "Updated price is 250,000 VND");

      // Confirm in get_model_list
      const verifyUrl = makeSignedUrl("/api/v2/product/get_model_list", { item_id: createdItemId });
      const verifyRes = await request(verifyUrl);
      const m1 = verifyRes.json?.response?.model.find((m: any) => m.model_id === targetModelId);
      assert(m1.price_info?.[0]?.original_price === 250000, "Model 1 price is now 250,000 VND in database");
    }

    // ------------------------------------------------------------------------
    console.log("\nTEST GROUP 13: Protocol Security & Signature Checks on Product APIs");
    // ------------------------------------------------------------------------
    {
      const path = "/api/v2/product/get_item_list";
      const now = Math.floor(Date.now() / 1000);
      const invalidSign = "0000000000000000000000000000000000000000000000000000000000000000";

      const resWrongSign = await request(`${path}?partner_id=${PARTNER_ID}&timestamp=${now}&access_token=${accessToken}&shop_id=${SHOP_ID}&sign=${invalidSign}`);
      assert(resWrongSign.json?.error === "error_sign", "Product endpoint with wrong sign returns error_sign");

      const resInvalidToken = await request(`${path}?partner_id=${PARTNER_ID}&timestamp=${now}&access_token=invalid_dummy_token_123&shop_id=${SHOP_ID}&sign=${invalidSign}`);
      // Either wrong sign or invalid token is rejected securely
      assert(resInvalidToken.json?.error === "error_sign" || resInvalidToken.json?.error === "error_auth", "Invalid credentials securely rejected");
    }

    console.log("\n=======================================================");
    console.log("   🎉 ALL 40 PHASE 3 TEST ASSERTIONS PASSED WITH 100%  ");
    console.log("=======================================================\n");

  } catch (error) {
    console.error("\n❌ PHASE 3 TEST SUITE ENCOUNTERED A FAILURE:");
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
