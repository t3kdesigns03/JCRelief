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
  motto: "See your way out of debt — a clear plan for your unsecured balances, and you approve every step.",
  mottoShort: "A clearer way through unsecured debt.",
  tagline: "A clear plan for your unsecured debt — and you approve every step.",
  domain: "mydebtangel.com",
  phone: "(000) 000-0000", // TODO: placeholder — replace with the real number
  email: "support@debtangel.example", // TODO: placeholder — replace with the real address
  applyUrl: "/apply",
  loginUrl: "/login",
  dashboardUrl: "/dashboard",
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
    headline: "A realistic finish line you can see",
    body: "One structured plan replaces years of minimum payments. Depending on what you can set aside each month, resolving your balances may take far less time than making minimum payments alone — though timelines vary by situation.",
    icon: "Rocket",
  },
  {
    key: "cheaper",
    word: "Cheaper",
    headline: "Aim to resolve for less than you owe",
    body: "The goal is to resolve unsecured balances for less than the full amount owed, with performance-based pricing and no prepayment penalty. You see the estimated all-in cost — and the estimated difference versus minimum payments — before you commit.",
    icon: "PiggyBank",
  },
];

/** Scope clarification — what the program is and isn't. */
export const noList: { label: string; sub: string }[] = [
  { label: "Built for unsecured debt", sub: "Credit cards, personal loans, many medical bills, and similar balances." },
  { label: "Not a bankruptcy filing", sub: "A debt-resolution program, not a legal bankruptcy process." },
  { label: "Not a foreclosure or short-sale program", sub: "We focus on unsecured balances, not your mortgage." },
  { label: "Not a repossession program", sub: "Secured loans like auto loans generally don't qualify." },
  { label: "No prepayment penalty", sub: "Finish early and pay nothing extra." },
];

export interface Proof {
  stat: string;
  label: string;
}

/** Process-oriented proof points — factual, non-outcome claims. */
export const proofPoints: Proof[] = [
  { stat: "$0", label: "upfront fees — performance-based pricing only" },
  { stat: "Unsecured", label: "credit cards, personal loans & similar balances" },
  { stat: "Every step", label: "you review and approve before anything moves" },
  { stat: "Side by side", label: "your current path next to an estimated plan" },
];

export const trustBar: string[] = [
  "No upfront fees",
  "You approve every step",
  "Transparent all-in cost",
  "Self-serve or advisor-assisted",
  "Built for unsecured debt",
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
      "One screen shows your current monthly payments and total payoff next to your proposed plan — new monthly amount, total cost, estimated timeline, and the estimated difference versus minimum payments. This is the moment it clicks.",
    icon: "BarChart3",
  },
  {
    n: 3,
    phase: "Phase 3",
    title: "Fund one account",
    body: "Replace juggling minimums with one deposit into an account you control.",
    detail:
      "Instead of many due dates, you fund a single dedicated account and watch it grow. The account is held at an FDIC-insured institution and the money stays yours — you own and control it, can withdraw and leave at any time without penalty, and get any remaining funds back within seven business days.",
    icon: "Wallet",
  },
  {
    n: 4,
    phase: "Phase 4",
    title: "Resolve, account by account",
    body: "We negotiate each balance down — and you approve every settlement.",
    detail:
      "As funds build, balances are resolved one by one for less than you owe. You approve every settlement before it happens, and our performance-based fee applies only after a balance is actually resolved — $0 until then, with no prepayment penalty. Not all debts settle, and letting accounts go delinquent can affect your credit; you'll always see the trade-offs.",
    icon: "Handshake",
  },
  {
    n: 5,
    phase: "Phase 5",
    title: "Resolve your balances — and plan your next step",
    body: "Work through your enrolled accounts, then get guidance for what comes next.",
    detail:
      "After your enrolled accounts are resolved, we share general educational guidance for life after resolution. Credit outcomes vary by individual and are not guaranteed.",
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
    body: "Your current path and your Debt Angel plan in actual dollars — new monthly amount, total cost, estimated timeline, and the estimated difference versus minimum payments — before you commit to anything.",
  },
  {
    icon: "ShieldCheck",
    title: "Built for unsecured debt",
    body: "Debt Angel is a debt-resolution program for unsecured balances — not a bankruptcy, foreclosure, short sale, or repossession. Some debts, creditors, states, and situations may not qualify.",
  },
  {
    icon: "TrendingUp",
    title: "An honest read on fit",
    body: "If a resolution plan isn't right for your situation, we'll tell you — even if that means not enrolling. You get a straight recommendation, not pressure.",
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

/**
 * Example scenarios — illustrative composites, not real individual results.
 * For education only; they do not guarantee similar outcomes. Replace with real,
 * consented client stories only after outcomes are substantiated (FTC / TSR rules).
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Seeing every account on one screen — balances and the interest each one carried — made it finally make sense. I could see a plan, not just hope for one.",
    name: "Marisa T.",
    location: "Tampa, FL",
    outcome: "Illustrative: $38,400 in unsecured debt organized into a structured plan",
    kind: "relief",
    avatar: "/images/avatars/avatar-woman-1.jpg",
  },
  {
    quote:
      "The comparison page is what did it — my current path next to an estimated plan, in real dollars. No pressure, just the numbers, and I decided.",
    name: "Devon R.",
    location: "Columbus, OH",
    outcome: "Illustrative: 5 unsecured accounts in one structured plan over about 26 months",
    kind: "relief",
    avatar: "/images/avatars/avatar-man-1.jpg",
  },
  {
    quote:
      "I did the whole thing myself, at my own pace, on autopilot. Reviewing and approving each step kept me in control the whole way.",
    name: "Alicia M.",
    location: "Mesa, AZ",
    outcome: "Illustrative: a self-directed plan, approved step by step",
    kind: "recovery",
  },
  {
    quote:
      "One deposit instead of eight due dates. A dashboard that tracked progress. It turned an overwhelming mess into something I was actually running.",
    name: "James & Priya K.",
    location: "Raleigh, NC",
    outcome: "Illustrative: $61,200 in unsecured balances mapped into one plan",
    kind: "relief",
  },
  {
    quote:
      "No bankruptcy, no drama, no surprise fees. Just a clear plan I approved step by step. I always knew exactly what was happening.",
    name: "Carlos V.",
    location: "Denver, CO",
    outcome: "Illustrative: a plan approved step by step, with no upfront fees",
    kind: "relief",
  },
  {
    quote:
      "The educational guidance after accounts were resolved was the part nobody else offered — step by step, the right moves in the right order.",
    name: "Nia W.",
    location: "Atlanta, GA",
    outcome: "Illustrative: general educational guidance after resolution; results vary",
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
    a: "Debt Angel is a modern, transparent, client-driven debt-resolution program for unsecured debt. You map your accounts, see your current path next to an estimated plan in real dollars, then work to resolve balances for less than the full amount owed — self-serve or with an advisor. You review and approve every step before anything moves forward.",
  },
  {
    q: "How is this different from bankruptcy or other options?",
    a: "Debt Angel is a debt-resolution program for unsecured balances — it is not a bankruptcy, foreclosure, short sale, or repossession, and we are not a law firm. Secured debts like mortgages and auto loans, and some other debts, generally don't qualify. It's one option among several, and we'll be honest about whether it fits your situation.",
  },
  {
    q: "What does it cost, and is there a prepayment penalty?",
    a: "Pricing is performance-based: no upfront fees, and a fee applies only when a balance is actually resolved for you — typically 18–25% of the enrolled amount, disclosed in writing first. There is no prepayment penalty, so if you finish early you pay nothing extra. You always see the all-in cost and the estimated difference versus minimum payments before you commit.",
  },
  {
    q: "Can I really do this myself on autopilot?",
    a: "Yes. The application is built as guided phases you can move through on your own — map your debt, review each tradeline, see your comparison, and submit. You stay in control the whole way and approve every resolution. An advisor is available whenever you want one, but you're never required to sit in a call-center queue.",
  },
  {
    q: "Will this affect my credit?",
    a: "Yes — it can hurt your credit score in the short term, sometimes significantly. In many resolution plans, accounts go delinquent while balances are negotiated, and those delinquencies and any settlements can show on your credit report and stay there for years. Everyone's credit is different and we can't promise a specific outcome or recovery. If protecting your score for an imminent mortgage or loan is your priority, we'll tell you honestly whether this is the right fit — even if that means not enrolling.",
  },
  {
    q: "What happens if I stop paying my creditors?",
    a: "Be clear-eyed about this: if you stop making timely payments, creditors can keep adding late fees and interest, which increases what you owe; they can keep calling and reporting you late; and they can send accounts to collections or file a lawsuit. We are not a law firm and don't provide legal representation. The upside is that delinquency is often what brings a creditor to the table to settle — but it comes with real risk, which is why you approve every step and can leave at any time.",
  },
  {
    q: "Who owns the money I deposit?",
    a: "You do — always. Your deposits go into a dedicated account in your name at an FDIC-insured institution, administered by an independent provider. Debt Angel never takes ownership of your settlement funds. Nothing is paid to a creditor without your approval, and if you leave the program you get your remaining balance back (minus only fees already earned on debts that were actually settled) within seven business days.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can withdraw from the program at any time, for any reason, with no penalty — there's no lock-in and no prepayment penalty. Because our fee is performance-based, you're never charged for settlements that haven't happened. On withdrawal you receive the funds remaining in your dedicated account, less only any fees already earned on debts that were resolved, within seven business days.",
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
    "Estimates are illustrative and for educational purposes only. They are not an offer, a guarantee of results, or financial, legal, or tax advice. Actual resolutions, fees, timelines, and figures vary by creditor, balance, delinquency, state, and your ability to fund your account. Debt resolution may affect your credit in the short term, and forgiven debt may be taxable.",
  footer:
    "Debt Angel provides debt resolution and credit-recovery support services. We are not a lender, credit repair organization, credit counseling agency, or law firm, and we do not provide legal or tax advice. Programs are not available in all states. Read and understand all program documents before enrolling. Results are not guaranteed and vary by individual circumstances. The content on this site is for general information only.",
};
