import { Info } from "lucide-react";
import { ESTIMATOR_ASSUMPTIONS } from "@/lib/estimator";
import { disclaimers } from "@/lib/site";
import { cn } from "@/lib/utils";

type AssumptionsProps = {
  /** Show the full disclaimer paragraph below the bullet list. */
  showDisclaimer?: boolean;
  /** Compact single-line variant for tight layouts. */
  variant?: "default" | "compact";
  className?: string;
};

/**
 * Centralized disclosure of example assumptions used in estimates.
 * Every surface that shows projected numbers should include this component.
 */
export function Assumptions({
  showDisclaimer = true,
  variant = "default",
  className,
}: AssumptionsProps) {
  const {
    settlementRangeLabel,
    exampleFeePct,
    feeLowPct,
    feeHighPct,
    assumedAprPct,
    minPaymentRatePct,
  } = ESTIMATOR_ASSUMPTIONS;

  if (variant === "compact") {
    return (
      <p className={cn("text-[11px] leading-relaxed text-muted-foreground", className)}>
        Example assumptions: {settlementRangeLabel} settlement range,{" "}
        {Math.round(exampleFeePct * 100)}% example fee (range{" "}
        {Math.round(feeLowPct * 100)}–{Math.round(feeHighPct * 100)}%). Not an
        offer or guarantee.
      </p>
    );
  }

  return (
    <aside
      className={cn(
        "rounded-2xl border border-white/10 bg-muted/40 px-4 py-3 text-sm",
        className,
      )}
      aria-label="Example assumptions and disclaimers"
    >
      <p className="flex items-center gap-2 font-semibold text-foreground/80">
        <Info className="h-4 w-4 shrink-0 text-gold" aria-hidden />
        Example assumptions — not an offer
      </p>
      <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-muted-foreground">
        <li>
          <strong className="font-medium text-foreground/70">
            Settlement range (example):
          </strong>{" "}
          {settlementRangeLabel} of enrolled balances — illustrative until we
          substantiate outcomes with real program data.
        </li>
        <li>
          <strong className="font-medium text-foreground/70">
            Performance fee (example):
          </strong>{" "}
          {Math.round(exampleFeePct * 100)}% of enrolled debt shown as a
          midpoint example; our model uses a {Math.round(feeLowPct * 100)}–
          {Math.round(feeHighPct * 100)}% range for projections.
        </li>
        <li>
          <strong className="font-medium text-foreground/70">
            Current-path model:
          </strong>{" "}
          ~{minPaymentRatePct}% minimum payments at ~{assumedAprPct.toFixed(1)}%
          APR — a typical revolving baseline, not your exact creditor terms.
        </li>
      </ul>
      {showDisclaimer && (
        <p className="mt-3 border-t border-white/10 pt-3 text-[11px] leading-relaxed text-muted-foreground">
          {disclaimers.estimator}
        </p>
      )}
    </aside>
  );
}

/** @deprecated Use `<Assumptions />` — kept for backward compatibility. */
export const AssumptionsNote = Assumptions;
