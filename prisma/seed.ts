import { PrismaClient } from "@prisma/client";
import { ENTRY_PACKAGES } from "../src/lib/config";

const db = new PrismaClient();

async function main() {
  for (const p of ENTRY_PACKAGES) {
    await db.package.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        priceCents: p.priceCents,
        entries: p.entries,
        multiplierLabel: p.multiplierLabel,
        badge: p.badge,
        position: p.position,
        active: true,
      },
      create: { ...p, active: true },
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
