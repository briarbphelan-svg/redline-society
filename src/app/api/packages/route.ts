import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const packages = await db.package.findMany({
    where: { active: true },
    orderBy: { position: "asc" },
    select: { slug: true, name: true, priceCents: true, entries: true, multiplierLabel: true },
  });
  return NextResponse.json(packages);
}
