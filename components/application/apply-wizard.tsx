"use client";

import * as React from "react";
import Link from "next/link";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Loader2,
  PartyPopper,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioCard } from "@/components/ui/radio-group";
import { Wordmark } from "@/components/brand/logo";
import { TradelineView } from "@/components/shared/tradeline-view";
import { ComparisonView } from "@/components/shared/comparison-view";
import { TradelineForm, AddAccountButton } from "@/components/application/tradeline-form";

import {
  applicationSchema,
  defaultValues,
  stepFields,
  stepMeta,
  employmentOptions,
  goalOptions,
  creditPriorityOptions,
  timelineOptions,
  sampleTradelines,
  assessFit,
  type ApplicationData,
} from "@/lib/application-schema";
import { estimate, buildComparison, type Tradeline } from "@/lib/estimator";
import { site, disclaimers } from "@/lib/site";
import { cn, currency } from "@/lib/utils";

const TOTAL_STEPS = stepMeta.length;

export function ApplyWizard() {
  const reduce = useReducedMotion();
  const [step, setStep] = React.useState(0);
  const [maxSeen, setMaxSeen] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [showAdd, setShowAdd] = React.useState(false);

  const form = useForm<ApplicationData>({
    resolver: zodResolver(applicationSchema),
    defaultValues,
    mode: "onTouched",
  });
  const {
    control,
    register,
    handleSubmit,
    trigger,
    watch,
    getValues,
    formState: { errors },
  } = form;

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "tradelines",
    // Our Tradeline objects already have an `id`; keep RHF's key separate so
    // `field.id` remains our real tradeline id for lookups.
    keyName: "_key",
  });

  const tradelines = (watch("tradelines") ?? []) as Tradeline[];

  const goTo = (n: number) => {
    setStep(n);
    setMaxSeen((m) => Math.max(m, n));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = async () => {
    const fieldsToCheck = stepFields[step];
    const ok = fieldsToCheck.length === 0 ? true : await trigger(fieldsToCheck as any);
    if (ok) goTo(Math.min(step + 1, TOTAL_STEPS - 1));
  };
  const back = () => goTo(Math.max(step - 1, 0));

  const onSubmit = async (data: ApplicationData) => {
    setSubmitting(true);
    // Simulated persistence. Swap for an API route / Supabase insert.
    // eslint-disable-next-line no-console
    console.log("Debt Angel application:", data);
    await new Promise((r) => setTimeout(r, 1100));
    setSubmitting(false);
    setDone(true);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (done) return <ThankYou firstName={getValues("firstName")} />;

  const anim = reduce
    ? {}
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress nav */}
      <PhaseNav step={step} maxSeen={maxSeen} onJump={goTo} />

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <div className="rounded-3xl border border-white/10 bg-card p-5 shadow-lift sm:p-8">
          <header className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              {stepMeta[step].phase} · Step {step + 1} of {TOTAL_STEPS}
            </span>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {stepMeta[step].title}
            </h1>
            <p className="mt-1 text-muted-foreground">{stepMeta[step].subtitle}</p>
          </header>

          <AnimatePresence mode="wait">
            <motion.div key={step} {...anim}>
              {step === 0 && <ContactStep register={register} errors={errors} />}

              {step === 1 && (
                <AccountsStep
                  fields={fields as unknown as Tradeline[]}
                  tradelines={tradelines}
                  errors={errors}
                  editingId={editingId}
                  showAdd={showAdd || fields.length === 0}
                  onAdd={(tl) => {
                    append(tl);
                    setShowAdd(false);
                  }}
                  onUpdate={(id, tl) => {
                    const idx = fields.findIndex((f) => (f as any).id === id);
                    if (idx >= 0) update(idx, tl);
                    setEditingId(null);
                  }}
                  onRemove={(id) => {
                    const idx = fields.findIndex((f) => (f as any).id === id);
                    if (idx >= 0) remove(idx);
                  }}
                  onEdit={setEditingId}
                  onStartAdd={() => setShowAdd(true)}
                  onCancelEdit={() => setEditingId(null)}
                  onCancelAdd={() => setShowAdd(false)}
                  onLoadSample={() => {
                    // reset then append sample
                    remove();
                    sampleTradelines().forEach((t) => append(t));
                    setShowAdd(false);
                  }}
                />
              )}

              {step === 2 && (
                <MonthlyStep register={register} control={control} errors={errors} />
              )}

              {step === 3 && <ReviewStep tradelines={tradelines} onEditJump={() => goTo(1)} />}

              {step === 4 && (
                <ComparisonStep
                  tradelines={tradelines}
                  currentMonthlyPayment={Number(watch("currentMonthlyPayment")) || 0}
                  monthlyBudget={Number(watch("monthlyBudget")) || 0}
                />
              )}

              {step === 5 && (
                <SubmitStep
                  control={control}
                  register={register}
                  errors={errors}
                  tradelines={tradelines}
                  creditPriority={watch("creditPriority")}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-6">
            {step > 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={back}
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            ) : (
              <Link
                href="/"
                className="shrink-0 px-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Exit
              </Link>
            )}

            {step < TOTAL_STEPS - 1 ? (
              <Button
                type="button"
                size="lg"
                onClick={next}
                className="flex-1 sm:flex-none"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                variant="money"
                size="lg"
                disabled={submitting}
                className="flex-1 sm:flex-none"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Building…
                  </>
                ) : (
                  <>
                    Submit <Check className="h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>

      <p className="mt-4 px-2 text-center text-[11px] leading-relaxed text-muted-foreground">
        {disclaimers.estimator}
      </p>
    </div>
  );
}

/* ── Progress nav ─────────────────────────────────────────────────────── */

function PhaseNav({
  step,
  maxSeen,
  onJump,
}: {
  step: number;
  maxSeen: number;
  onJump: (n: number) => void;
}) {
  const pct = ((step + 1) / TOTAL_STEPS) * 100;
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <Link href="/" aria-label={`${site.name} home`}>
          <Wordmark size="md" withMark />
        </Link>
        <span className="text-sm font-semibold text-gold">
          {Math.round(pct)}% complete
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gold-sheen transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ol className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {stepMeta.map((m, i) => {
          const state = i === step ? "current" : i < step ? "done" : "todo";
          const reachable = i <= maxSeen;
          return (
            <li key={m.phase} className="shrink-0">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && onJump(i)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  state === "current" && "border-gold bg-gold/15 text-gold",
                  state === "done" && "border-money/40 bg-money/15 text-money",
                  state === "todo" && "border-white/10 bg-card text-foreground/55",
                  !reachable && "cursor-not-allowed opacity-60",
                )}
              >
                {state === "done" ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <span>{i + 1}</span>
                )}
                <span className="hidden sm:inline">{m.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ── Step 1: Contact ──────────────────────────────────────────────────── */

function Field({
  label,
  htmlFor,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor}>{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function ContactStep({ register, errors }: any) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="First name" htmlFor="firstName" error={errors.firstName?.message}>
        <Input id="firstName" autoComplete="given-name" {...register("firstName")} />
      </Field>
      <Field label="Last name" htmlFor="lastName" error={errors.lastName?.message}>
        <Input id="lastName" autoComplete="family-name" {...register("lastName")} />
      </Field>
      <Field
        label="Email"
        htmlFor="email"
        error={errors.email?.message}
        className="sm:col-span-2"
      >
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
      </Field>
      <Field label="Phone" htmlFor="phone" error={errors.phone?.message}>
        <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
      </Field>
      <Field label="ZIP code" htmlFor="zip" error={errors.zip?.message}>
        <Input id="zip" inputMode="numeric" maxLength={5} {...register("zip")} />
      </Field>
    </div>
  );
}

/* ── Step 2: Accounts ─────────────────────────────────────────────────── */

function AccountsStep({
  fields,
  tradelines,
  errors,
  editingId,
  showAdd,
  onAdd,
  onUpdate,
  onRemove,
  onEdit,
  onStartAdd,
  onCancelEdit,
  onCancelAdd,
  onLoadSample,
}: {
  fields: Tradeline[];
  tradelines: Tradeline[];
  errors: any;
  editingId: string | null;
  showAdd: boolean;
  onAdd: (tl: Tradeline) => void;
  onUpdate: (id: string, tl: Tradeline) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
  onStartAdd: () => void;
  onCancelEdit: () => void;
  onCancelAdd: () => void;
  onLoadSample: () => void;
}) {
  const editing = tradelines.find((t) => t.id === editingId);

  return (
    <div>
      {fields.length === 0 && (
        <div className="mb-4 flex flex-col items-start gap-3 rounded-2xl bg-muted/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            New here? Load a realistic sample portfolio to see how it works.
          </p>
          <Button type="button" variant="outline" size="sm" onClick={onLoadSample}>
            <Sparkles className="h-4 w-4" /> Load sample accounts
          </Button>
        </div>
      )}

      {tradelines.length > 0 && (
        <div className="mb-4">
          <TradelineView tradelines={tradelines} onEdit={onEdit} onRemove={onRemove} />
        </div>
      )}

      {editing ? (
        <TradelineForm
          initial={editing}
          onSave={(tl) => onUpdate(editing.id, tl)}
          onCancel={onCancelEdit}
        />
      ) : showAdd ? (
        <TradelineForm onSave={onAdd} onCancel={fields.length > 0 ? onCancelAdd : undefined} />
      ) : (
        <AddAccountButton onClick={onStartAdd} />
      )}

      {errors.tradelines?.message && (
        <p className="mt-2 text-xs text-destructive">{errors.tradelines.message}</p>
      )}
    </div>
  );
}

/* ── Step 3: Monthly picture ──────────────────────────────────────────── */

function MonthlyStep({ register, control, errors }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Current total monthly payments ($)"
          htmlFor="currentMonthlyPayment"
          error={errors.currentMonthlyPayment?.message}
        >
          <Input
            id="currentMonthlyPayment"
            type="number"
            inputMode="numeric"
            min={0}
            {...register("currentMonthlyPayment", { valueAsNumber: true })}
          />
        </Field>
        <Field
          label="Comfortable monthly amount ($)"
          htmlFor="monthlyBudget"
          error={errors.monthlyBudget?.message}
        >
          <Input
            id="monthlyBudget"
            type="number"
            inputMode="numeric"
            min={0}
            {...register("monthlyBudget", { valueAsNumber: true })}
          />
        </Field>
      </div>

      <div>
        <Label>Employment</Label>
        <Controller
          control={control}
          name="employment"
          render={({ field }) => (
            <RadioGroup
              className="mt-2 sm:grid-cols-2"
              value={field.value}
              onValueChange={field.onChange}
            >
              {employmentOptions.map((o) => (
                <RadioCard key={o.value} value={o.value} label={o.label} />
              ))}
            </RadioGroup>
          )}
        />
        {errors.employment?.message && (
          <p className="mt-1 text-xs text-destructive">{errors.employment.message}</p>
        )}
      </div>
    </div>
  );
}

/* ── Step 4: Tradeline review ─────────────────────────────────────────── */

function ReviewStep({
  tradelines,
  onEditJump,
}: {
  tradelines: Tradeline[];
  onEditJump: () => void;
}) {
  return (
    <div>
      <TradelineView tradelines={tradelines} />
      <div className="mt-5 flex items-center justify-between rounded-2xl bg-muted/60 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          Something look off? You can edit any account.
        </p>
        <Button type="button" variant="outline" size="sm" onClick={onEditJump}>
          Edit accounts
        </Button>
      </div>
    </div>
  );
}

/* ── Step 5: Comparison ───────────────────────────────────────────────── */

function ComparisonStep({
  tradelines,
  currentMonthlyPayment,
  monthlyBudget,
}: {
  tradelines: Tradeline[];
  currentMonthlyPayment: number;
  monthlyBudget: number;
}) {
  const totalDebt = tradelines.reduce((a, t) => a + (t.balance || 0), 0);
  const minSum = tradelines.reduce((a, t) => a + (t.minPayment || 0), 0);
  const inputs = {
    totalDebt,
    currentMonthlyPayment: currentMonthlyPayment || minSum,
    monthlyBudget: monthlyBudget || Math.max(minSum * 0.7, 150),
  };
  const comparison = buildComparison(inputs, estimate(inputs));
  return (
    <div>
      <div className="mb-4 rounded-2xl border border-money/25 bg-money/10 px-4 py-3 text-sm text-money">
        Based on {tradelines.length} account{tradelines.length === 1 ? "" : "s"} totaling{" "}
        <strong>{currency(totalDebt)}</strong>. Here&rsquo;s your current path next to
        your Debt Angel plan.
      </div>
      <ComparisonView comparison={comparison} />
    </div>
  );
}

/* ── Step 6: Goals & submit ───────────────────────────────────────────── */

function SubmitStep({
  control,
  register,
  errors,
  tradelines,
  creditPriority,
}: any) {
  const fit = assessFit({ tradelines, creditPriority });
  return (
    <div className="space-y-7">
      <div>
        <Label>Your main goal</Label>
        <Controller
          control={control}
          name="goal"
          render={({ field }) => (
            <RadioGroup className="mt-2" value={field.value} onValueChange={field.onChange}>
              {goalOptions.map((o) => (
                <RadioCard key={o.value} value={o.value} label={o.label} description={o.description} />
              ))}
            </RadioGroup>
          )}
        />
        {errors.goal?.message && (
          <p className="mt-1 text-xs text-destructive">{errors.goal.message}</p>
        )}
      </div>

      <div>
        <Label>How important is protecting your credit right now?</Label>
        <Controller
          control={control}
          name="creditPriority"
          render={({ field }) => (
            <RadioGroup className="mt-2" value={field.value} onValueChange={field.onChange}>
              {creditPriorityOptions.map((o) => (
                <RadioCard key={o.value} value={o.value} label={o.label} description={o.description} />
              ))}
            </RadioGroup>
          )}
        />
        {errors.creditPriority?.message && (
          <p className="mt-1 text-xs text-destructive">{errors.creditPriority.message}</p>
        )}
      </div>

      <div>
        <Label>When are you looking to start?</Label>
        <Controller
          control={control}
          name="timeline"
          render={({ field }) => (
            <RadioGroup className="mt-2 sm:grid-cols-3" value={field.value} onValueChange={field.onChange}>
              {timelineOptions.map((o) => (
                <RadioCard key={o.value} value={o.value} label={o.label} />
              ))}
            </RadioGroup>
          )}
        />
        {errors.timeline?.message && (
          <p className="mt-1 text-xs text-destructive">{errors.timeline.message}</p>
        )}
      </div>

      {/* Honest fit signal */}
      <div
        className={cn(
          "rounded-2xl border p-4",
          fit.tone === "good"
            ? "border-money/30 bg-money/10"
            : "border-gold/30 bg-gold/10",
        )}
      >
        <p className="flex items-center gap-2 font-semibold">
          <ShieldCheck
            className={cn(
              "h-4 w-4",
              fit.tone === "good" ? "text-money" : "text-gold",
            )}
          />
          {fit.headline}
        </p>
        <p className="mt-1.5 text-sm text-foreground/65">{fit.body}</p>
      </div>

      {/* Consent */}
      <Controller
        control={control}
        name="consent"
        render={({ field }) => (
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-card p-4">
            <input
              type="checkbox"
              className="mt-1 h-5 w-5 shrink-0 rounded border-input accent-[#00A86B]"
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
            <span className="text-sm text-muted-foreground">
              I agree to be contacted about my plan and I understand this is an
              application, not an offer or guarantee. I&rsquo;ve read the{" "}
              <Link href="/" className="font-medium text-gold hover:underline">
                disclosures
              </Link>
              .
            </span>
          </label>
        )}
      />
      {errors.consent?.message && (
        <p className="text-xs text-destructive">{errors.consent.message}</p>
      )}
    </div>
  );
}

/* ── Thank you ────────────────────────────────────────────────────────── */

function ThankYou({ firstName }: { firstName?: string }) {
  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="surface ring-gold-soft rounded-3xl p-8 sm:p-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-money/15 text-money ring-1 ring-money/25">
          <PartyPopper className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">
          You&rsquo;re on your way{firstName ? `, ${firstName}` : ""}.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Your plan is being prepared. We&rsquo;ll reach out shortly to confirm the
          details and finalize your path to Debt Zero — Smarter, Faster, Cheaper.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-5 w-5 text-gold" />
          <span>No upfront fees · No prepayment penalty · You stay in control</span>
        </div>
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
