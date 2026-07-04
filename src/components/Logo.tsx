/* Animated tachometer logo — needle sweeps to redline on load, red zone pulses. */
export default function Logo({ size = 40, wordmark = true }: { size?: number; wordmark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        aria-hidden
        className="shrink-0"
      >
        {/* dial */}
        <circle cx="24" cy="24" r="21" fill="#141416" stroke="#26262a" strokeWidth="2" />
        {/* tick marks */}
        {Array.from({ length: 9 }, (_, i) => {
          const a = (-210 + i * 30) * (Math.PI / 180);
          const x1 = 24 + Math.cos(a) * 17;
          const y1 = 24 + Math.sin(a) * 17;
          const x2 = 24 + Math.cos(a) * 20;
          const y2 = 24 + Math.sin(a) * 20;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i >= 6 ? "#ff3b30" : "#9b9ba3"}
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}
        {/* red zone arc */}
        <path
          d="M 24 24 m 14.72 -8.5 a 17 17 0 0 1 2.28 8.5"
          fill="none"
          stroke="#ff3b30"
          strokeWidth="3.5"
          strokeLinecap="round"
          className="logo-redzone"
        />
        {/* needle */}
        <g className="logo-needle">
          <line x1="24" y1="24" x2="24" y2="7" stroke="#ffcc00" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <circle cx="24" cy="24" r="3.5" fill="#f4f4f2" />
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
