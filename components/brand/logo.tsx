import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Debt Angel coin mark — a gold ring with a serif "$".
 * Clean geometric emblem that reads premium at any size (no wings, so it never
 * turns into a "bat" silhouette). Swap for a transparent winged-$ PNG later if
 * you have one: drop it at /public/images/logo/emblem.png and use an <img>.
 */
export function CoinMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Debt Angel"
      className={cn("h-10 w-10", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="da-coin" x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#F7EDCC" />
          <stop offset="45%" stopColor="#E7C64E" />
          <stop offset="100%" stopColor="#C9A227" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="#0B0B0B" stroke="url(#da-coin)" strokeWidth="3" />
      <circle cx="24" cy="24" r="17.5" fill="none" stroke="url(#da-coin)" strokeWidth="1.2" opacity="0.7" />
      <text
        x="24"
        y="25.5"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        fontSize="27"
        fill="url(#da-coin)"
      >
        $
      </text>
    </svg>
  );
}

const SIZES = {
  sm: { text: "text-lg", mark: "h-7 w-7" },
  md: { text: "text-xl", mark: "h-9 w-9" },
  lg: { text: "text-2xl sm:text-3xl", mark: "h-11 w-11 sm:h-12 sm:w-12" },
} as const;

export function Wordmark({
  className,
  size = "md",
  withMark = false,
}: {
  className?: string;
  size?: keyof typeof SIZES;
  withMark?: boolean;
}) {
  const s = SIZES[size];
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {withMark && <CoinMark className={s.mark} />}
      <span
        className={cn(
          "font-display font-bold tracking-tight leading-none",
          s.text,
        )}
      >
        <span className="text-gradient-gold">Debt</span>
        <span className="text-foreground">Angel</span>
      </span>
    </span>
  );
}
