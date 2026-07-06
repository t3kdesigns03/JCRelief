"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ComparisonView } from "@/components/shared/comparison-view";
import { Assumptions } from "@/components/shared/Assumptions";
import { estimate, buildComparison } from "@/lib/estimator";
import { buildApplyUrl } from "@/lib/apply-prefill";
import { currency, monthsToLabel } from "@/lib/utils";

/**
 * Debt Freedom Estimator — live sliders feed the visual comparison.
 * Fully client-side; nothing is stored. Mobile-first layout.
 */
export function Estimator({ compact = false }: { compact?: boolean }) {
  const [totalDebt, setTotalDebt] = React.useState(28000);
  const [monthlyBudget, setMonthlyBudget] = React.useState(520);

  // Current minimums approximated at ~2.5% of balance (typical revolving).
  const currentMonthlyPayment = Math.round(totalDebt * 0.025);

  const result = React.useMemo(
    () =>
      estimate({
        totalDebt,
        currentMonthlyPayment,
        monthlyBudget,
      }),
    [totalDebt, currentMonthlyPayment, monthlyBudget],
  );

  const comparison = React.useMemo(
    () => buildComparison({ totalDebt, currentMonthlyPayment, monthlyBudget }, result),
    [totalDebt, currentMonthlyPayment, monthlyBudget, result],
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
      {/* Controls */}
      <div className="rounded-3xl border border-white/10 bg-card p-6 shadow-soft sm:p-8">
        <span className="eyebrow">
          <Sparkles className="h-3.5 w-3.5" /> Debt Freedom Estimator
        </span>
        <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">
          See your path to Debt Zero
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Move the sliders. Watch your plan update live.
        </p>

        <div className="mt-6 space-y-7">
          <Field
            label="How much unsecured debt?"
            value={currency(totalDebt)}
          >
            <Slider
              value={[totalDebt]}
              min={5000}
              max={150000}
              step={1000}
              onValueChange={([v]) => setTotalDebt(v)}
              aria-label="Total unsecured debt"
            />
          </Field>

          <Field
            label="Comfortable monthly amount"
            value={`${currency(monthlyBudget)}/mo`}
          >
            <Slider
              value={[monthlyBudget]}
              min={150}
              max={3000}
              step={10}
              onValueChange={([v]) => setMonthlyBudget(v)}
              aria-label="Comfortable monthly budget"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Fit:{" "}
              <span className="font-semibold capitalize text-foreground">
                {result.budgetFit}
              </span>{" "}
              · Suggested deposit {currency(result.suggestedMonthly)}/mo · Est.{" "}
              {monthsToLabel(Math.round((result.monthsLow + result.monthsHigh) / 2))} to
              zero
            </p>
          </Field>
        </div>

        {!compact && (
          <div className="mt-7">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href={buildApplyUrl(totalDebt, monthlyBudget)}>
                Build my full plan <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Assumptions className="mt-3" variant="compact" showDisclaimer={false} />
          </div>
        )}
      </div>

      {/* Live comparison */}
      <div>
        <ComparisonView comparison={comparison} />
        <Assumptions className="mt-4" />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <label className="text-sm font-medium">{label}</label>
        <span className="num-display text-lg font-bold text-gold tabular">
          {value}
        </span>
      </div>
      {children}
    </div>
  );
}
