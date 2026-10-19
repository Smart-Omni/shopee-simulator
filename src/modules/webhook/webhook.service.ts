import { prisma } from "../../common/prisma";
import { calculateHmacSha256 } from "../../common/utils/crypto";

export interface PushPayload {
  shop_id?: number;
  partner_id?: number;
  code: number;
  timestamp: number;
  data: Record<string, any>;
}

export interface DispatchOptions {
  partnerId: bigint | number;
  pushCode: number;
  shopId?: bigint | number;
  ordersn?: string;
  payload: PushPayload;
}

// Standard Shopee Push Retry Intervals: 300s (5m), 1800s (30m), 10800s (3h)
const RETRY_DELAYS_SEC = [300, 1800, 10800];

function calculateNextRetry(attemptCount: number): Date | null {
  if (attemptCount >= RETRY_DELAYS_SEC.length) {
    return null; // Max retries exceeded
  }
  return new Date(Date.now() + RETRY_DELAYS_SEC[attemptCount - 1] * 1000);
}

export class WebhookService {
  /**
   * Dispatches a webhook notification to the partner's registered callback URL.
   * Logs attempt, response, and HMAC authorization signature in the WebhookLog table.
   */
  static async dispatch(options: DispatchOptions): Promise<any> {
    const partnerId = BigInt(options.partnerId);
    const partner = await prisma.partner.findUnique({
      where: { partnerId }
    });

    if (!partner || !partner.webhookUrl) {
      console.log(`[WebhookService] No webhook URL configured for Partner ${partnerId}, skipping dispatch.`);
      return null;
    }

    const targetUrl = partner.webhookUrl;
    const rawBody = JSON.stringify(options.payload);
    const signatureBase = `${targetUrl}|${rawBody}`;
    const authHeader = calculateHmacSha256(partner.partnerKey, signatureBase);

    // Initial log creation in database
    const log = await prisma.webhookLog.create({
      data: {
        partnerId,
        pushCode: options.pushCode,
        shopId: options.shopId ? BigInt(options.shopId) : null,
        ordersn: options.ordersn || null,
        targetUrl,
        payloadJson: options.payload as any,
        authHeader,
        attemptCount: 1,
        status: "PENDING"
      }
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

      const res = await fetch(targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader,
          "User-Agent": "Shopee-Push-Dispatcher/2.0"
        },
        body: rawBody,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const resText = await res.text();
      const isSuccess = res.status >= 200 && res.status < 300;

      const updated = await prisma.webhookLog.update({
        where: { id: log.id },
        data: {
          responseStatus: res.status,
          responseBody: resText.slice(0, 2000),
          status: isSuccess ? "SUCCESS" : "FAILED",
          nextRetryAt: isSuccess ? null : calculateNextRetry(1)
        }
      });

      return updated;
    } catch (err: any) {
      console.warn(`[WebhookService] Delivery failed to ${targetUrl}:`, err.message);

      const updated = await prisma.webhookLog.update({
        where: { id: log.id },
        data: {
          responseStatus: 500,
          responseBody: err.message,
          status: "FAILED",
          nextRetryAt: calculateNextRetry(1)
        }
      });

      return updated;
    }
  }

  /**
   * Retries all pending or failed webhook deliveries that have not exceeded max attempts.
   */
  static async retryPendingWebhooks(): Promise<number> {
    const pendingLogs = await prisma.webhookLog.findMany({
      where: {
        status: "FAILED",
        attemptCount: { lt: 3 }
      },
      include: { partner: true }
    });

    let successCount = 0;

    for (const log of pendingLogs) {
      const targetUrl = log.targetUrl;
      const rawBody = JSON.stringify(log.payloadJson);
      const signatureBase = `${targetUrl}|${rawBody}`;
      const authHeader = calculateHmacSha256(log.partner.partnerKey, signatureBase);
      const nextAttempt = log.attemptCount + 1;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(targetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": authHeader,
            "User-Agent": "Shopee-Push-Dispatcher/2.0"
          },
          body: rawBody,
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        const resText = await res.text();
        const isSuccess = res.status >= 200 && res.status < 300;

        await prisma.webhookLog.update({
          where: { id: log.id },
          data: {
            attemptCount: nextAttempt,
            responseStatus: res.status,
            responseBody: resText.slice(0, 2000),
            status: isSuccess ? "SUCCESS" : "FAILED",
            nextRetryAt: isSuccess ? null : calculateNextRetry(nextAttempt)
          }
        });

        if (isSuccess) successCount++;
      } catch (err: any) {
        await prisma.webhookLog.update({
          where: { id: log.id },
          data: {
            attemptCount: nextAttempt,
            responseStatus: 500,
            responseBody: err.message,
            status: "FAILED",
            nextRetryAt: calculateNextRetry(nextAttempt)
          }
        });
      }
    }

    return successCount;
  }
}
