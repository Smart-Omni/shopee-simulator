import { OrderStatus } from "@prisma/client";
import { prisma } from "../../common/prisma";

export interface ItemExtraInfo {
  item_id: number;
  sale: number;
  views: number;
  likes: number;
  rating_star: number;
  comment_count: number;
}

export async function getItemExtraInfo(shopId: bigint, itemIds: bigint[]): Promise<ItemExtraInfo[]> {
  const products = await prisma.product.findMany({
    where: { shopId, itemId: { in: itemIds } },
    select: { itemId: true, viewCount: true }
  });
  const ownedIds = products.map((product) => product.itemId);
  const [orderItems, comments, likes] = await Promise.all([
    prisma.orderItem.findMany({
      where: { itemId: { in: ownedIds }, order: { shopId, orderStatus: OrderStatus.COMPLETED } },
      select: { itemId: true, quantityPurchased: true }
    }),
    prisma.productComment.findMany({
      where: { shopId, itemId: { in: ownedIds } },
      select: { itemId: true, ratingStar: true }
    }),
    prisma.productLike.groupBy({
      by: ["itemId"], where: { itemId: { in: ownedIds } }, _count: { _all: true }
    })
  ]);

  const sales = new Map<string, number>();
  for (const row of orderItems) {
    const key = row.itemId.toString();
    sales.set(key, (sales.get(key) || 0) + row.quantityPurchased);
  }
  const reviewStats = new Map<string, { count: number; stars: number }>();
  for (const row of comments) {
    const key = row.itemId.toString();
    const current = reviewStats.get(key) || { count: 0, stars: 0 };
    current.count += 1;
    current.stars += row.ratingStar;
    reviewStats.set(key, current);
  }
  const likeCounts = new Map(likes.map((row) => [row.itemId.toString(), row._count._all]));
  return products.map((product) => {
    const key = product.itemId.toString();
    const review = reviewStats.get(key);
    return {
      item_id: Number(product.itemId),
      sale: sales.get(key) || 0,
      views: product.viewCount,
      likes: likeCounts.get(key) || 0,
      rating_star: review ? Number((review.stars / review.count).toFixed(2)) : 0,
      comment_count: review?.count || 0
    };
  });
}

export function parseItemIds(value: unknown): bigint[] | null {
  let parts: unknown[];
  if (Array.isArray(value)) {
    parts = value;
  } else if (typeof value === "string") {
    const input = value.trim();
    if (input.startsWith("[") && input.endsWith("]")) {
      try {
        const parsed = JSON.parse(input);
        parts = Array.isArray(parsed) ? parsed : [];
      } catch {
        parts = input.slice(1, -1).split(",");
      }
    } else {
      parts = input.split(",");
    }
  } else {
    parts = [];
  }
  const normalized = parts.flatMap((part) => String(part).split(","))
    .map((part) => part.trim().replace(/^['"]|['"]$/g, ""))
    .filter(Boolean);
  if (!normalized.length || normalized.some((id) => !/^\d+$/.test(id))) return null;
  return normalized.map((id) => BigInt(id));
}
