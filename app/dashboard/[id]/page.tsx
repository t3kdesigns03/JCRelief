import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isVerifiedUser } from "@/lib/auth/session";
import { rowToTradeline, normalizeComparison } from "@/lib/plan";
import { PlanStatus } from "@/components/dashboard/plan-status";
import { ComparisonView } from "@/components/shared/comparison-view";
import { PlanProgressPanel } from "@/components/financial/PlanProgressPanel";
import { TradelineView } from "@/components/shared/tradeline-view";
import { Assumptions } from "@/components/shared/Assumptions";
import { Wordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { currency, monthsToLabel } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Your plan",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PlanDetailPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isVerifiedUser(user)) {
    redirect(`/login?next=/dashboard/${id}`);
  }

  const { data: app } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();

  if (!app) notFound();

  const { data: tradelineRows } = await supabase
    .from("application_tradelines")
    .select("*")
    .eq("application_id", id)
    .order("created_at", { ascending: true });

  const tradelines = (tradelineRows ?? []).map(rowToTradeline);
  const comparison = normalizeComparison(app.plan_comparison, Number(app.total_debt));
  const months = Math.round(
    (Number(app.plan_months_low) + Number(app.plan_months_high)) / 2,
  );

  return (
    <main className="relative min-h-screen bg-background bg-grid">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 gradient-halo" />
      <div className="container relative z-10 max-w-4xl py-8 sm:py-12">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Debt Angel home">
            <Wordmark size="md" withMark />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> All plans
          </Link>
        </div>

        <header className="mt-6 flex flex-col gap-5 rounded-3xl border border-white/10 bg-card p-5 shadow-soft sm:p-7">
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {currency(Number(app.total_debt))} enrolled
            </h1>
            <p className="text-sm text-muted-foreground">
              Submitted {formatDate(app.created_at)}
            </p>
          </div>
          <PlanStatus status={app.status} />
          <div>
            <Button asChild size="lg">
              <Link href={`/dashboard/${id}/edit`}>
                <Pencil className="h-4 w-4" /> Update my accounts
              </Link>
            </Button>
          </div>
        </header>

        {/* Plan summary */}
        <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Est. all-in cost" value={currency(Number(app.plan_cost_mid))} />
          <Stat
            label="Est. savings"
            value={currency(Number(app.plan_savings_mid))}
            money
          />
          <Stat
            label="Suggested monthly"
            value={`${currency(Number(app.plan_suggested_monthly))}/mo`}
          />
          <Stat label="Est. timeline" value={monthsToLabel(months)} />
        </dl>

        {/* Comparison */}
        {comparison && (
          <div className="mt-8">
            <h2 className="mb-3 font-display text-xl font-semibold">
              Your plan, side by side
            </h2>
            <Assumptions className="mb-4" showDisclaimer={false} />
            <ComparisonView comparison={comparison} />
            <PlanProgressPanel
              className="mt-8"
              comparison={comparison}
              currentMonthlyPayment={Number(app.current_monthly_payment) || 0}
              monthlyBudget={Number(app.monthly_budget) || 0}
            />
          </div>
        )}

        {/* Accounts */}
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Your accounts</h2>
            <Link
              href={`/dashboard/${id}/edit`}
              className="text-sm font-medium text-gold hover:underline"
            >
              Edit
            </Link>
          </div>
          {tradelines.length > 0 ? (
            <TradelineView tradelines={tradelines} />
          ) : (
            <p className="rounded-2xl border border-white/10 bg-card p-6 text-sm text-muted-foreground">
              No accounts on this plan yet.
            </p>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          These figures are illustrative estimates from your submission. An advisor
          will confirm your exact plan.
        </p>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  money,
}: {
  label: string;
  value: string;
  money?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-card px-4 py-3 shadow-soft">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd
        className={`num-display mt-0.5 text-lg font-semibold tabular ${
          money ? "text-money" : "text-foreground"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
