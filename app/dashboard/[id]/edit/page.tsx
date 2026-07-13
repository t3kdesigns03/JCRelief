import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isVerifiedUser } from "@/lib/auth/session";
import { rowToTradeline } from "@/lib/plan";
import { rowToIncome } from "@/lib/income";
import { rowToExpenses } from "@/lib/expenses";
import { EditAccounts } from "@/components/dashboard/edit-accounts";
import { Wordmark } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Update your accounts",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPlanPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isVerifiedUser(user)) {
    redirect(`/login?next=/dashboard/${id}/edit`);
  }

  const { data: app } = await supabase
    .from("applications")
    .select(
      "id, current_monthly_payment, monthly_budget, total_debt, income_precision, income_amount, income_range_id, income_frequency, income_type, income_includes_household, income_source, essential_expenses",
    )
    .eq("id", id)
    .single();

  if (!app) notFound();

  const { data: tradelineRows } = await supabase
    .from("application_tradelines")
    .select("*")
    .eq("application_id", id)
    .order("created_at", { ascending: true });

  const tradelines = (tradelineRows ?? []).map(rowToTradeline);

  return (
    <main className="relative min-h-screen bg-background bg-grid">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 gradient-halo" />
      <div className="container relative z-10 max-w-4xl py-8 sm:py-12">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Debt Angel home">
            <Wordmark size="md" withMark />
          </Link>
          <Link
            href={`/dashboard/${id}`}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to plan
          </Link>
        </div>

        <header className="mt-6">
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Update your accounts
          </h1>
          <p className="mt-1 text-muted-foreground">
            Changes are recomputed on our side and saved to this plan.
          </p>
        </header>

        <div className="mt-8">
          <EditAccounts
            applicationId={id}
            initialTradelines={tradelines}
            initialCurrentMonthlyPayment={Number(app.current_monthly_payment) || 0}
            initialMonthlyBudget={Number(app.monthly_budget) || 0}
            initialIncome={rowToIncome(app)}
            initialExpenses={rowToExpenses(app.essential_expenses)}
          />
        </div>
      </div>
    </main>
  );
}
