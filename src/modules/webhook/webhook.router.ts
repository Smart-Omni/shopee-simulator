import { Router, Request, Response } from "express";
import { prisma } from "../../common/prisma";
import { createShopeeSuccessResponse, createShopeeErrorResponse } from "../../common/utils/envelope";
import { WebhookService } from "./webhook.service";

export const webhookRouter = Router();

// ============================================================================
// 1. CONFIGURE WEBHOOK URL: POST /api/v2/public/set_webhook_url
// ============================================================================
webhookRouter.post("/api/v2/public/set_webhook_url", async (req: Request, res: Response): Promise<void> => {
  const { partner_id = 1001141, webhook_url } = req.body || {};

  if (!webhook_url) {
    res.json(createShopeeErrorResponse("error_param", "webhook_url is required"));
    return;
  }

  const partnerId = BigInt(partner_id);
  const partner = await prisma.partner.findUnique({ where: { partnerId } });

  if (!partner) {
    res.json(createShopeeErrorResponse("error_param", "Invalid partner_id"));
    return;
  }

  await prisma.partner.update({
    where: { partnerId },
    data: { webhookUrl: webhook_url }
  });

  res.json(createShopeeSuccessResponse({
    partner_id: Number(partnerId),
    webhook_url
  }));
});

// ============================================================================
// 2. QUERY WEBHOOK LOGS: GET /api/v2/webhook/logs
// ============================================================================
webhookRouter.get("/api/v2/webhook/logs", async (req: Request, res: Response): Promise<void> => {
  const { push_code, status, ordersn, shop_id } = req.query as Record<string, string | undefined>;

  const whereClause: any = {};
  if (push_code) whereClause.pushCode = parseInt(push_code, 10);
  if (status) whereClause.status = status.toUpperCase();
  if (ordersn) whereClause.ordersn = ordersn;
  if (shop_id) whereClause.shopId = BigInt(shop_id);

  const logs = await prisma.webhookLog.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    take: 50
  });

  res.json(createShopeeSuccessResponse({
    total: logs.length,
    logs: logs.map(l => ({
      id: Number(l.id),
      partner_id: Number(l.partnerId),
      push_code: l.pushCode,
      shop_id: l.shopId ? Number(l.shopId) : null,
      ordersn: l.ordersn,
      target_url: l.targetUrl,
      payload: l.payloadJson,
      auth_header: l.authHeader,
      response_status: l.responseStatus,
      status: l.status,
      attempt_count: l.attemptCount,
      created_at: l.createdAt.toISOString()
    }))
  }));
});

// ============================================================================
// 3. RETRY FAILED WEBHOOKS: POST /api/v2/webhook/retry
// ============================================================================
webhookRouter.post("/api/v2/webhook/retry", async (_req: Request, res: Response): Promise<void> => {
  const successCount = await WebhookService.retryPendingWebhooks();
  res.json(createShopeeSuccessResponse({
    retried_success_count: successCount
  }));
});

// ============================================================================
// 4. SIMULATOR MANUAL TRIGGER: POST /api/v2/simulator/webhook/trigger
// ============================================================================
webhookRouter.post("/api/v2/simulator/webhook/trigger", async (req: Request, res: Response): Promise<void> => {
  const {
    partner_id = 1001141,
    push_code = 3,
    shop_id = 727720655,
    ordersn,
    data = {}
  } = req.body || {};

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    shop_id: Number(shop_id),
    code: Number(push_code),
    timestamp: now,
    data
  };

  const log = await WebhookService.dispatch({
    partnerId: partner_id,
    pushCode: Number(push_code),
    shopId: shop_id,
    ordersn,
    payload
  });

  res.json(createShopeeSuccessResponse({
    dispatched: !!log,
    log_id: log ? Number(log.id) : null,
    status: log?.status || "NO_WEBHOOK_URL",
    payload
  }));
});

// ============================================================================
// 5. SIMULATOR FAULT INJECTION CONFIG: GET /api/v2/simulator/config
// ============================================================================
webhookRouter.get("/api/v2/simulator/config", async (_req: Request, res: Response): Promise<void> => {
  let config = await prisma.simulatorConfig.findFirst({ where: { id: 1 } });
  if (!config) {
    config = await prisma.simulatorConfig.create({
      data: { id: 1 }
    });
  }
  res.json(createShopeeSuccessResponse(config));
});

// ============================================================================
// 6. UPDATE SIMULATOR CONFIG: POST /api/v2/simulator/config
// ============================================================================
webhookRouter.post("/api/v2/simulator/config", async (req: Request, res: Response): Promise<void> => {
  const {
    rateLimitEnabled,
    rateLimitPerMin,
    forceExpiredToken,
    forceInvalidSign,
    artificialDelayMs,
    strictTimestamp
  } = req.body || {};

  const updated = await prisma.simulatorConfig.upsert({
    where: { id: 1 },
    update: {
      ...(rateLimitEnabled !== undefined && { rateLimitEnabled: Boolean(rateLimitEnabled) }),
      ...(rateLimitPerMin !== undefined && { rateLimitPerMin: Number(rateLimitPerMin) }),
      ...(forceExpiredToken !== undefined && { forceExpiredToken: Boolean(forceExpiredToken) }),
      ...(forceInvalidSign !== undefined && { forceInvalidSign: Boolean(forceInvalidSign) }),
      ...(artificialDelayMs !== undefined && { artificialDelayMs: Number(artificialDelayMs) }),
      ...(strictTimestamp !== undefined && { strictTimestamp: Boolean(strictTimestamp) })
    },
    create: {
      id: 1,
      rateLimitEnabled: Boolean(rateLimitEnabled),
      rateLimitPerMin: rateLimitPerMin !== undefined ? Number(rateLimitPerMin) : 100,
      forceExpiredToken: Boolean(forceExpiredToken),
      forceInvalidSign: Boolean(forceInvalidSign),
      artificialDelayMs: artificialDelayMs !== undefined ? Number(artificialDelayMs) : 0,
      strictTimestamp: strictTimestamp !== undefined ? Boolean(strictTimestamp) : true
    }
  });

  res.json(createShopeeSuccessResponse(updated));
});

// ============================================================================
// 7. BUILT-IN LOCAL MOCK WEBHOOK SINK: POST /api/v2/simulator/webhook/sink
// ============================================================================
webhookRouter.post("/api/v2/simulator/webhook/sink", (req: Request, res: Response): void => {
  console.log(`[BuiltInWebhookSink] Received webhook Code ${req.body?.code} at ${new Date().toISOString()}`);
  res.status(200).json({
    status: "received",
    timestamp: Math.floor(Date.now() / 1000),
    service: "shopee-mock-webhook-sink"
  });
});

// ============================================================================
// 8. CLEAR WEBHOOK LOGS: DELETE /api/v2/webhook/logs/clear
// ============================================================================
webhookRouter.delete("/api/v2/webhook/logs/clear", async (_req: Request, res: Response): Promise<void> => {
  const result = await prisma.webhookLog.deleteMany({});
  res.json(createShopeeSuccessResponse({
    deleted_count: result.count
  }));
});
