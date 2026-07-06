/** Parse estimator → /apply prefill query params. */
export type ApplyPrefill = {
  totalDebt?: number;
  monthlyBudget?: number;
};

export function parseApplyPrefill(
  params: Record<string, string | string[] | undefined>,
): ApplyPrefill {
  const rawDebt = Array.isArray(params.debt) ? params.debt[0] : params.debt;
  const rawBudget = Array.isArray(params.budget) ? params.budget[0] : params.budget;

  const totalDebt = Number(rawDebt);
  const monthlyBudget = Number(rawBudget);

  return {
    totalDebt:
      Number.isFinite(totalDebt) && totalDebt >= 5000 ? Math.round(totalDebt) : undefined,
    monthlyBudget:
      Number.isFinite(monthlyBudget) && monthlyBudget >= 150
        ? Math.round(monthlyBudget)
        : undefined,
  };
}

export function buildApplyUrl(debt: number, budget: number): string {
  const params = new URLSearchParams({
    debt: String(Math.round(debt)),
    budget: String(Math.round(budget)),
  });
  return `/apply?${params.toString()}`;
}
