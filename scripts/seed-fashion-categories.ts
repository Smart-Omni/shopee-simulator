import { PrismaClient } from "@prisma/client";
import { officialFashionCategories, officialFashionAttributes } from "../prisma/fashion-seed.data";

const prisma = new PrismaClient();

async function main() {
  console.log("================================================================================");
  console.log("   SHOPEE SIMULATOR: SEEDING OFFICIAL FASHION CATEGORIES & ATTRIBUTES");
  console.log("================================================================================");
  console.log(`Targeting Database: ${process.env.DATABASE_URL ? "Configured" : "Default"}`);
  console.log(`- Categories to upsert: ${officialFashionCategories.length}`);
  console.log(`- Attributes to upsert: ${officialFashionAttributes.length}`);

  // 1. Upsert Categories
  let catCount = 0;
  for (const c of officialFashionCategories) {
    await prisma.category.upsert({
      where: { categoryId: c.categoryId },
      update: {
        categoryName: c.categoryName,
        parentId: c.parentId,
        hasChildren: c.hasChildren,
      },
      create: {
        categoryId: c.categoryId,
        categoryName: c.categoryName,
        parentId: c.parentId,
        hasChildren: c.hasChildren,
      },
    });
    catCount++;
  }
  console.log(`✓ Successfully upserted ${catCount} official Shopee fashion categories!`);

  // 2. Upsert Attributes
  let attrCount = 0;
  for (const attr of officialFashionAttributes) {
    await prisma.categoryAttribute.upsert({
      where: { attributeId: attr.attributeId },
      update: {
        categoryId: attr.categoryId,
        name: attr.name,
        isMandatory: attr.isMandatory,
        inputType: attr.inputType,
        valueListJson: attr.valueListJson,
      },
      create: {
        attributeId: attr.attributeId,
        categoryId: attr.categoryId,
        name: attr.name,
        isMandatory: attr.isMandatory,
        inputType: attr.inputType,
        valueListJson: attr.valueListJson,
      },
    });
    attrCount++;
  }
  console.log(`✓ Successfully upserted ${attrCount} fashion attributes across all leaf categories!`);
  console.log("================================================================================");
  console.log("🎉 Fashion category tree is ready and active!");
  console.log("================================================================================");
}

main()
  .catch((e) => {
    console.error("Error seeding fashion categories:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
