import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { ComparisonView } from "@/components/shared/comparison-view";
import { Assumptions } from "@/components/shared/Assumptions";
import { Button } from "@/components/ui/button";
import { estimate, buildComparison } from "@/lib/estimator";
import { buildApplyUrl } from "@/lib/apply-prefill";

export function ComparisonTeaser() {
  const inputs = {
    totalDebt: 32000,
    currentMonthlyPayment: 800,
    monthlyBudget: 560,
  };
  const comparison = buildComparison(inputs, estimate(inputs));

  return (
    <section
      id="comparison"
      className="section scroll-mt-24 border-y border-white/5 bg-white/[0.02]"
    >
      <div className="container">
        <SectionHeading
          eyebrow="See the whole picture"
          title="The moment it clicks"
          description="A powerful, honest comparison of your current path versus your Debt Angel plan — new monthly amount, total cost, time saved, and total savings. This is the number that changes everything."
        />

        <div className="mx-auto mt-12 max-w-3xl">
          <ComparisonView comparison={comparison} />
          <Assumptions className="mt-4" />
          <div className="mt-8 text-center">
            <Button asChild size="lg">
              <Link href={buildApplyUrl(inputs.totalDebt, inputs.monthlyBudget)}>
                See my real comparison <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Example figures. Your plan is built from your actual accounts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
