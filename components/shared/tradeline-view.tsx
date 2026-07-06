"use client";

import * as React from "react";
import {
  CreditCard,
  Landmark,
  Stethoscope,
  Store,
  Wallet,
  Pencil,
  Trash2,
  CalendarDays,
} from "lucide-react";
import {
  summarizePortfolio,
  tradelineMetrics,
  utilizationBand,
  type Tradeline,
} from "@/lib/estimator";
import { currency, percent } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TYPE_META: Record<
  Tradeline["type"],
  { label: string; icon: React.ReactNode }
> = {
  "credit-card": { label: "Credit card", icon: <CreditCard className="h-4 w-4" /> },
  "retail-card": { label: "Retail card", icon: <Store className="h-4 w-4" /> },
  "personal-loan": { label: "Personal loan", icon: <Landmark className="h-4 w-4" /> },
  medical: { label: "Medical", icon: <Stethoscope className="h-4 w-4" /> },
  other: { label: "Other", icon: <Wallet className="h-4 w-4" /> },
};

const STATUS_META: Record<
  Tradeline["status"],
  { label: string; cls: string }
> = {
  current: { label: "Current", cls: "bg-money/15 text-money ring-1 ring-money/25" },
  "past-due": { label: "Past due", cls: "bg-gold/15 text-gold ring-1 ring-gold/25" },
  collections: {
    label: "Collections",
    cls: "bg-destructive/15 text-destructive ring-1 ring-destructive/30",
  },
};

const BAND_CLS = {
  good: { bar: "bg-money-sheen", text: "text-money" },
  watch: { bar: "bg-gold-sheen", text: "text-gold" },
  high: { bar: "bg-destructive", text: "text-destructive" },
} as const;

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
      {/* Portfolio summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total balance" value={currency(summary.totalBalance)} accent="ink" />
        <Stat
          label="Utilization"
          value={percent(summary.overallUtilizationPct)}
          accent={summary.overallUtilizationPct > 60 ? "danger" : "gold"}
          sub="revolving"
        />
        <Stat
          label="Blended APR"
          value={percent(summary.weightedApr, 1)}
          accent="gold"
        />
        <Stat
          label="Interest / mo"
          value={currency(summary.totalMonthlyInterest)}
          accent="danger"
          sub="bleeding now"
        />
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {summary.count} account{summary.count === 1 ? "" : "s"} · You see exactly
        what each one costs you and how it weighs on your debt-to-income.
      </p>

      {/* Cards */}
      <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {tradelines.map((tl) => {
          const m = tradelineMetrics(tl, summary.totalBalance);
          const band = utilizationBand(m.utilizationPct);
          const type = TYPE_META[tl.type];
          const status = STATUS_META[tl.status];
          return (
            <div
              key={tl.id}
              className="rounded-2xl border border-white/10 bg-card p-4 shadow-soft transition-all hover:border-gold/25 hover:shadow-lift sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground/70">
                    {type.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{tl.creditor}</span>
                    <span className="block text-xs text-muted-foreground">
                      {type.label}
                    </span>
                  </span>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                    status.cls,
                  )}
                >
                  {status.label}
                </span>
              </div>

              {/* Balance */}
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <span className="block text-xs text-muted-foreground">Balance</span>
                  <span className="num-display text-2xl font-bold">
                    {currency(tl.balance)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-muted-foreground">APR</span>
                  <span className="num-display text-base font-semibold text-destructive">
                    {percent(tl.apr, 2)}
                  </span>
                </div>
              </div>

              {/* Utilization (revolving only) */}
              {m.isRevolving && tl.limit ? (
                <div className="mt-3">
                  <div className="mb-1 flex items-baseline justify-between text-xs">
                    <span className="text-muted-foreground">
                      Utilization · limit {currency(tl.limit)}
                    </span>
                    <span className={cn("font-semibold", BAND_CLS[band].text)}>
                      {percent(m.utilizationPct)}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn("h-full rounded-full", BAND_CLS[band].bar)}
                      style={{ width: `${Math.min(m.utilizationPct, 100)}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-3 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                  {tl.type === "medical"
                    ? "Medical balance — typically no revolving utilization."
                    : "Installment balance — no revolving utilization."}
                </div>
              )}

              {/* Footer metrics */}
              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-xs">
                <Mini label="Min / mo" value={currency(tl.minPayment)} />
                <Mini label="Interest / mo" value={currency(m.monthlyInterest)} />
                <Mini label="Debt share" value={percent(m.balancePctOfTotal)} />
              </div>

              {(tl.opened || onEdit || onRemove) && (
                <div className="mt-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {tl.opened ? (
                      <>
                        <CalendarDays className="h-3.5 w-3.5" />
                        Opened {formatOpened(tl.opened)}
                      </>
                    ) : (
                      <span />
                    )}
                  </span>
                  {(onEdit || onRemove) && (
                    <span className="flex items-center gap-1">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(tl.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          aria-label={`Edit ${tl.creditor}`}
                        >
                          <Pencil className="h-[18px] w-[18px]" />
                        </button>
                      )}
                      {onRemove && (
                        <button
                          type="button"
                          onClick={() => onRemove(tl.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Remove ${tl.creditor}`}
                        >
                          <Trash2 className="h-[18px] w-[18px]" />
                        </button>
                      )}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent: "ink" | "gold" | "danger";
}) {
  const color =
    accent === "gold"
      ? "text-gold"
      : accent === "danger"
        ? "text-destructive"
        : "text-foreground";
  return (
    <div className="rounded-2xl border border-white/10 bg-card px-3 py-3 shadow-soft">
      <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className={cn("num-display block text-lg font-bold tabular", color)}>
        {value}
      </span>
      {sub && <span className="block text-[10px] text-muted-foreground">{sub}</span>}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="num-display block font-semibold tabular">{value}</span>
    </div>
  );
}

function formatOpened(iso: string): string {
  // iso "YYYY-MM"
  const [y, m] = iso.split("-");
  if (!y) return iso;
  if (!m) return y;
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const mi = parseInt(m, 10) - 1;
  return `${months[mi] ?? m} ${y}`;
}
