/* Payment trust row — Stripe badge + card marks + guarantees. */
export default function PaymentTrust() {
  return (
    <div className="mt-5 space-y-3">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {/* Powered by Stripe badge */}
        <span className="inline-flex items-center gap-1.5 bg-[#635bff] text-white text-[11px] font-bold rounded-md px-2.5 py-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 1L3 5v6c0 5.6 3.8 10.7 9 12 5.2-1.3 9-6.4 9-12V5l-9-4z" />
          </svg>
          Powered by <span className="font-black tracking-tight">Stripe</span>
        </span>
        {["VISA", "MC", "AMEX", "DISC", "Apple Pay", "G Pay"].map((c) => (
          <span key={c} className="border border-line bg-panel text-mist text-[11px] font-bold rounded-md px-2 py-1.5 whitespace-nowrap">
            {c}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 text-[11px] text-mist font-semibold flex-wrap">
        <span>🔒 256-bit SSL encryption</span>
        <span>🛡 Card details never touch our servers</span>
        <span>🏁 Entries recorded instantly</span>
      </div>
    </div>
  );
}
