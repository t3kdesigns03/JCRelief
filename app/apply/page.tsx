import type { Metadata } from "next";
import { ApplyWizard } from "@/components/ApplyWizard";
import { parseApplyPrefill } from "@/lib/apply-prefill";

export const metadata: Metadata = {
  title: "Build your plan",
  description:
    "Map your accounts, review each tradeline, and see your current path next to a Debt Angel plan in real dollars — self-serve, in minutes.",
};

type ApplyPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ApplyPage({ searchParams }: ApplyPageProps) {
  const params = await searchParams;
  const prefill = parseApplyPrefill(params);

  return (
    <main className="relative min-h-screen bg-background bg-grid">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 gradient-halo" />
      <div className="container relative z-10 py-8 sm:py-12">
        <ApplyWizard prefill={prefill} />
      </div>
    </main>
  );
}
