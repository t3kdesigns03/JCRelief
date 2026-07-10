import Link from "next/link";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/reveal";

/**
 * Plain statement of what Debt Angel is designed for — and what it is not.
 * Language sourced from the Compliant Language Reference v1.0.
 */
export function WhatItIs() {
  return (
    <section
      id="what-it-is"
      className="section scroll-mt-24 my-4 border-y border-white/5 bg-white/[0.015] md:my-8"
    >
      <div className="container">
        <SectionHeading
          eyebrow="Know what you're getting"
          title="What Debt Angel is designed for — and what it is not"
          description="Designed for qualifying unsecured debt only. Some debts, creditors, and states may not be eligible."
        />

        <div className="mx-auto mt-12 grid max-w-4xl items-stretch gap-5 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl border border-money/20 bg-money/[0.06] p-7 shadow-soft sm:p-8">
              <h3 className="font-display text-lg font-semibold text-money">
                What it is
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-foreground/75">
                Debt Angel is a debt resolution program for qualifying unsecured
                debt — such as credit cards, personal loans, and certain medical
                bills. You stay in control and approve every settlement. There are
                no upfront fees; pricing is performance-based.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="h-full rounded-3xl border border-white/10 bg-white/[0.03] p-7 shadow-soft sm:p-8">
              <h3 className="font-display text-lg font-semibold">What it is not</h3>
              <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-foreground/75">
                <li>Debt Angel is not bankruptcy.</li>
                <li>
                  It is not a foreclosure prevention or mortgage modification
                  program.
                </li>
                <li>It is not a repossession prevention program.</li>
                <li>It is not a short-sale service.</li>
                <li>
                  It does not work with secured debts such as mortgages or auto
                  loans in most cases.
                </li>
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-foreground/60">
            <span className="font-semibold text-foreground/80">
              Eligibility &amp; availability:
            </span>{" "}
            Debt Angel is available only in states where it is authorized to
            operate, and some debts, creditors, and situations may not qualify.
            You can review the full{" "}
            <Link
              href="/agreement"
              className="font-medium text-gold hover:underline"
            >
              Program Agreement
            </Link>{" "}
            before enrolling and{" "}
            <Link
              href="/state-availability"
              className="font-medium text-gold hover:underline"
            >
              check state availability
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
