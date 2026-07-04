import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { boostActive, effectiveEntries } from "@/lib/config";

export async function GET() {
  const packages = await db.package.findMany({
    where: { active: true },
    orderBy: { position: "asc" },
    select: { slug: true, name: true, priceCents: true, entries: true, multiplierLabel: true },
  });
  const boost = boostActive();
  return NextResponse.json(
    packages.map((p) => ({
      ...p,
      entries: effectiveEntries(p),
      multiplierLabel: boost ? p.multiplierLabel : "100x ENTRIES",
    }))
  );
}
