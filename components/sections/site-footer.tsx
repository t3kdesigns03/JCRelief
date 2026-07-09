import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { site, disclaimers } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-ink text-cloud">
      <div className="container py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <div
              className="group relative w-full max-w-[220px] cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-lift transition-all duration-500 ease-out hover:-translate-y-1 hover:border-gold/50 hover:shadow-gold"
              style={{ aspectRatio: "3 / 4" }}
              role="img"
              aria-label="Debt Angel logo"
            >
              <div
                className="h-full w-full bg-contain bg-center bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                style={{ backgroundImage: "url('/images/brand/debtangel-logo.jpg')" }}
              />
              {/* Gold sheen on hover */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-gold/15 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              {/* Sweeping shine */}
              <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
            </div>
            <p className="mt-5 max-w-xs text-sm text-cloud/70">
              {site.motto}
            </p>
            <div className="mt-5 flex flex-col gap-2 text-sm">
              <a
                href={`tel:${site.phone.replace(/[^0-9]/g, "")}`}
                className="flex items-center gap-2 text-cloud/80 transition-colors hover:text-gold"
              >
                <Phone className="h-4 w-4" /> {site.phone}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-2 text-cloud/80 transition-colors hover:text-gold"
              >
                <Mail className="h-4 w-4" /> {site.email}
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gold">
              Explore
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-cloud/70 transition-colors hover:text-cloud"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={site.applyUrl}
                  className="text-cloud/70 transition-colors hover:text-cloud"
                >
                  Start your plan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-gold">
              Good to know
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-cloud/70">
              <li>Built for unsecured debt</li>
              <li>Not a bankruptcy or law firm</li>
              <li>No prepayment penalty</li>
              <li>You approve every step</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-xs leading-relaxed text-cloud/50">
            {disclaimers.footer}
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-cloud/40">
              © {new Date().getFullYear()} {site.name}. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <Link
                href="/privacy"
                className="text-cloud/60 transition-colors hover:text-gold"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-cloud/60 transition-colors hover:text-gold"
              >
                Terms of Service
              </Link>
              <Link
                href="/state-availability"
                className="text-cloud/60 transition-colors hover:text-gold"
              >
                State Availability
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
