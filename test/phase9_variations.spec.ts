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

async function runPhase9Tests() {
  console.log("\n=======================================================");
  console.log("PHASE 9 TEST SUITE: 2-TIER VARIATIONS (COLOR + SIZE)");
  console.log("=======================================================\n");

  server = app.listen(0);
  const addr = server.address() as any;
  baseUrl = `http://127.0.0.1:${addr.port}`;

  try {
    const shop = await prisma.shop.findUnique({ where: { shopId: BigInt(SHOP_ID) } });
    assert(shop !== null, "Target Shop exists");
    accessToken = shop!.accessToken || "test_access_token";

    // Setup base product for variation tests
    testProduct = await prisma.product.create({
      data: {
        shopId: BigInt(SHOP_ID),
        categoryId: BigInt(100001),
        itemName: "Premium Oxford Cotton Shirt - Phase 9",
        description: "High quality breathable cotton shirt with 2-tier variations",
        originalPrice: 200000,
        currency: "VND",
        weight: 0.35,
        itemSku: `PH9-SHIRT-${Date.now()}`,
        hasModel: false,
        imagesJson: {
          image_id_list: ["img_shirt_01"],
          image_url_list: ["https://cf.shopee.vn/file/shirt_preview"]
        }
      }
    });
    assert(testProduct !== null, "Test product created");

    // -------------------------------------------------------------
    // Test 1: Price ratio exceeding 5:1 limit rejected
    // -------------------------------------------------------------
    console.log("\n[Test 1] 5:1 Variation Price Ratio Validation Guard");
    const badPricePath = makeSignedUrl("/api/v2/product/init_tier_variation");
    const badRatioRes = await request(badPricePath, {
      method: "POST",
      body: {
        item_id: Number(testProduct.itemId),
        tier_variation: [
          { name: "Color", option_list: [{ option: "Black" }, { option: "White" }] },
          { name: "Size", option_list: [{ option: "S" }, { option: "M" }] }
        ],
        model: [
          { tier_index: [0, 0], original_price: 50000, seller_stock: [{ stock: 10 }] },
          { tier_index: [0, 1], original_price: 300000, seller_stock: [{ stock: 10 }] } // 300k / 50k = 6.0 > 5.0
        ]
      }
    });
    assert(badRatioRes.json.error === "error_param", "Rejects price ratio exceeding 5.0");
    assert(badRatioRes.json.message.includes("ratio"), "Error message mentions variation price ratio");

    // -------------------------------------------------------------
    // Test 2: Successful 2-Tier Variation Initialization (2 Colors x 3 Sizes = 6 Models)
    // -------------------------------------------------------------
    console.log("\n[Test 2] Official 2-Tier Variation Initialization (Color + Size)");
    const validPath = makeSignedUrl("/api/v2/product/init_tier_variation");
    const tierVar = [
      { name: "Color", option_list: [{ option: "Navy Blue" }, { option: "Charcoal Gray" }] },
      { name: "Size", option_list: [{ option: "S" }, { option: "M" }, { option: "L" }] }
    ];

    const modelGrid = [
      { tier_index: [0, 0], model_sku: "NAVY-S", original_price: 190000, seller_stock: [{ stock: 40 }] },
      { tier_index: [0, 1], model_sku: "NAVY-M", original_price: 200000, seller_stock: [{ stock: 50 }] },
      { tier_index: [0, 2], model_sku: "NAVY-L", original_price: 210000, seller_stock: [{ stock: 30 }] },
      { tier_index: [1, 0], model_sku: "GRAY-S", original_price: 190000, seller_stock: [{ stock: 25 }] },
      { tier_index: [1, 1], model_sku: "GRAY-M", original_price: 200000, seller_stock: [{ stock: 45 }] },
      { tier_index: [1, 2], model_sku: "GRAY-L", original_price: 210000, seller_stock: [{ stock: 0 }] } // 0 stock out-of-stock model
    ];

    const initRes = await request(validPath, {
      method: "POST",
      body: {
        item_id: Number(testProduct.itemId),
        tier_variation: tierVar,
        model: modelGrid
      }
    });

    assert(initRes.json.error === "", "init_tier_variation succeeds with 0 error");
    assert(initRes.json.response.item_id === Number(testProduct.itemId), "Response echoes item_id");
    assert(Array.isArray(initRes.json.response.model), "Response includes model array");
    assert(initRes.json.response.model.length === 6, "Exactly 6 variation models created");

    // Verify database models
    const dbModels = await prisma.productModel.findMany({
      where: { itemId: testProduct.itemId },
      orderBy: { modelId: "asc" }
    });
    assert(dbModels.length === 6, "Database has 6 models stored");
    assert(dbModels[0].modelName === "Navy Blue, S", "First model named 'Navy Blue, S'");
    assert(dbModels[5].modelName === "Charcoal Gray, L", "Last model named 'Charcoal Gray, L'");
    assert(dbModels[5].sellerStock === 0, "Out-of-stock model has 0 sellerStock");

    // -------------------------------------------------------------
    // Test 3: Simulator Products Endpoint Returns 2D Tier Variations and Model Tier Indexes
    // -------------------------------------------------------------
    console.log("\n[Test 3] Simulator Product Catalog Returns 2D Tier Variations");
    const simCatalogRes = await request(`/api/v2/simulator/products?shop_id=${SHOP_ID}`);
    assert(simCatalogRes.json.error === "", "Simulator products query succeeds");
    const catalogItem = simCatalogRes.json.response.products.find((p: any) => p.item_id === Number(testProduct.itemId));
    assert(catalogItem !== undefined, "Found Phase 9 product in simulator catalog");
    assert(catalogItem.has_model === true, "has_model is true");
    assert(Array.isArray(catalogItem.tier_variation), "tier_variation is array");
    assert(catalogItem.tier_variation.length === 2, "tier_variation has 2 tiers");
    assert(catalogItem.tier_variation[0].name === "Color", "Tier 0 is Color");
    assert(catalogItem.tier_variation[1].name === "Size", "Tier 1 is Size");
    assert(catalogItem.models.length === 6, "6 models returned in catalog");
    assert(Array.isArray(catalogItem.models[0].tier_index), "Model includes tier_index array");
    assert(catalogItem.models[0].tier_index[0] === 0 && catalogItem.models[0].tier_index[1] === 0, "Model 0 tier_index is [0, 0]");

    // -------------------------------------------------------------
    // Test 4: Simulator Direct Product Creation with 2-Tier Variations
    // -------------------------------------------------------------
    console.log("\n[Test 4] Direct Creation of 2-Tier Product via Simulator Router");
    const create2TierRes = await request("/api/v2/simulator/product/create", {
      method: "POST",
      body: {
        shop_id: SHOP_ID,
        category_id: 100001,
        item_name: "Linen Summer Trousers",
        description: "Lightweight summer trousers with 2-tier options",
        original_price: 320000,
        weight: 0.4,
        tier_variation: [
          { name: "Color", option_list: [{ option: "Beige" }, { option: "Khaki" }] },
          { name: "Waist", option_list: [{ option: "29" }, { option: "30" }] }
        ],
        models: [
          { model_name: "Beige, 29", tier_index: [0, 0], original_price: 320000, seller_stock: 20 },
          { model_name: "Beige, 30", tier_index: [0, 1], original_price: 320000, seller_stock: 25 },
          { model_name: "Khaki, 29", tier_index: [1, 0], original_price: 320000, seller_stock: 15 },
          { model_name: "Khaki, 30", tier_index: [1, 1], original_price: 320000, seller_stock: 30 }
        ]
      }
    });
    assert(create2TierRes.json.error === "", "2-Tier simulator product creation succeeds");
    assert(create2TierRes.json.response.item_id > 0, "Created product has valid item_id");

    console.log("\n✅ ALL 16 PHASE 9 ASSERTIONS PASSED!\n");
  } finally {
    if (testProduct) {
      await prisma.productModel.deleteMany({ where: { itemId: testProduct.itemId } }).catch(() => {});
      await prisma.product.delete({ where: { itemId: testProduct.itemId } }).catch(() => {});
    }
    server.close();
  }
}

if (require.main === module) {
  runPhase9Tests().catch(err => {
    console.error("Test execution failed:", err);
    process.exit(1);
  });
}

export { runPhase9Tests };
