"use client";

import { Minus, TrendingDown, Wallet } from "lucide-react";
import { buildCashFlowSnapshot } from "@/lib/cash-flow";
import { currency, percent } from "@/lib/utils";
import { cn } from "@/lib/utils";

type CashFlowSummaryProps = {
  currentMonthlyPayment: number;
  monthlyBudget: number;
  planSuggestedMonthly?: number;
  className?: string;
};

export function CashFlowSummary({
  currentMonthlyPayment,
  monthlyBudget,
  planSuggestedMonthly,
  className,
}: CashFlowSummaryProps) {
  const flow = buildCashFlowSnapshot({
    currentMonthlyPayment,
    monthlyBudget,
    planSuggestedMonthly,
  });

  const income = flow.estimatedMonthlyIncome || 1;
  const deductions = [
    {
      key: "hard",
      label: "Hard costs",
      sub: "Housing, utilities, insurance",
      value: flow.hardCosts,
    },
    {
      key: "soft",
      label: "Soft costs",
      sub: "Food, transport, essentials",
      value: flow.softCosts,
    },
    {
      key: "debt",
      label: "Debt payments",
      sub: "Current minimums",
      value: flow.currentDebtPayments,
      danger: true,
    },
  ];

  const dtiBand =
    flow.dtiCurrentPct <= 20 ? "good" : flow.dtiCurrentPct <= 36 ? "watch" : "high";
  const dtiStyles = {
    good: { bar: "bg-money-sheen", text: "text-money", ring: "ring-money/30" },
    watch: { bar: "bg-gold-sheen", text: "text-gold", ring: "ring-gold/30" },
    high: { bar: "bg-destructive", text: "text-destructive", ring: "ring-destructive/30" },
  }[dtiBand];

  return (
    <section className={cn("space-y-4 sm:space-y-5", className)}>
      <div>
        <h3 className="font-display text-lg font-semibold tracking-tight">
          Monthly cash flow
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Illustrative breakdown from your inputs — not verified income.
        </p>
      </div>

      {/* Waterfall */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-card">
        {/* Income */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-gold/10 px-4 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/20 text-gold ring-1 ring-gold/25">
              <Wallet className="h-[18px] w-[18px]" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-gold">Est. monthly income</p>
              <p className="text-[11px] text-muted-foreground">Starting point</p>
            </div>
          </div>
          <p className="num-display text-xl font-bold tabular text-gold sm:text-2xl">
            {currency(flow.estimatedMonthlyIncome)}
          </p>
        </div>

        {/* Deductions */}
        {deductions.map((d) => {
          const pct = Math.min(100, (d.value / income) * 100);
          return (
            <div
              key={d.key}
              className="border-b border-white/5 px-4 py-3 last:border-b-0"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5 text-muted-foreground">
                    <Minus className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{d.label}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{d.sub}</p>
                  </div>
                </div>
                <p
                  className={cn(
                    "num-display shrink-0 text-base font-semibold tabular",
                    d.danger ? "text-destructive" : "text-foreground",
                  )}
                >
                  −{currency(d.value)}
                </p>
              </div>
              <div className="mt-2 ml-8 h-1.5 overflow-hidden rounded-full bg-white/5">
                <div
                  className={cn(
                    "h-full rounded-full",
                    d.danger ? "bg-destructive/70" : "bg-white/25",
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}

        {/* Disposable result */}
        <div className="flex items-center justify-between gap-3 border-t border-money/20 bg-money/10 px-4 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-money/20 text-money ring-1 ring-money/25">
              <TrendingDown className="h-[18px] w-[18px]" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-money">Disposable income</p>
              <p className="text-[11px] text-money/70">What&rsquo;s left each month</p>
            </div>
          </div>
          <p className="num-display text-xl font-bold tabular text-money sm:text-2xl">
            {currency(flow.disposableIncome)}
          </p>
        </div>
      </div>

      {/* DTI + plan impact */}
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <div className={cn("rounded-2xl border border-white/10 bg-card p-4 ring-1", dtiStyles.ring)}>
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-sm font-medium">Debt-to-income</p>
            <p className={cn("num-display text-2xl font-bold tabular", dtiStyles.text)}>
              {percent(flow.dtiCurrentPct, 1)}
            </p>
          </div>
          <div className="relative mt-3 h-2.5 overflow-hidden rounded-full bg-white/5">
            <span className="absolute inset-y-0 left-[36%] w-px bg-white/20" aria-hidden />
            <div
              className={cn("h-full rounded-full transition-all", dtiStyles.bar)}
              style={{ width: `${Math.min(flow.dtiCurrentPct, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Lenders often prefer under 36%. Plan target:{" "}
            <span className="font-semibold text-money">
              {percent(flow.dtiPlanPct, 1)}
            </span>
          </p>
        </div>

        <div className="rounded-2xl border border-money/25 bg-money/10 p-4">
          <p className="text-sm font-medium text-money">Plan monthly impact</p>
          <p className="num-display mt-1 text-2xl font-bold tabular text-money sm:text-3xl">
            {currency(flow.planDeposit)}
            <span className="text-sm font-normal text-money/80">/mo</span>
          </p>
          {flow.monthlyRelief > 0 ? (
            <p className="mt-2 text-xs text-money/80">
              Up to{" "}
              <span className="font-semibold">{currency(flow.monthlyRelief)}/mo</span>{" "}
              relief vs. current payments
            </p>
          ) : (
            <p className="mt-2 text-xs text-money/80">
              Directs your budget toward becoming debt-free
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
