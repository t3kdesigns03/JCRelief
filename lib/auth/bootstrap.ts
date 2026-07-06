import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

/**
 * Ensure the visitor has a Supabase session before submitting.
 * Uses anonymous sign-in so RLS can tie rows to auth.uid() without
 * requiring email/password upfront.
 */
export async function ensureApplySession(): Promise<{
  ok: boolean;
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "Applications are temporarily unavailable. Please try again later.",
    };
  }

  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) return { ok: true };

  const { error } = await supabase.auth.signInAnonymously();
  if (error) {
    return {
      ok: false,
      error: "We couldn't start a secure session. Please refresh and try again.",
    };
  }

  return { ok: true };
}
