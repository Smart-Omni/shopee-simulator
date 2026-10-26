import { app } from "../src/index";
import { prisma } from "../src/common/prisma";
import * as http from "http";

let server: http.Server;
let baseUrl = "";

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

async function run() {
  const shop = await prisma.shop.findFirst({ include: { orders: { where: { orderStatus: "COMPLETED" }, include: { items: true }, take: 1 } } });
  if (!shop || !shop.orders[0]?.items[0]) throw new Error("Review management test needs a seeded completed order with an item");
  const order = shop.orders[0];
  const item = order.items[0];
  const otherShop = await prisma.shop.findFirst({ where: { shopId: { not: shop.shopId } } });
  const oldCompletedAt = order.completedAt;
  const now = new Date();
  const unique = `review_management_${Date.now()}`;
  let commentId: bigint | null = null;

  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const address = server.address() as any;
      baseUrl = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });

  try {
    await prisma.order.update({ where: { orderSn: order.orderSn }, data: { completedAt: now } });
    const inserted = await prisma.productComment.create({ data: {
      shopId: shop.shopId, itemId: item.itemId, orderSn: order.orderSn,
      modelId: item.modelId, buyerUserId: BigInt(1001), buyerUsername: unique,
      ratingStar: 1, comment: `Needs reply ${unique}`, createdAt: now
    } });
    commentId = inserted.commentId;

    const missingShop = await request("/api/v2/simulator/reviews");
    assert(missingShop.error === "error_param", "List endpoint requires shop scope");
    const invalidFilter = await request(`/api/v2/simulator/reviews?shop_id=${shop.shopId}&rating_star_list=6`);
    assert(invalidFilter.error === "error_param", "Invalid rating filter is rejected");

    const query = new URLSearchParams({ shop_id: String(shop.shopId), keyword: unique, page_size: "1", status: "NEED_REPLY" });
    const list = await request(`/api/v2/simulator/reviews?${query}`);
    assert(list.error === "", "Shop-scoped review search succeeds");
    assert(list.response.reviews.length === 1 && list.response.reviews[0].comment_id === Number(commentId), "Search returns only the matching review");
    assert(list.response.reviews[0].item_image !== undefined && list.response.reviews[0].model_name !== undefined, "Review includes available product image and variation details");
    assert(list.response.pagination.total_count === 1 && list.response.pagination.more === false, "Pagination returns total and continuation metadata");
    assert(list.response.counts.need_reply === 1 && list.response.counts.stars["1"] === 1, "Status and star counts match filtered reviews");

    const since = await request(`/api/v2/simulator/reviews/summary?shop_id=${shop.shopId}&last_visit_at=${Math.floor((now.getTime() - 1000) / 1000)}`);
    assert(since.error === "" && since.response.recent_reviews_since_last_visit >= 1, "Summary counts reviews since last visit");
    assert(since.response.metrics.review_count.value >= 1 && since.response.metrics.positive_review_rate.value !== null, "Summary calculates current-period rating metrics");
    assert(since.response.metrics.review_rate.value !== null && since.response.period.current_from < since.response.period.current_to, "Summary calculates completed-order review rate and period bounds");
    assert(since.response.negative_reviews_needing_reply >= 1, "Summary counts unanswered 1- and 2-star reviews");

    if (otherShop) {
      const crossShopReply = await request("/api/v2/simulator/review/reply", { method: "POST", body: { shop_id: Number(otherShop.shopId), comment_id: Number(commentId), reply: "Cross-shop attempt" } });
      assert(crossShopReply.error === "error_param", "Reply cannot access another shop's review");
    }
    const reply = await request("/api/v2/simulator/review/reply", { method: "POST", body: { shop_id: Number(shop.shopId), comment_id: Number(commentId), reply: "Thank you for your feedback." } });
    assert(reply.error === "" && reply.response.reply === "Thank you for your feedback.", "Shop owner can reply to its review");
    const duplicate = await request("/api/v2/simulator/review/reply", { method: "POST", body: { shop_id: Number(shop.shopId), comment_id: Number(commentId), reply: "Second reply" } });
    assert(duplicate.error === "product.duplicate_request", "Duplicate review reply is rejected");

    console.log("\n✅ PHASE 17 REVIEW MANAGEMENT TESTS PASSED");
  } finally {
    if (commentId) await prisma.productComment.delete({ where: { commentId } });
    await prisma.order.update({ where: { orderSn: order.orderSn }, data: { completedAt: oldCompletedAt } });
    server.close();
    await prisma.$disconnect();
  }
}

run().catch((error) => { console.error(error); process.exitCode = 1; });
