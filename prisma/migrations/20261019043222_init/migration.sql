-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('UNPAID', 'READY_TO_SHIP', 'PROCESSED', 'SHIPPED', 'TO_CONFIRM_RECEIVE', 'COMPLETED', 'IN_CANCEL', 'CANCELLED', 'TO_RETURN');

-- CreateTable
CREATE TABLE "partners" (
    "partnerId" BIGINT NOT NULL,
    "partnerKey" TEXT NOT NULL,
    "appName" TEXT NOT NULL,
    "testRedirectUrl" TEXT NOT NULL,
    "liveRedirectUrl" TEXT NOT NULL,
    "webhookUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("partnerId")
);

-- CreateTable
CREATE TABLE "shops" (
    "shopId" BIGINT NOT NULL,
    "partnerId" BIGINT NOT NULL,
    "shopName" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'VN',
    "status" TEXT NOT NULL DEFAULT 'NORMAL',
    "isVacation" BOOLEAN NOT NULL DEFAULT false,
    "authCode" TEXT,
    "authCodeExpiresAt" TIMESTAMP(3),
    "accessToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "oldAccessToken" TEXT,
    "oldTokenExpiresAt" TIMESTAMP(3),
    "refreshToken" TEXT,
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "authExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shops_pkey" PRIMARY KEY ("shopId")
);

-- CreateTable
CREATE TABLE "shop_addresses" (
    "addressId" BIGSERIAL NOT NULL,
    "shopId" BIGINT NOT NULL,
    "addressType" TEXT NOT NULL DEFAULT 'PICKUP',
    "name" TEXT NOT NULL DEFAULT 'SmartOmni Fulfillment Hub',
    "phone" TEXT NOT NULL DEFAULT '+84901234567',
    "address" TEXT NOT NULL DEFAULT '123 Le Duan Street',
    "district" TEXT NOT NULL DEFAULT 'District 1',
    "city" TEXT NOT NULL DEFAULT 'Ho Chi Minh City',
    "state" TEXT NOT NULL DEFAULT 'Ho Chi Minh',
    "region" TEXT NOT NULL DEFAULT 'VN',
    "zipcode" TEXT NOT NULL DEFAULT '700000',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shop_addresses_pkey" PRIMARY KEY ("addressId")
);

-- CreateTable
CREATE TABLE "logistics_channels" (
    "channelId" BIGINT NOT NULL,
    "channelName" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'VN',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "codEnabled" BOOLEAN NOT NULL DEFAULT true,
    "feeType" TEXT NOT NULL DEFAULT 'SIZE_TIER',
    "weightLimitMin" DECIMAL(10,2) DEFAULT 0.01,
    "weightLimitMax" DECIMAL(10,2) DEFAULT 30.0,

    CONSTRAINT "logistics_channels_pkey" PRIMARY KEY ("channelId")
);

-- CreateTable
CREATE TABLE "categories" (
    "categoryId" BIGINT NOT NULL,
    "parentId" BIGINT NOT NULL DEFAULT 0,
    "categoryName" TEXT NOT NULL,
    "hasChildren" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "category_attributes" (
    "attributeId" BIGINT NOT NULL,
    "categoryId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "inputType" TEXT NOT NULL DEFAULT 'DROP_DOWN',
    "valueListJson" JSONB NOT NULL,

    CONSTRAINT "category_attributes_pkey" PRIMARY KEY ("attributeId")
);

-- CreateTable
CREATE TABLE "products" (
    "itemId" BIGSERIAL NOT NULL,
    "shopId" BIGINT NOT NULL,
    "categoryId" BIGINT NOT NULL,
    "itemName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "itemSku" TEXT,
    "itemStatus" TEXT NOT NULL DEFAULT 'NORMAL',
    "originalPrice" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "weight" DECIMAL(10,2) NOT NULL DEFAULT 0.5,
    "dimensionsJson" JSONB,
    "imagesJson" JSONB NOT NULL,
    "attributesJson" JSONB,
    "hasModel" BOOLEAN NOT NULL DEFAULT false,
    "tierVariationJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "product_models" (
    "modelId" BIGSERIAL NOT NULL,
    "itemId" BIGINT NOT NULL,
    "modelName" TEXT NOT NULL,
    "modelSku" TEXT,
    "tierIndex" JSONB NOT NULL,
    "originalPrice" DECIMAL(15,2) NOT NULL,
    "sellerStock" INTEGER NOT NULL DEFAULT 100,
    "shopeeStock" INTEGER NOT NULL DEFAULT 0,
    "reservedStock" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_models_pkey" PRIMARY KEY ("modelId")
);

-- CreateTable
CREATE TABLE "orders" (
    "orderSn" TEXT NOT NULL,
    "shopId" BIGINT NOT NULL,
    "orderStatus" "OrderStatus" NOT NULL DEFAULT 'UNPAID',
    "isSplitUp" BOOLEAN NOT NULL DEFAULT false,
    "cancelReason" TEXT,
    "cancelBy" TEXT,
    "buyerCancelReason" TEXT,
    "buyerUserId" BIGINT NOT NULL DEFAULT 1001,
    "buyerUsername" TEXT NOT NULL DEFAULT 'shopee_buyer_test',
    "recipientName" TEXT NOT NULL DEFAULT 'Nguyen Van A',
    "recipientPhone" TEXT NOT NULL DEFAULT '+84901234567',
    "recipientAddress" TEXT NOT NULL DEFAULT '123 Le Loi, District 1, Ho Chi Minh City',
    "recipientDistrict" TEXT NOT NULL DEFAULT 'District 1',
    "recipientCity" TEXT NOT NULL DEFAULT 'Ho Chi Minh City',
    "recipientState" TEXT NOT NULL DEFAULT 'Ho Chi Minh',
    "recipientZipcode" TEXT NOT NULL DEFAULT '700000',
    "shippingCarrier" TEXT NOT NULL DEFAULT 'Shopee Xpress',
    "channelId" BIGINT NOT NULL DEFAULT 30001,
    "totalAmount" DECIMAL(15,2) NOT NULL,
    "buyerPaidShippingFee" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "actualShippingFee" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "escrowAmount" DECIMAL(15,2),
    "commissionFee" DECIMAL(15,2) DEFAULT 0,
    "serviceFee" DECIMAL(15,2) DEFAULT 0,
    "sellerTransactionFee" DECIMAL(15,2) DEFAULT 0,
    "voucherFromSeller" DECIMAL(15,2) DEFAULT 0,
    "voucherFromShopee" DECIMAL(15,2) DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "paymentMethod" TEXT NOT NULL DEFAULT 'ShopeePay',
    "messageToSeller" TEXT,
    "note" TEXT,
    "payTime" TIMESTAMP(3),
    "shipByDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("orderSn")
);

-- CreateTable
CREATE TABLE "order_items" (
    "orderItemId" BIGSERIAL NOT NULL,
    "orderSn" TEXT NOT NULL,
    "itemId" BIGINT NOT NULL,
    "modelId" BIGINT,
    "itemName" TEXT NOT NULL,
    "modelName" TEXT,
    "modelSku" TEXT,
    "itemPrice" DECIMAL(15,2) NOT NULL,
    "quantityPurchased" INTEGER NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("orderItemId")
);

-- CreateTable
CREATE TABLE "order_packages" (
    "packageNumber" TEXT NOT NULL,
    "orderSn" TEXT NOT NULL,
    "logisticsStatus" TEXT NOT NULL DEFAULT 'LOGISTICS_NOT_START',
    "shippingCarrier" TEXT NOT NULL DEFAULT 'Shopee Xpress',
    "channelId" BIGINT NOT NULL DEFAULT 30001,
    "trackingNumber" TEXT,
    "shippingDocumentUrl" TEXT,
    "documentStatus" TEXT NOT NULL DEFAULT 'NOT_CREATED',
    "shippingType" TEXT,
    "pickupTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_packages_pkey" PRIMARY KEY ("packageNumber")
);

-- CreateTable
CREATE TABLE "package_items" (
    "id" BIGSERIAL NOT NULL,
    "packageNumber" TEXT NOT NULL,
    "orderItemId" BIGINT NOT NULL,
    "modelQuantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "package_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "return_requests" (
    "returnSn" TEXT NOT NULL,
    "orderSn" TEXT NOT NULL,
    "shopId" BIGINT NOT NULL,
    "returnReason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'REQUESTED',
    "refundAmount" DECIMAL(15,2) NOT NULL,
    "buyerImagesJson" JSONB,
    "sellerProofJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "return_requests_pkey" PRIMARY KEY ("returnSn")
);

-- CreateTable
CREATE TABLE "webhook_logs" (
    "id" BIGSERIAL NOT NULL,
    "partnerId" BIGINT NOT NULL,
    "pushCode" INTEGER NOT NULL,
    "shopId" BIGINT,
    "ordersn" TEXT,
    "targetUrl" TEXT NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "authHeader" TEXT NOT NULL,
    "responseStatus" INTEGER,
    "responseBody" TEXT,
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "nextRetryAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulator_config" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "rateLimitEnabled" BOOLEAN NOT NULL DEFAULT false,
    "rateLimitPerMin" INTEGER NOT NULL DEFAULT 100,
    "forceExpiredToken" BOOLEAN NOT NULL DEFAULT false,
    "forceInvalidSign" BOOLEAN NOT NULL DEFAULT false,
    "artificialDelayMs" INTEGER NOT NULL DEFAULT 0,
    "strictTimestamp" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "simulator_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "products_shopId_itemStatus_updatedAt_idx" ON "products"("shopId", "itemStatus", "updatedAt");

-- CreateIndex
CREATE INDEX "orders_shopId_orderStatus_createdAt_idx" ON "orders"("shopId", "orderStatus", "createdAt");

-- CreateIndex
CREATE INDEX "webhook_logs_status_nextRetryAt_idx" ON "webhook_logs"("status", "nextRetryAt");

-- AddForeignKey
ALTER TABLE "shops" ADD CONSTRAINT "shops_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("partnerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shop_addresses" ADD CONSTRAINT "shop_addresses_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("shopId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_attributes" ADD CONSTRAINT "category_attributes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("categoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("shopId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_models" ADD CONSTRAINT "product_models_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "products"("itemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("shopId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderSn_fkey" FOREIGN KEY ("orderSn") REFERENCES "orders"("orderSn") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "products"("itemId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "product_models"("modelId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_packages" ADD CONSTRAINT "order_packages_orderSn_fkey" FOREIGN KEY ("orderSn") REFERENCES "orders"("orderSn") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_items" ADD CONSTRAINT "package_items_packageNumber_fkey" FOREIGN KEY ("packageNumber") REFERENCES "order_packages"("packageNumber") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "package_items" ADD CONSTRAINT "package_items_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("orderItemId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_orderSn_fkey" FOREIGN KEY ("orderSn") REFERENCES "orders"("orderSn") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "return_requests" ADD CONSTRAINT "return_requests_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "shops"("shopId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_logs" ADD CONSTRAINT "webhook_logs_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("partnerId") ON DELETE CASCADE ON UPDATE CASCADE;
