import {
  estimate,
  buildComparison,
  summarizePortfolio,
  type Tradeline,
  type Comparison,
  type EstimatorResult,
} from "@/lib/estimator";
import { buildCashFlowSnapshot, type CashFlowSnapshot } from "@/lib/cash-flow";

export type ComputedPlan = {
  totalDebt: number;
  resolvedCurrentMonthly: number;
  monthlyBudget: number;
  plan: EstimatorResult;
  comparison: Comparison;
  /** Present when the user shared income; null → estimate was used. */
  monthlyNetIncome: number | null;
  cashFlow: CashFlowSnapshot;
  /** Recommended deposit, never above real disposable income when income known. */
  affordableDeposit: number;
};

/**
 * Single source of truth for turning a set of tradelines + monthly inputs into
 * an authoritative plan. Used on the server by both submit and update so the
 * numbers can never diverge from the estimator.
 */
export function computePlan(
  tradelines: Tradeline[],
  currentMonthlyPayment: number,
  monthlyBudget: number,
  monthlyNetIncome?: number | null,
  essentialExpenses?: number | null,
): ComputedPlan {
  const portfolio = summarizePortfolio(tradelines);
  const totalDebt = portfolio.totalBalance;

  const resolvedCurrentMonthly =
    currentMonthlyPayment > 0 ? currentMonthlyPayment : portfolio.totalMinPayment;

  const inputs = {
    totalDebt,
    currentMonthlyPayment: resolvedCurrentMonthly,
    monthlyBudget,
    assumedApr: portfolio.weightedApr > 0 ? portfolio.weightedApr / 100 : undefined,
  };

  const plan = estimate(inputs);
  const comparison = buildComparison(inputs, plan);

  const income = monthlyNetIncome ?? null;
  const expenses = essentialExpenses ?? null;
  const cashFlow = buildCashFlowSnapshot({
    currentMonthlyPayment: resolvedCurrentMonthly,
    monthlyBudget,
    planSuggestedMonthly: plan.suggestedMonthly,
    monthlyNetIncome: income,
    essentialExpenses: expenses,
  });

  // Affordability guardrail: never recommend a deposit above real disposable
  // income when the user shared income. Falls back to the raw suggestion otherwise.
  const affordableDeposit =
    income != null
      ? Math.min(plan.suggestedMonthly, Math.max(150, cashFlow.disposableIncome))
      : plan.suggestedMonthly;

  return {
    totalDebt,
    resolvedCurrentMonthly,
    monthlyBudget,
    plan,
    comparison,
    monthlyNetIncome: income,
    cashFlow,
    affordableDeposit,
  };
}

/** Map a ComputedPlan to the `applications` table's plan_* columns. */
export function planColumns(computed: ComputedPlan) {
  const { plan, comparison, totalDebt, resolvedCurrentMonthly, monthlyBudget } =
    computed;
  return {
    current_monthly_payment: resolvedCurrentMonthly,
    monthly_budget: monthlyBudget,
    total_debt: totalDebt,
    plan_settlement_low_pct: plan.settlementLowPct,
    plan_settlement_high_pct: plan.settlementHighPct,
    plan_settled_low: plan.settledLow,
    plan_settled_high: plan.settledHigh,
    plan_fee_low: plan.feeLow,
    plan_fee_high: plan.feeHigh,
    plan_cost_low: plan.programCostLow,
    plan_cost_high: plan.programCostHigh,
    plan_cost_mid: plan.programCostMid,
    plan_savings_low: plan.savingsLow,
    plan_savings_high: plan.savingsHigh,
    plan_savings_mid: plan.savingsMid,
    plan_months_low: plan.monthsLow,
    plan_months_high: plan.monthsHigh,
    plan_suggested_monthly: plan.suggestedMonthly,
    plan_minimum_only_total: plan.minimumOnlyTotal,
    plan_minimum_only_months: plan.minimumOnlyMonths,
    plan_budget_fit: plan.budgetFit,
    plan_comparison: comparison,
  };
}

type TradelineRow = {
  id: string;
  creditor: string;
  type: string;
  balance: number | string;
  credit_limit: number | string | null;
  apr: number | string;
  min_payment: number | string;
  opened: string | null;
  status: string;
};

/** Convert a DB tradeline row into the app's Tradeline shape. */
export function rowToTradeline(r: TradelineRow): Tradeline {
  return {
    id: r.id,
    creditor: r.creditor,
    type: r.type as Tradeline["type"],
    balance: Number(r.balance),
    limit: r.credit_limit != null ? Number(r.credit_limit) : undefined,
    apr: Number(r.apr),
    minPayment: Number(r.min_payment),
    opened: r.opened ?? undefined,
    status: r.status as Tradeline["status"],
  };
}

/** Convert an app Tradeline into DB insert columns for a given application. */
export function tradelineToRow(
  tl: Tradeline,
  applicationId: string,
  userId: string,
) {
  return {
    application_id: applicationId,
    user_id: userId,
    creditor: tl.creditor,
    type: tl.type,
    balance: tl.balance,
    credit_limit: tl.limit ?? null,
    apr: tl.apr,
    min_payment: tl.minPayment,
    opened: tl.opened || null,
    status: tl.status,
  };
}

/** Normalize a stored plan_comparison JSON so older rows still render. */
export function normalizeComparison(
  raw: unknown,
  totalDebt: number,
): Comparison | null {
  if (!raw || typeof raw !== "object") return null;
  const c = raw as Comparison;
  if (c.amountOwed == null) {
    return { ...c, amountOwed: totalDebt };
  }
  return c;
}
