import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/types/database.types"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  // Check auth state
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/unauthorized", "/pending-verification"]
  const isPublicRoute = publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Auth routes
  const authRoutes = ["/auth"]
  const isAuthRoute = authRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // If user is not authenticated and trying to access a protected route
  if (!session && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // If user is authenticated but not verified
  if (session && !isPublicRoute && !isAuthRoute) {
    // Get user data
    const { data: userData } = await supabase
      .from("Users")
      .select("verification, is_admin")
      .eq("id", session.user.id)
      .single()

    // If user is not in the database or not verified, redirect to pending verification
    if (!userData || !userData.verification) {
      // Allow access to pending-verification page
      if (req.nextUrl.pathname === "/pending-verification") {
        return res
      }
      return NextResponse.redirect(new URL("/pending-verification", req.url))
    }

    // Role-based access control
    const path = req.nextUrl.pathname

    // Admin routes
    if (path.startsWith("/admin") && !userData.is_admin) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
