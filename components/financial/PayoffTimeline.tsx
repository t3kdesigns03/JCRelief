"use client";

import { CheckCircle2, Clock, Sparkles } from "lucide-react";
import type { Comparison } from "@/lib/estimator";
import { currency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const DEFAULT_MILESTONES = [12, 24, 36, 48];

type PayoffTimelineProps = {
  comparison: Comparison;
  milestones?: number[];
  className?: string;
};

export function PayoffTimeline({
  comparison,
  milestones = DEFAULT_MILESTONES,
  className,
}: PayoffTimelineProps) {
  const currentMonths = comparison.current.months;
  const planMonths = comparison.proposed.months;
  const maxMonths = Math.max(currentMonths, planMonths, ...milestones, 48);
  const pct = (months: number) =>
    Math.min(100, Math.max(4, (months / maxMonths) * 100));

  const currentPct = pct(currentMonths);
  const planPct = pct(planMonths);

  return (
    <section className={cn("space-y-4 sm:space-y-5", className)}>
      <div>
        <h3 className="font-display text-lg font-semibold tracking-tight">
          Estimated payoff timeline
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Minimum payments vs. your Debt Angel plan — illustrative estimates.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <div className="rounded-2xl border border-white/10 bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0" aria-hidden />
            <span className="text-xs font-medium">Minimum payments</span>
          </div>
          <p className="num-display mt-2 text-2xl font-bold leading-none tabular sm:text-3xl">
            {formatDuration(currentMonths)}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">to become debt-free</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gold/10 p-4 shadow-gold">
          <div className="flex items-center gap-2 text-gold">
            <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
            <span className="text-xs font-semibold">Debt Angel plan</span>
          </div>
          <p className="num-display mt-2 text-2xl font-bold leading-none tabular text-gold sm:text-3xl">
            {formatDuration(planMonths)}
          </p>
          <p className="mt-1 text-[11px] text-gold/80">to become debt-free</p>
        </div>
      </div>

      {/* Bar comparison */}
      <div className="relative space-y-5 rounded-2xl border border-white/10 bg-card p-4 sm:p-5">
        {/* Milestone gridlines */}
        <div className="pointer-events-none absolute inset-4 sm:inset-5" aria-hidden>
          {milestones.map((m) => {
            const left = (m / maxMonths) * 100;
            if (left > 99) return null;
            return (
              <span
                key={m}
                className="absolute inset-y-0 w-px bg-white/[0.07]"
                style={{ left: `${left}%` }}
              />
            );
          })}
        </div>

        <TimelineTrack
          label="Minimum payments"
          widthPct={currentPct}
          barClass="bg-muted-foreground/50"
          endLabel={formatDuration(currentMonths)}
        />
        <TimelineTrack
          label="Debt Angel plan"
          widthPct={planPct}
          barClass="bg-gold-sheen shadow-gold"
          endLabel={formatDuration(planMonths)}
          highlight
        />

        {/* Milestone axis */}
        <div className="relative h-4">
          {milestones.map((m) => {
            const left = (m / maxMonths) * 100;
            if (left > 99) return null;
            return (
              <span
                key={m}
                className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-muted-foreground"
                style={{ left: `${left}%` }}
              >
                {m}mo
              </span>
            );
          })}
        </div>
      </div>

      {/* Savings callout */}
      {comparison.monthsSaved > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-money/25 bg-money/10 px-4 py-3.5">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-money" aria-hidden />
          <div className="text-sm">
            <p className="font-semibold text-money">
              {formatDuration(comparison.monthsSaved)} faster to debt-free
            </p>
            <p className="mt-0.5 text-money/80">
              Estimated cumulative savings of{" "}
              <strong>{currency(comparison.totalSavings)}</strong> (
              {Math.round(comparison.savingsPct * 100)}% of enrolled debt)
            </p>
          </div>
        </div>
      )}

      {/* Milestone chips */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {milestones.map((m) => {
          const debtFree = planMonths <= m;
          return (
            <div
              key={m}
              className={cn(
                "rounded-xl border p-3 text-center",
                debtFree
                  ? "border-money/25 bg-money/10"
                  : "border-white/10 bg-white/[0.03]",
              )}
            >
              <p className="num-display text-lg font-bold tabular">{m}mo</p>
              {debtFree ? (
                <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-money">
                  <CheckCircle2 className="h-3 w-3" aria-hidden /> Debt-free
                </p>
              ) : (
                <p className="mt-0.5 text-[11px] text-muted-foreground">In progress</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TimelineTrack({
  label,
  widthPct,
  barClass,
  endLabel,
  highlight,
}: {
  label: string;
  widthPct: number;
  barClass: string;
  endLabel: string;
  highlight?: boolean;
}) {
  return (
    <div className="relative">
      <div className="mb-2 flex items-baseline justify-between gap-2 text-sm">
        <span className={cn("font-medium", highlight && "text-gold")}>{label}</span>
        <span className="shrink-0 text-xs tabular text-muted-foreground">{endLabel}</span>
      </div>
      <div className="relative h-3.5 overflow-hidden rounded-full bg-white/5">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out",
            barClass,
          )}
          style={{ width: `${widthPct}%` }}
        />
      </div>
    </div>
  );
}

function formatDuration(months: number): string {
  if (months < 12) return `${months} mo`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0) return `${years} yr`;
  return `${years}y ${rem}m`;
}
