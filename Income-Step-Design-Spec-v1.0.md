# Debt Angel — Income Step Design & Implementation Spec (v1.0)

**Author:** Product Design + UX Writing
**Status:** Ready for implementation
**Stack it targets:** Next.js (App Router) · React Hook Form + Zod · Supabase (Postgres + RLS)
**Grounded in the live code:** `components/application/apply-wizard.tsx`, `lib/application-schema.ts`, `lib/cash-flow.ts`, `lib/plan.ts`, `lib/actions/submit-application.ts`, `lib/actions/update-application.ts`, `supabase/migrations/002_apply.sql`.

---

## 0. TL;DR (the whole decision in one paragraph)

Income is **not a new step**. It is added to the existing **Phase 3 — "Your monthly picture"** (`step` index `2` in `apply-wizard.tsx`), where we already collect *comfortable monthly amount* and *employment*. It becomes the first field of that step because it frames everything below it. It is **optional but strongly encouraged** — a user can enter an exact amount, choose a range, or skip, and the plan still computes (skipping falls back to today's `cash-flow.ts` heuristic). Real income replaces the fabricated income currently synthesized in `buildCashFlowSnapshot`, which immediately upgrades DTI and the recommended deposit from a guess to a real number. It is deliberately **decoupled from the future CRS credit pull**, because credit reports contain tradelines, not income — so nothing here has to be rebuilt when automatic debt import ships.

---

## 1. Recommended Placement & Flow

### 1.1 Apply / onboarding flow

The live wizard (`apply-wizard.tsx`, driven by `stepMeta` / `stepFields` in `lib/application-schema.ts`) has six phases:

| Step index | Phase | Today | With income |
|---|---|---|---|
| 0 | Contact | name, email, phone, ZIP | unchanged |
| 1 | Map your accounts | tradelines | unchanged (CRS import lands here later) |
| **2** | **Your monthly picture** | `currentMonthlyPayment`, `monthlyBudget`, `employment`, `CashFlowSummary` | **+ income (new, first field)** |
| 3 | Review each tradeline | display | unchanged |
| 4 | Your plan, side by side | comparison + `PlanProgressPanel` | now income-aware |
| 5 | Goals & submit | goal, creditPriority, timeline, consents | unchanged |

**Recommendation: put income at the top of Step 2, above "Comfortable monthly amount."**

Reasoning:

- Affordability and DTI need **income + debt payments in the same view**. By the end of Step 2 we already have debt payments; income is the missing half. Adding it here closes the loop without a new screen.
- Income sits naturally beside the `employment` control that already lives in this step — "what you earn" and "how you earn it" belong together.
- The order **income → comfortable amount → employment** lets us reflect a live, honest cash-flow read (`CashFlowSummary`) at the bottom of the same step, so the user sees *why we asked* immediately.

**Do not add a 7th step.** A standalone income screen reads like a loan underwriting gate and is a classic abandonment point in debt tools. One extra field on an existing step is far lower friction than one extra step.

### 1.2 Dashboard (editing later)

Dashboard edits already recompute the plan server-side via `updateApplication` (`lib/actions/update-application.ts`), which today accepts `tradelines`, `currentMonthlyPayment`, `monthlyBudget`. Income becomes a peer of those:

- Surface a **"Your monthly picture"** edit card on `/dashboard/[id]` containing the same income control used in the wizard (see reusable `<IncomeCapture>` in §5).
- On save, include income in the `updateApplication` payload; the server normalizes it and re-runs `computePlan`. Because the dashboard already re-persists the whole plan on edit, income slots into the exact same path — no new action needed, just an extended input schema.

### 1.3 Sequencing with debt mapping (manual now, automatic later)

```
Contact ─▶ Accounts (manual add today) ─▶ Monthly picture (+income) ─▶ Review ─▶ Comparison ─▶ Submit
                    │                                   ▲
                    │  (future) CRS auto-import         │  income stays manual — reports have no income
                    └───────────────────────────────────┘
```

Income is entered **after** accounts so the user has already seen their debt and is primed to understand *why affordability matters*. When CRS auto-import launches, it changes **only the Accounts step** (it pre-fills tradelines). The income step is untouched.

### 1.4 Sequencing with the future CRS Credit API pull

The CRS pull returns **tradelines and credit attributes, not verified income.** So:

- The credit pull and the income capture are **independent inputs** that both feed `computePlan`.
- Income remains **self-reported** by default. The data model ships with a `source` discriminator (`self_reported | verified`) so that *if* an income-verification source is added later (payroll/bank link, or a CRS income-estimate attribute used only as a prefill hint), we flip `source` and optionally pre-fill the field — **no UI rework**.
- Recommended real-world order once CRS is live: **Accounts (auto-import) → confirm tradelines → income (still manual) → plan.** The credit pull can run in the background while the user fills income, so neither blocks the other.

---

## 2. UX Design Spec

### 2.1 Screen layout (what the user sees in Step 2)

Top-to-bottom, single column on mobile, two-column grid where it already is on `sm+`:

1. **Framing line** (one sentence, non-negotiable for trust): *why* we ask and that it stays in their control. (Copy in §3.)
2. **Monthly income** — the primary field. Large currency input, `$` prefix, `inputMode="decimal"`. Defaults to a **monthly, take-home (net)** figure.
3. **Frequency control** (progressive): defaults to **Monthly**. A quiet "Paid differently?" link reveals a segmented control (Weekly · Every 2 weeks · Twice a month · Monthly · Yearly). We normalize to monthly for all math.
4. **"Prefer a range?"** toggle (progressive): swaps the number input for a native `<select>` of income bands. Choosing a band stores the band + its midpoint.
5. **Household toggle** (progressive, off by default): "Include a co-applicant's income?" — when on, the label becomes "Household take-home income."
6. **Comfortable monthly amount** (existing `monthlyBudget`).
7. **Employment** (existing radio).
8. **Live cash-flow read** (`CashFlowSummary`), now driven by real income, showing a plain-language affordability line and a payment-to-income chip.

### 2.2 Recommended fields (minimal but useful)

| Field | Control | Default | Required? |
|---|---|---|---|
| Income amount | Currency number **or** range select | empty | No (optional) |
| Frequency | Segmented (hidden until "Paid differently?") | `monthly` | Yes if amount entered |
| Net vs gross | Implicit — we ask for **take-home (net)** | `net` | n/a |
| Household | Toggle | `false` | No |
| Precision | Derived: `exact` \| `range` \| `declined` | `exact` | system |

**Why net (take-home), not gross:** users *know* their take-home number, and affordability (what they can actually deposit) is a function of net, not gross. We label the ratio "payment-to-income," not "DTI," to stay honest about what we measured. (Gross can be added later behind the same control if underwriting ever needs it; the `income_type` field is already there.)

### 2.3 Progressive disclosure & smart defaults

- **Smart default frequency = Monthly.** Most people can answer a monthly number fastest; power cases (weekly/biweekly) are one tap away.
- **Range and household are hidden by default.** They appear only when the user opts in, so the default state is a single clean field.
- **Prefill from the estimator:** the public estimator already passes `monthlyBudget` via `ApplyPrefill`. If we later capture a rough income on the estimator, prefill it here the same way (`prefill.income`), pre-populating but still editable.

### 2.4 Handling "I don't want to share exact income" (without breaking the experience)

Three graceful exits, in increasing privacy:

1. **Range instead of exact** — "Prefer a range?" → pick a band. We store `precision: 'range'`, the `rangeId`, and use the **band midpoint** for math. Copy reassures this is enough for a good estimate.
2. **Skip for now** — a quiet secondary link. Sets `precision: 'declined'`, leaves amount null. The plan still computes using the **existing heuristic** in `cash-flow.ts` (see §4.3), and we show a soft note that adding income later sharpens the plan.
3. **Never a hard block.** `Continue` is never disabled by income. Income is optional in the schema (see §4.1). This is the single most important anti-abandonment decision.

Whichever path they choose, the tone is *"this makes your plan more accurate,"* never *"we need to verify you."*

### 2.5 Mobile-first considerations

- Single-column stack; the two existing fields already use `grid-cols-1 sm:grid-cols-2`, so income spans full width above them.
- Large tap targets: currency input min-height 48px, `inputMode="decimal"`, `autoComplete="off"`, no spinner arrows.
- Frequency = segmented control that wraps to 2 rows on narrow screens rather than a dropdown (fewer taps).
- Range uses the **native** `<select>` for OS-level pickers on mobile.
- Helper text is **inline**, not tooltip-only (tooltips are hard to trigger on touch). A tooltip may *supplement* but never *hide* essential text.
- Keep the live `CashFlowSummary` below the fold-fields so the keyboard doesn't cover it while typing.

---

## 3. Exact Copy

All copy is calm, professional, transparent, non-judgmental. Drop-in ready.

### Section heading
> **Your income helps us right-size the plan**

*(This replaces nothing — it's a sub-heading inside Phase 3, whose step title stays "Your monthly picture.")*

### Subheading / helper text (the framing line)
> A rough number is all we need. We use it to make sure your plan fits your real budget — not to qualify or reject you. You stay in control, and you can update it anytime.

### Field — Monthly income
- **Label:** `Monthly take-home income`
- **Placeholder:** `e.g. 3,800`
- **Prefix:** `$`
- **Helper (inline, below field):** `What actually lands in your account each month, after taxes.`

### Control — Frequency (progressive)
- **Reveal link:** `Paid weekly or every two weeks? Change frequency`
- **Options:** `Weekly` · `Every 2 weeks` · `Twice a month` · `Monthly` · `Yearly`
- **Helper after selection (e.g. biweekly):** `We'll convert that to about {{monthly}}/mo.`

### Toggle — Range instead of exact
- **Link:** `Prefer to give a range?`
- **Select label:** `Monthly take-home income`
- **Select placeholder:** `Choose a range`
- **Options:** `Under $2,000` · `$2,000–$3,000` · `$3,000–$4,000` · `$4,000–$5,000` · `$5,000–$7,000` · `$7,000–$10,000` · `$10,000+`
- **Helper:** `A range is perfectly fine for an accurate estimate.`

### Toggle — Household
- **Label (off):** `Include a co-applicant's income?`
- **Label (on), field relabels to:** `Household take-home income`
- **Helper:** `Add this only if you'd fund the plan together.`

### Skip
- **Link:** `Skip for now`
- **Confirmation microcopy (inline, after skipping):** `No problem — we'll use a careful estimate. Adding your income later will sharpen your plan.`

### Tooltip text (supplemental, optional)
- **On "take-home":** `Take-home is your pay after taxes and deductions — the amount deposited to your bank.`
- **On "why we ask":** `We use income only to size a monthly deposit you can sustain. It's never a credit check and never shared to run one.`

### Live cash-flow line (drives `CashFlowSummary` when income is present)
- **Affordability, comfortable:** `Your plan deposit of {{deposit}}/mo looks comfortable next to your income.`
- **Affordability, tight:** `This deposit is workable but on the tighter side of your budget. We'll help you fine-tune it.`
- **Payment-to-income chip label:** `Debt payments today: {{pct}}% of income`

### Primary & secondary CTAs
- **Primary (unchanged wizard button):** `Continue`
- **Secondary within the income block:** `Skip for now`
- **Dashboard save button:** `Save changes`

### Validation / edge-case microcopy
- **Non-numeric / empty when they started typing:** `Enter an approximate amount, or choose a range.`
- **Zero entered:** `If you have no income right now, that's okay — tap "Skip for now" and we'll use an estimate.`
- **Suspiciously low vs. debt payments (soft warning, non-blocking):** `That's lower than your current debt payments — double-check, or switch to a range.`
- **Very high (> $40,000/mo, soft):** `Just checking — is that your monthly (not yearly) take-home?`
- **Range not selected after toggling on:** `Pick a range to continue, or switch back to entering a number.`

Tone rules honored: no "qualify/approve/deny," no "verify," no urgency, no judgment about the amount.

---

## 4. Data Model

### 4.1 Client schema (`lib/application-schema.ts`)

Add an `income` object to `applicationSchema`. Nested (not flat) so it future-proofs cleanly and serializes to one JSON/column group.

```ts
export const incomeFrequencyOptions = [
  { value: "weekly",   label: "Weekly",        perMonth: 52 / 12 },
  { value: "biweekly", label: "Every 2 weeks", perMonth: 26 / 12 },
  { value: "semimonthly", label: "Twice a month", perMonth: 2 },
  { value: "monthly",  label: "Monthly",       perMonth: 1 },
  { value: "annual",   label: "Yearly",        perMonth: 1 / 12 },
] as const;

export const incomeRangeOptions = [
  { value: "lt_2000",   label: "Under $2,000", mid: 1500 },
  { value: "2000_3000", label: "$2,000–$3,000", mid: 2500 },
  { value: "3000_4000", label: "$3,000–$4,000", mid: 3500 },
  { value: "4000_5000", label: "$4,000–$5,000", mid: 4500 },
  { value: "5000_7000", label: "$5,000–$7,000", mid: 6000 },
  { value: "7000_10000", label: "$7,000–$10,000", mid: 8500 },
  { value: "gte_10000", label: "$10,000+",     mid: 12000 },
] as const;

export const incomeSchema = z.object({
  precision: z.enum(["exact", "range", "declined"]).default("exact"),
  amount: z.number({ invalid_type_error: "Enter an approximate amount" })
           .min(0).max(1_000_000).optional(),         // present when precision = exact
  rangeId: z.enum(values(incomeRangeOptions)).optional(), // present when precision = range
  frequency: z.enum(values(incomeFrequencyOptions)).default("monthly"),
  type: z.enum(["net", "gross"]).default("net"),
  includesHousehold: z.boolean().default(false),
  source: z.enum(["self_reported", "verified"]).default("self_reported"),
})
.refine(v => v.precision !== "exact" || typeof v.amount === "number",
  { message: "Enter an amount or choose a range", path: ["amount"] })
.refine(v => v.precision !== "range" || !!v.rangeId,
  { message: "Pick a range to continue", path: ["rangeId"] });

// In applicationSchema, income is OPTIONAL so it never blocks submit:
income: incomeSchema.optional(),
```

- Add to `defaultValues`: `income: { precision: "exact", frequency: "monthly", type: "net", includesHousehold: false, source: "self_reported" }`.
- **Do not add income to `stepFields[2]`** — that array gates `Continue`, and income must not block. Validate income *softly* inside the component instead (show inline messages) and let it pass.

### 4.2 Normalized value (single helper, used everywhere)

```ts
// lib/income.ts  (new, tiny, shared client+server)
export function monthlyNetIncome(income?: IncomeInput): number | null {
  if (!income || income.precision === "declined") return null;
  const raw = income.precision === "range"
    ? incomeRangeOptions.find(r => r.value === income.rangeId)?.mid ?? null
    : income.amount ?? null;
  if (raw == null) return null;
  const perMonth = incomeFrequencyOptions.find(f => f.value === income.frequency)?.perMonth ?? 1;
  return Math.round(raw * perMonth);
}
```

This is the one function every consumer calls. Returns `null` when the user declined → callers fall back to the heuristic.

### 4.3 Connect to DTI (`lib/cash-flow.ts`)

`buildCashFlowSnapshot` currently **fabricates** income:

```ts
// today — a guess:
const estimatedMonthlyIncome = Math.round(Math.max(debt / 0.15, (debt + budget) * 1.35, 3500));
```

Change it to accept an optional real value and flag the source:

```ts
export function buildCashFlowSnapshot(params: {
  currentMonthlyPayment: number;
  monthlyBudget: number;
  planSuggestedMonthly?: number;
  monthlyNetIncome?: number | null;   // NEW
}): CashFlowSnapshot {
  ...
  const incomeIsReal = params.monthlyNetIncome != null && params.monthlyNetIncome > 0;
  const estimatedMonthlyIncome = incomeIsReal
    ? params.monthlyNetIncome!
    : Math.round(Math.max(debt / 0.15, (debt + budget) * 1.35, 3500)); // fallback unchanged
  ...
  return { ...snapshot, incomeSource: incomeIsReal ? "user" : "estimated" };
}
```

Add `incomeSource: "user" | "estimated"` to `CashFlowSnapshot`. The UI uses it to label the ratio honestly ("based on the income you shared" vs "based on a careful estimate").

### 4.4 Connect to plan affordability / recommended deposit (`lib/plan.ts`)

`computePlan` is the server's single source of truth. Extend it to accept income and use it to sanity-check the recommended deposit:

```ts
export function computePlan(
  tradelines, currentMonthlyPayment, monthlyBudget,
  monthlyNetIncome?: number | null,   // NEW, optional
): ComputedPlan {
  ...
  const snapshot = buildCashFlowSnapshot({
    currentMonthlyPayment: resolvedCurrentMonthly,
    monthlyBudget,
    planSuggestedMonthly: plan.suggestedMonthly,
    monthlyNetIncome,
  });
  // Affordability guardrail: never *recommend* a deposit above disposable income.
  const affordableDeposit = monthlyNetIncome
    ? Math.min(plan.suggestedMonthly, Math.max(150, snapshot.disposableIncome))
    : plan.suggestedMonthly;
  return { ..., snapshot, affordableDeposit };
}
```

- Feed `affordableDeposit` into `PlanProgressPanel` / the recommended-deposit copy.
- Optionally extend `assessFit` (`application-schema.ts`) with an affordability signal: if `monthlyBudget > disposableIncome`, return a gentle "caution" nudging a lower deposit — consistent with the existing honest-fit pattern.

### 4.5 Persistence (Supabase) — new migration `005_income.sql`

Store the raw inputs **and** the server-normalized monthly value (authoritative, same philosophy as the `plan_*` columns which are recomputed server-side and never trusted from the client).

```sql
-- supabase/migrations/005_income.sql
alter table public.applications
  add column if not exists income_precision text not null default 'declined'
    check (income_precision in ('exact','range','declined')),
  add column if not exists income_amount numeric(12,2),          -- raw, as entered (nullable)
  add column if not exists income_range_id text,                 -- when precision = range
  add column if not exists income_frequency text not null default 'monthly',
  add column if not exists income_type text not null default 'net'
    check (income_type in ('net','gross')),
  add column if not exists income_includes_household boolean not null default false,
  add column if not exists income_source text not null default 'self_reported'
    check (income_source in ('self_reported','verified')),
  add column if not exists income_monthly_net numeric(12,2);     -- server-normalized, authoritative
```

- All nullable/defaulted → **backfills cleanly** for existing rows (they become `precision='declined'`, `income_monthly_net = null`).
- No RLS changes: existing `applications_update_own` / `_insert_own` policies already cover these columns.
- Reuse the existing `set_updated_at` trigger — untouched.

### 4.6 Wire the actions

- `submit-application.ts`: after parse, compute `const mni = monthlyNetIncome(form.income);`, pass to `computePlan(..., mni)`, and add the income columns to the `.insert(...)` (raw fields + `income_monthly_net: mni`).
- `update-application.ts`: extend `updateSchema` with `income: incomeSchema.optional()`, compute `mni`, pass to `computePlan`, add income columns to the `.update(...)`. **Critical:** if you skip this, dashboard edits silently drop income and DTI drifts.
- Add `planColumns`-style helper `incomeColumns(income)` in `lib/income.ts` so both actions stay DRY.

---

## 5. Future-Proofing for the CRS Credit API

### 5.1 How income works with the credit pull

- **Credit reports do not contain income.** So the income step is permanently a *separate* input from the CRS pull. The pull fills tradelines; income stays user-entered. This separation is the future-proofing — there is no coupling to unwind later.
- Both inputs converge only at `computePlan(tradelines, ..., monthlyNetIncome)`. When CRS auto-import lands, `tradelines` arrive from the API instead of manual entry; the income argument is unchanged.

### 5.2 What stays the same vs. what evolves

| Stays identical | Evolves when CRS launches |
|---|---|
| Income capture UI (`<IncomeCapture>`) | Accounts step gains an "Import automatically" entry point |
| `incomeSchema` shape | `Tradeline` gains a `source: 'manual' \| 'imported'` field (see §6 tech-debt) |
| `monthlyNetIncome()` normalizer | Optionally, an income-verify source sets `income.source = 'verified'` and pre-fills the amount |
| `cash-flow.ts` / `plan.ts` consumption of `monthlyNetIncome` | `CashFlowSummary` can show a "verified" badge when `income_source = 'verified'` |
| DB income columns | (No change — `income_source` already allows `'verified'`) |

### 5.3 Reusable UI components to build now

Build these as self-contained so both the wizard and dashboard (and a future verify flow) reuse them:

- **`<CurrencyField>`** — `$`-prefixed numeric input, `inputMode="decimal"`, no spinners. (Reusable for `monthlyBudget` too.)
- **`<FrequencyToggle>`** — segmented control bound to `incomeFrequencyOptions`.
- **`<IncomeCapture>`** — the whole income block (amount ↔ range ↔ skip, frequency, household). Emits an `IncomeInput`. Drop it into `MonthlyStep` and the dashboard edit card unchanged.
- **`<SourceBadge source="manual|imported|self_reported|verified">`** — one badge component reused for both tradelines and income once imports/verification exist.

---

## 6. Implementation Notes

### 6.1 Ship-fast checklist (current stack only, no new deps)

1. `lib/application-schema.ts` — add `incomeFrequencyOptions`, `incomeRangeOptions`, `incomeSchema`; add optional `income` to `applicationSchema` + `defaultValues`. **Leave `stepFields[2]` unchanged.**
2. `lib/income.ts` (new) — `monthlyNetIncome()` + `incomeColumns()`.
3. `lib/cash-flow.ts` — accept `monthlyNetIncome`, add `incomeSource` to the snapshot.
4. `lib/plan.ts` — `computePlan(..., monthlyNetIncome?)`, compute `affordableDeposit`, expose snapshot.
5. `components/application/apply-wizard.tsx` — render `<IncomeCapture>` at the top of `MonthlyStep`; feed `monthlyNetIncome(watch("income"))` into the step's `CashFlowSummary`.
6. `lib/actions/submit-application.ts` + `update-application.ts` — normalize income, pass to `computePlan`, persist income columns; extend `updateSchema`.
7. `supabase/migrations/005_income.sql` — the additive migration above.
8. Dashboard `/dashboard/[id]` — add income to the edit card + `updateApplication` payload.

### 6.2 Things that would create technical debt for the CRS work — flag & avoid

- **Don't thread income through the estimator as a positional required arg.** Keep it optional on `computePlan` / inputs objects so the CRS import path (which won't always have income yet) doesn't break the signature.
- **Normalize income server-side and store `income_monthly_net` as authoritative** — mirror the existing "never trust client numbers" rule that `submitApplication` already follows for `plan_*`. Don't compute DTI from client-sent monthly values.
- **Add `precision`, `source`, and `income_type` now even though only `net`/`self_reported`/`exact` are used at launch.** Adding them later is a second migration and a schema break; adding them now is free.
- **Add `Tradeline.source` in the same PR (or the very next one).** It's the one piece of CRS prep that touches income's neighbor (the Accounts step) and lets `<SourceBadge>` be built once.
- **Remember the dead code.** `components/application/application-wizard.tsx` and `components/application/steps/*` are unused legacy (per `PROGRESS.md`) and reference an older `totalDebt`/`debtTypes` schema. **Do not add income there.** The live wizard is `apply-wizard.tsx`. Ideally delete the dead files in this PR to prevent someone implementing income in the wrong place.
- **Update `updateSchema` when you update the wizard.** The most likely silent bug: adding income to the wizard but not to `update-application.ts`, so dashboard edits recompute the plan with `monthlyNetIncome = undefined` and DTI regresses to the heuristic.

### 6.3 Analytics / trust instrumentation (optional, cheap)

- Track `income_precision` chosen (`exact` / `range` / `declined`) to measure how many users share vs. skip — a direct read on whether the framing copy is working.
- Never log the raw income value to client analytics; keep it server-side under RLS like the rest of the application data.

---

## 7. Design principles honored (self-check)

- **Better than typical debt tools** — most skip income or make it feel like a loan app; we ask once, optionally, with a range/skip escape, and immediately show the value in a live cash-flow read.
- **Trust & clarity** — one honest framing sentence, "not to qualify or reject," net take-home in plain words, no credit-check implication.
- **Minimize cognitive load** — one field by default; frequency, range, household are progressive.
- **Smart & in control, not interrogated** — range and skip are first-class, `Continue` never blocks, editable anytime on the dashboard.
- **Compliance-aware** — no promises, no "approve/deny," honest "payment-to-income" labeling, income never presented as or used for a credit check.
```