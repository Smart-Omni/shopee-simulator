import { Router, Request, Response } from "express";
import { prisma } from "../../common/prisma";
import { createShopeeSuccessResponse, createShopeeErrorResponse } from "../../common/utils/envelope";
import { shopeeAuthGuard } from "../../common/middleware/auth-guard";
import { WebhookService } from "../webhook/webhook.service";
import { getItemExtraInfo, parseItemIds } from "./product-metrics.service";

export const productRouter = Router();

// ============================================================================
// GET ITEM EXTRA INFO: GET /api/v2/product/get_item_extra_info
// ============================================================================
productRouter.get("/api/v2/product/get_item_extra_info", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdRaw = req.query.shop_id;
  const itemIds = parseItemIds(req.query.item_id_list);
  if (!shopIdRaw || !/^\d+$/.test(String(shopIdRaw)) || !itemIds) {
    res.json(createShopeeErrorResponse("error_param", "shop_id and a valid item_id_list are required"));
    return;
  }
  if (itemIds.length > 50) {
    res.json(createShopeeErrorResponse("error_param", "item_id_list supports at most 50 item IDs"));
    return;
  }
  const shopId = BigInt(String(shopIdRaw));
  const items = await getItemExtraInfo(shopId, itemIds);
  if (items.length !== new Set(itemIds.map(String)).size) {
    res.json(createShopeeErrorResponse("error_param", "One or more items do not belong to this shop"));
    return;
  }
  res.json(createShopeeSuccessResponse({ item_list: items }));
});

// Helper to parse query parameter lists that might be string, comma-separated, or JSON array
function parseListParam(param: any): string[] {
  if (!param) return [];
  if (Array.isArray(param)) {
    return param.flatMap(p => parseListParam(p));
  }
  if (typeof param === "string") {
    const trimmed = param.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch {
        // Fallback to strip brackets
        return trimmed.slice(1, -1).split(",").map(s => s.trim()).filter(Boolean);
      }
    }
    return trimmed.split(",").map(s => s.trim()).filter(Boolean);
  }
  return [String(param)];
}

// ============================================================================
// 1. GET CATEGORY: GET /api/v2/product/get_category
// ============================================================================
productRouter.get("/api/v2/product/get_category", shopeeAuthGuard, async (_req: Request, res: Response): Promise<void> => {
  const categories = await prisma.category.findMany({
    orderBy: { categoryId: "asc" }
  });

  const categoryList = categories.map((cat) => ({
    category_id: Number(cat.categoryId),
    parent_category_id: Number(cat.parentId),
    original_category_name: cat.categoryName,
    display_category_name: cat.categoryName,
    has_children: cat.hasChildren
  }));

  res.json(createShopeeSuccessResponse({
    category_list: categoryList
  }));
});

// ============================================================================
// 2. GET ATTRIBUTE TREE: GET /api/v2/product/get_attribute_tree
// ============================================================================
productRouter.get("/api/v2/product/get_attribute_tree", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const rawCatList = req.query.category_id_list || req.query.category_ids;
  const catIdStrings = parseListParam(rawCatList);

  if (catIdStrings.length === 0) {
    res.json(createShopeeErrorResponse("error_param", "category_id_list is required"));
    return;
  }

  const catIds = catIdStrings.map(id => BigInt(id));

  const categories = await prisma.category.findMany({
    where: { categoryId: { in: catIds } },
    include: {
      attributes: true
    }
  });

  const list = categories.map((cat) => ({
    category_id: Number(cat.categoryId),
    attribute_tree: cat.attributes.map((attr) => ({
      attribute_id: Number(attr.attributeId),
      mandatory: attr.isMandatory,
      name: attr.name,
      attribute_value_list: (attr.valueListJson as any[]) || [],
      attribute_info: {
        input_type: attr.inputType === "DROP_DOWN" ? 1 : (attr.inputType === "TEXT_FILED" ? 3 : 4),
        input_validation_type: 0,
        format_type: 1,
        date_format_type: 0,
        attribute_unit_list: [],
        max_value_count: 1,
        is_oem: false,
        support_search_value: false
      }
    }))
  }));

  res.json(createShopeeSuccessResponse({
    list
  }));
});

// ============================================================================
// 3. GET BRAND LIST: GET /api/v2/product/get_brand_list
// ============================================================================
productRouter.get("/api/v2/product/get_brand_list", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const categoryIdStr = req.query.category_id as string;
  if (!categoryIdStr) {
    res.json(createShopeeErrorResponse("error_param", "category_id is required"));
    return;
  }

  const categoryId = BigInt(categoryIdStr);
  const brandAttr = await prisma.categoryAttribute.findFirst({
    where: {
      categoryId,
      name: { contains: "Brand", mode: "insensitive" }
    }
  });

  let brands: { brand_id: number; original_brand_name: string; display_brand_name: string }[] = [];
  let isMandatory = false;

  if (brandAttr && Array.isArray(brandAttr.valueListJson)) {
    isMandatory = brandAttr.isMandatory;
    brands = (brandAttr.valueListJson as any[]).map((v) => ({
      brand_id: v.value_id || 0,
      original_brand_name: v.original_value_name || "No Brand",
      display_brand_name: v.original_value_name || "No Brand"
    }));
  } else {
    brands = [
      { brand_id: 0, original_brand_name: "NoBrand", display_brand_name: "NoBrand" }
    ];
  }

  res.json(createShopeeSuccessResponse({
    brand_list: brands,
    has_next_page: false,
    next_offset: 0,
    is_mandatory: isMandatory,
    input_type: "DROP_DOWN"
  }));
});

// ============================================================================
// 4. GET ITEM LIST: GET /api/v2/product/get_item_list
// ============================================================================
productRouter.get("/api/v2/product/get_item_list", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const offset = parseInt((req.query.offset as string) || "0", 10);
  const pageSize = Math.min(parseInt((req.query.page_size as string) || "10", 10), 100);

  const statusList = parseListParam(req.query.item_status);
  const updateTimeFrom = req.query.update_time_from ? parseInt(req.query.update_time_from as string, 10) : undefined;
  const updateTimeTo = req.query.update_time_to ? parseInt(req.query.update_time_to as string, 10) : undefined;

  const whereClause: any = { shopId };

  if (statusList.length > 0) {
    whereClause.itemStatus = { in: statusList };
  }

  if (updateTimeFrom || updateTimeTo) {
    whereClause.updatedAt = {};
    if (updateTimeFrom) whereClause.updatedAt.gte = new Date(updateTimeFrom * 1000);
    if (updateTimeTo) whereClause.updatedAt.lte = new Date(updateTimeTo * 1000);
  }

  const [totalCount, items] = await Promise.all([
    prisma.product.count({ where: whereClause }),
    prisma.product.findMany({
      where: whereClause,
      skip: offset,
      take: pageSize,
      orderBy: { updatedAt: "desc" }
    })
  ]);

  const hasNextPage = offset + items.length < totalCount;
  const nextOffset = hasNextPage ? offset + items.length : offset;

  const itemList = items.map((p) => ({
    item_id: Number(p.itemId),
    item_status: p.itemStatus,
    update_time: Math.floor(p.updatedAt.getTime() / 1000)
  }));

  res.json(createShopeeSuccessResponse({
    item: itemList,
    total_count: totalCount,
    has_next_page: hasNextPage,
    next_offset: nextOffset
  }));
});

// ============================================================================
// 5. GET ITEM BASE INFO: GET /api/v2/product/get_item_base_info
// ============================================================================
productRouter.get("/api/v2/product/get_item_base_info", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const itemIdStrings = parseListParam(req.query.item_id_list);
  if (itemIdStrings.length === 0) {
    res.json(createShopeeErrorResponse("error_param", "item_id_list is required"));
    return;
  }

  const itemIds = itemIdStrings.map(id => BigInt(id));

  const products = await prisma.product.findMany({
    where: {
      shopId,
      itemId: { in: itemIds }
    },
    include: {
      category: true,
      models: true
    }
  });

  const itemList = products.map((p) => {
    const images = (p.imagesJson as any) || { image_id_list: [], image_url_list: [] };
    const dimensions = (p.dimensionsJson as any) || { package_length: 10, package_width: 10, package_height: 10 };
    const attributes = (p.attributesJson as any) || [];

    const baseItem: any = {
      item_id: Number(p.itemId),
      category_id: Number(p.categoryId),
      item_name: p.itemName,
      description: p.description,
      item_sku: p.itemSku || "",
      create_time: Math.floor(p.createdAt.getTime() / 1000),
      update_time: Math.floor(p.updatedAt.getTime() / 1000),
      item_status: p.itemStatus,
      has_model: p.hasModel,
      weight: p.weight.toString(),
      dimension: dimensions,
      image: {
        image_id_list: images.image_id_list || [],
        image_url_list: images.image_url_list || ["https://cf.shopee.vn/file/default_mock_image"]
      },
      attribute_list: attributes
    };

    // Shopee Rule: If item has models, price_info and stock_info_v2 are omitted or empty in base info.
    // Sellers query get_model_list for variant price/stock breakdowns.
    if (p.hasModel) {
      baseItem.price_info = [];
    } else {
      baseItem.price_info = [
        {
          currency: p.currency,
          original_price: Number(p.originalPrice),
          current_price: Number(p.originalPrice)
        }
      ];
      baseItem.stock_info_v2 = {
        summary_info: {
          total_reserved_stock: 0,
          total_available_stock: 100
        },
        seller_stock: [
          {
            location_id: "VN_LOCAL",
            stock: 100
          }
        ],
        shopee_stock: []
      };
    }

    return baseItem;
  });

  res.json(createShopeeSuccessResponse({
    item_list: itemList
  }));
});

// ============================================================================
// 6. GET MODEL LIST: GET /api/v2/product/get_model_list
// ============================================================================
productRouter.get("/api/v2/product/get_model_list", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);
  const itemIdStr = req.query.item_id as string;

  if (!itemIdStr) {
    res.json(createShopeeErrorResponse("error_param", "item_id is required"));
    return;
  }

  const itemId = BigInt(itemIdStr);
  const product = await prisma.product.findFirst({
    where: { itemId, shopId },
    include: { models: { orderBy: { modelId: "asc" } } }
  });

  if (!product) {
    res.json(createShopeeErrorResponse("error_param", "Item not found"));
    return;
  }

  const tierVariation = (product.tierVariationJson as any[]) || [];
  const modelList = product.models.map((m) => ({
    model_id: Number(m.modelId),
    model_name: m.modelName,
    model_sku: m.modelSku || "",
    tier_index: (m.tierIndex as number[]) || [],
    has_promotion: false,
    model_status: "MODEL_NORMAL",
    price_info: [
      {
        currency: product.currency,
        original_price: Number(m.originalPrice),
        current_price: Number(m.originalPrice)
      }
    ],
    stock_info_v2: {
      summary_info: {
        total_reserved_stock: m.reservedStock,
        total_available_stock: m.sellerStock
      },
      seller_stock: [
        {
          location_id: "VN_LOCAL",
          stock: m.sellerStock
        }
      ],
      shopee_stock: []
    }
  }));

  res.json(createShopeeSuccessResponse({
    tier_variation: tierVariation,
    model: modelList
  }));
});

// ============================================================================
// 7. ADD ITEM: POST /api/v2/product/add_item
// ============================================================================
productRouter.post("/api/v2/product/add_item", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const {
    item_name,
    description,
    category_id,
    original_price,
    weight,
    image,
    attribute_list,
    dimension,
    item_sku,
    item_status,
    logistic_info
  } = req.body || {};

  // 1. Validate required basic parameters
  if (!item_name || !description || category_id === undefined || original_price === undefined || weight === undefined || !image) {
    res.json(createShopeeErrorResponse("error_param", "Missing required parameters: item_name, description, category_id, original_price, weight, and image are required."));
    return;
  }

  const catId = BigInt(category_id);

  // 2. Validate category existence
  const category = await prisma.category.findUnique({
    where: { categoryId: catId },
    include: { attributes: true }
  });

  if (!category) {
    res.json(createShopeeErrorResponse("error_param", "Category does not exist"));
    return;
  }

  // 3. Category Attribute Validation: Check all mandatory attributes
  const mandatoryAttributes = category.attributes.filter(a => a.isMandatory);
  const suppliedAttributes = Array.isArray(attribute_list) ? attribute_list : [];

  for (const mandatoryAttr of mandatoryAttributes) {
    const found = suppliedAttributes.find(
      (a: any) => BigInt(a.attribute_id) === mandatoryAttr.attributeId
    );
    if (!found || !Array.isArray(found.attribute_value_list) || found.attribute_value_list.length === 0) {
      res.json(createShopeeErrorResponse("error_param", `Attribute is mandatory: ${mandatoryAttr.name} (id: ${mandatoryAttr.attributeId})`));
      return;
    }
  }

  // 4. Create Product record
  const createdProduct = await prisma.product.create({
    data: {
      shopId,
      categoryId: catId,
      itemName: item_name,
      description,
      originalPrice: Number(original_price),
      currency: "VND",
      weight: Number(weight),
      dimensionsJson: dimension || { package_length: 10, package_width: 10, package_height: 10 },
      imagesJson: image,
      attributesJson: suppliedAttributes,
      itemSku: item_sku || null,
      itemStatus: item_status || "NORMAL",
      hasModel: false
    }
  });

  res.json(createShopeeSuccessResponse({
    item_id: Number(createdProduct.itemId),
    item_name: createdProduct.itemName,
    description: createdProduct.description,
    category_id: Number(createdProduct.categoryId),
    item_status: createdProduct.itemStatus,
    price_info: [
      {
        currency: createdProduct.currency,
        original_price: Number(createdProduct.originalPrice),
        current_price: Number(createdProduct.originalPrice)
      }
    ],
    images: {
      image_id_list: image.image_id_list || [],
      image_url_list: image.image_url_list || ["https://cf.shopee.vn/file/default_mock_image"]
    },
    weight: createdProduct.weight.toString(),
    dimension: createdProduct.dimensionsJson,
    logistic_info: logistic_info || []
  }));
});

// ============================================================================
// 8. INIT TIER VARIATION: POST /api/v2/product/init_tier_variation
// ============================================================================
productRouter.post("/api/v2/product/init_tier_variation", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const { item_id, tier_variation, model } = req.body || {};

  if (!item_id || !Array.isArray(tier_variation) || !Array.isArray(model)) {
    res.json(createShopeeErrorResponse("error_param", "item_id, tier_variation, and model are required"));
    return;
  }

  const itemId = BigInt(item_id);
  const product = await prisma.product.findFirst({
    where: { itemId, shopId }
  });

  if (!product) {
    res.json(createShopeeErrorResponse("error_param", "Item not found"));
    return;
  }

  if (tier_variation.length > 2) {
    res.json(createShopeeErrorResponse("error_param", "Tier variation count exceeds limit of 2 tiers"));
    return;
  }

  if (model.length === 0) {
    res.json(createShopeeErrorResponse("error_param", "Model list must not be empty"));
    return;
  }

  // Variation Price Ratio Guard: max(price) / min(price) <= 5.0
  const prices = model.map((m: any) => Number(m.original_price)).filter(p => !isNaN(p));
  if (prices.length > 0) {
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    if (minPrice > 0 && maxPrice / minPrice > 5.0) {
      res.json(createShopeeErrorResponse("error_param", "The price ratio between variations exceeds limit"));
      return;
    }
  }

  // Delete previous models if re-initializing
  await prisma.productModel.deleteMany({ where: { itemId } });

  // Create ProductModel records
  const createdModels = [];
  for (const m of model) {
    const tierIndexes = m.tier_index as number[];
    const nameParts: string[] = [];

    if (tierIndexes[0] !== undefined && tier_variation[0]?.option_list[tierIndexes[0]]) {
      nameParts.push(tier_variation[0].option_list[tierIndexes[0]].option);
    }
    if (tierIndexes[1] !== undefined && tier_variation[1]?.option_list[tierIndexes[1]]) {
      nameParts.push(tier_variation[1].option_list[tierIndexes[1]].option);
    }

    const modelName = nameParts.length > 0 ? nameParts.join(", ") : "Default";
    const stockVal = Array.isArray(m.seller_stock) && m.seller_stock[0]?.stock !== undefined
      ? Number(m.seller_stock[0].stock)
      : 100;

    const pm = await prisma.productModel.create({
      data: {
        itemId,
        modelName,
        modelSku: m.model_sku || null,
        tierIndex: tierIndexes,
        originalPrice: Number(m.original_price),
        sellerStock: stockVal,
        shopeeStock: 0,
        reservedStock: 0
      }
    });

    createdModels.push(pm);
  }

  // Update product hasModel flag and tier variation JSON
  await prisma.product.update({
    where: { itemId },
    data: {
      hasModel: true,
      tierVariationJson: tier_variation
    }
  });

  res.json(createShopeeSuccessResponse({
    item_id: Number(product.itemId),
    tier_variation,
    model: createdModels.map((m) => ({
      tier_index: m.tierIndex,
      model_id: Number(m.modelId),
      model_sku: m.modelSku || "",
      price_info: [
        {
          original_price: Number(m.originalPrice)
        }
      ],
      seller_stock: [
        {
          location_id: "VN_LOCAL",
          stock: m.sellerStock
        }
      ]
    }))
  }));
});

// ============================================================================
// 9. UPDATE ITEM: POST /api/v2/product/update_item
// ============================================================================
productRouter.post("/api/v2/product/update_item", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const {
    item_id,
    item_name,
    description,
    category_id,
    item_status,
    weight,
    dimension,
    item_sku,
    image,
    attribute_list
  } = req.body || {};

  if (!item_id) {
    res.json(createShopeeErrorResponse("error_param", "item_id is required"));
    return;
  }

  const itemId = BigInt(item_id);
  const existing = await prisma.product.findFirst({
    where: { itemId, shopId }
  });

  if (!existing) {
    res.json(createShopeeErrorResponse("error_param", "Item not found"));
    return;
  }

  const updateData: any = {};
  if (item_name !== undefined) updateData.itemName = item_name;
  if (description !== undefined) updateData.description = description;
  if (item_status !== undefined) updateData.itemStatus = item_status;
  if (weight !== undefined) updateData.weight = Number(weight);
  if (dimension !== undefined) updateData.dimensionsJson = dimension;
  if (item_sku !== undefined) updateData.itemSku = item_sku;
  if (image !== undefined) updateData.imagesJson = image;
  if (attribute_list !== undefined) updateData.attributesJson = attribute_list;

  if (category_id !== undefined) {
    const catId = BigInt(category_id);
    const cat = await prisma.category.findUnique({ where: { categoryId: catId } });
    if (!cat) {
      res.json(createShopeeErrorResponse("error_param", "Category does not exist"));
      return;
    }
    updateData.categoryId = catId;
  }

  await prisma.product.update({
    where: { itemId },
    data: updateData
  });

  res.json(createShopeeSuccessResponse({
    item_id: Number(itemId)
  }));
});

// ============================================================================
// 10. UPDATE STOCK: POST /api/v2/product/update_stock
// ============================================================================
productRouter.post("/api/v2/product/update_stock", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const { item_id, stock_list } = req.body || {};

  if (!item_id || !Array.isArray(stock_list)) {
    res.json(createShopeeErrorResponse("error_param", "item_id and stock_list are required"));
    return;
  }

  const itemId = BigInt(item_id);
  const product = await prisma.product.findFirst({
    where: { itemId, shopId },
    include: { models: true }
  });

  if (!product) {
    res.json(createShopeeErrorResponse("error_param", "Item not found"));
    return;
  }

  const failureList: any[] = [];
  const successList: any[] = [];

  for (const entry of stock_list) {
    const modelIdNum = Number(entry.model_id || 0);
    const sellerStockArr = entry.seller_stock || [];
    const targetStock = sellerStockArr[0]?.stock !== undefined ? Number(sellerStockArr[0].stock) : 0;
    const locationId = sellerStockArr[0]?.location_id || "VN_LOCAL";

    if (modelIdNum === 0) {
      // Product without variants
      successList.push({
        model_id: 0,
        location_id: locationId,
        stock: targetStock
      });
    } else {
      const model = product.models.find(m => Number(m.modelId) === modelIdNum);
      if (!model) {
        failureList.push({
          model_id: modelIdNum,
          failed_reason: "Model does not exist"
        });
      } else {
        await prisma.productModel.update({
          where: { modelId: model.modelId },
          data: { sellerStock: targetStock }
        });

        successList.push({
          model_id: modelIdNum,
          location_id: locationId,
          stock: targetStock
        });
      }
    }
  }

  // Asynchronously dispatch reserved_stock_change_push (Push Code 8)
  const shop = await prisma.shop.findUnique({ where: { shopId } });
  if (shop && successList.length > 0) {
    for (const item of successList) {
      WebhookService.dispatch({
        partnerId: shop.partnerId,
        pushCode: 8,
        shopId,
        payload: {
          shop_id: Number(shopId),
          code: 8,
          timestamp: Math.floor(Date.now() / 1000),
          data: {
            item_id: Number(itemId),
            model_id: item.model_id,
            stock: item.stock
          }
        }
      }).catch(err => console.warn("[WebhookTrigger] stock change push failed:", err.message));
    }
  }

  res.json(createShopeeSuccessResponse({
    failure_list: failureList,
    success_list: successList
  }));
});

// ============================================================================
// 11. UPDATE PRICE: POST /api/v2/product/update_price
// ============================================================================
productRouter.post("/api/v2/product/update_price", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const { item_id, price_list } = req.body || {};

  if (!item_id || !Array.isArray(price_list)) {
    res.json(createShopeeErrorResponse("error_param", "item_id and price_list are required"));
    return;
  }

  const itemId = BigInt(item_id);
  const product = await prisma.product.findFirst({
    where: { itemId, shopId },
    include: { models: true }
  });

  if (!product) {
    res.json(createShopeeErrorResponse("error_param", "Item not found"));
    return;
  }

  // Price Ratio Guard:
  // If item has models, check simulated price ratio of all models after updates
  if (product.hasModel && product.models.length > 1) {
    const updatedPricesMap = new Map<number, number>();
    for (const m of product.models) {
      updatedPricesMap.set(Number(m.modelId), Number(m.originalPrice));
    }
    for (const p of price_list) {
      if (p.model_id !== undefined && p.original_price !== undefined) {
        updatedPricesMap.set(Number(p.model_id), Number(p.original_price));
      }
    }

    const allPrices = Array.from(updatedPricesMap.values()).filter(p => !isNaN(p));
    if (allPrices.length > 1) {
      const minPrice = Math.min(...allPrices);
      const maxPrice = Math.max(...allPrices);
      if (minPrice > 0 && maxPrice / minPrice > 5.0) {
        res.json(createShopeeErrorResponse("error_param", "The price ratio between variations exceeds limit"));
        return;
      }
    }
  }

  const failureList: any[] = [];
  const successList: any[] = [];

  for (const entry of price_list) {
    const modelIdNum = Number(entry.model_id || 0);
    const targetPrice = Number(entry.original_price);

    if (modelIdNum === 0) {
      await prisma.product.update({
        where: { itemId },
        data: { originalPrice: targetPrice }
      });
      successList.push({
        model_id: 0,
        original_price: targetPrice
      });
    } else {
      const model = product.models.find(m => Number(m.modelId) === modelIdNum);
      if (!model) {
        failureList.push({
          model_id: modelIdNum,
          failed_reason: "Model does not exist"
        });
      } else {
        await prisma.productModel.update({
          where: { modelId: model.modelId },
          data: { originalPrice: targetPrice }
        });
        successList.push({
          model_id: modelIdNum,
          original_price: targetPrice
        });
      }
    }
  }

  res.json(createShopeeSuccessResponse({
    failure_list: failureList,
    success_list: successList
  }));
});

// ============================================================================
// 13. UNLIST ITEM: POST /api/v2/product/unlist_item
// ============================================================================
productRouter.post("/api/v2/product/unlist_item", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);
  const { item_list } = req.body || {};

  if (!Array.isArray(item_list) || item_list.length === 0) {
    res.json(createShopeeErrorResponse("error_param", "item_list is required and must not be empty"));
    return;
  }

  if (item_list.length > 50) {
    res.json(createShopeeErrorResponse("error_param", "item_list length cannot exceed 50"));
    return;
  }

  const successList: any[] = [];
  const failureList: any[] = [];

  for (const entry of item_list) {
    const itId = Number(entry.item_id);
    const unlistBool = Boolean(entry.unlist);

    if (!itId) {
      failureList.push({
        item_id: 0,
        failed_reason: "Invalid item_id"
      });
      continue;
    }

    const product = await prisma.product.findFirst({
      where: { itemId: BigInt(itId), shopId, itemStatus: { not: "DELETED" } }
    });

    if (!product) {
      failureList.push({
        item_id: itId,
        failed_reason: "Item not found or deleted"
      });
      continue;
    }

    const newStatus = unlistBool ? "UNLIST" : "NORMAL";
    await prisma.product.update({
      where: { itemId: product.itemId },
      data: { itemStatus: newStatus }
    });

    successList.push({
      item_id: itId,
      unlist: unlistBool
    });
  }

  res.json(createShopeeSuccessResponse({
    failure_list: failureList,
    success_list: successList
  }));
});

// ============================================================================
// 14. DELETE ITEM: POST /api/v2/product/delete_item
// ============================================================================
productRouter.post("/api/v2/product/delete_item", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);
  const { item_id } = req.body || {};

  if (!item_id) {
    res.json(createShopeeErrorResponse("error_param", "item_id is required"));
    return;
  }

  const itemId = BigInt(item_id);

  // Check shop vacation mode
  const shop = await prisma.shop.findUnique({ where: { shopId } });
  if (shop?.isVacation) {
    res.json(createShopeeErrorResponse("error_holiday_on_del_item", "Shop is under vacation mode"));
    return;
  }

  const product = await prisma.product.findFirst({
    where: { itemId, shopId }
  });

  if (!product || product.itemStatus === "SELLER_DELETE" || product.itemStatus === "DELETED") {
    res.json(createShopeeErrorResponse("error_item_not_found", "Item_id is not found."));
    return;
  }

  // Soft-delete item by updating status to SELLER_DELETE (matching Shopee 90-day retention convention)
  await prisma.product.update({
    where: { itemId },
    data: { itemStatus: "SELLER_DELETE" }
  });

  res.json(createShopeeSuccessResponse({}));
});

// ============================================================================
// 15. GET COMMENT: GET /api/v2/product/get_comment
// ============================================================================
productRouter.get("/api/v2/product/get_comment", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);

  const itemIdStr = req.query.item_id as string | undefined;
  const commentIdStr = req.query.comment_id as string | undefined;
  const pageSize = Math.min(100, Math.max(1, Number(req.query.page_size || 10)));
  const cursor = req.query.cursor ? Number(req.query.cursor) : 0;

  const whereClause: any = { shopId };
  if (itemIdStr) {
    whereClause.itemId = BigInt(itemIdStr);
  }
  if (commentIdStr) {
    whereClause.commentId = BigInt(commentIdStr);
  }

  const comments = await prisma.productComment.findMany({
    where: whereClause,
    orderBy: { commentId: "desc" },
    skip: cursor,
    take: pageSize + 1
  });

  const hasMore = comments.length > pageSize;
  const pageItems = hasMore ? comments.slice(0, pageSize) : comments;

  const formattedComments = pageItems.map(c => ({
    comment_id: Number(c.commentId),
    order_sn: c.orderSn,
    item_id: Number(c.itemId),
    model_id: c.modelId ? Number(c.modelId) : 0,
    buyer_username: c.buyerUsername,
    rating_star: c.ratingStar,
    comment: c.comment,
    create_time: Math.floor(c.createdAt.getTime() / 1000),
    comment_reply: c.reply ? {
      reply: c.reply,
      reply_time: c.replyTime ? Math.floor(c.replyTime.getTime() / 1000) : null
    } : null
  }));

  res.json(createShopeeSuccessResponse({
    more: hasMore,
    next_cursor: hasMore ? String(cursor + pageSize) : "",
    item_comment_list: formattedComments
  }));
});

// ============================================================================
// 15. REPLY COMMENT: POST /api/v2/product/reply_comment
// ============================================================================
productRouter.post("/api/v2/product/reply_comment", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string;
  const shopId = BigInt(shopIdStr);
  const { comment_list } = req.body || {};

  if (!Array.isArray(comment_list) || comment_list.length === 0) {
    res.json(createShopeeErrorResponse("error_param", "comment_list is required and must not be empty"));
    return;
  }

  const resultList: any[] = [];

  for (const entry of comment_list) {
    const cId = Number(entry.comment_id);
    const replyText = String(entry.comment || "").trim();

    if (!cId || !replyText) {
      resultList.push({
        comment_id: cId || 0,
        fail_error: "error_param",
        fail_message: "comment_id and comment are required"
      });
      continue;
    }

    const commentRecord = await prisma.productComment.findFirst({
      where: { commentId: BigInt(cId), shopId }
    });

    if (!commentRecord) {
      resultList.push({
        comment_id: cId,
        fail_error: "product.error_not_exist",
        fail_message: "Comment does not exist."
      });
      continue;
    }

    if (commentRecord.reply) {
      resultList.push({
        comment_id: cId,
        fail_error: "product.duplicate_request",
        fail_message: "You have replied to this comment already."
      });
      continue;
    }

    await prisma.productComment.update({
      where: { commentId: commentRecord.commentId },
      data: {
        reply: replyText,
        replyTime: new Date()
      }
    });

    resultList.push({
      comment_id: cId,
      fail_error: "",
      fail_message: ""
    });
  }

  res.json(createShopeeSuccessResponse({
    result_list: resultList
  }));
});

