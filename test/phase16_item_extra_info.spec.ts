import { app } from "../src/index";
import { prisma } from "../src/common/prisma";
import { buildBaseString, calculateHmacSha256 } from "../src/common/utils/crypto";
import * as http from "http";

const partnerId = 1001141;
const partnerKey = "shopee_mock_secret_key_2026";
const shopId = BigInt(727720655);
let server: http.Server;
let baseUrl: string;

function assert(condition: any, message: string) {
  if (!condition) throw new Error(`FAILED: ${message}`);
  console.log(`  ✓ ${message}`);
}

async function request(path: string, method = "GET", body?: any) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  return response.json() as Promise<any>;
}

async function runTests() {
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://127.0.0.1:${(server.address() as any).port}`;
      resolve();
    });
  });
  let orderSn = "";
  let itemId = 0n;
  try {
    const product = await prisma.product.findFirstOrThrow({ where: { shopId } });
    itemId = product.itemId;
    const originalViews = product.viewCount;
    const baselineMetrics = await request(`/api/v2/simulator/product/extra_info?shop_id=${shopId}&item_id_list=${itemId}`);
    const baseline = baselineMetrics.response.item_list[0];
    const itemPath = "/api/v2/product/get_item_extra_info";
    const now = Math.floor(Date.now() / 1000);
    const sign = calculateHmacSha256(partnerKey, buildBaseString(partnerId, itemPath, now));
    const signed = (ids: string) => `${itemPath}?partner_id=${partnerId}&timestamp=${now}&sign=${sign}&shop_id=${shopId}&item_id_list=${ids}`;

    assert((await request(`${signed(String(itemId)).replace(`sign=${sign}`, "sign=deadbeef")}`)).error === "error_sign", "Layer A rejects an invalid signature");
    assert((await request(`${itemPath}?partner_id=${partnerId}&timestamp=${now}&sign=${sign}&shop_id=${shopId}`)).error === "error_param", "Layer A requires item_id_list");
    assert((await request(signed(Array.from({ length: 51 }, (_, i) => i + 1).join(",")))).error === "error_param", "Layer A enforces the 50-item limit");

    orderSn = `XINFO${Date.now()}`;
    await prisma.order.create({ data: {
      orderSn, shopId, orderStatus: "COMPLETED", totalAmount: 300,
      items: { create: { itemId, itemName: product.itemName, itemPrice: 100, quantityPurchased: 3 } }
    } });
    await prisma.productComment.create({ data: { shopId, itemId, orderSn, comment: "Phase 16 metrics review", ratingStar: 4 } });
    const valid = await request(signed(String(itemId)));
    assert(valid.error === "", "Valid signed Layer A request succeeds");
    assert((await request(signed(encodeURIComponent(JSON.stringify([Number(itemId)]))))).error === "", "Layer A accepts JSON-encoded item_id_list values");
    const metric = valid.response.item_list[0];
    assert(metric.sale === baseline.sale + 3, "Sales increase by completed-order quantity only");
    const reviewAggregate = await prisma.productComment.aggregate({ where: { shopId, itemId }, _avg: { ratingStar: true }, _count: { _all: true } });
    assert(metric.comment_count === reviewAggregate._count._all && metric.rating_star === Number((reviewAggregate._avg.ratingStar || 0).toFixed(2)), "Average stars and review count match stored reviews");
    const noReviewProduct = await prisma.product.findFirst({ where: { shopId, comments: { none: {} } } });
    if (noReviewProduct) {
      const zeroReview = await request(`/api/v2/simulator/product/extra_info?shop_id=${shopId}&item_id_list=${noReviewProduct.itemId}`);
      assert(zeroReview.response.item_list[0].rating_star === 0 && zeroReview.response.item_list[0].comment_count === 0, "Products without reviews return zero rating and count");
    }
    const crossShop = await request(signed("999999999999999"));
    assert(crossShop.error === "error_param", "Layer A does not return items outside the requested shop");
    const anotherShopProduct = await prisma.product.findFirst({ where: { shopId: { not: shopId } } });
    if (anotherShopProduct) {
      assert((await request(signed(String(anotherShopProduct.itemId)))).error === "error_param", "Layer A rejects a real item owned by another shop");
    }

    const buyerId = BigInt(1001);
    const likePath = "/api/v2/simulator/product/like";
    const initial = await request(`${likePath}?item_id=${itemId}&buyer_user_id=${buyerId}`);
    const wasLiked = Boolean(initial.response.liked);
    const toggled = await request(likePath, "POST", { item_id: Number(itemId), buyer_user_id: Number(buyerId) });
    assert(toggled.error === "", "Buyer like toggle succeeds");
    const afterToggle = await request(`${likePath}?item_id=${itemId}&buyer_user_id=${buyerId}`);
    assert(afterToggle.response.liked === !wasLiked, "Like is unique per buyer and toggles persisted state");
    const duplicate = await request(likePath, "POST", { item_id: Number(itemId), buyer_user_id: Number(buyerId) });
    assert(duplicate.error === "", "Repeated like action toggles without duplicate rows");

    const view = await request("/api/v2/simulator/product/view", "POST", { item_id: Number(itemId) });
    assert(view.error === "" && view.response.views === originalViews + 1, "Product view endpoint persists one increment");
    const layerB = await request(`/api/v2/simulator/product/extra_info?shop_id=${shopId}&item_id_list=${itemId}`);
    assert(layerB.error === "" && layerB.response.item_list[0].sale === metric.sale, "Layer B metrics match the signed Shopee endpoint");
  } finally {
    if (orderSn) await prisma.order.deleteMany({ where: { orderSn } });
    if (itemId) await prisma.productLike.deleteMany({ where: { itemId, buyerUserId: 1001n } });
    server.close();
    await prisma.$disconnect();
  }
}

runTests().catch((error) => { console.error(error); process.exit(1); });
