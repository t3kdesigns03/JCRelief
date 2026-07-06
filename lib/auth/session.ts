/** Build the email redirect URL for magic-link auth flows. */
export function getEmailRedirectUrl(nextPath = "/dashboard"): string {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const next = encodeURIComponent(nextPath);
  return `${origin}/auth/callback?next=${next}`;
}

/** Returns true when the user is signed in but still anonymous. */
export function isAnonymousUser(user: { is_anonymous?: boolean } | null): boolean {
  return Boolean(user?.is_anonymous);
}

/** Returns true when the user has a verified, non-anonymous session. */
export function isVerifiedUser(user: { is_anonymous?: boolean; email?: string } | null): boolean {
  return Boolean(user && user.email && !user.is_anonymous);
}
