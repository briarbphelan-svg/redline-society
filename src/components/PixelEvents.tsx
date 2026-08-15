"use client";

import { useEffect, useRef } from "react";

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
    // eventID must match the server-side CAPI event_id (the order number) so Meta
    // dedupes the browser + server Purchase into one — never double-counted.
    window.fbq("track", "Purchase", { value, currency: "USD" }, { eventID: orderNumber });
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

/* Upper-funnel signal fired when the checkout page opens.

   `value` + `currency` are REQUIRED, not decorative: the live ad set bids on
   InitiateCheckout, and Events Manager flagged 100% of these as missing price
   info, which blocks value-based optimization.

   Fires exactly ONCE per mount. The value tracks the cart, so without the ref
   guard every quantity tweak would re-fire the effect and inflate the very
   metric delivery is optimized against. A page reload is a genuinely new
   checkout open, so a per-mount ref (not sessionStorage) is the right scope. */
export function PixelInitiateCheckout({ value }: { value?: number }) {
  const fbSent = useRef(false);
  const ttSent = useRef(false);

  useEffect(() => {
    if (fbSent.current) return;
    if (typeof window === "undefined" || typeof window.fbq !== "function") return;
    fbSent.current = true;
    window.fbq("track", "InitiateCheckout", value != null ? { value, currency: "USD" } : {});
  }, [value]);

  useEffect(() => {
    if (ttSent.current) return;
    if (typeof window === "undefined" || !window.ttq) return;
    ttSent.current = true;
    window.ttq.track("InitiateCheckout", value != null ? { value, currency: "USD" } : {});
  }, [value]);

  return null;
}

/* Fired imperatively when the buyer submits the checkout form — i.e. they filled
   in name/email, ticked eligibility + rules, and pressed Pay. InitiateCheckout
   only says the page loaded, so without this there is no way to tell a browser
   that bounced off the form from one that actually tried to buy.

   Deliberately fired BEFORE the /api/checkout request rather than after: the
   success path ends in `window.location.href = …`, and a navigation started in
   the same tick can abort the pixel's in-flight beacon. Firing first costs
   nothing and never delays the redirect. The trade-off is that this counts pay
   attempts, not sessions created — a server-side failure still counts here, but
   those are visible as non-200s in the Stripe request logs.

   Not deduped: two submits after a card error really are two attempts. */
export function trackAddPaymentInfo(value?: number) {
  if (typeof window === "undefined") return;
  const payload = value ? { value, currency: "USD" } : {};
  if (typeof window.fbq === "function") window.fbq("track", "AddPaymentInfo", payload);
  window.ttq?.track("AddPaymentInfo", payload);
}
