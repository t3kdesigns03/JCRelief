import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";

export const metadata: Metadata = {
  title: "State Availability",
  description:
    "Where the Debt Angel program is available. Program availability, pricing, and terms vary by state.",
};

/**
 * NOTE FOR THE TEAM: The Debt Angel program is regulated at the state level and
 * is not available in all states. Replace the placeholder list below with the
 * states where the company is actually authorized to operate, as confirmed by
 * counsel, before public launch.
 */
const eligibleStates: string[] = [
  // [REPLACE WITH ACTUAL AUTHORIZED STATES — e.g. "Texas", "Florida", ...]
];

export default function StateAvailabilityPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative min-h-screen bg-background bg-grid">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 gradient-halo" />
        <div className="container relative z-10 mx-auto max-w-3xl py-16 sm:py-20">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            State availability
          </h1>
          <p className="mt-3 text-sm text-foreground/50">Last updated: [DATE]</p>

          <div className="legal-body mt-10 space-y-8 text-[15px] leading-relaxed text-foreground/75 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_a]:text-gold [&_a]:underline">
            <section className="space-y-3">
              <h2>Where Debt Angel is offered</h2>
              <p>
                The Debt Angel program is regulated at the state level and is{" "}
                <strong>not available in all states</strong>. We offer the program
                only where we are authorized to operate. Program availability,
                pricing, fee limits, and specific terms may vary by state.
              </p>
            </section>

            <section className="space-y-3">
              <h2>Currently available in</h2>
              {eligibleStates.length > 0 ? (
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                  {eligibleStates.map((state) => (
                    <li
                      key={state}
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-foreground/80"
                    >
                      {state}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-2xl border border-gold/25 bg-gold/[0.06] px-4 py-4 text-sm text-foreground/75">
                  Our list of available states is being finalized. To confirm whether
                  the program is available where you live, please{" "}
                  <a href="mailto:hello@mydebtangel.com">contact us</a> or call
                  [PHONE].
                </p>
              )}
            </section>

            <section className="space-y-3">
              <h2>Confirming your eligibility</h2>
              <p>
                Even where the program is available, some debts, creditors, and
                situations may not qualify, and Debt Angel is designed for qualifying
                unsecured debt only. If you have questions about availability in your
                state, contact us at{" "}
                <a href="mailto:hello@mydebtangel.com">hello@mydebtangel.com</a> or
                [PHONE].
              </p>
              <p>
                For the full program terms, see our{" "}
                <Link href="/terms">Terms of Service</Link> and{" "}
                <Link href="/privacy">Privacy Policy</Link>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
