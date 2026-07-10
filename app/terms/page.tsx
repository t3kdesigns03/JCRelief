import type { Metadata } from "next";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Debt Angel Program Terms and Terms of Service — eligibility, fees, your dedicated account, cancellation, risks, and dispute resolution.",
};

/**
 * NOTE FOR THE TEAM: This page reflects the Terms template in
 * /legal/Terms-of-Service.md. It contains [BRACKETED] placeholders and must be
 * reviewed by a licensed attorney and completed before public launch.
 */
export default function TermsOfServicePage() {
  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen bg-background bg-grid">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 gradient-halo" />
        <div className="container relative z-10 mx-auto max-w-3xl py-16 sm:py-20">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Program Terms &amp; Terms of Service
          </h1>
          <p className="mt-3 text-sm text-foreground/50">
            Effective date: July 10, 2026 &middot; Last updated: July 10, 2026
          </p>

          <div className="legal-body mt-10 space-y-8 text-[15px] leading-relaxed text-foreground/75 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_a]:text-gold [&_a]:underline">
            <section className="space-y-3">
              <h2>1. Acceptance of These Terms</h2>
              <p>
                These Program Terms and Terms of Service (the &ldquo;Terms&rdquo;) are
                an agreement between you and [DEBT ANGEL LEGAL ENTITY NAME]
                (&ldquo;Debt Angel,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
                &ldquo;our&rdquo;) governing your use of mydebtangel.com and our
                debt-resolution program and related services (the
                &ldquo;Services&rdquo;). By creating an account, enrolling, or using
                the Services, you agree to these Terms and to our Privacy Policy. If
                you do not agree, do not use the Services. Please read the risk
                disclosures in Section 9 carefully.
              </p>
            </section>

            <section className="space-y-3">
              <h2>2. What Debt Angel Is — and Is Not</h2>
              <p>
                Debt Angel is a consumer-controlled debt-resolution program for
                qualifying unsecured debt. You import or enter your account
                information, see a side-by-side comparison of your current path versus
                an estimated plan, fund a dedicated account you control, and review and
                approve every settlement before it happens.
              </p>
              <p>
                Debt Angel is not bankruptcy, a foreclosure-prevention or
                mortgage-modification program, a repossession-prevention program, or a
                short-sale service. We are not a lender, credit repair organization,
                credit counseling agency, or law firm, and we do not provide legal,
                tax, or financial advice. Secured debts such as mortgages and auto
                loans generally do not qualify, and some debts, creditors, and states
                are not eligible.
              </p>
            </section>

            <section className="space-y-3">
              <h2>3. Eligibility and Availability</h2>
              <p>
                To use the Services you must be at least 18 years old, be a resident
                of a state where the Services are offered, and have qualifying
                unsecured debt. The Services are not available in all states. We may
                decline enrollment, or determine that the program is not a good fit for
                your situation, and we will be honest with you when that is the case.
              </p>
            </section>

            <section className="space-y-3">
              <h2>4. Program Overview and Your Control</h2>
              <ul>
                <li>You choose which qualifying unsecured accounts to enroll.</li>
                <li>
                  We provide tools and, if you want, advisor assistance to help you
                  build and track your plan.
                </li>
                <li>
                  We may communicate and negotiate with your creditors and collectors
                  regarding potential resolutions.
                </li>
                <li>
                  You approve every settlement. No settlement is accepted, and no funds
                  are disbursed to a creditor, without your authorization.
                </li>
                <li>You may move through the program self-serve or with advisor support.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>5. Fees — No Upfront Fees; Performance-Based Pricing</h2>
              <ul>
                <li>We charge no upfront fees. You are not charged simply to enroll.</li>
                <li>
                  Our pricing is performance-based: a fee becomes due only after a debt
                  you enrolled is actually resolved through the program and consistent
                  with applicable law. The fee is a percentage of the enrolled debt
                  (typically [18&ndash;25]%, disclosed to you in writing before you
                  commit).
                </li>
                <li>
                  Fees are paid from your dedicated account only after a settlement is
                  reached and, where required, a payment toward that settlement has been
                  made.
                </li>
                <li>
                  There is no prepayment penalty. If you complete or leave the program
                  early, you pay no additional charge beyond fees already earned.
                </li>
                <li>
                  The all-in cost estimate and the estimated difference versus
                  continuing minimum payments are shown before you commit. Estimates are
                  illustrative, not guarantees.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>6. Your Dedicated Account</h2>
              <ul>
                <li>
                  To participate, you fund a dedicated account that you own and
                  control, typically held at a third-party financial institution and
                  administered by an independent account provider.
                </li>
                <li>
                  The funds in the dedicated account are yours. You may withdraw your
                  funds and are entitled to them (less any fees already earned and any
                  account-provider fees) at any time, subject to the account
                  provider&rsquo;s terms.
                </li>
                <li>
                  You authorize deposits and specific disbursements. We do not take
                  ownership of your settlement funds.
                </li>
                <li>
                  The account provider&rsquo;s separate agreement, fees, and privacy
                  practices apply, and you should review them.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>7. Your Responsibilities</h2>
              <ul>
                <li>Provide accurate, current, and complete information, and keep it updated.</li>
                <li>Make consistent deposits into your dedicated account as needed.</li>
                <li>
                  Review communications, comparisons, and proposed settlements, and make
                  your own decisions.
                </li>
                <li>
                  Understand that you remain responsible for your debts and for reviewing
                  any settlement documents.
                </li>
                <li>Not use the Services for any unlawful or unauthorized purpose.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>8. Cancellation and Refunds</h2>
              <ul>
                <li>
                  You may cancel at any time, for any reason, by contacting us at{" "}
                  <a href={`mailto:${site.email}`}>{site.email}</a> or{" "}
                  {site.phone}.
                </li>
                <li>
                  On cancellation, you are entitled to the funds remaining in your
                  dedicated account, less any performance-based fees already earned for
                  debts that were resolved and any account-provider fees.
                </li>
                <li>
                  Because there are no upfront fees, you are not charged for settlements
                  that have not occurred.
                </li>
                <li>
                  [ADD any additional cancellation, cooling-off, or refund rights
                  required by your state(s), as confirmed by counsel.]
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>9. Important Risks and Disclosures</h2>
              <ul>
                <li>
                  <strong>Credit impact:</strong> Enrolling and allowing accounts to
                  become or remain delinquent while balances are negotiated may
                  negatively affect your credit during the program. Recovery afterward
                  is possible but not guaranteed and varies by individual.
                </li>
                <li>
                  <strong>Collection activity and lawsuits:</strong> Creditors and
                  collectors may continue collection efforts, add interest, fees, and
                  penalties, and may sue you while you are enrolled. Debt Angel is not a
                  law firm and does not provide legal representation.
                </li>
                <li>
                  <strong>Not all debts settle:</strong> Creditors are not required to
                  negotiate or accept any settlement. Results vary based on your
                  creditors, balances, delinquency, state, and your ability to fund your
                  plan consistently.
                </li>
                <li>
                  <strong>No guarantee of results:</strong> We do not guarantee that any
                  debt will be settled, the amount or percentage of any reduction, the
                  timeline, or any particular savings.
                </li>
                <li>
                  <strong>Tax consequences:</strong> Forgiven or canceled debt may be
                  treated as taxable income, and creditors may issue a Form 1099-C
                  (generally for $600 or more), although exclusions such as insolvency
                  may apply. Consult a tax professional.
                </li>
                <li>
                  <strong>Not legal, tax, or financial advice:</strong> Information we
                  provide is for general educational purposes only.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>10. Disclaimer of Warranties</h2>
              <p>
                The Services are provided &ldquo;as is&rdquo; and &ldquo;as
                available,&rdquo; without warranties of any kind, express or implied,
                including implied warranties of merchantability, fitness for a
                particular purpose, and non-infringement, to the fullest extent
                permitted by law. We do not warrant that the Services will be
                uninterrupted, error-free, or achieve any particular outcome.
              </p>
            </section>

            <section className="space-y-3">
              <h2>11. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, [DEBT ANGEL LEGAL ENTITY NAME]
                and its officers, employees, and agents will not be liable for any
                indirect, incidental, special, consequential, or punitive damages, or
                for lost profits, arising out of or relating to the Services. Our total
                liability for any claim relating to the Services will not exceed the
                total fees you paid to us in the [TWELVE (12)] months before the event
                giving rise to the claim. Some jurisdictions do not allow certain
                limitations, so parts of this section may not apply to you.
              </p>
            </section>

            <section className="space-y-3">
              <h2>12. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless [DEBT ANGEL LEGAL ENTITY NAME]
                from claims, losses, and expenses arising out of your misuse of the
                Services or your violation of these Terms or applicable law, except to
                the extent caused by our own misconduct.
              </p>
            </section>

            <section className="space-y-3">
              <h2>13. Governing Law and Dispute Resolution</h2>
              <p>
                These Terms are governed by the laws of the State of [STATE], without
                regard to its conflict-of-laws rules. [SELECT AND HAVE COUNSEL DRAFT a
                dispute-resolution mechanism — for example, informal resolution first,
                then binding arbitration on an individual basis with a class-action
                waiver, or venue and jurisdiction in the courts of [COUNTY, STATE].]
                Nothing in these Terms limits any non-waivable rights you have under
                applicable consumer-protection law.
              </p>
            </section>

            <section className="space-y-3">
              <h2>14. Changes to These Terms</h2>
              <p>
                We may update these Terms from time to time. We will post the updated
                version with a new &ldquo;Last updated&rdquo; date and, where required,
                provide additional notice. Changes apply prospectively, and your
                continued use of the Services after they take effect means you accept
                them.
              </p>
            </section>

            <section className="space-y-3">
              <h2>15. State Availability Disclaimer</h2>
              <p>
                The Services are offered only in states where Debt Angel is authorized
                to operate and are subject to state-specific terms, fee limits, and
                disclosures. Program availability, pricing, and terms may vary by state.
                See our{" "}
                <a href="/state-availability">state availability</a> page for details.
              </p>
            </section>

            <section className="space-y-3">
              <h2>16. Contact Us</h2>
              <p>
                [DEBT ANGEL LEGAL ENTITY NAME], [MAILING ADDRESS]
                <br />
                Email: <a href={`mailto:${site.email}`}>{site.email}</a>
                <br />
                Phone: {site.phone}
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
