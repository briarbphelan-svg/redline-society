/* Redline Society wordmark — pure type, staggered reveal on load. */
export default function Logo({ size = 40, wordmark = true }: { size?: number; wordmark?: boolean }) {
  void size;
  void wordmark;
  return (
    <span className="inline-flex items-baseline select-none font-display text-2xl tracking-wide leading-none">
      <span className="logo-word-1">REDLINE</span>
      <span className="text-caliper logo-word-2">SOCIETY</span>
      <span className="text-danger logo-word-2 ml-1 text-lg leading-none" aria-hidden>
        ›››
      </span>
    </span>
  );
}
