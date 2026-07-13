import { z } from "zod";
import type { Tradeline } from "@/lib/estimator";

export const tradelineTypeOptions = [
  { value: "credit-card", label: "Credit card" },
  { value: "retail-card", label: "Retail / store card" },
  { value: "personal-loan", label: "Personal loan" },
  { value: "medical", label: "Medical bill" },
  { value: "other", label: "Other unsecured" },
] as const;

export const tradelineStatusOptions = [
  { value: "current", label: "Current" },
  { value: "past-due", label: "Past due" },
  { value: "collections", label: "In collections" },
] as const;

export const goalOptions = [
  {
    value: "one_payment",
    label: "One manageable payment",
    description: "Stop juggling minimums and due dates",
  },
  {
    value: "debt_free_faster",
    label: "Reach Debt Zero faster",
    description: "A real finish line in years, not decades",
  },
  {
    value: "pay_less",
    label: "Pay less overall",
    description: "Resolve balances for less than I owe",
  },
  {
    value: "rebuild_credit",
    label: "Rebuild my credit",
    description: "Resolve the debt, then recover my score",
  },
] as const;

export const timelineOptions = [
  { value: "asap", label: "As soon as possible" },
  { value: "few_months", label: "In the next few months" },
  { value: "exploring", label: "Just exploring for now" },
] as const;

export const employmentOptions = [
  { value: "employed", label: "Employed" },
  { value: "self_employed", label: "Self-employed" },
  { value: "retired", label: "Retired / fixed income" },
  { value: "between_jobs", label: "Between jobs" },
] as const;

export const creditPriorityOptions = [
  {
    value: "not_priority",
    label: "Not a priority right now",
    description: "I'm focused on reaching Debt Zero",
  },
  {
    value: "somewhat",
    label: "Somewhat important",
    description: "I'd like to protect it if reasonable",
  },
  {
    value: "critical",
    label: "Critical — I need it soon",
    description: "I have a mortgage or loan coming up",
  },
] as const;

export const incomeFrequencyOptions = [
  { value: "weekly", label: "Weekly", perMonth: 52 / 12 },
  { value: "biweekly", label: "Every 2 weeks", perMonth: 26 / 12 },
  { value: "semimonthly", label: "Twice a month", perMonth: 2 },
  { value: "monthly", label: "Monthly", perMonth: 1 },
  { value: "annual", label: "Yearly", perMonth: 1 / 12 },
] as const;

export const incomeRangeOptions = [
  { value: "lt_2000", label: "Under $2,000", mid: 1500 },
  { value: "2000_3000", label: "$2,000–$3,000", mid: 2500 },
  { value: "3000_4000", label: "$3,000–$4,000", mid: 3500 },
  { value: "4000_5000", label: "$4,000–$5,000", mid: 4500 },
  { value: "5000_7000", label: "$5,000–$7,000", mid: 6000 },
  { value: "7000_10000", label: "$7,000–$10,000", mid: 8500 },
  { value: "gte_10000", label: "$10,000+", mid: 12000 },
] as const;

const values = <T extends readonly { value: string }[]>(opts: T) =>
  opts.map((o) => o.value) as [string, ...string[]];

export const tradelineSchema = z.object({
  id: z.string(),
  creditor: z.string().min(1, "Add the creditor name"),
  type: z.enum(values(tradelineTypeOptions)),
  balance: z
    .number({ invalid_type_error: "Enter a balance" })
    .min(1, "Enter a balance"),
  limit: z
    .number({ invalid_type_error: "Enter a limit" })
    .min(0)
    .optional(),
  apr: z
    .number({ invalid_type_error: "Enter an APR" })
    .min(0, "Enter an APR")
    .max(60, "That APR looks too high"),
  minPayment: z
    .number({ invalid_type_error: "Enter a minimum payment" })
    .min(0, "Enter a minimum payment"),
  opened: z.string().optional(),
  status: z.enum(values(tradelineStatusOptions)),
});

/**
 * Self-reported income. Optional everywhere so it never blocks submit — a user
 * may give an exact amount, a range, or decline. `source` is future-proofed for
 * a later verified income source (payroll/bank link); credit reports never
 * carry income, so this stays independent of the CRS pull.
 */
export const incomeSchema = z
  .object({
    precision: z.enum(["exact", "range", "declined"]).default("exact"),
    amount: z
      .number({ invalid_type_error: "Enter an approximate amount" })
      .min(0)
      .max(1_000_000)
      .optional(),
    rangeId: z.enum(values(incomeRangeOptions)).optional(),
    frequency: z.enum(values(incomeFrequencyOptions)).default("monthly"),
    type: z.enum(["net", "gross"]).default("net"),
    includesHousehold: z.boolean().default(false),
    source: z.enum(["self_reported", "verified"]).default("self_reported"),
  })
  .refine((v) => v.precision !== "exact" || typeof v.amount === "number", {
    message: "Enter an amount or choose a range",
    path: ["amount"],
  })
  .refine((v) => v.precision !== "range" || !!v.rangeId, {
    message: "Pick a range to continue",
    path: ["rangeId"],
  });

export type IncomeInput = z.infer<typeof incomeSchema>;

/**
 * Essential monthly expenses. Every field optional — a user can fill some,
 * all, or none. Categories are a fixed, ordered list here but stored as a
 * flexible JSONB map, so adding categories later needs no migration and stays
 * independent of the CRS pull.
 */
export const expenseCategories = [
  { key: "housing", label: "Housing", hint: "Rent or mortgage" },
  { key: "utilities", label: "Utilities", hint: "Electric, gas, water" },
  { key: "phone", label: "Phone", hint: "" },
  { key: "internet", label: "Internet", hint: "" },
  { key: "groceries", label: "Groceries & food", hint: "" },
  { key: "carPayment", label: "Car payment", hint: "" },
  { key: "transportation", label: "Gas & transportation", hint: "" },
  { key: "insurance", label: "Insurance", hint: "Auto, health, life" },
  { key: "other", label: "Other essentials", hint: "" },
] as const;

export type ExpenseKey = (typeof expenseCategories)[number]["key"];

const expenseField = z
  .number({ invalid_type_error: "Enter an amount" })
  .min(0)
  .max(1_000_000)
  .optional();

export const expensesSchema = z.object({
  housing: expenseField,
  utilities: expenseField,
  phone: expenseField,
  internet: expenseField,
  groceries: expenseField,
  carPayment: expenseField,
  transportation: expenseField,
  insurance: expenseField,
  other: expenseField,
});

export type ExpensesInput = z.infer<typeof expensesSchema>;

export const applicationSchema = z.object({
  // Phase 1 — contact
  firstName: z.string().min(1, "Please enter your first name"),
  lastName: z.string().min(1, "Please enter your last name"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  phone: z
    .string()
    .min(10, "Please enter a valid phone number")
    .regex(/^[0-9()+\-.\s]+$/, "Please enter a valid phone number"),
  zip: z.string().regex(/^\d{5}$/, "Enter a 5-digit ZIP code"),

  // Phase 2 — accounts (tradelines)
  tradelines: z.array(tradelineSchema).min(1, "Add at least one account"),

  // Phase 3 — monthly picture
  currentMonthlyPayment: z
    .number({ invalid_type_error: "Enter an approximate amount" })
    .min(0, "Enter an approximate amount"),
  monthlyBudget: z
    .number({ invalid_type_error: "Enter an approximate amount" })
    .min(0, "Enter an approximate amount"),
  employment: z.enum(values(employmentOptions), {
    errorMap: () => ({ message: "Select one" }),
  }),
  // Optional — improves DTI + affordability. Never gates progression.
  income: incomeSchema.optional(),
  // Optional — real essential expenses sharpen residual capacity. Never gates.
  essentialExpenses: expensesSchema.optional(),

  // Phase 6 — goals + qualification + consent
  goal: z.enum(values(goalOptions), {
    errorMap: () => ({ message: "Pick what fits best" }),
  }),
  creditPriority: z.enum(values(creditPriorityOptions), {
    errorMap: () => ({ message: "Select one" }),
  }),
  timeline: z.enum(values(timelineOptions), {
    errorMap: () => ({ message: "Select one" }),
  }),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please confirm to continue" }),
  }),
  // Mandatory pre-submit review of the legal documents (TSR best practice).
  agreementReviewed: z.literal(true, {
    errorMap: () => ({
      message:
        "Please confirm you've reviewed the Program Agreement, Terms, and Privacy Policy",
    }),
  }),
});

export type ApplicationData = z.infer<typeof applicationSchema>;

export const defaultValues: Partial<ApplicationData> = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  zip: "",
  tradelines: [],
  currentMonthlyPayment: undefined,
  monthlyBudget: undefined,
  employment: undefined,
  income: {
    precision: "exact",
    frequency: "monthly",
    type: "net",
    includesHousehold: false,
    source: "self_reported",
  },
  essentialExpenses: {},
  goal: undefined,
  creditPriority: undefined,
  timeline: undefined,
  consent: undefined as unknown as true,
  agreementReviewed: undefined as unknown as true,
};

/** A newly-added, empty tradeline row. */
export function emptyTradeline(): Tradeline {
  return {
    id: cryptoId(),
    creditor: "",
    type: "credit-card",
    balance: 0,
    limit: 0,
    apr: 22.99,
    minPayment: 0,
    opened: "",
    status: "current",
  };
}

/** A realistic sample portfolio — powers the "import my accounts" demo. */
export function sampleTradelines(): Tradeline[] {
  return [
    { id: cryptoId(), creditor: "Summit Visa", type: "credit-card", balance: 8450, limit: 10000, apr: 24.99, minPayment: 212, opened: "2018-05", status: "current" },
    { id: cryptoId(), creditor: "Northgate Mastercard", type: "credit-card", balance: 6120, limit: 7500, apr: 27.49, minPayment: 168, opened: "2019-11", status: "past-due" },
    { id: cryptoId(), creditor: "Everline Personal Loan", type: "personal-loan", balance: 9300, apr: 18.5, minPayment: 260, opened: "2021-03", status: "current" },
    { id: cryptoId(), creditor: "Harbor Retail Card", type: "retail-card", balance: 2380, limit: 3000, apr: 29.99, minPayment: 74, opened: "2020-08", status: "current" },
    { id: cryptoId(), creditor: "Cedar Medical", type: "medical", balance: 4150, apr: 0, minPayment: 95, opened: "2023-02", status: "collections" },
  ];
}

function cryptoId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `tl_${Math.random().toString(36).slice(2, 10)}`;
}

/** Fields validated at each phase (0-indexed) before advancing. Empty = display-only. */
export const stepFields: (keyof ApplicationData)[][] = [
  ["firstName", "lastName", "email", "phone", "zip"],
  ["tradelines"],
  ["currentMonthlyPayment", "monthlyBudget", "employment"],
  [], // tradeline review (display)
  [], // comparison (display)
  ["goal", "creditPriority", "timeline", "consent", "agreementReviewed"],
];

export const stepMeta = [
  { phase: "Phase 1", title: "Let's start with hello", subtitle: "So we can tailor your plan and reach you when it's ready." },
  { phase: "Phase 2", title: "Map your accounts", subtitle: "Import a sample or add each account. Ballpark numbers are fine." },
  { phase: "Phase 3", title: "Your monthly picture", subtitle: "This shapes a plan you can actually afford." },
  { phase: "Phase 4", title: "Review each tradeline", subtitle: "See exactly what's happening with every account." },
  { phase: "Phase 5", title: "Your plan, side by side", subtitle: "Current path vs. Debt Angel — in real dollars." },
  { phase: "Phase 6", title: "Goals & submit", subtitle: "One last look before we build your plan." },
] as const;

/**
 * Honest fit signal shown to the user. Guidance, not a hard gate —
 * we never reject anyone outright.
 */
export function assessFit(data: Partial<ApplicationData>): {
  tone: "good" | "caution";
  headline: string;
  body: string;
} {
  const debt = (data.tradelines ?? []).reduce((a, t) => a + (t.balance || 0), 0);
  if (data.creditPriority === "critical") {
    return {
      tone: "caution",
      headline: "Let's talk before you enroll",
      body: "Because protecting your credit is critical right now, a resolution plan may not be your best first move. We'll walk through lower-impact options honestly — even if that means not enrolling.",
    };
  }
  if (debt > 0 && debt < 7500) {
    return {
      tone: "caution",
      headline: "There may be a simpler path",
      body: "At this balance, a focused payoff plan or credit counseling might serve you better than a resolution program. You'll get a straight recommendation — no pressure to enroll.",
    };
  }
  return {
    tone: "good",
    headline: "This looks like a strong fit",
    body: "Based on what you've shared, a Debt Angel plan could create real breathing room and meaningful savings. Submit and we'll confirm the details and finalize your exact plan.",
  };
}
