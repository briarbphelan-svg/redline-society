import { PrismaClient } from "@prisma/client";
import { ENTRY_PACKAGES } from "../src/lib/config";

const db = new PrismaClient();

async function main() {
  for (const p of ENTRY_PACKAGES) {
    // Note: postersIncluded is a config-only field (poster tiering lives in
    // config, not the DB), so it is intentionally NOT written to Package.
    const fields = {
      name: p.name,
      priceCents: p.priceCents,
      entries: p.entries,
      multiplierLabel: p.multiplierLabel,
      badge: p.badge,
      position: p.position,
      active: true,
    };
    await db.package.upsert({
      where: { slug: p.slug },
      update: fields,
      create: { slug: p.slug, ...fields },
    });
  }
  console.log("Packages seeded:", await db.package.count());
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
