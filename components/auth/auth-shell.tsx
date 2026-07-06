import Link from "next/link";
import { Wordmark } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
};

export function AuthShell({ title, subtitle, children, className }: AuthShellProps) {
  return (
    <main className="relative min-h-screen bg-background bg-grid">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 gradient-halo" />
      <div className="container relative z-10 flex min-h-screen flex-col items-center justify-center py-12">
        <Link href="/" className="mb-8" aria-label="Debt Angel home">
          <Wordmark size="lg" withMark />
        </Link>

        <div
          className={cn(
            "w-full max-w-md rounded-3xl border border-white/10 bg-card p-8 shadow-lift sm:p-10",
            className,
          )}
        >
          <header className="text-center">
            <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
            )}
          </header>
          <div className="mt-8">{children}</div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          No password required · Secure magic link ·{" "}
          <Link href="/" className="text-gold hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
