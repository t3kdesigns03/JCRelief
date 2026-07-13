"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  tradelineSchema,
  incomeSchema,
  expensesSchema,
} from "@/lib/application-schema";
import { computePlan, planColumns, tradelineToRow } from "@/lib/plan";
import { monthlyNetIncome, incomeColumns } from "@/lib/income";
import { totalEssentialExpenses, expensesColumns } from "@/lib/expenses";
import { isAnonymousUser } from "@/lib/auth/session";

const updateSchema = z.object({
  applicationId: z.string().uuid(),
  tradelines: z.array(tradelineSchema).min(1, "Add at least one account"),
  currentMonthlyPayment: z.number().min(0),
  monthlyBudget: z.number().min(0),
  income: incomeSchema.optional(),
  essentialExpenses: expensesSchema.optional(),
});

export type UpdateApplicationInput = z.infer<typeof updateSchema>;

export type UpdateApplicationResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Recompute and update an existing plan the user already owns. Verifies a
 * non-anonymous session, recomputes the plan server-side, updates the
 * application row, and replaces its tradelines. All under RLS.
 */
export async function updateApplication(
  input: UpdateApplicationInput,
): Promise<UpdateApplicationResult> {
  const parsed = updateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Please check your accounts and try again." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || isAnonymousUser(user)) {
    return {
      ok: false,
      error: "Please sign in to update this plan.",
    };
  }

  const {
    applicationId,
    tradelines,
    currentMonthlyPayment,
    monthlyBudget,
    income,
    essentialExpenses,
  } = parsed.data;

  // Confirm ownership before mutating (RLS also enforces this).
  const { data: existing, error: fetchError } = await supabase
    .from("applications")
    .select("id")
    .eq("id", applicationId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !existing) {
    return { ok: false, error: "We couldn't find that plan on your account." };
  }

  const netIncome = monthlyNetIncome(income);
  const expensesTotal = totalEssentialExpenses(essentialExpenses);
  const computed = computePlan(
    tradelines,
    currentMonthlyPayment,
    monthlyBudget,
    netIncome,
    expensesTotal,
  );

  const { error: updateError } = await supabase
    .from("applications")
    .update({
      ...incomeColumns(income),
      ...expensesColumns(essentialExpenses),
      ...planColumns(computed),
      status: "reviewing",
    })
    .eq("id", applicationId)
    .eq("user_id", user.id);

  if (updateError) {
    // eslint-disable-next-line no-console
    console.error("Application update failed:", updateError);
    return { ok: false, error: "We couldn't save your changes. Please try again." };
  }

  // Replace tradelines: remove the old set, insert the new one.
  const { error: deleteError } = await supabase
    .from("application_tradelines")
    .delete()
    .eq("application_id", applicationId)
    .eq("user_id", user.id);

  if (deleteError) {
    // eslint-disable-next-line no-console
    console.error("Tradeline delete failed:", deleteError);
    return { ok: false, error: "We couldn't update your accounts. Please try again." };
  }

  const { error: insertError } = await supabase
    .from("application_tradelines")
    .insert(tradelines.map((tl) => tradelineToRow(tl, applicationId, user.id)));

  if (insertError) {
    // eslint-disable-next-line no-console
    console.error("Tradeline insert failed:", insertError);
    return { ok: false, error: "We couldn't save your accounts. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${applicationId}`);
  return { ok: true };
}
