"use server";

import { createClient } from "@/lib/supabase/server";
import {
  applicationSchema,
  type ApplicationData,
} from "@/lib/application-schema";
import { computePlan, planColumns, tradelineToRow } from "@/lib/plan";
import { monthlyNetIncome, incomeColumns } from "@/lib/income";
import { totalEssentialExpenses, expensesColumns } from "@/lib/expenses";

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
  const netIncome = monthlyNetIncome(form.income);
  const expensesTotal = totalEssentialExpenses(form.essentialExpenses);
  const computed = computePlan(
    form.tradelines,
    form.currentMonthlyPayment,
    form.monthlyBudget,
    netIncome,
    expensesTotal,
  );

  const { data: application, error: insertError } = await supabase
    .from("applications")
    .insert({
      user_id: user.id,
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      phone: form.phone,
      zip: form.zip,
      employment: form.employment,
      goal: form.goal,
      credit_priority: form.creditPriority,
      timeline: form.timeline,
      ...incomeColumns(form.income),
      ...expensesColumns(form.essentialExpenses),
      ...planColumns(computed),
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

  const { error: tradelineError } = await supabase
    .from("application_tradelines")
    .insert(form.tradelines.map((tl) => tradelineToRow(tl, application.id, user.id)));

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
