import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/types/database.types"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const error = requestUrl.searchParams.get("error")
  const errorDescription = requestUrl.searchParams.get("error_description")

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error, errorDescription)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorDescription || error)}`, request.url)
    )
  }

  // Must have code to exchange for session
  if (!code) {
    console.error("No OAuth code provided")
    return NextResponse.redirect(new URL("/login?error=no_code", request.url))
  }

  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    // Exchange the code for a session - this sets the auth cookies
    const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error("Session exchange error:", exchangeError)
      return NextResponse.redirect(new URL("/login?error=session_exchange_failed", request.url))
    }

    // Get the current session after exchange
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      console.error("Session retrieval error:", sessionError)
      return NextResponse.redirect(new URL("/login?error=no_session", request.url))
    }

    // Check if user exists in directory
    const { data: directoryData, error: directoryError } = await supabase
      .from("directory")
      .select("id")
      .eq("email", session.user.email)
      .single()

    if (directoryError || !directoryData) {
      // Sign out the user since they're not authorized
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    // Check if user exists in Users table
    const { data: userData, error: userError } = await supabase
      .from("Users")
      .select("is_admin, verification")
      .eq("id", session.user.id)
      .single()

    if (userError || !userData) {
      // User doesn't exist in database, redirect to registration
      return NextResponse.redirect(new URL("/register", request.url))
    }

    // Check if user is verified
    if (!userData.verification) {
      // User exists but not verified yet, redirect to pending verification
      return NextResponse.redirect(new URL("/pending-verification", request.url))
    }

    // User is verified - redirect based on role
    if (userData.is_admin) {
      // Admin users go to admin attendance overview
      return NextResponse.redirect(new URL("/admin/attendance-overview", request.url))
    } else {
      // Regular members go to attendance overview
      return NextResponse.redirect(new URL("/attendance-overview", request.url))
    }
  } catch (error) {
    console.error("Unexpected error in OAuth callback:", error)
    return NextResponse.redirect(new URL("/login?error=unexpected_error", request.url))
  }
}
