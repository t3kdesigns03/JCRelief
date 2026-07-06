import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { MagicLinkForm } from "@/components/auth/magic-link-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Access your Debt Angel plan with a secure magic link — no password required.",
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next ?? "/dashboard";

  return (
    <AuthShell
      title="Welcome back"
      subtitle="We'll email you a secure sign-in link. No password needed — just tap and you're in."
    >
      {params.error === "auth" && (
        <p className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
          That link expired or was already used. Request a fresh one below.
        </p>
      )}

      <MagicLinkForm nextPath={nextPath} submitLabel="Send sign-in link" />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/apply" className="font-medium text-gold hover:underline">
          Build your free plan
        </Link>
      </p>
    </AuthShell>
  );
}
