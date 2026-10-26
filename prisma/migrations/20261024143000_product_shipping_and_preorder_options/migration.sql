ALTER TABLE "product_shipping_options"
ALTER COLUMN "maximumWeightGram" DROP NOT NULL;

ALTER TABLE "products"
ADD COLUMN "preorderDaysToShip" INTEGER;
