"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { proofPoints, site } from "@/lib/site";

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative isolate overflow-hidden">
      {/* Full-bleed hero image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero/hero-symbolic.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-top"
      />
      {/* Readability overlays */}
      <div className="absolute inset-0 -z-10 bg-background/50" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/85 via-background/35 to-background" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(75%_60%_at_50%_58%,transparent_0%,rgba(0,0,0,0.45)_100%)]" />

      <div className="container flex min-h-[88vh] flex-col items-center justify-center py-20 text-center sm:py-28">
        <motion.div {...rise(0)}>
          <span className="eyebrow backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5" />
            Debt resolution, reimagined
          </span>
        </motion.div>

        <motion.h1
          className="mt-6 max-w-4xl text-balance font-display text-5xl font-bold leading-[1.02] tracking-tight [text-shadow:0_2px_30px_rgba(0,0,0,0.55)] sm:text-6xl lg:text-7xl"
          {...rise(0.08)}
        >
          Finally, <span className="text-gradient-gold">breathing room</span>.
        </motion.h1>

        <motion.p
          className="mt-6 max-w-2xl text-lg font-medium leading-relaxed [text-shadow:0_2px_20px_rgba(0,0,0,0.6)] sm:text-2xl"
          {...rise(0.16)}
        >
          <span className="font-semibold text-gradient-gold">
            Smarter, Faster, Cheaper.
          </span>{" "}
          <span className="text-cloud">
            Your Debt Zero with the least amount of risk.
          </span>
        </motion.p>

        <motion.p
          className="mt-5 hidden max-w-xl text-base leading-relaxed text-cloud/80 [text-shadow:0_1px_12px_rgba(0,0,0,0.6)] sm:block sm:text-lg"
          {...rise(0.22)}
        >
          A modern, transparent program you drive yourself. See every account,
          compare your plan in real dollars, and resolve balances for less than
          you owe — no bankruptcy, foreclosure, or repossession.
        </motion.p>

        <motion.div
          className="mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
          {...rise(0.3)}
        >
          <Button asChild size="lg" className="w-full text-base sm:w-auto">
            <Link href={site.applyUrl}>
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="w-full border-white/25 bg-white/5 text-base text-cloud backdrop-blur hover:bg-white/10 hover:text-cloud sm:w-auto"
          >
            <Link href="/#how-it-works">
              <Play className="h-4 w-4" /> See how it works
            </Link>
          </Button>
        </motion.div>

        <motion.p
          className="mt-4 text-sm text-cloud/60 [text-shadow:0_1px_10px_rgba(0,0,0,0.7)]"
          {...rise(0.36)}
        >
          No upfront fees · No prepayment penalty · Self-serve or autopilot
        </motion.p>

        {/* Proof points */}
        <motion.dl
          className="mt-12 grid w-full max-w-2xl grid-cols-2 gap-x-6 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-4"
          {...rise(0.44)}
        >
          {proofPoints.map((p) => (
            <div key={p.label}>
              <dt className="num-display text-2xl font-bold tracking-tight text-gold [text-shadow:0_1px_16px_rgba(0,0,0,0.6)] sm:text-3xl">
                {p.stat}
              </dt>
              <dd className="mt-1 text-xs leading-snug text-cloud/70">{p.label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
