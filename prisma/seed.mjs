// prisma/seed.mjs

import { PrismaClient } from "@prisma/client";
import { categories, products } from "../src/lib/data.js";

const prisma = new PrismaClient();

// Starter Delhi NCR serviceability data — admin can add/remove more via
// /admin/delivery/areas and /admin/delivery/pincodes.
const DELIVERY_AREAS = [
  {
    name: "Delhi",
    slug: "delhi",
    pincodes: [
      ["110001", "Connaught Place"],
      ["110002", "Daryaganj"],
      ["110005", "Karol Bagh"],
      ["110016", "Hauz Khas"],
      ["110017", "Malviya Nagar"],
      ["110019", "Kalkaji"],
      ["110024", "Lajpat Nagar"],
      ["110034", "Model Town"],
      ["110048", "Chirag Delhi"],
      ["110058", "Janakpuri"],
      ["110062", "Dwarka"],
      ["110085", "Rohini"],
      ["110092", "Mayur Vihar"],
    ],
  },
  {
    name: "Noida",
    slug: "noida",
    pincodes: [
      ["201301", "Sector 15"],
      ["201303", "Sector 22"],
      ["201304", "Sector 41"],
      ["201305", "Sector 62"],
      ["201307", "Sector 78"],
      ["201309", "Sector 137"],
      ["201310", "Sector 76"],
      ["201313", "Sector 128"],
      ["201318", "Sector 168"],
    ],
  },
  {
    name: "Greater Noida",
    slug: "greater-noida",
    pincodes: [
      ["201306", "Alpha 1"],
      ["201308", "Beta 2"],
      ["201310", "Gamma 1"],
      ["201312", "Pari Chowk"],
      ["203201", "Surajpur"],
      ["203207", "Knowledge Park"],
    ],
  },
  {
    name: "Ghaziabad",
    slug: "ghaziabad",
    pincodes: [
      ["201001", "Ghaziabad City"],
      ["201002", "Kavi Nagar"],
      ["201005", "Vasundhara"],
      ["201009", "Vaishali"],
      ["201010", "Indirapuram"],
      ["201012", "Raj Nagar Extension"],
      ["201014", "Crossing Republik"],
      ["201017", "Nehru Nagar"],
    ],
  },
  {
    name: "Faridabad",
    slug: "faridabad",
    pincodes: [
      ["121001", "NIT Faridabad"],
      ["121002", "Old Faridabad"],
      ["121003", "Sector 15"],
      ["121004", "Sector 21"],
      ["121006", "Sector 37"],
      ["121007", "Ballabgarh"],
      ["121009", "Sector 88"],
      ["121012", "Greenfield Colony"],
    ],
  },
  {
    name: "Gurugram",
    slug: "gurugram",
    pincodes: [
      ["122001", "Civil Lines"],
      ["122002", "Sector 14"],
      ["122003", "Sector 4"],
      ["122004", "DLF Phase 1"],
      ["122007", "Palam Vihar"],
      ["122009", "Sector 56"],
      ["122011", "Sohna Road"],
      ["122015", "Sector 82"],
      ["122018", "Sector 109"],
    ],
  },
];

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
      // No-op on existing rows — admin edits (via /admin/categories) must
      // survive a re-seed. Seeding only backfills categories that are missing.
      update: {},
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
      // No-op on existing rows — see the category upsert above for why.
      update: {},
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

      // No-op on existing rows — a product already in the DB may have been
      // edited by an admin since it was first seeded (price, stock, photos,
      // description). Re-running the seed must never revert those edits;
      // it should only create products that don't exist yet.
      update: {},

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

      // No-op on existing rows — same reasoning as the product upsert above.
      update: {},

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

  console.log("🌱 Seeding Delivery Areas & Pincodes...");

  for (const area of DELIVERY_AREAS) {
    const deliveryArea = await prisma.deliveryArea.upsert({
      where: { slug: area.slug },
      // No-op on existing rows — admin edits (via /admin/delivery/areas) must survive a re-seed.
      update: {},
      create: { name: area.name, slug: area.slug },
    });

    for (const [code, areaLabel] of area.pincodes) {
      await prisma.pincode.upsert({
        where: { code },
        // No-op on existing rows — same reasoning as deliveryArea above.
        update: {},
        create: { code, areaLabel, deliveryAreaId: deliveryArea.id },
      });
    }
  }

  console.log("🌱 Seeding Delivery Settings...");

  await prisma.deliverySettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

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