import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/types/database.types"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      // Check if user exists in Directory
      const { data: directoryData, error: directoryError } = await supabase
        .from("Directory")
        .select("id")
        .eq("email", session.user.email)
        .single()

      if (directoryError || !directoryData) {
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }

      // Check if user exists in Users table
      const { data: userData, error: userError } = await supabase
        .from("Users")
        .select("is_admin, verification")
        .eq("id", session.user.id)
        .single()

      if (userError) {
        // User doesn't exist, redirect to registration
        return NextResponse.redirect(new URL("/register", request.url))
      }

      // Check if user is verified
      if (!userData.verification) {
        return NextResponse.redirect(new URL("/pending-verification", request.url))
      }

      // Redirect based on user role
      if (userData.is_admin) {
        return NextResponse.redirect(new URL("/admin/attendance-overview", request.url))
      } else {
        return NextResponse.redirect(new URL("/attendance-form", request.url))
      }
    }
  }

  // Fallback redirect
  return NextResponse.redirect(new URL("/login", request.url))
}
