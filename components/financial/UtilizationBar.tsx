"use client";

import { utilizationBand } from "@/lib/estimator";
import { currency, percent } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { UTILIZATION_BAND_STYLES } from "@/components/financial/tradeline-meta";

type UtilizationBarProps = {
  utilizationPct: number;
  limit?: number;
  limitLabel?: string;
  className?: string;
};

const BAND_LABEL: Record<"good" | "watch" | "high", string> = {
  good: "Healthy",
  watch: "Elevated",
  high: "High",
};

export function UtilizationBar({
  utilizationPct,
  limit,
  limitLabel,
  className,
}: UtilizationBarProps) {
  const band = utilizationBand(utilizationPct);
  const styles = UTILIZATION_BAND_STYLES[band];
  const width = Math.min(Math.max(utilizationPct, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1.5 flex items-baseline justify-between gap-2 text-xs">
        <span className="min-w-0 truncate text-muted-foreground">
          Utilization
          {limitLabel ?? (limit ? ` · limit ${currency(limit)}` : "")}
        </span>
        <span className={cn("shrink-0 font-semibold tabular", styles.text)}>
          {percent(utilizationPct, 0)}
          <span className="ml-1 font-medium opacity-80">· {BAND_LABEL[band]}</span>
        </span>
      </div>
      <div
        className={cn(
          "relative h-3 w-full overflow-hidden rounded-full",
          styles.track,
        )}
      >
        {/* Threshold ticks at 30% and 60% */}
        <span className="absolute inset-y-0 left-[30%] w-px bg-white/15" aria-hidden />
        <span className="absolute inset-y-0 left-[60%] w-px bg-white/15" aria-hidden />
        <div
          className={cn(
            "relative h-full rounded-full transition-all duration-500 ease-out",
            styles.bar,
          )}
          style={{ width: `${width}%` }}
          role="progressbar"
          aria-valuenow={Math.round(utilizationPct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Utilization ${percent(utilizationPct, 0)}`}
        />
      </div>
    </div>
  );
}
