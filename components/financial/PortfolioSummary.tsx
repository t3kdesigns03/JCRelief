"use client";

import { summarizePortfolio, type Tradeline } from "@/lib/estimator";
import { currency, percent } from "@/lib/utils";
import { cn } from "@/lib/utils";

type PortfolioSummaryProps = {
  tradelines: Tradeline[];
  className?: string;
};

export function PortfolioSummary({ tradelines, className }: PortfolioSummaryProps) {
  const summary = summarizePortfolio(tradelines);
  const util = summary.overallUtilizationPct;
  const hasRevolving = summary.totalLimit > 0;

  return (
    <div className={cn("grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4", className)}>
      <SummaryTile
        label="Total balance"
        value={currency(summary.totalBalance)}
        accent="gold"
      />
      <SummaryTile
        label="Monthly minimums"
        value={currency(summary.totalMinPayment)}
      />
      <SummaryTile
        label="Interest / mo"
        value={currency(summary.totalMonthlyInterest)}
        accent="danger"
        sub="bleeding now"
      />
      <SummaryTile
        label={hasRevolving ? "Avg utilization" : "Blended APR"}
        value={hasRevolving ? percent(util, 0) : percent(summary.weightedApr, 1)}
        sub={
          hasRevolving
            ? util <= 30
              ? "Healthy range"
              : util <= 60
                ? "Watch range"
                : "High utilization"
            : `${summary.count} account${summary.count === 1 ? "" : "s"}`
        }
        accent={hasRevolving && util > 60 ? "danger" : hasRevolving ? "gold" : undefined}
      />
    </div>
  );
}

function SummaryTile({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "gold" | "danger";
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-muted/30 p-3.5 sm:p-4">
      <span
        className={cn(
          "absolute inset-y-0 left-0 w-1",
          accent === "gold" && "bg-gold/60",
          accent === "danger" && "bg-destructive/60",
          !accent && "bg-white/10",
        )}
        aria-hidden
      />
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground sm:text-[11px] sm:tracking-[0.12em]">
        {label}
      </p>
      <p
        className={cn(
          "num-display mt-1 text-xl font-bold leading-tight tabular sm:text-2xl",
          accent === "gold" && "text-gold",
          accent === "danger" && "text-destructive",
        )}
      >
        {value}
      </p>
      {sub && <p className="mt-0.5 text-[11px] text-muted-foreground sm:text-xs">{sub}</p>}
    </div>
  );
}
