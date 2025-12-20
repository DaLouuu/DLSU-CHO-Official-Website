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
      // Check if user email exists in Directory
      const { data: directoryData, error: directoryError } = await supabase
        .from("Directory")
        .select("id")
        .eq("email", session.user.email)
        .single()

      if (directoryError || !directoryData) {
        // Email not in directory, redirect to unauthorized page
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL("/auth/setup", request.url))
}
