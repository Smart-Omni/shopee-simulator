ALTER TABLE "orders" ADD COLUMN "completedAt" TIMESTAMP(3);

UPDATE "orders"
SET "completedAt" = COALESCE("escrowReleaseTime", "updatedAt")
WHERE "orderStatus" = 'COMPLETED' AND "completedAt" IS NULL;

CREATE INDEX "orders_shopId_orderStatus_completedAt_idx"
ON "orders"("shopId", "orderStatus", "completedAt");
