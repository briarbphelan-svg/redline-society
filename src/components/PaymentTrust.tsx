/* Payment trust row — real card-network marks (inline SVG, no external assets)
   and plain-language security guarantees with monoline icons instead of emojis. */

function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex h-7 items-center justify-center rounded-md bg-white px-2 shadow-sm ${className}`}>
      {children}
    </span>
  );
}

function Visa() {
  return (
    <Pill>
      <span className="font-black italic tracking-tight text-[13px] text-[#1434CB]">VISA</span>
    </Pill>
  );
}

function Mastercard() {
  return (
    <Pill>
      <svg width="30" height="19" viewBox="0 0 32 20" role="img" aria-label="Mastercard">
        <circle cx="12" cy="10" r="8.5" fill="#EB001B" />
        <circle cx="20" cy="10" r="8.5" fill="#F79E1B" />
        <path d="M16 3.6a8.5 8.5 0 0 0 0 12.8 8.5 8.5 0 0 0 0-12.8z" fill="#FF5F00" />
      </svg>
    </Pill>
  );
}

function Amex() {
  return (
    <Pill className="!bg-[#1F72CD]">
      <span className="text-white text-[10px] font-bold tracking-wide">AMEX</span>
    </Pill>
  );
}

function Discover() {
  return (
    <Pill>
      <span className="text-[10px] font-bold tracking-tight text-[#3b3b3b]">DISC</span>
      <span className="ml-1 h-2 w-2 rounded-full bg-[#F76D01]" />
    </Pill>
  );
}

function ApplePay() {
  return (
    <Pill>
      <svg width="11" height="13" viewBox="0 0 384 512" fill="#000" aria-hidden>
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
      </svg>
      <span className="ml-1 text-[11px] font-semibold text-black">Pay</span>
    </Pill>
  );
}

function GooglePay() {
  return (
    <Pill>
      <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden>
        <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.5-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.6z" />
        <path fill="#34A853" d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3C3.7 21.4 7.6 24 12 24z" />
        <path fill="#FBBC04" d="M5.6 14.7a7.2 7.2 0 0 1 0-4.6v-3H1.8a12 12 0 0 0 0 10.6l3.8-3z" />
        <path fill="#EA4335" d="M12 4.8c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 1.2 15.1 0 12 0 7.6 0 3.7 2.6 1.8 6.4l3.8 3C6.5 6.7 9 4.8 12 4.8z" />
      </svg>
      <span className="ml-1 text-[11px] font-semibold text-[#5F6368]">Pay</span>
    </Pill>
  );
}

function Guarantee({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-ash font-medium">
      <span className="text-signal">{icon}</span>
      {children}
    </span>
  );
}

export default function PaymentTrust() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-flex h-7 items-center gap-1.5 rounded-md bg-[#635BFF] px-2.5 text-white text-[11px] font-semibold">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="4" y="10.5" width="16" height="10" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
          </svg>
          Secured with Stripe
        </span>
        <Visa />
        <Mastercard />
        <Amex />
        <Discover />
        <ApplePay />
        <GooglePay />
      </div>
      <div className="flex items-center justify-center gap-x-5 gap-y-2 flex-wrap">
        <Guarantee
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="4" y="10.5" width="16" height="10" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
            </svg>
          }
        >
          256-bit SSL encryption
        </Guarantee>
        <Guarantee
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 2 4 5v6c0 5 3.4 9.4 8 10 4.6-.6 8-5 8-10V5l-8-3z" /><path d="m9 12 2 2 4-4" />
            </svg>
          }
        >
          Card details never touch our servers
        </Guarantee>
        <Guarantee
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
            </svg>
          }
        >
          Entries recorded instantly
        </Guarantee>
      </div>
    </div>
  );
}
