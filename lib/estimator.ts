/**
 * Debt Angel — Debt Freedom Estimator.
 *
 * Smarter, Faster, Cheaper. These are transparent, deliberately conservative
 * illustrations for education only — not an offer, guarantee, or advice. Real
 * outcomes vary by creditor, balance, delinquency, state law, and a client's
 * ability to fund a dedicated resolution account. Every assumption below is
 * surfaced to the client in the UI so nothing is hidden.
 */

export interface Tradeline {
  id: string;
  creditor: string;
  type: "credit-card" | "personal-loan" | "medical" | "retail-card" | "other";
  balance: number;
  /** Credit limit — used for utilization. Omit/0 for loans. */
  limit?: number;
  apr: number; // annual %, e.g. 24.99
  minPayment: number;
  /** Account open date, ISO "YYYY-MM". */
  opened?: string;
  status: "current" | "past-due" | "collections";
}

export interface TradelineMetrics {
  utilizationPct: number; // 0-100+, revolving only
  monthlyInterest: number; // $ this account bleeds each month
  balancePctOfTotal: number; // share of total enrolled balance
  isRevolving: boolean;
}

export interface PortfolioSummary {
  totalBalance: number;
  totalLimit: number;
  totalMinPayment: number;
  totalMonthlyInterest: number;
  weightedApr: number; // balance-weighted APR
  overallUtilizationPct: number; // revolving only
  count: number;
}

export interface EstimatorInputs {
  /** Total enrolled unsecured debt (credit cards, personal loans, some medical). */
  totalDebt: number;
  /** What the person pays toward these debts today (minimums, roughly). */
  currentMonthlyPayment: number;
  /** Comfortable amount they could set aside monthly for a dedicated account. */
  monthlyBudget: number;
  /** Optional: assumed blended APR for the "current path" model. */
  assumedApr?: number;
}

export interface EstimatorResult {
  settlementLowPct: number;
  settlementHighPct: number;
  settledLow: number;
  settledHigh: number;
  feeLow: number;
  feeHigh: number;
  programCostLow: number;
  programCostHigh: number;
  programCostMid: number;
  savingsLow: number;
  savingsHigh: number;
  savingsMid: number;
  monthsLow: number;
  monthsHigh: number;
  suggestedMonthly: number;
  minimumOnlyTotal: number;
  minimumOnlyMonths: number;
  budgetFit: "comfortable" | "workable" | "tight";
}

/** Side-by-side numbers that power the visual comparison page. */
export interface Comparison {
  current: {
    monthlyPayment: number;
    totalPayoff: number;
    months: number;
  };
  proposed: {
    monthlyPayment: number;
    totalCost: number;
    months: number;
  };
  monthlyRelief: number; // current monthly − proposed monthly
  totalSavings: number; // current payoff − proposed cost
  savingsPct: number; // totalSavings / current payoff
  monthsSaved: number;
}

/* Assumptions — conservative and disclosed in the UI. */
const SETTLEMENT_LOW = 0.4; // strong outcome: 40% of balance paid to creditors
const SETTLEMENT_HIGH = 0.55; // conservative outcome: 55%
const FEE_LOW = 0.18; // performance-based fee, low end of enrolled debt
const FEE_HIGH = 0.25; // performance-based fee, high end
const APR_ASSUMED = 0.2299; // typical revolving APR for the current-path model
const MIN_PAYMENT_RATE = 0.02; // ~2% of balance as a typical minimum

/**
 * Example assumptions surfaced in the UI. These are illustrative placeholders
 * until substantiated with real program data — not offers or guarantees.
 */
export const ESTIMATOR_ASSUMPTIONS = {
  settlementRangeLabel: "40–60%",
  settlementLowPct: SETTLEMENT_LOW,
  settlementHighPct: SETTLEMENT_HIGH,
  /** Midpoint example fee shown in disclosures (actual range used in math: 18–25%). */
  exampleFeePct: 0.22,
  feeLowPct: FEE_LOW,
  feeHighPct: FEE_HIGH,
  assumedAprPct: APR_ASSUMED * 100,
  minPaymentRatePct: MIN_PAYMENT_RATE * 100,
  targetMonths: 40,
} as const;

export function estimate(inputs: EstimatorInputs): EstimatorResult {
  const totalDebt = Math.max(0, inputs.totalDebt || 0);
  const budget = Math.max(0, inputs.monthlyBudget || 0);
  const apr = inputs.assumedApr ?? APR_ASSUMED;

  const settledLow = totalDebt * SETTLEMENT_LOW;
  const settledHigh = totalDebt * SETTLEMENT_HIGH;
  const feeLow = totalDebt * FEE_LOW;
  const feeHigh = totalDebt * FEE_HIGH;

  const programCostLow = settledLow + feeLow;
  const programCostHigh = settledHigh + feeHigh;
  const programCostMid = (programCostLow + programCostHigh) / 2;

  const savingsLow = Math.max(0, totalDebt - programCostHigh); // conservative
  const savingsHigh = Math.max(0, totalDebt - programCostLow); // optimistic
  const savingsMid = Math.max(0, totalDebt - programCostMid);

  // Suggested monthly deposit: fund the mid all-in cost over ~40 months, but
  // never suggest more than the person told us they can afford.
  const targetMonths = 40;
  const idealMonthly = programCostMid / targetMonths;
  const suggestedMonthly =
    budget > 0 ? Math.min(budget, Math.max(idealMonthly, budget * 0.9)) : idealMonthly;

  const fundingMonthly = budget > 0 ? budget : idealMonthly;
  const monthsLow = clampMonths(programCostLow / Math.max(fundingMonthly, 1));
  const monthsHigh = clampMonths(programCostHigh / Math.max(fundingMonthly, 1));

  const minOnly = minimumOnlyPayoff(totalDebt, apr);

  const ratio = budget > 0 && idealMonthly > 0 ? budget / idealMonthly : 0;
  const budgetFit: EstimatorResult["budgetFit"] =
    ratio >= 1.15 ? "comfortable" : ratio >= 0.85 ? "workable" : "tight";

  return {
    settlementLowPct: SETTLEMENT_LOW,
    settlementHighPct: SETTLEMENT_HIGH,
    settledLow,
    settledHigh,
    feeLow,
    feeHigh,
    programCostLow,
    programCostHigh,
    programCostMid,
    savingsLow,
    savingsHigh,
    savingsMid,
    monthsLow,
    monthsHigh,
    suggestedMonthly,
    minimumOnlyTotal: minOnly.totalPaid,
    minimumOnlyMonths: minOnly.months,
    budgetFit,
  };
}

/**
 * Build the current-vs-proposed comparison the visual summary page renders.
 * `currentMonthly` defaults to the estimator input; pass the real sum of
 * minimum payments when tradelines are known for a truer picture.
 */
export function buildComparison(
  inputs: EstimatorInputs,
  result: EstimatorResult,
): Comparison {
  const currentMonthly =
    inputs.currentMonthlyPayment > 0
      ? inputs.currentMonthlyPayment
      : Math.max(inputs.totalDebt * MIN_PAYMENT_RATE, 25);

  const proposedMonthly = result.suggestedMonthly;
  const proposedMonths = Math.round((result.monthsLow + result.monthsHigh) / 2);
  const proposedCost = result.programCostMid;

  const totalSavings = Math.max(0, result.minimumOnlyTotal - proposedCost);
  const savingsPct =
    result.minimumOnlyTotal > 0 ? (totalSavings / result.minimumOnlyTotal) * 100 : 0;
  const monthsSaved = Math.max(0, result.minimumOnlyMonths - proposedMonths);

  return {
    current: {
      monthlyPayment: currentMonthly,
      totalPayoff: result.minimumOnlyTotal,
      months: result.minimumOnlyMonths,
    },
    proposed: {
      monthlyPayment: proposedMonthly,
      totalCost: proposedCost,
      months: proposedMonths,
    },
    monthlyRelief: Math.max(0, currentMonthly - proposedMonthly),
    totalSavings,
    savingsPct,
    monthsSaved,
  };
}

/* ── Tradeline helpers (power the Individual Tradeline View) ───────────── */

export function tradelineMetrics(
  tl: Tradeline,
  totalBalance: number,
): TradelineMetrics {
  const isRevolving = tl.type === "credit-card" || tl.type === "retail-card";
  const utilizationPct =
    isRevolving && tl.limit && tl.limit > 0 ? (tl.balance / tl.limit) * 100 : 0;
  return {
    utilizationPct,
    monthlyInterest: (tl.balance * (tl.apr / 100)) / 12,
    balancePctOfTotal: totalBalance > 0 ? (tl.balance / totalBalance) * 100 : 0,
    isRevolving,
  };
}

export function summarizePortfolio(tradelines: Tradeline[]): PortfolioSummary {
  const totalBalance = sum(tradelines.map((t) => t.balance));
  const revolving = tradelines.filter(
    (t) => t.type === "credit-card" || t.type === "retail-card",
  );
  const totalLimit = sum(revolving.map((t) => t.limit ?? 0));
  const revolvingBalance = sum(revolving.map((t) => t.balance));
  const weightedApr =
    totalBalance > 0
      ? sum(tradelines.map((t) => t.balance * t.apr)) / totalBalance
      : 0;
  return {
    totalBalance,
    totalLimit,
    totalMinPayment: sum(tradelines.map((t) => t.minPayment)),
    totalMonthlyInterest: sum(tradelines.map((t) => (t.balance * (t.apr / 100)) / 12)),
    weightedApr,
    overallUtilizationPct:
      totalLimit > 0 ? (revolvingBalance / totalLimit) * 100 : 0,
    count: tradelines.length,
  };
}

/** Utilization → status band used for color coding. */
export function utilizationBand(pct: number): "good" | "watch" | "high" {
  if (pct <= 30) return "good";
  if (pct <= 60) return "watch";
  return "high";
}

/* ── internals ────────────────────────────────────────────────────────── */

function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
}

function clampMonths(m: number): number {
  if (!Number.isFinite(m) || m <= 0) return 12;
  return Math.round(Math.min(Math.max(m, 12), 60));
}

/** Rough payoff simulation paying only ~2% minimums at a typical APR. */
function minimumOnlyPayoff(
  balance: number,
  apr: number,
): { totalPaid: number; months: number } {
  if (balance <= 0) return { totalPaid: 0, months: 0 };
  const monthlyRate = apr / 12;
  let bal = balance;
  let totalPaid = 0;
  let months = 0;
  const maxMonths = 480; // 40-year cap so the loop always terminates
  while (bal > 1 && months < maxMonths) {
    const interest = bal * monthlyRate;
    let payment = Math.max(bal * MIN_PAYMENT_RATE, 25);
    payment = Math.max(payment, interest + 1); // ensure the balance falls
    payment = Math.min(payment, bal + interest);
    bal = bal + interest - payment;
    totalPaid += payment;
    months += 1;
  }
  return { totalPaid: Math.round(totalPaid), months };
}
