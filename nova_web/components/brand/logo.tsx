import { cn } from "@/lib/utils";

/*
  NOVA mark — a sprouting leaf whose stem rises like a growth arrow,
  set in a brand-green circle. Health (leaf), beauty (soft curves),
  business growth (upward stem), with a single gold seed at the base
  (gold = ceremony, used once).
*/

export function NovaMark({
  className,
  title = "Logo NOVA",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={cn("h-10 w-10", className)}
    >
      <circle cx="32" cy="32" r="30" fill="#006241" />
      {/* rising stem */}
      <path
        d="M32 50V26"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* arrowhead = growth */}
      <path
        d="M25 31l7-9 7 9"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* left leaf */}
      <path
        d="M30.5 41c-6.5.5-11.5-3.5-12.5-10 6.5-.5 11.5 3.5 12.5 10z"
        fill="#d4e9e2"
      />
      {/* right leaf */}
      <path
        d="M33.5 46c6.5.5 11.5-3.5 12.5-10-6.5-.5-11.5 3.5-12.5 10z"
        fill="#ffffff"
      />
      {/* gold seed */}
      <circle cx="32" cy="52.5" r="2.5" fill="#cba258" />
    </svg>
  );
}

export function NovaLogo({
  className,
  onDark = false,
  compact = false,
}: {
  className?: string;
  onDark?: boolean;
  compact?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <NovaMark className={compact ? "h-8 w-8" : "h-10 w-10"} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-bold tracking-tight",
            compact ? "text-lg" : "text-xl",
            onDark ? "text-snow" : "text-brand"
          )}
        >
          NOVA
        </span>
        <span
          className={cn(
            "text-[0.6rem] font-semibold uppercase tracking-[0.25em]",
            onDark ? "text-snow-soft" : "text-ink-soft"
          )}
        >
          Official
        </span>
      </span>
    </span>
  );
}
