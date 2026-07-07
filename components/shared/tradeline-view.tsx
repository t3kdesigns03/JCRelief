"use client";

import { summarizePortfolio, type Tradeline } from "@/lib/estimator";
import { TradelineCard } from "@/components/financial/TradelineCard";
import { PortfolioSummary } from "@/components/financial/PortfolioSummary";
import { cn } from "@/lib/utils";

export function TradelineView({
  tradelines,
  onEdit,
  onRemove,
  className,
}: {
  tradelines: Tradeline[];
  onEdit?: (id: string) => void;
  onRemove?: (id: string) => void;
  className?: string;
}) {
  const summary = summarizePortfolio(tradelines);

  return (
    <div className={cn("w-full", className)}>
      <PortfolioSummary tradelines={tradelines} />

      <p className="mt-3 text-xs text-muted-foreground">
        {summary.count} account{summary.count === 1 ? "" : "s"} · You see exactly
        what each one costs you and how it weighs on your debt-to-income.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {tradelines.map((tl) => (
          <TradelineCard
            key={tl.id}
            tradeline={tl}
            totalBalance={summary.totalBalance}
            onEdit={onEdit}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}
