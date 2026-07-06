import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Debt Angel brandmark — a gold winged dollar sign inside a halo ring, echoing
 * the winged-$ emblem. Pure inline SVG so it stays crisp at any size.
 * Wide aspect (~1.65:1): size it with height + `w-auto`.
 */
const FEATHER = "M0 0 C-2.6 -5 -2.6 -13 0 -18 C2.6 -13 2.6 -5 0 0 Z";

// [rotateDeg, scaleX, scaleY] per feather, innermost → outermost.
const FEATHERS: [number, number, number][] = [
  [-8, 0.85, 0.82],
  [-26, 0.95, 1.08],
  [-44, 1.0, 1.28],
  [-62, 0.96, 1.18],
  [-80, 0.86, 0.98],
  [-96, 0.7, 0.76],
];

export function LogoMark({
  className,
  title = "Debt Angel",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 104 64"
      role="img"
      aria-label={title}
      className={cn("h-10 w-auto", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="da-gold" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#F7EDCC" />
          <stop offset="42%" stopColor="#E7C64E" />
          <stop offset="72%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B8901F" />
        </linearGradient>
        <linearGradient id="da-gold-soft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBF3D6" />
          <stop offset="55%" stopColor="#E7C64E" />
          <stop offset="100%" stopColor="#C9A227" />
        </linearGradient>
        <radialGradient id="da-glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#E7C64E" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#E7C64E" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft glow */}
      <ellipse cx="52" cy="31" rx="40" ry="26" fill="url(#da-glow)" />

      {/* Left wing */}
      <g transform="translate(41 33)" fill="url(#da-gold)">
        {FEATHERS.map(([r, sx, sy], i) => (
          <path key={`l${i}`} d={FEATHER} transform={`rotate(${r}) scale(${sx} ${sy})`} />
        ))}
      </g>
      {/* Right wing (mirrored) */}
      <g transform="translate(63 33) scale(-1 1)" fill="url(#da-gold)">
        {FEATHERS.map(([r, sx, sy], i) => (
          <path key={`r${i}`} d={FEATHER} transform={`rotate(${r}) scale(${sx} ${sy})`} />
        ))}
      </g>

      {/* Halo ring */}
      <circle cx="52" cy="33" r="14" fill="#0B0B0B" stroke="url(#da-gold)" strokeWidth="2.6" />
      <circle cx="52" cy="33" r="11" fill="none" stroke="url(#da-gold-soft)" strokeWidth="1" opacity="0.8" />

      {/* Dollar sign */}
      <text
        x="52"
        y="34.5"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        fontSize="20"
        fill="url(#da-gold-soft)"
      >
        $
      </text>
    </svg>
  );
}

const SIZES = {
  sm: { gap: "gap-2", mark: "h-9 w-auto", text: "text-base" },
  md: { gap: "gap-2.5", mark: "h-11 w-auto", text: "text-xl" },
  lg: { gap: "gap-3", mark: "h-14 w-auto sm:h-[4.25rem]", text: "text-2xl sm:text-[1.9rem]" },
} as const;

export function Wordmark({
  className,
  markClassName,
  compact = false,
  size = "md",
}: {
  className?: string;
  markClassName?: string;
  compact?: boolean;
  size?: keyof typeof SIZES;
}) {
  const s = SIZES[size];
  return (
    <span className={cn("inline-flex items-center", s.gap, className)}>
      <LogoMark className={cn(s.mark, markClassName)} />
      {!compact && (
        <span className={cn("font-display font-bold tracking-tight leading-none", s.text)}>
          <span className="text-gradient-gold">Debt</span>
          <span className="text-foreground">Angel</span>
        </span>
      )}
    </span>
  );
}
