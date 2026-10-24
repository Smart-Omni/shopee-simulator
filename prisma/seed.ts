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
    const defaultAddressId = s.shopId === BigInt(727720655) ? BigInt(1) : BigInt(Number(s.shopId) % 100000);
    await prisma.shopAddress.upsert({
      where: { addressId: defaultAddressId },
      update: {},
      create: {
        addressId: defaultAddressId,
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

    if (s.shopId === BigInt(727720655)) {
      await prisma.shopAddress.upsert({
        where: { addressId: BigInt(20655) },
        update: {},
        create: {
          addressId: BigInt(20655),
          shopId: s.shopId,
          addressType: "PICKUP",
          name: `${s.shopName} Secondary Hub`,
          phone: "+84901234567",
          address: "123 Le Duan Street",
          district: "District 1",
          city: "Ho Chi Minh City",
          state: "Ho Chi Minh",
          region: "VN",
          zipcode: "700000"
        }
      });
    }

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

  // Product pickup methods shown in the Shopiz seller product editor.
  const productShippingOptions = [
    {
      optionId: "pickup_point",
      optionName: "Điểm nhận hàng",
      optionGroup: "Lấy hàng chủ động",
      partnerLabel: "ĐỐI TÁC SHOPEE",
      maximumWeightGram: 10000,
      sortOrder: 1,
      enabled: true
    },
    {
      optionId: "viettel_smartbox",
      optionName: "Tủ nhận hàng - Viettel Smartbox",
      optionGroup: "Lấy hàng chủ động",
      partnerLabel: "ĐỐI TÁC SHOPEE",
      maximumWeightGram: 10000,
      sortOrder: 2,
      enabled: true
    }
  ];

  for (const option of productShippingOptions) {
    await prisma.productShippingOption.upsert({
      where: { optionId: option.optionId },
      update: {
        optionName: option.optionName,
        optionGroup: option.optionGroup,
        partnerLabel: option.partnerLabel,
        maximumWeightGram: option.maximumWeightGram,
        sortOrder: option.sortOrder,
        enabled: option.enabled
      },
      create: option
    });
  }
  console.log(`✓ Ensured ${productShippingOptions.length} product shipping options`);

  // 4. Seed Shopee 3-Level Category Tree & Rich Attributes
  const treeCategoriesData = [
    // ------------------------------------------------------------------------
    // LEVEL 1: ROOT CATEGORIES (parentId: 0, hasChildren: true)
    // ------------------------------------------------------------------------
    { categoryId: BigInt(100000), parentId: BigInt(0), categoryName: "Thiết Bị Điện Tử & Công Nghệ", hasChildren: true },
    { categoryId: BigInt(200000), parentId: BigInt(0), categoryName: "Thời Trang & Phụ Kiện", hasChildren: true },
    { categoryId: BigInt(300000), parentId: BigInt(0), categoryName: "Nhà Cửa & Đời Sống", hasChildren: true },
    { categoryId: BigInt(400000), parentId: BigInt(0), categoryName: "Sức Khỏe & Sắc Đẹp", hasChildren: true },
    { categoryId: BigInt(500000), parentId: BigInt(0), categoryName: "Thiết Bị Điện Gia Dụng", hasChildren: true },
    { categoryId: BigInt(600000), parentId: BigInt(0), categoryName: "Bách Hóa Online & Thực Phẩm", hasChildren: true },

    // ------------------------------------------------------------------------
    // LEVEL 2: SUBCATEGORIES (parentId: L1_ID, hasChildren: true)
    // ------------------------------------------------------------------------
    // Under 100000: Thiết Bị Điện Tử & Công Nghệ
    { categoryId: BigInt(110000), parentId: BigInt(100000), categoryName: "Điện Thoại & Phụ Kiện", hasChildren: true },
    { categoryId: BigInt(120000), parentId: BigInt(100000), categoryName: "Máy Tính & Laptop", hasChildren: true },
    { categoryId: BigInt(130000), parentId: BigInt(100000), categoryName: "Thiết Bị Âm Thanh", hasChildren: true },

    // Under 200000: Thời Trang & Phụ Kiện
    { categoryId: BigInt(210000), parentId: BigInt(200000), categoryName: "Thời Trang Nam", hasChildren: true },
    { categoryId: BigInt(220000), parentId: BigInt(200000), categoryName: "Thời Trang Nữ", hasChildren: true },
    { categoryId: BigInt(230000), parentId: BigInt(200000), categoryName: "Giày Dép & Sneakers", hasChildren: true },

    // Under 300000: Nhà Cửa & Đời Sống
    { categoryId: BigInt(310000), parentId: BigInt(300000), categoryName: "Nội Thất Nhà Ở", hasChildren: true },
    { categoryId: BigInt(320000), parentId: BigInt(300000), categoryName: "Dụng Cụ Bếp & Bàn Ăn", hasChildren: true },

    // Under 400000: Sức Khỏe & Sắc Đẹp
    { categoryId: BigInt(410000), parentId: BigInt(400000), categoryName: "Chăm Sóc Da Mặt", hasChildren: true },
    { categoryId: BigInt(420000), parentId: BigInt(400000), categoryName: "Trang Điểm & Son Môi", hasChildren: true },

    // Under 500000: Thiết Bị Điện Gia Dụng
    { categoryId: BigInt(510000), parentId: BigInt(500000), categoryName: "Thiết Bị Nhà Bếp Điện", hasChildren: true },
    { categoryId: BigInt(520000), parentId: BigInt(500000), categoryName: "Thiết Bị Làm Sạch & Làm Mát", hasChildren: true },

    // Under 600000: Bách Hóa Online & Thực Phẩm
    { categoryId: BigInt(610000), parentId: BigInt(600000), categoryName: "Đồ Ăn Vặt & Hạt Dinh Dưỡng", hasChildren: true },
    { categoryId: BigInt(620000), parentId: BigInt(600000), categoryName: "Đồ Uống & Trà Cà Phê", hasChildren: true },

    // ------------------------------------------------------------------------
    // LEVEL 3: LEAF CATEGORIES (parentId: L2_ID, hasChildren: false)
    // ------------------------------------------------------------------------
    // Under 110000: Điện Thoại & Phụ Kiện
    { categoryId: BigInt(100001), parentId: BigInt(110000), categoryName: "Electronics", hasChildren: false }, // PRESERVED TEST NODE
    { categoryId: BigInt(110002), parentId: BigInt(110000), categoryName: "Điện Thoại Di Động", hasChildren: false },
    { categoryId: BigInt(110003), parentId: BigInt(110000), categoryName: "Phụ Kiện Điện Thoại", hasChildren: false },

    // Under 120000: Máy Tính & Laptop
    { categoryId: BigInt(120001), parentId: BigInt(120000), categoryName: "Laptop & Máy Tính Xách Tay", hasChildren: false },

    // Under 130000: Thiết Bị Âm Thanh
    { categoryId: BigInt(130001), parentId: BigInt(130000), categoryName: "Tai Nghe & Loa Bluetooth", hasChildren: false },

    // Under 210000: Thời Trang Nam
    { categoryId: BigInt(100002), parentId: BigInt(210000), categoryName: "Fashion & Apparel", hasChildren: false }, // PRESERVED TEST NODE
    { categoryId: BigInt(210001), parentId: BigInt(210000), categoryName: "Áo Thun & Áo Polo Nam", hasChildren: false },
    { categoryId: BigInt(210002), parentId: BigInt(210000), categoryName: "Quần Jeans & Quần Dài Nam", hasChildren: false },

    // Under 220000: Thời Trang Nữ
    { categoryId: BigInt(220001), parentId: BigInt(220000), categoryName: "Đầm & Chân Váy Nữ", hasChildren: false },

    // Under 230000: Giày Dép & Sneakers
    { categoryId: BigInt(230001), parentId: BigInt(230000), categoryName: "Giày Sneaker Thể Thao", hasChildren: false },

    // Under 310000: Nội Thất Nhà Ở
    { categoryId: BigInt(100003), parentId: BigInt(310000), categoryName: "Home & Living", hasChildren: false }, // PRESERVED TEST NODE
    { categoryId: BigInt(310001), parentId: BigInt(310000), categoryName: "Bàn Ghế Làm Việc", hasChildren: false },

    // Under 320000: Dụng Cụ Bếp & Bàn Ăn
    { categoryId: BigInt(320001), parentId: BigInt(320000), categoryName: "Xoong Nồi & Chảo Chống Dính", hasChildren: false },

    // Under 410000: Chăm Sóc Da Mặt
    { categoryId: BigInt(410001), parentId: BigInt(410000), categoryName: "Serum & Tinh Chất Dưỡng Da", hasChildren: false },
    { categoryId: BigInt(410002), parentId: BigInt(410000), categoryName: "Kem Chống Nắng", hasChildren: false },

    // Under 420000: Trang Điểm & Son Môi
    { categoryId: BigInt(420001), parentId: BigInt(420000), categoryName: "Son Môi & Son Dưỡng", hasChildren: false },

    // Under 510000: Thiết Bị Nhà Bếp Điện
    { categoryId: BigInt(510001), parentId: BigInt(510000), categoryName: "Nồi Chiên Không Dầu", hasChildren: false },
    { categoryId: BigInt(510002), parentId: BigInt(510000), categoryName: "Ấm Siêu Tốc & Bình Đun", hasChildren: false },

    // Under 520000: Thiết Bị Làm Sạch & Làm Mát
    { categoryId: BigInt(520001), parentId: BigInt(520000), categoryName: "Máy Lọc Không Khí", hasChildren: false },

    // Under 610000: Đồ Ăn Vặt & Hạt Dinh Dưỡng
    { categoryId: BigInt(610001), parentId: BigInt(610000), categoryName: "Hạt Dinh Dưỡng & Ngũ Cốc", hasChildren: false },

    // Under 620000: Đồ Uống & Trà Cà Phê
    { categoryId: BigInt(620001), parentId: BigInt(620000), categoryName: "Cà Phê & Trà Thượng Hạng", hasChildren: false },
  ];

  for (const c of treeCategoriesData) {
    await prisma.category.upsert({
      where: { categoryId: c.categoryId },
      update: {
        categoryName: c.categoryName,
        parentId: c.parentId,
        hasChildren: c.hasChildren,
      },
      create: {
        categoryId: c.categoryId,
        categoryName: c.categoryName,
        parentId: c.parentId,
        hasChildren: c.hasChildren,
      },
    });
  }

  // --------------------------------------------------------------------------
  // Category Attributes (Mandatory & Key Attributes)
  // --------------------------------------------------------------------------
  const categoryAttributesData = [
    // 100001: Electronics (Preserved for tests - Brand attribute 50001 must have exactly 3 options)
    {
      attributeId: BigInt(50001),
      categoryId: BigInt(100001),
      name: "Brand",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Apple" },
        { value_id: 2, original_value_name: "Samsung" },
        { value_id: 3, original_value_name: "Xiaomi" },
      ],
    },
    {
      attributeId: BigInt(50004),
      categoryId: BigInt(100001),
      name: "Hạn bảo hành",
      isMandatory: false,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "12 tháng" },
        { value_id: 2, original_value_name: "24 tháng" },
        { value_id: 3, original_value_name: "36 tháng" },
      ],
    },
    {
      attributeId: BigInt(50005),
      categoryId: BigInt(100001),
      name: "Dung lượng lưu trữ",
      isMandatory: false,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "128GB" },
        { value_id: 2, original_value_name: "256GB" },
        { value_id: 3, original_value_name: "512GB" },
        { value_id: 4, original_value_name: "1TB" },
      ],
    },

    // 110002: Điện Thoại Di Động
    {
      attributeId: BigInt(110021),
      categoryId: BigInt(110002),
      name: "Thương hiệu",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Apple" },
        { value_id: 2, original_value_name: "Samsung" },
        { value_id: 3, original_value_name: "Xiaomi" },
        { value_id: 4, original_value_name: "OPPO" },
        { value_id: 5, original_value_name: "vivo" },
        { value_id: 6, original_value_name: "Realme" },
        { value_id: 7, original_value_name: "No Brand" },
      ],
    },
    {
      attributeId: BigInt(110022),
      categoryId: BigInt(110002),
      name: "Hạn bảo hành",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "12 tháng" },
        { value_id: 2, original_value_name: "18 tháng" },
        { value_id: 3, original_value_name: "24 tháng" },
      ],
    },
    {
      attributeId: BigInt(110023),
      categoryId: BigInt(110002),
      name: "Dung lượng lưu trữ",
      isMandatory: false,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "64GB" },
        { value_id: 2, original_value_name: "128GB" },
        { value_id: 3, original_value_name: "256GB" },
        { value_id: 4, original_value_name: "512GB" },
        { value_id: 5, original_value_name: "1TB" },
      ],
    },
    {
      attributeId: BigInt(110024),
      categoryId: BigInt(110002),
      name: "Bộ nhớ RAM",
      isMandatory: false,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "4GB" },
        { value_id: 2, original_value_name: "6GB" },
        { value_id: 3, original_value_name: "8GB" },
        { value_id: 4, original_value_name: "12GB" },
        { value_id: 5, original_value_name: "16GB" },
      ],
    },
    {
      attributeId: BigInt(110025),
      categoryId: BigInt(110002),
      name: "Kích thước màn hình",
      isMandatory: false,
      inputType: "COMBO_BOX",
      valueListJson: [
        { value_id: 1, original_value_name: "6.1 inch" },
        { value_id: 2, original_value_name: "6.5 inch" },
        { value_id: 3, original_value_name: "6.7 inch" },
        { value_id: 4, original_value_name: "6.8 inch" },
      ],
    },

    // 110003: Phụ Kiện Điện Thoại
    {
      attributeId: BigInt(110031),
      categoryId: BigInt(110003),
      name: "Thương hiệu",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Anker" },
        { value_id: 2, original_value_name: "Baseus" },
        { value_id: 3, original_value_name: "Ugreen" },
        { value_id: 4, original_value_name: "Apple" },
        { value_id: 5, original_value_name: "Samsung" },
        { value_id: 6, original_value_name: "No Brand" },
      ],
    },
    {
      attributeId: BigInt(110032),
      categoryId: BigInt(110003),
      name: "Loại phụ kiện",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Cáp sạc & Củ sạc nhanh" },
        { value_id: 2, original_value_name: "Ốp lưng & Bao da" },
        { value_id: 3, original_value_name: "Kính cường lực bảo vệ màn hình" },
        { value_id: 4, original_value_name: "Pin sạc dự phòng" },
        { value_id: 5, original_value_name: "Giá đỡ điện thoại" },
      ],
    },
    {
      attributeId: BigInt(110033),
      categoryId: BigInt(110003),
      name: "Hạn bảo hành",
      isMandatory: false,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "3 tháng" },
        { value_id: 2, original_value_name: "6 tháng" },
        { value_id: 3, original_value_name: "12 tháng" },
        { value_id: 4, original_value_name: "18 tháng" },
      ],
    },

    // 120001: Laptop & Máy Tính Xách Tay
    {
      attributeId: BigInt(120011),
      categoryId: BigInt(120001),
      name: "Thương hiệu",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Apple" },
        { value_id: 2, original_value_name: "ASUS" },
        { value_id: 3, original_value_name: "Dell" },
        { value_id: 4, original_value_name: "Lenovo" },
        { value_id: 5, original_value_name: "HP" },
        { value_id: 6, original_value_name: "Acer" },
        { value_id: 7, original_value_name: "MSI" },
      ],
    },
    {
      attributeId: BigInt(120012),
      categoryId: BigInt(120001),
      name: "Hạn bảo hành",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "12 tháng" },
        { value_id: 2, original_value_name: "24 tháng" },
        { value_id: 3, original_value_name: "36 tháng" },
      ],
    },
    {
      attributeId: BigInt(120013),
      categoryId: BigInt(120001),
      name: "Vi xử lý CPU",
      isMandatory: false,
      inputType: "COMBO_BOX",
      valueListJson: [
        { value_id: 1, original_value_name: "Apple M-Series" },
        { value_id: 2, original_value_name: "Intel Core i5" },
        { value_id: 3, original_value_name: "Intel Core i7" },
        { value_id: 4, original_value_name: "Intel Core i9" },
        { value_id: 5, original_value_name: "AMD Ryzen 5" },
        { value_id: 6, original_value_name: "AMD Ryzen 7" },
      ],
    },
    {
      attributeId: BigInt(120014),
      categoryId: BigInt(120001),
      name: "Dung lượng RAM",
      isMandatory: false,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "8GB" },
        { value_id: 2, original_value_name: "16GB" },
        { value_id: 3, original_value_name: "32GB" },
        { value_id: 4, original_value_name: "64GB" },
      ],
    },
    {
      attributeId: BigInt(120015),
      categoryId: BigInt(120001),
      name: "Ổ cứng lưu trữ",
      isMandatory: false,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "256GB SSD" },
        { value_id: 2, original_value_name: "512GB SSD" },
        { value_id: 3, original_value_name: "1TB SSD" },
        { value_id: 4, original_value_name: "2TB SSD" },
      ],
    },

    // 130001: Tai Nghe & Loa Bluetooth
    {
      attributeId: BigInt(130011),
      categoryId: BigInt(130001),
      name: "Thương hiệu",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Sony" },
        { value_id: 2, original_value_name: "JBL" },
        { value_id: 3, original_value_name: "Marshall" },
        { value_id: 4, original_value_name: "Apple" },
        { value_id: 5, original_value_name: "Soundpeats" },
        { value_id: 6, original_value_name: "Bose" },
      ],
    },
    {
      attributeId: BigInt(130012),
      categoryId: BigInt(130001),
      name: "Loại kết nối",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Bluetooth 5.3" },
        { value_id: 2, original_value_name: "Wireless 2.4GHz" },
        { value_id: 3, original_value_name: "Jack 3.5mm" },
        { value_id: 4, original_value_name: "Type-C" },
      ],
    },
    {
      attributeId: BigInt(130013),
      categoryId: BigInt(130001),
      name: "Hạn bảo hành",
      isMandatory: false,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "6 tháng" },
        { value_id: 2, original_value_name: "12 tháng" },
        { value_id: 3, original_value_name: "24 tháng" },
      ],
    },
    {
      attributeId: BigInt(130014),
      categoryId: BigInt(130001),
      name: "Tính năng âm thanh",
      isMandatory: false,
      inputType: "MULTI_SELECT",
      valueListJson: [
        { value_id: 1, original_value_name: "Chống ồn chủ động (ANC)" },
        { value_id: 2, original_value_name: "Xuyên âm (Ambient Sound)" },
        { value_id: 3, original_value_name: "Kháng nước IPX5/IPX7" },
        { value_id: 4, original_value_name: "Mic đàm thoại lọc ồn AI" },
      ],
    },

    // 100002: Fashion & Apparel (Preserved for tests)
    {
      attributeId: BigInt(50002),
      categoryId: BigInt(100002),
      name: "Brand",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "SmartOmni Apparel" },
        { value_id: 2, original_value_name: "Hanoi Streetwear" },
        { value_id: 3, original_value_name: "Casual Standard" },
      ],
    },
    {
      attributeId: BigInt(50006),
      categoryId: BigInt(100002),
      name: "Chất liệu",
      isMandatory: false,
      inputType: "COMBO_BOX",
      valueListJson: [
        { value_id: 1, original_value_name: "Cotton" },
        { value_id: 2, original_value_name: "Polyester" },
        { value_id: 3, original_value_name: "Denim" },
        { value_id: 4, original_value_name: "Linen" },
        { value_id: 5, original_value_name: "Spandex" },
      ],
    },
    {
      attributeId: BigInt(50007),
      categoryId: BigInt(100002),
      name: "Xuất xứ",
      isMandatory: false,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Việt Nam" },
        { value_id: 2, original_value_name: "Hàn Quốc" },
        { value_id: 3, original_value_name: "Nhật Bản" },
        { value_id: 4, original_value_name: "Trung Quốc" },
      ],
    },

    // 210001: Áo Thun & Áo Polo Nam
    {
      attributeId: BigInt(210011),
      categoryId: BigInt(210001),
      name: "Thương hiệu",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Coolmate" },
        { value_id: 2, original_value_name: "Routine" },
        { value_id: 3, original_value_name: "Biluxury" },
        { value_id: 4, original_value_name: "SSStutter" },
        { value_id: 5, original_value_name: "No Brand" },
      ],
    },
    {
      attributeId: BigInt(210012),
      categoryId: BigInt(210001),
      name: "Chất liệu",
      isMandatory: true,
      inputType: "COMBO_BOX",
      valueListJson: [
        { value_id: 1, original_value_name: "100% Cotton 2 chiều" },
        { value_id: 2, original_value_name: "Cotton Compact chải kỹ" },
        { value_id: 3, original_value_name: "Vải cá sấu CVC cao cấp" },
        { value_id: 4, original_value_name: "Vải thể thao Spandex" },
      ],
    },
    {
      attributeId: BigInt(210013),
      categoryId: BigInt(210001),
      name: "Xuất xứ",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Việt Nam" },
        { value_id: 2, original_value_name: "Quảng Châu" },
        { value_id: 3, original_value_name: "Hàn Quốc" },
      ],
    },
    {
      attributeId: BigInt(210014),
      categoryId: BigInt(210001),
      name: "Kiểu dáng",
      isMandatory: false,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Form rộng Oversized" },
        { value_id: 2, original_value_name: "Tiêu chuẩn Regular Fit" },
        { value_id: 3, original_value_name: "Ôm vừa Slim Fit" },
      ],
    },

    // 210002: Quần Jeans & Quần Dài Nam
    {
      attributeId: BigInt(210021),
      categoryId: BigInt(210002),
      name: "Thương hiệu",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Levis" },
        { value_id: 2, original_value_name: "GenViet" },
        { value_id: 3, original_value_name: "Torano" },
        { value_id: 4, original_value_name: "Viet Tien" },
        { value_id: 5, original_value_name: "No Brand" },
      ],
    },
    {
      attributeId: BigInt(210022),
      categoryId: BigInt(210002),
      name: "Chất liệu",
      isMandatory: true,
      inputType: "COMBO_BOX",
      valueListJson: [
        { value_id: 1, original_value_name: "Vải Denim bò co giãn" },
        { value_id: 2, original_value_name: "Vải Kaki cotton dày dặn" },
        { value_id: 3, original_value_name: "Vải tây tuyết mưa chống nhăn" },
      ],
    },
    {
      attributeId: BigInt(210023),
      categoryId: BigInt(210002),
      name: "Xuất xứ",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Việt Nam" },
        { value_id: 2, original_value_name: "Hàn Quốc" },
        { value_id: 3, original_value_name: "Trung Quốc" },
      ],
    },

    // 220001: Đầm & Chân Váy Nữ
    {
      attributeId: BigInt(220011),
      categoryId: BigInt(220001),
      name: "Thương hiệu",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "IVY moda" },
        { value_id: 2, original_value_name: "Elise" },
        { value_id: 3, original_value_name: "NEM" },
        { value_id: 4, original_value_name: "Chic-Land" },
        { value_id: 5, original_value_name: "No Brand" },
      ],
    },
    {
      attributeId: BigInt(220012),
      categoryId: BigInt(220001),
      name: "Chất liệu",
      isMandatory: true,
      inputType: "COMBO_BOX",
      valueListJson: [
        { value_id: 1, original_value_name: "Lụa tơ tằm" },
        { value_id: 2, original_value_name: "Voan tơ cao cấp" },
        { value_id: 3, original_value_name: "Linen tưng tự nhiên" },
        { value_id: 4, original_value_name: "Ren cotton thêu" },
      ],
    },
    {
      attributeId: BigInt(220013),
      categoryId: BigInt(220001),
      name: "Xuất xứ",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Việt Nam" },
        { value_id: 2, original_value_name: "Hàn Quốc" },
        { value_id: 3, original_value_name: "Pháp" },
      ],
    },
    {
      attributeId: BigInt(220014),
      categoryId: BigInt(220001),
      name: "Dáng đầm",
      isMandatory: false,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Dáng chữ A thanh lịch" },
        { value_id: 2, original_value_name: "Đầm suông giấu dáng" },
        { value_id: 3, original_value_name: "Đầm ôm body quyến rũ" },
        { value_id: 4, original_value_name: "Đầm xòe công chúa" },
      ],
    },

    // 230001: Giày Sneaker Thể Thao
    {
      attributeId: BigInt(230011),
      categoryId: BigInt(230001),
      name: "Thương hiệu",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Nike" },
        { value_id: 2, original_value_name: "Adidas" },
        { value_id: 3, original_value_name: "New Balance" },
        { value_id: 4, original_value_name: "Biti's Hunter" },
        { value_id: 5, original_value_name: "Converse" },
        { value_id: 6, original_value_name: "Vans" },
      ],
    },
    {
      attributeId: BigInt(230012),
      categoryId: BigInt(230001),
      name: "Xuất xứ",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Việt Nam" },
        { value_id: 2, original_value_name: "Indonesia" },
        { value_id: 3, original_value_name: "Trung Quốc" },
      ],
    },
    {
      attributeId: BigInt(230013),
      categoryId: BigInt(230001),
      name: "Chất liệu thân trên",
      isMandatory: false,
      inputType: "COMBO_BOX",
      valueListJson: [
        { value_id: 1, original_value_name: "Da bò thật" },
        { value_id: 2, original_value_name: "Da tổng hợp PU cao cấp" },
        { value_id: 3, original_value_name: "Vải lưới dệt Flyknit/Mesh" },
        { value_id: 4, original_value_name: "Vải Canvas" },
      ],
    },
    {
      attributeId: BigInt(230014),
      categoryId: BigInt(230001),
      name: "Chất liệu đế giày",
      isMandatory: false,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Cao su đúc nguyên khối chống trượt" },
        { value_id: 2, original_value_name: "Đệm khí Air êm ái" },
        { value_id: 3, original_value_name: "Đệm bọt EVA đàn hồi cao" },
      ],
    },

    // 100003: Home & Living (Preserved for tests)
    {
      attributeId: BigInt(50003),
      categoryId: BigInt(100003),
      name: "Brand",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Saigon Living" },
        { value_id: 2, original_value_name: "Nordic Minimalist" },
        { value_id: 3, original_value_name: "Eco Home" },
      ],
    },
    {
      attributeId: BigInt(50008),
      categoryId: BigInt(100003),
      name: "Chất liệu",
      isMandatory: false,
      inputType: "COMBO_BOX",
      valueListJson: [
        { value_id: 1, original_value_name: "Gỗ MDF" },
        { value_id: 2, original_value_name: "Gỗ sồi tự nhiên" },
        { value_id: 3, original_value_name: "Thép sơn tĩnh điện" },
      ],
    },

    // 310001: Bàn Ghế Làm Việc
    {
      attributeId: BigInt(310011),
      categoryId: BigInt(310001),
      name: "Thương hiệu",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Hòa Phát" },
        { value_id: 2, original_value_name: "IBIE" },
        { value_id: 3, original_value_name: "D'Ergo" },
        { value_id: 4, original_value_name: "Sihoo" },
        { value_id: 5, original_value_name: "OEM Nội Thất" },
      ],
    },
    {
      attributeId: BigInt(310012),
      categoryId: BigInt(310001),
      name: "Chất liệu",
      isMandatory: true,
      inputType: "COMBO_BOX",
      valueListJson: [
        { value_id: 1, original_value_name: "Gỗ công nghiệp MDF phủ Melamine chống nước" },
        { value_id: 2, original_value_name: "Gỗ cao su tự nhiên ghép thanh" },
        { value_id: 3, original_value_name: "Khung thép carbon sơn tĩnh điện" },
      ],
    },
    {
      attributeId: BigInt(310013),
      categoryId: BigInt(310001),
      name: "Yêu cầu lắp ráp",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Có (kèm đầy đủ ốc vít và hướng dẫn lắp ráp)" },
        { value_id: 2, original_value_name: "Không (sản phẩm nguyên khối hoàn thiện)" },
      ],
    },
    {
      attributeId: BigInt(310014),
      categoryId: BigInt(310001),
      name: "Hạn bảo hành",
      isMandatory: false,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "6 tháng" },
        { value_id: 2, original_value_name: "12 tháng" },
        { value_id: 3, original_value_name: "24 tháng" },
        { value_id: 4, original_value_name: "36 tháng" },
      ],
    },

    // 320001: Xoong Nồi & Chảo Chống Dính
    {
      attributeId: BigInt(320011),
      categoryId: BigInt(320001),
      name: "Thương hiệu",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Tefal" },
        { value_id: 2, original_value_name: "Elmich" },
        { value_id: 3, original_value_name: "Fivestar" },
        { value_id: 4, original_value_name: "Sunhouse" },
        { value_id: 5, original_value_name: "Lock&Lock" },
      ],
    },
    {
      attributeId: BigInt(320012),
      categoryId: BigInt(320001),
      name: "Chất liệu",
      isMandatory: true,
      inputType: "COMBO_BOX",
      valueListJson: [
        { value_id: 1, original_value_name: "Inox 304 cao cấp 3 đáy" },
        { value_id: 2, original_value_name: "Hợp kim nhôm đúc nguyên khối" },
        { value_id: 3, original_value_name: "Gang tráng men sứ" },
      ],
    },
    {
      attributeId: BigInt(320013),
      categoryId: BigInt(320001),
      name: "Loại bếp sử dụng",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Dùng được cho mọi loại bếp kể cả bếp từ" },
        { value_id: 2, original_value_name: "Bếp ga và bếp hồng ngoại" },
      ],
    },
    {
      attributeId: BigInt(320014),
      categoryId: BigInt(320001),
      name: "Đường kính chảo/nồi",
      isMandatory: false,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "18cm" },
        { value_id: 2, original_value_name: "20cm" },
        { value_id: 3, original_value_name: "24cm" },
        { value_id: 4, original_value_name: "26cm" },
        { value_id: 5, original_value_name: "28cm" },
      ],
    },

    // 410001: Serum & Tinh Chất Dưỡng Da
    {
      attributeId: BigInt(410011),
      categoryId: BigInt(410001),
      name: "Thương hiệu",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "La Roche-Posay" },
        { value_id: 2, original_value_name: "Paula's Choice" },
        { value_id: 3, original_value_name: "The Ordinary" },
        { value_id: 4, original_value_name: "Kiehl's" },
        { value_id: 5, original_value_name: "Klairs" },
        { value_id: 6, original_value_name: "CeraVe" },
        { value_id: 7, original_value_name: "Skin1004" },
      ],
    },
    {
      attributeId: BigInt(410012),
      categoryId: BigInt(410001),
      name: "Hạn sử dụng",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "24 tháng kể từ NSX" },
        { value_id: 2, original_value_name: "36 tháng kể từ NSX" },
      ],
    },
    {
      attributeId: BigInt(410013),
      categoryId: BigInt(410001),
      name: "Loại da phù hợp",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Mọi loại da" },
        { value_id: 2, original_value_name: "Da dầu mụn" },
        { value_id: 3, original_value_name: "Da khô thiếu nước" },
        { value_id: 4, original_value_name: "Da nhạy cảm kích ứng" },
      ],
    },
    {
      attributeId: BigInt(410014),
      categoryId: BigInt(410001),
      name: "Dung tích",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "15ml" },
        { value_id: 2, original_value_name: "30ml" },
        { value_id: 3, original_value_name: "50ml" },
        { value_id: 4, original_value_name: "100ml" },
      ],
    },
    {
      attributeId: BigInt(410015),
      categoryId: BigInt(410001),
      name: "Xuất xứ",
      isMandatory: false,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Pháp" },
        { value_id: 2, original_value_name: "Mỹ" },
        { value_id: 3, original_value_name: "Hàn Quốc" },
        { value_id: 4, original_value_name: "Nhật Bản" },
        { value_id: 5, original_value_name: "Canada" },
        { value_id: 6, original_value_name: "Việt Nam" },
      ],
    },

    // 410002: Kem Chống Nắng
    {
      attributeId: BigInt(410021),
      categoryId: BigInt(410002),
      name: "Thương hiệu",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Anessa" },
        { value_id: 2, original_value_name: "La Roche-Posay" },
        { value_id: 3, original_value_name: "Skin1004" },
        { value_id: 4, original_value_name: "Cell Fusion C" },
        { value_id: 5, original_value_name: "Sunplay Skin Aqua" },
      ],
    },
    {
      attributeId: BigInt(410022),
      categoryId: BigInt(410002),
      name: "Chỉ số chống nắng",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "SPF 50+ PA++++" },
        { value_id: 2, original_value_name: "SPF 50+ PA+++" },
        { value_id: 3, original_value_name: "SPF 30+ PA+++" },
      ],
    },
    {
      attributeId: BigInt(410023),
      categoryId: BigInt(410002),
      name: "Hạn sử dụng",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "24 tháng kể từ NSX" },
        { value_id: 2, original_value_name: "36 tháng kể từ NSX" },
      ],
    },

    // 420001: Son Môi & Son Dưỡng
    {
      attributeId: BigInt(420011),
      categoryId: BigInt(420001),
      name: "Thương hiệu",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "3CE" },
        { value_id: 2, original_value_name: "MAC" },
        { value_id: 3, original_value_name: "Romand" },
        { value_id: 4, original_value_name: "Black Rouge" },
        { value_id: 5, original_value_name: "Dior" },
        { value_id: 6, original_value_name: "YSL" },
        { value_id: 7, original_value_name: "DHC" },
      ],
    },
    {
      attributeId: BigInt(420012),
      categoryId: BigInt(420001),
      name: "Hạn sử dụng",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "24 tháng kể từ NSX" },
        { value_id: 2, original_value_name: "36 tháng kể từ NSX" },
      ],
    },
    {
      attributeId: BigInt(420013),
      categoryId: BigInt(420001),
      name: "Chất son",
      isMandatory: false,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Son kem lì Velvet/Tint" },
        { value_id: 2, original_value_name: "Son thỏi lì Matte" },
        { value_id: 3, original_value_name: "Son bóng dưỡng ẩm Juicy Tint" },
        { value_id: 4, original_value_name: "Son sáp dưỡng có màu" },
      ],
    },

    // 510001: Nồi Chiên Không Dầu
    {
      attributeId: BigInt(510011),
      categoryId: BigInt(510001),
      name: "Thương hiệu",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Philips" },
        { value_id: 2, original_value_name: "Tefal" },
        { value_id: 3, original_value_name: "Lock&Lock" },
        { value_id: 4, original_value_name: "Kalite" },
        { value_id: 5, original_value_name: "Xiaomi" },
        { value_id: 6, original_value_name: "Mishio" },
      ],
    },
    {
      attributeId: BigInt(510012),
      categoryId: BigInt(510001),
      name: "Công suất",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "1400W" },
        { value_id: 2, original_value_name: "1500W" },
        { value_id: 3, original_value_name: "1800W" },
        { value_id: 4, original_value_name: "2000W" },
        { value_id: 5, original_value_name: "2200W" },
      ],
    },
    {
      attributeId: BigInt(510013),
      categoryId: BigInt(510001),
      name: "Dung tích",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "3.5L" },
        { value_id: 2, original_value_name: "4.5L" },
        { value_id: 3, original_value_name: "5.5L" },
        { value_id: 4, original_value_name: "6.5L" },
        { value_id: 5, original_value_name: "10L" },
        { value_id: 6, original_value_name: "12L" },
      ],
    },
    {
      attributeId: BigInt(510014),
      categoryId: BigInt(510001),
      name: "Hạn bảo hành",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "12 tháng" },
        { value_id: 2, original_value_name: "24 tháng" },
      ],
    },

    // 510002: Ấm Siêu Tốc & Bình Đun
    {
      attributeId: BigInt(510021),
      categoryId: BigInt(510002),
      name: "Thương hiệu",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Philips" },
        { value_id: 2, original_value_name: "Sunhouse" },
        { value_id: 3, original_value_name: "Bear" },
        { value_id: 4, original_value_name: "Delites" },
        { value_id: 5, original_value_name: "Tefal" },
      ],
    },
    {
      attributeId: BigInt(510022),
      categoryId: BigInt(510002),
      name: "Dung tích",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "1.5L" },
        { value_id: 2, original_value_name: "1.7L" },
        { value_id: 3, original_value_name: "1.8L" },
        { value_id: 4, original_value_name: "2.0L" },
      ],
    },
    {
      attributeId: BigInt(510023),
      categoryId: BigInt(510002),
      name: "Hạn bảo hành",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "12 tháng" },
        { value_id: 2, original_value_name: "24 tháng" },
      ],
    },

    // 520001: Máy Lọc Không Khí
    {
      attributeId: BigInt(520011),
      categoryId: BigInt(520001),
      name: "Thương hiệu",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Xiaomi" },
        { value_id: 2, original_value_name: "Sharp" },
        { value_id: 3, original_value_name: "Coway" },
        { value_id: 4, original_value_name: "Levoit" },
        { value_id: 5, original_value_name: "Panasonic" },
      ],
    },
    {
      attributeId: BigInt(520012),
      categoryId: BigInt(520001),
      name: "Diện tích sử dụng",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "15 - 25m²" },
        { value_id: 2, original_value_name: "25 - 40m²" },
        { value_id: 3, original_value_name: "40 - 60m²" },
        { value_id: 4, original_value_name: "> 60m²" },
      ],
    },
    {
      attributeId: BigInt(520013),
      categoryId: BigInt(520001),
      name: "Hạn bảo hành",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "12 tháng" },
        { value_id: 2, original_value_name: "24 tháng" },
      ],
    },

    // 610001: Hạt Dinh Dưỡng & Ngũ Cốc
    {
      attributeId: BigInt(610011),
      categoryId: BigInt(610001),
      name: "Thương hiệu",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Granola Farm" },
        { value_id: 2, original_value_name: "Macca Đắk Lắk" },
        { value_id: 3, original_value_name: "Hạt Điều Bình Phước" },
        { value_id: 4, original_value_name: "No Brand" },
      ],
    },
    {
      attributeId: BigInt(610012),
      categoryId: BigInt(610001),
      name: "Hạn sử dụng",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "6 tháng" },
        { value_id: 2, original_value_name: "9 tháng" },
        { value_id: 3, original_value_name: "12 tháng" },
      ],
    },
    {
      attributeId: BigInt(610013),
      categoryId: BigInt(610001),
      name: "Trọng lượng tịnh",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "250g" },
        { value_id: 2, original_value_name: "500g" },
        { value_id: 3, original_value_name: "1kg" },
      ],
    },
    {
      attributeId: BigInt(610014),
      categoryId: BigInt(610001),
      name: "Xuất xứ",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Việt Nam" },
        { value_id: 2, original_value_name: "Mỹ" },
        { value_id: 3, original_value_name: "Úc" },
      ],
    },

    // 620001: Cà Phê & Trà Thượng Hạng
    {
      attributeId: BigInt(620011),
      categoryId: BigInt(620001),
      name: "Thương hiệu",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Trung Nguyên Legend" },
        { value_id: 2, original_value_name: "Highlands Coffee" },
        { value_id: 3, original_value_name: "Đồi Trà Cầu Đất" },
        { value_id: 4, original_value_name: "Phúc Long" },
        { value_id: 5, original_value_name: "No Brand" },
      ],
    },
    {
      attributeId: BigInt(620012),
      categoryId: BigInt(620001),
      name: "Hạn sử dụng",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "12 tháng" },
        { value_id: 2, original_value_name: "18 tháng" },
        { value_id: 3, original_value_name: "24 tháng" },
      ],
    },
    {
      attributeId: BigInt(620013),
      categoryId: BigInt(620001),
      name: "Trọng lượng",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "250g" },
        { value_id: 2, original_value_name: "340g" },
        { value_id: 3, original_value_name: "500g" },
        { value_id: 4, original_value_name: "1kg" },
      ],
    },
    {
      attributeId: BigInt(620014),
      categoryId: BigInt(620001),
      name: "Xuất xứ",
      isMandatory: true,
      inputType: "DROP_DOWN",
      valueListJson: [
        { value_id: 1, original_value_name: "Buôn Ma Thuột - Đắk Lắk" },
        { value_id: 2, original_value_name: "Cầu Đất - Lâm Đồng" },
        { value_id: 3, original_value_name: "Thái Nguyên" },
        { value_id: 4, original_value_name: "Bảo Lộc - Lâm Đồng" },
      ],
    },
  ];

  for (const attr of categoryAttributesData) {
    await prisma.categoryAttribute.upsert({
      where: { attributeId: attr.attributeId },
      update: {
        categoryId: attr.categoryId,
        name: attr.name,
        isMandatory: attr.isMandatory,
        inputType: attr.inputType,
        valueListJson: attr.valueListJson,
      },
      create: {
        attributeId: attr.attributeId,
        categoryId: attr.categoryId,
        name: attr.name,
        isMandatory: attr.isMandatory,
        inputType: attr.inputType,
        valueListJson: attr.valueListJson,
      },
    });
  }
  console.log(`✓ Ensured Shopee 3-Level Category Tree & Rich Attributes (${treeCategoriesData.length} categories, ${categoryAttributesData.length} attributes)`);

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

  // 7. Seed Sample Buyer-Seller Live Chats
  const sampleChats = [
    {
      shopId: BigInt(727720655),
      buyerUserId: BigInt(1001),
      buyerUsername: "Nguyen Van A",
      senderType: "BUYER",
      message: "Shop ơi, tai nghe Pro chống ồn có sẵn hàng màu đen không ạ?",
      isRead: true,
      readAt: new Date(Date.now() - 3600000),
      createdAt: new Date(Date.now() - 3700000)
    },
    {
      shopId: BigInt(727720655),
      buyerUserId: BigInt(1001),
      buyerUsername: "Nguyen Van A",
      senderType: "SELLER",
      message: "Dạ chào bạn, tai nghe màu Đen hiện còn sẵn hàng ạ. Shop hỗ trợ giao ngay trong 2h nhé!",
      isRead: true,
      readAt: new Date(Date.now() - 3500000),
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      shopId: BigInt(727720655),
      buyerUserId: BigInt(1002),
      buyerUsername: "Tran Thi B",
      senderType: "BUYER",
      message: "Sản phẩm được bảo hành chính hãng bao lâu vậy shop?",
      isRead: false,
      readAt: null,
      createdAt: new Date(Date.now() - 1800000)
    },
    {
      shopId: BigInt(839910244),
      buyerUserId: BigInt(1003),
      buyerUsername: "Le Van C",
      senderType: "BUYER",
      message: "Áo hoodie size L cao 1m75 nặng 70kg mặc vừa không shop?",
      isRead: true,
      readAt: new Date(Date.now() - 7200000),
      createdAt: new Date(Date.now() - 7300000)
    },
    {
      shopId: BigInt(839910244),
      buyerUserId: BigInt(1003),
      buyerUsername: "Le Van C",
      senderType: "SELLER",
      message: "Dạ size L mặc form rộng rãi chuẩn streetwear rất đẹp bạn nhé!",
      isRead: true,
      readAt: new Date(Date.now() - 7100000),
      createdAt: new Date(Date.now() - 7200000)
    },
    {
      shopId: BigInt(910283751),
      buyerUserId: BigInt(1002),
      buyerUsername: "Tran Thi B",
      senderType: "BUYER",
      message: "Bàn làm việc thông minh có giao lên chung cư không ạ?",
      isRead: true,
      readAt: new Date(Date.now() - 10800000),
      createdAt: new Date(Date.now() - 10900000)
    },
    {
      shopId: BigInt(910283751),
      buyerUserId: BigInt(1002),
      buyerUsername: "Tran Thi B",
      senderType: "SELLER",
      message: "Dạ shop hỗ trợ giao tận căn hộ và lắp đặt hoàn chỉnh luôn bạn nhé.",
      isRead: true,
      readAt: new Date(Date.now() - 10700000),
      createdAt: new Date(Date.now() - 10800000)
    }
  ];

  for (const c of sampleChats) {
    const exists = await prisma.chatMessage.findFirst({
      where: {
        shopId: c.shopId,
        buyerUserId: c.buyerUserId,
        message: c.message
      }
    });
    if (!exists) {
      await prisma.chatMessage.create({ data: c });
    }
  }
  console.log(`✓ Seeded sample buyer-seller chat conversations across 3 shops`);

  // 8. Seed Completed Orders with Released Escrow and Product Reviews
  const seedCompletedOrders = [
    {
      orderSn: "SEEDORD727720655",
      shopId: BigInt(727720655),
      itemSku: "SMART-EARBUDS-01",
      buyerUserId: BigInt(1001),
      buyerUsername: "Nguyen Van A",
      totalAmount: 450000,
      buyerPaidShippingFee: 15000,
      actualShippingFee: 30000,
      voucherFromShopee: 15000,
      commissionFee: 9000,
      serviceFee: 6750,
      sellerTransactionFee: 11250,
      escrowAmount: 423000,
      escrowReleaseTime: new Date(Date.now() - 86400000),
      review: {
        ratingStar: 5,
        comment: "Tai nghe chống ồn cực đỉnh, bass đập chắc nịch, pin dùng cả ngày không hết. Rất đáng tiền!",
        reply: "Cảm ơn bạn Nguyen Van A đã ủng hộ SmartOmni! Chúc bạn có trải nghiệm nghe nhạc thật tuyệt vời ạ ❤️",
        replyTime: new Date(Date.now() - 80000000)
      }
    },
    {
      orderSn: "SEEDORD839910244",
      shopId: BigInt(839910244),
      itemSku: "HN-TEE-260",
      buyerUserId: BigInt(1003),
      buyerUsername: "Le Van C",
      totalAmount: 350000,
      buyerPaidShippingFee: 15000,
      actualShippingFee: 15000,
      voucherFromShopee: 0,
      commissionFee: 7000,
      serviceFee: 0,
      sellerTransactionFee: 8750,
      escrowAmount: 334250,
      escrowReleaseTime: new Date(Date.now() - 172800000),
      review: {
        ratingStar: 5,
        comment: "Chất vải cotton dày dặn, form áo đứng chuẩn streetwear. Đóng gói cẩn thận 10/10.",
        reply: "Hanoi Streetwear cảm ơn bạn nhiều nhé! Mong bạn tiếp tục ủng hộ các bộ sưu tập tiếp theo ạ!",
        replyTime: new Date(Date.now() - 160000000)
      }
    },
    {
      orderSn: "SEEDORD910283751",
      shopId: BigInt(910283751),
      itemSku: "SG-MUG-CER",
      buyerUserId: BigInt(1002),
      buyerUsername: "Tran Thi B",
      totalAmount: 1200000,
      buyerPaidShippingFee: 35000,
      actualShippingFee: 50000,
      voucherFromShopee: 15000,
      commissionFee: 24000,
      serviceFee: 18000,
      sellerTransactionFee: 30000,
      escrowAmount: 1128000,
      escrowReleaseTime: new Date(Date.now() - 259200000),
      review: {
        ratingStar: 5,
        comment: "Ghế gỗ tự nhiên rất chắc chắn, màu vân gỗ sang trọng đúng ý mình. Giao hàng nhanh đóng thùng kỹ.",
        reply: "Saigon Modern Living trân trọng cảm ơn đánh giá của bạn! Chúc bạn và gia đình luôn an khang ạ.",
        replyTime: new Date(Date.now() - 240000000)
      }
    }
  ];

  for (const ord of seedCompletedOrders) {
    const existingOrder = await prisma.order.findUnique({
      where: { orderSn: ord.orderSn }
    });

    const targetProduct = await prisma.product.findFirst({
      where: { shopId: ord.shopId, itemSku: ord.itemSku }
    });

    if (!existingOrder && targetProduct) {
      await prisma.order.create({
        data: {
          orderSn: ord.orderSn,
          shopId: ord.shopId,
          orderStatus: "COMPLETED",
          totalAmount: ord.totalAmount,
          buyerPaidShippingFee: ord.buyerPaidShippingFee,
          actualShippingFee: ord.actualShippingFee,
          voucherFromShopee: ord.voucherFromShopee,
          voucherFromSeller: 0,
          commissionFee: ord.commissionFee,
          serviceFee: ord.serviceFee,
          sellerTransactionFee: ord.sellerTransactionFee,
          escrowAmount: ord.escrowAmount,
          escrowReleaseTime: ord.escrowReleaseTime,
          buyerUserId: ord.buyerUserId,
          buyerUsername: ord.buyerUsername,
          recipientName: ord.buyerUsername,
          payTime: new Date(ord.escrowReleaseTime.getTime() - 86400000),
          shipByDate: new Date(ord.escrowReleaseTime.getTime() + 86400000),
          items: {
            create: {
              itemId: targetProduct.itemId,
              itemName: targetProduct.itemName,
              modelName: "Standard",
              modelSku: targetProduct.itemSku,
              itemPrice: ord.totalAmount,
              quantityPurchased: 1
            }
          }
        }
      });

      // Add product review
      await prisma.productComment.create({
        data: {
          shopId: ord.shopId,
          itemId: targetProduct.itemId,
          orderSn: ord.orderSn,
          buyerUserId: ord.buyerUserId,
          buyerUsername: ord.buyerUsername,
          ratingStar: ord.review.ratingStar,
          comment: ord.review.comment,
          reply: ord.review.reply,
          replyTime: ord.review.replyTime
        }
      });
    }

    // Recalculate Shop rating
    const comments = await prisma.productComment.findMany({
      where: { shopId: ord.shopId }
    });
    const ratingCount = comments.length;
    const avgRating = ratingCount > 0
      ? comments.reduce((acc, curr) => acc + curr.ratingStar, 0) / ratingCount
      : 5.0;

    await prisma.shop.update({
      where: { shopId: ord.shopId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        ratingCount
      }
    });
  }
  console.log(`✓ Seeded completed orders with released escrow and reviews for all shops`);

  // 9. Seed Buyer Accounts & Addresses for Shopiz Frontend
  const salt = crypto.randomBytes(16).toString("hex");
  const defaultPasswordHash = `${salt}:${crypto.scryptSync("Shopiz@123", salt, 64).toString("hex")}`;

  const demoBuyers = [
    {
      id: BigInt(1001),
      username: "demo",
      email: "demo@shopiz.com",
      phone: "0901234567",
      name: "Demo Shopper",
      passwordHash: defaultPasswordHash,
      addresses: [
        {
          recipientName: "Demo Shopper",
          recipientPhone: "0901234567",
          addressLine: "123 Le Loi Street, Ben Nghe Ward",
          district: "District 1",
          city: "Ho Chi Minh City",
          state: "Ho Chi Minh City",
          zipcode: "700000",
          isDefault: true
        },
        {
          recipientName: "Demo Shopper (Office)",
          recipientPhone: "0901234567",
          addressLine: "72 Le Thanh Ton, District 1",
          district: "District 1",
          city: "Ho Chi Minh City",
          state: "Ho Chi Minh City",
          zipcode: "700000",
          isDefault: false
        }
      ]
    },
    {
      id: BigInt(1002),
      username: "alex",
      email: "alex@shopiz.com",
      phone: "0912345678",
      name: "Alex Nguyen",
      passwordHash: defaultPasswordHash,
      addresses: [
        {
          recipientName: "Alex Nguyen",
          recipientPhone: "0912345678",
          addressLine: "456 Trang Tien Street, Trang Tien Ward",
          district: "Hoan Kiem District",
          city: "Hanoi",
          state: "Hanoi",
          zipcode: "100000",
          isDefault: true
        }
      ]
    },
    {
      id: BigInt(1003),
      username: "le_van_c",
      email: "c@shopiz.com",
      phone: "0912345679",
      name: "Le Van C",
      passwordHash: defaultPasswordHash,
      addresses: [
        {
          recipientName: "Le Van C",
          recipientPhone: "0912345679",
          addressLine: "789 Tran Phu Street",
          district: "Hai Chau District",
          city: "Da Nang",
          state: "Da Nang",
          zipcode: "550000",
          isDefault: true
        }
      ]
    }
  ];

  for (const b of demoBuyers) {
    const user = await prisma.buyerUser.upsert({
      where: { id: b.id },
      update: {
        username: b.username,
        email: b.email,
        phone: b.phone,
        name: b.name,
        passwordHash: b.passwordHash
      },
      create: {
        id: b.id,
        username: b.username,
        email: b.email,
        phone: b.phone,
        name: b.name,
        passwordHash: b.passwordHash
      }
    });

    for (const addr of b.addresses) {
      const existingAddr = await prisma.buyerAddress.findFirst({
        where: {
          buyerId: user.id,
          recipientPhone: addr.recipientPhone,
          addressLine: addr.addressLine
        }
      });
      if (!existingAddr) {
        await prisma.buyerAddress.create({
          data: {
            buyerId: user.id,
            recipientName: addr.recipientName,
            recipientPhone: addr.recipientPhone,
            addressLine: addr.addressLine,
            district: addr.district,
            city: addr.city,
            state: addr.state,
            zipcode: addr.zipcode,
            isDefault: addr.isDefault
          }
        });
      }
    }
  }
  console.log(`✓ Seeded Shopiz demo buyer accounts (demo, alex) and default addresses`);

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
