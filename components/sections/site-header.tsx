"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

// Soft radial mask so the logo's dark background blends into the black header
// (the asset has a baked-in gradient background, not transparency).

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Transparent PNG lockup — crop the empty margins so the logo reads large,
  // no background mask needed.
  const logoBox = cn(
    "relative block overflow-hidden transition-all duration-300",
    scrolled
      ? "h-12 w-[150px] sm:h-20 sm:w-[210px]"
      : "h-16 w-[188px] sm:h-24 sm:w-[252px]",
  );

  const navLinks = [
    ...site.nav,
    { label: "Program Agreement", href: "/agreement" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ];

  const logoImg = (onClick?: () => void) => (
    <Link
      href="/"
      onClick={onClick}
      className="flex shrink-0 items-center"
      aria-label={`${site.name} home`}
    >
      <span className={logoBox}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/brand/debtangel-logo-horizontal-removebg.png"
          alt="Debt Angel"
          width={600}
          height={400}
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
      </span>
    </Link>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-gold/20 bg-background/90 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-background/85 to-background/30 backdrop-blur-md",
      )}
    >
      {/* Thin gold accent line */}
      <div className="h-[3px] w-full bg-gold-sheen" />

      <div
        className={cn(
          "container flex items-center justify-between gap-4 transition-all duration-300",
          scrolled ? "h-[4.5rem] sm:h-24" : "h-20 sm:h-28",
        )}
      >
        {logoImg()}

        <nav className="hidden items-center gap-8 lg:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative text-sm font-semibold text-foreground/80 transition-colors hover:text-foreground"
            >
              {item.label}
              <span className="absolute -bottom-1.5 left-0 h-0.5 w-0 bg-gold-sheen transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`tel:${site.phone.replace(/[^0-9]/g, "")}`}
            className="flex items-center gap-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-gold"
          >
            <Phone className="h-4 w-4 text-gold" /> {site.phone}
          </a>
          <Link
            href={site.loginUrl}
            className="text-sm font-semibold text-foreground/70 transition-colors hover:text-gold"
          >
            Sign in
          </Link>
          <Button asChild size="default">
            <Link href={site.applyUrl}>
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-foreground lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden">
          <div className="container flex flex-col gap-1 border-t border-white/10 pb-8 pt-4">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-4 text-lg font-semibold text-foreground transition-colors hover:bg-white/5"
              >
                {item.label}
                <ArrowRight className="h-4 w-4 text-gold" />
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              <Button asChild size="lg" onClick={() => setOpen(false)}>
                <Link href={site.applyUrl}>
                  Build my free plan <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Link
                href={site.loginUrl}
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-2xl border border-white/10 py-3 text-base font-semibold text-foreground"
              >
                Sign in to your plan
              </Link>
              <a
                href={`tel:${site.phone.replace(/[^0-9]/g, "")}`}
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 py-3 text-base font-semibold text-foreground"
              >
                <Phone className="h-4 w-4 text-gold" /> {site.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
