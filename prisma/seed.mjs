// prisma/seed.mjs

import { PrismaClient } from "@prisma/client";
import { categories, products } from "../src/lib/data.js";

const prisma = new PrismaClient();

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

async function main() {
  console.log("🌱 Seeding Categories...");

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        icon: c.icon,
        image: c.image ?? null,
        description: c.description ?? null,
      },
      create: {
        name: c.name,
        slug: c.slug,
        icon: c.icon,
        image: c.image ?? null,
        description: c.description ?? null,
      },
    });
  }

  console.log("🌱 Seeding Brands...");

  const uniqueBrands = [...new Set(products.map((p) => p.brand))];

  for (const brand of uniqueBrands) {
    await prisma.brand.upsert({
      where: {
        slug: slugify(brand),
      },
      update: {
        name: brand,
      },
      create: {
        name: brand,
        slug: slugify(brand),
      },
    });
  }

  console.log("🌱 Seeding Products...");

  for (const p of products) {
    const slug = slugify(p.name);

    await prisma.product.upsert({
      where: {
        slug,
      },

      update: {
        name: p.name,
        description: p.description,
        shortDescription: p.description.substring(0, 100),
        sku: `SKU-${slug}`,
        price: p.price,
        salePrice: p.salePrice ?? null,
        stock: p.stock,
        image: p.image,
        rating: p.rating,
        reviewCount: p.reviewCount,
        featured: p.featured,
        active: true,

        category: {
          connect: {
            slug: p.category,
          },
        },

        brand: {
          connect: {
            slug: slugify(p.brand),
          },
        },
      },

      create: {
        name: p.name,
        slug,
        description: p.description,
        shortDescription: p.description.substring(0, 100),
        sku: `SKU-${slug}`,
        price: p.price,
        salePrice: p.salePrice ?? null,
        stock: p.stock,
        image: p.image,
        rating: p.rating,
        reviewCount: p.reviewCount,
        featured: p.featured,
        active: true,

        category: {
          connect: {
            slug: p.category,
          },
        },

        brand: {
          connect: {
            slug: slugify(p.brand),
          },
        },
      },
    });

    // Inventory
    await prisma.inventory.upsert({
      where: {
        productId: (
          await prisma.product.findUnique({
            where: { slug },
          })
        ).id,
      },

      update: {
        quantity: p.stock,
      },

      create: {
        quantity: p.stock,
        lowStockAlert: 5,

        product: {
          connect: {
            slug,
          },
        },
      },
    });
  }

  console.log("✅ Database Seeded Successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });