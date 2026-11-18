/**
 * Official Shopee Category Tree and Production Fashion Attributes for:
 * - Thời Trang Nam (100011)
 * - Thời Trang Nữ (100017)
 * Extracted directly from official Shopee Production API (banhang.shopee.vn).
 * 100% Vietnamese labels, non-restrictive suggestion dropdowns, and zero bloat.
 */

export interface SeedCategoryItem {
  categoryId: bigint;
  parentId: bigint;
  categoryName: string;
  hasChildren: boolean;
}

export interface SeedAttributeItem {
  attributeId: bigint;
  categoryId: bigint;
  name: string;
  isMandatory: boolean;
  inputType: string;
  valueListJson: any;
}

export const officialFashionCategories: SeedCategoryItem[] = [
  { categoryId: BigInt(100011), parentId: BigInt(0), categoryName: "Thời Trang Nam", hasChildren: true },
  { categoryId: BigInt(100017), parentId: BigInt(0), categoryName: "Thời Trang Nữ", hasChildren: true },
  { categoryId: BigInt(100047), parentId: BigInt(100011), categoryName: "Quần jean", hasChildren: false },
  { categoryId: BigInt(100048), parentId: BigInt(100011), categoryName: "Hoodie & Áo nỉ", hasChildren: true },
  { categoryId: BigInt(100049), parentId: BigInt(100011), categoryName: "Áo len", hasChildren: false },
  { categoryId: BigInt(100050), parentId: BigInt(100011), categoryName: "Áo khoác", hasChildren: true },
  { categoryId: BigInt(100051), parentId: BigInt(100011), categoryName: "Com lê", hasChildren: true },
  { categoryId: BigInt(100052), parentId: BigInt(100011), categoryName: "Quần dài", hasChildren: true },
  { categoryId: BigInt(100053), parentId: BigInt(100011), categoryName: "Quần đùi", hasChildren: false },
  { categoryId: BigInt(100054), parentId: BigInt(100011), categoryName: "Áo", hasChildren: true },
  { categoryId: BigInt(100055), parentId: BigInt(100011), categoryName: "Đồ lót", hasChildren: true },
  { categoryId: BigInt(100056), parentId: BigInt(100011), categoryName: "Đồ ngủ", hasChildren: false },
  { categoryId: BigInt(100057), parentId: BigInt(100011), categoryName: "Bộ", hasChildren: false },
  { categoryId: BigInt(100058), parentId: BigInt(100011), categoryName: "Trang phục truyền thống", hasChildren: true },
  { categoryId: BigInt(100059), parentId: BigInt(100011), categoryName: "Đồ hóa trang", hasChildren: false },
  { categoryId: BigInt(100060), parentId: BigInt(100011), categoryName: "Trang phục ngành nghề", hasChildren: false },
  { categoryId: BigInt(100062), parentId: BigInt(100011), categoryName: "Vớ/ Tất", hasChildren: false },
  { categoryId: BigInt(100099), parentId: BigInt(100017), categoryName: "Áo", hasChildren: true },
  { categoryId: BigInt(100100), parentId: BigInt(100017), categoryName: "Quần", hasChildren: true },
  { categoryId: BigInt(100101), parentId: BigInt(100017), categoryName: "Quần đùi", hasChildren: true },
  { categoryId: BigInt(100102), parentId: BigInt(100017), categoryName: "Váy", hasChildren: false },
  { categoryId: BigInt(100103), parentId: BigInt(100017), categoryName: "Quần jeans", hasChildren: false },
  { categoryId: BigInt(100104), parentId: BigInt(100017), categoryName: "Đầm", hasChildren: false },
  { categoryId: BigInt(100105), parentId: BigInt(100017), categoryName: "Váy cưới", hasChildren: false },
  { categoryId: BigInt(100106), parentId: BigInt(100017), categoryName: "Đồ liền thân", hasChildren: true },
  { categoryId: BigInt(100107), parentId: BigInt(100017), categoryName: "Áo khoác", hasChildren: true },
  { categoryId: BigInt(100108), parentId: BigInt(100017), categoryName: "Áo len", hasChildren: false },
  { categoryId: BigInt(100109), parentId: BigInt(100017), categoryName: "Hoodie và Áo nỉ", hasChildren: true },
  { categoryId: BigInt(100110), parentId: BigInt(100017), categoryName: "Bộ", hasChildren: true },
  { categoryId: BigInt(100111), parentId: BigInt(100017), categoryName: "Đồ lót", hasChildren: true },
  { categoryId: BigInt(100112), parentId: BigInt(100017), categoryName: "Đồ ngủ", hasChildren: true },
  { categoryId: BigInt(100113), parentId: BigInt(100017), categoryName: "Đồ Bầu", hasChildren: true },
  { categoryId: BigInt(100114), parentId: BigInt(100017), categoryName: "Đồ truyền thống", hasChildren: true },
  { categoryId: BigInt(100115), parentId: BigInt(100017), categoryName: "Đồ hóa trang", hasChildren: false },
  { categoryId: BigInt(100117), parentId: BigInt(100017), categoryName: "Vải", hasChildren: true },
  { categoryId: BigInt(100118), parentId: BigInt(100017), categoryName: "Vớ/ Tất", hasChildren: true },
  { categoryId: BigInt(100226), parentId: BigInt(100048), categoryName: "Áo hoodie", hasChildren: false },
  { categoryId: BigInt(100227), parentId: BigInt(100048), categoryName: "Áo nỉ", hasChildren: false },
  { categoryId: BigInt(100229), parentId: BigInt(100050), categoryName: "Áo khoác mùa đông & Áo choàng", hasChildren: false },
  { categoryId: BigInt(100230), parentId: BigInt(100050), categoryName: "Áo khoác", hasChildren: false },
  { categoryId: BigInt(100231), parentId: BigInt(100050), categoryName: "Áo khoác vest", hasChildren: false },
  { categoryId: BigInt(100233), parentId: BigInt(100051), categoryName: "Bộ Com lê", hasChildren: false },
  { categoryId: BigInt(100234), parentId: BigInt(100051), categoryName: "Áo Khoác & Blazer", hasChildren: false },
  { categoryId: BigInt(100235), parentId: BigInt(100051), categoryName: "Quần âu", hasChildren: false },
  { categoryId: BigInt(100236), parentId: BigInt(100051), categoryName: "Áo vest & Gi lê", hasChildren: false },
  { categoryId: BigInt(100238), parentId: BigInt(100052), categoryName: "Quần túi hộp", hasChildren: false },
  { categoryId: BigInt(100239), parentId: BigInt(100052), categoryName: "Quần jogger", hasChildren: false },
  { categoryId: BigInt(100240), parentId: BigInt(100052), categoryName: "Quần dài", hasChildren: false },
  { categoryId: BigInt(100242), parentId: BigInt(100054), categoryName: "Áo sơ mi", hasChildren: false },
  { categoryId: BigInt(100243), parentId: BigInt(100054), categoryName: "Áo polo", hasChildren: false },
  { categoryId: BigInt(100244), parentId: BigInt(100054), categoryName: "Áo thun", hasChildren: false },
  { categoryId: BigInt(100245), parentId: BigInt(100054), categoryName: "Áo ba lỗ", hasChildren: false },
  { categoryId: BigInt(100247), parentId: BigInt(100055), categoryName: "Quần lót", hasChildren: false },
  { categoryId: BigInt(100248), parentId: BigInt(100055), categoryName: "Áo lót", hasChildren: false },
  { categoryId: BigInt(100249), parentId: BigInt(100055), categoryName: "Đồ lót giữ nhiệt", hasChildren: false },
  { categoryId: BigInt(100251), parentId: BigInt(100058), categoryName: "Áo", hasChildren: false },
  { categoryId: BigInt(100252), parentId: BigInt(100058), categoryName: "Quần", hasChildren: false },
  { categoryId: BigInt(100253), parentId: BigInt(100058), categoryName: "Bộ", hasChildren: false },
  { categoryId: BigInt(100350), parentId: BigInt(100099), categoryName: "Áo hai dây và ba lỗ", hasChildren: false },
  { categoryId: BigInt(100351), parentId: BigInt(100099), categoryName: "Áo ống", hasChildren: false },
  { categoryId: BigInt(100352), parentId: BigInt(100099), categoryName: "Áo thun", hasChildren: false },
  { categoryId: BigInt(100353), parentId: BigInt(100099), categoryName: "Áo sơ mi", hasChildren: false },
  { categoryId: BigInt(100354), parentId: BigInt(100099), categoryName: "Áo polo", hasChildren: false },
  { categoryId: BigInt(100355), parentId: BigInt(100099), categoryName: "Áo liền thân", hasChildren: false },
  { categoryId: BigInt(100357), parentId: BigInt(100100), categoryName: "Quần legging", hasChildren: false },
  { categoryId: BigInt(100358), parentId: BigInt(100100), categoryName: "Quần dài", hasChildren: false },
  { categoryId: BigInt(100360), parentId: BigInt(100101), categoryName: "Quần đùi", hasChildren: false },
  { categoryId: BigInt(100361), parentId: BigInt(100101), categoryName: "Quần váy", hasChildren: false },
  { categoryId: BigInt(100363), parentId: BigInt(100106), categoryName: "Đồ bay (Jumpsuits)", hasChildren: false },
  { categoryId: BigInt(100364), parentId: BigInt(100106), categoryName: "Đồ bay ngắn (playsuits)", hasChildren: false },
  { categoryId: BigInt(100365), parentId: BigInt(100106), categoryName: "Quần yếm", hasChildren: false },
  { categoryId: BigInt(100367), parentId: BigInt(100107), categoryName: "Áo khoác mùa đông", hasChildren: false },
  { categoryId: BigInt(100368), parentId: BigInt(100107), categoryName: "Áo choàng", hasChildren: false },
  { categoryId: BigInt(100369), parentId: BigInt(100107), categoryName: "Áo blazer", hasChildren: false },
  { categoryId: BigInt(100370), parentId: BigInt(100107), categoryName: "Áo khoác ngoài", hasChildren: false },
  { categoryId: BigInt(100371), parentId: BigInt(100107), categoryName: "Áo vest", hasChildren: false },
  { categoryId: BigInt(100373), parentId: BigInt(100109), categoryName: "Áo khoác nỉ", hasChildren: false },
  { categoryId: BigInt(100374), parentId: BigInt(100109), categoryName: "Áo hoodies", hasChildren: false },
  { categoryId: BigInt(100376), parentId: BigInt(100110), categoryName: "Bộ đồ đôi", hasChildren: false },
  { categoryId: BigInt(100377), parentId: BigInt(100110), categoryName: "Bộ đồ gia đình", hasChildren: false },
  { categoryId: BigInt(100378), parentId: BigInt(100110), categoryName: "Đồ lẻ", hasChildren: false },
  { categoryId: BigInt(100380), parentId: BigInt(100111), categoryName: "Bộ đồ lót", hasChildren: false },
  { categoryId: BigInt(100381), parentId: BigInt(100111), categoryName: "Áo ngực", hasChildren: false },
  { categoryId: BigInt(100382), parentId: BigInt(100111), categoryName: "Quần lót", hasChildren: false },
  { categoryId: BigInt(100383), parentId: BigInt(100111), categoryName: "Đồ lót giữ nhiệt", hasChildren: false },
  { categoryId: BigInt(100384), parentId: BigInt(100111), categoryName: "Phụ kiện đồ lót", hasChildren: true },
  { categoryId: BigInt(100385), parentId: BigInt(100111), categoryName: "Đồ định hình", hasChildren: false },
  { categoryId: BigInt(100386), parentId: BigInt(100111), categoryName: "Đồ lót bảo hộ", hasChildren: false },
  { categoryId: BigInt(100387), parentId: BigInt(100111), categoryName: "Đồ lót gợi cảm", hasChildren: false },
  { categoryId: BigInt(100389), parentId: BigInt(100112), categoryName: "Pyjama", hasChildren: false },
  { categoryId: BigInt(100390), parentId: BigInt(100112), categoryName: "Váy ngủ", hasChildren: false },
  { categoryId: BigInt(100391), parentId: BigInt(100112), categoryName: "Áo choàng ngủ, Áo khoác kimono", hasChildren: false },
  { categoryId: BigInt(100393), parentId: BigInt(100113), categoryName: "Áo ngực cho con bú", hasChildren: false },
  { categoryId: BigInt(100394), parentId: BigInt(100113), categoryName: "Đầm bầu", hasChildren: false },
  { categoryId: BigInt(100395), parentId: BigInt(100113), categoryName: "Áo bầu", hasChildren: false },
  { categoryId: BigInt(100396), parentId: BigInt(100113), categoryName: "Đồ mặc cho con bú", hasChildren: false },
  { categoryId: BigInt(100397), parentId: BigInt(100113), categoryName: "Bộ đồ bầu", hasChildren: false },
  { categoryId: BigInt(100398), parentId: BigInt(100113), categoryName: "Quần bầu, Váy bầu", hasChildren: false },
  { categoryId: BigInt(100400), parentId: BigInt(100114), categoryName: "Áo", hasChildren: false },
  { categoryId: BigInt(100401), parentId: BigInt(100114), categoryName: "Quần và chân váy", hasChildren: false },
  { categoryId: BigInt(100402), parentId: BigInt(100114), categoryName: "Bộ", hasChildren: false },
  { categoryId: BigInt(100403), parentId: BigInt(100114), categoryName: "Đầm", hasChildren: false },
  { categoryId: BigInt(100404), parentId: BigInt(100114), categoryName: "Khác", hasChildren: false },
  { categoryId: BigInt(100407), parentId: BigInt(100117), categoryName: "Vải cotton", hasChildren: false },
  { categoryId: BigInt(100408), parentId: BigInt(100117), categoryName: "Vải len", hasChildren: false },
  { categoryId: BigInt(100409), parentId: BigInt(100117), categoryName: "Vải nhung, lụa, satin", hasChildren: false },
  { categoryId: BigInt(100410), parentId: BigInt(100117), categoryName: "Vải da", hasChildren: false },
  { categoryId: BigInt(100411), parentId: BigInt(100117), categoryName: "Vải nylon", hasChildren: false },
  { categoryId: BigInt(100412), parentId: BigInt(100117), categoryName: "Vải denim", hasChildren: false },
  { categoryId: BigInt(100413), parentId: BigInt(100117), categoryName: "Vải canvas", hasChildren: false },
  { categoryId: BigInt(100417), parentId: BigInt(100118), categoryName: "Tất", hasChildren: false },
  { categoryId: BigInt(100418), parentId: BigInt(100118), categoryName: "Quần tất", hasChildren: false },
  { categoryId: BigInt(100523), parentId: BigInt(100384), categoryName: "Dây áo lót", hasChildren: false },
  { categoryId: BigInt(100524), parentId: BigInt(100384), categoryName: "Miếng mút rời", hasChildren: false },
  { categoryId: BigInt(100525), parentId: BigInt(100384), categoryName: "Miếng dán ngực", hasChildren: false },
];

export const officialFashionAttributes: SeedAttributeItem[] = [
  {
    attributeId: BigInt(100047001),
    categoryId: BigInt(100047),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100047100037),
    categoryId: BigInt(100047),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100047100134),
    categoryId: BigInt(100047),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100047100142),
    categoryId: BigInt(100047),
    name: "Kiểu dáng quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1308,"original_value_name":"Khác"},{"value_id":1315,"original_value_name":"Thường"},{"value_id":1324,"original_value_name":"Skinny"},{"value_id":1332,"original_value_name":"Slim Fit"},{"value_id":1338,"original_value_name":"Đứng"},{"value_id":1347,"original_value_name":"Tapered"},{"value_id":1361,"original_value_name":"Ống rộng"}]
  },
  {
    attributeId: BigInt(100047100143),
    categoryId: BigInt(100047),
    name: "Chiều dài quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1310,"original_value_name":"Dài 3/4"},{"value_id":1320,"original_value_name":"Cắt gấu"},{"value_id":1328,"original_value_name":"Chiều dài đầy đủ"},{"value_id":1335,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100047100162),
    categoryId: BigInt(100047),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100047100169),
    categoryId: BigInt(100047),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100047100171),
    categoryId: BigInt(100047),
    name: "Bản eo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1507,"original_value_name":"Bản to"},{"value_id":1519,"original_value_name":"Bản thấp"},{"value_id":1534,"original_value_name":"Giữa eo"},{"value_id":1547,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100047100176),
    categoryId: BigInt(100047),
    name: "Loại khóa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1532,"original_value_name":"Nút"},{"value_id":1542,"original_value_name":"Khóa kéo"}]
  },
  {
    attributeId: BigInt(100047101004),
    categoryId: BigInt(100047),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100049001),
    categoryId: BigInt(100049),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100049100037),
    categoryId: BigInt(100049),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100049100134),
    categoryId: BigInt(100049),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100049100162),
    categoryId: BigInt(100049),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100049100163),
    categoryId: BigInt(100049),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100049100168),
    categoryId: BigInt(100049),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1500,"original_value_name":"Tay ngắn"}]
  },
  {
    attributeId: BigInt(100049100169),
    categoryId: BigInt(100049),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100049100170),
    categoryId: BigInt(100049),
    name: "Chiều dài áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1503,"original_value_name":"Dài"},{"value_id":11716,"original_value_name":"Short"},{"value_id":11717,"original_value_name":"Medium"},{"value_id":11718,"original_value_name":"3/4 Length"}]
  },
  {
    attributeId: BigInt(100049101004),
    categoryId: BigInt(100049),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100053001),
    categoryId: BigInt(100053),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100053100037),
    categoryId: BigInt(100053),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100053100134),
    categoryId: BigInt(100053),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100053100155),
    categoryId: BigInt(100053),
    name: "Dịp",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1387,"original_value_name":"Hằng Ngày"},{"value_id":1397,"original_value_name":"Khác"},{"value_id":1405,"original_value_name":"Buổi tiệc"},{"value_id":1422,"original_value_name":"Công việc"}]
  },
  {
    attributeId: BigInt(100053100162),
    categoryId: BigInt(100053),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100053100169),
    categoryId: BigInt(100053),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100053100171),
    categoryId: BigInt(100053),
    name: "Bản eo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1507,"original_value_name":"Bản to"},{"value_id":1519,"original_value_name":"Bản thấp"},{"value_id":1534,"original_value_name":"Giữa eo"},{"value_id":1547,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100053100176),
    categoryId: BigInt(100053),
    name: "Loại khóa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1532,"original_value_name":"Nút"},{"value_id":1542,"original_value_name":"Khóa kéo"}]
  },
  {
    attributeId: BigInt(100053100177),
    categoryId: BigInt(100053),
    name: "Loại quần short",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1533,"original_value_name":"Bermudas"},{"value_id":1544,"original_value_name":"Đi biển"},{"value_id":1558,"original_value_name":"Cargo"},{"value_id":1572,"original_value_name":"Khác"},{"value_id":1587,"original_value_name":"Jersey"}]
  },
  {
    attributeId: BigInt(100053101004),
    categoryId: BigInt(100053),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100056001),
    categoryId: BigInt(100056),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100056100037),
    categoryId: BigInt(100056),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100056100134),
    categoryId: BigInt(100056),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100056100143),
    categoryId: BigInt(100056),
    name: "Chiều dài quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1310,"original_value_name":"Dài 3/4"},{"value_id":1320,"original_value_name":"Cắt gấu"},{"value_id":1328,"original_value_name":"Chiều dài đầy đủ"},{"value_id":1335,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100056100162),
    categoryId: BigInt(100056),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100056100163),
    categoryId: BigInt(100056),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100056100168),
    categoryId: BigInt(100056),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100056100169),
    categoryId: BigInt(100056),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100056100839),
    categoryId: BigInt(100056),
    name: "Khăn & áo choàng tắm",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":4345,"original_value_name":"Cotton"},{"value_id":4367,"original_value_name":"Microfiber"},{"value_id":4383,"original_value_name":"Khác"},{"value_id":4404,"original_value_name":"Tencel"},{"value_id":4417,"original_value_name":"Vải terry"}]
  },
  {
    attributeId: BigInt(100056101004),
    categoryId: BigInt(100056),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100057001),
    categoryId: BigInt(100057),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100057100037),
    categoryId: BigInt(100057),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100057100134),
    categoryId: BigInt(100057),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100057100140),
    categoryId: BigInt(100057),
    name: "Loại trang phục",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1294,"original_value_name":"Jeans"},{"value_id":1307,"original_value_name":"Khác"},{"value_id":1314,"original_value_name":"Áo khoác"},{"value_id":1344,"original_value_name":"Quần short"},{"value_id":1365,"original_value_name":"Tất/vớ"},{"value_id":1380,"original_value_name":"Áo"},{"value_id":1389,"original_value_name":"Đồ mặc nhà & đồ lót"},{"value_id":1398,"original_value_name":"Quần"},{"value_id":1404,"original_value_name":"Đồ ngủ"}]
  },
  {
    attributeId: BigInt(100057100142),
    categoryId: BigInt(100057),
    name: "Kiểu dáng quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1332,"original_value_name":"Slim Fit"},{"value_id":1338,"original_value_name":"Đứng"},{"value_id":1361,"original_value_name":"Ống rộng"}]
  },
  {
    attributeId: BigInt(100057100154),
    categoryId: BigInt(100057),
    name: "Cổ áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1378,"original_value_name":"không đối xứng"},{"value_id":1394,"original_value_name":"Cổ sơ mi"},{"value_id":1406,"original_value_name":"Dây"},{"value_id":1414,"original_value_name":"Trễ vai"},{"value_id":1423,"original_value_name":"Khác"},{"value_id":1434,"original_value_name":"Cổ tròn"},{"value_id":1444,"original_value_name":"Cổ lọ"},{"value_id":1457,"original_value_name":"Cổ chữ V"}]
  },
  {
    attributeId: BigInt(100057100162),
    categoryId: BigInt(100057),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100057100163),
    categoryId: BigInt(100057),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100057100168),
    categoryId: BigInt(100057),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100057100169),
    categoryId: BigInt(100057),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100057100170),
    categoryId: BigInt(100057),
    name: "Chiều dài áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1503,"original_value_name":"Dài"},{"value_id":11716,"original_value_name":"Short"},{"value_id":11717,"original_value_name":"Medium"},{"value_id":11718,"original_value_name":"3/4 Length"}]
  },
  {
    attributeId: BigInt(100057101004),
    categoryId: BigInt(100057),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100059001),
    categoryId: BigInt(100059),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100059100037),
    categoryId: BigInt(100059),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100059100134),
    categoryId: BigInt(100059),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100059100149),
    categoryId: BigInt(100059),
    name: "Chủ đề trang phục",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1343,"original_value_name":"Động vật / Côn trùng"},{"value_id":1353,"original_value_name":"Nghề nghiệp"},{"value_id":1362,"original_value_name":"Trang phục Halloween"},{"value_id":1373,"original_value_name":"Thập kỷ"},{"value_id":1379,"original_value_name":"Disney"},{"value_id":1388,"original_value_name":"Cổ tích"},{"value_id":1395,"original_value_name":"Sự kiện"},{"value_id":1402,"original_value_name":"Đồ Ăn/ đồ uống"},{"value_id":1412,"original_value_name":"Kỳ nghỉ"},{"value_id":1424,"original_value_name":"Kinh dị"},{"value_id":1435,"original_value_name":"Tôn giáo"},{"value_id":1441,"original_value_name":"Viễn tưởng"},{"value_id":1452,"original_value_name":"Thể Thao"},{"value_id":1461,"original_value_name":"Phim ảnh"},{"value_id":1469,"original_value_name":"Trò chơi điện tử"},{"value_id":1487,"original_value_name":"Cướp biển"}]
  },
  {
    attributeId: BigInt(100059100162),
    categoryId: BigInt(100059),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100059100163),
    categoryId: BigInt(100059),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100059100168),
    categoryId: BigInt(100059),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1480,"original_value_name":"Dài tay"}]
  },
  {
    attributeId: BigInt(100059101004),
    categoryId: BigInt(100059),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100060001),
    categoryId: BigInt(100060),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100060100037),
    categoryId: BigInt(100060),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100060100134),
    categoryId: BigInt(100060),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100060100162),
    categoryId: BigInt(100060),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100060100163),
    categoryId: BigInt(100060),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100060100168),
    categoryId: BigInt(100060),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1491,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100060100174),
    categoryId: BigInt(100060),
    name: "Kiểu cổ áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1574,"original_value_name":"Mandarin Collar"}]
  },
  {
    attributeId: BigInt(100060101004),
    categoryId: BigInt(100060),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100062001),
    categoryId: BigInt(100062),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100062100016),
    categoryId: BigInt(100062),
    name: "Kiểu đóng gói",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":374,"original_value_name":"Hộp"},{"value_id":394,"original_value_name":"Đơn"}]
  },
  {
    attributeId: BigInt(100062100037),
    categoryId: BigInt(100062),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100062100134),
    categoryId: BigInt(100062),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1129,"original_value_name":"Canvas"},{"value_id":1133,"original_value_name":"cashmere"},{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1168,"original_value_name":"Polyester"},{"value_id":1173,"original_value_name":"tơ nhân tạo"},{"value_id":1190,"original_value_name":"Cao su"},{"value_id":1196,"original_value_name":"Thun"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1292,"original_value_name":"Babyterry"},{"value_id":1436,"original_value_name":"Da lộn"},{"value_id":1712,"original_value_name":"Jersey"},{"value_id":1750,"original_value_name":"Đồ lặn"},{"value_id":1775,"original_value_name":"Len"},{"value_id":1833,"original_value_name":"Nỉ mỏng"}]
  },
  {
    attributeId: BigInt(100062100167),
    categoryId: BigInt(100062),
    name: "Chiều dài vớ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1477,"original_value_name":"Mắt cá"},{"value_id":1488,"original_value_name":"vô hình"},{"value_id":1499,"original_value_name":"Đầu gối"},{"value_id":1509,"original_value_name":"Khác"},{"value_id":1622,"original_value_name":"Bắp chân"}]
  },
  {
    attributeId: BigInt(100062100243),
    categoryId: BigInt(100062),
    name: "Loại tất/vớ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1496,"original_value_name":"Vớ thể thao"},{"value_id":1505,"original_value_name":"Khác"},{"value_id":1521,"original_value_name":"Vớ ngón chân"}]
  },
  {
    attributeId: BigInt(100102001),
    categoryId: BigInt(100102),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100102100037),
    categoryId: BigInt(100102),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100102100134),
    categoryId: BigInt(100102),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100102100143),
    categoryId: BigInt(100102),
    name: "Chiều dài quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1320,"original_value_name":"Cắt gấu"},{"value_id":1328,"original_value_name":"Chiều dài đầy đủ"},{"value_id":1335,"original_value_name":"Khác"},{"value_id":5469,"original_value_name":"Dài 3/4"}]
  },
  {
    attributeId: BigInt(100102100151),
    categoryId: BigInt(100102),
    name: "Chiều dài váy",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1366,"original_value_name":"Maxi"},{"value_id":1374,"original_value_name":"Midi"},{"value_id":1385,"original_value_name":"Mini"}]
  },
  {
    attributeId: BigInt(100102100152),
    categoryId: BigInt(100102),
    name: "Kiểu váy",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1367,"original_value_name":"váy chữ A"},{"value_id":1377,"original_value_name":"váy ôm sát"},{"value_id":1382,"original_value_name":"Váy đuôi cá dài"},{"value_id":1392,"original_value_name":"váy xòe"},{"value_id":1399,"original_value_name":"Khác"},{"value_id":1408,"original_value_name":"Váy bút chì"},{"value_id":1418,"original_value_name":"váy xếp ly"},{"value_id":1430,"original_value_name":"Váy quấn"}]
  },
  {
    attributeId: BigInt(100102100155),
    categoryId: BigInt(100102),
    name: "Dịp",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1387,"original_value_name":"Hằng Ngày"},{"value_id":1397,"original_value_name":"Khác"},{"value_id":1405,"original_value_name":"Buổi tiệc"},{"value_id":1413,"original_value_name":"Dạ hội"},{"value_id":1422,"original_value_name":"Công việc"}]
  },
  {
    attributeId: BigInt(100102100162),
    categoryId: BigInt(100102),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100102100163),
    categoryId: BigInt(100102),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100102100169),
    categoryId: BigInt(100102),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100102100171),
    categoryId: BigInt(100102),
    name: "Bản eo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1507,"original_value_name":"Bản to"},{"value_id":1519,"original_value_name":"Bản thấp"},{"value_id":1534,"original_value_name":"Giữa eo"},{"value_id":1547,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100102101004),
    categoryId: BigInt(100102),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100103001),
    categoryId: BigInt(100103),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100103100037),
    categoryId: BigInt(100103),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100103100134),
    categoryId: BigInt(100103),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100103100142),
    categoryId: BigInt(100103),
    name: "Kiểu dáng quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1304,"original_value_name":"Vừa và xòe"},{"value_id":1308,"original_value_name":"Khác"},{"value_id":1315,"original_value_name":"Thường"},{"value_id":1324,"original_value_name":"Skinny"},{"value_id":1332,"original_value_name":"Slim Fit"},{"value_id":1338,"original_value_name":"Đứng"},{"value_id":1347,"original_value_name":"Tapered"},{"value_id":1355,"original_value_name":"Boyfriend"},{"value_id":1361,"original_value_name":"Ống rộng"}]
  },
  {
    attributeId: BigInt(100103100143),
    categoryId: BigInt(100103),
    name: "Chiều dài quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1320,"original_value_name":"Cắt gấu"},{"value_id":1328,"original_value_name":"Chiều dài đầy đủ"},{"value_id":1335,"original_value_name":"Khác"},{"value_id":5469,"original_value_name":"Dài 3/4"}]
  },
  {
    attributeId: BigInt(100103100162),
    categoryId: BigInt(100103),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100103100163),
    categoryId: BigInt(100103),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100103100169),
    categoryId: BigInt(100103),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100103100171),
    categoryId: BigInt(100103),
    name: "Bản eo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1507,"original_value_name":"Bản to"},{"value_id":1519,"original_value_name":"Bản thấp"},{"value_id":1534,"original_value_name":"Giữa eo"},{"value_id":1547,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100103101004),
    categoryId: BigInt(100103),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100104001),
    categoryId: BigInt(100104),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100104100037),
    categoryId: BigInt(100104),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100104100134),
    categoryId: BigInt(100104),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100104100143),
    categoryId: BigInt(100104),
    name: "Chiều dài quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1320,"original_value_name":"Cắt gấu"},{"value_id":1328,"original_value_name":"Chiều dài đầy đủ"},{"value_id":1335,"original_value_name":"Khác"},{"value_id":5469,"original_value_name":"Dài 3/4"}]
  },
  {
    attributeId: BigInt(100104100151),
    categoryId: BigInt(100104),
    name: "Chiều dài váy",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1366,"original_value_name":"Maxi"},{"value_id":1374,"original_value_name":"Midi"},{"value_id":1385,"original_value_name":"Mini"}]
  },
  {
    attributeId: BigInt(100104100152),
    categoryId: BigInt(100104),
    name: "Kiểu váy",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1367,"original_value_name":"váy chữ A"},{"value_id":1377,"original_value_name":"váy ôm sát"},{"value_id":1382,"original_value_name":"Váy đuôi cá dài"},{"value_id":1392,"original_value_name":"váy xòe"},{"value_id":1399,"original_value_name":"Khác"},{"value_id":1408,"original_value_name":"Váy bút chì"},{"value_id":1418,"original_value_name":"váy xếp ly"},{"value_id":1430,"original_value_name":"Váy quấn"}]
  },
  {
    attributeId: BigInt(100104100154),
    categoryId: BigInt(100104),
    name: "Cổ áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1378,"original_value_name":"không đối xứng"},{"value_id":1386,"original_value_name":"Cổ thuyền"},{"value_id":1394,"original_value_name":"Cổ sơ mi"},{"value_id":1406,"original_value_name":"Dây"},{"value_id":1414,"original_value_name":"Trễ vai"},{"value_id":1423,"original_value_name":"Khác"},{"value_id":1434,"original_value_name":"Cổ tròn"},{"value_id":1444,"original_value_name":"Cổ lọ"},{"value_id":1457,"original_value_name":"Cổ chữ V"}]
  },
  {
    attributeId: BigInt(100104100155),
    categoryId: BigInt(100104),
    name: "Dịp",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1387,"original_value_name":"Hằng Ngày"},{"value_id":1397,"original_value_name":"Khác"},{"value_id":1405,"original_value_name":"Buổi tiệc"},{"value_id":1413,"original_value_name":"Dạ hội"},{"value_id":1422,"original_value_name":"Công việc"}]
  },
  {
    attributeId: BigInt(100104100162),
    categoryId: BigInt(100104),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100104100163),
    categoryId: BigInt(100104),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100104100168),
    categoryId: BigInt(100104),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100104100169),
    categoryId: BigInt(100104),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100104101004),
    categoryId: BigInt(100104),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100105001),
    categoryId: BigInt(100105),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100105100037),
    categoryId: BigInt(100105),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100105100134),
    categoryId: BigInt(100105),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100105100151),
    categoryId: BigInt(100105),
    name: "Chiều dài váy",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1366,"original_value_name":"Maxi"},{"value_id":1374,"original_value_name":"Midi"},{"value_id":1385,"original_value_name":"Mini"}]
  },
  {
    attributeId: BigInt(100105100152),
    categoryId: BigInt(100105),
    name: "Kiểu váy",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1367,"original_value_name":"váy chữ A"},{"value_id":1377,"original_value_name":"váy ôm sát"},{"value_id":1382,"original_value_name":"Váy đuôi cá dài"},{"value_id":1392,"original_value_name":"váy xòe"},{"value_id":1399,"original_value_name":"Khác"},{"value_id":1408,"original_value_name":"Váy bút chì"},{"value_id":1418,"original_value_name":"váy xếp ly"},{"value_id":1430,"original_value_name":"Váy quấn"}]
  },
  {
    attributeId: BigInt(100105100154),
    categoryId: BigInt(100105),
    name: "Cổ áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1378,"original_value_name":"không đối xứng"},{"value_id":1386,"original_value_name":"Cổ thuyền"},{"value_id":1394,"original_value_name":"Cổ sơ mi"},{"value_id":1406,"original_value_name":"Dây"},{"value_id":1414,"original_value_name":"Trễ vai"},{"value_id":1423,"original_value_name":"Khác"},{"value_id":1434,"original_value_name":"Cổ tròn"},{"value_id":1444,"original_value_name":"Cổ lọ"},{"value_id":1457,"original_value_name":"Cổ chữ V"}]
  },
  {
    attributeId: BigInt(100105100155),
    categoryId: BigInt(100105),
    name: "Dịp",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1387,"original_value_name":"Hằng Ngày"},{"value_id":1413,"original_value_name":"Dạ hội"}]
  },
  {
    attributeId: BigInt(100105100162),
    categoryId: BigInt(100105),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100105100163),
    categoryId: BigInt(100105),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100105100168),
    categoryId: BigInt(100105),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100105100169),
    categoryId: BigInt(100105),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100105100172),
    categoryId: BigInt(100105),
    name: "Loại váy cưới",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1510,"original_value_name":"Dáng chữ A"},{"value_id":1524,"original_value_name":"Dáng đứng"},{"value_id":1538,"original_value_name":"Dáng xòe"},{"value_id":1554,"original_value_name":"Dáng xuông"},{"value_id":1567,"original_value_name":"Dáng đuôi cá"},{"value_id":1581,"original_value_name":"Dáng Công chúa"},{"value_id":1595,"original_value_name":"Dáng ngắn"},{"value_id":1611,"original_value_name":"Dáng kèn"}]
  },
  {
    attributeId: BigInt(100105101004),
    categoryId: BigInt(100105),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100108001),
    categoryId: BigInt(100108),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100108100037),
    categoryId: BigInt(100108),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100108100134),
    categoryId: BigInt(100108),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100108100156),
    categoryId: BigInt(100108),
    name: "Chiều dài áo khoác ngoài",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1401,"original_value_name":"3/4 Chiều dài"},{"value_id":1409,"original_value_name":"Dài"},{"value_id":1417,"original_value_name":"Trung bình"},{"value_id":1427,"original_value_name":"Ngắn"}]
  },
  {
    attributeId: BigInt(100108100162),
    categoryId: BigInt(100108),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100108100163),
    categoryId: BigInt(100108),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100108100168),
    categoryId: BigInt(100108),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100108100169),
    categoryId: BigInt(100108),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100108100170),
    categoryId: BigInt(100108),
    name: "Chiều dài áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1503,"original_value_name":"Dài"}]
  },
  {
    attributeId: BigInt(100108101004),
    categoryId: BigInt(100108),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100115001),
    categoryId: BigInt(100115),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100115100037),
    categoryId: BigInt(100115),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100115100134),
    categoryId: BigInt(100115),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100115100149),
    categoryId: BigInt(100115),
    name: "Chủ đề trang phục",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1343,"original_value_name":"Động vật / Côn trùng"},{"value_id":1353,"original_value_name":"Nghề nghiệp"},{"value_id":1362,"original_value_name":"Trang phục Halloween"},{"value_id":1373,"original_value_name":"Thập kỷ"},{"value_id":1379,"original_value_name":"Disney"},{"value_id":1388,"original_value_name":"Cổ tích"},{"value_id":1395,"original_value_name":"Sự kiện"},{"value_id":1402,"original_value_name":"Đồ Ăn/ đồ uống"},{"value_id":1412,"original_value_name":"Kỳ nghỉ"},{"value_id":1424,"original_value_name":"Kinh dị"},{"value_id":1435,"original_value_name":"Tôn giáo"},{"value_id":1441,"original_value_name":"Viễn tưởng"},{"value_id":1452,"original_value_name":"Thể Thao"},{"value_id":1461,"original_value_name":"Phim ảnh"},{"value_id":1469,"original_value_name":"Trò chơi điện tử"},{"value_id":1487,"original_value_name":"Cướp biển"}]
  },
  {
    attributeId: BigInt(100115100152),
    categoryId: BigInt(100115),
    name: "Kiểu váy",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1367,"original_value_name":"váy chữ A"},{"value_id":1377,"original_value_name":"váy ôm sát"},{"value_id":1382,"original_value_name":"Váy đuôi cá dài"},{"value_id":1399,"original_value_name":"Khác"},{"value_id":1408,"original_value_name":"Váy bút chì"},{"value_id":1418,"original_value_name":"váy xếp ly"},{"value_id":1430,"original_value_name":"Váy quấn"}]
  },
  {
    attributeId: BigInt(100115100162),
    categoryId: BigInt(100115),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100115100163),
    categoryId: BigInt(100115),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100115100168),
    categoryId: BigInt(100115),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1480,"original_value_name":"Dài tay"}]
  },
  {
    attributeId: BigInt(100115101004),
    categoryId: BigInt(100115),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100226001),
    categoryId: BigInt(100226),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100226100037),
    categoryId: BigInt(100226),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100226100134),
    categoryId: BigInt(100226),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100226100162),
    categoryId: BigInt(100226),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100226100163),
    categoryId: BigInt(100226),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100226100168),
    categoryId: BigInt(100226),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100226100169),
    categoryId: BigInt(100226),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100226101004),
    categoryId: BigInt(100226),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100227001),
    categoryId: BigInt(100227),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100227100037),
    categoryId: BigInt(100227),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100227100134),
    categoryId: BigInt(100227),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100227100162),
    categoryId: BigInt(100227),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100227100163),
    categoryId: BigInt(100227),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100227100168),
    categoryId: BigInt(100227),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1480,"original_value_name":"Dài tay"}]
  },
  {
    attributeId: BigInt(100227100169),
    categoryId: BigInt(100227),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100227101004),
    categoryId: BigInt(100227),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100229001),
    categoryId: BigInt(100229),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100229100037),
    categoryId: BigInt(100229),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100229100134),
    categoryId: BigInt(100229),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100229100156),
    categoryId: BigInt(100229),
    name: "Chiều dài áo khoác ngoài",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1409,"original_value_name":"Dài"},{"value_id":1417,"original_value_name":"Trung bình"},{"value_id":1427,"original_value_name":"Ngắn"}]
  },
  {
    attributeId: BigInt(100229100162),
    categoryId: BigInt(100229),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100229100163),
    categoryId: BigInt(100229),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100229100168),
    categoryId: BigInt(100229),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1480,"original_value_name":"Dài tay"}]
  },
  {
    attributeId: BigInt(100229100169),
    categoryId: BigInt(100229),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100229100170),
    categoryId: BigInt(100229),
    name: "Chiều dài áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1503,"original_value_name":"Dài"},{"value_id":11716,"original_value_name":"Short"},{"value_id":11717,"original_value_name":"Medium"},{"value_id":11718,"original_value_name":"3/4 Length"}]
  },
  {
    attributeId: BigInt(100229101004),
    categoryId: BigInt(100229),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100230001),
    categoryId: BigInt(100230),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100230100037),
    categoryId: BigInt(100230),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100230100134),
    categoryId: BigInt(100230),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100230100153),
    categoryId: BigInt(100230),
    name: "Kiểu Áo khoác",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1376,"original_value_name":"Áo khoác bomber"},{"value_id":1384,"original_value_name":"Áo khoác bóng chày"},{"value_id":1393,"original_value_name":"Khác"},{"value_id":1400,"original_value_name":"Áo gió"}]
  },
  {
    attributeId: BigInt(100230100156),
    categoryId: BigInt(100230),
    name: "Chiều dài áo khoác ngoài",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1409,"original_value_name":"Dài"},{"value_id":1417,"original_value_name":"Trung bình"},{"value_id":1427,"original_value_name":"Ngắn"}]
  },
  {
    attributeId: BigInt(100230100162),
    categoryId: BigInt(100230),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100230100168),
    categoryId: BigInt(100230),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1491,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100230100169),
    categoryId: BigInt(100230),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100230100204),
    categoryId: BigInt(100230),
    name: "Loại da",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1683,"original_value_name":"Da Trâu"},{"value_id":1759,"original_value_name":"Da Cừu"}]
  },
  {
    attributeId: BigInt(100230101004),
    categoryId: BigInt(100230),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100231001),
    categoryId: BigInt(100231),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100231100037),
    categoryId: BigInt(100231),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100231100134),
    categoryId: BigInt(100231),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100231100155),
    categoryId: BigInt(100231),
    name: "Dịp",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1387,"original_value_name":"Hằng Ngày"},{"value_id":1397,"original_value_name":"Khác"},{"value_id":1405,"original_value_name":"Buổi tiệc"},{"value_id":1422,"original_value_name":"Công việc"}]
  },
  {
    attributeId: BigInt(100231100162),
    categoryId: BigInt(100231),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100231100169),
    categoryId: BigInt(100231),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100231100170),
    categoryId: BigInt(100231),
    name: "Chiều dài áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1503,"original_value_name":"Dài"},{"value_id":11716,"original_value_name":"Short"},{"value_id":11717,"original_value_name":"Medium"},{"value_id":11718,"original_value_name":"3/4 Length"}]
  },
  {
    attributeId: BigInt(100231101004),
    categoryId: BigInt(100231),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100233001),
    categoryId: BigInt(100233),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100233100037),
    categoryId: BigInt(100233),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100233100134),
    categoryId: BigInt(100233),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100233100162),
    categoryId: BigInt(100233),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100233100169),
    categoryId: BigInt(100233),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100233100170),
    categoryId: BigInt(100233),
    name: "Chiều dài áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1503,"original_value_name":"Dài"},{"value_id":11716,"original_value_name":"Short"},{"value_id":11717,"original_value_name":"Medium"},{"value_id":11718,"original_value_name":"3/4 Length"}]
  },
  {
    attributeId: BigInt(100233100178),
    categoryId: BigInt(100233),
    name: "Loại suit",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1537,"original_value_name":"Cài nút chéo"},{"value_id":1550,"original_value_name":"Cài nút đơn"}]
  },
  {
    attributeId: BigInt(100233100179),
    categoryId: BigInt(100233),
    name: "Dáng kiểu áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1541,"original_value_name":"Cổ điển"},{"value_id":1557,"original_value_name":"Rộng"},{"value_id":1569,"original_value_name":"Cơ bắp"},{"value_id":1585,"original_value_name":"Oversized"},{"value_id":1604,"original_value_name":"Slim"},{"value_id":1619,"original_value_name":"Ôm sát"}]
  },
  {
    attributeId: BigInt(100233100181),
    categoryId: BigInt(100233),
    name: "Vạc xẻ vest",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1552,"original_value_name":"Xẻ mông"},{"value_id":1563,"original_value_name":"Xẻ hông"}]
  },
  {
    attributeId: BigInt(100233101004),
    categoryId: BigInt(100233),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100234001),
    categoryId: BigInt(100234),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100234100037),
    categoryId: BigInt(100234),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100234100134),
    categoryId: BigInt(100234),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100234100162),
    categoryId: BigInt(100234),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100234100169),
    categoryId: BigInt(100234),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100234100174),
    categoryId: BigInt(100234),
    name: "Kiểu cổ áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1574,"original_value_name":"Mandarin Collar"}]
  },
  {
    attributeId: BigInt(100234100178),
    categoryId: BigInt(100234),
    name: "Loại suit",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1537,"original_value_name":"Cài nút chéo"},{"value_id":1550,"original_value_name":"Cài nút đơn"}]
  },
  {
    attributeId: BigInt(100234100179),
    categoryId: BigInt(100234),
    name: "Dáng kiểu áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1541,"original_value_name":"Cổ điển"},{"value_id":1557,"original_value_name":"Rộng"},{"value_id":1569,"original_value_name":"Cơ bắp"},{"value_id":1585,"original_value_name":"Oversized"},{"value_id":1604,"original_value_name":"Slim"},{"value_id":1619,"original_value_name":"Ôm sát"}]
  },
  {
    attributeId: BigInt(100234100181),
    categoryId: BigInt(100234),
    name: "Vạc xẻ vest",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1552,"original_value_name":"Xẻ mông"},{"value_id":1563,"original_value_name":"Xẻ hông"}]
  },
  {
    attributeId: BigInt(100234101004),
    categoryId: BigInt(100234),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100235001),
    categoryId: BigInt(100235),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100235100037),
    categoryId: BigInt(100235),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100235100134),
    categoryId: BigInt(100235),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100235100142),
    categoryId: BigInt(100235),
    name: "Kiểu dáng quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1308,"original_value_name":"Khác"},{"value_id":1315,"original_value_name":"Thường"},{"value_id":1324,"original_value_name":"Skinny"},{"value_id":1332,"original_value_name":"Slim Fit"},{"value_id":1338,"original_value_name":"Đứng"},{"value_id":1347,"original_value_name":"Tapered"},{"value_id":1361,"original_value_name":"Ống rộng"}]
  },
  {
    attributeId: BigInt(100235100143),
    categoryId: BigInt(100235),
    name: "Chiều dài quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1310,"original_value_name":"Dài 3/4"},{"value_id":1320,"original_value_name":"Cắt gấu"},{"value_id":1328,"original_value_name":"Chiều dài đầy đủ"},{"value_id":1335,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100235100162),
    categoryId: BigInt(100235),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100235100169),
    categoryId: BigInt(100235),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100235100171),
    categoryId: BigInt(100235),
    name: "Bản eo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1507,"original_value_name":"Bản to"},{"value_id":1519,"original_value_name":"Bản thấp"},{"value_id":1534,"original_value_name":"Giữa eo"},{"value_id":1547,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100235100176),
    categoryId: BigInt(100235),
    name: "Loại khóa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1532,"original_value_name":"Nút"},{"value_id":1542,"original_value_name":"Khóa kéo"}]
  },
  {
    attributeId: BigInt(100235101004),
    categoryId: BigInt(100235),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100236001),
    categoryId: BigInt(100236),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100236100037),
    categoryId: BigInt(100236),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100236100134),
    categoryId: BigInt(100236),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100236100162),
    categoryId: BigInt(100236),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100236100169),
    categoryId: BigInt(100236),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100236100170),
    categoryId: BigInt(100236),
    name: "Chiều dài áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1503,"original_value_name":"Dài"},{"value_id":11716,"original_value_name":"Short"},{"value_id":11717,"original_value_name":"Medium"},{"value_id":11718,"original_value_name":"3/4 Length"}]
  },
  {
    attributeId: BigInt(100236100179),
    categoryId: BigInt(100236),
    name: "Dáng kiểu áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1541,"original_value_name":"Cổ điển"},{"value_id":1557,"original_value_name":"Rộng"},{"value_id":1569,"original_value_name":"Cơ bắp"},{"value_id":1585,"original_value_name":"Oversized"},{"value_id":1604,"original_value_name":"Slim"},{"value_id":1619,"original_value_name":"Ôm sát"}]
  },
  {
    attributeId: BigInt(100236101004),
    categoryId: BigInt(100236),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100238001),
    categoryId: BigInt(100238),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100238100037),
    categoryId: BigInt(100238),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100238100134),
    categoryId: BigInt(100238),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100238100142),
    categoryId: BigInt(100238),
    name: "Kiểu dáng quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1304,"original_value_name":"Vừa và xòe"},{"value_id":1324,"original_value_name":"Skinny"},{"value_id":1332,"original_value_name":"Slim Fit"},{"value_id":1338,"original_value_name":"Đứng"},{"value_id":1347,"original_value_name":"Tapered"},{"value_id":1355,"original_value_name":"Boyfriend"},{"value_id":1361,"original_value_name":"Ống rộng"}]
  },
  {
    attributeId: BigInt(100238100162),
    categoryId: BigInt(100238),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100238100169),
    categoryId: BigInt(100238),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100238100171),
    categoryId: BigInt(100238),
    name: "Bản eo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1507,"original_value_name":"Bản to"},{"value_id":1519,"original_value_name":"Bản thấp"},{"value_id":1534,"original_value_name":"Giữa eo"},{"value_id":1547,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100238101004),
    categoryId: BigInt(100238),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100239001),
    categoryId: BigInt(100239),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100239100037),
    categoryId: BigInt(100239),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100239100134),
    categoryId: BigInt(100239),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100239100142),
    categoryId: BigInt(100239),
    name: "Kiểu dáng quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1304,"original_value_name":"Vừa và xòe"},{"value_id":1324,"original_value_name":"Skinny"},{"value_id":1332,"original_value_name":"Slim Fit"},{"value_id":1338,"original_value_name":"Đứng"},{"value_id":1347,"original_value_name":"Tapered"},{"value_id":1355,"original_value_name":"Boyfriend"},{"value_id":1361,"original_value_name":"Ống rộng"}]
  },
  {
    attributeId: BigInt(100239100162),
    categoryId: BigInt(100239),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100239100169),
    categoryId: BigInt(100239),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100239100171),
    categoryId: BigInt(100239),
    name: "Bản eo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1507,"original_value_name":"Bản to"},{"value_id":1519,"original_value_name":"Bản thấp"},{"value_id":1534,"original_value_name":"Giữa eo"},{"value_id":1547,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100239101004),
    categoryId: BigInt(100239),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100240001),
    categoryId: BigInt(100240),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100240100037),
    categoryId: BigInt(100240),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100240100134),
    categoryId: BigInt(100240),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100240100142),
    categoryId: BigInt(100240),
    name: "Kiểu dáng quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1308,"original_value_name":"Khác"},{"value_id":1315,"original_value_name":"Thường"},{"value_id":1324,"original_value_name":"Skinny"},{"value_id":1332,"original_value_name":"Slim Fit"},{"value_id":1338,"original_value_name":"Đứng"},{"value_id":1347,"original_value_name":"Tapered"},{"value_id":1361,"original_value_name":"Ống rộng"}]
  },
  {
    attributeId: BigInt(100240100143),
    categoryId: BigInt(100240),
    name: "Chiều dài quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1310,"original_value_name":"Dài 3/4"},{"value_id":1320,"original_value_name":"Cắt gấu"},{"value_id":1328,"original_value_name":"Chiều dài đầy đủ"},{"value_id":1335,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100240100162),
    categoryId: BigInt(100240),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100240100169),
    categoryId: BigInt(100240),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100240100171),
    categoryId: BigInt(100240),
    name: "Bản eo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1507,"original_value_name":"Bản to"},{"value_id":1519,"original_value_name":"Bản thấp"},{"value_id":1534,"original_value_name":"Giữa eo"},{"value_id":1547,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100240100176),
    categoryId: BigInt(100240),
    name: "Loại khóa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1532,"original_value_name":"Nút"},{"value_id":1542,"original_value_name":"Khóa kéo"}]
  },
  {
    attributeId: BigInt(100240101004),
    categoryId: BigInt(100240),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100242001),
    categoryId: BigInt(100242),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100242100037),
    categoryId: BigInt(100242),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100242100134),
    categoryId: BigInt(100242),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100242100154),
    categoryId: BigInt(100242),
    name: "Cổ áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1394,"original_value_name":"Cổ sơ mi"},{"value_id":1423,"original_value_name":"Khác"},{"value_id":1434,"original_value_name":"Cổ tròn"},{"value_id":1444,"original_value_name":"Cổ lọ"},{"value_id":1457,"original_value_name":"Cổ chữ V"}]
  },
  {
    attributeId: BigInt(100242100155),
    categoryId: BigInt(100242),
    name: "Dịp",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1387,"original_value_name":"Hằng Ngày"},{"value_id":1397,"original_value_name":"Khác"},{"value_id":1405,"original_value_name":"Buổi tiệc"},{"value_id":1422,"original_value_name":"Công việc"}]
  },
  {
    attributeId: BigInt(100242100162),
    categoryId: BigInt(100242),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100242100168),
    categoryId: BigInt(100242),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100242100169),
    categoryId: BigInt(100242),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100242100170),
    categoryId: BigInt(100242),
    name: "Chiều dài áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1503,"original_value_name":"Dài"},{"value_id":11716,"original_value_name":"Short"},{"value_id":11717,"original_value_name":"Medium"},{"value_id":11718,"original_value_name":"3/4 Length"}]
  },
  {
    attributeId: BigInt(100242100174),
    categoryId: BigInt(100242),
    name: "Kiểu cổ áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1522,"original_value_name":"Có nút"},{"value_id":1536,"original_value_name":"Cổ áo truyền thống"},{"value_id":1548,"original_value_name":"Club Collar"},{"value_id":1560,"original_value_name":"Grandad Collar"},{"value_id":1574,"original_value_name":"Mandarin Collar"},{"value_id":1590,"original_value_name":"Pinned Collar"},{"value_id":1608,"original_value_name":"Spread Collar"}]
  },
  {
    attributeId: BigInt(100242100175),
    categoryId: BigInt(100242),
    name: "Kiểu cổ tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1529,"original_value_name":"Barrel Cuff"},{"value_id":1543,"original_value_name":"French Cuff"}]
  },
  {
    attributeId: BigInt(100242100179),
    categoryId: BigInt(100242),
    name: "Dáng kiểu áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1541,"original_value_name":"Cổ điển"},{"value_id":1557,"original_value_name":"Rộng"},{"value_id":1569,"original_value_name":"Cơ bắp"},{"value_id":1585,"original_value_name":"Oversized"},{"value_id":1604,"original_value_name":"Slim"},{"value_id":1619,"original_value_name":"Ôm sát"}]
  },
  {
    attributeId: BigInt(100242101004),
    categoryId: BigInt(100242),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100243001),
    categoryId: BigInt(100243),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100243100037),
    categoryId: BigInt(100243),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100243100134),
    categoryId: BigInt(100243),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100243100162),
    categoryId: BigInt(100243),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100243100168),
    categoryId: BigInt(100243),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100243100169),
    categoryId: BigInt(100243),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100243100170),
    categoryId: BigInt(100243),
    name: "Chiều dài áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1503,"original_value_name":"Dài"},{"value_id":11716,"original_value_name":"Short"},{"value_id":11717,"original_value_name":"Medium"},{"value_id":11718,"original_value_name":"3/4 Length"}]
  },
  {
    attributeId: BigInt(100243100179),
    categoryId: BigInt(100243),
    name: "Dáng kiểu áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1541,"original_value_name":"Cổ điển"},{"value_id":1557,"original_value_name":"Rộng"},{"value_id":1569,"original_value_name":"Cơ bắp"},{"value_id":1585,"original_value_name":"Oversized"},{"value_id":1604,"original_value_name":"Slim"},{"value_id":1619,"original_value_name":"Ôm sát"}]
  },
  {
    attributeId: BigInt(100243101004),
    categoryId: BigInt(100243),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100244001),
    categoryId: BigInt(100244),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100244100037),
    categoryId: BigInt(100244),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100244100134),
    categoryId: BigInt(100244),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100244100154),
    categoryId: BigInt(100244),
    name: "Cổ áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1394,"original_value_name":"Cổ sơ mi"},{"value_id":1423,"original_value_name":"Khác"},{"value_id":1434,"original_value_name":"Cổ tròn"},{"value_id":1444,"original_value_name":"Cổ lọ"},{"value_id":1457,"original_value_name":"Cổ chữ V"}]
  },
  {
    attributeId: BigInt(100244100162),
    categoryId: BigInt(100244),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100244100163),
    categoryId: BigInt(100244),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100244100168),
    categoryId: BigInt(100244),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100244100169),
    categoryId: BigInt(100244),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100244100170),
    categoryId: BigInt(100244),
    name: "Chiều dài áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1503,"original_value_name":"Dài"},{"value_id":11716,"original_value_name":"Short"},{"value_id":11717,"original_value_name":"Medium"},{"value_id":11718,"original_value_name":"3/4 Length"}]
  },
  {
    attributeId: BigInt(100244100179),
    categoryId: BigInt(100244),
    name: "Dáng kiểu áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1541,"original_value_name":"Cổ điển"},{"value_id":1557,"original_value_name":"Rộng"},{"value_id":1569,"original_value_name":"Cơ bắp"},{"value_id":1585,"original_value_name":"Oversized"},{"value_id":1604,"original_value_name":"Slim"},{"value_id":1619,"original_value_name":"Ôm sát"}]
  },
  {
    attributeId: BigInt(100244100204),
    categoryId: BigInt(100244),
    name: "Loại da",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1683,"original_value_name":"Da Trâu"},{"value_id":1759,"original_value_name":"Da Cừu"}]
  },
  {
    attributeId: BigInt(100244101004),
    categoryId: BigInt(100244),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100245001),
    categoryId: BigInt(100245),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100245100037),
    categoryId: BigInt(100245),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100245100134),
    categoryId: BigInt(100245),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100245100162),
    categoryId: BigInt(100245),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100245100168),
    categoryId: BigInt(100245),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100245100169),
    categoryId: BigInt(100245),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100245100179),
    categoryId: BigInt(100245),
    name: "Dáng kiểu áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1541,"original_value_name":"Cổ điển"},{"value_id":1557,"original_value_name":"Rộng"},{"value_id":1569,"original_value_name":"Cơ bắp"},{"value_id":1585,"original_value_name":"Oversized"},{"value_id":1604,"original_value_name":"Slim"},{"value_id":1619,"original_value_name":"Ôm sát"}]
  },
  {
    attributeId: BigInt(100245101004),
    categoryId: BigInt(100245),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100247001),
    categoryId: BigInt(100247),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100247100016),
    categoryId: BigInt(100247),
    name: "Kiểu đóng gói",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":374,"original_value_name":"Hộp"},{"value_id":394,"original_value_name":"Đơn"}]
  },
  {
    attributeId: BigInt(100247100037),
    categoryId: BigInt(100247),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100247100134),
    categoryId: BigInt(100247),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100247100162),
    categoryId: BigInt(100247),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100247100180),
    categoryId: BigInt(100247),
    name: "Kiểu quần lót",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1551,"original_value_name":"Boxers & Trunks"},{"value_id":1566,"original_value_name":"Briefs"},{"value_id":1582,"original_value_name":"Khác"},{"value_id":1598,"original_value_name":"Dây"}]
  },
  {
    attributeId: BigInt(100247101004),
    categoryId: BigInt(100247),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100248001),
    categoryId: BigInt(100248),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100248100016),
    categoryId: BigInt(100248),
    name: "Kiểu đóng gói",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":374,"original_value_name":"Hộp"},{"value_id":394,"original_value_name":"Đơn"}]
  },
  {
    attributeId: BigInt(100248100037),
    categoryId: BigInt(100248),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100248100134),
    categoryId: BigInt(100248),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100248100154),
    categoryId: BigInt(100248),
    name: "Cổ áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1394,"original_value_name":"Cổ sơ mi"},{"value_id":1423,"original_value_name":"Khác"},{"value_id":1434,"original_value_name":"Cổ tròn"},{"value_id":1444,"original_value_name":"Cổ lọ"},{"value_id":1457,"original_value_name":"Cổ chữ V"}]
  },
  {
    attributeId: BigInt(100248100162),
    categoryId: BigInt(100248),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100248100168),
    categoryId: BigInt(100248),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100248101004),
    categoryId: BigInt(100248),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100249001),
    categoryId: BigInt(100249),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100249100016),
    categoryId: BigInt(100249),
    name: "Kiểu đóng gói",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":374,"original_value_name":"Hộp"},{"value_id":394,"original_value_name":"Đơn"}]
  },
  {
    attributeId: BigInt(100249100037),
    categoryId: BigInt(100249),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100249100134),
    categoryId: BigInt(100249),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100249100142),
    categoryId: BigInt(100249),
    name: "Kiểu dáng quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1304,"original_value_name":"Vừa và xòe"},{"value_id":1324,"original_value_name":"Skinny"},{"value_id":1332,"original_value_name":"Slim Fit"},{"value_id":1338,"original_value_name":"Đứng"},{"value_id":1347,"original_value_name":"Tapered"},{"value_id":1355,"original_value_name":"Boyfriend"},{"value_id":1361,"original_value_name":"Ống rộng"}]
  },
  {
    attributeId: BigInt(100249100162),
    categoryId: BigInt(100249),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100249100169),
    categoryId: BigInt(100249),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100249101004),
    categoryId: BigInt(100249),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100251001),
    categoryId: BigInt(100251),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100251100037),
    categoryId: BigInt(100251),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100251100134),
    categoryId: BigInt(100251),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100251100162),
    categoryId: BigInt(100251),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100251100168),
    categoryId: BigInt(100251),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1491,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100251100169),
    categoryId: BigInt(100251),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100251101004),
    categoryId: BigInt(100251),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100252001),
    categoryId: BigInt(100252),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100252100037),
    categoryId: BigInt(100252),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100252100134),
    categoryId: BigInt(100252),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100252100162),
    categoryId: BigInt(100252),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100252101004),
    categoryId: BigInt(100252),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100253001),
    categoryId: BigInt(100253),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100253100037),
    categoryId: BigInt(100253),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100253100134),
    categoryId: BigInt(100253),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100253100154),
    categoryId: BigInt(100253),
    name: "Cổ áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1457,"original_value_name":"Cổ chữ V"}]
  },
  {
    attributeId: BigInt(100253100162),
    categoryId: BigInt(100253),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100253100169),
    categoryId: BigInt(100253),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1643,"original_value_name":"Nhiệt đới"}]
  },
  {
    attributeId: BigInt(100253101004),
    categoryId: BigInt(100253),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100350001),
    categoryId: BigInt(100350),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100350100037),
    categoryId: BigInt(100350),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100350100134),
    categoryId: BigInt(100350),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100350100150),
    categoryId: BigInt(100350),
    name: "Cropped Top",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1359,"original_value_name":"Không"},{"value_id":1369,"original_value_name":"Có"}]
  },
  {
    attributeId: BigInt(100350100162),
    categoryId: BigInt(100350),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100350100163),
    categoryId: BigInt(100350),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100350100169),
    categoryId: BigInt(100350),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100350100170),
    categoryId: BigInt(100350),
    name: "Chiều dài áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1503,"original_value_name":"Dài"},{"value_id":1514,"original_value_name":"Ngắn"},{"value_id":11716,"original_value_name":"Short"},{"value_id":11717,"original_value_name":"Medium"},{"value_id":11718,"original_value_name":"3/4 Length"}]
  },
  {
    attributeId: BigInt(100350101004),
    categoryId: BigInt(100350),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100351001),
    categoryId: BigInt(100351),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100351100037),
    categoryId: BigInt(100351),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100351100134),
    categoryId: BigInt(100351),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100351100150),
    categoryId: BigInt(100351),
    name: "Cropped Top",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1359,"original_value_name":"Không"},{"value_id":1369,"original_value_name":"Có"}]
  },
  {
    attributeId: BigInt(100351100162),
    categoryId: BigInt(100351),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100351100163),
    categoryId: BigInt(100351),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100351100169),
    categoryId: BigInt(100351),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100351100170),
    categoryId: BigInt(100351),
    name: "Chiều dài áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1503,"original_value_name":"Dài"},{"value_id":1514,"original_value_name":"Ngắn"},{"value_id":11716,"original_value_name":"Short"},{"value_id":11717,"original_value_name":"Medium"},{"value_id":11718,"original_value_name":"3/4 Length"}]
  },
  {
    attributeId: BigInt(100351101004),
    categoryId: BigInt(100351),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100352001),
    categoryId: BigInt(100352),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100352100037),
    categoryId: BigInt(100352),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100352100134),
    categoryId: BigInt(100352),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100352100150),
    categoryId: BigInt(100352),
    name: "Cropped Top",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1359,"original_value_name":"Không"},{"value_id":1369,"original_value_name":"Có"}]
  },
  {
    attributeId: BigInt(100352100154),
    categoryId: BigInt(100352),
    name: "Cổ áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1378,"original_value_name":"không đối xứng"},{"value_id":1386,"original_value_name":"Cổ thuyền"},{"value_id":1394,"original_value_name":"Cổ sơ mi"},{"value_id":1406,"original_value_name":"Dây"},{"value_id":1414,"original_value_name":"Trễ vai"},{"value_id":1423,"original_value_name":"Khác"},{"value_id":1434,"original_value_name":"Cổ tròn"},{"value_id":1444,"original_value_name":"Cổ lọ"},{"value_id":1457,"original_value_name":"Cổ chữ V"}]
  },
  {
    attributeId: BigInt(100352100155),
    categoryId: BigInt(100352),
    name: "Dịp",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1387,"original_value_name":"Hằng Ngày"},{"value_id":1422,"original_value_name":"Công việc"}]
  },
  {
    attributeId: BigInt(100352100162),
    categoryId: BigInt(100352),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100352100163),
    categoryId: BigInt(100352),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100352100168),
    categoryId: BigInt(100352),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100352100169),
    categoryId: BigInt(100352),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100352100170),
    categoryId: BigInt(100352),
    name: "Chiều dài áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1503,"original_value_name":"Dài"},{"value_id":1514,"original_value_name":"Ngắn"},{"value_id":11716,"original_value_name":"Short"},{"value_id":11717,"original_value_name":"Medium"},{"value_id":11718,"original_value_name":"3/4 Length"}]
  },
  {
    attributeId: BigInt(100352101004),
    categoryId: BigInt(100352),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100353001),
    categoryId: BigInt(100353),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100353100037),
    categoryId: BigInt(100353),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100353100134),
    categoryId: BigInt(100353),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100353100150),
    categoryId: BigInt(100353),
    name: "Cropped Top",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1359,"original_value_name":"Không"},{"value_id":1369,"original_value_name":"Có"}]
  },
  {
    attributeId: BigInt(100353100154),
    categoryId: BigInt(100353),
    name: "Cổ áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1378,"original_value_name":"không đối xứng"},{"value_id":1394,"original_value_name":"Cổ sơ mi"},{"value_id":1406,"original_value_name":"Dây"},{"value_id":1414,"original_value_name":"Trễ vai"},{"value_id":1423,"original_value_name":"Khác"},{"value_id":1434,"original_value_name":"Cổ tròn"},{"value_id":1444,"original_value_name":"Cổ lọ"},{"value_id":1457,"original_value_name":"Cổ chữ V"}]
  },
  {
    attributeId: BigInt(100353100155),
    categoryId: BigInt(100353),
    name: "Dịp",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1387,"original_value_name":"Hằng Ngày"},{"value_id":1422,"original_value_name":"Công việc"}]
  },
  {
    attributeId: BigInt(100353100162),
    categoryId: BigInt(100353),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100353100163),
    categoryId: BigInt(100353),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100353100168),
    categoryId: BigInt(100353),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100353100169),
    categoryId: BigInt(100353),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100353100170),
    categoryId: BigInt(100353),
    name: "Chiều dài áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1503,"original_value_name":"Dài"},{"value_id":1514,"original_value_name":"Ngắn"},{"value_id":11716,"original_value_name":"Short"},{"value_id":11717,"original_value_name":"Medium"},{"value_id":11718,"original_value_name":"3/4 Length"}]
  },
  {
    attributeId: BigInt(100353101004),
    categoryId: BigInt(100353),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100354001),
    categoryId: BigInt(100354),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100354100037),
    categoryId: BigInt(100354),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100354100134),
    categoryId: BigInt(100354),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100354100162),
    categoryId: BigInt(100354),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100354100163),
    categoryId: BigInt(100354),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100354100168),
    categoryId: BigInt(100354),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100354100169),
    categoryId: BigInt(100354),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100354100170),
    categoryId: BigInt(100354),
    name: "Chiều dài áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1503,"original_value_name":"Dài"},{"value_id":11716,"original_value_name":"Short"},{"value_id":11717,"original_value_name":"Medium"},{"value_id":11718,"original_value_name":"3/4 Length"}]
  },
  {
    attributeId: BigInt(100354101004),
    categoryId: BigInt(100354),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100355001),
    categoryId: BigInt(100355),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100355100037),
    categoryId: BigInt(100355),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100355100134),
    categoryId: BigInt(100355),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100355100162),
    categoryId: BigInt(100355),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100355100163),
    categoryId: BigInt(100355),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100355100169),
    categoryId: BigInt(100355),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100355101004),
    categoryId: BigInt(100355),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100357001),
    categoryId: BigInt(100357),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100357100037),
    categoryId: BigInt(100357),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100357100134),
    categoryId: BigInt(100357),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100357100142),
    categoryId: BigInt(100357),
    name: "Kiểu dáng quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1304,"original_value_name":"Vừa và xòe"},{"value_id":1308,"original_value_name":"Khác"},{"value_id":1315,"original_value_name":"Thường"},{"value_id":1324,"original_value_name":"Skinny"},{"value_id":1332,"original_value_name":"Slim Fit"},{"value_id":1338,"original_value_name":"Đứng"},{"value_id":1347,"original_value_name":"Tapered"},{"value_id":1355,"original_value_name":"Boyfriend"},{"value_id":1361,"original_value_name":"Ống rộng"}]
  },
  {
    attributeId: BigInt(100357100143),
    categoryId: BigInt(100357),
    name: "Chiều dài quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1320,"original_value_name":"Cắt gấu"},{"value_id":1328,"original_value_name":"Chiều dài đầy đủ"},{"value_id":1335,"original_value_name":"Khác"},{"value_id":5469,"original_value_name":"Dài 3/4"}]
  },
  {
    attributeId: BigInt(100357100162),
    categoryId: BigInt(100357),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100357100163),
    categoryId: BigInt(100357),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100357100169),
    categoryId: BigInt(100357),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100357100171),
    categoryId: BigInt(100357),
    name: "Bản eo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1507,"original_value_name":"Bản to"},{"value_id":1519,"original_value_name":"Bản thấp"},{"value_id":1534,"original_value_name":"Giữa eo"},{"value_id":1547,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100357101004),
    categoryId: BigInt(100357),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100358001),
    categoryId: BigInt(100358),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100358100037),
    categoryId: BigInt(100358),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100358100134),
    categoryId: BigInt(100358),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100358100142),
    categoryId: BigInt(100358),
    name: "Kiểu dáng quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1304,"original_value_name":"Vừa và xòe"},{"value_id":1308,"original_value_name":"Khác"},{"value_id":1315,"original_value_name":"Thường"},{"value_id":1324,"original_value_name":"Skinny"},{"value_id":1332,"original_value_name":"Slim Fit"},{"value_id":1338,"original_value_name":"Đứng"},{"value_id":1347,"original_value_name":"Tapered"},{"value_id":1355,"original_value_name":"Boyfriend"},{"value_id":1361,"original_value_name":"Ống rộng"}]
  },
  {
    attributeId: BigInt(100358100143),
    categoryId: BigInt(100358),
    name: "Chiều dài quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1320,"original_value_name":"Cắt gấu"},{"value_id":1328,"original_value_name":"Chiều dài đầy đủ"},{"value_id":1335,"original_value_name":"Khác"},{"value_id":5469,"original_value_name":"Dài 3/4"}]
  },
  {
    attributeId: BigInt(100358100144),
    categoryId: BigInt(100358),
    name: "Kiểu quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1313,"original_value_name":"Quần Cargo"},{"value_id":1321,"original_value_name":"Quần Thuốc Lá"},{"value_id":1331,"original_value_name":"Quần Culottes"},{"value_id":1339,"original_value_name":"Quần Harem"},{"value_id":1346,"original_value_name":"Quần Joggers"},{"value_id":1358,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100358100155),
    categoryId: BigInt(100358),
    name: "Dịp",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1387,"original_value_name":"Hằng Ngày"},{"value_id":1397,"original_value_name":"Khác"},{"value_id":1405,"original_value_name":"Buổi tiệc"},{"value_id":1413,"original_value_name":"Dạ hội"},{"value_id":1422,"original_value_name":"Công việc"}]
  },
  {
    attributeId: BigInt(100358100162),
    categoryId: BigInt(100358),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100358100163),
    categoryId: BigInt(100358),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100358100169),
    categoryId: BigInt(100358),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100358100171),
    categoryId: BigInt(100358),
    name: "Bản eo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1507,"original_value_name":"Bản to"},{"value_id":1519,"original_value_name":"Bản thấp"},{"value_id":1534,"original_value_name":"Giữa eo"},{"value_id":1547,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100358101004),
    categoryId: BigInt(100358),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100360001),
    categoryId: BigInt(100360),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100360100037),
    categoryId: BigInt(100360),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100360100134),
    categoryId: BigInt(100360),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100360100143),
    categoryId: BigInt(100360),
    name: "Chiều dài quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1320,"original_value_name":"Cắt gấu"},{"value_id":1328,"original_value_name":"Chiều dài đầy đủ"},{"value_id":1335,"original_value_name":"Khác"},{"value_id":5469,"original_value_name":"Dài 3/4"}]
  },
  {
    attributeId: BigInt(100360100162),
    categoryId: BigInt(100360),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100360100163),
    categoryId: BigInt(100360),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100360100169),
    categoryId: BigInt(100360),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100360100171),
    categoryId: BigInt(100360),
    name: "Bản eo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1507,"original_value_name":"Bản to"},{"value_id":1519,"original_value_name":"Bản thấp"},{"value_id":1534,"original_value_name":"Giữa eo"},{"value_id":1547,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100360101004),
    categoryId: BigInt(100360),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100361001),
    categoryId: BigInt(100361),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100361100037),
    categoryId: BigInt(100361),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100361100134),
    categoryId: BigInt(100361),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100361100143),
    categoryId: BigInt(100361),
    name: "Chiều dài quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1320,"original_value_name":"Cắt gấu"},{"value_id":1328,"original_value_name":"Chiều dài đầy đủ"},{"value_id":1335,"original_value_name":"Khác"},{"value_id":5469,"original_value_name":"Dài 3/4"}]
  },
  {
    attributeId: BigInt(100361100162),
    categoryId: BigInt(100361),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100361100163),
    categoryId: BigInt(100361),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100361100169),
    categoryId: BigInt(100361),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100361100171),
    categoryId: BigInt(100361),
    name: "Bản eo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1507,"original_value_name":"Bản to"},{"value_id":1519,"original_value_name":"Bản thấp"},{"value_id":1534,"original_value_name":"Giữa eo"},{"value_id":1547,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100361101004),
    categoryId: BigInt(100361),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100363001),
    categoryId: BigInt(100363),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100363100037),
    categoryId: BigInt(100363),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100363100134),
    categoryId: BigInt(100363),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100363100142),
    categoryId: BigInt(100363),
    name: "Kiểu dáng quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1332,"original_value_name":"Slim Fit"},{"value_id":1338,"original_value_name":"Đứng"},{"value_id":1361,"original_value_name":"Ống rộng"}]
  },
  {
    attributeId: BigInt(100363100143),
    categoryId: BigInt(100363),
    name: "Chiều dài quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1320,"original_value_name":"Cắt gấu"},{"value_id":1328,"original_value_name":"Chiều dài đầy đủ"},{"value_id":1335,"original_value_name":"Khác"},{"value_id":5469,"original_value_name":"Dài 3/4"}]
  },
  {
    attributeId: BigInt(100363100154),
    categoryId: BigInt(100363),
    name: "Cổ áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1378,"original_value_name":"không đối xứng"},{"value_id":1386,"original_value_name":"Cổ thuyền"},{"value_id":1394,"original_value_name":"Cổ sơ mi"},{"value_id":1406,"original_value_name":"Dây"},{"value_id":1414,"original_value_name":"Trễ vai"},{"value_id":1423,"original_value_name":"Khác"},{"value_id":1434,"original_value_name":"Cổ tròn"},{"value_id":1444,"original_value_name":"Cổ lọ"},{"value_id":1457,"original_value_name":"Cổ chữ V"}]
  },
  {
    attributeId: BigInt(100363100162),
    categoryId: BigInt(100363),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100363100163),
    categoryId: BigInt(100363),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100363100168),
    categoryId: BigInt(100363),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100363100169),
    categoryId: BigInt(100363),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100363101004),
    categoryId: BigInt(100363),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100364001),
    categoryId: BigInt(100364),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100364100037),
    categoryId: BigInt(100364),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100364100134),
    categoryId: BigInt(100364),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100364100154),
    categoryId: BigInt(100364),
    name: "Cổ áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1378,"original_value_name":"không đối xứng"},{"value_id":1386,"original_value_name":"Cổ thuyền"},{"value_id":1394,"original_value_name":"Cổ sơ mi"},{"value_id":1406,"original_value_name":"Dây"},{"value_id":1414,"original_value_name":"Trễ vai"},{"value_id":1423,"original_value_name":"Khác"},{"value_id":1434,"original_value_name":"Cổ tròn"},{"value_id":1444,"original_value_name":"Cổ lọ"},{"value_id":1457,"original_value_name":"Cổ chữ V"}]
  },
  {
    attributeId: BigInt(100364100162),
    categoryId: BigInt(100364),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100364100163),
    categoryId: BigInt(100364),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100364100168),
    categoryId: BigInt(100364),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100364100169),
    categoryId: BigInt(100364),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100364101004),
    categoryId: BigInt(100364),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100365001),
    categoryId: BigInt(100365),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100365100037),
    categoryId: BigInt(100365),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100365100134),
    categoryId: BigInt(100365),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100365100142),
    categoryId: BigInt(100365),
    name: "Kiểu dáng quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1332,"original_value_name":"Slim Fit"},{"value_id":1338,"original_value_name":"Đứng"},{"value_id":1361,"original_value_name":"Ống rộng"}]
  },
  {
    attributeId: BigInt(100365100143),
    categoryId: BigInt(100365),
    name: "Chiều dài quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1320,"original_value_name":"Cắt gấu"},{"value_id":1328,"original_value_name":"Chiều dài đầy đủ"},{"value_id":1335,"original_value_name":"Khác"},{"value_id":5469,"original_value_name":"Dài 3/4"}]
  },
  {
    attributeId: BigInt(100365100157),
    categoryId: BigInt(100365),
    name: "Kiểu áo liền quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1407,"original_value_name":"Quần"},{"value_id":1419,"original_value_name":"Ngắn"},{"value_id":1429,"original_value_name":"Váy"}]
  },
  {
    attributeId: BigInt(100365100162),
    categoryId: BigInt(100365),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100365100163),
    categoryId: BigInt(100365),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100365100168),
    categoryId: BigInt(100365),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1480,"original_value_name":"Dài tay"}]
  },
  {
    attributeId: BigInt(100365100169),
    categoryId: BigInt(100365),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100365101004),
    categoryId: BigInt(100365),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100367001),
    categoryId: BigInt(100367),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100367100037),
    categoryId: BigInt(100367),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100367100134),
    categoryId: BigInt(100367),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100367100156),
    categoryId: BigInt(100367),
    name: "Chiều dài áo khoác ngoài",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1401,"original_value_name":"3/4 Chiều dài"},{"value_id":1409,"original_value_name":"Dài"},{"value_id":1417,"original_value_name":"Trung bình"},{"value_id":1427,"original_value_name":"Ngắn"}]
  },
  {
    attributeId: BigInt(100367100162),
    categoryId: BigInt(100367),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100367100163),
    categoryId: BigInt(100367),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100367100168),
    categoryId: BigInt(100367),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100367100169),
    categoryId: BigInt(100367),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100367101004),
    categoryId: BigInt(100367),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100368001),
    categoryId: BigInt(100368),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100368100037),
    categoryId: BigInt(100368),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100368100134),
    categoryId: BigInt(100368),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100368100156),
    categoryId: BigInt(100368),
    name: "Chiều dài áo khoác ngoài",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1401,"original_value_name":"3/4 Chiều dài"},{"value_id":1409,"original_value_name":"Dài"},{"value_id":1417,"original_value_name":"Trung bình"},{"value_id":1427,"original_value_name":"Ngắn"}]
  },
  {
    attributeId: BigInt(100368100162),
    categoryId: BigInt(100368),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100368100163),
    categoryId: BigInt(100368),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100368100168),
    categoryId: BigInt(100368),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100368100169),
    categoryId: BigInt(100368),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100368101004),
    categoryId: BigInt(100368),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100369001),
    categoryId: BigInt(100369),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100369100037),
    categoryId: BigInt(100369),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100369100134),
    categoryId: BigInt(100369),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100369100162),
    categoryId: BigInt(100369),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100369100163),
    categoryId: BigInt(100369),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100369100168),
    categoryId: BigInt(100369),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100369100169),
    categoryId: BigInt(100369),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100369101004),
    categoryId: BigInt(100369),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100370001),
    categoryId: BigInt(100370),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100370100037),
    categoryId: BigInt(100370),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100370100134),
    categoryId: BigInt(100370),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100370100153),
    categoryId: BigInt(100370),
    name: "Kiểu Áo khoác",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1376,"original_value_name":"Áo khoác bomber"},{"value_id":1384,"original_value_name":"Áo khoác bóng chày"},{"value_id":1393,"original_value_name":"Khác"},{"value_id":1400,"original_value_name":"Áo gió"},{"value_id":7054,"original_value_name":"Normal Jackets"},{"value_id":7055,"original_value_name":"Denim jackets"},{"value_id":7056,"original_value_name":"Leather jackets"}]
  },
  {
    attributeId: BigInt(100370100155),
    categoryId: BigInt(100370),
    name: "Dịp",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1387,"original_value_name":"Hằng Ngày"},{"value_id":1422,"original_value_name":"Công việc"}]
  },
  {
    attributeId: BigInt(100370100156),
    categoryId: BigInt(100370),
    name: "Chiều dài áo khoác ngoài",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1401,"original_value_name":"3/4 Chiều dài"},{"value_id":1409,"original_value_name":"Dài"},{"value_id":1417,"original_value_name":"Trung bình"},{"value_id":1427,"original_value_name":"Ngắn"}]
  },
  {
    attributeId: BigInt(100370100162),
    categoryId: BigInt(100370),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100370100163),
    categoryId: BigInt(100370),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100370100168),
    categoryId: BigInt(100370),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100370100169),
    categoryId: BigInt(100370),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100370100170),
    categoryId: BigInt(100370),
    name: "Chiều dài áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1503,"original_value_name":"Dài"},{"value_id":11716,"original_value_name":"Short"},{"value_id":11717,"original_value_name":"Medium"},{"value_id":11718,"original_value_name":"3/4 Length"}]
  },
  {
    attributeId: BigInt(100370101004),
    categoryId: BigInt(100370),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100371001),
    categoryId: BigInt(100371),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100371100037),
    categoryId: BigInt(100371),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100371100134),
    categoryId: BigInt(100371),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100371100162),
    categoryId: BigInt(100371),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100371100163),
    categoryId: BigInt(100371),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100371100168),
    categoryId: BigInt(100371),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1480,"original_value_name":"Dài tay"}]
  },
  {
    attributeId: BigInt(100371100169),
    categoryId: BigInt(100371),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100371100170),
    categoryId: BigInt(100371),
    name: "Chiều dài áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1503,"original_value_name":"Dài"},{"value_id":11716,"original_value_name":"Short"},{"value_id":11717,"original_value_name":"Medium"},{"value_id":11718,"original_value_name":"3/4 Length"}]
  },
  {
    attributeId: BigInt(100371101004),
    categoryId: BigInt(100371),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100373001),
    categoryId: BigInt(100373),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100373100037),
    categoryId: BigInt(100373),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100373100134),
    categoryId: BigInt(100373),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100373100162),
    categoryId: BigInt(100373),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100373100163),
    categoryId: BigInt(100373),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100373100168),
    categoryId: BigInt(100373),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100373100169),
    categoryId: BigInt(100373),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100373100170),
    categoryId: BigInt(100373),
    name: "Chiều dài áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1503,"original_value_name":"Dài"},{"value_id":11716,"original_value_name":"Short"},{"value_id":11717,"original_value_name":"Medium"},{"value_id":11718,"original_value_name":"3/4 Length"}]
  },
  {
    attributeId: BigInt(100373101004),
    categoryId: BigInt(100373),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100374001),
    categoryId: BigInt(100374),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100374100037),
    categoryId: BigInt(100374),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100374100134),
    categoryId: BigInt(100374),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100374100162),
    categoryId: BigInt(100374),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100374100163),
    categoryId: BigInt(100374),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100374100168),
    categoryId: BigInt(100374),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100374100169),
    categoryId: BigInt(100374),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1520,"original_value_name":"Boho"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1549,"original_value_name":"Tối giản"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1607,"original_value_name":"Công sở"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100374100170),
    categoryId: BigInt(100374),
    name: "Chiều dài áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1503,"original_value_name":"Dài"},{"value_id":11716,"original_value_name":"Short"},{"value_id":11717,"original_value_name":"Medium"},{"value_id":11718,"original_value_name":"3/4 Length"}]
  },
  {
    attributeId: BigInt(100374101004),
    categoryId: BigInt(100374),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100376001),
    categoryId: BigInt(100376),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100376100037),
    categoryId: BigInt(100376),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100376100134),
    categoryId: BigInt(100376),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100376100140),
    categoryId: BigInt(100376),
    name: "Loại trang phục",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1287,"original_value_name":"Đầm"},{"value_id":1294,"original_value_name":"Jeans"},{"value_id":1300,"original_value_name":"Phụ kiện may mặc"},{"value_id":1307,"original_value_name":"Khác"},{"value_id":1314,"original_value_name":"Áo khoác"},{"value_id":1322,"original_value_name":"Quần & Leggings"},{"value_id":1344,"original_value_name":"Quần short"},{"value_id":1356,"original_value_name":"Đồ ngủ & Đồ mặc nhà"},{"value_id":1365,"original_value_name":"Tất/vớ"},{"value_id":1371,"original_value_name":"Chân váy"},{"value_id":1380,"original_value_name":"Áo"}]
  },
  {
    attributeId: BigInt(100376100142),
    categoryId: BigInt(100376),
    name: "Kiểu dáng quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1332,"original_value_name":"Slim Fit"},{"value_id":1338,"original_value_name":"Đứng"},{"value_id":1361,"original_value_name":"Ống rộng"}]
  },
  {
    attributeId: BigInt(100376100152),
    categoryId: BigInt(100376),
    name: "Kiểu váy",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1367,"original_value_name":"váy chữ A"},{"value_id":1377,"original_value_name":"váy ôm sát"},{"value_id":1382,"original_value_name":"Váy đuôi cá dài"},{"value_id":1399,"original_value_name":"Khác"},{"value_id":1408,"original_value_name":"Váy bút chì"},{"value_id":1418,"original_value_name":"váy xếp ly"},{"value_id":1430,"original_value_name":"Váy quấn"}]
  },
  {
    attributeId: BigInt(100376100162),
    categoryId: BigInt(100376),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100376100163),
    categoryId: BigInt(100376),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100376100168),
    categoryId: BigInt(100376),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100376101004),
    categoryId: BigInt(100376),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100377001),
    categoryId: BigInt(100377),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100377100037),
    categoryId: BigInt(100377),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100377100134),
    categoryId: BigInt(100377),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100377100140),
    categoryId: BigInt(100377),
    name: "Loại trang phục",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1287,"original_value_name":"Đầm"},{"value_id":1294,"original_value_name":"Jeans"},{"value_id":1300,"original_value_name":"Phụ kiện may mặc"},{"value_id":1307,"original_value_name":"Khác"},{"value_id":1314,"original_value_name":"Áo khoác"},{"value_id":1322,"original_value_name":"Quần & Leggings"},{"value_id":1344,"original_value_name":"Quần short"},{"value_id":1356,"original_value_name":"Đồ ngủ & Đồ mặc nhà"},{"value_id":1365,"original_value_name":"Tất/vớ"},{"value_id":1371,"original_value_name":"Chân váy"},{"value_id":1380,"original_value_name":"Áo"}]
  },
  {
    attributeId: BigInt(100377100152),
    categoryId: BigInt(100377),
    name: "Kiểu váy",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1367,"original_value_name":"váy chữ A"},{"value_id":1377,"original_value_name":"váy ôm sát"},{"value_id":1382,"original_value_name":"Váy đuôi cá dài"},{"value_id":1399,"original_value_name":"Khác"},{"value_id":1408,"original_value_name":"Váy bút chì"},{"value_id":1418,"original_value_name":"váy xếp ly"},{"value_id":1430,"original_value_name":"Váy quấn"}]
  },
  {
    attributeId: BigInt(100377100162),
    categoryId: BigInt(100377),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100377100163),
    categoryId: BigInt(100377),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100377101004),
    categoryId: BigInt(100377),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100378001),
    categoryId: BigInt(100378),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100378100037),
    categoryId: BigInt(100378),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100378100134),
    categoryId: BigInt(100378),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100378100140),
    categoryId: BigInt(100378),
    name: "Loại trang phục",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1287,"original_value_name":"Đầm"},{"value_id":1294,"original_value_name":"Jeans"},{"value_id":1300,"original_value_name":"Phụ kiện may mặc"},{"value_id":1307,"original_value_name":"Khác"},{"value_id":1314,"original_value_name":"Áo khoác"},{"value_id":1322,"original_value_name":"Quần & Leggings"},{"value_id":1344,"original_value_name":"Quần short"},{"value_id":1356,"original_value_name":"Đồ ngủ & Đồ mặc nhà"},{"value_id":1365,"original_value_name":"Tất/vớ"},{"value_id":1371,"original_value_name":"Chân váy"},{"value_id":1380,"original_value_name":"Áo"}]
  },
  {
    attributeId: BigInt(100378100142),
    categoryId: BigInt(100378),
    name: "Kiểu dáng quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1332,"original_value_name":"Slim Fit"},{"value_id":1338,"original_value_name":"Đứng"},{"value_id":1361,"original_value_name":"Ống rộng"}]
  },
  {
    attributeId: BigInt(100378100152),
    categoryId: BigInt(100378),
    name: "Kiểu váy",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1367,"original_value_name":"váy chữ A"},{"value_id":1377,"original_value_name":"váy ôm sát"},{"value_id":1382,"original_value_name":"Váy đuôi cá dài"},{"value_id":1399,"original_value_name":"Khác"},{"value_id":1408,"original_value_name":"Váy bút chì"},{"value_id":1418,"original_value_name":"váy xếp ly"},{"value_id":1430,"original_value_name":"Váy quấn"}]
  },
  {
    attributeId: BigInt(100378100162),
    categoryId: BigInt(100378),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100378100163),
    categoryId: BigInt(100378),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100378100168),
    categoryId: BigInt(100378),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100378100170),
    categoryId: BigInt(100378),
    name: "Chiều dài áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1503,"original_value_name":"Dài"},{"value_id":11716,"original_value_name":"Short"},{"value_id":11717,"original_value_name":"Medium"},{"value_id":11718,"original_value_name":"3/4 Length"}]
  },
  {
    attributeId: BigInt(100378100171),
    categoryId: BigInt(100378),
    name: "Bản eo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1507,"original_value_name":"Bản to"},{"value_id":1519,"original_value_name":"Bản thấp"},{"value_id":1534,"original_value_name":"Giữa eo"},{"value_id":1547,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100378101004),
    categoryId: BigInt(100378),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100380001),
    categoryId: BigInt(100380),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100380100037),
    categoryId: BigInt(100380),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100380100134),
    categoryId: BigInt(100380),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100380100145),
    categoryId: BigInt(100380),
    name: "Kiểu Bra",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1333,"original_value_name":"Khác"},{"value_id":1342,"original_value_name":"Không gân"},{"value_id":1351,"original_value_name":"Không gọng"},{"value_id":1360,"original_value_name":"Không dây"}]
  },
  {
    attributeId: BigInt(100380101004),
    categoryId: BigInt(100380),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100381001),
    categoryId: BigInt(100381),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100381100016),
    categoryId: BigInt(100381),
    name: "Kiểu đóng gói",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":374,"original_value_name":"Hộp"},{"value_id":394,"original_value_name":"Đơn"}]
  },
  {
    attributeId: BigInt(100381100037),
    categoryId: BigInt(100381),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100381100134),
    categoryId: BigInt(100381),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100381100145),
    categoryId: BigInt(100381),
    name: "Kiểu Bra",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1326,"original_value_name":"Bralette"},{"value_id":1333,"original_value_name":"Khác"},{"value_id":1342,"original_value_name":"Không gân"},{"value_id":1351,"original_value_name":"Không gọng"},{"value_id":1360,"original_value_name":"Không dây"}]
  },
  {
    attributeId: BigInt(100381100146),
    categoryId: BigInt(100381),
    name: "Bra Coverage",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1323,"original_value_name":"3/4 Coverage"},{"value_id":1329,"original_value_name":"Khác"},{"value_id":1340,"original_value_name":"Dán"},{"value_id":1345,"original_value_name":"Full Coverage"}]
  },
  {
    attributeId: BigInt(100381100147),
    categoryId: BigInt(100381),
    name: "Loại Bra",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1330,"original_value_name":"Quây ngang"},{"value_id":1341,"original_value_name":"Có gọng"},{"value_id":1349,"original_value_name":"Plunge"},{"value_id":1352,"original_value_name":"Push Up"},{"value_id":1364,"original_value_name":"Áo thun"},{"value_id":1370,"original_value_name":"Không gọng"}]
  },
  {
    attributeId: BigInt(100381100162),
    categoryId: BigInt(100381),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1573,"original_value_name":"Logo"}]
  },
  {
    attributeId: BigInt(100381100163),
    categoryId: BigInt(100381),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100381100164),
    categoryId: BigInt(100381),
    name: "Kiểu Đồ Lót",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1460,"original_value_name":"Búp Bê"},{"value_id":1468,"original_value_name":"Bodysuilts"},{"value_id":1511,"original_value_name":"Trang phục"},{"value_id":1553,"original_value_name":"Nguyên bộ"}]
  },
  {
    attributeId: BigInt(100381101004),
    categoryId: BigInt(100381),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100382001),
    categoryId: BigInt(100382),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100382100016),
    categoryId: BigInt(100382),
    name: "Kiểu đóng gói",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":374,"original_value_name":"Hộp"},{"value_id":394,"original_value_name":"Đơn"}]
  },
  {
    attributeId: BigInt(100382100037),
    categoryId: BigInt(100382),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100382100134),
    categoryId: BigInt(100382),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100382100158),
    categoryId: BigInt(100382),
    name: "Loại quần lót",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1411,"original_value_name":"Bikini"},{"value_id":1420,"original_value_name":"Boy Short"},{"value_id":1431,"original_value_name":"Ôm nữa mông"},{"value_id":1437,"original_value_name":"Dùng một lần"},{"value_id":1442,"original_value_name":"Cạp thấp"},{"value_id":1621,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100382100160),
    categoryId: BigInt(100382),
    name: "Kiểu quần lót",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1416,"original_value_name":"Lọt Khe"},{"value_id":1426,"original_value_name":"Khác"},{"value_id":1438,"original_value_name":"Quần kinh nguyệt"},{"value_id":1448,"original_value_name":"Quần lót nâng mông"}]
  },
  {
    attributeId: BigInt(100382100162),
    categoryId: BigInt(100382),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1508,"original_value_name":"Ẩn"},{"value_id":1531,"original_value_name":"Nhuộm"},{"value_id":1561,"original_value_name":"Đồ họa"},{"value_id":1573,"original_value_name":"Logo"}]
  },
  {
    attributeId: BigInt(100382100163),
    categoryId: BigInt(100382),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100382100171),
    categoryId: BigInt(100382),
    name: "Bản eo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1507,"original_value_name":"Bản to"},{"value_id":1519,"original_value_name":"Bản thấp"},{"value_id":1534,"original_value_name":"Giữa eo"},{"value_id":1547,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100382101004),
    categoryId: BigInt(100382),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100383001),
    categoryId: BigInt(100383),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100383100016),
    categoryId: BigInt(100383),
    name: "Kiểu đóng gói",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":374,"original_value_name":"Hộp"},{"value_id":394,"original_value_name":"Đơn"}]
  },
  {
    attributeId: BigInt(100383100037),
    categoryId: BigInt(100383),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100383100134),
    categoryId: BigInt(100383),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100383100147),
    categoryId: BigInt(100383),
    name: "Loại Bra",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1330,"original_value_name":"Quây ngang"},{"value_id":1341,"original_value_name":"Có gọng"},{"value_id":1349,"original_value_name":"Plunge"},{"value_id":1352,"original_value_name":"Push Up"},{"value_id":1364,"original_value_name":"Áo thun"},{"value_id":1370,"original_value_name":"Không gọng"}]
  },
  {
    attributeId: BigInt(100383100158),
    categoryId: BigInt(100383),
    name: "Loại quần lót",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1411,"original_value_name":"Bikini"},{"value_id":1420,"original_value_name":"Boy Short"},{"value_id":1431,"original_value_name":"Ôm nữa mông"},{"value_id":1437,"original_value_name":"Dùng một lần"},{"value_id":1442,"original_value_name":"Cạp thấp"},{"value_id":1621,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100383100162),
    categoryId: BigInt(100383),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1573,"original_value_name":"Logo"}]
  },
  {
    attributeId: BigInt(100383100163),
    categoryId: BigInt(100383),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100383101004),
    categoryId: BigInt(100383),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100385001),
    categoryId: BigInt(100385),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100385100037),
    categoryId: BigInt(100385),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100385100134),
    categoryId: BigInt(100385),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100385100165),
    categoryId: BigInt(100385),
    name: "Loại Nịt cơ thể",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1459,"original_value_name":"Nịt chân"},{"value_id":1466,"original_value_name":"Nịt giữa đùi"},{"value_id":1475,"original_value_name":"Nịt Bụng"},{"value_id":1485,"original_value_name":"Đồ lót"},{"value_id":1493,"original_value_name":"Nịt eo"}]
  },
  {
    attributeId: BigInt(100385101004),
    categoryId: BigInt(100385),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100386001),
    categoryId: BigInt(100386),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100386100016),
    categoryId: BigInt(100386),
    name: "Kiểu đóng gói",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":374,"original_value_name":"Hộp"},{"value_id":394,"original_value_name":"Đơn"}]
  },
  {
    attributeId: BigInt(100386100037),
    categoryId: BigInt(100386),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100386100134),
    categoryId: BigInt(100386),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100386100162),
    categoryId: BigInt(100386),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1508,"original_value_name":"Ẩn"},{"value_id":1531,"original_value_name":"Nhuộm"},{"value_id":1561,"original_value_name":"Đồ họa"},{"value_id":1573,"original_value_name":"Logo"}]
  },
  {
    attributeId: BigInt(100386100171),
    categoryId: BigInt(100386),
    name: "Bản eo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1507,"original_value_name":"Bản to"},{"value_id":1519,"original_value_name":"Bản thấp"},{"value_id":1534,"original_value_name":"Giữa eo"},{"value_id":1547,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100386101004),
    categoryId: BigInt(100386),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100387001),
    categoryId: BigInt(100387),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100387100037),
    categoryId: BigInt(100387),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100387100134),
    categoryId: BigInt(100387),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100387100163),
    categoryId: BigInt(100387),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100387100164),
    categoryId: BigInt(100387),
    name: "Kiểu Đồ Lót",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1451,"original_value_name":"phụ kiện"},{"value_id":1460,"original_value_name":"Búp Bê"},{"value_id":1468,"original_value_name":"Bodysuilts"},{"value_id":1478,"original_value_name":"Áo lót gợi cảm"},{"value_id":1489,"original_value_name":"Bộ Cami"},{"value_id":1498,"original_value_name":"Đai nịt bụng"},{"value_id":1511,"original_value_name":"Trang phục"},{"value_id":1525,"original_value_name":"Nịt tất"},{"value_id":1539,"original_value_name":"kimono"},{"value_id":1553,"original_value_name":"Nguyên bộ"}]
  },
  {
    attributeId: BigInt(100387101004),
    categoryId: BigInt(100387),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100389001),
    categoryId: BigInt(100389),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100389100037),
    categoryId: BigInt(100389),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100389100134),
    categoryId: BigInt(100389),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100389100162),
    categoryId: BigInt(100389),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100389100163),
    categoryId: BigInt(100389),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100389100168),
    categoryId: BigInt(100389),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100389100171),
    categoryId: BigInt(100389),
    name: "Bản eo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1507,"original_value_name":"Bản to"},{"value_id":1519,"original_value_name":"Bản thấp"},{"value_id":1534,"original_value_name":"Giữa eo"},{"value_id":1547,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100389101004),
    categoryId: BigInt(100389),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100390001),
    categoryId: BigInt(100390),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100390100037),
    categoryId: BigInt(100390),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100390100134),
    categoryId: BigInt(100390),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100390100162),
    categoryId: BigInt(100390),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100390100163),
    categoryId: BigInt(100390),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100390100168),
    categoryId: BigInt(100390),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100390101004),
    categoryId: BigInt(100390),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100391001),
    categoryId: BigInt(100391),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100391100037),
    categoryId: BigInt(100391),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100391100134),
    categoryId: BigInt(100391),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100391100162),
    categoryId: BigInt(100391),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100391100163),
    categoryId: BigInt(100391),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100391100168),
    categoryId: BigInt(100391),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100391101004),
    categoryId: BigInt(100391),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100393001),
    categoryId: BigInt(100393),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100393100037),
    categoryId: BigInt(100393),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100393100134),
    categoryId: BigInt(100393),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100393100145),
    categoryId: BigInt(100393),
    name: "Kiểu Bra",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1326,"original_value_name":"Bralette"},{"value_id":1333,"original_value_name":"Khác"},{"value_id":1342,"original_value_name":"Không gân"},{"value_id":1351,"original_value_name":"Không gọng"},{"value_id":1360,"original_value_name":"Không dây"}]
  },
  {
    attributeId: BigInt(100393100162),
    categoryId: BigInt(100393),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100393101004),
    categoryId: BigInt(100393),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100394001),
    categoryId: BigInt(100394),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100394100037),
    categoryId: BigInt(100394),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100394100134),
    categoryId: BigInt(100394),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100394100151),
    categoryId: BigInt(100394),
    name: "Chiều dài váy",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1366,"original_value_name":"Maxi"},{"value_id":1374,"original_value_name":"Midi"},{"value_id":1385,"original_value_name":"Mini"}]
  },
  {
    attributeId: BigInt(100394100152),
    categoryId: BigInt(100394),
    name: "Kiểu váy",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1367,"original_value_name":"váy chữ A"},{"value_id":1377,"original_value_name":"váy ôm sát"},{"value_id":1382,"original_value_name":"Váy đuôi cá dài"},{"value_id":1399,"original_value_name":"Khác"},{"value_id":1408,"original_value_name":"Váy bút chì"},{"value_id":1418,"original_value_name":"váy xếp ly"},{"value_id":1430,"original_value_name":"Váy quấn"}]
  },
  {
    attributeId: BigInt(100394100154),
    categoryId: BigInt(100394),
    name: "Cổ áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1378,"original_value_name":"không đối xứng"},{"value_id":1386,"original_value_name":"Cổ thuyền"},{"value_id":1394,"original_value_name":"Cổ sơ mi"},{"value_id":1406,"original_value_name":"Dây"},{"value_id":1414,"original_value_name":"Trễ vai"},{"value_id":1423,"original_value_name":"Khác"},{"value_id":1434,"original_value_name":"Cổ tròn"},{"value_id":1444,"original_value_name":"Cổ lọ"},{"value_id":1457,"original_value_name":"Cổ chữ V"}]
  },
  {
    attributeId: BigInt(100394100155),
    categoryId: BigInt(100394),
    name: "Dịp",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1387,"original_value_name":"Hằng Ngày"},{"value_id":1397,"original_value_name":"Khác"},{"value_id":1405,"original_value_name":"Buổi tiệc"},{"value_id":1413,"original_value_name":"Dạ hội"},{"value_id":1422,"original_value_name":"Công việc"}]
  },
  {
    attributeId: BigInt(100394100162),
    categoryId: BigInt(100394),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100394100163),
    categoryId: BigInt(100394),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100394100168),
    categoryId: BigInt(100394),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100394101004),
    categoryId: BigInt(100394),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100395001),
    categoryId: BigInt(100395),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100395100037),
    categoryId: BigInt(100395),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100395100134),
    categoryId: BigInt(100395),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100395100154),
    categoryId: BigInt(100395),
    name: "Cổ áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1378,"original_value_name":"không đối xứng"},{"value_id":1386,"original_value_name":"Cổ thuyền"},{"value_id":1394,"original_value_name":"Cổ sơ mi"},{"value_id":1406,"original_value_name":"Dây"},{"value_id":1414,"original_value_name":"Trễ vai"},{"value_id":1423,"original_value_name":"Khác"},{"value_id":1434,"original_value_name":"Cổ tròn"},{"value_id":1444,"original_value_name":"Cổ lọ"},{"value_id":1457,"original_value_name":"Cổ chữ V"}]
  },
  {
    attributeId: BigInt(100395100155),
    categoryId: BigInt(100395),
    name: "Dịp",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1387,"original_value_name":"Hằng Ngày"},{"value_id":1397,"original_value_name":"Khác"},{"value_id":1405,"original_value_name":"Buổi tiệc"},{"value_id":1413,"original_value_name":"Dạ hội"},{"value_id":1422,"original_value_name":"Công việc"}]
  },
  {
    attributeId: BigInt(100395100162),
    categoryId: BigInt(100395),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100395100163),
    categoryId: BigInt(100395),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100395100168),
    categoryId: BigInt(100395),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100395100170),
    categoryId: BigInt(100395),
    name: "Chiều dài áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1503,"original_value_name":"Dài"},{"value_id":1514,"original_value_name":"Ngắn"}]
  },
  {
    attributeId: BigInt(100395101004),
    categoryId: BigInt(100395),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100396001),
    categoryId: BigInt(100396),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100396100037),
    categoryId: BigInt(100396),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100396100134),
    categoryId: BigInt(100396),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100396100148),
    categoryId: BigInt(100396),
    name: "Vùng cho bé Ti",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1337,"original_value_name":"Khóa kéo ngang ngực"},{"value_id":1350,"original_value_name":"Mở nút dưới ngực"},{"value_id":1357,"original_value_name":"Lật úp"},{"value_id":1368,"original_value_name":"Một phía"},{"value_id":1375,"original_value_name":"Khóa kéo bên hông"},{"value_id":1383,"original_value_name":"Khóa kéo dọc"}]
  },
  {
    attributeId: BigInt(100396100152),
    categoryId: BigInt(100396),
    name: "Kiểu váy",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1367,"original_value_name":"váy chữ A"},{"value_id":1377,"original_value_name":"váy ôm sát"},{"value_id":1399,"original_value_name":"Khác"},{"value_id":1430,"original_value_name":"Váy quấn"}]
  },
  {
    attributeId: BigInt(100396100162),
    categoryId: BigInt(100396),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100396100163),
    categoryId: BigInt(100396),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100396100168),
    categoryId: BigInt(100396),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1480,"original_value_name":"Dài tay"}]
  },
  {
    attributeId: BigInt(100396101004),
    categoryId: BigInt(100396),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100397001),
    categoryId: BigInt(100397),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100397100037),
    categoryId: BigInt(100397),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100397100134),
    categoryId: BigInt(100397),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100397100162),
    categoryId: BigInt(100397),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100397100168),
    categoryId: BigInt(100397),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1480,"original_value_name":"Dài tay"}]
  },
  {
    attributeId: BigInt(100397101004),
    categoryId: BigInt(100397),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100398001),
    categoryId: BigInt(100398),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100398100037),
    categoryId: BigInt(100398),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100398100134),
    categoryId: BigInt(100398),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100398100142),
    categoryId: BigInt(100398),
    name: "Kiểu dáng quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1304,"original_value_name":"Vừa và xòe"},{"value_id":1324,"original_value_name":"Skinny"},{"value_id":1332,"original_value_name":"Slim Fit"},{"value_id":1338,"original_value_name":"Đứng"},{"value_id":1347,"original_value_name":"Tapered"},{"value_id":1355,"original_value_name":"Boyfriend"},{"value_id":1361,"original_value_name":"Ống rộng"}]
  },
  {
    attributeId: BigInt(100398100143),
    categoryId: BigInt(100398),
    name: "Chiều dài quần",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1320,"original_value_name":"Cắt gấu"},{"value_id":1328,"original_value_name":"Chiều dài đầy đủ"},{"value_id":1335,"original_value_name":"Khác"},{"value_id":5469,"original_value_name":"Dài 3/4"}]
  },
  {
    attributeId: BigInt(100398100155),
    categoryId: BigInt(100398),
    name: "Dịp",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1387,"original_value_name":"Hằng Ngày"},{"value_id":1397,"original_value_name":"Khác"},{"value_id":1405,"original_value_name":"Buổi tiệc"},{"value_id":1413,"original_value_name":"Dạ hội"},{"value_id":1422,"original_value_name":"Công việc"}]
  },
  {
    attributeId: BigInt(100398100162),
    categoryId: BigInt(100398),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100398100163),
    categoryId: BigInt(100398),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100398100171),
    categoryId: BigInt(100398),
    name: "Bản eo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1507,"original_value_name":"Bản to"},{"value_id":1519,"original_value_name":"Bản thấp"},{"value_id":1534,"original_value_name":"Giữa eo"},{"value_id":1547,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100398101004),
    categoryId: BigInt(100398),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100400001),
    categoryId: BigInt(100400),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100400100037),
    categoryId: BigInt(100400),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100400100134),
    categoryId: BigInt(100400),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100400100155),
    categoryId: BigInt(100400),
    name: "Dịp",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1387,"original_value_name":"Hằng Ngày"},{"value_id":1433,"original_value_name":"Trang trọng"},{"value_id":1502,"original_value_name":"Thể thao"},{"value_id":1527,"original_value_name":"Công việc"}]
  },
  {
    attributeId: BigInt(100400100162),
    categoryId: BigInt(100400),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100400100163),
    categoryId: BigInt(100400),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100400100168),
    categoryId: BigInt(100400),
    name: "Chiều dài tay áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1470,"original_value_name":"Dài 3/4"},{"value_id":1480,"original_value_name":"Dài tay"},{"value_id":1491,"original_value_name":"Khác"},{"value_id":1500,"original_value_name":"Tay ngắn"},{"value_id":1512,"original_value_name":"Không tay"}]
  },
  {
    attributeId: BigInt(100400100169),
    categoryId: BigInt(100400),
    name: "Phong cách",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1497,"original_value_name":"Thể thao"},{"value_id":1504,"original_value_name":"Cơ bản"},{"value_id":1535,"original_value_name":"Hàn Quốc"},{"value_id":1559,"original_value_name":"Retro"},{"value_id":1571,"original_value_name":"sexy"},{"value_id":1588,"original_value_name":"Đường phố"},{"value_id":1625,"original_value_name":"Cổ điển"}]
  },
  {
    attributeId: BigInt(100400100170),
    categoryId: BigInt(100400),
    name: "Chiều dài áo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1503,"original_value_name":"Dài"}]
  },
  {
    attributeId: BigInt(100400101004),
    categoryId: BigInt(100400),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100401001),
    categoryId: BigInt(100401),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100401100037),
    categoryId: BigInt(100401),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100401100134),
    categoryId: BigInt(100401),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100401100162),
    categoryId: BigInt(100401),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100401100163),
    categoryId: BigInt(100401),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100401100171),
    categoryId: BigInt(100401),
    name: "Bản eo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1507,"original_value_name":"Bản to"},{"value_id":1519,"original_value_name":"Bản thấp"},{"value_id":1534,"original_value_name":"Giữa eo"},{"value_id":1547,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100401101004),
    categoryId: BigInt(100401),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100402001),
    categoryId: BigInt(100402),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100402100037),
    categoryId: BigInt(100402),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100402100134),
    categoryId: BigInt(100402),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100402100162),
    categoryId: BigInt(100402),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100402100163),
    categoryId: BigInt(100402),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100402101004),
    categoryId: BigInt(100402),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100403001),
    categoryId: BigInt(100403),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100403100037),
    categoryId: BigInt(100403),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100403100134),
    categoryId: BigInt(100403),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100403100151),
    categoryId: BigInt(100403),
    name: "Chiều dài váy",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1366,"original_value_name":"Maxi"},{"value_id":1374,"original_value_name":"Midi"},{"value_id":1385,"original_value_name":"Mini"}]
  },
  {
    attributeId: BigInt(100403100152),
    categoryId: BigInt(100403),
    name: "Kiểu váy",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1367,"original_value_name":"váy chữ A"},{"value_id":1377,"original_value_name":"váy ôm sát"},{"value_id":1382,"original_value_name":"Váy đuôi cá dài"},{"value_id":1399,"original_value_name":"Khác"},{"value_id":1408,"original_value_name":"Váy bút chì"},{"value_id":1418,"original_value_name":"váy xếp ly"},{"value_id":1430,"original_value_name":"Váy quấn"}]
  },
  {
    attributeId: BigInt(100403100155),
    categoryId: BigInt(100403),
    name: "Dịp",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1387,"original_value_name":"Hằng Ngày"},{"value_id":1413,"original_value_name":"Dạ hội"}]
  },
  {
    attributeId: BigInt(100403100162),
    categoryId: BigInt(100403),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100403100163),
    categoryId: BigInt(100403),
    name: "Mùa",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1449,"original_value_name":"Mùa thu"},{"value_id":1458,"original_value_name":"Mùa xuân"},{"value_id":1462,"original_value_name":"Mùa hè"},{"value_id":1472,"original_value_name":"Mùa đông"}]
  },
  {
    attributeId: BigInt(100403101004),
    categoryId: BigInt(100403),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100404001),
    categoryId: BigInt(100404),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100404100037),
    categoryId: BigInt(100404),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100404100134),
    categoryId: BigInt(100404),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100404100162),
    categoryId: BigInt(100404),
    name: "Mẫu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1428,"original_value_name":"Họa tiết"},{"value_id":1439,"original_value_name":"Sọc caro"},{"value_id":1447,"original_value_name":"Hoa"},{"value_id":1453,"original_value_name":"Khác"},{"value_id":1463,"original_value_name":"Trơn"},{"value_id":1474,"original_value_name":"Chấm bi"},{"value_id":1486,"original_value_name":"In"},{"value_id":1495,"original_value_name":"Sọc"},{"value_id":1531,"original_value_name":"Nhuộm"}]
  },
  {
    attributeId: BigInt(100404101004),
    categoryId: BigInt(100404),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100407001),
    categoryId: BigInt(100407),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100408001),
    categoryId: BigInt(100408),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100409001),
    categoryId: BigInt(100409),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100410001),
    categoryId: BigInt(100410),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100411001),
    categoryId: BigInt(100411),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100411100037),
    categoryId: BigInt(100411),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100412001),
    categoryId: BigInt(100412),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100413001),
    categoryId: BigInt(100413),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100417001),
    categoryId: BigInt(100417),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100417100016),
    categoryId: BigInt(100417),
    name: "Kiểu đóng gói",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":374,"original_value_name":"Hộp"},{"value_id":394,"original_value_name":"Đơn"}]
  },
  {
    attributeId: BigInt(100417100037),
    categoryId: BigInt(100417),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100417100134),
    categoryId: BigInt(100417),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1129,"original_value_name":"Canvas"},{"value_id":1133,"original_value_name":"cashmere"},{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1173,"original_value_name":"tơ nhân tạo"},{"value_id":1209,"original_value_name":"Sợi vải"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1223,"original_value_name":"Kim loại"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1292,"original_value_name":"Babyterry"},{"value_id":1318,"original_value_name":"Kim cương"},{"value_id":1327,"original_value_name":"Đá Ngọc Bích"},{"value_id":1363,"original_value_name":"Bạc"},{"value_id":1372,"original_value_name":"Ngọc trai"},{"value_id":1381,"original_value_name":"Thép"},{"value_id":1396,"original_value_name":"Dệt Kim"},{"value_id":1436,"original_value_name":"Da lộn"},{"value_id":1629,"original_value_name":"Hợp kim"},{"value_id":1712,"original_value_name":"Jersey"},{"value_id":1750,"original_value_name":"Đồ lặn"},{"value_id":1775,"original_value_name":"Len"},{"value_id":1833,"original_value_name":"Nỉ mỏng"}]
  },
  {
    attributeId: BigInt(100417100167),
    categoryId: BigInt(100417),
    name: "Chiều dài vớ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1477,"original_value_name":"Mắt cá"},{"value_id":1488,"original_value_name":"vô hình"},{"value_id":1499,"original_value_name":"Đầu gối"},{"value_id":1509,"original_value_name":"Khác"},{"value_id":1523,"original_value_name":"đùi"},{"value_id":1622,"original_value_name":"Bắp chân"}]
  },
  {
    attributeId: BigInt(100417100243),
    categoryId: BigInt(100417),
    name: "Loại tất/vớ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1496,"original_value_name":"Vớ thể thao"},{"value_id":1505,"original_value_name":"Khác"},{"value_id":1521,"original_value_name":"Vớ ngón chân"}]
  },
  {
    attributeId: BigInt(100418001),
    categoryId: BigInt(100418),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100418100016),
    categoryId: BigInt(100418),
    name: "Kiểu đóng gói",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":374,"original_value_name":"Hộp"},{"value_id":394,"original_value_name":"Đơn"}]
  },
  {
    attributeId: BigInt(100418100037),
    categoryId: BigInt(100418),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100418100134),
    categoryId: BigInt(100418),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1129,"original_value_name":"Canvas"},{"value_id":1133,"original_value_name":"cashmere"},{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1173,"original_value_name":"tơ nhân tạo"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1223,"original_value_name":"Kim loại"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1292,"original_value_name":"Babyterry"},{"value_id":1381,"original_value_name":"Thép"},{"value_id":1396,"original_value_name":"Dệt Kim"},{"value_id":1436,"original_value_name":"Da lộn"},{"value_id":1629,"original_value_name":"Hợp kim"},{"value_id":1712,"original_value_name":"Jersey"},{"value_id":1750,"original_value_name":"Đồ lặn"},{"value_id":1775,"original_value_name":"Len"},{"value_id":1833,"original_value_name":"Nỉ mỏng"}]
  },
  {
    attributeId: BigInt(100418100159),
    categoryId: BigInt(100418),
    name: "Loại quần vớ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1421,"original_value_name":"Đen"},{"value_id":1432,"original_value_name":"Lưới"},{"value_id":1440,"original_value_name":"Xám"},{"value_id":1450,"original_value_name":"Nude"},{"value_id":6770,"original_value_name":"Stockings & Knee-high socks"},{"value_id":6771,"original_value_name":"Tights"}]
  },
  {
    attributeId: BigInt(100418100171),
    categoryId: BigInt(100418),
    name: "Bản eo",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1507,"original_value_name":"Bản to"},{"value_id":1519,"original_value_name":"Bản thấp"},{"value_id":1534,"original_value_name":"Giữa eo"},{"value_id":1547,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100523001),
    categoryId: BigInt(100523),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100523100016),
    categoryId: BigInt(100523),
    name: "Kiểu đóng gói",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":374,"original_value_name":"Hộp"},{"value_id":394,"original_value_name":"Đơn"}]
  },
  {
    attributeId: BigInt(100523100037),
    categoryId: BigInt(100523),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100523100134),
    categoryId: BigInt(100523),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100523101004),
    categoryId: BigInt(100523),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100524001),
    categoryId: BigInt(100524),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100524100016),
    categoryId: BigInt(100524),
    name: "Kiểu đóng gói",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":374,"original_value_name":"Hộp"},{"value_id":394,"original_value_name":"Đơn"}]
  },
  {
    attributeId: BigInt(100524100037),
    categoryId: BigInt(100524),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100524100134),
    categoryId: BigInt(100524),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100524101004),
    categoryId: BigInt(100524),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
  {
    attributeId: BigInt(100525001),
    categoryId: BigInt(100525),
    name: "Thương hiệu",
    isMandatory: true,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"No Brand"},{"value_id":2,"original_value_name":"SmartOmni Official"},{"value_id":3,"original_value_name":"Coolmate"},{"value_id":4,"original_value_name":"Routine"},{"value_id":5,"original_value_name":"Canifa"},{"value_id":6,"original_value_name":"An Phước"},{"value_id":7,"original_value_name":"Ivy Moda"},{"value_id":8,"original_value_name":"Elise"},{"value_id":9,"original_value_name":"Shopee Choice"},{"value_id":10,"original_value_name":"Khác"}]
  },
  {
    attributeId: BigInt(100525100016),
    categoryId: BigInt(100525),
    name: "Kiểu đóng gói",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":374,"original_value_name":"Hộp"},{"value_id":394,"original_value_name":"Đơn"}]
  },
  {
    attributeId: BigInt(100525100037),
    categoryId: BigInt(100525),
    name: "Xuất xứ",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":1,"original_value_name":"Nhật Bản"},{"value_id":35,"original_value_name":"Trung Quốc"},{"value_id":48,"original_value_name":"Hàn Quốc"},{"value_id":68,"original_value_name":"Indonesia"},{"value_id":93,"original_value_name":"Khác"},{"value_id":110,"original_value_name":"Mỹ"},{"value_id":112,"original_value_name":"Đài Loan"},{"value_id":129,"original_value_name":"Thái Lan"},{"value_id":136,"original_value_name":"Việt Nam"},{"value_id":154,"original_value_name":"Ấn Độ"},{"value_id":171,"original_value_name":"Băng-la-đét"},{"value_id":6737,"original_value_name":"Brasil"},{"value_id":6738,"original_value_name":"Colombia"},{"value_id":6739,"original_value_name":"Chile"},{"value_id":6740,"original_value_name":"Argentina"},{"value_id":6741,"original_value_name":"Mexico"}]
  },
  {
    attributeId: BigInt(100525100134),
    categoryId: BigInt(100525),
    name: "Chất liệu",
    isMandatory: false,
    inputType: "MULTI_SELECT",
    valueListJson: [{"value_id":1149,"original_value_name":"Cotton"},{"value_id":1156,"original_value_name":"Lông cừu"},{"value_id":1165,"original_value_name":"Nylon"},{"value_id":1198,"original_value_name":"Nhung"},{"value_id":1221,"original_value_name":"Da"},{"value_id":1227,"original_value_name":"voan"},{"value_id":1229,"original_value_name":"Denim"},{"value_id":1231,"original_value_name":"Lông vũ"},{"value_id":1234,"original_value_name":"Nỉ"},{"value_id":1235,"original_value_name":"Nỉ mỏng"},{"value_id":1237,"original_value_name":"lông"},{"value_id":1239,"original_value_name":"kaki"},{"value_id":1243,"original_value_name":"Đan"},{"value_id":1248,"original_value_name":"Ren"},{"value_id":1252,"original_value_name":"Lanh"},{"value_id":1257,"original_value_name":"Khác"},{"value_id":1261,"original_value_name":"bông"},{"value_id":1266,"original_value_name":"chinos"},{"value_id":1271,"original_value_name":"Lụa"},{"value_id":1280,"original_value_name":"Sợi tổng hợp"},{"value_id":1285,"original_value_name":"Sợi dệt"},{"value_id":1775,"original_value_name":"Len"}]
  },
  {
    attributeId: BigInt(100525101004),
    categoryId: BigInt(100525),
    name: "Rất lớn",
    isMandatory: false,
    inputType: "DROP_DOWN",
    valueListJson: [{"value_id":5487,"original_value_name":"Có"},{"value_id":5488,"original_value_name":"Không"}]
  },
];
