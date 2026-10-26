CREATE TABLE "product_shipping_options" (
    "optionId" TEXT NOT NULL,
    "optionName" TEXT NOT NULL,
    "optionGroup" TEXT NOT NULL,
    "partnerLabel" TEXT NOT NULL,
    "maximumWeightGram" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_shipping_options_pkey" PRIMARY KEY ("optionId")
);

ALTER TABLE "products"
ADD COLUMN "gtin" TEXT,
ADD COLUMN "videoUrl" TEXT,
ADD COLUMN "productCondition" TEXT NOT NULL DEFAULT 'NEW',
ADD COLUMN "isPreorder" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "shippingOptionsJson" JSONB;
