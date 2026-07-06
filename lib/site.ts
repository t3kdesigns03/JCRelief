/**
 * Central content + config for Debt Angel.
 * Edit copy, stats, differentiators, and FAQs here — components read from this file.
 *
 * NOTE: Proof points and testimonials below are PLACEHOLDERS. Replace with real,
 * substantiable numbers and consented client stories before launch. Debt
 * resolution marketing claims must be truthful and substantiated (FTC / TSR rules).
 */

export const site = {
  name: "Debt Angel",
  motto: "Smarter, Faster, Cheaper. Your Debt Zero with the least amount of risk.",
  mottoShort: "Smarter, Faster, Cheaper.",
  tagline: "Your Debt Zero with the least amount of risk.",
  domain: "debtangel.com",
  phone: "(000) 000-0000", // TODO: placeholder — replace with the real number
  email: "hello@debtangel.com",
  applyUrl: "/apply",
  schedulingUrl:
    process.env.NEXT_PUBLIC_SCHEDULING_URL || "https://cal.com/debt-angel/intro",
  nav: [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "The Difference", href: "/#difference" },
    { label: "Estimator", href: "/#estimator" },
    { label: "Compare", href: "/#comparison" },
    { label: "FAQ", href: "/#faq" },
  ],
} as const;

/** The three pillars of the motto, expanded. */
export interface Pillar {
  key: "smarter" | "faster" | "cheaper";
  word: string;
  headline: string;
  body: string;
  icon: string; // lucide-react icon name
}

export const pillars: Pillar[] = [
  {
    key: "smarter",
    word: "Smarter",
    headline: "A structured, account-by-account plan",
    body: "See every tradeline, its utilization, and its drag on your debt-to-income — then resolve them in the order that helps you most. Data first, guesswork never.",
    icon: "BrainCircuit",
  },
  {
    key: "faster",
    word: "Faster",
    headline: "A real finish line, in months not decades",
    body: "One structured plan replaces years of minimum payments. Most paths to Debt Zero land far sooner than paying minimums ever could — and your credit tends to recover as a byproduct.",
    icon: "Rocket",
  },
  {
    key: "cheaper",
    word: "Cheaper",
    headline: "Pay less to reach zero",
    body: "Resolve balances for less than you owe, with performance-based pricing and no prepayment penalty. You see the all-in cost — and your total savings — before you commit.",
    icon: "PiggyBank",
  },
];

/** The "No [bad outcomes]" promise list. */
export const noList: { label: string; sub: string }[] = [
  { label: "No bankruptcy", sub: "Keep your record and your options open." },
  { label: "No foreclosure", sub: "Your home stays your home." },
  { label: "No short sale", sub: "No forced sale under pressure." },
  { label: "No repossession", sub: "Keep the car in the driveway." },
  { label: "No prepayment penalty", sub: "Finish early and pay nothing extra." },
];

export interface Proof {
  stat: string;
  label: string;
}

/** Specific, ownable proof points — replace with real, substantiated numbers. */
export const proofPoints: Proof[] = [
  { stat: "Avg. 45%", label: "less paid on resolved balances vs. the amount owed" },
  { stat: "24–48 mo", label: "typical path to Debt Zero for most plans" },
  { stat: "$0", label: "upfront fees — performance-based pricing only" },
  { stat: "100%", label: "self-serve or advisor-assisted — you choose" },
];

export const trustBar: string[] = [
  "No upfront fees",
  "You approve every move",
  "Transparent all-in cost",
  "Self-serve or autopilot",
  "Faster credit recovery",
];

export interface Step {
  n: number;
  phase: string;
  title: string;
  body: string;
  detail: string;
  icon: string;
}

export const steps: Step[] = [
  {
    n: 1,
    phase: "Phase 1",
    title: "Map your debt",
    body: "Import or enter each account. We build a clear, visual picture of where you stand.",
    detail:
      "Add every tradeline — balance, limit, APR, open date, and status. Debt Angel instantly shows utilization and each account's drag on your debt-to-income, so nothing is hidden.",
    icon: "ListChecks",
  },
  {
    n: 2,
    phase: "Phase 2",
    title: "See your plan",
    body: "A side-by-side comparison: your current path vs. your Debt Angel plan, in real dollars.",
    detail:
      "One screen shows your current monthly payments and total payoff next to your proposed plan — new monthly amount, total cost, time saved, and total savings. This is the moment it clicks.",
    icon: "BarChart3",
  },
  {
    n: 3,
    phase: "Phase 3",
    title: "Fund one account",
    body: "Replace juggling minimums with one deposit into an account you control.",
    detail:
      "Instead of many due dates, you fund a single dedicated account and watch it grow. You stay in control and approve every resolution before it happens.",
    icon: "Wallet",
  },
  {
    n: 4,
    phase: "Phase 4",
    title: "Resolve, account by account",
    body: "We negotiate each balance down — and you approve every settlement.",
    detail:
      "As funds build, balances are resolved one by one for less than you owe. Track each win, your dollars saved, and your projected Debt Zero date in real time.",
    icon: "Handshake",
  },
  {
    n: 5,
    phase: "Phase 5",
    title: "Reach Debt Zero — and rebuild",
    body: "Cross the finish line, then keep the momentum with credit-recovery guidance.",
    detail:
      "Creditworthiness usually recovers faster as a byproduct of a structured, responsible plan. When you hit zero, a step-by-step recovery path helps the fresh start stick.",
    icon: "Trophy",
  },
];

export interface Difference {
  icon: string;
  title: string;
  body: string;
}

export const differences: Difference[] = [
  {
    icon: "Eye",
    title: "See every account, clearly",
    body: "A visual tradeline view shows utilization, balance, APR, open date, and each account's impact on your debt-to-income. You see exactly what's happening with each account.",
  },
  {
    icon: "SlidersHorizontal",
    title: "You stay in control",
    body: "Self-serve or autopilot — your choice. Move through guided phases at your own pace and approve every resolution. No call-center queue required.",
  },
  {
    icon: "Scale",
    title: "Real numbers, side by side",
    body: "Your current path and your Debt Angel plan in actual dollars — new monthly amount, total cost, time saved, and total savings — before you commit to anything.",
  },
  {
    icon: "ShieldCheck",
    title: "The least amount of risk",
    body: "No bankruptcy, no foreclosure, no short sale, no repossession, and no prepayment penalty. A structured, responsible path — not a drastic one.",
  },
  {
    icon: "TrendingUp",
    title: "Credit recovers faster",
    body: "Creditworthiness usually recovers faster as a natural byproduct of a structured plan. We help you rebuild once you reach Debt Zero.",
  },
  {
    icon: "BadgeDollarSign",
    title: "Pay only for results",
    body: "Performance-based pricing, no upfront fees, and no prepayment penalty. Finish early and pay nothing extra. The all-in cost is transparent from day one.",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  location: string;
  outcome: string;
  kind: "relief" | "recovery";
  /** Optional avatar in /public/images/avatars. Falls back to initials. */
  avatar?: string;
}

/** Illustrative composites — replace with real, consented client stories + results. */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Seeing every card on one screen — utilization, the interest each one bled — made it finally make sense. I could see the plan, not just hope for one.",
    name: "Marisa T.",
    location: "Tampa, FL",
    outcome: "$38,400 owed → resolved for $17,100",
    kind: "relief",
    avatar: "/images/avatars/avatar-woman-1.jpg",
  },
  {
    quote:
      "The comparison page sold me. Current path vs. Debt Angel, in real dollars. I was going to save years and thousands. No pressure, just the numbers.",
    name: "Devon R.",
    location: "Columbus, OH",
    outcome: "5 accounts to zero in 26 months",
    kind: "relief",
    avatar: "/images/avatars/avatar-man-1.jpg",
  },
  {
    quote:
      "I did the whole thing myself, at my own pace, on autopilot. And my credit started climbing back faster than I expected once the plan kicked in.",
    name: "Alicia M.",
    location: "Mesa, AZ",
    outcome: "628 → 704 the year after Debt Zero",
    kind: "recovery",
  },
  {
    quote:
      "One deposit instead of eight due dates. A dashboard that showed the finish line. It turned an overwhelming mess into something I was actually running.",
    name: "James & Priya K.",
    location: "Raleigh, NC",
    outcome: "$61,200 mapped, on track 8 months in",
    kind: "relief",
  },
  {
    quote:
      "No bankruptcy, no drama, no surprise fees. Just a clear plan I approved step by step. I always knew exactly what was happening.",
    name: "Carlos V.",
    location: "Denver, CO",
    outcome: "Reached Debt Zero, kept his car and home",
    kind: "relief",
  },
  {
    quote:
      "The recovery guidance after was the part nobody else offered. Step by step, the right moves in the right order. My score kept rising.",
    name: "Nia W.",
    location: "Atlanta, GA",
    outcome: "Rebuilt past 700 after graduating",
    kind: "recovery",
  },
];

export interface Faq {
  q: string;
  a: string;
}

export const faqs: Faq[] = [
  {
    q: "What is Debt Angel, exactly?",
    a: "Debt Angel is a modern, transparent, client-driven debt resolution program. You map your accounts, see your current path next to a proposed plan in real dollars, then resolve balances for less than you owe — self-serve or with an advisor. The goal is Debt Zero, Smarter, Faster, and Cheaper, with the least amount of risk.",
  },
  {
    q: "How is this different from bankruptcy or other drastic options?",
    a: "Debt Angel involves no bankruptcy, no foreclosure, no short sale, and no repossession. It's a structured, responsible plan to resolve unsecured balances — not a drastic legal step. Because it's structured and responsible, creditworthiness usually recovers faster as a byproduct.",
  },
  {
    q: "What does it cost, and is there a prepayment penalty?",
    a: "Pricing is performance-based: no upfront fees, and a fee applies only when a balance is actually resolved for you — typically 18–25% of the enrolled amount, disclosed in writing first. There is no prepayment penalty, so if you finish early you pay nothing extra. You always see the all-in cost and your total savings before you commit.",
  },
  {
    q: "Can I really do this myself on autopilot?",
    a: "Yes. The application is built as guided phases you can move through on your own — map your debt, review each tradeline, see your comparison, and submit. You stay in control the whole way and approve every resolution. An advisor is available whenever you want one, but you're never required to sit in a call-center queue.",
  },
  {
    q: "Will this affect my credit?",
    a: "In many resolution plans, accounts may go delinquent while balances are negotiated, which can lower your score in the short term. The trade-off is resolving debt you might not otherwise clear — and because the plan is structured and responsible, creditworthiness usually recovers faster afterward. If protecting your score for an imminent mortgage or loan is the priority, we'll tell you honestly whether this is the right fit.",
  },
  {
    q: "How long does it take?",
    a: "Most plans run about 24 to 48 months. The biggest factor is how much you can comfortably set aside each month — the faster your dedicated account funds, the faster balances resolve. Your estimator and comparison will show a realistic range for your situation.",
  },
  {
    q: "What kinds of debt qualify?",
    a: "Unsecured debts — credit cards, personal loans, many medical bills, retail cards, and some private debts. Secured debt (mortgages, auto loans) and most student loans, taxes, and child support generally don't qualify. The tradeline view will make it clear what fits.",
  },
  {
    q: "Is forgiven debt taxable?",
    a: "It can be. The IRS may treat forgiven debt over $600 per creditor as taxable income, and you could receive a 1099-C — though some people qualify for an insolvency exclusion. We flag this early and recommend speaking with a tax professional so you can plan for it rather than be surprised.",
  },
];

export const disclaimers = {
  estimator:
    "Estimates are illustrative and for educational purposes only. They are not an offer, a guarantee of results, or financial, legal, or tax advice. Actual resolutions, fees, timelines, and savings vary by creditor, balance, delinquency, state, and your ability to fund your account. Debt resolution may affect your credit in the short term, and forgiven debt may be taxable.",
  footer:
    "Debt Angel provides debt resolution and credit-recovery support services. We are not a lender, credit repair organization, credit counseling agency, or law firm, and we do not provide legal or tax advice. Programs are not available in all states. Read and understand all program documents before enrolling. Results are not guaranteed and vary by individual circumstances. The content on this site is for general information only.",
};
