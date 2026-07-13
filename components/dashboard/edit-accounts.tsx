"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TradelineView } from "@/components/shared/tradeline-view";
import { ComparisonView } from "@/components/shared/comparison-view";
import { PlanProgressPanel } from "@/components/financial/PlanProgressPanel";
import { CashFlowSummary } from "@/components/financial/CashFlowSummary";
import { IncomeCapture } from "@/components/financial/IncomeCapture";
import { ExpensesCapture } from "@/components/financial/ExpensesCapture";
import { Assumptions } from "@/components/shared/Assumptions";
import { TradelineForm, AddAccountButton } from "@/components/application/tradeline-form";
import { estimate, buildComparison, type Tradeline } from "@/lib/estimator";
import { updateApplication } from "@/lib/actions/update-application";
import { monthlyNetIncome } from "@/lib/income";
import { totalEssentialExpenses } from "@/lib/expenses";
import type { IncomeInput, ExpensesInput } from "@/lib/application-schema";
import { currency } from "@/lib/utils";

type EditAccountsProps = {
  applicationId: string;
  initialTradelines: Tradeline[];
  initialCurrentMonthlyPayment: number;
  initialMonthlyBudget: number;
  initialIncome: IncomeInput;
  initialExpenses: ExpensesInput;
};

export function EditAccounts({
  applicationId,
  initialTradelines,
  initialCurrentMonthlyPayment,
  initialMonthlyBudget,
  initialIncome,
  initialExpenses,
}: EditAccountsProps) {
  const router = useRouter();
  const [tradelines, setTradelines] = React.useState<Tradeline[]>(initialTradelines);
  const [currentMonthlyPayment, setCurrentMonthlyPayment] = React.useState(
    initialCurrentMonthlyPayment,
  );
  const [monthlyBudget, setMonthlyBudget] = React.useState(initialMonthlyBudget);
  const [income, setIncome] = React.useState<IncomeInput>(initialIncome);
  const [expenses, setExpenses] = React.useState<ExpensesInput>(initialExpenses);
  const netIncome = monthlyNetIncome(income);
  const expensesTotal = totalEssentialExpenses(expenses);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [showAdd, setShowAdd] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const editing = tradelines.find((t) => t.id === editingId) ?? null;

  const addTradeline = (tl: Tradeline) => {
    setTradelines((prev) => [...prev, tl]);
    setShowAdd(false);
  };
  const updateTradeline = (id: string, tl: Tradeline) => {
    setTradelines((prev) => prev.map((t) => (t.id === id ? { ...tl, id } : t)));
    setEditingId(null);
  };
  const removeTradeline = (id: string) => {
    setTradelines((prev) => prev.filter((t) => t.id !== id));
  };

  const totalDebt = tradelines.reduce((a, t) => a + (t.balance || 0), 0);
  const minSum = tradelines.reduce((a, t) => a + (t.minPayment || 0), 0);
  const comparison =
    tradelines.length > 0
      ? (() => {
          const inputs = {
            totalDebt,
            currentMonthlyPayment: currentMonthlyPayment || minSum,
            monthlyBudget: monthlyBudget || Math.max(minSum * 0.7, 150),
          };
          return buildComparison(inputs, estimate(inputs));
        })()
      : null;

  const onSave = async () => {
    setError(null);
    if (tradelines.length === 0) {
      setError("Add at least one account before saving.");
      return;
    }
    setSaving(true);
    const result = await updateApplication({
      applicationId,
      tradelines,
      currentMonthlyPayment: Number(currentMonthlyPayment) || 0,
      monthlyBudget: Number(monthlyBudget) || 0,
      income,
      essentialExpenses: expenses,
    });
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(`/dashboard/${applicationId}`);
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {/* Accounts editor */}
      <section className="rounded-3xl border border-white/10 bg-card p-5 shadow-soft sm:p-7">
        <h2 className="font-display text-xl font-semibold">Your accounts</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add, edit, or remove accounts. Your plan updates live below.
        </p>

        {tradelines.length > 0 && (
          <div className="mt-5">
            <TradelineView
              tradelines={tradelines}
              onEdit={setEditingId}
              onRemove={removeTradeline}
            />
          </div>
        )}

        <div className="mt-5">
          {editing ? (
            <TradelineForm
              initial={editing}
              onSave={(tl) => updateTradeline(editing.id, tl)}
              onCancel={() => setEditingId(null)}
            />
          ) : showAdd ? (
            <TradelineForm
              onSave={addTradeline}
              onCancel={tradelines.length > 0 ? () => setShowAdd(false) : undefined}
            />
          ) : (
            <AddAccountButton onClick={() => setShowAdd(true)} />
          )}
        </div>
      </section>

      {/* Monthly picture */}
      <section
        id="monthly-picture"
        className="scroll-mt-24 rounded-3xl border border-white/10 bg-card p-5 shadow-soft sm:p-7"
      >
        <h2 className="font-display text-xl font-semibold">Your monthly picture</h2>
        <div className="mt-4 space-y-3">
          <IncomeCapture value={income} onChange={setIncome} />
          <ExpensesCapture
            value={expenses}
            onChange={setExpenses}
            monthlyNetIncome={netIncome}
          />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="current-monthly">Current total monthly payments ($)</Label>
            <Input
              id="current-monthly"
              className="mt-1.5"
              type="number"
              inputMode="numeric"
              min={0}
              value={currentMonthlyPayment || ""}
              onChange={(e) =>
                setCurrentMonthlyPayment(Math.max(0, Number(e.target.value)))
              }
            />
          </div>
          <div>
            <Label htmlFor="monthly-budget">Comfortable monthly amount ($)</Label>
            <Input
              id="monthly-budget"
              className="mt-1.5"
              type="number"
              inputMode="numeric"
              min={0}
              value={monthlyBudget || ""}
              onChange={(e) => setMonthlyBudget(Math.max(0, Number(e.target.value)))}
            />
          </div>
        </div>
        {tradelines.length > 0 && (currentMonthlyPayment > 0 || monthlyBudget > 0) && (
          <div className="mt-5 rounded-2xl border border-white/10 bg-muted/30 p-4 sm:p-5">
            <CashFlowSummary
              currentMonthlyPayment={currentMonthlyPayment || minSum}
              monthlyBudget={monthlyBudget || Math.max(minSum * 0.7, 150)}
              planSuggestedMonthly={comparison?.proposed.monthlyPayment}
              monthlyNetIncome={netIncome}
              essentialExpenses={expensesTotal}
            />
          </div>
        )}
      </section>

      {/* Live comparison preview */}
      {comparison && (
        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-xl font-semibold">Updated plan preview</h2>
            <span className="text-sm text-muted-foreground">
              {tradelines.length} account{tradelines.length === 1 ? "" : "s"} ·{" "}
              {currency(totalDebt)}
            </span>
          </div>
          <Assumptions className="mb-4" showDisclaimer={false} />
          <ComparisonView comparison={comparison} />
          <PlanProgressPanel
            className="mt-8"
            comparison={comparison}
            currentMonthlyPayment={currentMonthlyPayment || minSum}
            monthlyBudget={monthlyBudget || Math.max(minSum * 0.7, 150)}
          />
        </section>
      )}

      {error && (
        <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={`/dashboard/${applicationId}`}
          className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Cancel
        </Link>
        <Button
          type="button"
          size="lg"
          variant="money"
          onClick={onSave}
          disabled={saving}
          className="w-full sm:w-auto"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving…
            </>
          ) : (
            <>
              Save &amp; recompute <Check className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
