import { Router, Request, Response } from "express";
import { shopeeAuthGuard } from "../../common/middleware/auth-guard";
import { createShopeeErrorResponse, createShopeeSuccessResponse } from "../../common/utils/envelope";
import { prisma } from "../../common/prisma";
import {
  getLateOrders,
  getListingsWithIssues,
  getMetricSourceDetail,
  getPenaltyPointHistory,
  getPunishmentHistory,
  getShopPerformance
} from "./accountHealth.service";

export const accountHealthRouter = Router();

function parsePage(req: Request) {
  const pageNo = Math.max(1, parseInt(String(req.query.page_no || "1"), 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(String(req.query.page_size || "10"), 10) || 10));
  return { pageNo, pageSize };
}

// 1. GET /api/v2/account_health/get_shop_performance
accountHealthRouter.get("/api/v2/account_health/get_shop_performance", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopId = BigInt(req.query.shop_id as string);
  const data = await getShopPerformance(shopId);
  res.json(createShopeeSuccessResponse(data));
});

// 2. GET /api/v2/account_health/get_penalty_point_history
accountHealthRouter.get("/api/v2/account_health/get_penalty_point_history", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopId = BigInt(req.query.shop_id as string);
  const { pageNo, pageSize } = parsePage(req);
  const violationType = req.query.violation_type ? parseInt(String(req.query.violation_type), 10) : undefined;
  const data = await getPenaltyPointHistory(shopId, pageNo, pageSize, violationType);
  res.json(createShopeeSuccessResponse(data));
});

// 3. GET /api/v2/account_health/get_punishment_history
accountHealthRouter.get("/api/v2/account_health/get_punishment_history", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopId = BigInt(req.query.shop_id as string);
  const statusRaw = req.query.punishment_status;
  if (!statusRaw) {
    res.json(createShopeeErrorResponse("error_param", "punishment_status is required"));
    return;
  }
  const punishmentStatus = parseInt(String(statusRaw), 10);
  if (punishmentStatus !== 1 && punishmentStatus !== 2) {
    res.json(createShopeeErrorResponse("error_param", "punishment_status must be 1 (Ongoing) or 2 (Ended)"));
    return;
  }
  const { pageNo, pageSize } = parsePage(req);
  const data = await getPunishmentHistory(shopId, punishmentStatus, pageNo, pageSize);
  res.json(createShopeeSuccessResponse(data));
});

// 4. GET /api/v2/account_health/get_late_orders
accountHealthRouter.get("/api/v2/account_health/get_late_orders", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopId = BigInt(req.query.shop_id as string);
  const { pageNo, pageSize } = parsePage(req);
  const data = await getLateOrders(shopId, pageNo, pageSize);
  res.json(createShopeeSuccessResponse(data));
});

// 5. GET /api/v2/account_health/get_listings_with_issues
accountHealthRouter.get("/api/v2/account_health/get_listings_with_issues", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopId = BigInt(req.query.shop_id as string);
  const { pageNo, pageSize } = parsePage(req);
  const data = await getListingsWithIssues(shopId, pageNo, pageSize);
  res.json(createShopeeSuccessResponse(data));
});

// 6. GET /api/v2/account_health/get_metric_source_detail
accountHealthRouter.get("/api/v2/account_health/get_metric_source_detail", shopeeAuthGuard, async (req: Request, res: Response): Promise<void> => {
  const shopId = BigInt(req.query.shop_id as string);
  if (!req.query.metric_id) {
    res.json(createShopeeErrorResponse("error_param", "metric_id is required"));
    return;
  }
  const metricId = parseInt(String(req.query.metric_id), 10);
  if (Number.isNaN(metricId)) {
    res.json(createShopeeErrorResponse("error_param", "metric_id must be an integer"));
    return;
  }
  const { pageNo, pageSize } = parsePage(req);
  const data = await getMetricSourceDetail(shopId, metricId, pageNo, pageSize);
  res.json(createShopeeSuccessResponse(data));
});

// Simulator Helper: Seed or reset penalty points / punishments for a shop
accountHealthRouter.post("/api/v2/simulator/account_health/seed", async (req: Request, res: Response): Promise<void> => {
  const { shop_id, penalty_points, punishments, clear_existing } = req.body || {};
  if (!shop_id) {
    res.status(400).json(createShopeeErrorResponse("error_param", "shop_id is required"));
    return;
  }
  const shopId = BigInt(shop_id);

  if (clear_existing) {
    await prisma.shopPenaltyPoint.deleteMany({ where: { shopId } });
    await prisma.shopPunishment.deleteMany({ where: { shopId } });
  }

  const createdPoints = [];
  for (const p of Array.isArray(penalty_points) ? penalty_points : []) {
    const row = await prisma.shopPenaltyPoint.create({
      data: {
        shopId,
        referenceId: BigInt(p.reference_id || Date.now() + Math.floor(Math.random() * 10000)),
        violationType: Number(p.violation_type ?? 5),
        originalPointNum: Number(p.original_point_num ?? 1),
        latestPointNum: Number(p.latest_point_num ?? p.original_point_num ?? 1),
        issueTime: p.issue_time ? new Date(Number(p.issue_time) * 1000) : new Date()
      }
    });
    createdPoints.push(Number(row.referenceId));
  }

  const createdPunishments = [];
  for (const pun of Array.isArray(punishments) ? punishments : []) {
    const start = pun.start_time ? new Date(Number(pun.start_time) * 1000) : new Date();
    const end = pun.end_time ? new Date(Number(pun.end_time) * 1000) : new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    const row = await prisma.shopPunishment.create({
      data: {
        shopId,
        referenceId: BigInt(pun.reference_id || Date.now() + Math.floor(Math.random() * 10000)),
        punishmentType: Number(pun.punishment_type ?? 107),
        reason: Number(pun.reason ?? 1),
        status: Number(pun.status ?? 1),
        issueTime: pun.issue_time ? new Date(Number(pun.issue_time) * 1000) : start,
        startTime: start,
        endTime: end,
        listingLimit: pun.listing_limit ?? null,
        orderLimit: pun.order_limit ?? null
      }
    });
    createdPunishments.push(Number(row.referenceId));
  }

  res.json(createShopeeSuccessResponse({ created_points: createdPoints, created_punishments: createdPunishments }));
});
