/**
 * Debt Angel — centralized compliance disclosures.
 *
 * SINGLE SOURCE OF TRUTH for the plain-English disclosures required by the FTC
 * Telemarketing Sales Rule (16 CFR Part 310.3(a)(1) & 310.4(a)(5)) and for our
 * dedicated-account and negative-consequence language.
 *
 * Every surface that mentions funding, stopping payments, settlements, fees, or
 * timelines reads from this file so the language is IDENTICAL everywhere:
 * homepage, estimator, application wizard, FAQ, and the Program Agreement.
 *
 * If you change a disclosure, change it HERE — never inline in a component.
 */

/** The four mandatory pre-enrollment TSR disclosures, in plain English. */
export interface TsrDisclosure {
  key: "cost" | "timeline" | "accumulation" | "consequences";
  title: string;
  short: string; // one-line summary for tight surfaces
  body: string; // full plain-English statement
}

export const tsrDisclosures: TsrDisclosure[] = [
  {
    key: "cost",
    title: "What the service costs",
    short:
      "Performance-based fee, typically 18–25% — the exact fee is calculated only after a debt is successfully settled and you approve it.",
    body: "Debt Angel charges no upfront fees. Our fee is performance-based — typically 18–25% of the enrolled debt (or of the savings on it), and it is charged only after a balance you enrolled is successfully resolved and you have approved that settlement. Any figure you see before then is an estimate; your actual fee is calculated only after a successful settlement.",
  },
  {
    key: "timeline",
    title: "How long it takes",
    short:
      "Most plans run about 24–48 months; your actual timeline depends on how consistently you fund your account and whether creditors participate.",
    body: "Most plans run about 24 to 48 months. Your estimator shows a personalized range, but your actual timeline depends on how consistently you fund your dedicated account and whether your creditors choose to participate. This is a good-faith estimate, not a guarantee.",
  },
  {
    key: "accumulation",
    title: "What you need to save before a settlement",
    short:
      "You must build up enough in your dedicated account to cover a realistic settlement plus the fee for that account before an offer is made.",
    body: "Before a settlement offer is made on any account, you need to accumulate enough money in your dedicated account to cover a realistic settlement for that account plus the performance-based fee on it. Because settlements happen account by account, the amount that must be saved grows as your plan progresses. Your side-by-side plan view shows how your balance builds toward each resolution.",
  },
  {
    key: "consequences",
    title: "What can happen if you stop paying creditors",
    short:
      "Your credit can be damaged, creditors may add late fees/interest or pursue collections or lawsuits, and forgiven debt may be taxable (1099-C).",
    body: "If you stop making timely payments to your creditors, there are real risks. Your credit score can be damaged, often significantly, while accounts go delinquent. Creditors may continue collection efforts, add late fees and interest that increase what you owe, and can refer accounts to collections or file a lawsuit. And if a debt is forgiven, the IRS may treat the forgiven amount as taxable income and a creditor may issue a Form 1099-C. Debt Angel is not a law firm and does not provide legal or tax advice.",
  },
];

/**
 * Dedicated-account rights — the customer owns and controls the funds, and can
 * leave at any time with a 7-business-day return of remaining funds.
 */
export const dedicatedAccountRights = {
  heading: "Your dedicated account — your money, your control",
  points: [
    "Any funds you deposit are held in an account at an FDIC-insured institution.",
    "You own and control those funds at all times — Debt Angel does not take ownership of your settlement money.",
    "You may withdraw from the program at any time, for any reason, without penalty.",
    "If you withdraw, you receive all remaining funds in your dedicated account — minus only any fees already earned on debts that were actually settled — within seven business days.",
  ],
} as const;

/**
 * Short, consistent "Key risks & rights" callout used inside the wizard and on
 * any surface that mentions funding, stopping minimums, or settlements.
 */
export const keyRisksRights = {
  heading: "Key risks & your rights",
  risks: [
    "Letting accounts go delinquent can lower your credit score, often significantly.",
    "Creditors may add late fees and interest, keep collecting, or file a lawsuit — we are not a law firm.",
    "Forgiven debt may be taxable and reported on a Form 1099-C.",
  ],
  rights: [
    "No upfront fees — you pay nothing until a debt is settled and you approve it.",
    "The money in your dedicated account is yours; you can withdraw and leave anytime.",
    "On withdrawal you get your remaining funds back within seven business days, minus only fees already earned.",
  ],
} as const;

/**
 * The one-line "no advance fees" promise, used near CTAs and funding steps.
 */
export const noAdvanceFee =
  "$0 until a debt is successfully settled and you have approved it.";

/** Positioning — what Debt Angel is and is not. Reused across surfaces. */
export const positioning = {
  isNot:
    "Debt Angel is not a lender, credit repair organization, credit counseling agency, or law firm, and it is not bankruptcy, foreclosure, repossession, or a short-sale program.",
  availability:
    "Programs are not available in all states, and some debts, creditors, and situations may not qualify.",
} as const;

/** Compliance strip shown above the footer on every page. */
export const complianceStrip: string[] = [
  "No upfront fees",
  "Performance-based only",
  "You approve every settlement",
  "Full agreement reviewable before enrollment",
  "Programs not available in all states",
];
