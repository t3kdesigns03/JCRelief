import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

/** Slim, text-forward closing CTA — the last nudge before the footer. */
export function ClosingCta() {
  return (
    <section className="pb-20 pt-4 md:pb-28">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-white/[0.03] px-6 py-8 sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/10 blur-[90px]" />
          <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to reach{" "}
                <span className="text-gradient-gold">Debt Zero</span>?
              </h2>
              <p className="mt-2 text-sm text-foreground/65 sm:text-base">
                Smarter, Faster, Cheaper — with the least amount of risk. Start free,
                no obligation.
              </p>
            </div>
            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
              <Button asChild size="lg" className="text-base">
                <Link href={site.applyUrl}>
                  Build my free plan <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base">
                <a href={`tel:${site.phone.replace(/[^0-9]/g, "")}`}>
                  <Phone className="h-4 w-4" /> {site.phone}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
