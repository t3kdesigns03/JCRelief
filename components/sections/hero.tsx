"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, ShieldCheck, Star, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo";
import { proofPoints, site } from "@/lib/site";
import { currency, monthsToLabel } from "@/lib/utils";

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative overflow-hidden">
      {/* Cinematic hero photo (swap to /images/hero/hero-symbolic.jpg for the alt) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero/hero-abstract.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-30 h-full w-full object-cover opacity-40"
      />
      {/* Dark scrim for text legibility (heavier on the left / bottom) */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-background via-background/85 to-background/40" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-background/40 via-transparent to-background" />
      <div className="absolute inset-0 -z-10 gradient-halo" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-40" />
      {/* soft gold aura top-right */}
      <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-[28rem] w-[28rem] rounded-full bg-gold/10 blur-[120px]" />

      <div className="container grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-32">
        <div>
          <motion.div {...rise(0)}>
            <span className="eyebrow">
              <ShieldCheck className="h-3.5 w-3.5" />
              Debt resolution, reimagined
            </span>
            <h1 className="mt-6 text-balance font-display text-[2.6rem] font-bold leading-[1.03] tracking-tight sm:text-6xl lg:text-[4.25rem]">
              <span className="text-gradient-gold">Smarter. Faster. Cheaper.</span>
              <br className="hidden sm:block" /> Your debt to{" "}
              <span className="text-gradient-money">zero</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/70 sm:text-xl">
              A modern, transparent program you drive yourself. See every account,
              compare your plan in real dollars, and resolve balances for less than
              you owe — with the least amount of risk.
            </p>
          </motion.div>

          <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row" {...rise(0.12)}>
            <Button asChild size="lg" className="text-base">
              <Link href={site.applyUrl}>
                Build my free plan
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base">
              <Link href="/#how-it-works">
                <Play className="h-4 w-4" />
                See how it works
              </Link>
            </Button>
          </motion.div>

          <motion.p className="mt-5 text-sm text-foreground/50" {...rise(0.2)}>
            No upfront fees · No prepayment penalty · Self-serve or autopilot
          </motion.p>

          <motion.dl
            className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4"
            {...rise(0.28)}
          >
            {proofPoints.map((p) => (
              <div key={p.label}>
                <dt className="num-display text-2xl font-bold tracking-tight text-gold sm:text-3xl">
                  {p.stat}
                </dt>
                <dd className="mt-1 text-xs leading-snug text-foreground/50">
                  {p.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div className="relative" {...rise(0.12)}>
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="surface ring-gold-soft relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <div className="absolute inset-0 grid-noise opacity-70" aria-hidden />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-10 w-auto" />
              <span className="font-display text-lg font-bold">
                <span className="text-gradient-gold">Debt</span>
                <span className="text-foreground">Angel</span>
              </span>
            </div>
            <span className="rounded-full border border-money/30 bg-money/10 px-3 py-1 text-xs font-semibold text-money">
              Live plan
            </span>
          </div>

          <p className="mt-6 text-xs font-medium uppercase tracking-[0.16em] text-foreground/45">
            Projected total savings
          </p>
          <p className="num-display mt-1 text-4xl font-bold text-gradient-money sm:text-5xl">
            {currency(21480)}
          </p>

          <div className="mt-6 space-y-4">
            <ProgressRow label="Debt resolved" value={68} />
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="New payment" value={`${currency(520)}/mo`} />
              <MiniStat label="Debt Zero by" value="Mar 2028" />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-xs font-medium text-foreground/80">
              You approve every move
            </span>
          </div>
        </div>
      </div>

      {/* Floating time-saved chip */}
      <div className="absolute -bottom-5 -left-3 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-card px-4 py-3 shadow-lift sm:-left-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-money/15 text-money">
          <TrendingUp className="h-4 w-4" />
        </span>
        <span>
          <span className="block text-[11px] text-foreground/50">Time saved</span>
          <span className="num-display block text-lg font-bold text-money">
            {monthsToLabel(96)}
          </span>
        </span>
      </div>
    </div>
  );
}

function ProgressRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-foreground/55">{label}</span>
        <span className="font-semibold text-gold">{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-money-sheen"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
      <span className="block text-[11px] text-foreground/45">{label}</span>
      <span className="num-display block text-sm font-semibold text-foreground">
        {value}
      </span>
    </div>
  );
}
