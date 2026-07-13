import {
  expenseCategories,
  type ExpensesInput,
  type ExpenseKey,
} from "@/lib/application-schema";

/**
 * Sum the essential expense fields the user actually filled.
 * Returns null when nothing usable was provided — callers then treat expenses
 * as "not provided" and fall back to the cash-flow heuristic.
 */
export function totalEssentialExpenses(
  expenses?: ExpensesInput | null,
): number | null {
  if (!expenses) return null;
  let sum = 0;
  let any = false;
  for (const { key } of expenseCategories) {
    const v = expenses[key as ExpenseKey];
    if (typeof v === "number" && Number.isFinite(v) && v >= 0) {
      sum += v;
      any = true;
    }
  }
  return any ? Math.round(sum) : null;
}

/** Keep only defined, valid entries — what we persist to JSONB. */
export function cleanExpenses(
  expenses?: ExpensesInput | null,
): Record<string, number> {
  const out: Record<string, number> = {};
  if (!expenses) return out;
  for (const { key } of expenseCategories) {
    const v = expenses[key as ExpenseKey];
    if (typeof v === "number" && Number.isFinite(v) && v >= 0) out[key] = v;
  }
  return out;
}

/**
 * Map expenses to the `applications` table columns. The raw map lives in a
 * flexible JSONB column (future categories need no migration); the total is a
 * server-normalized, authoritative numeric — mirrors income_monthly_net.
 */
export function expensesColumns(expenses?: ExpensesInput | null) {
  const clean = cleanExpenses(expenses);
  const hasAny = Object.keys(clean).length > 0;
  return {
    essential_expenses: hasAny ? clean : null,
    essential_expenses_total: totalEssentialExpenses(expenses),
  };
}

/** Rebuild an ExpensesInput from the stored JSONB map (dashboard prefill). */
export function rowToExpenses(raw: unknown): ExpensesInput {
  const out: ExpensesInput = {};
  if (!raw || typeof raw !== "object") return out;
  const map = raw as Record<string, unknown>;
  for (const { key } of expenseCategories) {
    const v = map[key];
    if (v != null && Number.isFinite(Number(v))) {
      out[key as ExpenseKey] = Number(v);
    }
  }
  return out;
}
