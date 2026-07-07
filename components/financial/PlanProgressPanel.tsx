"use client";

import type { Comparison } from "@/lib/estimator";
import { CashFlowSummary } from "@/components/financial/CashFlowSummary";
import { PayoffTimeline } from "@/components/financial/PayoffTimeline";
import { cn } from "@/lib/utils";

type PlanProgressPanelProps = {
  comparison: Comparison;
  currentMonthlyPayment: number;
  monthlyBudget: number;
  className?: string;
};

/** Combined cash-flow + payoff visuals for comparison and dashboard views. */
export function PlanProgressPanel({
  comparison,
  currentMonthlyPayment,
  monthlyBudget,
  className,
}: PlanProgressPanelProps) {
  return (
    <div className={cn("space-y-8", className)}>
      <CashFlowSummary
        currentMonthlyPayment={currentMonthlyPayment}
        monthlyBudget={monthlyBudget}
        planSuggestedMonthly={comparison.proposed.monthlyPayment}
      />
      <PayoffTimeline comparison={comparison} />
    </div>
  );
}
