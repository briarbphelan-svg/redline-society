"use client";

import { useEffect } from "react";

/* Meta Pixel + TikTok Pixel standard events. Each call no-ops unless that
   platform's base code loaded (NEXT_PUBLIC_META_PIXEL_ID / NEXT_PUBLIC_TIKTOK_PIXEL_ID
   set) — so these are safe to render always. */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (...args: unknown[]) => void; page: (...args: unknown[]) => void };
  }
}

/** Fires once per order — the conversion event a Sales campaign optimizes toward. */
export function PixelPurchase({ value, orderNumber }: { value: number; orderNumber: string }) {
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.fbq !== "function") return;
    const key = `fbq_purchase_${orderNumber}`;
    if (sessionStorage.getItem(key)) return; // dedupe across refreshes
    sessionStorage.setItem(key, "1");
    window.fbq("track", "Purchase", { value, currency: "USD" });
  }, [value, orderNumber]);

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
    if (typeof window === "undefined" || typeof window.fbq !== "function") return;
    window.fbq("track", "InitiateCheckout", value ? { value, currency: "USD" } : {});
  }, [value]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.ttq) return;
    window.ttq.track("InitiateCheckout", value ? { value, currency: "USD" } : {});
  }, [value]);

  return null;
}
