"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ChevronDown,
  Info,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import {
  dedicatedAccountRights,
  keyRisksRights,
  noAdvanceFee,
  tsrDisclosures,
} from "@/lib/disclosures";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────────────
 * KeyRisksRights
 * Compact, consistent "Key risks & your rights" callout. Drop it onto any
 * surface that mentions funding, stopping minimums, or settlements.
 * ────────────────────────────────────────────────────────────────────────── */
export function KeyRisksRights({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "rounded-2xl border border-gold/30 bg-gold/[0.06] p-4 shadow-soft sm:p-5",
        className,
      )}
      aria-label="Key risks and your rights"
    >
      <p className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
        <AlertTriangle className="h-4 w-4 shrink-0 text-gold" aria-hidden />
        {keyRisksRights.heading}
      </p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gold/90">
            Risks to understand
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[13px] leading-relaxed text-foreground/75 marker:text-gold/60">
            {keyRisksRights.risks.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-money">
            Your rights
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[13px] leading-relaxed text-foreground/75 marker:text-money/60">
            {keyRisksRights.rights.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * TsrDisclosureSummary
 * The four mandatory pre-enrollment disclosures, plainly. Use `variant="full"`
 * for standalone surfaces and `variant="compact"` inside the wizard.
 * ────────────────────────────────────────────────────────────────────────── */
export function TsrDisclosureSummary({
  variant = "full",
  className,
}: {
  variant?: "full" | "compact";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-card p-4 shadow-soft sm:p-5",
        className,
      )}
      aria-label="Required pre-enrollment disclosures"
    >
      <p className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
        <Info className="h-4 w-4 shrink-0 text-gold" aria-hidden />
        Before you enroll — the four things to understand
      </p>
      <ol className="mt-3 space-y-2.5">
        {tsrDisclosures.map((d, i) => (
          <li key={d.key} className="flex gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/15 text-[11px] font-bold text-gold">
              {i + 1}
            </span>
            <p className="text-[13px] leading-relaxed text-foreground/80">
              <span className="font-semibold text-foreground">{d.title}: </span>
              {variant === "full" ? d.body : d.short}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * DedicatedAccountRights
 * "Your money, your control" block. Used on the estimator, wizard, homepage.
 * ────────────────────────────────────────────────────────────────────────── */
export function DedicatedAccountRights({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "rounded-2xl border border-money/25 bg-money/[0.07] p-4 shadow-soft sm:p-5",
        className,
      )}
      aria-label={dedicatedAccountRights.heading}
    >
      <p className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
        <Landmark className="h-4 w-4 shrink-0 text-money" aria-hidden />
        {dedicatedAccountRights.heading}
      </p>
      <ul className="mt-3 list-disc space-y-1.5 pl-4 text-[13px] leading-relaxed text-foreground/75 marker:text-money/60">
        {dedicatedAccountRights.points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </aside>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * ImportantDisclosuresPanel
 * Collapsible, strong-visual-weight panel bundling the negative-consequence
 * and dedicated-account language. Open by default. Used on the estimator.
 * ────────────────────────────────────────────────────────────────────────── */
export function ImportantDisclosuresPanel({
  className,
  defaultOpen = true,
}: {
  className?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-gold/40 bg-gold/[0.05] shadow-soft",
        className,
      )}
      aria-label="Important disclosures"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left sm:px-5"
      >
        <span className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
          <AlertTriangle className="h-4 w-4 shrink-0 text-gold" aria-hidden />
          Important disclosures — read before you decide
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-gold transition-transform duration-300",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {open && (
        <div className="space-y-4 border-t border-gold/20 px-4 py-4 sm:px-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gold/90">
              If you stop paying your creditors
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[13px] leading-relaxed text-foreground/80 marker:text-gold/60">
              <li>
                Your credit score can be damaged, often significantly, while
                accounts go delinquent.
              </li>
              <li>
                Creditors may add late fees and interest that increase your
                balance, keep collecting, and can file a lawsuit. We are not a
                law firm.
              </li>
              <li>
                Not all debts settle — creditors are not required to accept any
                offer.
              </li>
              <li>
                Forgiven debt may be taxable and reported on a Form 1099-C.
                Consider talking to a tax professional.
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-money/25 bg-money/[0.07] p-3.5">
            <p className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
              <Landmark className="h-4 w-4 shrink-0 text-money" aria-hidden />
              {dedicatedAccountRights.heading}
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[13px] leading-relaxed text-foreground/80 marker:text-money/60">
              {dedicatedAccountRights.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <p className="flex items-center gap-2 border-t border-gold/20 pt-3 text-[12px] font-medium text-foreground/70">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-money" aria-hidden />
            {noAdvanceFee}
          </p>
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            See the full{" "}
            <Link href="/agreement" className="font-medium text-gold hover:underline">
              Program Agreement
            </Link>
            ,{" "}
            <Link href="/terms" className="font-medium text-gold hover:underline">
              Terms
            </Link>
            , and{" "}
            <Link href="/privacy" className="font-medium text-gold hover:underline">
              Privacy Policy
            </Link>{" "}
            before enrolling.
          </p>
        </div>
      )}
    </section>
  );
}
