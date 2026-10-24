import { Router, Request, Response } from "express";
import multer from "multer";
import { prisma } from "../../common/prisma";
import { createShopeeSuccessResponse, createShopeeErrorResponse } from "../../common/utils/envelope";
import { WebhookService } from "../webhook/webhook.service";
import { generateShopeeAwbPdf } from "../../common/utils/pdf";
import { OrderStatus, PromotionStatus } from "@prisma/client";
import { normalizeReturnReason } from "../returns/returns.constants";
import { calculateReverseShippingFee } from "../payment/payment.router";
import { storageService } from "../../common/storage/storage.service";
import * as crypto from "crypto";

export const simulatorRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50 MB
  }
});

// ============================================================================
// 1. SHOP OVERVIEW & TOKEN STATUS
// ============================================================================
simulatorRouter.get("/api/v2/simulator/shop/overview", async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = (req.query.shop_id as string) || "727720655";
  const shopId = BigInt(shopIdStr);

  const shop = await prisma.shop.findUnique({
    where: { shopId },
    include: { partner: true }
  });

  if (!shop) {
    res.json(createShopeeErrorResponse("error_param", "Shop not found"));
    return;
  }

  const now = new Date();
  let tokenRemainingSec = 0;
  let tokenStatus = "EXPIRED";

  if (shop.accessToken && shop.accessTokenExpiresAt) {
    const diff = Math.floor((shop.accessTokenExpiresAt.getTime() - now.getTime()) / 1000);
    if (diff > 0) {
      tokenRemainingSec = diff;
      tokenStatus = "VALID";
    } else if (shop.oldAccessToken && shop.oldTokenExpiresAt && shop.oldTokenExpiresAt > now) {
      tokenRemainingSec = Math.floor((shop.oldTokenExpiresAt.getTime() - now.getTime()) / 1000);
      tokenStatus = "GRACE_PERIOD";
    }
  }

  res.json(createShopeeSuccessResponse({
    shop_id: Number(shop.shopId),
    shop_name: shop.shopName,
    region: shop.region,
    status: shop.status,
    is_vacation: shop.isVacation,
    rating: Number(shop.rating || 5.0),
    rating_count: shop.ratingCount || 0,
    partner_id: Number(shop.partnerId),
    partner_name: shop.partner.appName,
    partner_key: shop.partner.partnerKey,
    webhook_url: shop.partner.webhookUrl || "",
    access_token: shop.accessToken || "",
    refresh_token: shop.refreshToken || "",
    token_status: tokenStatus,
    token_remaining_sec: tokenRemainingSec
  }));
});

// ============================================================================
// 2. TOGGLE VACATION MODE
// ============================================================================
simulatorRouter.post("/api/v2/simulator/shop/vacation", async (req: Request, res: Response): Promise<void> => {
  const { shop_id = 727720655, is_vacation } = req.body || {};
  const shopId = BigInt(shop_id);

  const updated = await prisma.shop.update({
    where: { shopId },
    data: { isVacation: Boolean(is_vacation) }
  });

  res.json(createShopeeSuccessResponse({
    shop_id: Number(shopId),
    is_vacation: updated.isVacation
  }));
});

// ============================================================================
// 3. FORCE REFRESH TOKEN / GENERATE FRESH TOKEN
// ============================================================================
simulatorRouter.post("/api/v2/simulator/shop/refresh_token", async (req: Request, res: Response): Promise<void> => {
  const { shop_id = 727720655 } = req.body || {};
  const shopId = BigInt(shop_id);

  const shop = await prisma.shop.findUnique({ where: { shopId } });
  if (!shop) {
    res.json(createShopeeErrorResponse("error_param", "Shop not found"));
    return;
  }

  const newAccessToken = crypto.randomBytes(16).toString("hex");
  const newRefreshToken = crypto.randomBytes(16).toString("hex");
  const expireIn = 14400; // 4 hours
  const now = new Date();

  await prisma.shop.update({
    where: { shopId },
    data: {
      oldAccessToken: shop.accessToken,
      oldTokenExpiresAt: new Date(now.getTime() + 300 * 1000), // 5 min grace
      accessToken: newAccessToken,
      accessTokenExpiresAt: new Date(now.getTime() + expireIn * 1000),
      refreshToken: newRefreshToken,
      refreshTokenExpiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    }
  });

  res.json(createShopeeSuccessResponse({
    access_token: newAccessToken,
    refresh_token: newRefreshToken,
    expire_in: expireIn
  }));
});

// ============================================================================
// 4. GET ALL PRODUCTS FOR SIMULATOR UI (WITH SEARCH & FILTER)
// ============================================================================
simulatorRouter.get("/api/v2/simulator/products", async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string | undefined;
  const viewMode = req.query.view_mode as string | undefined;
  const searchQuery = (req.query.q as string | undefined)?.trim();
  const categoryIdStr = req.query.category_id as string | undefined;
  const sort = req.query.sort as string | undefined;
  const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
  const pageSize = req.query.page_size ? parseInt(req.query.page_size as string, 10) : undefined;

  const whereClause: any = { itemStatus: { not: "DELETED" } };
  if (viewMode === "buyer") {
    whereClause.itemStatus = "NORMAL";
  }
  if (shopIdStr && shopIdStr.toUpperCase() !== "ALL") {
    whereClause.shopId = BigInt(shopIdStr);
  }
  if (categoryIdStr) {
    whereClause.categoryId = BigInt(categoryIdStr);
  }
  if (searchQuery) {
    whereClause.OR = [
      { itemName: { contains: searchQuery, mode: "insensitive" } },
      { description: { contains: searchQuery, mode: "insensitive" } }
    ];
  }

  let orderBy: any = { itemId: "desc" };
  if (sort === "price_asc") {
    orderBy = { originalPrice: "asc" };
  } else if (sort === "price_desc") {
    orderBy = { originalPrice: "desc" };
  }

  const now = new Date();
  const [totalCount, products, activeDiscounts] = await Promise.all([
    prisma.product.count({ where: whereClause }),
    prisma.product.findMany({
      where: whereClause,
      include: {
        shop: true,
        category: true,
        models: true
      },
      orderBy,
      ...(page && pageSize ? { skip: (page - 1) * pageSize, take: pageSize } : {})
    }),
    prisma.discount.findMany({
      where: {
        ...(shopIdStr && shopIdStr.toUpperCase() !== "ALL" ? { shopId: BigInt(shopIdStr) } : {}),
        status: { not: "DELETED" as any },
        startTime: { lte: now },
        endTime: { gte: now }
      },
      include: {
        items: {
          include: {
            models: true
          }
        }
      }
    })
  ]);

  // Map itemId -> active discount item
  const discountItemMap = new Map<string, any>();
  for (const disc of activeDiscounts) {
    for (const it of disc.items) {
      discountItemMap.set(it.itemId.toString(), it);
    }
  }

  const mappedProducts = products.map((p: any) => {
    const discItem = discountItemMap.get(p.itemId.toString());
    let hasDiscount = false;
    let promoPrice: number | null = null;
    let discountPct: number | null = null;

    if (discItem) {
      if (p.hasModel && discItem.models && discItem.models.length > 0) {
        const mPromoPrices = discItem.models.map((m: any) => Number(m.modelPromotionPrice));
        if (mPromoPrices.length > 0) {
          hasDiscount = true;
          promoPrice = Math.min(...mPromoPrices);
        }
      } else if (discItem.itemPromotionPrice !== null) {
        hasDiscount = true;
        promoPrice = Number(discItem.itemPromotionPrice);
      }

      if (hasDiscount && promoPrice !== null && Number(p.originalPrice) > 0) {
        discountPct = Math.round((1 - (promoPrice / Number(p.originalPrice))) * 100);
      }
    }

    return {
      item_id: Number(p.itemId),
      shop_id: Number(p.shopId),
      shop_name: p.shop?.shopName || `Shop ${p.shopId}`,
      shop_rating: p.shop?.rating ? Number(p.shop.rating) : 5.0,
      is_vacation: Boolean(p.shop?.isVacation),
      item_name: p.itemName,
      item_status: p.itemStatus,
      description: p.description,
      item_sku: p.itemSku,
      gtin: p.gtin,
      video_url: p.videoUrl,
      image_ratio: p.imageRatio,
      product_condition: p.productCondition,
      is_preorder: p.isPreorder,
      preorder_days_to_ship: p.preorderDaysToShip,
      attribute_list: p.attributesJson,
      shipping_options: p.shippingOptionsJson,
      category_name: p.category?.categoryName || "General",
      original_price: Number(p.originalPrice),
      current_price: promoPrice !== null ? promoPrice : Number(p.originalPrice),
      has_discount: hasDiscount,
      promotion_price: promoPrice,
      discount_percentage: discountPct,
      currency: p.currency,
      weight: Number(p.weight || 0.5),
      dimensions: p.dimensionsJson,
      has_model: p.hasModel,
      images: p.imagesJson,
      tier_variation: p.tierVariationJson,
      models: (p.models || []).map((m: any) => {
        let mPromoPrice: number | null = null;
        if (discItem && discItem.models) {
          const mPromo = discItem.models.find((dim: any) => dim.modelId.toString() === m.modelId.toString());
          if (mPromo) {
            mPromoPrice = Number(mPromo.modelPromotionPrice);
          }
        }
        const mCurrentPrice = mPromoPrice !== null ? mPromoPrice : Number(m.originalPrice);
        return {
          model_id: Number(m.modelId),
          model_name: m.modelName,
          model_sku: m.modelSku,
          tier_index: m.tierIndex,
          original_price: Number(m.originalPrice),
          current_price: mCurrentPrice,
          promotion_price: mPromoPrice,
          seller_stock: m.sellerStock
        };
      })
    };
  });

  res.json(createShopeeSuccessResponse({
    products: mappedProducts,
    ...(page && pageSize ? { total: totalCount, page, page_size: pageSize } : {})
  }));
});

// ============================================================================
// 4B. GET PRODUCT DETAIL (RICH VIEW FOR SHOPIZ PRODUCT PAGE)
// ============================================================================
simulatorRouter.get("/api/v2/simulator/product/detail", async (req: Request, res: Response): Promise<void> => {
  try {
    const itemIdStr = req.query.item_id as string;
    if (!itemIdStr) {
      res.json(createShopeeErrorResponse("error_param", "Missing item_id"));
      return;
    }

    const itemId = BigInt(itemIdStr);
    const p = await prisma.product.findUnique({
      where: { itemId },
      include: {
        shop: true,
        category: true,
        models: { orderBy: { modelId: "asc" } },
        comments: {
          orderBy: { createdAt: "desc" },
          take: 10
        }
      }
    });

    if (!p) {
      res.json(createShopeeErrorResponse("error_not_found", "Product not found"));
      return;
    }

    const now = new Date();
    const activeDiscount = await prisma.discount.findFirst({
      where: {
        shopId: p.shopId,
        status: { not: "DELETED" as any },
        startTime: { lte: now },
        endTime: { gte: now },
        items: { some: { itemId: p.itemId } }
      },
      include: {
        items: {
          where: { itemId: p.itemId },
          include: { models: true }
        }
      }
    });

    const discItem = activeDiscount?.items[0];
    let hasDiscount = false;
    let promoPrice: number | null = null;
    let discountPct: number | null = null;

    if (discItem) {
      if (p.hasModel && discItem.models && discItem.models.length > 0) {
        const mPromoPrices = discItem.models.map((m: any) => Number(m.modelPromotionPrice));
        if (mPromoPrices.length > 0) {
          hasDiscount = true;
          promoPrice = Math.min(...mPromoPrices);
        }
      } else if (discItem.itemPromotionPrice !== null) {
        hasDiscount = true;
        promoPrice = Number(discItem.itemPromotionPrice);
      }
      if (hasDiscount && promoPrice !== null && Number(p.originalPrice) > 0) {
        discountPct = Math.round((1 - (promoPrice / Number(p.originalPrice))) * 100);
      }
    }

    const totalComments = await prisma.productComment.count({ where: { itemId: p.itemId } });
    const allComments = await prisma.productComment.findMany({
      where: { itemId: p.itemId },
      select: { ratingStar: true }
    });
    const avgRating = allComments.length > 0
      ? allComments.reduce((acc, c) => acc + c.ratingStar, 0) / allComments.length
      : 5.0;

    res.json(createShopeeSuccessResponse({
      product: {
        item_id: Number(p.itemId),
        item_name: p.itemName,
        item_status: p.itemStatus,
        description: p.description,
        original_price: Number(p.originalPrice),
        current_price: promoPrice !== null ? promoPrice : Number(p.originalPrice),
        promotion_price: promoPrice,
        discount_percentage: discountPct,
        has_discount: hasDiscount,
        currency: p.currency,
        weight: Number(p.weight || 0.5),
        dimensions: p.dimensionsJson,
        item_sku: p.itemSku,
        gtin: p.gtin,
        video_url: p.videoUrl,
        image_ratio: p.imageRatio,
        product_condition: p.productCondition,
        is_preorder: p.isPreorder,
        preorder_days_to_ship: p.preorderDaysToShip,
        attribute_list: p.attributesJson,
        shipping_options: p.shippingOptionsJson,
        images: p.imagesJson,
        has_model: p.hasModel,
        tier_variation: p.tierVariationJson,
        category: {
          category_id: Number(p.categoryId),
          category_name: p.category?.categoryName || "General"
        },
        seller: {
          shop_id: Number(p.shopId),
          shop_name: p.shop?.shopName,
          rating: Number(p.shop?.rating || 5.0),
          rating_count: p.shop?.ratingCount || 0,
          is_vacation: Boolean(p.shop?.isVacation),
          response_rate: "98%",
          joined: "2 years ago"
        },
        models: (p.models || []).map((m: any) => {
          let mPromoPrice: number | null = null;
          if (discItem && discItem.models) {
            const mPromo = discItem.models.find((dim: any) => dim.modelId.toString() === m.modelId.toString());
            if (mPromo) {
              mPromoPrice = Number(mPromo.modelPromotionPrice);
            }
          }
          return {
            model_id: Number(m.modelId),
            model_name: m.modelName,
            model_sku: m.modelSku,
            tier_index: m.tierIndex,
            original_price: Number(m.originalPrice),
            current_price: mPromoPrice !== null ? mPromoPrice : Number(m.originalPrice),
            promotion_price: mPromoPrice,
            seller_stock: m.sellerStock
          };
        }),
        reviews: {
          average_rating: Math.round(avgRating * 10) / 10,
          rating_count: totalComments,
          items: p.comments.map((c) => ({
            comment_id: Number(c.commentId),
            buyer_username: c.buyerUsername,
            rating_star: c.ratingStar,
            comment: c.comment,
            reply: c.reply,
            reply_time: c.replyTime,
            created_at: c.createdAt
          }))
        }
      }
    }));
  } catch (error: any) {
    res.json(createShopeeErrorResponse("error_server", error.message || "Failed to retrieve product details"));
  }
});

// Shopiz seller editor update endpoint. Kept in Layer B; official signed endpoints remain unchanged.
simulatorRouter.post("/api/v2/simulator/product/update", async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body || {};
    if (!body.item_id || !body.shop_id || !String(body.item_name || "").trim()) {
      res.json(createShopeeErrorResponse("error_param", "item_id, shop_id, and item_name are required"));
      return;
    }
    const itemId = BigInt(body.item_id);
    const shopId = BigInt(body.shop_id);
    const product = await prisma.product.findFirst({
      where: { itemId, shopId },
      include: { shop: true, models: { orderBy: { modelId: "asc" }, include: { _count: { select: { orderItems: true, discountItemModels: true } } } } }
    });
    if (!product) {
      res.json(createShopeeErrorResponse("error_not_found", "Product not found for this shop"));
      return;
    }
    if (String(body.item_name).trim().length > 120) {
      res.json(createShopeeErrorResponse("error_param", "Product name must not exceed 120 characters"));
      return;
    }
    if (body.product_workflow && product.shop.isVacation && body.item_status === "NORMAL") {
      res.json(createShopeeErrorResponse("error_business", "Products can only be saved unlisted while the shop is on holiday"));
      return;
    }
    if (body.item_status && !["NORMAL", "UNLIST"].includes(String(body.item_status))) {
      res.json(createShopeeErrorResponse("error_param", "item_status must be NORMAL or UNLIST"));
      return;
    }
    const categoryId = BigInt(body.category_id);
    const category = await prisma.category.findUnique({ where: { categoryId }, include: { attributes: true } });
    if (!category || category.hasChildren) {
      res.json(createShopeeErrorResponse("error_param", "Select a valid leaf category"));
      return;
    }
    const attributes = Array.isArray(body.attribute_list) ? body.attribute_list : [];
    for (const attribute of category.attributes.filter((entry) => entry.isMandatory)) {
      if (!attributes.some((value: any) => Number(value.attribute_id) === Number(attribute.attributeId) && Array.isArray(value.attribute_value_list) && value.attribute_value_list.length)) {
        res.json(createShopeeErrorResponse("error_param", `Attribute is mandatory: ${attribute.name}`));
        return;
      }
    }
    if (!Array.isArray(body.shipping_option_ids) || !body.shipping_option_ids.length) {
      res.json(createShopeeErrorResponse("error_param", "Select at least one shipping option"));
      return;
    }
    const weightGrams = Number(body.package_weight_grams);
    const price = Number(body.original_price);
    if (!Number.isFinite(weightGrams) || weightGrams <= 0 || !Number.isFinite(price) || price <= 0 || !String(body.description || "").trim()) {
      res.json(createShopeeErrorResponse("error_param", "Description, positive package weight, and price are required"));
      return;
    }
    if (!Array.isArray(body.images) || body.images.length < 1 || body.images.length > 9) {
      res.json(createShopeeErrorResponse("error_param", "Upload between 1 and 9 product images"));
      return;
    }
    const optionIds = body.shipping_option_ids.map(String);
    const shippingOptions = await prisma.productShippingOption.findMany({ where: { optionId: { in: optionIds }, enabled: true } });
    if (shippingOptions.length !== new Set(optionIds).size || shippingOptions.some((option) => option.maximumWeightGram !== null && weightGrams > option.maximumWeightGram)) {
      res.json(createShopeeErrorResponse("error_param", "Selected shipping options are unavailable or exceed their weight limit"));
      return;
    }
    const tiers = Array.isArray(body.tier_variation) ? body.tier_variation : [];
    const models = Array.isArray(body.models) ? body.models : [];
    if (tiers.length > 2 || tiers.some((tier: any) => !String(tier.name || "").trim() || !Array.isArray(tier.option_list) || !tier.option_list.length)) {
      res.json(createShopeeErrorResponse("error_param", "Products support at most 2 valid variation groups"));
      return;
    }
    if (product.models.some((model: any, index: number) => index >= models.length && (model._count.orderItems || model._count.discountItemModels))) {
      res.json(createShopeeErrorResponse("error_business", "A variation with order or promotion history cannot be removed"));
      return;
    }
    if (product.models.some((model: any, index: number) =>
      (model._count.orderItems || model._count.discountItemModels) && models[index] && String(models[index].model_name || "Standard") !== model.modelName
    )) {
      res.json(createShopeeErrorResponse("error_business", "A variation with order or promotion history cannot be renamed or reordered"));
      return;
    }
    const imageUrls = body.images.map((image: any) => typeof image === "string" ? image : image.url).filter(Boolean);
    const imagesJson = { image_id_list: imageUrls.map((_: string, index: number) => `product-${itemId}-${index}`), image_url_list: imageUrls };
    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.product.update({ where: { itemId }, data: {
        categoryId, itemName: String(body.item_name).trim(), description: body.description,
        gtin: body.gtin || null, videoUrl: body.video_url || null, imageRatio: body.image_ratio || "1:1",
        productCondition: body.product_condition || "NEW", isPreorder: Boolean(body.is_preorder),
        preorderDaysToShip: body.is_preorder ? Number(body.preorder_days_to_ship) : null,
        ...(body.item_status ? { itemStatus: body.item_status } : {}), originalPrice: price,
        weight: weightGrams / 1000, dimensionsJson: body.dimension || {}, attributesJson: attributes,
        shippingOptionsJson: shippingOptions.map((option) => ({ option_id: option.optionId, option_name: option.optionName, option_group: option.optionGroup, maximum_weight_gram: option.maximumWeightGram })),
        itemSku: body.item_sku || null, hasModel: tiers.length > 0, tierVariationJson: tiers, imagesJson
      } });
      for (let index = 0; index < models.length; index += 1) {
        const value = models[index];
        const existing = product.models[index];
        const data = { modelName: value.model_name || "Standard", modelSku: value.model_sku || null, tierIndex: value.tier_index || [0], originalPrice: Number(value.original_price || price), sellerStock: Number(value.seller_stock || 0) };
        if (existing) await tx.productModel.update({ where: { modelId: existing.modelId }, data });
        else await tx.productModel.create({ data: { ...data, itemId } });
      }
      for (const removed of product.models.slice(models.length)) await tx.productModel.delete({ where: { modelId: removed.modelId } });
      return result;
    });
    res.json(createShopeeSuccessResponse({ item_id: Number(updated.itemId), item_name: updated.itemName, item_status: updated.itemStatus }));
  } catch (error: any) {
    res.json(createShopeeErrorResponse("error_server", error.message || "Failed to update product"));
  }
});

// ============================================================================
// 4C. GET CATEGORIES FOR SHOPIZ DISCOVERY
// ============================================================================
simulatorRouter.get("/api/v2/simulator/categories", async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        attributes: true,
        _count: {
          select: { products: true }
        }
      },
      orderBy: { categoryId: "asc" }
    });

    res.json(createShopeeSuccessResponse({
      categories: categories.map((c) => ({
        category_id: Number(c.categoryId),
        parent_category_id: Number(c.parentId),
        category_name: c.categoryName,
        has_children: c.hasChildren,
        product_count: c._count.products,
        attributes: c.attributes.map((a) => ({
          attribute_id: Number(a.attributeId),
          name: a.name,
          is_mandatory: a.isMandatory,
          input_type: a.inputType,
          values: a.valueListJson
        }))
      }))
    }));
  } catch (error: any) {
    res.json(createShopeeErrorResponse("error_server", error.message || "Failed to retrieve categories"));
  }
});

// ============================================================================
// 4C. PRODUCT CREATION CONFIGURATION FOR SHOPIZ
// ============================================================================
simulatorRouter.get("/api/v2/simulator/product-creation/config", async (req: Request, res: Response): Promise<void> => {
  try {
    const shopIdStr = req.query.shop_id as string;
    if (!shopIdStr || !/^\d+$/.test(shopIdStr)) {
      res.json(createShopeeErrorResponse("error_param", "A valid shop_id is required"));
      return;
    }

    const shop = await prisma.shop.findUnique({ where: { shopId: BigInt(shopIdStr) } });
    if (!shop) {
      res.json(createShopeeErrorResponse("error_param", "Shop not found"));
      return;
    }

    const shippingOptions = await prisma.productShippingOption.findMany({
      where: { enabled: true },
      orderBy: { sortOrder: "asc" }
    });

    res.json(createShopeeSuccessResponse({
      shop_id: Number(shop.shopId),
      is_vacation: shop.isVacation,
      shipping_options: shippingOptions.map((option) => ({
        option_id: option.optionId,
        option_name: option.optionName,
        option_group: option.optionGroup,
        partner_label: option.partnerLabel,
        maximum_weight_gram: option.maximumWeightGram
      })),
      product_conditions: [{ value: "NEW", label: "Mới" }]
    }));
  } catch (error: any) {
    res.json(createShopeeErrorResponse("error_server", error.message || "Failed to retrieve product creation configuration"));
  }
});

// ============================================================================
// 4D. GET SHOP STOREFRONT DETAILS
// ============================================================================
simulatorRouter.get("/api/v2/simulator/shop/detail", async (req: Request, res: Response): Promise<void> => {
  try {
    const shopIdStr = req.query.shop_id as string;
    if (!shopIdStr) {
      res.json(createShopeeErrorResponse("error_param", "Missing shop_id"));
      return;
    }

    const shopId = BigInt(shopIdStr);
    const shop = await prisma.shop.findUnique({
      where: { shopId },
      include: {
        products: {
          where: { itemStatus: "NORMAL" },
          include: { models: true },
          take: 20
        }
      }
    });

    if (!shop) {
      res.json(createShopeeErrorResponse("error_not_found", "Shop not found"));
      return;
    }

    // Dynamic calculations from DB
    const now = new Date();
    const diffMs = Math.max(0, Date.now() - new Date(shop.createdAt).getTime());
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    let joined = "Recently";
    if (diffDays >= 730) {
      joined = `${Math.floor(diffDays / 365)} years ago`;
    } else if (diffDays >= 365) {
      joined = "1 year ago";
    } else if (diffDays >= 60) {
      joined = `${Math.floor(diffDays / 30)} months ago`;
    } else if (diffDays >= 30) {
      joined = "1 month ago";
    } else if (diffDays > 1) {
      joined = `${diffDays} days ago`;
    } else if (diffDays === 1) {
      joined = "1 day ago";
    } else {
      joined = "Today";
    }

    // Fetch active vouchers and promotional campaigns for the shop
    const [activeVouchers, activeDiscounts] = await Promise.all([
      prisma.voucher.findMany({
        where: {
          shopId,
          status: "ONGOING",
          startTime: { lte: now },
          endTime: { gte: now }
        },
        orderBy: { createdAt: "desc" },
        take: 6
      }),
      prisma.discount.findMany({
        where: {
          shopId,
          status: "ONGOING",
          startTime: { lte: now },
          endTime: { gte: now }
        },
        take: 5
      })
    ]);

    const vouchers = activeVouchers.map((v) => ({
      voucher_id: Number(v.voucherId),
      code: v.voucherCode,
      name: v.voucherName,
      type: v.percentage ? "percent" : "amount",
      percent: v.percentage || 0,
      amount: v.discountAmount ? Number(v.discountAmount) : 0,
      minimum: Number(v.minBasketPrice || 0),
      maxDiscount: v.maxPrice ? Number(v.maxPrice) : null,
      start_time: Math.floor(v.startTime.getTime() / 1000),
      end_time: Math.floor(v.endTime.getTime() / 1000),
      expiresAt: v.endTime.toISOString().split("T")[0]
    }));

    res.json(createShopeeSuccessResponse({
      shop: {
        shop_id: Number(shop.shopId),
        shop_name: shop.shopName,
        region: shop.region,
        status: shop.status,
        is_vacation: shop.isVacation,
        rating: Number(shop.rating || 5.0),
        rating_count: shop.ratingCount || 0,
        followers: Number(shop.shopId) === 727720655 ? 12800 : (Number(shop.shopId) % 15000 + 5000),
        response_rate: "98%",
        response_time: "Within a few hours",
        joined,
        tagline: "Official Flagship Store",
        story: `${shop.shopName} provides authentic, premium merchandise with full manufacturer warranty and instant Shopee delivery.`,
        has_campaign: vouchers.length > 0 || activeDiscounts.length > 0,
        vouchers,
        products: shop.products.map((p) => ({
          item_id: Number(p.itemId),
          item_name: p.itemName,
          original_price: Number(p.originalPrice),
          current_price: Number(p.originalPrice),
          images: p.imagesJson,
          seller_stock: p.models.reduce((sum, m) => sum + m.sellerStock, 0)
        }))
      }
    }));
  } catch (error: any) {
    res.json(createShopeeErrorResponse("error_server", error.message || "Failed to retrieve shop details"));
  }
});

// ============================================================================
// 5. QUICK UPDATE STOCK
// ============================================================================
simulatorRouter.post("/api/v2/simulator/product/quick_update_stock", async (req: Request, res: Response): Promise<void> => {
  const { model_id, item_id, stock } = req.body || {};

  if (!model_id || stock === undefined) {
    res.json(createShopeeErrorResponse("error_param", "model_id and stock are required"));
    return;
  }

  const modelId = BigInt(model_id);
  const updatedModel = await prisma.productModel.update({
    where: { modelId },
    data: { sellerStock: Number(stock) },
    include: { product: true }
  });

  // Asynchronously dispatch reserved_stock_change_push (Code 8)
  const shop = await prisma.shop.findUnique({ where: { shopId: updatedModel.product.shopId } });
  if (shop) {
    WebhookService.dispatch({
      partnerId: shop.partnerId,
      pushCode: 8,
      shopId: shop.shopId,
      payload: {
        shop_id: Number(shop.shopId),
        code: 8,
        timestamp: Math.floor(Date.now() / 1000),
        data: {
          item_id: Number(updatedModel.itemId),
          model_id: Number(updatedModel.modelId),
          stock: Number(stock)
        }
      }
    }).catch(err => console.warn("[Simulator] Stock push failed:", err.message));
  }

  res.json(createShopeeSuccessResponse({
    model_id: Number(updatedModel.modelId),
    seller_stock: updatedModel.sellerStock
  }));
});

// ============================================================================
// 6. GET ALL ORDERS FOR SIMULATOR UI
// ============================================================================
simulatorRouter.get("/api/v2/simulator/orders", async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = req.query.shop_id as string | undefined;
  const buyerIdStr = req.query.buyer_id as string | undefined;
  const statusFilter = req.query.status as string | undefined;

  const whereClause: any = {};
  if (shopIdStr && shopIdStr.toUpperCase() !== "ALL") {
    whereClause.shopId = BigInt(shopIdStr);
  }
  if (buyerIdStr && buyerIdStr.toUpperCase() !== "ALL") {
    whereClause.buyerUserId = BigInt(buyerIdStr);
  }
  if (statusFilter && statusFilter.toUpperCase() !== "ALL") {
    whereClause.orderStatus = statusFilter as OrderStatus;
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    include: {
      shop: true,
      items: true,
      packages: true,
      comments: true,
      returns: true
    },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  res.json(createShopeeSuccessResponse({
    orders: orders.map((o: any) => ({
      order_sn: o.orderSn,
      shop_id: Number(o.shopId),
      shop_name: o.shop?.shopName || `Shop ${o.shopId}`,
      buyer_user_id: Number(o.buyerUserId),
      buyer_username: o.buyerUsername,
      order_status: o.orderStatus,
      total_amount: Number(o.totalAmount),
      voucher_from_seller: Number(o.voucherFromSeller || 0),
      voucher_from_shopee: Number(o.voucherFromShopee || 0),
      buyer_paid_shipping_fee: Number(o.buyerPaidShippingFee || 0),
      actual_shipping_fee: Number(o.actualShippingFee || 0),
      channel_id: Number(o.channelId),
      currency: o.currency,
      shipping_carrier: o.shippingCarrier,
      payment_method: o.paymentMethod,
      recipient_name: o.recipientName,
      recipient_phone: o.recipientPhone,
      recipient_address: `${o.recipientAddress}, ${o.recipientDistrict}, ${o.recipientCity}`,
      cancel_by: o.cancelBy,
      cancel_reason: o.cancelReason,
      ship_by_date: o.shipByDate ? Math.floor(o.shipByDate.getTime() / 1000) : null,
      pay_time: o.payTime ? Math.floor(o.payTime.getTime() / 1000) : null,
      create_time: Math.floor(o.createdAt.getTime() / 1000),
      created_at: o.createdAt.toISOString(),
      has_reviewed: (o.comments || []).length > 0 && ((o.items || []).length === 0 || (o.items || []).every((item: any) => (o.comments || []).some((c: any) => c.itemId === item.itemId))),
      reviewed_item_ids: (o.comments || []).map((c: any) => Number(c.itemId)),
      has_return: (o.returns || []).length > 0,
      has_active_return: (o.returns || []).some((r: any) => ["REQUESTED", "JUDGING", "PROCESSING", "SELLER_DISPUTE"].includes(r.status)),
      has_accepted_return: (o.returns || []).some((r: any) => r.status === "ACCEPTED"),
      return_status: (o.returns || [])[0]?.status || null,
      return_sn: (o.returns || [])[0]?.returnSn || null,
      returns: (o.returns || []).map((r: any) => ({
        return_sn: r.returnSn,
        status: r.status,
        validation_type: r.validationType,
        solution: r.solution,
        refund_amount: Number(r.refundAmount),
        reason: r.reason,
        text_reason: r.textReason || "",
        offer_amount: r.offerAmount ? Number(r.offerAmount) : null,
        negotiation_status: r.negotiationStatus || "TERMINATED",
        created_at: r.createdAt.toISOString()
      })),
      items: (o.items || []).map((i: any) => ({
        order_item_id: Number(i.orderItemId),
        item_id: Number(i.itemId),
        item_name: i.itemName,
        model_name: i.modelName,
        item_price: Number(i.itemPrice),
        quantity: i.quantityPurchased
      })),
      packages: (o.packages || []).map((p: any) => ({
        package_number: p.packageNumber,
        tracking_number: p.trackingNumber,
        logistics_status: p.logisticsStatus,
        document_status: p.documentStatus
      }))
    }))
  }));
});

// ============================================================================
// 7. BUYER PAY ORDER (UNPAID -> READY_TO_SHIP)
// ============================================================================
simulatorRouter.post("/api/v2/simulator/order/pay", async (req: Request, res: Response): Promise<void> => {
  const { order_sn } = req.body || {};

  if (!order_sn) {
    res.json(createShopeeErrorResponse("error_param", "order_sn is required"));
    return;
  }

  const order = await prisma.order.findUnique({
    where: { orderSn: order_sn },
    include: { shop: true }
  });

  if (!order) {
    res.json(createShopeeErrorResponse("error_param", "Order not found"));
    return;
  }

  const now = new Date();
  const updated = await prisma.order.update({
    where: { orderSn: order_sn },
    data: {
      orderStatus: OrderStatus.READY_TO_SHIP,
      updatedAt: now
    }
  });

  // Dispatches order_status_push (Code 3)
  WebhookService.dispatch({
    partnerId: order.shop.partnerId,
    pushCode: 3,
    shopId: order.shopId,
    ordersn: order_sn,
    payload: {
      shop_id: Number(order.shopId),
      code: 3,
      timestamp: Math.floor(now.getTime() / 1000),
      data: {
        ordersn: order_sn,
        status: "READY_TO_SHIP",
        update_time: Math.floor(now.getTime() / 1000)
      }
    }
  }).catch(err => console.warn("[Simulator] Pay order push failed:", err.message));

  res.json(createShopeeSuccessResponse({
    order_sn,
    order_status: updated.orderStatus
  }));
});

// ============================================================================
// 8. SIMULATOR SHIP ORDER (READY_TO_SHIP -> PROCESSED + TRACKING NO)
// ============================================================================
simulatorRouter.post("/api/v2/simulator/order/ship", async (req: Request, res: Response): Promise<void> => {
  const { order_sn } = req.body || {};

  if (!order_sn) {
    res.json(createShopeeErrorResponse("error_param", "order_sn is required"));
    return;
  }

  const order = await prisma.order.findUnique({
    where: { orderSn: order_sn },
    include: { shop: true, packages: true }
  });

  if (!order) {
    res.json(createShopeeErrorResponse("error_param", "Order not found"));
    return;
  }

  const randomSuffix = Math.floor(100000000 + Math.random() * 900000000);
  const trackingNumber = `SPXVN${randomSuffix}`;
  const now = new Date();

  // Update order status
  await prisma.order.update({
    where: { orderSn: order_sn },
    data: { orderStatus: OrderStatus.PROCESSED, updatedAt: now }
  });

  // Update packages
  if (order.packages.length > 0) {
    for (const pkg of order.packages) {
      await prisma.orderPackage.update({
        where: { packageNumber: pkg.packageNumber },
        data: {
          trackingNumber,
          logisticsStatus: "LOGISTICS_REQUEST_CREATED",
          shippingType: "pickup"
        }
      });
    }
  }

  // Dispatches Code 3 (order_status_push) and Code 4 (order_trackingno_push)
  WebhookService.dispatch({
    partnerId: order.shop.partnerId,
    pushCode: 3,
    shopId: order.shopId,
    ordersn: order_sn,
    payload: {
      shop_id: Number(order.shopId),
      code: 3,
      timestamp: Math.floor(now.getTime() / 1000),
      data: {
        ordersn: order_sn,
        status: "PROCESSED",
        update_time: Math.floor(now.getTime() / 1000)
      }
    }
  }).catch(err => console.warn("[Simulator] Ship status push failed:", err.message));

  WebhookService.dispatch({
    partnerId: order.shop.partnerId,
    pushCode: 4,
    shopId: order.shopId,
    ordersn: order_sn,
    payload: {
      shop_id: Number(order.shopId),
      code: 4,
      timestamp: Math.floor(now.getTime() / 1000),
      data: {
        ordersn: order_sn,
        tracking_no: trackingNumber
      }
    }
  }).catch(err => console.warn("[Simulator] Tracking push failed:", err.message));

  res.json(createShopeeSuccessResponse({
    order_sn,
    order_status: "PROCESSED",
    tracking_number: trackingNumber
  }));
});

// ============================================================================
// 9. SIMULATOR GENERATE AWB DOCUMENT
// ============================================================================
simulatorRouter.post("/api/v2/simulator/order/generate_awb", async (req: Request, res: Response): Promise<void> => {
  const { order_sn } = req.body || {};

  if (!order_sn) {
    res.json(createShopeeErrorResponse("error_param", "order_sn is required"));
    return;
  }

  const order = await prisma.order.findUnique({
    where: { orderSn: order_sn },
    include: { shop: true, packages: true }
  });

  if (!order) {
    res.json(createShopeeErrorResponse("error_param", "Order not found"));
    return;
  }

  for (const pkg of order.packages) {
    await prisma.orderPackage.update({
      where: { packageNumber: pkg.packageNumber },
      data: { documentStatus: "READY" }
    });
  }

  // Dispatch Code 15
  WebhookService.dispatch({
    partnerId: order.shop.partnerId,
    pushCode: 15,
    shopId: order.shopId,
    ordersn: order_sn,
    payload: {
      shop_id: Number(order.shopId),
      code: 15,
      timestamp: Math.floor(Date.now() / 1000),
      data: {
        ordersn: order_sn,
        status: "READY"
      }
    }
  }).catch(err => console.warn("[Simulator] AWB push failed:", err.message));

  res.json(createShopeeSuccessResponse({
    order_sn,
    document_status: "READY"
  }));
});

// ============================================================================
// 10. SIMULATOR DIRECT AWB PDF DOWNLOAD
// ============================================================================
simulatorRouter.get("/api/v2/simulator/order/download_awb", async (req: Request, res: Response): Promise<void> => {
  const orderSn = req.query.order_sn as string;

  if (!orderSn) {
    res.status(400).send("order_sn is required");
    return;
  }

  const order = await prisma.order.findUnique({
    where: { orderSn },
    include: {
      items: true,
      packages: true,
      shop: true
    }
  });

  if (!order) {
    res.status(404).send("Order not found");
    return;
  }

  const trackingNumber = order.packages[0]?.trackingNumber || `SPXVN${Date.now()}`;

  const pdfBuffer = generateShopeeAwbPdf({
    orderSn: order.orderSn,
    trackingNumber,
    shippingCarrier: order.shippingCarrier || "Shopee Xpress",
    recipientName: order.recipientName,
    recipientAddress: `${order.recipientAddress}, ${order.recipientDistrict}, ${order.recipientCity}`
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="AWB_${orderSn}.pdf"`);
  res.setHeader("Content-Length", pdfBuffer.length);
  res.send(pdfBuffer);
});

// ============================================================================
// 11. LIST ALL REGISTERED SHOPS
// ============================================================================
simulatorRouter.get("/api/v2/simulator/shops", async (_req: Request, res: Response): Promise<void> => {
  const shops = await prisma.shop.findMany({
    include: {
      _count: {
        select: { products: true, orders: true }
      }
    },
    orderBy: { shopId: "asc" }
  });

  res.json(createShopeeSuccessResponse({
    shops: shops.map(s => ({
      shop_id: Number(s.shopId),
      shop_name: s.shopName,
      region: s.region,
      status: s.status,
      is_vacation: s.isVacation,
      products_count: s._count.products,
      orders_count: s._count.orders
    }))
  }));
});

// ============================================================================
// 12. LIST MOCK BUYER PROFILES
// ============================================================================
simulatorRouter.get("/api/v2/simulator/buyers", (_req: Request, res: Response): void => {
  const buyers = [
    {
      buyer_id: 1001,
      name: "Nguyen Van A",
      phone: "+84901234567",
      region: "VN",
      city: "Ho Chi Minh City",
      district: "District 1",
      address: "123 Le Duan Street"
    },
    {
      buyer_id: 1002,
      name: "Tran Thi B",
      phone: "+84988776655",
      region: "VN",
      city: "Hanoi",
      district: "Hoan Kiem District",
      address: "456 Trang Tien Street"
    },
    {
      buyer_id: 1003,
      name: "Le Van C",
      phone: "+84912345678",
      region: "VN",
      city: "Da Nang",
      district: "Hai Chau District",
      address: "789 Tran Phu Street"
    }
  ];

  res.json(createShopeeSuccessResponse({ buyers }));
});

// ============================================================================
// 13. SELLER ADDS PRODUCT (SHOP INVENTORY MANAGEMENT)
// ============================================================================
simulatorRouter.post("/api/v2/simulator/product/create", upload.any(), async (req: Request, res: Response): Promise<void> => {
  const {
    shop_id = 727720655,
    category_id = 100001,
    item_name,
    description = "",
    original_price = 100000,
    weight = 0.5,
    item_sku,
    tier_variation,
    models = [],
    images = [],
    image_url_list = [],
    product_workflow = false,
    package_weight_grams,
    dimension,
    attribute_list = [],
    gtin,
    video_url,
    image_ratio = "1:1",
    product_condition = "NEW",
    is_preorder = false,
    preorder_days_to_ship,
    shipping_option_ids = [],
    item_status = "NORMAL"
  } = req.body || {};

  if (!item_name) {
    res.json(createShopeeErrorResponse("error_param", "item_name is required"));
    return;
  }

  if (product_workflow && (package_weight_grams === undefined || package_weight_grams === null)) {
    res.json(createShopeeErrorResponse("error_param", "package_weight_grams is required"));
    return;
  }

  const shopId = BigInt(shop_id);
  const catId = BigInt(category_id);

  let parsedAttributes = attribute_list;
  if (typeof parsedAttributes === "string") {
    try { parsedAttributes = JSON.parse(parsedAttributes); } catch { parsedAttributes = []; }
  }

  let parsedShippingOptionIds = shipping_option_ids;
  if (typeof parsedShippingOptionIds === "string") {
    try { parsedShippingOptionIds = JSON.parse(parsedShippingOptionIds); } catch { parsedShippingOptionIds = []; }
  }

  let packageWeightKg = Number(weight);
  if (package_weight_grams !== undefined) {
    const weightGrams = Number(package_weight_grams);
    if (!Number.isFinite(weightGrams) || weightGrams <= 0) {
      res.json(createShopeeErrorResponse("error_param", "Package weight must be greater than 0 grams"));
      return;
    }
    packageWeightKg = weightGrams / 1000;
  }

  let selectedShippingOptions: any[] = [];
  if (product_workflow) {
    const shop = await prisma.shop.findUnique({ where: { shopId } });
    if (!shop) {
      res.json(createShopeeErrorResponse("error_param", "Shop not found"));
      return;
    }
    if (item_status !== "NORMAL" && item_status !== "UNLIST") {
      res.json(createShopeeErrorResponse("error_param", "item_status must be NORMAL or UNLIST"));
      return;
    }
    if (shop.isVacation && item_status !== "UNLIST") {
      res.json(createShopeeErrorResponse("error_business", "Products can only be saved unlisted while the shop is on holiday"));
      return;
    }
    if (String(item_name).trim().length === 0 || String(item_name).length > 120) {
      res.json(createShopeeErrorResponse("error_param", "Product name is required and must not exceed 120 characters"));
      return;
    }
    if (!Array.isArray(parsedShippingOptionIds) || parsedShippingOptionIds.length === 0) {
      res.json(createShopeeErrorResponse("error_param", "Select at least one shipping option"));
      return;
    }
    selectedShippingOptions = await prisma.productShippingOption.findMany({
      where: { optionId: { in: parsedShippingOptionIds.map(String) }, enabled: true }
    });
    if (selectedShippingOptions.length !== new Set(parsedShippingOptionIds.map(String)).size) {
      res.json(createShopeeErrorResponse("error_param", "One or more selected shipping options are unavailable"));
      return;
    }
    if (selectedShippingOptions.some((option) => option.maximumWeightGram !== null && Number(package_weight_grams) > option.maximumWeightGram)) {
      res.json(createShopeeErrorResponse("error_param", "Package weight exceeds the selected shipping option limit"));
      return;
    }
    if (!Array.isArray(parsedAttributes)) {
      res.json(createShopeeErrorResponse("error_param", "Attributes must be an array"));
      return;
    }
    if (Number(original_price) <= 0 || !Number.isFinite(Number(original_price))) {
      res.json(createShopeeErrorResponse("error_param", "Product price must be greater than 0"));
      return;
    }
    if (!["NEW"].includes(String(product_condition))) {
      res.json(createShopeeErrorResponse("error_param", "Unsupported product condition"));
      return;
    }
    if (image_ratio !== "1:1" && image_ratio !== "3:4") {
      res.json(createShopeeErrorResponse("error_param", "image_ratio must be 1:1 or 3:4"));
      return;
    }
    if (Boolean(is_preorder) && (!Number.isInteger(Number(preorder_days_to_ship)) || Number(preorder_days_to_ship) < 5 || Number(preorder_days_to_ship) > 15)) {
      res.json(createShopeeErrorResponse("error_param", "preorder_days_to_ship must be an integer from 5 to 15"));
      return;
    }
    if (!Boolean(is_preorder) && preorder_days_to_ship != null) {
      res.json(createShopeeErrorResponse("error_param", "preorder_days_to_ship is only allowed for pre-order products"));
      return;
    }
    if (!String(description).trim()) {
      res.json(createShopeeErrorResponse("error_param", "Product description is required"));
      return;
    }
    const category = await prisma.category.findUnique({
      where: { categoryId: catId },
      include: { attributes: true }
    });
    if (!category || category.hasChildren) {
      res.json(createShopeeErrorResponse("error_param", "Select a valid leaf category"));
      return;
    }
    const mandatoryAttributes = category.attributes.filter((attribute) => attribute.isMandatory);
    for (const attribute of mandatoryAttributes) {
      const supplied = parsedAttributes.find((entry: any) => Number(entry.attribute_id) === Number(attribute.attributeId));
      if (!supplied || !Array.isArray(supplied.attribute_value_list) || supplied.attribute_value_list.length === 0) {
        res.json(createShopeeErrorResponse("error_param", `Attribute is mandatory: ${attribute.name} (id: ${attribute.attributeId})`));
        return;
      }
    }
    for (const supplied of parsedAttributes) {
      const definition = category.attributes.find((attribute) => Number(attribute.attributeId) === Number(supplied.attribute_id));
      if (!definition || !Array.isArray(supplied.attribute_value_list)) {
        res.json(createShopeeErrorResponse("error_param", "Attribute does not belong to the selected category"));
        return;
      }
      if (["DROP_DOWN", "MULTI_SELECT"].includes(definition.inputType)) {
        const allowedValues = Array.isArray(definition.valueListJson) ? definition.valueListJson as any[] : [];
        const invalidValue = supplied.attribute_value_list.some((value: any) =>
          !allowedValues.some((allowed: any) => String(allowed.value_id) === String(value.value_id))
        );
        if (invalidValue) {
          res.json(createShopeeErrorResponse("error_param", `Invalid value for category attribute: ${definition.name}`));
          return;
        }
      }
    }
  }

  let parsedModels = models;
  if (typeof models === "string") {
    try {
      parsedModels = JSON.parse(models);
    } catch {
      parsedModels = [];
    }
  }
  const hasModel = Array.isArray(parsedModels) && parsedModels.length > 0;

  let parsedTierVariation = tier_variation;
  if (typeof tier_variation === "string") {
    try {
      parsedTierVariation = JSON.parse(tier_variation);
    } catch {
      parsedTierVariation = undefined;
    }
  }
  if (product_workflow && Array.isArray(parsedTierVariation) && parsedTierVariation.length > 2) {
    res.json(createShopeeErrorResponse("error_param", "Shopee products support at most 2 variation groups"));
    return;
  }
  if (product_workflow && parsedTierVariation !== undefined && (!Array.isArray(parsedTierVariation) || parsedTierVariation.some((tier: any) =>
    !String(tier?.name || "").trim() || !Array.isArray(tier?.option_list) || tier.option_list.length === 0 || tier.option_list.some((option: any) => !String(option?.option || "").trim())
  ))) {
    res.json(createShopeeErrorResponse("error_param", "Each product variation group requires a name and at least one value"));
    return;
  }

  // Process media: uploaded files or passed URLs
  const finalImageUrls: string[] = [];

  const uploadedFiles = (req.files as Express.Multer.File[]) || [];
  for (const file of uploadedFiles) {
    try {
      const uploadRes = await storageService.uploadFile(file);
      finalImageUrls.push(uploadRes.url);
    } catch (e: any) {
      console.error("[Simulator:ProductCreate] Media upload error:", e);
    }
  }

  const rawImageUrls = Array.isArray(image_url_list)
    ? image_url_list
    : typeof image_url_list === "string"
      ? (() => { try { const p = JSON.parse(image_url_list); return Array.isArray(p) ? p : [image_url_list]; } catch { return [image_url_list]; } })()
      : [];
  finalImageUrls.push(...rawImageUrls.filter(Boolean));

  if (Array.isArray(images)) {
    for (const img of images) {
      if (typeof img === "string") finalImageUrls.push(img);
      else if (img && (img.url || img.image_url)) finalImageUrls.push(img.url || img.image_url);
    }
  } else if (typeof images === "string" && images.trim()) {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) {
        for (const img of parsed) {
          if (typeof img === "string") finalImageUrls.push(img);
          else if (img && (img.url || img.image_url)) finalImageUrls.push(img.url || img.image_url);
        }
      } else {
        finalImageUrls.push(images.trim());
      }
    } catch {
      finalImageUrls.push(images.trim());
    }
  }

  const uniqueUrls = Array.from(new Set(finalImageUrls.filter(Boolean)));
  if (product_workflow && (uniqueUrls.length === 0 || uniqueUrls.length > 9)) {
    res.json(createShopeeErrorResponse("error_param", "Upload between 1 and 9 product images"));
    return;
  }
  const effectiveUrls = uniqueUrls.length > 0 ? uniqueUrls : ["https://cf.shopee.vn/file/custom_product_image"];
  const imageIdList = effectiveUrls.map((_, idx) => `vn-11134201-7rd5z-${Date.now().toString(36)}-${idx}`);

  const imagesJson = {
    image_id_list: imageIdList,
    image_url_list: effectiveUrls
  };

  // Enforce Shopee 5:1 variation price ratio guard if variations are provided
  let effectiveBasePrice = Number(original_price);
  if (hasModel) {
    const modelPrices = parsedModels
      .map((m: any) => Number(m.original_price ?? original_price))
      .filter((p: number) => !isNaN(p) && p > 0);
    if (modelPrices.length > 1) {
      const minPrice = Math.min(...modelPrices);
      const maxPrice = Math.max(...modelPrices);
      if (minPrice > 0 && maxPrice / minPrice > 5.0) {
        res.json(createShopeeErrorResponse("error_param", "The price ratio between variations exceeds limit"));
        return;
      }
      effectiveBasePrice = minPrice;
    }
  }

  const product = await prisma.product.create({
    data: {
      shopId,
      categoryId: catId,
      itemName: item_name,
      description,
      gtin: gtin || null,
      videoUrl: video_url || null,
      imageRatio: image_ratio,
      productCondition: product_condition,
      isPreorder: Boolean(is_preorder),
      preorderDaysToShip: Boolean(is_preorder) ? Number(preorder_days_to_ship) : null,
      itemStatus: product_workflow ? item_status : "NORMAL",
      originalPrice: effectiveBasePrice,
      currency: "VND",
      weight: packageWeightKg,
      dimensionsJson: dimension || undefined,
      attributesJson: product_workflow ? parsedAttributes : undefined,
      shippingOptionsJson: product_workflow ? selectedShippingOptions.map((option) => ({
        option_id: option.optionId,
        option_name: option.optionName,
        option_group: option.optionGroup,
        maximum_weight_gram: option.maximumWeightGram
      })) : undefined,
      itemSku: item_sku || `SKU-${Date.now()}`,
      hasModel,
      tierVariationJson: parsedTierVariation || undefined,
      imagesJson
    }
  });

  if (hasModel) {
    for (const m of parsedModels) {
      await prisma.productModel.create({
        data: {
          itemId: product.itemId,
          modelName: m.model_name || "Standard",
          modelSku: m.model_sku || `${product.itemSku}-VAR`,
          tierIndex: m.tier_index || [0],
          originalPrice: Number(m.original_price ?? original_price),
          sellerStock: Number(m.seller_stock ?? 100)
        }
      });
    }
  } else {
    await prisma.productModel.create({
      data: {
        itemId: product.itemId,
        modelName: "Standard",
        modelSku: product.itemSku,
        tierIndex: [0],
        originalPrice: Number(original_price),
        sellerStock: 100
      }
    });
  }

  res.json(createShopeeSuccessResponse({
    item_id: Number(product.itemId),
    item_name: product.itemName,
    has_model: product.hasModel,
    item_status: product.itemStatus,
    images: imagesJson
  }));
});

// ============================================================================
// 14. GET ORDER DETAIL (FOR BUYER & SELLER INSPECTION)
// ============================================================================
simulatorRouter.get("/api/v2/simulator/order/detail", async (req: Request, res: Response): Promise<void> => {
  const orderSn = req.query.order_sn as string;

  if (!orderSn) {
    res.json(createShopeeErrorResponse("error_param", "order_sn is required"));
    return;
  }

  const order = await prisma.order.findUnique({
    where: { orderSn },
    include: {
      items: true,
      packages: true,
      shop: true
    }
  });

  if (!order) {
    res.json(createShopeeErrorResponse("error_param", "Order not found"));
    return;
  }

  const pkg = order.packages[0];

  // Visual tracking timeline state
  const timeline = [
    {
      title: "Order Placed",
      status: "DONE",
      time: order.createdAt.toISOString()
    },
    {
      title: "Payment Confirmed",
      status: order.orderStatus !== OrderStatus.UNPAID ? "DONE" : "PENDING",
      time: order.orderStatus !== OrderStatus.UNPAID ? order.updatedAt.toISOString() : null
    },
    {
      title: "Logistics Arranged",
      status: ["PROCESSED", "SHIPPED", "TO_CONFIRM_RECEIVE", "COMPLETED"].includes(order.orderStatus) ? "DONE" : "PENDING",
      tracking: pkg?.trackingNumber || null
    },
    {
      title: "Courier Picked Up (In Transit)",
      status: ["SHIPPED", "TO_CONFIRM_RECEIVE", "COMPLETED"].includes(order.orderStatus) ? "DONE" : "PENDING"
    },
    {
      title: "Delivered & Completed",
      status: order.orderStatus === OrderStatus.COMPLETED ? "DONE" : "PENDING"
    }
  ];

  res.json(createShopeeSuccessResponse({
    order_sn: order.orderSn,
    order_status: order.orderStatus,
    shop_id: Number(order.shopId),
    shop_name: order.shop.shopName,
    shipping_carrier: order.shippingCarrier,
    payment_method: order.paymentMethod,
    total_amount: Number(order.totalAmount),
    voucher_from_seller: Number(order.voucherFromSeller || 0),
    voucher_from_shopee: Number(order.voucherFromShopee || 0),
    buyer_paid_shipping_fee: Number(order.buyerPaidShippingFee || 0),
    actual_shipping_fee: Number(order.actualShippingFee || 0),
    channel_id: Number(order.channelId),
    currency: order.currency,
    created_at: order.createdAt.toISOString(),
    updated_at: order.updatedAt.toISOString(),
    recipient: {
      name: order.recipientName,
      phone: order.recipientPhone,
      address: `${order.recipientAddress}, ${order.recipientDistrict}, ${order.recipientCity}`
    },
    package: pkg ? {
      package_number: pkg.packageNumber,
      tracking_number: pkg.trackingNumber,
      logistics_status: pkg.logisticsStatus,
      document_status: pkg.documentStatus
    } : null,
    items: order.items.map(i => ({
      order_item_id: Number(i.orderItemId),
      item_id: Number(i.itemId),
      item_name: i.itemName,
      model_name: i.modelName,
      unit_price: Number(i.itemPrice),
      quantity: i.quantityPurchased,
      subtotal: Number(i.itemPrice) * i.quantityPurchased
    })),
    timeline
  }));
});

// ============================================================================
// 15. SIMULATE COURIER PICKUP: PROCESSED -> SHIPPED
// ============================================================================
simulatorRouter.post("/api/v2/simulator/order/carrier_pickup", async (req: Request, res: Response): Promise<void> => {
  const { order_sn } = req.body || {};

  if (!order_sn) {
    res.json(createShopeeErrorResponse("error_param", "order_sn is required"));
    return;
  }

  const order = await prisma.order.findUnique({
    where: { orderSn: order_sn },
    include: { shop: true, packages: true }
  });

  if (!order) {
    res.json(createShopeeErrorResponse("error_param", "Order not found"));
    return;
  }

  const now = new Date();
  await prisma.order.update({
    where: { orderSn: order_sn },
    data: { orderStatus: OrderStatus.SHIPPED, updatedAt: now }
  });

  for (const pkg of order.packages) {
    await prisma.orderPackage.update({
      where: { packageNumber: pkg.packageNumber },
      data: { logisticsStatus: "LOGISTICS_PICKUP_DONE" }
    });
  }

  // Push Code 3 (order_status_push: SHIPPED)
  WebhookService.dispatch({
    partnerId: order.shop.partnerId,
    pushCode: 3,
    shopId: order.shopId,
    ordersn: order_sn,
    payload: {
      shop_id: Number(order.shopId),
      code: 3,
      timestamp: Math.floor(now.getTime() / 1000),
      data: {
        ordersn: order_sn,
        status: "SHIPPED",
        update_time: Math.floor(now.getTime() / 1000)
      }
    }
  }).catch(err => console.warn("[Simulator] Pickup push failed:", err.message));

  res.json(createShopeeSuccessResponse({
    order_sn,
    order_status: "SHIPPED",
    logistics_status: "LOGISTICS_PICKUP_DONE"
  }));
});

// ============================================================================
// 16. SIMULATE COURIER DELIVERY / COMPLETION: SHIPPED -> COMPLETED
// ============================================================================
simulatorRouter.post("/api/v2/simulator/order/deliver", async (req: Request, res: Response): Promise<void> => {
  const { order_sn } = req.body || {};

  if (!order_sn) {
    res.json(createShopeeErrorResponse("error_param", "order_sn is required"));
    return;
  }

  const order = await prisma.order.findUnique({
    where: { orderSn: order_sn },
    include: { shop: true, packages: true }
  });

  if (!order) {
    res.json(createShopeeErrorResponse("error_param", "Order not found"));
    return;
  }

  const now = new Date();
  await prisma.order.update({
    where: { orderSn: order_sn },
    data: { orderStatus: OrderStatus.COMPLETED, updatedAt: now, escrowReleaseTime: now }
  });

  for (const pkg of order.packages) {
    await prisma.orderPackage.update({
      where: { packageNumber: pkg.packageNumber },
      data: { logisticsStatus: "LOGISTICS_DELIVERED" }
    });
  }

  // Push Code 3 (order_status_push: COMPLETED)
  WebhookService.dispatch({
    partnerId: order.shop.partnerId,
    pushCode: 3,
    shopId: order.shopId,
    ordersn: order_sn,
    payload: {
      shop_id: Number(order.shopId),
      code: 3,
      timestamp: Math.floor(now.getTime() / 1000),
      data: {
        ordersn: order_sn,
        status: "COMPLETED",
        update_time: Math.floor(now.getTime() / 1000)
      }
    }
  }).catch(err => console.warn("[Simulator] Deliver push failed:", err.message));

  res.json(createShopeeSuccessResponse({
    order_sn,
    order_status: "COMPLETED",
    logistics_status: "LOGISTICS_DELIVERED"
  }));
});

// ============================================================================
// 17. BUYER INSTANT CANCEL (IOC: UNPAID or READY_TO_SHIP -> CANCELLED)
// ============================================================================
simulatorRouter.post("/api/v2/simulator/order/buyer_cancel", async (req: Request, res: Response): Promise<void> => {
  const { order_sn, reason = "Buyer cancelled order (Instant Cancellation)" } = req.body || {};

  if (!order_sn) {
    res.json(createShopeeErrorResponse("error_param", "order_sn is required"));
    return;
  }

  const order = await prisma.order.findUnique({
    where: { orderSn: order_sn },
    include: { shop: true }
  });

  if (!order) {
    res.json(createShopeeErrorResponse("error_param", "Order not found"));
    return;
  }

  // Instant cancellation is valid only for UNPAID or READY_TO_SHIP
  if (order.orderStatus !== OrderStatus.UNPAID && order.orderStatus !== OrderStatus.READY_TO_SHIP) {
    res.json(createShopeeErrorResponse("error_business", "Order is already being processed or shipped; instant cancellation is not allowed."));
    return;
  }

  const now = new Date();
  await prisma.order.update({
    where: { orderSn: order_sn },
    data: {
      orderStatus: OrderStatus.CANCELLED,
      cancelBy: "BUYER",
      cancelReason: reason,
      updatedAt: now
    }
  });

  // Push Code 3 (CANCELLED)
  WebhookService.dispatch({
    partnerId: order.shop.partnerId,
    pushCode: 3,
    shopId: order.shopId,
    ordersn: order_sn,
    payload: {
      shop_id: Number(order.shopId),
      code: 3,
      timestamp: Math.floor(now.getTime() / 1000),
      data: {
        ordersn: order_sn,
        status: "CANCELLED",
        update_time: Math.floor(now.getTime() / 1000)
      }
    }
  }).catch(err => console.warn("[Simulator] Buyer cancel push failed:", err.message));

  res.json(createShopeeSuccessResponse({
    order_sn,
    order_status: "CANCELLED",
    cancel_by: "BUYER"
  }));
});

// ============================================================================
// 18. BUYER REQUESTS CANCELLATION: PROCESSED -> IN_CANCEL
// ============================================================================
simulatorRouter.post("/api/v2/simulator/order/buyer_request_cancel", async (req: Request, res: Response): Promise<void> => {
  const { order_sn, reason = "Changed mind / wrong address" } = req.body || {};

  if (!order_sn) {
    res.json(createShopeeErrorResponse("error_param", "order_sn is required"));
    return;
  }

  const order = await prisma.order.findUnique({
    where: { orderSn: order_sn },
    include: { shop: true }
  });

  if (!order) {
    res.json(createShopeeErrorResponse("error_param", "Order not found"));
    return;
  }

  if (order.orderStatus !== OrderStatus.PROCESSED) {
    res.json(createShopeeErrorResponse("error_business", "Cancellation request requires seller approval and can only be submitted for PROCESSED orders."));
    return;
  }

  const now = new Date();
  await prisma.order.update({
    where: { orderSn: order_sn },
    data: {
      orderStatus: OrderStatus.IN_CANCEL,
      buyerCancelReason: reason,
      updatedAt: now
    }
  });

  // Push Code 3 (IN_CANCEL)
  WebhookService.dispatch({
    partnerId: order.shop.partnerId,
    pushCode: 3,
    shopId: order.shopId,
    ordersn: order_sn,
    payload: {
      shop_id: Number(order.shopId),
      code: 3,
      timestamp: Math.floor(now.getTime() / 1000),
      data: {
        ordersn: order_sn,
        status: "IN_CANCEL",
        update_time: Math.floor(now.getTime() / 1000)
      }
    }
  }).catch(err => console.warn("[Simulator] Cancel request push failed:", err.message));

  res.json(createShopeeSuccessResponse({
    order_sn,
    order_status: "IN_CANCEL"
  }));
});

// ============================================================================
// 19. SELLER RESPONDS TO CANCELLATION REQUEST (IN_CANCEL -> CANCELLED or PROCESSED)
// ============================================================================
simulatorRouter.post("/api/v2/simulator/order/handle_cancellation", async (req: Request, res: Response): Promise<void> => {
  const { order_sn, operation } = req.body || {};

  if (!order_sn || !operation) {
    res.json(createShopeeErrorResponse("error_param", "order_sn and operation ('ACCEPT' | 'REJECT') are required"));
    return;
  }

  const order = await prisma.order.findUnique({
    where: { orderSn: order_sn },
    include: { shop: true }
  });

  if (!order) {
    res.json(createShopeeErrorResponse("error_param", "Order not found"));
    return;
  }

  if (order.orderStatus !== OrderStatus.IN_CANCEL) {
    res.json(createShopeeErrorResponse("error_business", "Order is not in IN_CANCEL status"));
    return;
  }

  const op = String(operation).toUpperCase();
  const now = new Date();

  if (op === "ACCEPT") {
    await prisma.order.update({
      where: { orderSn: order_sn },
      data: {
        orderStatus: OrderStatus.CANCELLED,
        cancelBy: "BUYER",
        cancelReason: order.buyerCancelReason || "Seller accepted buyer cancellation request",
        updatedAt: now
      }
    });

    WebhookService.dispatch({
      partnerId: order.shop.partnerId,
      pushCode: 3,
      shopId: order.shopId,
      ordersn: order_sn,
      payload: {
        shop_id: Number(order.shopId),
        code: 3,
        timestamp: Math.floor(now.getTime() / 1000),
        data: {
          ordersn: order_sn,
          status: "CANCELLED",
          update_time: Math.floor(now.getTime() / 1000)
        }
      }
    }).catch(err => console.warn("[Simulator] Seller accept cancel push failed:", err.message));

    res.json(createShopeeSuccessResponse({
      order_sn,
      order_status: "CANCELLED",
      operation: "ACCEPT"
    }));
  } else if (op === "REJECT") {
    await prisma.order.update({
      where: { orderSn: order_sn },
      data: {
        orderStatus: OrderStatus.PROCESSED,
        updatedAt: now
      }
    });

    WebhookService.dispatch({
      partnerId: order.shop.partnerId,
      pushCode: 3,
      shopId: order.shopId,
      ordersn: order_sn,
      payload: {
        shop_id: Number(order.shopId),
        code: 3,
        timestamp: Math.floor(now.getTime() / 1000),
        data: {
          ordersn: order_sn,
          status: "PROCESSED",
          update_time: Math.floor(now.getTime() / 1000)
        }
      }
    }).catch(err => console.warn("[Simulator] Seller reject cancel push failed:", err.message));

    res.json(createShopeeSuccessResponse({
      order_sn,
      order_status: "PROCESSED",
      operation: "REJECT"
    }));
  } else {
    res.json(createShopeeErrorResponse("error_param", "Invalid operation. Must be ACCEPT or REJECT"));
  }
});

// ============================================================================
// SIMULATOR HELPER: GET /api/v2/simulator/promotions
// ============================================================================
simulatorRouter.get("/api/v2/simulator/promotions", async (req: Request, res: Response): Promise<void> => {
  const shopIdStr = (req.query.shop_id as string) || "727720655";
  const shopId = BigInt(shopIdStr);
  const now = new Date();

  function getDynamicPromoStatus(status: PromotionStatus, startTime: Date, endTime: Date): string {
    if (status === PromotionStatus.DELETED) return "deleted";
    if (status === PromotionStatus.EXPIRED) return "expired";
    if (now < startTime) return "upcoming";
    if (now > endTime) return "expired";
    return "ongoing";
  }

  // Find non-deleted discounts
  const discounts = await prisma.discount.findMany({
    where: {
      shopId,
      status: { not: PromotionStatus.DELETED }
    },
    include: {
      items: {
        include: {
          product: true,
          models: {
            include: { productModel: true }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  // Find non-deleted vouchers
  const vouchers = await prisma.voucher.findMany({
    where: {
      shopId,
      status: { not: PromotionStatus.DELETED }
    },
    include: {
      items: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  res.json(createShopeeSuccessResponse({
    shop_id: Number(shopId),
    discounts: discounts.map(d => ({
      discount_id: Number(d.discountId),
      discount_name: d.discountName,
      start_time: Math.floor(d.startTime.getTime() / 1000),
      end_time: Math.floor(d.endTime.getTime() / 1000),
      status: getDynamicPromoStatus(d.status, d.startTime, d.endTime),
      items: d.items.map(it => ({
        item_id: Number(it.itemId),
        item_name: it.product?.itemName || `Item ${it.itemId}`,
        purchase_limit: it.purchaseLimit,
        item_promotion_price: it.itemPromotionPrice ? Number(it.itemPromotionPrice) : null,
        models: it.models.map(m => ({
          model_id: Number(m.modelId),
          model_name: m.productModel?.modelName || `Model ${m.modelId}`,
          model_promotion_price: Number(m.modelPromotionPrice)
        }))
      }))
    })),
    vouchers: vouchers.map(v => ({
      voucher_id: Number(v.voucherId),
      voucher_code: v.voucherCode,
      voucher_name: v.voucherName,
      voucher_type: v.voucherType,
      reward_type: v.rewardType,
      min_basket_price: Number(v.minBasketPrice),
      discount_amount: v.discountAmount ? Number(v.discountAmount) : 0,
      percentage: v.percentage || 0,
      max_price: v.maxPrice ? Number(v.maxPrice) : 0,
      usage_quantity: v.usageQuantity,
      current_usage: v.currentUsage,
      start_time: Math.floor(v.startTime.getTime() / 1000),
      end_time: Math.floor(v.endTime.getTime() / 1000),
      status: getDynamicPromoStatus(v.status, v.startTime, v.endTime),
      items: v.items.map(it => ({
        item_id: Number(it.itemId),
        item_name: it.product?.itemName || `Item ${it.itemId}`
      }))
    }))
  }));
});

// ============================================================================
// SIMULATOR HELPER: CREATE DISCOUNT
// ============================================================================
simulatorRouter.post("/api/v2/simulator/discount/create", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      shop_id = 727720655,
      discount_name,
      start_time,
      end_time,
      items = []
    } = req.body || {};

    if (!discount_name || typeof discount_name !== "string" || discount_name.trim().length === 0) {
      res.json(createShopeeErrorResponse("error_param", "discount_name is required"));
      return;
    }

    const shopId = BigInt(shop_id);
    const startDate = typeof start_time === "number" ? new Date(start_time * 1000) : new Date(start_time);
    const endDate = typeof end_time === "number" ? new Date(end_time * 1000) : new Date(end_time);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      res.json(createShopeeErrorResponse("error_param", "Invalid start_time or end_time"));
      return;
    }

    if (endDate <= startDate) {
      res.json(createShopeeErrorResponse("error_param", "End time must be after start time"));
      return;
    }

    const now = new Date();
    const initialStatus = now < startDate ? PromotionStatus.UPCOMING : (now > endDate ? PromotionStatus.EXPIRED : PromotionStatus.ONGOING);

    const discount = await prisma.discount.create({
      data: {
        shopId,
        discountName: discount_name.trim(),
        startTime: startDate,
        endTime: endDate,
        status: initialStatus
      }
    });

    if (Array.isArray(items) && items.length > 0) {
      for (const it of items) {
        if (!it.item_id) continue;
        const itemId = BigInt(it.item_id);
        const promoPrice = it.item_promotion_price !== undefined && it.item_promotion_price !== null && it.item_promotion_price !== ""
          ? Number(it.item_promotion_price)
          : null;
        const purchaseLimit = Number(it.purchase_limit || 0);

        const createdItem = await prisma.discountItem.create({
          data: {
            discountId: discount.discountId,
            itemId,
            itemPromotionPrice: promoPrice,
            purchaseLimit,
            status: initialStatus
          }
        });

        // Check if item has models
        const product = await prisma.product.findUnique({
          where: { itemId },
          include: { models: true }
        });

        if (product && product.hasModel && product.models.length > 0) {
          for (const m of product.models) {
            const mPromo = it.models?.find((im: any) => String(im.model_id) === String(m.modelId));
            const modelPrice = mPromo && mPromo.model_promotion_price !== undefined
              ? Number(mPromo.model_promotion_price)
              : (promoPrice !== null ? promoPrice : Number(m.originalPrice));

            await prisma.discountItemModel.create({
              data: {
                discountItemId: createdItem.id,
                modelId: m.modelId,
                modelPromotionPrice: modelPrice
              }
            });
          }
        }
      }
    }

    res.json(createShopeeSuccessResponse({
      discount_id: Number(discount.discountId),
      discount_name: discount.discountName,
      status: discount.status.toLowerCase()
    }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to create discount"));
  }
});

// ============================================================================
// SIMULATOR HELPER: END DISCOUNT
// ============================================================================
simulatorRouter.post("/api/v2/simulator/discount/end", async (req: Request, res: Response): Promise<void> => {
  try {
    const { discount_id } = req.body || {};
    if (!discount_id) {
      res.json(createShopeeErrorResponse("error_param", "discount_id is required"));
      return;
    }
    const now = new Date();
    await prisma.discount.update({
      where: { discountId: BigInt(discount_id) },
      data: {
        status: PromotionStatus.EXPIRED,
        endTime: now
      }
    });
    res.json(createShopeeSuccessResponse({ discount_id: Number(discount_id), status: "expired" }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to end discount"));
  }
});

// ============================================================================
// SIMULATOR HELPER: DELETE DISCOUNT
// ============================================================================
simulatorRouter.post("/api/v2/simulator/discount/delete", async (req: Request, res: Response): Promise<void> => {
  try {
    const { discount_id } = req.body || {};
    if (!discount_id) {
      res.json(createShopeeErrorResponse("error_param", "discount_id is required"));
      return;
    }
    await prisma.discount.update({
      where: { discountId: BigInt(discount_id) },
      data: { status: PromotionStatus.DELETED }
    });
    res.json(createShopeeSuccessResponse({ discount_id: Number(discount_id), status: "deleted" }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to delete discount"));
  }
});

// ============================================================================
// SIMULATOR HELPER: CREATE VOUCHER
// ============================================================================
simulatorRouter.post("/api/v2/simulator/voucher/create", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      shop_id = 727720655,
      voucher_name,
      voucher_code,
      voucher_type = 1,
      reward_type = 1,
      discount_amount,
      percentage,
      max_price,
      min_basket_price = 0,
      usage_quantity = 100,
      start_time,
      end_time
    } = req.body || {};

    if (!voucher_name || !voucher_code) {
      res.json(createShopeeErrorResponse("error_param", "voucher_name and voucher_code are required"));
      return;
    }

    const codeStr = String(voucher_code).toUpperCase().trim();
    if (!/^[A-Za-z0-9]{1,5}$/.test(codeStr)) {
      res.json(createShopeeErrorResponse("voucher.voucher_code_error", "Voucher code must be 1 to 5 alphanumeric characters"));
      return;
    }

    const shopId = BigInt(shop_id);
    const startDate = typeof start_time === "number" ? new Date(start_time * 1000) : new Date(start_time);
    const endDate = typeof end_time === "number" ? new Date(end_time * 1000) : new Date(end_time);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      res.json(createShopeeErrorResponse("error_param", "Invalid start_time or end_time"));
      return;
    }

    if (endDate <= startDate) {
      res.json(createShopeeErrorResponse("error_param", "End time must be after start time"));
      return;
    }

    const now = new Date();
    const initialStatus = now < startDate ? PromotionStatus.UPCOMING : (now > endDate ? PromotionStatus.EXPIRED : PromotionStatus.ONGOING);

    // Check duplicate voucher code for same shop
    const existing = await prisma.voucher.findFirst({
      where: {
        shopId,
        voucherCode: codeStr,
        status: { not: PromotionStatus.DELETED }
      }
    });

    if (existing) {
      res.json(createShopeeErrorResponse("voucher.voucher_code_duplicate_error", `Voucher code "${codeStr}" already exists for this store`));
      return;
    }

    const voucher = await prisma.voucher.create({
      data: {
        shopId,
        voucherCode: codeStr,
        voucherName: voucher_name.trim(),
        voucherType: Number(voucher_type),
        rewardType: Number(reward_type),
        discountAmount: discount_amount !== undefined && discount_amount !== null && discount_amount !== "" ? Number(discount_amount) : null,
        percentage: percentage !== undefined && percentage !== null && percentage !== "" ? Number(percentage) : null,
        maxPrice: max_price !== undefined && max_price !== null && max_price !== "" ? Number(max_price) : null,
        minBasketPrice: Number(min_basket_price || 0),
        usageQuantity: Number(usage_quantity || 100),
        currentUsage: 0,
        startTime: startDate,
        endTime: endDate,
        status: initialStatus
      }
    });

    res.json(createShopeeSuccessResponse({
      voucher_id: Number(voucher.voucherId),
      voucher_code: voucher.voucherCode,
      voucher_name: voucher.voucherName,
      status: voucher.status.toLowerCase()
    }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to create voucher"));
  }
});

// ============================================================================
// SIMULATOR HELPER: END VOUCHER
// ============================================================================
simulatorRouter.post("/api/v2/simulator/voucher/end", async (req: Request, res: Response): Promise<void> => {
  try {
    const { voucher_id } = req.body || {};
    if (!voucher_id) {
      res.json(createShopeeErrorResponse("error_param", "voucher_id is required"));
      return;
    }
    const now = new Date();
    await prisma.voucher.update({
      where: { voucherId: BigInt(voucher_id) },
      data: {
        status: PromotionStatus.EXPIRED,
        endTime: now
      }
    });
    res.json(createShopeeSuccessResponse({ voucher_id: Number(voucher_id), status: "expired" }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to end voucher"));
  }
});

// ============================================================================
// SIMULATOR HELPER: DELETE VOUCHER
// ============================================================================
simulatorRouter.post("/api/v2/simulator/voucher/delete", async (req: Request, res: Response): Promise<void> => {
  try {
    const { voucher_id } = req.body || {};
    if (!voucher_id) {
      res.json(createShopeeErrorResponse("error_param", "voucher_id is required"));
      return;
    }
    await prisma.voucher.update({
      where: { voucherId: BigInt(voucher_id) },
      data: { status: PromotionStatus.DELETED }
    });
    res.json(createShopeeSuccessResponse({ voucher_id: Number(voucher_id), status: "deleted" }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to delete voucher"));
  }
});

// ============================================================================
// SIMULATOR HELPER: TOGGLE UNLIST PRODUCT
// ============================================================================
simulatorRouter.post("/api/v2/simulator/product/toggle_unlist", async (req: Request, res: Response): Promise<void> => {
  try {
    const { item_id } = req.body || {};
    if (!item_id) {
      res.json(createShopeeErrorResponse("error_param", "item_id is required"));
      return;
    }
    const product = await prisma.product.findUnique({
      where: { itemId: BigInt(item_id) }
    });
    if (!product) {
      res.json(createShopeeErrorResponse("error_param", "Product not found"));
      return;
    }
    const newStatus = product.itemStatus === "UNLIST" ? "NORMAL" : "UNLIST";
    await prisma.product.update({
      where: { itemId: product.itemId },
      data: { itemStatus: newStatus }
    });
    res.json(createShopeeSuccessResponse({
      item_id: Number(item_id),
      item_status: newStatus
    }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to toggle unlist"));
  }
});

// ============================================================================
// SIMULATOR HELPER: DELETE PRODUCT (SELLER / ADMIN)
// ============================================================================
simulatorRouter.post("/api/v2/simulator/product/delete", async (req: Request, res: Response): Promise<void> => {
  try {
    const { item_id } = req.body || {};
    if (!item_id) {
      res.json(createShopeeErrorResponse("error_param", "item_id is required"));
      return;
    }
    const product = await prisma.product.findUnique({
      where: { itemId: BigInt(item_id) }
    });
    if (!product || product.itemStatus === "SELLER_DELETE" || product.itemStatus === "DELETED") {
      res.json(createShopeeErrorResponse("error_item_not_found", "Product not found or already deleted"));
      return;
    }
    await prisma.product.update({
      where: { itemId: product.itemId },
      data: { itemStatus: "SELLER_DELETE" }
    });
    res.json(createShopeeSuccessResponse({
      item_id: Number(item_id),
      item_status: "SELLER_DELETE"
    }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to delete product"));
  }
});

// ============================================================================
// SIMULATOR HELPER: CREATE REVIEW (POST-ORDER RATING)
// ============================================================================
simulatorRouter.post("/api/v2/simulator/review/create", async (req: Request, res: Response): Promise<void> => {
  try {
    const { order_sn, item_id, model_id, rating_star = 5, comment = "", buyer_username = "shopee_buyer_test", buyer_user_id = 1001 } = req.body || {};

    if (!order_sn || !item_id) {
      res.json(createShopeeErrorResponse("error_param", "order_sn and item_id are required"));
      return;
    }

    const order = await prisma.order.findUnique({
      where: { orderSn: String(order_sn) },
      include: { items: true, comments: true }
    });

    if (!order) {
      res.json(createShopeeErrorResponse("error_param", "Order not found"));
      return;
    }

    if (order.orderStatus !== "COMPLETED") {
      res.json(createShopeeErrorResponse("error_param", "Can only review COMPLETED orders"));
      return;
    }

    // Check if this item in this order has already been reviewed
    const alreadyReviewed = (order.comments || []).some(
      (c: any) => c.itemId === BigInt(item_id)
    );

    if (alreadyReviewed) {
      res.json(createShopeeErrorResponse("product.duplicate_request", "This item in this order has already been reviewed"));
      return;
    }

    // Check if all items in this order are already reviewed
    if ((order.items || []).length > 0 && (order.items || []).every((i: any) => (order.comments || []).some((c: any) => c.itemId === i.itemId))) {
      res.json(createShopeeErrorResponse("product.duplicate_request", "All items in this order have already been reviewed"));
      return;
    }

    if ((order.items || []).length === 0 && (order.comments || []).length > 0) {
      res.json(createShopeeErrorResponse("product.duplicate_request", "This order has already been reviewed"));
      return;
    }

    const star = Math.min(5, Math.max(1, Number(rating_star)));

    const createdComment = await prisma.productComment.create({
      data: {
        orderSn: String(order_sn),
        itemId: BigInt(item_id),
        modelId: model_id ? BigInt(model_id) : null,
        shopId: order.shopId,
        buyerUserId: BigInt(buyer_user_id),
        buyerUsername: String(buyer_username),
        ratingStar: star,
        comment: String(comment)
      }
    });

    // Recalculate Shop rating
    const allShopComments = await prisma.productComment.findMany({
      where: { shopId: order.shopId },
      select: { ratingStar: true }
    });

    const totalStars = allShopComments.reduce((acc, c) => acc + c.ratingStar, 0);
    const avgRating = allShopComments.length > 0 ? (totalStars / allShopComments.length) : 5.0;

    await prisma.shop.update({
      where: { shopId: order.shopId },
      data: {
        rating: avgRating,
        ratingCount: allShopComments.length
      }
    });

    res.json(createShopeeSuccessResponse({
      comment_id: Number(createdComment.commentId),
      order_sn: createdComment.orderSn,
      rating_star: createdComment.ratingStar,
      comment: createdComment.comment,
      shop_rating: avgRating,
      rating_count: allShopComments.length
    }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to create review"));
  }
});

// ============================================================================
// SIMULATOR HELPER: GET REVIEWS LIST
// ============================================================================
simulatorRouter.get("/api/v2/simulator/reviews", async (req: Request, res: Response): Promise<void> => {
  try {
    const shopIdStr = req.query.shop_id as string | undefined;
    const itemIdStr = req.query.item_id as string | undefined;

    const whereClause: any = {};
    if (shopIdStr && shopIdStr.toUpperCase() !== "ALL") {
      whereClause.shopId = BigInt(shopIdStr);
    }
    if (itemIdStr) {
      whereClause.itemId = BigInt(itemIdStr);
    }

    const reviews = await prisma.productComment.findMany({
      where: whereClause,
      include: {
        product: true
      },
      orderBy: { commentId: "desc" }
    });

    res.json(createShopeeSuccessResponse({
      reviews: reviews.map(r => ({
        comment_id: Number(r.commentId),
        order_sn: r.orderSn,
        item_id: Number(r.itemId),
        item_name: r.product?.itemName || `Item ${r.itemId}`,
        model_id: r.modelId ? Number(r.modelId) : 0,
        buyer_username: r.buyerUsername,
        rating_star: r.ratingStar,
        comment: r.comment,
        reply: r.reply,
        reply_time: r.replyTime ? Math.floor(r.replyTime.getTime() / 1000) : null,
        create_time: Math.floor(r.createdAt.getTime() / 1000)
      }))
    }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to fetch reviews"));
  }
});

// ============================================================================
// SIMULATOR HELPER: REPLY TO REVIEW
// ============================================================================
simulatorRouter.post("/api/v2/simulator/review/reply", async (req: Request, res: Response): Promise<void> => {
  try {
    const { comment_id, reply } = req.body || {};

    if (!comment_id) {
      res.json(createShopeeErrorResponse("error_param", "comment_id is required"));
      return;
    }

    const replyText = String(reply || "").trim();
    if (!replyText) {
      res.json(createShopeeErrorResponse("error_param", "reply text is required"));
      return;
    }

    const comment = await prisma.productComment.findUnique({
      where: { commentId: BigInt(comment_id) }
    });

    if (!comment) {
      res.json(createShopeeErrorResponse("error_param", "Comment not found"));
      return;
    }

    if (comment.reply) {
      res.json(createShopeeErrorResponse("product.duplicate_request", "Comment has already been replied to"));
      return;
    }

    const updated = await prisma.productComment.update({
      where: { commentId: BigInt(comment_id) },
      data: {
        reply: replyText,
        replyTime: new Date()
      }
    });

    res.json(createShopeeSuccessResponse({
      comment_id: Number(updated.commentId),
      reply: updated.reply,
      reply_time: updated.replyTime ? Math.floor(updated.replyTime.getTime() / 1000) : null
    }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to reply to review"));
  }
});

// ============================================================================
// 17. PHASE 13: RETURNS & DISPUTES SIMULATOR & SHOPEE ADMIN ENDPOINTS
// ============================================================================

// 17.1 Buyer requests return/refund
simulatorRouter.post("/api/v2/simulator/returns/buyer_request", upload.any(), async (req: Request, res: Response): Promise<void> => {
  try {
    const { order_sn, reason, text_reason, solution, refund_amount, validation_type, proof_images } = req.body;

    if (!order_sn || !reason) {
      res.json(createShopeeErrorResponse("error_param", "order_sn and reason are required"));
      return;
    }

    const order = await prisma.order.findUnique({
      where: { orderSn: order_sn },
      include: { items: true, shop: true }
    });

    if (!order) {
      res.json(createShopeeErrorResponse("order.not_found", "Order not found"));
      return;
    }

    // Duplicate check: reject if active or accepted return already exists
    const activeReturn = await prisma.return.findFirst({
      where: {
        orderSn: order_sn,
        status: { in: ["REQUESTED", "JUDGING", "PROCESSING", "SELLER_DISPUTE", "ACCEPTED"] }
      }
    });

    if (activeReturn) {
      res.json(createShopeeErrorResponse("return.duplicate_request", "An active return request already exists or has already been accepted for this order"));
      return;
    }

    // State machine check: return can only be requested on SHIPPED or COMPLETED orders
    if (order.orderStatus !== OrderStatus.SHIPPED && order.orderStatus !== OrderStatus.COMPLETED) {
      res.json(createShopeeErrorResponse("order.invalid_status", "Returns can only be requested for SHIPPED or COMPLETED orders"));
      return;
    }

    const maxRefund = Number(order.totalAmount);
    const requestedRefund = refund_amount !== undefined ? parseFloat(String(refund_amount)) : maxRefund;

    if (isNaN(requestedRefund) || requestedRefund <= 0 || requestedRefund > maxRefund) {
      res.json(createShopeeErrorResponse("error_param", `refund_amount must be > 0 and <= total order amount (${maxRefund})`));
      return;
    }

    const normalizedReason = normalizeReturnReason(reason);
    const valType = validation_type === "seller_validation" ? "seller_validation" : "warehouse_validation";
    // Shopee-First flow starts in JUDGING; Seller-First starts in REQUESTED
    const initialStatus = valType === "seller_validation" ? "REQUESTED" : "JUDGING";
    const sol = solution === "REFUND_ONLY" || solution === "REFUND" ? "REFUND" : "RETURN_REFUND";
    const needsLogistics = sol === "RETURN_REFUND";

    const returnSn = "RET" + Date.now().toString().slice(-8) + Math.floor(100 + Math.random() * 900);
    const dueDate = new Date(Date.now() + 48 * 3600 * 1000); // 48h SLA

    // Handle proof media: files and URLs
    const finalProofUrls: string[] = [];

    const uploadedFiles = (req.files as Express.Multer.File[]) || [];
    for (const file of uploadedFiles) {
      try {
        const uploadRes = await storageService.uploadFile(file);
        finalProofUrls.push(uploadRes.url);
      } catch (e: any) {
        console.error("[Simulator:BuyerReturn] Media upload error:", e);
      }
    }

    if (Array.isArray(proof_images)) {
      finalProofUrls.push(...proof_images.filter(Boolean));
    } else if (typeof proof_images === "string" && proof_images.trim()) {
      try {
        const parsed = JSON.parse(proof_images);
        if (Array.isArray(parsed)) finalProofUrls.push(...parsed.filter(Boolean));
        else finalProofUrls.push(proof_images.trim());
      } catch {
        finalProofUrls.push(proof_images.trim());
      }
    }

    const images = Array.from(new Set(finalProofUrls.filter(Boolean)));

    const newReturn = await prisma.return.create({
      data: {
        returnSn,
        orderSn: order_sn,
        shopId: order.shopId,
        buyerId: order.buyerUserId,
        validationType: valType,
        refundAmount: requestedRefund,
        currency: order.currency,
        status: initialStatus,
        reason: normalizedReason,
        textReason: text_reason || "",
        solution: sol,
        needsLogistics,
        dueDate,
        proofImages: images
      }
    });

    // Create ReturnProof records for buyer proofs
    for (const pUrl of images) {
      await prisma.returnProof.create({
        data: {
          returnSn,
          uploaderType: "BUYER",
          imageUrl: pUrl,
          comment: text_reason || reason || "Buyer return proof"
        }
      });
    }

    // Populate ReturnItems
    const reqItems = req.body.items;
    if (Array.isArray(reqItems) && reqItems.length > 0) {
      for (const it of reqItems) {
        await prisma.returnItem.create({
          data: {
            returnSn,
            itemId: BigInt(it.item_id),
            modelId: it.model_id ? BigInt(it.model_id) : BigInt(0),
            itemName: it.item_name || "Returned Item",
            modelName: it.model_name || "",
            quantity: parseInt(String(it.quantity || 1), 10),
            itemPrice: parseFloat(String(it.item_price || requestedRefund)),
            refundAmount: parseFloat(String(it.refund_amount || requestedRefund))
          }
        });
      }
    } else {
      // Default: create ReturnItems for all items in order
      for (const it of order.items) {
        await prisma.returnItem.create({
          data: {
            returnSn,
            itemId: it.itemId,
            modelId: it.modelId || BigInt(0),
            itemName: it.itemName,
            modelName: it.modelName || "",
            quantity: it.quantityPurchased,
            itemPrice: it.itemPrice,
            refundAmount: it.itemPrice
          }
        });
      }
    }

    // Update order status to TO_RETURN as per Shopee official lifecycle
    await prisma.order.update({
      where: { orderSn: order.orderSn },
      data: { orderStatus: OrderStatus.TO_RETURN }
    });

    // Fire Webhook Push Code 29 (return_updates_push)
    await WebhookService.dispatchReturnUpdate({
      partnerId: order.shop.partnerId,
      shopId: order.shopId,
      orderSn: order.orderSn,
      returnSn,
      updateField: "return_status",
      oldValue: "NONE",
      newValue: initialStatus
    });

    res.json(createShopeeSuccessResponse({
      return_sn: returnSn,
      status: initialStatus,
      refund_amount: requestedRefund,
      validation_type: valType,
      due_date: Math.floor(dueDate.getTime() / 1000)
    }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to submit return request"));
  }
});

// 17.2 Buyer ships return parcel
simulatorRouter.post("/api/v2/simulator/returns/buyer_ship", async (req: Request, res: Response): Promise<void> => {
  try {
    const { return_sn, tracking_number } = req.body;
    if (!return_sn) {
      res.json(createShopeeErrorResponse("error_param", "return_sn is required"));
      return;
    }

    const r = await prisma.return.findUnique({
      where: { returnSn: return_sn },
      include: { shop: true }
    });

    if (!r) {
      res.json(createShopeeErrorResponse("return.not_found", "Return request not found"));
      return;
    }

    const track = tracking_number || `SPX-RET-${Math.floor(100000 + Math.random() * 900000)}`;
    const oldStatus = r.status;

    const updated = await prisma.return.update({
      where: { returnSn: return_sn },
      data: {
        reverseTrackingNumber: track,
        status: "PROCESSING"
      }
    });

    await WebhookService.dispatchReturnUpdate({
      partnerId: r.shop.partnerId,
      shopId: r.shopId,
      orderSn: r.orderSn,
      returnSn: r.returnSn,
      updateField: "return_status",
      oldValue: oldStatus,
      newValue: "PROCESSING"
    });

    res.json(createShopeeSuccessResponse({
      return_sn: updated.returnSn,
      tracking_number: track,
      status: "PROCESSING"
    }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to ship return parcel"));
  }
});

// 17.3 Buyer cancels return request
simulatorRouter.post("/api/v2/simulator/returns/buyer_cancel", async (req: Request, res: Response): Promise<void> => {
  try {
    const { return_sn } = req.body;
    if (!return_sn) {
      res.json(createShopeeErrorResponse("error_param", "return_sn is required"));
      return;
    }

    const r = await prisma.return.findUnique({
      where: { returnSn: return_sn },
      include: { shop: true }
    });

    if (!r) {
      res.json(createShopeeErrorResponse("return.not_found", "Return request not found"));
      return;
    }

    if (r.status !== "REQUESTED" && r.status !== "JUDGING") {
      res.json(createShopeeErrorResponse("return.invalid_status", `Cannot cancel return in ${r.status} status`));
      return;
    }

    const oldStatus = r.status;

    await prisma.return.update({
      where: { returnSn: return_sn },
      data: {
        status: "CANCELLED",
        negotiationStatus: "TERMINATED"
      }
    });

    // Revert order back to COMPLETED if no other active returns
    const otherActiveReturn = await prisma.return.findFirst({
      where: {
        orderSn: r.orderSn,
        status: { in: ["REQUESTED", "JUDGING", "PROCESSING", "SELLER_DISPUTE"] }
      }
    });
    if (!otherActiveReturn) {
      await prisma.order.update({
        where: { orderSn: r.orderSn },
        data: { orderStatus: OrderStatus.COMPLETED }
      });
    }

    await WebhookService.dispatchReturnUpdate({
      partnerId: r.shop.partnerId,
      shopId: r.shopId,
      orderSn: r.orderSn,
      returnSn: r.returnSn,
      updateField: "return_status",
      oldValue: oldStatus,
      newValue: "CANCELLED"
    });

    res.json(createShopeeSuccessResponse({
      return_sn,
      status: "CANCELLED"
    }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to cancel return"));
  }
});

// 17.3b Seller confirms return / refund directly from UI
simulatorRouter.post("/api/v2/simulator/returns/seller_confirm", async (req: Request, res: Response): Promise<void> => {
  try {
    const { return_sn } = req.body;
    if (!return_sn) {
      res.json(createShopeeErrorResponse("error_param", "return_sn is required"));
      return;
    }

    const r = await prisma.return.findUnique({
      where: { returnSn: return_sn },
      include: { shop: true, order: true }
    });

    if (!r) {
      res.json(createShopeeErrorResponse("return.not_found", "Return request not found"));
      return;
    }

    if (r.status === "ACCEPTED" || r.status === "CLOSED" || r.status === "CANCELLED") {
      res.json(createShopeeErrorResponse("return.invalid_status", `Cannot confirm return in ${r.status} status`));
      return;
    }

    const oldStatus = r.status;
    const refundAmount = Number(r.refundAmount);

    await prisma.return.update({
      where: { returnSn: return_sn },
      data: {
        status: "ACCEPTED",
        negotiationStatus: "TERMINATED"
      }
    });

    const currentEscrow = Number(r.order.escrowAmount || 0);
    const newEscrow = Math.max(0, currentEscrow - refundAmount);

    await prisma.order.update({
      where: { orderSn: r.orderSn },
      data: { escrowAmount: newEscrow }
    });

    await WebhookService.dispatchReturnUpdate({
      partnerId: r.shop.partnerId,
      shopId: r.shopId,
      orderSn: r.orderSn,
      returnSn: r.returnSn,
      updateField: "return_status",
      oldValue: oldStatus,
      newValue: "ACCEPTED"
    });

    res.json(createShopeeSuccessResponse({
      return_sn: r.returnSn,
      status: "ACCEPTED"
    }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to confirm return"));
  }
});

// 17.3c Seller counter-offer from UI
simulatorRouter.post("/api/v2/simulator/returns/seller_offer", async (req: Request, res: Response): Promise<void> => {
  try {
    const { return_sn, offer_amount, offer_reason } = req.body;
    const amount = parseFloat(String(offer_amount));

    if (!return_sn || isNaN(amount)) {
      res.json(createShopeeErrorResponse("error_param", "return_sn and valid offer_amount are required"));
      return;
    }

    const r = await prisma.return.findUnique({
      where: { returnSn: return_sn },
      include: { shop: true }
    });

    if (!r) {
      res.json(createShopeeErrorResponse("return.not_found", "Return request not found"));
      return;
    }

    if (amount <= 0 || amount > Number(r.refundAmount)) {
      res.json(createShopeeErrorResponse("error_param", "offer_amount must be > 0 and <= original requested refund"));
      return;
    }

    await prisma.return.update({
      where: { returnSn: return_sn },
      data: {
        negotiationStatus: "PENDING_BUYER_RESPOND",
        offerAmount: amount,
        offerReason: offer_reason || "Seller proposed counter-offer"
      }
    });

    await WebhookService.dispatchReturnUpdate({
      partnerId: r.shop.partnerId,
      shopId: r.shopId,
      orderSn: r.orderSn,
      returnSn: r.returnSn,
      updateField: "negotiation_status",
      oldValue: r.negotiationStatus || "TERMINATED",
      newValue: "PENDING_BUYER_RESPOND"
    });

    res.json(createShopeeSuccessResponse({
      return_sn: r.returnSn,
      offer_amount: amount
    }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to submit counter-offer"));
  }
});

// 17.3c2 Buyer accepts seller counter-offer from UI
simulatorRouter.post("/api/v2/simulator/returns/buyer_accept_offer", async (req: Request, res: Response): Promise<void> => {
  try {
    const { return_sn } = req.body;
    if (!return_sn) {
      res.json(createShopeeErrorResponse("error_param", "return_sn is required"));
      return;
    }

    const r = await prisma.return.findUnique({
      where: { returnSn: return_sn },
      include: { shop: true, order: true }
    });

    if (!r) {
      res.json(createShopeeErrorResponse("return.not_found", "Return request not found"));
      return;
    }

    if (!r.offerAmount || r.negotiationStatus !== "PENDING_BUYER_RESPOND") {
      res.json(createShopeeErrorResponse("return.no_active_offer", "No pending counter-offer to accept"));
      return;
    }

    const agreedRefund = Number(r.offerAmount);
    const oldStatus = r.status;

    await prisma.return.update({
      where: { returnSn: return_sn },
      data: {
        status: "ACCEPTED",
        refundAmount: agreedRefund,
        reverseShippingFee: 0,
        negotiationStatus: "TERMINATED"
      }
    });

    // When buyer accepts partial refund, goods are not returned (reverseShippingFee = 0)
    const buyerTotal = Number(r.order.totalAmount);
    const retainedAmount = Math.max(0, buyerTotal - agreedRefund);
    const tran = Number(r.order.sellerTransactionFee || Math.round(buyerTotal * 0.025));
    const comm = Math.round(retainedAmount * 0.02);
    const serv = Math.round(retainedAmount * 0.015);
    const newEscrow = Math.max(0, retainedAmount - tran - comm - serv);

    await prisma.order.update({
      where: { orderSn: r.orderSn },
      data: {
        escrowAmount: newEscrow,
        commissionFee: comm,
        serviceFee: serv
      }
    });

    await WebhookService.dispatchReturnUpdate({
      partnerId: r.shop.partnerId,
      shopId: r.shopId,
      orderSn: r.orderSn,
      returnSn: r.returnSn,
      updateField: "return_status",
      oldValue: oldStatus,
      newValue: "ACCEPTED"
    });

    res.json(createShopeeSuccessResponse({
      return_sn: r.returnSn,
      status: "ACCEPTED",
      refund_amount: agreedRefund
    }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to accept counter-offer"));
  }
});

// 17.3d Seller dispute / request compensation from UI
simulatorRouter.post("/api/v2/simulator/returns/seller_dispute", upload.any(), async (req: Request, res: Response): Promise<void> => {
  try {
    const { return_sn, dispute_reason_id, dispute_text_reason, email, proof_url, proof_urls, proof_images } = req.body;
    const reasonId = parseInt(String(dispute_reason_id), 10);

    if (!return_sn || isNaN(reasonId)) {
      res.json(createShopeeErrorResponse("error_param", "return_sn and dispute_reason_id are required"));
      return;
    }

    const r = await prisma.return.findUnique({
      where: { returnSn: return_sn },
      include: { shop: true }
    });

    if (!r) {
      res.json(createShopeeErrorResponse("return.not_found", "Return request not found"));
      return;
    }

    const isCompensationDispute = r.status === "ACCEPTED";
    const newStatus = isCompensationDispute ? "ACCEPTED" : "SELLER_DISPUTE";
    const compensationStatus = isCompensationDispute ? "COMPENSATION_REQUESTED" : r.compensationStatus;
    const oldStatus = r.status;

    // Handle proof media: files and URLs
    const finalProofUrls: string[] = [];

    const uploadedFiles = (req.files as Express.Multer.File[]) || [];
    for (const file of uploadedFiles) {
      try {
        const uploadRes = await storageService.uploadFile(file);
        finalProofUrls.push(uploadRes.url);
      } catch (e: any) {
        console.error("[Simulator:SellerDispute] Media upload error:", e);
      }
    }

    if (proof_url && typeof proof_url === "string" && proof_url.trim()) {
      finalProofUrls.push(proof_url.trim());
    }

    const rawUrls = Array.isArray(proof_urls)
      ? proof_urls
      : typeof proof_urls === "string"
        ? (() => { try { const p = JSON.parse(proof_urls); return Array.isArray(p) ? p : [proof_urls]; } catch { return [proof_urls]; } })()
        : [];
    finalProofUrls.push(...rawUrls.filter(Boolean));

    if (Array.isArray(proof_images)) {
      finalProofUrls.push(...proof_images.filter(Boolean));
    }

    const uniqueProofUrls = Array.from(new Set(finalProofUrls.filter(Boolean)));

    await prisma.return.update({
      where: { returnSn: return_sn },
      data: {
        status: newStatus,
        disputeReasonId: reasonId,
        disputeTextReason: dispute_text_reason || "",
        disputeEmail: email || "seller@smartomni.vn",
        sellerProofStatus: "UPLOADED",
        compensationStatus
      }
    });

    for (const url of uniqueProofUrls) {
      await prisma.returnProof.create({
        data: {
          returnSn: return_sn,
          uploaderType: "SELLER",
          imageUrl: url,
          comment: dispute_text_reason || "Seller dispute proof"
        }
      });
    }

    await WebhookService.dispatchReturnUpdate({
      partnerId: r.shop.partnerId,
      shopId: r.shopId,
      orderSn: r.orderSn,
      returnSn: r.returnSn,
      updateField: isCompensationDispute ? "seller_compensation_status" : "return_status",
      oldValue: isCompensationDispute ? r.compensationStatus : oldStatus,
      newValue: isCompensationDispute ? "COMPENSATION_REQUESTED" : "SELLER_DISPUTE"
    });

    res.json(createShopeeSuccessResponse({
      return_sn: r.returnSn,
      status: newStatus,
      compensation_status: compensationStatus,
      proofs_count: uniqueProofUrls.length
    }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to submit dispute"));
  }
});

// 17.3e Seller uploads additional proof (e.g. after Admin request)
simulatorRouter.post("/api/v2/simulator/returns/seller_upload_proof", upload.any(), async (req: Request, res: Response): Promise<void> => {
  try {
    const { return_sn, comment, proof_url, proof_urls } = req.body;
    if (!return_sn) {
      res.json(createShopeeErrorResponse("error_param", "return_sn is required"));
      return;
    }
    const r = await prisma.return.findUnique({ where: { returnSn: return_sn } });
    if (!r) {
      res.json(createShopeeErrorResponse("return.not_found", "Return request not found"));
      return;
    }

    const uploadedFiles = (req.files as Express.Multer.File[]) || [];
    const finalProofUrls: string[] = [];

    for (const file of uploadedFiles) {
      const uploadRes = await storageService.uploadFile(file);
      finalProofUrls.push(uploadRes.url);
    }

    if (proof_url && typeof proof_url === "string" && proof_url.trim()) {
      finalProofUrls.push(proof_url.trim());
    }

    if (Array.isArray(proof_urls)) {
      finalProofUrls.push(...proof_urls.filter(Boolean));
    }

    const uniqueUrls = Array.from(new Set(finalProofUrls.filter(Boolean)));
    for (const u of uniqueUrls) {
      await prisma.returnProof.create({
        data: {
          returnSn: return_sn,
          uploaderType: "SELLER",
          imageUrl: u,
          comment: comment || "Seller uploaded additional proof"
        }
      });
    }

    const updated = await prisma.return.update({
      where: { returnSn: return_sn },
      data: { sellerProofStatus: "UPLOADED" }
    });

    res.json(createShopeeSuccessResponse({
      return_sn,
      uploaded_count: uniqueUrls.length,
      seller_proof_status: updated.sellerProofStatus
    }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to upload seller proof"));
  }
});

// 17.3e Seller cancel dispute from UI
simulatorRouter.post("/api/v2/simulator/returns/seller_cancel_dispute", async (req: Request, res: Response): Promise<void> => {
  try {
    const { return_sn } = req.body;
    if (!return_sn) {
      res.json(createShopeeErrorResponse("error_param", "return_sn is required"));
      return;
    }

    const r = await prisma.return.findUnique({
      where: { returnSn: return_sn },
      include: { shop: true }
    });

    if (!r) {
      res.json(createShopeeErrorResponse("return.not_found", "Return request not found"));
      return;
    }

    const isCompensationDispute = r.status === "ACCEPTED" && r.compensationStatus === "COMPENSATION_REQUESTED";
    const isSellerDispute = r.status === "SELLER_DISPUTE";

    let newStatus = r.status;
    let newCompStatus = r.compensationStatus;
    let updateField = "return_status";
    let oldValue = r.status;
    let newValue = r.status;

    if (isSellerDispute) {
      newStatus = "REQUESTED";
      oldValue = "SELLER_DISPUTE";
      newValue = "REQUESTED";
    } else if (isCompensationDispute) {
      newCompStatus = "COMPENSATION_CANCELLED";
      updateField = "seller_compensation_status";
      oldValue = "COMPENSATION_REQUESTED";
      newValue = "COMPENSATION_CANCELLED";
    }

    await prisma.return.update({
      where: { returnSn: return_sn },
      data: {
        status: newStatus,
        compensationStatus: newCompStatus
      }
    });

    await WebhookService.dispatchReturnUpdate({
      partnerId: r.shop.partnerId,
      shopId: r.shopId,
      orderSn: r.orderSn,
      returnSn: r.returnSn,
      updateField,
      oldValue,
      newValue
    });

    res.json(createShopeeSuccessResponse({
      return_sn: return_sn,
      status: newStatus,
      compensation_status: newCompStatus
    }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to cancel dispute"));
  }
});

// 17.4 Shopee Admin reviews claim (Flow 1 triage in JUDGING)
simulatorRouter.post("/api/v2/simulator/admin/returns/review", async (req: Request, res: Response): Promise<void> => {
  try {
    const { return_sn, action, notes } = req.body; // action: "APPROVE_RETURN" | "REQUEST_SELLER_PROOF" | "REJECT"

    if (!return_sn || !action) {
      res.json(createShopeeErrorResponse("error_param", "return_sn and action are required"));
      return;
    }

    const r = await prisma.return.findUnique({
      where: { returnSn: return_sn },
      include: { shop: true, order: true }
    });

    if (!r) {
      res.json(createShopeeErrorResponse("return.not_found", "Return request not found"));
      return;
    }

    const oldStatus = r.status;
    let newStatus = r.status;
    let sellerProofStatus = r.sellerProofStatus;
    let updateData: any = {};

    if (action === "APPROVE_REFUND_ONLY") {
      // "Hoàn tiền ngay": no parcel returned, 2-day dispute window for seller
      newStatus = "ACCEPTED";
      const disputeDueDate = new Date(Date.now() + 48 * 3600 * 1000);
      const isNotReceived = r.reason === "NOT_RECEIVED" || r.reason === "NOT_RECEIPT";
      const tran = Number(r.order.sellerTransactionFee || Math.round(Number(r.order.totalAmount) * 0.025));
      const newEscrow = isNotReceived ? 0 : -tran;

      await prisma.order.update({
        where: { orderSn: r.orderSn },
        data: {
          escrowAmount: newEscrow,
          commissionFee: 0,
          serviceFee: 0,
          sellerTransactionFee: isNotReceived ? 0 : tran
        }
      });

      updateData = {
        status: "ACCEPTED",
        solution: "REFUND",
        needsLogistics: false,
        reverseShippingFee: 0,
        disputeDueDate,
        rulingNotes: notes || "Shopee approved instant refund (Hoàn tiền ngay - không trả hàng)"
      };
    } else if (action === "APPROVE_RETURN_REFUND" || action === "APPROVE_RETURN") {
      // "Trả hàng & hoàn tiền": parcel must be shipped back by buyer
      newStatus = "PROCESSING";
      const carrierPrefix = r.order.shippingCarrier ? r.order.shippingCarrier.slice(0, 3).toUpperCase() : "SPX";
      const reverseTracking = "RET-" + carrierPrefix + Date.now().toString().slice(-8);

      updateData = {
        status: "PROCESSING",
        solution: "RETURN_REFUND",
        needsLogistics: true,
        reverseTrackingNumber: reverseTracking,
        rulingNotes: notes || "Shopee approved return & refund (Chờ người mua gửi trả hàng)"
      };
    } else if (action === "REQUEST_SELLER_PROOF") {
      sellerProofStatus = "PENDING";
      updateData = {
        sellerProofStatus: "PENDING",
        rulingNotes: notes || "Shopee requested proof from seller"
      };
    } else if (action === "REJECT") {
      newStatus = "CLOSED";
      await prisma.order.update({
        where: { orderSn: r.orderSn },
        data: { orderStatus: OrderStatus.COMPLETED }
      });
      updateData = {
        status: "CLOSED",
        rulingNotes: notes || `Shopee Admin rejected return: ${notes || "Claim rejected"}`
      };
    } else {
      res.json(createShopeeErrorResponse("error_param", "Invalid action. Use APPROVE_REFUND_ONLY, APPROVE_RETURN_REFUND, APPROVE_RETURN, REQUEST_SELLER_PROOF, or REJECT"));
      return;
    }

    const updated = await prisma.return.update({
      where: { returnSn: return_sn },
      data: updateData
    });

    await WebhookService.dispatchReturnUpdate({
      partnerId: r.shop.partnerId,
      shopId: r.shopId,
      orderSn: r.orderSn,
      returnSn: r.returnSn,
      updateField: action === "REQUEST_SELLER_PROOF" ? "seller_proof_status" : "return_status",
      oldValue: action === "REQUEST_SELLER_PROOF" ? r.sellerProofStatus : oldStatus,
      newValue: action === "REQUEST_SELLER_PROOF" ? "PENDING" : newStatus
    });

    res.json(createShopeeSuccessResponse({
      return_sn: updated.returnSn,
      status: updated.status,
      seller_proof_status: updated.sellerProofStatus,
      action
    }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to review return"));
  }
});

// 17.5 Shopee Warehouse inbound & inspection
simulatorRouter.post("/api/v2/simulator/admin/returns/warehouse_inbound", async (req: Request, res: Response): Promise<void> => {
  try {
    const { return_sn, inspection_result } = req.body; // "PASS" or "FAIL"
    if (!return_sn) {
      res.json(createShopeeErrorResponse("error_param", "return_sn is required"));
      return;
    }

    const r = await prisma.return.findUnique({
      where: { returnSn: return_sn },
      include: { shop: true, order: true }
    });

    if (!r) {
      res.json(createShopeeErrorResponse("return.not_found", "Return request not found"));
      return;
    }

    const isPass = inspection_result !== "FAIL";
    const newStatus = isPass ? "ACCEPTED" : "SELLER_DISPUTE";
    const oldStatus = r.status;
    let revFee = 0;

    if (isPass) {
      const isFullRefund = Number(r.refundAmount) >= Number(r.order.totalAmount);
      revFee = calculateReverseShippingFee(r.order, r);
      const isNotReceived = r.reason === "NOT_RECEIVED" || r.reason === "NOT_RECEIPT";
      const tran = Number(r.order.sellerTransactionFee || Math.round(Number(r.order.totalAmount) * 0.025));

      let newEscrow: number;
      if (isFullRefund) {
        newEscrow = isNotReceived ? 0 : -(tran + revFee);
      } else {
        const currentEscrow = Number(r.order.escrowAmount || 0);
        newEscrow = Math.max(0, currentEscrow - Number(r.refundAmount));
      }

      await prisma.order.update({
        where: { orderSn: r.orderSn },
        data: {
          escrowAmount: newEscrow,
          commissionFee: isNotReceived || isFullRefund ? 0 : r.order.commissionFee,
          serviceFee: isNotReceived || isFullRefund ? 0 : r.order.serviceFee,
          sellerTransactionFee: isNotReceived ? 0 : tran
        }
      });
    }

    const updated = await prisma.return.update({
      where: { returnSn: return_sn },
      data: {
        status: newStatus,
        reverseShippingFee: revFee,
        rulingNotes: `Warehouse inspection: ${isPass ? 'PASSED - item verified' : 'FAILED - item damaged/incorrect'}`
      }
    });

    await WebhookService.dispatchReturnUpdate({
      partnerId: r.shop.partnerId,
      shopId: r.shopId,
      orderSn: r.orderSn,
      returnSn: r.returnSn,
      updateField: "return_status",
      oldValue: oldStatus,
      newValue: newStatus
    });

    res.json(createShopeeSuccessResponse({
      return_sn: updated.returnSn,
      status: updated.status,
      warehouse_status: "INBOUND_DONE"
    }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to process warehouse inbound"));
  }
});

// 17.6 Shopee Admin Dispute Arbitration
simulatorRouter.post("/api/v2/simulator/admin/returns/arbitrate_dispute", async (req: Request, res: Response): Promise<void> => {
  try {
    const { return_sn, ruling, notes } = req.body; // "BUYER_WIN" | "SELLER_WIN" | "PLATFORM_COMPENSATE"

    if (!return_sn || !ruling) {
      res.json(createShopeeErrorResponse("error_param", "return_sn and ruling are required"));
      return;
    }

    const r = await prisma.return.findUnique({
      where: { returnSn: return_sn },
      include: { shop: true, order: true }
    });

    if (!r) {
      res.json(createShopeeErrorResponse("return.not_found", "Return request not found"));
      return;
    }

    const oldStatus = r.status;
    let newStatus = r.status;
    let compensationStatus = r.compensationStatus;

    if (ruling === "BUYER_WIN") {
      newStatus = "ACCEPTED";
      compensationStatus = "COMPENSATION_REJECTED";
      // Deduct refund from escrow
      const currentEscrow = Number(r.order.escrowAmount || 0);
      const newEscrow = Math.max(0, currentEscrow - Number(r.refundAmount));
      await prisma.order.update({
        where: { orderSn: r.orderSn },
        data: { escrowAmount: newEscrow }
      });
    } else if (ruling === "SELLER_WIN") {
      newStatus = "CLOSED";
      compensationStatus = "COMPENSATION_REJECTED";
      // Escrow remains 100% intact for seller, revert order to COMPLETED
      await prisma.order.update({
        where: { orderSn: r.orderSn },
        data: { orderStatus: OrderStatus.COMPLETED }
      });
    } else if (ruling === "PLATFORM_COMPENSATE") {
      newStatus = "ACCEPTED";
      compensationStatus = "COMPENSATION_APPROVED";
      // Buyer gets refunded, and Shopee compensates seller (seller escrow is NOT deducted or is restored)
    } else {
      res.json(createShopeeErrorResponse("error_param", "Invalid ruling. Use BUYER_WIN, SELLER_WIN, or PLATFORM_COMPENSATE"));
      return;
    }

    const updated = await prisma.return.update({
      where: { returnSn: return_sn },
      data: {
        status: newStatus,
        compensationStatus,
        rulingNotes: notes || `Shopee Dispute Ruling: ${ruling}`
      }
    });

    await WebhookService.dispatchReturnUpdate({
      partnerId: r.shop.partnerId,
      shopId: r.shopId,
      orderSn: r.orderSn,
      returnSn: r.returnSn,
      updateField: "return_status",
      oldValue: oldStatus,
      newValue: newStatus
    });

    res.json(createShopeeSuccessResponse({
      return_sn: updated.returnSn,
      status: updated.status,
      compensation_status: updated.compensationStatus,
      ruling
    }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to arbitrate dispute"));
  }
});

// 17.7 Public returns list for UI
simulatorRouter.get("/api/v2/simulator/returns", async (req: Request, res: Response): Promise<void> => {
  try {
    const shopIdStr = req.query.shop_id as string | undefined;
    const buyerIdStr = req.query.buyer_id as string | undefined;

    const whereClause: any = {};
    if (shopIdStr && shopIdStr !== "ALL") {
      whereClause.shopId = BigInt(shopIdStr);
    }
    if (buyerIdStr && buyerIdStr !== "ALL") {
      whereClause.buyerId = BigInt(buyerIdStr);
    }

    const returns = await prisma.return.findMany({
      where: whereClause,
      include: {
        order: true,
        items: true,
        proofs: true
      },
      orderBy: { createdAt: "desc" }
    });

    const formatted = returns.map(r => ({
      return_sn: r.returnSn,
      order_sn: r.orderSn,
      shop_id: Number(r.shopId),
      buyer_id: Number(r.buyerId),
      buyer_username: r.order.buyerUsername,
      validation_type: r.validationType,
      refund_amount: Number(r.refundAmount),
      currency: r.currency,
      status: r.status,
      reason: r.reason,
      text_reason: r.textReason || "",
      solution: r.solution,
      needs_logistics: r.needsLogistics,
      reverse_tracking_number: r.reverseTrackingNumber || "",
      due_date: r.dueDate ? Math.floor(r.dueDate.getTime() / 1000) : null,
      dispute_due_date: r.disputeDueDate ? Math.floor(r.disputeDueDate.getTime() / 1000) : null,
      reverse_shipping_fee: Number(r.reverseShippingFee || 0),
      negotiation_status: r.negotiationStatus || "TERMINATED",
      offer_amount: r.offerAmount ? Number(r.offerAmount) : null,
      seller_proof_status: r.sellerProofStatus,
      dispute_reason: r.disputeReason || "",
      dispute_reason_id: r.disputeReasonId,
      dispute_text_reason: r.disputeTextReason || "",
      compensation_status: r.compensationStatus,
      ruling_notes: r.rulingNotes || "",
      proof_images: r.proofImages,
      created_at: r.createdAt.toISOString(),
      updated_at: r.updatedAt.toISOString(),
      items: r.items.map(it => ({
        item_id: Number(it.itemId),
        model_id: Number(it.modelId),
        item_name: it.itemName,
        model_name: it.modelName || "",
        quantity: it.quantity,
        item_price: Number(it.itemPrice),
        refund_amount: Number(it.refundAmount)
      })),
      proofs: r.proofs.map(p => ({
        uploader_type: p.uploaderType,
        image_url: p.imageUrl,
        comment: p.comment || ""
      }))
    }));

    const summary = {
      total: formatted.length,
      requested: formatted.filter(r => r.status === "REQUESTED").length,
      judging: formatted.filter(r => r.status === "JUDGING").length,
      processing: formatted.filter(r => r.status === "PROCESSING").length,
      accepted: formatted.filter(r => r.status === "ACCEPTED").length,
      closed: formatted.filter(r => r.status === "CLOSED").length,
      disputed: formatted.filter(r => r.status === "SELLER_DISPUTE").length
    };

    res.json(createShopeeSuccessResponse({
      summary,
      returns: formatted
    }));
  } catch (err: any) {
    res.json(createShopeeErrorResponse("server_error", err.message || "Failed to load returns list"));
  }
});

// ============================================================================
// 27. GET SELLER ANALYTICS TIME-SERIES (FOR SHOPIZ SELLER CENTER OVERVIEW)
// ============================================================================
simulatorRouter.get("/api/v2/simulator/seller/analytics", async (req: Request, res: Response): Promise<void> => {
  try {
    const shopIdStr = (req.query.shop_id as string) || "727720655";
    const shopId = BigInt(shopIdStr);
    const period = (req.query.period as string) || "today";

    const now = new Date();
    const periodStartTime = new Date();
    if (period === "today") {
      periodStartTime.setHours(0, 0, 0, 0);
    } else {
      periodStartTime.setDate(now.getDate() - 7);
      periodStartTime.setHours(0, 0, 0, 0);
    }

    const completedOrders = await prisma.order.findMany({
      where: {
        shopId,
        orderStatus: { in: [OrderStatus.COMPLETED, OrderStatus.READY_TO_SHIP, OrderStatus.SHIPPED] },
        createdAt: { gte: periodStartTime }
      }
    });

    const totalRevenue = completedOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
    const totalOrders = completedOrders.length;
    const uniqueBuyers = new Set(completedOrders.map((o) => o.buyerUserId.toString())).size;
    const estimatedVisitors = Math.max(uniqueBuyers * 12, totalOrders > 0 ? totalOrders * 8 : 120);
    const conversionRate = estimatedVisitors > 0
      ? `${((totalOrders / estimatedVisitors) * 100).toFixed(2)}%`
      : "0.00%";

    res.json(createShopeeSuccessResponse({
      shop_id: Number(shopId),
      period,
      metrics: {
        revenue: totalRevenue,
        orders_count: totalOrders,
        visitors: estimatedVisitors,
        conversion_rate: conversionRate
      },
      chart: {
        labels: period === "today"
          ? ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:59"]
          : ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
        values: [
          0,
          Math.round(totalRevenue * 0.15),
          Math.round(totalRevenue * 0.3),
          Math.round(totalRevenue * 0.55),
          Math.round(totalRevenue * 0.75),
          Math.round(totalRevenue * 0.9),
          totalRevenue
        ]
      }
    }));
  } catch (err: any) {
    res.status(500).json(createShopeeErrorResponse("error_server", err.message));
  }
});
