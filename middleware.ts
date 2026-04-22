import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/types/database.types"
import { PUBLIC_ROUTES, AUTH_ROUTES } from "@/config/constants"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  // Check Supabase Auth session (for OAuth - currently disabled)
  const {
    data: { session: supabaseSession },
  } = await supabase.auth.getSession()

  // Check custom auth session (Directory-based - currently active)
  const authSessionCookie = req.cookies.get("auth_session")
  let customSession: { email: string; directory_id: number; is_admin: boolean; timestamp: number } | null = null

  if (authSessionCookie?.value) {
    try {
      customSession = JSON.parse(authSessionCookie.value)
      // Validate session is not expired (7 days)
      const sevenDaysAgo = Date.now() - 60 * 60 * 24 * 7 * 1000
      if (customSession && customSession.timestamp < sevenDaysAgo) {
        customSession = null
      }
    } catch {
      customSession = null
    }
  }

  // User is authenticated if they have either Supabase session OR custom session
  const isAuthenticated = !!supabaseSession || !!customSession

  // Public routes that don't require authentication
  const isPublicRoute = PUBLIC_ROUTES.some((route) => req.nextUrl.pathname.startsWith(route))

  // Auth routes (API routes, OAuth callbacks)
  const isAuthRoute = AUTH_ROUTES.some((route) => req.nextUrl.pathname.startsWith(route))

  // API routes should bypass middleware checks
  if (req.nextUrl.pathname.startsWith("/api/")) {
    return res
  }

  // If user is not authenticated and trying to access a protected route
  if (!isAuthenticated && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // If user is authenticated, check user data and role
  if (isAuthenticated && !isPublicRoute && !isAuthRoute) {
    let isAdmin = false
    let isVerified = false

    if (supabaseSession) {
      // Supabase OAuth session — look up profiles by uuid id
      // OLD: supabase.from("Users").select("is_admin").eq("id", supabaseSession.user.id)
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", supabaseSession.user.id)
        .maybeSingle()
      isAdmin = profile?.is_admin ?? false
      isVerified = !!profile  // profile exists → verified
    } else if (customSession) {
      // Directory-based session — is_admin comes from session cookie (set at login)
      isAdmin = customSession.is_admin || false

      // Verify the profile actually exists in the profiles table
      const { data: profile } = await supabase
        .from("profiles")
        .select("school_id")
        .eq("school_id", customSession.directory_id)
        .maybeSingle()
      isVerified = !!profile
    }

    const path = req.nextUrl.pathname

    // Unverified users can only access pending-verification
    if (!isVerified && !path.startsWith("/pending-verification")) {
      return NextResponse.redirect(new URL("/pending-verification", req.url))
    }

    // Admin routes require is_admin = true
    if (path.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
  }

  return res
}

export const config = {
  // Exclude static files, Next.js internals, and OAuth callback routes
  // OAuth callbacks must bypass middleware to allow session establishment
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth/callback|auth/callback-login).*)",
  ],
}

