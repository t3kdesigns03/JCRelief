"use server";

import { createClient } from "@/lib/supabase/server";
import {
  applicationSchema,
  type ApplicationData,
} from "@/lib/application-schema";
import {
  estimate,
  buildComparison,
  summarizePortfolio,
} from "@/lib/estimator";

export type SubmitApplicationResult =
  | { ok: true; applicationId: string }
  | { ok: false; error: string };

/**
 * Recompute the full plan on the server using the same estimator logic,
 * then persist authoritative numbers to Supabase under RLS.
 */
export async function submitApplication(
  data: ApplicationData,
): Promise<SubmitApplicationResult> {
  const parsed = applicationSchema.safeParse(data);
  if (!parsed.success) {
    return { ok: false, error: "Please check your answers and try again." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      ok: false,
      error: "Your session expired. Please refresh the page and try again.",
    };
  }

  const form = parsed.data;
  const portfolio = summarizePortfolio(form.tradelines);
  const totalDebt = portfolio.totalBalance;

  const inputs = {
    totalDebt,
    currentMonthlyPayment:
      form.currentMonthlyPayment > 0
        ? form.currentMonthlyPayment
        : portfolio.totalMinPayment,
    monthlyBudget: form.monthlyBudget,
    assumedApr:
      portfolio.weightedApr > 0
        ? portfolio.weightedApr / 100
        : undefined,
  };

  const plan = estimate(inputs);
  const comparison = buildComparison(inputs, plan);

  const { data: application, error: insertError } = await supabase
    .from("applications")
    .insert({
      user_id: user.id,
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      phone: form.phone,
      zip: form.zip,
      current_monthly_payment: inputs.currentMonthlyPayment,
      monthly_budget: form.monthlyBudget,
      employment: form.employment,
      goal: form.goal,
      credit_priority: form.creditPriority,
      timeline: form.timeline,
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
    })
    .select("id")
    .single();

  if (insertError || !application) {
    // eslint-disable-next-line no-console
    console.error("Application insert failed:", insertError);
    return {
      ok: false,
      error: "We couldn't save your application. Please try again in a moment.",
    };
  }

  const tradelineRows = form.tradelines.map((tl) => ({
    application_id: application.id,
    user_id: user.id,
    creditor: tl.creditor,
    type: tl.type,
    balance: tl.balance,
    credit_limit: tl.limit ?? null,
    apr: tl.apr,
    min_payment: tl.minPayment,
    opened: tl.opened || null,
    status: tl.status,
  }));

  const { error: tradelineError } = await supabase
    .from("application_tradelines")
    .insert(tradelineRows);

  if (tradelineError) {
    // eslint-disable-next-line no-console
    console.error("Tradeline insert failed:", tradelineError);
    return {
      ok: false,
      error:
        "Your plan was computed but we couldn't save your accounts. Please contact us.",
    };
  }

  return { ok: true, applicationId: application.id };
}
