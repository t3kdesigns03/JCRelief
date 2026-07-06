import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isVerifiedUser } from "@/lib/auth/session";

const APPLY_PREFIX = "/apply";
const DASHBOARD_PREFIX = "/dashboard";
const LOGIN_PREFIX = "/login";

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const { pathname } = request.nextUrl;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (pathname.startsWith(APPLY_PREFIX) || pathname.startsWith(DASHBOARD_PREFIX)) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("apply", "unavailable");
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const { response, user } = await updateSession(request);

  // Dashboard requires a verified (non-anonymous) session.
  if (pathname.startsWith(DASHBOARD_PREFIX)) {
    if (!isVerifiedUser(user)) {
      const url = request.nextUrl.clone();
      url.pathname = LOGIN_PREFIX;
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Signed-in users skip the login page.
  if (pathname.startsWith(LOGIN_PREFIX) && isVerifiedUser(user)) {
    const next = request.nextUrl.searchParams.get("next") ?? DASHBOARD_PREFIX;
    const url = request.nextUrl.clone();
    url.pathname = next;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
