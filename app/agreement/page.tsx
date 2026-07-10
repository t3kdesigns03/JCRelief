import type { Metadata } from "next";
import { ShieldCheck, FileText } from "lucide-react";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { PrintButton } from "@/components/shared/print-button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sample Program Agreement",
  description:
    "The full sample Debt Angel Program / Client Agreement — every required disclosure, fee schedule, dedicated-account rights, cancellation terms, and risk and tax warnings, in plain English. Review it in full before you enroll.",
};

/**
 * NOTE FOR THE TEAM: This is a SAMPLE agreement for pre-enrollment review. It
 * contains [BRACKETED] placeholders (legal entity, governing-law state, mailing
 * address) that must be completed and reviewed by licensed counsel before the
 * signed, customer-specific agreement is generated.
 */
export default function ProgramAgreementPage() {
  return (
    <>
      <div data-print-hide>
        <SiteHeader />
      </div>

      <main className="relative min-h-screen bg-background bg-grid print:bg-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 gradient-halo print:hidden" />
        <div className="container relative z-10 mx-auto max-w-3xl py-16 sm:py-20 print:py-6">
          {/* Sample banner */}
          <div
            className="mb-8 flex items-start gap-3 rounded-2xl border border-gold/40 bg-gold/[0.07] p-4 sm:p-5 print:border-gray-400 print:bg-transparent"
            role="note"
          >
            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
            <div>
              <p className="text-sm font-semibold text-foreground">
                This is a sample agreement for your review.
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-foreground/70">
                It shows exactly what our program terms look like so you can read
                everything before you commit. Your actual signed agreement is
                customized to your accounts, your state, and your plan after an
                eligibility review — and you will be able to read it in full and
                approve it before anything moves forward.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Program / Client Agreement
              </h1>
              <p className="mt-3 text-sm text-foreground/50">
                Sample version &middot; Effective date of your agreement: [DATE at
                enrollment]
              </p>
            </div>
            <PrintButton className="print:hidden" />
          </div>

          <div className="legal-body mt-10 space-y-8 text-[15px] leading-relaxed text-foreground/75 print:text-black [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:font-semibold [&_h3]:text-foreground/90 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_a]:text-gold [&_a]:underline">
            <section className="space-y-3">
              <h2>1. The Parties and What This Agreement Covers</h2>
              <p>
                This Program / Client Agreement (the &ldquo;Agreement&rdquo;) is
                between you (the &ldquo;Client&rdquo;) and [DEBT ANGEL LEGAL ENTITY
                NAME] (&ldquo;Debt Angel,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo;
                or &ldquo;our&rdquo;). It governs your enrollment in and use of the
                Debt Angel debt-resolution program for qualifying unsecured debt
                (the &ldquo;Program&rdquo;). Please read it in full. It is written
                to be clear, not to hide anything.
              </p>
            </section>

            <section className="space-y-3">
              <h2>2. What Debt Angel Is — and Is Not</h2>
              <p>
                Debt Angel is a consumer-controlled debt-resolution program. You
                choose which qualifying unsecured accounts to enroll, you fund a
                dedicated account that you own and control, and you review and
                approve every settlement before it happens.
              </p>
              <p>
                Debt Angel is <strong>not</strong> a lender, credit repair
                organization, credit counseling agency, or law firm, and we do not
                provide legal, tax, or financial advice. The Program is{" "}
                <strong>not</strong> bankruptcy, a foreclosure-prevention or
                mortgage-modification program, a repossession-prevention program, or
                a short-sale service. Secured debts such as mortgages and auto
                loans, most student loans, taxes, and child support generally do not
                qualify. The Program is not available in all states, and some debts,
                creditors, and situations may not qualify.
              </p>
            </section>

            <section className="space-y-3">
              <h2>3. Required Disclosures — Please Read Carefully</h2>
              <p>
                Federal law (the FTC Telemarketing Sales Rule) requires that you
                receive the following four disclosures before you enroll. We put
                them here, up front, in plain English.
              </p>

              <h3>3.1 Cost of the service</h3>
              <p>
                There are <strong>no upfront fees</strong>. Our fee is
                performance-based: it is typically{" "}
                <strong>[18&ndash;25]% of the enrolled debt</strong> (or of the
                savings achieved on it) and becomes due only after a debt you
                enrolled has been successfully resolved and you have approved that
                settlement. Any fee figure shown before then is an estimate;{" "}
                <strong>
                  your actual fee is calculated only after a successful settlement.
                </strong>{" "}
                The specific fee method and percentage that apply to you will be
                stated in your customized agreement.
              </p>

              <h3>3.2 Good-faith estimate of how long it will take</h3>
              <p>
                Most Program plans run about <strong>24 to 48 months</strong>. Your
                personalized estimate is shown in your plan view. Your actual
                timeline depends on how consistently you fund your dedicated account
                and whether your creditors choose to participate. This is a
                good-faith estimate, not a guarantee.
              </p>

              <h3>3.3 Amount you must save before a settlement</h3>
              <p>
                Before a settlement offer is made on any enrolled account, you must
                accumulate enough money in your dedicated account to cover a
                realistic settlement for that account <strong>plus</strong> the
                performance-based fee on it. Because accounts are resolved one at a
                time, the total that must be saved increases as your plan
                progresses. Your side-by-side plan view shows how your balance
                builds toward each resolution.
              </p>

              <h3>3.4 Negative consequences of stopping timely payments</h3>
              <p>
                A resolution program often involves letting accounts become or remain
                delinquent while balances are negotiated. If you stop making timely
                payments to your creditors:
              </p>
              <ul>
                <li>
                  Your <strong>credit score can be damaged</strong>, often
                  significantly, and negative marks can remain on your credit report
                  for years.
                </li>
                <li>
                  Creditors and collectors may{" "}
                  <strong>continue collection efforts</strong>, add{" "}
                  <strong>late fees and interest</strong> that increase the total you
                  owe, and may <strong>file a lawsuit</strong> against you. Debt
                  Angel is not a law firm and does not provide legal representation.
                </li>
                <li>
                  <strong>Not all debts settle.</strong> Creditors are not required to
                  negotiate or accept any offer.
                </li>
                <li>
                  <strong>Forgiven debt may be taxable.</strong> The IRS may treat a
                  forgiven balance (generally $600 or more per creditor) as taxable
                  income, and you may receive a <strong>Form 1099-C</strong>, although
                  exclusions such as insolvency may apply. Consult a tax professional.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>4. Fees and How They Are Charged</h2>
              <ul>
                <li>No fee is charged simply to enroll.</li>
                <li>
                  A performance-based fee (typically [18&ndash;25]%) is earned only
                  after an enrolled debt is settled and you have approved the
                  settlement.
                </li>
                <li>
                  Fees are paid from your dedicated account only after a settlement
                  is reached and, where required, a payment toward that settlement
                  has been made.
                </li>
                <li>
                  <strong>No prepayment penalty.</strong> If you finish or leave the
                  Program early, you pay nothing beyond fees already earned on debts
                  that were actually settled.
                </li>
                <li>
                  Your customized agreement will contain a complete fee schedule
                  with the exact percentage and calculation method that apply to you.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>5. Your Dedicated Account — Your Money, Your Control</h2>
              <ul>
                <li>
                  You fund a dedicated account held at an{" "}
                  <strong>FDIC-insured institution</strong>, administered by an
                  independent account provider.
                </li>
                <li>
                  <strong>You own and control the funds at all times.</strong> Debt
                  Angel does not take ownership of your settlement money.
                </li>
                <li>
                  You authorize each deposit and each specific disbursement. No funds
                  go to a creditor without your approval.
                </li>
                <li>
                  The account provider&rsquo;s separate agreement, fees, and privacy
                  practices apply, and you should review them.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>6. Canceling and Withdrawing — Your Right to Leave</h2>
              <ul>
                <li>
                  You may <strong>withdraw from the Program at any time, for any
                  reason, without penalty.</strong>
                </li>
                <li>
                  On withdrawal, you receive{" "}
                  <strong>
                    all remaining funds in your dedicated account
                  </strong>{" "}
                  — minus only performance-based fees already earned on debts that
                  were actually settled and any account-provider fees —{" "}
                  <strong>within seven (7) business days.</strong>
                </li>
                <li>
                  Because there are no upfront fees, you are never charged for
                  settlements that have not occurred.
                </li>
                <li>
                  [ADD any additional cancellation, cooling-off, or refund rights
                  required by your state(s), as confirmed by counsel.]
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>7. Your Responsibilities</h2>
              <ul>
                <li>
                  Provide accurate, current, and complete information, and keep it
                  updated.
                </li>
                <li>Fund your dedicated account consistently as planned.</li>
                <li>
                  Review communications, comparisons, and proposed settlements, and
                  make your own decisions.
                </li>
                <li>
                  Understand that you remain responsible for your debts and for
                  reviewing any settlement documents before you approve them.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>8. No Guarantee of Results</h2>
              <p>
                We do not guarantee that any particular debt will be settled, the
                amount or percentage of any reduction, the timeline, or any specific
                savings or credit outcome. Results vary based on your creditors, your
                balances and delinquency, your state, and your ability to fund your
                plan consistently. Any estimates or examples are illustrative only
                and are not an offer or a guarantee.
              </p>
            </section>

            <section className="space-y-3">
              <h2>9. Credit and Tax Warnings</h2>
              <p>
                Participating in the Program may negatively affect your credit while
                accounts are delinquent, and recovery afterward is possible but not
                guaranteed. Forgiven debt may be treated as taxable income and
                reported on a Form 1099-C. We are not a law firm or a tax advisor, and
                nothing here is legal or tax advice. Please consult the appropriate
                professional about your situation.
              </p>
            </section>

            <section className="space-y-3">
              <h2>10. State Availability</h2>
              <p>
                The Program is offered only in states where Debt Angel is authorized
                to operate and is subject to state-specific terms, fee limits, and
                disclosures. Availability, pricing, and terms may vary by state. See
                our <a href="/state-availability">state availability</a> page, and
                note that additional state-required disclosures may be included in
                your customized agreement.
              </p>
            </section>

            <section className="space-y-3">
              <h2>11. Privacy and Communications</h2>
              <p>
                Our handling of your information is described in our{" "}
                <a href="/privacy">Privacy Policy</a>, and your use of the Services is
                also governed by our <a href="/terms">Terms of Service</a>. By
                enrolling you agree to those documents together with this Agreement.
              </p>
            </section>

            <section className="space-y-3">
              <h2>12. Governing Law and Dispute Resolution</h2>
              <p>
                This Agreement is governed by the laws of the State of [STATE],
                without regard to its conflict-of-laws rules. [SELECT AND HAVE COUNSEL
                DRAFT a dispute-resolution mechanism — for example, informal
                resolution first, then the agreed forum.] Nothing in this Agreement
                limits any non-waivable rights you have under applicable
                consumer-protection law.
              </p>
            </section>

            <section className="space-y-3">
              <h2>13. How to Reach Us</h2>
              <p>
                [DEBT ANGEL LEGAL ENTITY NAME], [MAILING ADDRESS]
                <br />
                Email:{" "}
                <a href={`mailto:${site.email}`}>{site.email}</a>
                <br />
                Phone: {site.phone}
              </p>
            </section>

            <div className="flex items-start gap-3 rounded-2xl border border-money/25 bg-money/[0.07] p-4 sm:p-5 print:border-gray-400 print:bg-transparent">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-money" aria-hidden />
              <p className="text-[13px] leading-relaxed text-foreground/75">
                <strong className="text-foreground">Nothing moves without you.</strong>{" "}
                No upfront fees, no settlement without your approval, and your money
                stays yours. You can read your full customized agreement and walk away
                at any time before you enroll — and after.
              </p>
            </div>
          </div>
        </div>
      </main>

      <div data-print-hide>
        <SiteFooter />
      </div>
    </>
  );
}
