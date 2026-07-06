"use server";

import { createClient } from "@/lib/supabase/server";
import { isAnonymousUser } from "@/lib/auth/session";

/** Claim anonymous-submitted plans that match the verified email on this account. */
export async function claimApplicationsByEmail(): Promise<{ claimed: number }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || isAnonymousUser(user)) {
    return { claimed: 0 };
  }

  const { data, error } = await supabase.rpc("claim_applications_by_email");

  if (error) {
    // eslint-disable-next-line no-console
    console.error("claim_applications_by_email failed:", error);
    return { claimed: 0 };
  }

  return { claimed: typeof data === "number" ? data : 0 };
}
