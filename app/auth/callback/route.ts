import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { claimApplicationsByEmail } from "@/lib/actions/auth";

/** Only allow same-site relative redirect targets. */
function safeNext(next: string | null): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return "/dashboard";
}

/**
 * Resolve the origin to redirect back to. The auth cookie is set on the domain
 * the callback runs on, so we must redirect to that SAME origin (this is what
 * lets multiple domains — e.g. mydebtangel.com and debtangel.t3kdesigns.app —
 * each sign in correctly). Behind Netlify's proxy the forwarded headers carry
 * the public host; fall back to the request origin, then the configured URL.
 */
function resolveOrigin(request: Request, requestOrigin: string): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  if (forwardedHost) return `${forwardedProto}://${forwardedHost}`;
  if (requestOrigin && !requestOrigin.startsWith("http://localhost"))
    return requestOrigin;
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || requestOrigin;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const base = resolveOrigin(request, origin);
  const next = safeNext(searchParams.get("next"));

  // Token-hash flow (recommended for @supabase/ssr magic links).
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  // PKCE flow (kept for backward compatibility).
  const code = searchParams.get("code");

  const supabase = await createClient();

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      await claimApplicationsByEmail();
      return NextResponse.redirect(`${base}${next}`);
    }
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      await claimApplicationsByEmail();
      return NextResponse.redirect(`${base}${next}`);
    }
  }

  return NextResponse.redirect(`${base}/login?error=auth`);
}
