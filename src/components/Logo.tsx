/* Animated tachometer logo — machined bezel, graduated ticks, tapered needle
   sweeping into the redline on load. Drawn on a 120-unit grid for crispness. */

const CX = 60;
const CY = 60;
const START = 135; // degrees, screen coords (y-down, clockwise)
const SWEEP = 270;
const TICKS = 13; // major ticks
const RED_FROM = 10; // ticks >= this index are redline

function polar(angleDeg: number, r: number): [number, number] {
  const a = (angleDeg * Math.PI) / 180;
  return [CX + Math.cos(a) * r, CY + Math.sin(a) * r];
}

function arcPath(fromDeg: number, toDeg: number, r: number): string {
  const [x1, y1] = polar(fromDeg, r);
  const [x2, y2] = polar(toDeg, r);
  const large = toDeg - fromDeg > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

export default function Logo({ size = 44, wordmark = true }: { size?: number; wordmark?: boolean }) {
  const majors = Array.from({ length: TICKS }, (_, i) => START + (i * SWEEP) / (TICKS - 1));
  const minors = Array.from({ length: TICKS - 1 }, (_, i) => START + ((i + 0.5) * SWEEP) / (TICKS - 1));
  const redStart = START + (RED_FROM * SWEEP) / (TICKS - 1);

  return (
    <span className="inline-flex items-center gap-3 select-none">
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        aria-hidden
        shapeRendering="geometricPrecision"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="lg-bezel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4a4a52" />
            <stop offset="0.5" stopColor="#1c1c20" />
            <stop offset="1" stopColor="#3a3a42" />
          </linearGradient>
          <radialGradient id="lg-face" cx="0.38" cy="0.32" r="1">
            <stop offset="0" stopColor="#1e1e23" />
            <stop offset="1" stopColor="#0a0a0c" />
          </radialGradient>
          <linearGradient id="lg-needle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe066" />
            <stop offset="1" stopColor="#e6a800" />
          </linearGradient>
          <radialGradient id="lg-hub" cx="0.35" cy="0.35" r="1">
            <stop offset="0" stopColor="#e8e8ea" />
            <stop offset="0.6" stopColor="#8a8a92" />
            <stop offset="1" stopColor="#3a3a40" />
          </radialGradient>
        </defs>

        {/* bezel */}
        <circle cx={CX} cy={CY} r="57" fill="url(#lg-bezel)" />
        <circle cx={CX} cy={CY} r="52.5" fill="url(#lg-face)" />
        <circle cx={CX} cy={CY} r="52.5" fill="none" stroke="#000" strokeOpacity="0.5" strokeWidth="1" />

        {/* redline glow + arc */}
        <path d={arcPath(redStart, START + SWEEP, 45)} fill="none" stroke="#ff3b30" strokeOpacity="0.25" strokeWidth="9" strokeLinecap="round" className="logo-redzone" />
        <path d={arcPath(redStart, START + SWEEP, 45)} fill="none" stroke="#ff3b30" strokeWidth="4" strokeLinecap="round" className="logo-redzone" />

        {/* minor ticks */}
        {minors.map((a, i) => {
          const [x1, y1] = polar(a, 42);
          const [x2, y2] = polar(a, 46);
          return <line key={`m${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#5a5a63" strokeWidth="1.6" strokeLinecap="round" />;
        })}
        {/* major ticks */}
        {majors.map((a, i) => {
          const [x1, y1] = polar(a, 38.5);
          const [x2, y2] = polar(a, 46.5);
          return (
            <line
              key={`M${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i >= RED_FROM ? "#ff5a50" : "#c9c9cf"}
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}

        {/* needle (drawn pointing up; rotated by CSS animation) */}
        <g className="logo-needle">
          <polygon points="60,17 62.8,58 57.2,58" fill="url(#lg-needle)" />
          <polygon points="60,17 61.2,58 58.8,58" fill="#fff" fillOpacity="0.25" />
          {/* counterweight */}
          <rect x="57.6" y="58" width="4.8" height="9" rx="2.4" fill="#e6a800" />
        </g>

        {/* hub */}
        <circle cx={CX} cy={CY} r="8.5" fill="url(#lg-hub)" />
        <circle cx={CX} cy={CY} r="3.2" fill="#0b0b0c" />
      </svg>

      {wordmark && (
        <span className="font-display text-2xl tracking-wide leading-none">
          <span className="logo-word-1">REDLINE</span>
          <span className="text-caliper logo-word-2">SOCIETY</span>
        </span>
      )}
    </span>
  );
}
