"use client";

import { useEffect } from "react";

/* If a visitor lands via a referral link (/?ref=CODE), stash the code in a
   30-day cookie so it can be attached to their order at checkout. Mounted
   site-wide in the layout. Silent — renders nothing. */
export default function ReferralCapture() {
  useEffect(() => {
    try {
      const ref = new URLSearchParams(window.location.search).get("ref");
      if (ref && /^[A-Za-z0-9_-]{1,40}$/.test(ref)) {
        document.cookie = `rl_ref=${encodeURIComponent(ref)}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
      }
    } catch {}
  }, []);
  return null;
}
