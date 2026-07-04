/* Redline Society mark — minimal flat tach: track arc, redline segment,
   needle sweeping to the limiter on load. Reads from 16px to billboard. */
export default function Logo({ size = 40, wordmark = true }: { size?: number; wordmark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        aria-hidden
        shapeRendering="geometricPrecision"
        className="shrink-0"
      >
        {/* track: 270° arc, opening at the bottom */}
        <path
          d="M 26.4 73.6 A 33.4 33.4 0 1 1 73.6 73.6"
          fill="none"
          stroke="#2e2e33"
          strokeWidth="13"
          strokeLinecap="round"
        />
        {/* redline: final quarter */}
        <path
          d="M 73.6 26.4 A 33.4 33.4 0 0 1 73.6 73.6"
          fill="none"
          stroke="#ff3b30"
          strokeWidth="13"
          strokeLinecap="round"
          className="logo-redzone"
        />
        {/* needle (drawn pointing up, animated to the redline) */}
        <g className="logo-needle">
          <polygon points="50,10 54,50 46,50" fill="#ffcc00" />
        </g>
        <circle cx="50" cy="50" r="7" fill="#f4f4f2" />
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
