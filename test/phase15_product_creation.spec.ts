import { app } from "../src/index";
import { prisma } from "../src/common/prisma";
import * as http from "http";

let server: http.Server;
let baseUrl: string;

function assert(condition: any, message: string) {
  if (!condition) throw new Error(`FAILED: ${message}`);
  console.log(`  ✓ ${message}`);
}

async function request(path: string, options: { method?: string; body?: any } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json" },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  return response.json() as Promise<any>;
}

async function runTests() {
  console.log("=======================================================");
  console.log("PHASE 15: SHOPIZ PRODUCT CREATION WORKFLOW");
  console.log("=======================================================\n");

  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const address = server.address() as any;
      baseUrl = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });

  const shopId = BigInt(727720655);
  const originalShop = await prisma.shop.findUniqueOrThrow({ where: { shopId } });
  const createdIds: bigint[] = [];

  try {
    const options = [
      { optionId: "pickup_point", optionName: "Điểm nhận hàng", optionGroup: "Lấy hàng chủ động", partnerLabel: "ĐỐI TÁC SHOPEE", maximumWeightGram: 10000, sortOrder: 1, enabled: true },
      { optionId: "viettel_smartbox", optionName: "Tủ nhận hàng - Viettel Smartbox", optionGroup: "Lấy hàng chủ động", partnerLabel: "ĐỐI TÁC SHOPEE", maximumWeightGram: 10000, sortOrder: 2, enabled: true },
      { optionId: "same_day_express", optionName: "Hỏa Tốc", optionGroup: "2. Hỏa Tốc", partnerLabel: "ĐỐI TÁC SHOPEE", maximumWeightGram: null, sortOrder: 3, enabled: true },
      { optionId: "same_day_delivery", optionName: "Trong Ngày", optionGroup: "3. Trong Ngày", partnerLabel: "ĐỐI TÁC SHOPEE", maximumWeightGram: null, sortOrder: 4, enabled: true },
      { optionId: "fast_delivery", optionName: "Nhanh", optionGroup: "4. Nhanh", partnerLabel: "ĐỐI TÁC SHOPEE", maximumWeightGram: null, sortOrder: 5, enabled: true },
      { optionId: "bulky_goods", optionName: "Hàng Cồng Kềnh", optionGroup: "5. Hàng Cồng Kềnh", partnerLabel: "ĐỐI TÁC SHOPEE", maximumWeightGram: null, sortOrder: 6, enabled: true }
    ];
    for (const option of options) {
      await prisma.productShippingOption.upsert({ where: { optionId: option.optionId }, update: option, create: option });
    }
    const initialOptionCount = await prisma.productShippingOption.count();
    for (const option of options) {
      await prisma.productShippingOption.upsert({ where: { optionId: option.optionId }, update: option, create: option });
    }
    assert(await prisma.productShippingOption.count() === initialOptionCount, "Shipping option seed is idempotent");

    const config = await request(`/api/v2/simulator/product-creation/config?shop_id=${shopId}`);
    assert(config.error === "", "Product creation config succeeds");
    assert(config.response.is_vacation === originalShop.isVacation, "Config returns current shop holiday state");
    assert(!("partner_key" in config.response) && !("access_token" in config.response), "Shop config does not expose credentials");
    assert(config.response.shipping_options.length === 6, "Config returns all six enabled shipping options");
    assert(config.response.shipping_options.filter((option: any) => option.maximum_weight_gram === 10000).length === 2, "Existing pickup methods retain their 10,000 g limit");
    assert(config.response.shipping_options.slice(2).every((option: any) => option.maximum_weight_gram === null && option.partner_label === "ĐỐI TÁC SHOPEE"), "New shipping methods have Shopee partner badges without guessed weight limits");

    const category = await prisma.category.findFirstOrThrow({
      where: { hasChildren: false, attributes: { some: { isMandatory: true } } },
      include: { attributes: true }
    });
    const attributeList = category.attributes.filter((attribute) => attribute.isMandatory).map((attribute) => {
      const values = Array.isArray(attribute.valueListJson) ? attribute.valueListJson as any[] : [];
      const first = values[0];
      return {
        attribute_id: Number(attribute.attributeId),
        attribute_value_list: first
          ? [{ value_id: first.value_id ?? 0, original_value_name: first.original_value_name ?? "" }]
          : [{ value_id: 0, original_value_name: "" }]
      };
    });
    const valid = {
      product_workflow: true,
      shop_id: Number(shopId),
      category_id: Number(category.categoryId),
      item_name: `Product flow ${Date.now()}`,
      description: "Product creation integration test",
      original_price: 250000,
      package_weight_grams: 900,
      dimension: { package_length: 20, package_width: 15, package_height: 10 },
      item_sku: `P15-${Date.now()}`,
      gtin: "0123456789012",
      video_url: "https://media.example.test/product.mp4",
      image_ratio: "3:4",
      product_condition: "NEW",
      is_preorder: false,
      preorder_days_to_ship: null,
      shipping_option_ids: ["pickup_point"],
      attribute_list: attributeList,
      image_url_list: ["https://media.example.test/product-cover.jpg"],
      item_status: "UNLIST",
      tier_variation: [{ name: "Color", option_list: [{ option: "Blue" }, { option: "Black" }] }],
      models: [
        { model_name: "Blue", tier_index: [0], original_price: 250000, seller_stock: 7 },
        { model_name: "Black", tier_index: [1], original_price: 250000, seller_stock: 9 }
      ]
    };

    const noShipping = await request("/api/v2/simulator/product/create", {
      method: "POST", body: { ...valid, shipping_option_ids: [] }
    });
    assert(noShipping.error === "error_param", "Creation rejects a product with no selected shipping option");

    const tooHeavy = await request("/api/v2/simulator/product/create", {
      method: "POST", body: { ...valid, package_weight_grams: 10001 }
    });
    assert(tooHeavy.error === "error_param", "Creation enforces the selected option's 10,000 g maximum");

    const missingAttribute = await request("/api/v2/simulator/product/create", {
      method: "POST", body: { ...valid, attribute_list: [] }
    });
    assert(missingAttribute.error === "error_param", "Creation rejects missing mandatory category attributes");

    const nonLeaf = await prisma.category.findFirst({ where: { hasChildren: true } });
    if (nonLeaf) {
      const invalidCategory = await request("/api/v2/simulator/product/create", {
        method: "POST", body: { ...valid, category_id: Number(nonLeaf.categoryId) }
      });
      assert(invalidCategory.error === "error_param", "Creation rejects a non-leaf category");
    }

    const created = await request("/api/v2/simulator/product/create", { method: "POST", body: valid });
    assert(created.error === "", "Valid product saves successfully");
    const itemId = BigInt(created.response.item_id);
    createdIds.push(itemId);
    assert(created.response.item_status === "UNLIST", "Save as hidden returns UNLIST status");

    const savedProduct = await prisma.product.findUniqueOrThrow({ where: { itemId }, include: { models: true } });
    assert(savedProduct.gtin === valid.gtin && savedProduct.videoUrl === valid.video_url, "GTIN and video URL persist");
    assert(savedProduct.imageRatio === "3:4", "Selected image ratio persists");
    assert(savedProduct.preorderDaysToShip === null, "Non-preorder product has no preparation lead time");
    assert(savedProduct.itemStatus === "UNLIST", "Hidden status persists");
    assert(Number(savedProduct.weight) === 0.9, "Grams are stored in the existing kilogram field");
    assert((savedProduct.shippingOptionsJson as any[])[0].option_id === "pickup_point", "Selected shipping option persists");
    assert(savedProduct.models.length === 2 && savedProduct.models[1].sellerStock === 9, "Variation prices and inventory persist");
    assert(JSON.stringify(savedProduct.attributesJson) === JSON.stringify(attributeList), "Category attribute values persist");

    const preorder = await request("/api/v2/simulator/product/create", {
      method: "POST", body: { ...valid, item_name: `${valid.item_name} preorder`, is_preorder: true, preorder_days_to_ship: 7, shipping_option_ids: ["same_day_delivery"], tier_variation: [], models: [] }
    });
    assert(preorder.error === "", "Preorder product accepts a 5–15 day preparation period");
    const preorderId = BigInt(preorder.response.item_id);
    createdIds.push(preorderId);
    const preorderProduct = await prisma.product.findUniqueOrThrow({ where: { itemId: preorderId } });
    assert(preorderProduct.preorderDaysToShip === 7, "Preorder preparation days persist");
    const invalidPreorder = await request("/api/v2/simulator/product/create", {
      method: "POST", body: { ...valid, is_preorder: true, preorder_days_to_ship: 16 }
    });
    assert(invalidPreorder.error === "error_param", "Preorder preparation days outside 5–15 are rejected");

    const fourTiers = ["Color", "Size", "Material", "Pack"].map((name) => ({ name, option_list: [{ option: "A" }, { option: "B" }] }));
    const fourTierModels = Array.from({ length: 16 }, (_, index) => ({
      model_name: `Combination ${index}`,
      tier_index: [0, 1, 2, index % 2],
      original_price: 250000,
      seller_stock: 1
    }));
    const fourTierProduct = await request("/api/v2/simulator/product/create", {
      method: "POST", body: { ...valid, item_name: `${valid.item_name} four tiers`, tier_variation: fourTiers, models: fourTierModels }
    });
    assert(fourTierProduct.error === "", "Layer B product creation accepts up to four variation groups");
    createdIds.push(BigInt(fourTierProduct.response.item_id));
    const tooManyTiers = await request("/api/v2/simulator/product/create", {
      method: "POST", body: { ...valid, tier_variation: [...fourTiers, { name: "Fifth", option_list: [{ option: "A" }] }] }
    });
    assert(tooManyTiers.error === "error_param", "Layer B rejects a fifth variation group");

    const normalCreated = await request("/api/v2/simulator/product/create", {
      method: "POST", body: { ...valid, item_name: `${valid.item_name} visible`, item_status: "NORMAL", models: [] }
    });
    assert(normalCreated.error === "", "Active shop may create a visible product");
    createdIds.push(BigInt(normalCreated.response.item_id));
    assert(normalCreated.response.item_status === "NORMAL", "Visible product returns NORMAL status");

    await prisma.shop.update({ where: { shopId }, data: { isVacation: true } });
    const forbiddenVisible = await request("/api/v2/simulator/product/create", {
      method: "POST", body: { ...valid, item_name: `${valid.item_name} blocked`, item_status: "NORMAL" }
    });
    assert(forbiddenVisible.error === "error_business", "Holiday shop cannot create a visible product");

    const holidayHidden = await request("/api/v2/simulator/product/create", {
      method: "POST", body: { ...valid, item_name: `${valid.item_name} holiday`, item_status: "UNLIST", models: [] }
    });
    assert(holidayHidden.error === "", "Holiday shop may save a product unlisted");
    createdIds.push(BigInt(holidayHidden.response.item_id));

    const catalog = await request(`/api/v2/simulator/products?shop_id=${shopId}`);
    const listed = catalog.response.products.find((product: any) => product.item_id === Number(itemId));
    assert(listed?.item_status === "UNLIST" && listed?.gtin === valid.gtin, "Seller catalog exposes saved status and product details");
  } finally {
    await prisma.shop.update({ where: { shopId }, data: { isVacation: originalShop.isVacation } });
    for (const itemId of createdIds) {
      await prisma.productModel.deleteMany({ where: { itemId } });
      await prisma.product.deleteMany({ where: { itemId } });
    }
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await prisma.$disconnect();
  }
}

runTests().catch((error) => {
  console.error(error);
  process.exit(1);
});
