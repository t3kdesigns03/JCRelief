/**
 * Illustrative cash-flow model derived from wizard inputs.
 * Clearly labeled as estimates — not verified income data.
 */

export type CashFlowSnapshot = {
  estimatedMonthlyIncome: number;
  hardCosts: number;
  softCosts: number;
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
}): CashFlowSnapshot {
  const debt = Math.max(0, params.currentMonthlyPayment);
  const budget = Math.max(0, params.monthlyBudget);
  const plan = Math.max(0, params.planSuggestedMonthly ?? budget);

  // Illustrative gross income: debt service typically ~12–18% of gross for enrolled clients.
  const estimatedMonthlyIncome = Math.round(
    Math.max(debt / 0.15, (debt + budget) * 1.35, 3500),
  );

  const hardCosts = Math.round(estimatedMonthlyIncome * 0.42);
  const softCosts = Math.round(estimatedMonthlyIncome * 0.22);
  const disposable = Math.max(
    0,
    estimatedMonthlyIncome - hardCosts - softCosts - debt,
  );

  return {
    estimatedMonthlyIncome,
    hardCosts,
    softCosts,
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
