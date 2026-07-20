"use client";

import { useEffect } from "react";

/* TikTok Pixel standard events. Each call no-ops unless the TikTok base code
   loaded (NEXT_PUBLIC_TIKTOK_PIXEL_ID set) — so these are safe to render always.
   (The old Meta/Facebook pixel was removed after the Meta ad-account ban.) */

declare global {
  interface Window {
    ttq?: { track: (...args: unknown[]) => void; page: (...args: unknown[]) => void };
  }
}

/** Fires once per order — the conversion event a Sales campaign optimizes toward. */
export function PixelPurchase({ value, orderNumber }: { value: number; orderNumber: string }) {
  useEffect(() => {
    if (typeof window === "undefined" || !window.ttq) return;
    const key = `ttq_purchase_${orderNumber}`;
    if (sessionStorage.getItem(key)) return; // dedupe across refreshes
    sessionStorage.setItem(key, "1");
    window.ttq.track("CompletePayment", { value, currency: "USD" }, { event_id: orderNumber });
  }, [value, orderNumber]);

  return null;
}

/** Upper-funnel signal fired when the checkout page opens. */
export function PixelInitiateCheckout({ value }: { value?: number }) {
  useEffect(() => {
    if (typeof window === "undefined" || !window.ttq) return;
    window.ttq.track("InitiateCheckout", value ? { value, currency: "USD" } : {});
  }, [value]);

  return null;
}
