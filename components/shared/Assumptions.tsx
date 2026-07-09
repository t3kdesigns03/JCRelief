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
        "rounded-2xl border border-gold/25 bg-gold/[0.06] px-4 py-4 text-sm",
        className,
      )}
      aria-label="How these numbers work and example assumptions"
    >
      <p className="flex items-center gap-2 font-semibold text-foreground/90">
        <Info className="h-4 w-4 shrink-0 text-gold" aria-hidden />
        How these numbers work
      </p>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-foreground/75">
        <li>
          The &ldquo;current path&rdquo; assumes you continue making only minimum
          payments with no new charges.
        </li>
        <li>
          The Debt Angel estimate assumes typical settlement ranges (example:
          40&ndash;60%) and a performance fee (example range: 18&ndash;25%).
        </li>
        <li>
          These are illustrative only and not a guarantee of what you will pay or
          how long it will take.
        </li>
        <li>
          Actual results vary significantly based on your creditors, your specific
          situation, and consistent funding of the plan.
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
