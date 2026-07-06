"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { MagicLinkForm } from "@/components/auth/magic-link-form";

type LinkAccountPanelProps = {
  defaultEmail?: string;
  nextPath?: string;
};

/**
 * Post-submit prompt: link the anonymous session to a verified email via magic link.
 */
export function LinkAccountPanel({
  defaultEmail,
  nextPath = "/dashboard",
}: LinkAccountPanelProps) {
  return (
    <div className="mt-8 rounded-2xl border border-gold/25 bg-gold/5 p-6 text-left">
      <p className="flex items-center gap-2 text-sm font-semibold text-gold">
        <Sparkles className="h-4 w-4" />
        Create a free account to track this plan
      </p>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Save your comparison, check status anytime, and pick up where you left off
        — no password needed.
      </p>
      <div className="mt-5">
        <MagicLinkForm
          defaultEmail={defaultEmail}
          nextPath={nextPath}
          submitLabel="Email me a secure link"
          variant="embedded"
        />
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-gold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
