-- CreateTable
CREATE TABLE "shop_penalty_points" (
    "id" BIGSERIAL NOT NULL,
    "shop_id" BIGINT NOT NULL,
    "reference_id" BIGINT NOT NULL,
    "violation_type" INTEGER NOT NULL,
    "original_point_num" INTEGER NOT NULL,
    "latest_point_num" INTEGER NOT NULL,
    "issue_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shop_penalty_points_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shop_punishments" (
    "id" BIGSERIAL NOT NULL,
    "shop_id" BIGINT NOT NULL,
    "reference_id" BIGINT NOT NULL,
    "punishment_type" INTEGER NOT NULL,
    "reason" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "issue_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "listing_limit" INTEGER,
    "order_limit" TEXT,

    CONSTRAINT "shop_punishments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shop_penalty_points_reference_id_key" ON "shop_penalty_points"("reference_id");

-- CreateIndex
CREATE INDEX "shop_penalty_points_shop_id_issue_time_idx" ON "shop_penalty_points"("shop_id", "issue_time");

-- CreateIndex
CREATE UNIQUE INDEX "shop_punishments_reference_id_key" ON "shop_punishments"("reference_id");

-- CreateIndex
CREATE INDEX "shop_punishments_shop_id_status_issue_time_idx" ON "shop_punishments"("shop_id", "status", "issue_time");

-- AddForeignKey
ALTER TABLE "shop_penalty_points" ADD CONSTRAINT "shop_penalty_points_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("shopId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shop_punishments" ADD CONSTRAINT "shop_punishments_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("shopId") ON DELETE CASCADE ON UPDATE CASCADE;
