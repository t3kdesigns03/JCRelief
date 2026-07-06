import { createClient } from "@/lib/supabase/client";
import { getEmailRedirectUrl } from "@/lib/auth/session";

export type MagicLinkResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Send a magic link. When called while an anonymous session is active,
 * Supabase links the email to that session on verification (same user_id).
 */
export async function sendMagicLink(
  email: string,
  nextPath = "/dashboard",
): Promise<MagicLinkResult> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: trimmed,
    options: {
      emailRedirectTo: getEmailRedirectUrl(nextPath),
      shouldCreateUser: true,
    },
  });

  if (error) {
    return {
      ok: false,
      error: "We couldn't send the link. Please try again in a moment.",
    };
  }

  return { ok: true };
}

export async function signOut(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}
