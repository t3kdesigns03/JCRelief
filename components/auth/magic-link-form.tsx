"use client";

import * as React from "react";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sendMagicLink } from "@/lib/auth/magic-link";
import { cn } from "@/lib/utils";

type MagicLinkFormProps = {
  /** Pre-fill email (e.g. from the apply wizard). */
  defaultEmail?: string;
  /** Where to send the user after they click the link. */
  nextPath?: string;
  /** Button label override. */
  submitLabel?: string;
  /** Compact styling for embedding in the apply success screen. */
  variant?: "default" | "embedded";
  className?: string;
};

export function MagicLinkForm({
  defaultEmail = "",
  nextPath = "/dashboard",
  submitLabel = "Send magic link",
  variant = "default",
  className,
}: MagicLinkFormProps) {
  const [email, setEmail] = React.useState(defaultEmail);
  const [status, setStatus] = React.useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (defaultEmail) setEmail(defaultEmail);
  }, [defaultEmail]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const result = await sendMagicLink(email, nextPath);
    if (result.ok) {
      setStatus("sent");
    } else {
      setStatus("error");
      setError(result.error);
    }
  };

  if (status === "sent") {
    return (
      <div className={cn("text-center", className)}>
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-money/15 text-money ring-1 ring-money/25">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h2 className="mt-4 font-display text-xl font-semibold">Check your email</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent a secure sign-in link to{" "}
          <strong className="text-foreground">{email}</strong>. Click it to access
          your dashboard — the link expires shortly.
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-4"
          onClick={() => setStatus("idle")}
        >
          Use a different email
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-4", className)}>
      <div>
        <Label htmlFor="magic-link-email">Email address</Label>
        <div className="relative mt-1.5">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="magic-link-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        variant={variant === "embedded" ? "money" : "default"}
        className="w-full"
        disabled={status === "sending"}
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          submitLabel
        )}
      </Button>

      <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
        We&apos;ll email you a one-time link. No password, no spam — just access to
        your plan.
      </p>
    </form>
  );
}
