"use client";

import Link from "next/link";
import { PartyPopper, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkAccountPanel } from "@/components/auth/link-account-panel";

type ApplySuccessScreenProps = {
  firstName?: string;
  email?: string;
};

export function ApplySuccessScreen({ firstName, email }: ApplySuccessScreenProps) {
  return (
    <div className="mx-auto max-w-xl">
      <div className="surface ring-gold-soft rounded-3xl p-8 text-center sm:p-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-money/15 text-money ring-1 ring-money/25">
          <PartyPopper className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">
          You&rsquo;re on your way{firstName ? `, ${firstName}` : ""}.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Your plan has been saved. We&rsquo;ll reach out shortly to confirm the
          details and finalize your path to Debt Zero — Smarter, Faster, Cheaper.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-5 w-5 text-gold" />
          <span>No upfront fees · No prepayment penalty · You stay in control</span>
        </div>

        <LinkAccountPanel defaultEmail={email} nextPath="/dashboard" />

        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
