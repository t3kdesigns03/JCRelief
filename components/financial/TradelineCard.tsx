"use client";

import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import { tradelineMetrics, type Tradeline } from "@/lib/estimator";
import { currency, percent } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { UtilizationBar } from "@/components/financial/UtilizationBar";
import {
  TRADELINE_STATUS_META,
  TRADELINE_TYPE_META,
  formatOpened,
} from "@/components/financial/tradeline-meta";
import { Button } from "@/components/ui/button";

type TradelineCardProps = {
  tradeline: Tradeline;
  totalBalance: number;
  onEdit?: (id: string) => void;
  onRemove?: (id: string) => void;
  className?: string;
};

export function TradelineCard({
  tradeline: tl,
  totalBalance,
  onEdit,
  onRemove,
  className,
}: TradelineCardProps) {
  const metrics = tradelineMetrics(tl, totalBalance);
  const type = TRADELINE_TYPE_META[tl.type];
  const status = TRADELINE_STATUS_META[tl.status];
  const TypeIcon = type.Icon;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-card p-4 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/30 hover:shadow-lift sm:p-5",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gold/10 text-gold ring-1 ring-gold/20">
            <TypeIcon className="h-[22px] w-[22px]" aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-display text-lg font-semibold leading-tight tracking-tight">
              {tl.creditor}
            </h3>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {type.label}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
            status.className,
          )}
        >
          {status.label}
        </span>
      </div>

      {/* Balance + APR */}
      <div className="mt-4 flex items-end justify-between gap-3 sm:mt-5">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Current balance
          </p>
          <p className="num-display mt-1 truncate text-[2rem] font-bold leading-none tabular sm:text-4xl">
            {currency(tl.balance)}
          </p>
        </div>
        <div className="shrink-0 rounded-2xl border border-destructive/25 bg-destructive/10 px-3 py-2 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-destructive/80">
            APR
          </p>
          <p className="num-display mt-0.5 text-lg font-bold leading-none tabular text-destructive sm:text-xl">
            {percent(tl.apr, 2)}
          </p>
        </div>
      </div>

      {/* Utilization */}
      <div className="mt-4 sm:mt-5">
        {metrics.isRevolving && tl.limit ? (
          <UtilizationBar
            utilizationPct={metrics.utilizationPct}
            limitLabel={`limit ${currency(tl.limit)}`}
          />
        ) : (
          <div className="rounded-xl border border-white/10 bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
            {tl.type === "medical"
              ? "Installment / medical — no revolving utilization."
              : "Installment balance — no revolving utilization."}
          </div>
        )}
      </div>

      {/* Mini stats */}
      <dl className="mt-4 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-black/20 sm:mt-5">
        <MiniStat label="Min / mo" value={currency(tl.minPayment)} />
        <MiniStat
          label="Interest / mo"
          value={currency(metrics.monthlyInterest)}
          accent="danger"
        />
        <MiniStat
          label="Debt share"
          value={percent(metrics.balancePctOfTotal, 0)}
          accent="gold"
        />
      </dl>

      {/* Footer */}
      <div className="mt-auto flex flex-col gap-3 pt-4">
        {tl.opened && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden />
            Opened {formatOpened(tl.opened)}
          </p>
        )}
        {(onEdit || onRemove) && (
          <div className="flex gap-2 border-t border-white/10 pt-3">
            {onEdit && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onEdit(tl.id)}
                className="h-11 flex-1"
              >
                <Pencil className="h-4 w-4" /> Edit
              </Button>
            )}
            {onRemove && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(tl.id)}
                className="h-11 flex-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" /> Remove
              </Button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function MiniStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "gold" | "danger";
}) {
  return (
    <div className="px-2.5 py-3 text-center">
      <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd
        className={cn(
          "num-display mt-1 text-sm font-semibold tabular",
          accent === "gold" && "text-gold",
          accent === "danger" && "text-destructive",
          !accent && "text-foreground",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
