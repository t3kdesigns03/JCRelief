"use client";

import * as React from "react";
import { Receipt, Plus, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  expenseCategories,
  type ExpensesInput,
  type ExpenseKey,
} from "@/lib/application-schema";
import { totalEssentialExpenses } from "@/lib/expenses";
import { cn, currency } from "@/lib/utils";

type ExpensesCaptureProps = {
  value: ExpensesInput;
  onChange: (next: ExpensesInput) => void;
  /** Real monthly net income, to show leftover in the live summary. */
  monthlyNetIncome?: number | null;
  className?: string;
};

/**
 * Reusable, controlled essential-expenses input. Optional in the same spirit as
 * income: every field can be left blank. Progressive — collapsed by default
 * until the user opts in, so the step stays low-friction.
 */
export function ExpensesCapture({
  value,
  onChange,
  monthlyNetIncome,
  className,
}: ExpensesCaptureProps) {
  const hasAny = expenseCategories.some(
    (c) => typeof value[c.key as ExpenseKey] === "number",
  );
  const [expanded, setExpanded] = React.useState(hasAny);

  const set = (key: ExpenseKey, raw: string) => {
    const cleaned = raw.replace(/[^0-9.]/g, "");
    const next = { ...value };
    if (cleaned === "") delete next[key];
    else next[key] = Number(cleaned);
    onChange(next);
  };

  const total = totalEssentialExpenses(value);
  const income = monthlyNetIncome ?? null;
  const leftover = income != null ? income - (total ?? 0) : null;

  if (!expanded) {
    return (
      <div
        className={cn(
          "flex flex-col items-start gap-3 rounded-2xl border border-white/10 bg-card px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between",
          className,
        )}
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold ring-1 ring-gold/20">
            <Receipt className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-medium">Add your essential expenses</p>
            <p className="text-[12px] text-muted-foreground">
              Optional — see what&rsquo;s really left for debt each month.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-gold/40 bg-gold/[0.08] px-3 py-2 text-sm font-semibold text-gold transition-colors hover:bg-gold/[0.14]"
        >
          <Plus className="h-4 w-4" /> Add expenses
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-card p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Receipt className="h-4 w-4 shrink-0 text-gold" aria-hidden />
          <p className="text-[15px] font-semibold tracking-tight text-foreground">
            Essential monthly expenses
          </p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="inline-flex items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground"
        >
          <ChevronUp className="h-3.5 w-3.5" /> Hide
        </button>
      </div>
      <p className="mt-1 text-[12px] text-muted-foreground">
        Fill in what you can — leave anything blank. Every field is optional.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {expenseCategories.map((c) => {
          const key = c.key as ExpenseKey;
          const v = value[key];
          return (
            <div key={c.key}>
              <label
                htmlFor={`expense-${c.key}`}
                className="flex items-baseline gap-1.5 text-sm font-medium"
              >
                {c.label}
                {c.hint && (
                  <span className="text-[11px] font-normal text-muted-foreground">
                    {c.hint}
                  </span>
                )}
              </label>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  $
                </span>
                <Input
                  id={`expense-${c.key}`}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="0"
                  className="pl-7"
                  value={typeof v === "number" ? String(v) : ""}
                  onChange={(e) => set(key, e.target.value)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Live summary */}
      <div className="mt-4 rounded-xl border border-gold/25 bg-gold/[0.06] p-4">
        <SummaryRow
          label="Monthly income"
          value={income != null ? currency(income) : "Not added"}
          muted={income == null}
        />
        <SummaryRow
          label="Essential expenses"
          value={`− ${currency(total ?? 0)}`}
        />
        <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-white/10 pt-2.5">
          <span className="text-sm font-semibold">Estimated leftover</span>
          {leftover != null ? (
            <span
              className={cn(
                "num-display text-lg font-bold tabular",
                leftover > 0 ? "text-money" : "text-destructive",
              )}
            >
              {currency(leftover)}
            </span>
          ) : (
            <span className="text-[12px] text-muted-foreground">
              Add income above to see leftover
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-0.5">
      <span className="text-sm text-foreground/70">{label}</span>
      <span
        className={cn(
          "num-display text-sm font-semibold tabular",
          muted ? "text-muted-foreground" : "text-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}
