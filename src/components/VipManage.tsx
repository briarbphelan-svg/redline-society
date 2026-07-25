"use client";

import { useState } from "react";
import { VIP_CLUB } from "@/lib/config";

/* Shown on the success page when the customer opted into the VIP Club. Confirms the
   recurring charge in plain language and gives a one-click self-serve cancel (Stripe
   billing portal) — the "simple cancellation mechanism" ROSCA requires. */
export default function VipManage({ orderNumber }: { orderNumber: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function openPortal() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/vip/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: orderNumber }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Couldn't open billing.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  const price = `$${(VIP_CLUB.priceCents / 100).toFixed(2)}`;

  return (
    <div className="bg-panel border border-line rounded-2xl p-6 mt-6 text-left">
      <p className="font-display text-lg uppercase">{VIP_CLUB.name} active</p>
      <p className="text-mist text-sm mt-1">
        You&apos;re a member — {VIP_CLUB.monthlyEntries.toLocaleString()} bonus entries every month. You were charged{" "}
        {price} today, and it renews {price}/month until you cancel.
      </p>
      <button
        onClick={openPortal}
        disabled={loading}
        className="mt-4 border-2 border-line hover:border-caliper rounded-full px-6 py-2.5 text-sm font-bold transition-colors disabled:opacity-40"
      >
        {loading ? "Opening…" : "Manage or cancel membership"}
      </button>
      {error && <p className="text-danger text-xs mt-2">{error}</p>}
    </div>
  );
}
