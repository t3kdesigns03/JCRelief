import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { claimApplicationsByEmail } from "@/lib/actions/auth";
import { isVerifiedUser } from "@/lib/auth/session";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Wordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Assumptions } from "@/components/shared/Assumptions";
import type { Comparison } from "@/lib/estimator";
import { currency, monthsToLabel } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Your plans",
  description: "Track your Debt Angel plans and projected savings.",
};

type ApplicationRow = {
  id: string;
  created_at: string;
  status: string;
  total_debt: number;
  plan_cost_mid: number;
  plan_savings_mid: number;
  plan_suggested_monthly: number;
  plan_months_low: number;
  plan_months_high: number;
  plan_comparison: Comparison;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isVerifiedUser(user)) {
    redirect("/login?next=/dashboard");
  }

  await claimApplicationsByEmail();

  const { data: applications } = await supabase
    .from("applications")
    .select(
      "id, created_at, status, total_debt, plan_cost_mid, plan_savings_mid, plan_suggested_monthly, plan_months_low, plan_months_high, plan_comparison",
    )
    .order("created_at", { ascending: false });

  const plans = (applications ?? []) as ApplicationRow[];

  return (
    <main className="relative min-h-screen bg-background bg-grid">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 gradient-halo" />
      <div className="container relative z-10 py-8 sm:py-12">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/" aria-label="Debt Angel home">
              <Wordmark size="md" withMark />
            </Link>
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
              Your plans
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Signed in as <span className="text-foreground">{user!.email}</span>
            </p>
          </div>
          <SignOutButton />
        </header>

        {plans.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-white/10 bg-card p-10 text-center">
            <FileText className="mx-auto h-10 w-10 text-gold" />
            <h2 className="mt-4 font-display text-xl font-semibold">No plans yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Build your first comparison — it only takes a few minutes.
            </p>
            <Button asChild className="mt-6" size="lg">
              <Link href="/apply">
                Build my plan <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </ul>
        )}

        <Assumptions className="mt-8 max-w-2xl" variant="compact" showDisclaimer={false} />
      </div>
    </main>
  );
}

function PlanCard({ plan }: { plan: ApplicationRow }) {
  const months = Math.round((plan.plan_months_low + plan.plan_months_high) / 2);
  const comparison = plan.plan_comparison;
  const savings = comparison?.totalSavings ?? plan.plan_savings_mid;

  return (
    <li className="rounded-3xl border border-white/10 bg-card p-6 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
            {formatStatus(plan.status)}
          </p>
          <p className="mt-1 font-display text-lg font-semibold">
            {currency(plan.total_debt)} enrolled
          </p>
          <p className="text-xs text-muted-foreground">
            Submitted {formatDate(plan.created_at)}
          </p>
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">All-in cost (est.)</dt>
          <dd className="num-display font-semibold tabular">{currency(plan.plan_cost_mid)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Projected savings</dt>
          <dd className="num-display font-semibold tabular text-money">
            {currency(savings)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Suggested monthly</dt>
          <dd className="num-display font-semibold tabular">
            {currency(plan.plan_suggested_monthly)}/mo
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Est. timeline</dt>
          <dd className="num-display font-semibold tabular">{monthsToLabel(months)}</dd>
        </div>
      </dl>

      <p className="mt-4 text-xs text-muted-foreground">
        Illustrative figures from your submission. An advisor will confirm your exact
        plan.
      </p>
    </li>
  );
}

function formatStatus(status: string): string {
  return status.replace(/_/g, " ");
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
