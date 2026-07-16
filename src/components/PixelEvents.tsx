"use client";

import { useEffect } from "react";

/* Meta Pixel standard events. No-ops unless the pixel base code loaded
   (NEXT_PUBLIC_META_PIXEL_ID set) — so these are safe to render always. */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Fires once per order — the conversion event a Sales campaign optimizes toward. */
export function PixelPurchase({ value, orderNumber }: { value: number; orderNumber: string }) {
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.fbq !== "function") return;
    const key = `fbq_purchase_${orderNumber}`;
    if (sessionStorage.getItem(key)) return; // dedupe across refreshes
    sessionStorage.setItem(key, "1");
    // eventID matches the server-side Conversions API event (order number) so
    // Meta dedupes the browser + server Purchase into one conversion.
    window.fbq("track", "Purchase", { value, currency: "USD" }, { eventID: orderNumber });
  }, [value, orderNumber]);
  return null;
}

/** Upper-funnel signal fired when the checkout page opens. */
export function PixelInitiateCheckout({ value }: { value?: number }) {
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.fbq !== "function") return;
    window.fbq("track", "InitiateCheckout", value ? { value, currency: "USD" } : {});
  }, [value]);
  return null;
}
