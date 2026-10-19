import { PrismaClient } from "@prisma/client";
import * as crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with comprehensive Shopee Mock multi-shop and product data...");

  // 1. Seed Partner
  const partner = await prisma.partner.upsert({
    where: { partnerId: BigInt(1001141) },
    update: {
      webhookUrl: "http://localhost:8080/api/v2/simulator/webhook/sink"
    },
    create: {
      partnerId: BigInt(1001141),
      partnerKey: "shopee_mock_secret_key_2026",
      appName: "SmartOmni Channel Integration",
      testRedirectUrl: "http://localhost:3000/auth/callback",
      liveRedirectUrl: "https://smartomni.com/auth/shopee/callback",
      webhookUrl: "http://localhost:8080/api/v2/simulator/webhook/sink"
    }
  });
  console.log(`✓ Ensured Partner ID: ${partner.partnerId}`);

  // 2. Seed Multiple Seller Shops
  const shopsData = [
    {
      shopId: BigInt(727720655),
      shopName: "SmartOmni Official Flagship",
      region: "VN",
      status: "NORMAL",
      isVacation: false
    },
    {
      shopId: BigInt(839910244),
      shopName: "Hanoi Streetwear Co.",
      region: "VN",
      status: "NORMAL",
      isVacation: false
    },
    {
      shopId: BigInt(910283751),
      shopName: "Saigon Modern Living",
      region: "VN",
      status: "NORMAL",
      isVacation: false
    }
  ];

  const expireIn = 14400; // 4 hours
  const now = new Date();

  for (const s of shopsData) {
    const accessToken = crypto.randomBytes(16).toString("hex");
    const refreshToken = crypto.randomBytes(16).toString("hex");

    await prisma.shop.upsert({
      where: { shopId: s.shopId },
      update: {
        shopName: s.shopName,
        region: s.region,
        status: s.status
      },
      create: {
        shopId: s.shopId,
        partnerId: partner.partnerId,
        shopName: s.shopName,
        region: s.region,
        status: s.status,
        isVacation: s.isVacation,
        accessToken,
        accessTokenExpiresAt: new Date(now.getTime() + expireIn * 1000),
        refreshToken,
        refreshTokenExpiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        authExpiresAt: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
      }
    });

    // Ensure pickup address
    await prisma.shopAddress.upsert({
      where: { addressId: BigInt(Number(s.shopId) % 100000) },
      update: {},
      create: {
        addressId: BigInt(Number(s.shopId) % 100000),
        shopId: s.shopId,
        addressType: "DEFAULT",
        name: `${s.shopName} Fulfillment Hub`,
        phone: "+84901234567",
        address: "123 Le Duan Street",
        district: "District 1",
        city: "Ho Chi Minh City",
        state: "Ho Chi Minh",
        region: "VN",
        zipcode: "700000"
      }
    });

    console.log(`✓ Ensured Shop: ${s.shopName} (ID: ${s.shopId})`);
  }

  // 3. Seed Logistics Channels
  const channels = [
    { channelId: BigInt(30001), channelName: "Shopee Xpress", region: "VN", enabled: true, codEnabled: true },
    { channelId: BigInt(30002), channelName: "Giao Hang Tiet Kiem", region: "VN", enabled: true, codEnabled: true },
    { channelId: BigInt(30003), channelName: "Viettel Post", region: "VN", enabled: true, codEnabled: true }
  ];

  for (const ch of channels) {
    await prisma.logisticsChannel.upsert({
      where: { channelId: ch.channelId },
      update: {},
      create: ch
    });
  }
  console.log(`✓ Ensured 3 Logistics Channels`);

  // 4. Seed Categories & Attributes
  const categoriesData = [
    {
      id: 100001,
      name: "Electronics",
      attributeId: 50001,
      brands: [
        { value_id: 1, original_value_name: "Apple" },
        { value_id: 2, original_value_name: "Samsung" },
        { value_id: 3, original_value_name: "Xiaomi" }
      ]
    },
    {
      id: 100002,
      name: "Fashion & Apparel",
      attributeId: 50002,
      brands: [
        { value_id: 1, original_value_name: "SmartOmni Apparel" },
        { value_id: 2, original_value_name: "Hanoi Streetwear" },
        { value_id: 3, original_value_name: "Casual Standard" }
      ]
    },
    {
      id: 100003,
      name: "Home & Living",
      attributeId: 50003,
      brands: [
        { value_id: 1, original_value_name: "Saigon Living" },
        { value_id: 2, original_value_name: "Nordic Minimalist" },
        { value_id: 3, original_value_name: "Eco Home" }
      ]
    }
  ];

  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { categoryId: BigInt(c.id) },
      update: { categoryName: c.name },
      create: {
        categoryId: BigInt(c.id),
        categoryName: c.name,
        parentId: BigInt(0),
        hasChildren: false
      }
    });

    await prisma.categoryAttribute.upsert({
      where: { attributeId: BigInt(c.attributeId) },
      update: {
        categoryId: cat.categoryId,
        name: "Brand",
        isMandatory: true,
        inputType: "DROP_DOWN",
        valueListJson: c.brands
      },
      create: {
        attributeId: BigInt(c.attributeId),
        categoryId: cat.categoryId,
        name: "Brand",
        isMandatory: true,
        inputType: "DROP_DOWN",
        valueListJson: c.brands
      }
    });
  }
  console.log(`✓ Ensured Categories & Attributes`);

  // 5. Seed Diverse Product Catalog
  const productsToSeed = [
    // Shop 1: Electronics (Shop ID: 727720655)
    {
      shopId: BigInt(727720655),
      categoryId: BigInt(100001),
      itemName: "SmartOmni Ultra Wireless ANC Headphones",
      description: "High-resolution audio, 45dB Active Noise Cancellation, Bluetooth 5.4, 60-hour battery life with fast charging.",
      originalPrice: 490000,
      currency: "VND",
      weight: 0.4,
      itemSku: "SO-ANC-HP",
      hasModel: true,
      tierVariationJson: [
        { name: "Color", option_list: [{ option: "Matte Black" }, { option: "Titanium Silver" }] },
        { name: "Warranty", option_list: [{ option: "Standard 1Y" }, { option: "Care Pro 2Y" }] }
      ],
      models: [
        { name: "Matte Black, Standard 1Y", sku: "SO-ANC-BLK-1Y", price: 490000, stock: 80, tierIndex: [0, 0] },
        { name: "Matte Black, Care Pro 2Y", sku: "SO-ANC-BLK-2Y", price: 550000, stock: 45, tierIndex: [0, 1] },
        { name: "Titanium Silver, Standard 1Y", sku: "SO-ANC-SLV-1Y", price: 490000, stock: 60, tierIndex: [1, 0] },
        { name: "Titanium Silver, Care Pro 2Y", sku: "SO-ANC-SLV-2Y", price: 550000, stock: 35, tierIndex: [1, 1] }
      ]
    },
    {
      shopId: BigInt(727720655),
      categoryId: BigInt(100001),
      itemName: "SmartOmni Pro Mechanical Gaming Keyboard RGB",
      description: "Hot-swappable mechanical keyboard with custom per-key RGB backlighting and PBT double-shot keycaps.",
      originalPrice: 790000,
      currency: "VND",
      weight: 0.85,
      itemSku: "SO-KB-RGB",
      hasModel: true,
      tierVariationJson: [
        { name: "Switch Type", option_list: [{ option: "Red Linear" }, { option: "Blue Clicky" }, { option: "Brown Tactile" }] }
      ],
      models: [
        { name: "Red Linear", sku: "SO-KB-RED", price: 790000, stock: 50, tierIndex: [0] },
        { name: "Blue Clicky", sku: "SO-KB-BLUE", price: 790000, stock: 40, tierIndex: [1] },
        { name: "Brown Tactile", sku: "SO-KB-BROWN", price: 820000, stock: 65, tierIndex: [2] }
      ]
    },
    {
      shopId: BigInt(727720655),
      categoryId: BigInt(100001),
      itemName: "SmartOmni 15W Magnetic Wireless Fast Charger",
      description: "Ultra-slim aluminum alloy Qi-certified fast magnetic charging pad with intelligent temperature control.",
      originalPrice: 199000,
      currency: "VND",
      weight: 0.15,
      itemSku: "SO-CHG-15W",
      hasModel: false,
      models: [
        { name: "Standard Pack", sku: "SO-CHG-15W-STD", price: 199000, stock: 150, tierIndex: [0] }
      ]
    },
    {
      shopId: BigInt(727720655),
      categoryId: BigInt(100001),
      itemName: "SmartOmni 4K Ultra-HD Webcam with Dual AI Mic",
      description: "Crystal clear 4K @ 30FPS streaming camera with auto-focus and background noise isolation microphones.",
      originalPrice: 650000,
      currency: "VND",
      weight: 0.25,
      itemSku: "SO-CAM-4K",
      hasModel: false,
      models: [
        { name: "Standard Black", sku: "SO-CAM-4K-BLK", price: 650000, stock: 75, tierIndex: [0] }
      ]
    },

    // Shop 2: Fashion (Shop ID: 839910244)
    {
      shopId: BigInt(839910244),
      categoryId: BigInt(100002),
      itemName: "Vintage Washed Heavyweight 260GSM Oversized Tee",
      description: "100% premium combed cotton heavyweight streetwear graphic t-shirt with ribbed collar and drop-shoulder fit.",
      originalPrice: 189000,
      currency: "VND",
      weight: 0.3,
      itemSku: "HN-TEE-260",
      hasModel: true,
      tierVariationJson: [
        { name: "Color", option_list: [{ option: "Acid Wash Black" }, { option: "Vintage Cream" }] },
        { name: "Size", option_list: [{ option: "Size M" }, { option: "Size L" }, { option: "Size XL" }] }
      ],
      models: [
        { name: "Acid Wash Black, Size M", sku: "HN-TEE-BLK-M", price: 189000, stock: 60, tierIndex: [0, 0] },
        { name: "Acid Wash Black, Size L", sku: "HN-TEE-BLK-L", price: 189000, stock: 90, tierIndex: [0, 1] },
        { name: "Acid Wash Black, Size XL", sku: "HN-TEE-BLK-XL", price: 199000, stock: 45, tierIndex: [0, 2] },
        { name: "Vintage Cream, Size M", sku: "HN-TEE-CRM-M", price: 189000, stock: 50, tierIndex: [1, 0] },
        { name: "Vintage Cream, Size L", sku: "HN-TEE-CRM-L", price: 189000, stock: 70, tierIndex: [1, 1] },
        { name: "Vintage Cream, Size XL", sku: "HN-TEE-CRM-XL", price: 199000, stock: 35, tierIndex: [1, 2] }
      ]
    },
    {
      shopId: BigInt(839910244),
      categoryId: BigInt(100002),
      itemName: "Classic Raw Selvedge Denim Jacket Unisex",
      description: "14oz Japanese raw selvedge denim trucker jacket with custom antique brass hardware and reinforced seams.",
      originalPrice: 520000,
      currency: "VND",
      weight: 0.9,
      itemSku: "HN-DNM-JKT",
      hasModel: true,
      tierVariationJson: [
        { name: "Color", option_list: [{ option: "Raw Indigo" }, { option: "Washed Blue" }] },
        { name: "Size", option_list: [{ option: "Size L" }, { option: "Size XL" }] }
      ],
      models: [
        { name: "Raw Indigo, Size L", sku: "HN-DNM-IND-L", price: 520000, stock: 25, tierIndex: [0, 0] },
        { name: "Raw Indigo, Size XL", sku: "HN-DNM-IND-XL", price: 520000, stock: 20, tierIndex: [0, 1] },
        { name: "Washed Blue, Size L", sku: "HN-DNM-BLU-L", price: 540000, stock: 30, tierIndex: [1, 0] },
        { name: "Washed Blue, Size XL", sku: "HN-DNM-BLU-XL", price: 540000, stock: 15, tierIndex: [1, 1] }
      ]
    },
    {
      shopId: BigInt(839910244),
      categoryId: BigInt(100002),
      itemName: "Retro Vulcanized Canvas Low-Top Sneakers",
      description: "Durable organic canvas upper with cushioned insole and non-slip vulcanized rubber waffle outsole.",
      originalPrice: 340000,
      currency: "VND",
      weight: 0.8,
      itemSku: "HN-SNK-CAN",
      hasModel: true,
      tierVariationJson: [
        { name: "Shoe Size", option_list: [{ option: "EU 40" }, { option: "EU 41" }, { option: "EU 42" }] }
      ],
      models: [
        { name: "EU 40", sku: "HN-SNK-40", price: 340000, stock: 35, tierIndex: [0] },
        { name: "EU 41", sku: "HN-SNK-41", price: 340000, stock: 45, tierIndex: [1] },
        { name: "EU 42", sku: "HN-SNK-42", price: 340000, stock: 40, tierIndex: [2] }
      ]
    },

    // Shop 3: Home & Living (Shop ID: 910283751)
    {
      shopId: BigInt(910283751),
      categoryId: BigInt(100003),
      itemName: "Nordic Minimalist Matte Ceramic Coffee Mug (380ml)",
      description: "Handcrafted matte ceramic stoneware coffee cup with ergonomic wooden handle and heat retention glaze.",
      originalPrice: 145000,
      currency: "VND",
      weight: 0.35,
      itemSku: "SG-MUG-CER",
      hasModel: true,
      tierVariationJson: [
        { name: "Glaze Finish", option_list: [{ option: "Terracotta" }, { option: "Matcha Sage" }, { option: "Matte Cream" }] }
      ],
      models: [
        { name: "Terracotta", sku: "SG-MUG-TER", price: 145000, stock: 65, tierIndex: [0] },
        { name: "Matcha Sage", sku: "SG-MUG-MAT", price: 145000, stock: 55, tierIndex: [1] },
        { name: "Matte Cream", sku: "SG-MUG-CRM", price: 145000, stock: 75, tierIndex: [2] }
      ]
    },
    {
      shopId: BigInt(910283751),
      categoryId: BigInt(100003),
      itemName: "Natural Soy Wax Aromatherapy Scented Candle (200g)",
      description: "Eco-friendly natural soy wax candle infused with pure botanical essential oils. Burns clean for 45 hours.",
      originalPrice: 129000,
      currency: "VND",
      weight: 0.45,
      itemSku: "SG-CDL-SOY",
      hasModel: true,
      tierVariationJson: [
        { name: "Fragrance", option_list: [{ option: "English Pear & Freesia" }, { option: "Sandalwood & Cedar" }] }
      ],
      models: [
        { name: "English Pear & Freesia", sku: "SG-CDL-PEAR", price: 129000, stock: 90, tierIndex: [0] },
        { name: "Sandalwood & Cedar", sku: "SG-CDL-WOOD", price: 139000, stock: 80, tierIndex: [1] }
      ]
    },
    {
      shopId: BigInt(910283751),
      categoryId: BigInt(100003),
      itemName: "Ergonomic Memory Foam Lumbar Support Back Cushion",
      description: "Orthopedic contoured memory foam pillow designed to relieve lower back pain during long sitting hours.",
      originalPrice: 249000,
      currency: "VND",
      weight: 0.6,
      itemSku: "SG-CUS-LUM",
      hasModel: false,
      models: [
        { name: "Standard Ergonomic", sku: "SG-CUS-LUM-STD", price: 249000, stock: 60, tierIndex: [0] }
      ]
    }
  ];

  for (const prodData of productsToSeed) {
    const existing = await prisma.product.findFirst({
      where: { shopId: prodData.shopId, itemSku: prodData.itemSku }
    });

    if (!existing) {
      const createdProd = await prisma.product.create({
        data: {
          shopId: prodData.shopId,
          categoryId: prodData.categoryId,
          itemName: prodData.itemName,
          description: prodData.description,
          originalPrice: prodData.originalPrice,
          currency: prodData.currency,
          weight: prodData.weight,
          itemSku: prodData.itemSku,
          hasModel: prodData.hasModel,
          tierVariationJson: (prodData.tierVariationJson as any) ?? undefined,
          imagesJson: {
            image_id_list: ["img_sample_1", "img_sample_2"],
            image_url_list: ["https://cf.shopee.vn/file/mock_default_image"]
          }
        }
      });

      for (const m of prodData.models) {
        await prisma.productModel.create({
          data: {
            itemId: createdProd.itemId,
            modelName: m.name,
            modelSku: m.sku,
            tierIndex: m.tierIndex,
            originalPrice: m.price,
            sellerStock: m.stock
          }
        });
      }
    }
  }
  console.log(`✓ Seeded ${productsToSeed.length} Products with multi-tier variation grids across 3 shops`);

  // 6. Ensure Simulator Config Defaults
  await prisma.simulatorConfig.upsert({
    where: { id: 1 },
    update: {
      rateLimitEnabled: false,
      rateLimitPerMin: 100,
      forceExpiredToken: false,
      forceInvalidSign: false,
      artificialDelayMs: 0,
      strictTimestamp: true
    },
    create: {
      id: 1,
      rateLimitEnabled: false,
      rateLimitPerMin: 100,
      forceExpiredToken: false,
      forceInvalidSign: false,
      artificialDelayMs: 0,
      strictTimestamp: true
    }
  });
  console.log(`✓ Configured Simulator Fault Injection defaults`);

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
