/**
 * Illustrative cash-flow model derived from wizard inputs.
 * Clearly labeled as estimates — not verified income data.
 */

export type CashFlowSnapshot = {
  estimatedMonthlyIncome: number;
  /** "user" when the figure came from a real income input, else "estimated". */
  incomeSource: "user" | "estimated";
  hardCosts: number;
  softCosts: number;
  /** Combined essential living costs (real total when given, else hard+soft). */
  essentialCosts: number;
  /** "user" when essential costs came from real expense inputs, else "estimated". */
  expensesSource: "user" | "estimated";
  currentDebtPayments: number;
  disposableIncome: number;
  planDeposit: number;
  dtiCurrentPct: number;
  dtiPlanPct: number;
  monthlyRelief: number;
};

export function buildCashFlowSnapshot(params: {
  currentMonthlyPayment: number;
  monthlyBudget: number;
  planSuggestedMonthly?: number;
  /** Real monthly net income when the user provided it; null/undefined → estimate. */
  monthlyNetIncome?: number | null;
  /** Real total essential expenses when provided; null/undefined → estimate. */
  essentialExpenses?: number | null;
}): CashFlowSnapshot {
  const debt = Math.max(0, params.currentMonthlyPayment);
  const budget = Math.max(0, params.monthlyBudget);
  const plan = Math.max(0, params.planSuggestedMonthly ?? budget);

  const hasRealIncome =
    params.monthlyNetIncome != null && params.monthlyNetIncome > 0;

  // Use the real figure when we have it; otherwise fall back to the illustrative
  // model (debt service typically ~12–18% of gross for enrolled clients).
  const estimatedMonthlyIncome = hasRealIncome
    ? Math.round(params.monthlyNetIncome!)
    : Math.round(Math.max(debt / 0.15, (debt + budget) * 1.35, 3500));

  const hasRealExpenses =
    params.essentialExpenses != null && params.essentialExpenses > 0;

  // Real residual when the user shared expenses; otherwise the heuristic split.
  let hardCosts: number;
  let softCosts: number;
  let essentialCosts: number;
  if (hasRealExpenses) {
    essentialCosts = Math.round(params.essentialExpenses!);
    hardCosts = essentialCosts;
    softCosts = 0;
  } else {
    hardCosts = Math.round(estimatedMonthlyIncome * 0.42);
    softCosts = Math.round(estimatedMonthlyIncome * 0.22);
    essentialCosts = hardCosts + softCosts;
  }

  const disposable = Math.max(
    0,
    estimatedMonthlyIncome - essentialCosts - debt,
  );

  return {
    estimatedMonthlyIncome,
    incomeSource: hasRealIncome ? "user" : "estimated",
    hardCosts,
    softCosts,
    essentialCosts,
    expensesSource: hasRealExpenses ? "user" : "estimated",
    currentDebtPayments: debt,
    disposableIncome: disposable,
    planDeposit: plan,
    dtiCurrentPct:
      estimatedMonthlyIncome > 0 ? (debt / estimatedMonthlyIncome) * 100 : 0,
    dtiPlanPct:
      estimatedMonthlyIncome > 0 ? (plan / estimatedMonthlyIncome) * 100 : 0,
    monthlyRelief: Math.max(0, debt - plan),
  };
}
