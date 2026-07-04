import { NextResponse } from "next/server";
import { entriesForEmail } from "@/lib/entries";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  const data = await entriesForEmail(email);
  return NextResponse.json({
    total: data.total,
    paid: data.paid,
    free: data.free,
    amoeCount: data.amoe.length,
    orders: data.orders.map((o) => ({
      number: o.number,
      packageName: o.packageName,
      quantity: o.quantity,
      entries: o.entries,
      createdAt: o.createdAt,
    })),
  });
}
