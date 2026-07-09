import type { Metadata } from "next";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Debt Angel collects, uses, shares, and protects your personal and financial information.",
};

/**
 * NOTE FOR THE TEAM: This page reflects the Privacy Policy template in
 * /legal/Privacy-Policy.md. It contains [BRACKETED] placeholders and must be
 * reviewed by a licensed attorney and completed before public launch.
 */
export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen bg-background bg-grid">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 gradient-halo" />
        <div className="container relative z-10 mx-auto max-w-3xl py-16 sm:py-20">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-foreground/50">
            Effective date: [DATE] &middot; Last updated: [DATE]
          </p>

          <div className="legal-body mt-10 space-y-8 text-[15px] leading-relaxed text-foreground/75 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:font-semibold [&_h3]:text-foreground/90 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_a]:text-gold [&_a]:underline">
            <section className="space-y-3">
              <h2>1. Introduction</h2>
              <p>
                This Privacy Policy explains how [DEBT ANGEL LEGAL ENTITY NAME]
                (&ldquo;Debt Angel,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
                &ldquo;our&rdquo;) collects, uses, shares, and protects information
                about you when you visit mydebtangel.com (the &ldquo;Site&rdquo;),
                create an account, or use our debt-resolution program and related
                services (together, the &ldquo;Services&rdquo;).
              </p>
              <p>
                Debt Angel provides a consumer-controlled debt-resolution program
                for qualifying unsecured debt. We are not a lender, credit repair
                organization, credit counseling agency, or law firm, and we do not
                provide legal or tax advice. Our Services are not available in all
                states. By using the Services, you agree to the practices described
                in this Policy.
              </p>
            </section>

            <section className="space-y-3">
              <h2>2. Information We Collect</h2>
              <h3>Information you provide to us</h3>
              <ul>
                <li>
                  Identity and contact details: name, mailing address, email
                  address, telephone number, and date of birth.
                </li>
                <li>
                  Verification information used to confirm your identity where
                  required.
                </li>
                <li>Account credentials and authentication information.</li>
              </ul>
              <h3>Financial and debt information you import or enter</h3>
              <ul>
                <li>
                  Details of the accounts you add to build your plan: creditor and
                  collector names, account or &ldquo;tradeline&rdquo; identifiers,
                  balances, credit limits, interest rates (APR), open dates,
                  delinquency or account status, and minimum payments.
                </li>
                <li>
                  Information about your financial situation, such as income,
                  monthly budget, employment, and hardship information you choose to
                  share.
                </li>
                <li>
                  Dedicated-account and payment information, such as bank account and
                  routing details, and records of deposits, disbursements, and fees.
                </li>
              </ul>
              <h3>Information created when you use the Services</h3>
              <ul>
                <li>
                  Plan, comparison, settlement, approval, and communication history,
                  including the settlements you review and approve.
                </li>
              </ul>
              <h3>Information collected automatically and from third parties</h3>
              <ul>
                <li>
                  Device and usage information (such as IP address, browser type, and
                  pages viewed) collected through cookies and similar technologies.
                </li>
                <li>
                  Information from your creditors, collectors, payment processors, and
                  identity-verification vendors that support the Services.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>3. How We Use Your Information</h2>
              <ul>
                <li>Create and manage your account and authenticate you.</li>
                <li>
                  Build your plan, generate side-by-side comparisons and estimates,
                  and show you your options.
                </li>
                <li>
                  Communicate with creditors and collectors and negotiate potential
                  resolutions that you review and approve.
                </li>
                <li>
                  Set up and administer your dedicated account, process deposits and
                  authorized disbursements, and calculate performance-based fees.
                </li>
                <li>
                  Provide support, send service-related messages, and (where
                  permitted) informational or marketing messages you can opt out of.
                </li>
                <li>Detect and prevent fraud, security issues, and misuse.</li>
                <li>
                  Comply with legal, regulatory, and record-keeping obligations that
                  apply to debt-relief services, and improve the Services.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>4. How We Share Information</h2>
              <p>
                We share information only as described below. We do not sell your
                personal information for money. To the extent any advertising-related
                sharing is treated as a &ldquo;sale&rdquo; or &ldquo;sharing&rdquo;
                under state law, see Section 8 for your opt-out rights.
              </p>
              <ul>
                <li>
                  With your creditors and collectors, at your direction and with your
                  approval, to negotiate and document resolutions.
                </li>
                <li>
                  With payment processors and the dedicated-account provider to
                  operate your dedicated account and process deposits, authorized
                  disbursements, and fees.
                </li>
                <li>
                  With service providers and vendors (hosting, verification,
                  analytics, communications, support) under contracts that limit their
                  use of your information.
                </li>
                <li>With professional advisors such as auditors and lawyers.</li>
                <li>
                  For legal and safety reasons, and in connection with a merger,
                  acquisition, financing, or sale of assets.
                </li>
                <li>With your consent, for any other purpose disclosed to you.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>5. Data Security</h2>
              <p>
                We maintain administrative, technical, and physical safeguards
                designed to protect your information, including encryption in transit,
                access controls, and monitoring. No method of transmission or storage
                is completely secure, and we cannot guarantee absolute security.
                Please protect your account credentials and notify us promptly of any
                suspected unauthorized use.
              </p>
            </section>

            <section className="space-y-3">
              <h2>6. Cookies and Tracking Technologies</h2>
              <p>
                We and our providers use cookies and similar technologies to operate
                the Site, remember your preferences, measure performance, and
                understand usage. You can control cookies through your browser
                settings; disabling some cookies may affect how the Site works. Where
                required, we honor recognized opt-out preference signals (such as
                Global Privacy Control).
              </p>
            </section>

            <section className="space-y-3">
              <h2>7. Data Retention</h2>
              <p>
                We keep your information for as long as your account is active and
                afterward as needed to comply with legal, regulatory, tax, accounting,
                dispute-resolution, and record-keeping obligations that apply to
                debt-relief providers. When information is no longer needed, we delete
                or de-identify it.
              </p>
            </section>

            <section className="space-y-3">
              <h2>8. Your Privacy Rights and Choices</h2>
              <p>Depending on where you live, you may have rights to:</p>
              <ul>
                <li>Access or receive a copy of your personal information.</li>
                <li>Correct inaccurate personal information.</li>
                <li>Delete personal information, subject to legal exceptions.</li>
                <li>Obtain your information in a portable format.</li>
                <li>
                  Opt out of the &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of
                  personal information and of certain targeted advertising and
                  profiling.
                </li>
                <li>Limit the use of certain sensitive personal information.</li>
                <li>Withdraw consent and opt out of marketing communications.</li>
              </ul>
              <p>
                To exercise these rights, contact us using Section 11. We will verify
                your request, allow an authorized agent where the law permits, respond
                within the time required by applicable law, and will not discriminate
                against you for exercising your rights.
              </p>
            </section>

            <section className="space-y-3">
              <h2>9. State-Specific Disclosures</h2>
              <p>
                <strong>California (CCPA/CPRA):</strong> California residents have the
                rights described above, including the rights to know, delete, correct,
                and opt out of the sale/sharing of personal information and limit use
                of sensitive personal information. California&rsquo;s &ldquo;Shine the
                Light&rdquo; law lets residents request information about certain
                disclosures for third-party direct marketing; we do not share personal
                information with third parties for their own direct marketing without
                your consent.
              </p>
              <p>
                <strong>Virginia, Colorado, Connecticut, Utah, and other states:</strong>{" "}
                Residents of states with comprehensive privacy laws have the rights
                described above to the extent those laws apply, including the right to
                appeal a denied request.
              </p>
              <p>
                <strong>Program availability:</strong> The Services and certain rights
                or disclosures may vary by state, and the program is not available in
                all states. [INSERT ANY ADDITIONAL STATE-REQUIRED DISCLOSURES
                IDENTIFIED BY COUNSEL.]
              </p>
            </section>

            <section className="space-y-3">
              <h2>10. Additional Information</h2>
              <ul>
                <li>
                  <strong>Children&rsquo;s privacy:</strong> The Services are intended
                  for adults 18 and older. We do not knowingly collect personal
                  information from children.
                </li>
                <li>
                  <strong>Third-party links:</strong> The Site may link to third-party
                  websites whose privacy practices are their own.
                </li>
                <li>
                  <strong>Changes to this Policy:</strong> We may update this Policy
                  and will post the updated version with a new &ldquo;Last
                  updated&rdquo; date and, where required, additional notice.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2>11. Contact Us</h2>
              <p>
                [DEBT ANGEL LEGAL ENTITY NAME], Attn: Privacy, [MAILING ADDRESS]
                <br />
                Email: <a href="mailto:hello@mydebtangel.com">hello@mydebtangel.com</a>
                <br />
                Phone: [PHONE]
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
