# Debt Angel — Progress & Handoff Note
**Last updated:** July 10, 2026 (compliance verification + finishing pass)

## Current Status Snapshot (verified in local repo)

| Surface                     | Local Repo State | Notes |
|-----------------------------|------------------|-------|
| `lib/disclosures.ts`        | ✅ Complete       | Single source of truth: 4 TSR disclosures, dedicated-account rights (FDIC, ownership, withdraw anytime, 7-business-day return), "$0 until settled", compliance strip. Short + long variants. |
| `components/shared/disclosures.tsx` | ✅ Complete | `KeyRisksRights`, `TsrDisclosureSummary`, `DedicatedAccountRights`, `ImportantDisclosuresPanel` (open by default). All read from `lib/disclosures.ts`. |
| `/privacy`                  | ✅ Counsel-ready  | Full CCPA/CPRA + multi-state, cookies, retention, dedicated-account data, rights. Contact = `support@debtangel.example` / `(000) 000-0000`. Entity name / mailing address left as counsel placeholders by design. |
| `/terms`                    | ✅ Counsel-ready  | Full ToS: fees (18–25%), dedicated account, cancellation, risks, tax/credit, arbitration placeholder for counsel. |
| `/agreement`                | ✅ Complete       | Full sample Program Agreement: sample banner, all 4 TSR disclosures, fee schedule, dedicated-account rights, 7-day return, cancellation, tax/credit warnings, "customized after eligibility review — you approve before anything moves." Working Download-PDF / print stylesheet. |
| `/state-availability`       | ✅ Complete       | Contact reconciled to `support@debtangel.example` / `(000) 000-0000`. State list is a counsel placeholder by design. |
| Compliance strip            | ✅ Live            | `SiteFooter` renders it above the footer on every page. |
| Footer / nav legal links    | ✅ Live            | Privacy, Terms, Program Agreement, State Availability in footer on every page; also in header mobile nav. |
| Estimator disclosures       | ✅ Live            | `ImportantDisclosuresPanel` (open by default) with negative consequences + dedicated-account rights + doc links. |
| Wizard callouts + gate      | ✅ Live            | `KeyRisksRights` on funding (Step 3) and comparison (Step 5); `TsrDisclosureSummary` before submit; mandatory `agreementReviewed` checkbox (full mandated wording) linking Agreement/Terms/Privacy; Submit disabled until checked; enforced in Zod (`z.literal(true)`) + server (`submitApplication` re-parses schema). |
| FAQ & How-it-Works          | ✅ Complete       | FAQ leads credit answer with "Yes — it can hurt your credit…"; ownership, cancel-anytime, 1099-C, stop-paying, timeline all honest. How-it-Works Phases 3 & 4 carry FDIC / own-and-control / 7-day-return / $0-until-settled language. |

## What changed in this session
- Wizard review-gate checkbox strengthened to the full mandated wording (risks, results not guaranteed, own/control dedicated-account funds, cancel anytime).
- `/state-availability` contact fixed from `hello@mydebtangel.com` → `support@debtangel.example`; `[PHONE]` → `(000) 000-0000`; date set. Now single-sourced from `lib/site`.
- `/privacy` and `/terms`: `[PHONE]` → `(000) 000-0000`, `[DATE]` → July 10, 2026, contact single-sourced from `lib/site`.
- `legal/Privacy-Policy.md` and `legal/Terms-of-Service.md` synced to the same email/phone/date as the rendered pages.

## Known non-blockers
- `components/application/application-wizard.tsx` and `components/application/steps/*` are **dead code** from an older schema (reference `totalDebt`/`debtTypes`). Not imported anywhere; the live wizard is `components/application/apply-wizard.tsx` (re-exported via `components/ApplyWizard.tsx`). They produce `tsc` errors but the build ships because `next.config.mjs` sets `typescript.ignoreBuildErrors`. Recommend deleting them in a follow-up cleanup.
- Counsel-completion placeholders remain by design: legal entity name, mailing address, governing-law state, dispute-resolution mechanism, and the authorized-states list.

## Pre-launch, before public traffic
- Replace `support@debtangel.example` and `(000) 000-0000` in `lib/site.ts` with the real support address/number (everything else reads from there).
- Have counsel complete entity name, mailing address, governing-law/venue, dispute resolution, and the authorized-states list.
- Replace placeholder testimonials/proof points in `lib/site.ts` with substantiated, consented content.
