import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/types/database.types"
import { getAuthSession } from "@/lib/auth/session"

/**
 * GET /api/profile
 * 
 * Returns the current user's profile data.
 * Uses Directory-based authentication (temporary replacement for Supabase Auth).
 * 
 * Authentication:
 * - Reads auth_session cookie set by email + school ID login
 * - Loads user data from Users table using directory email
 * - Returns profile data or redirects to login if unauthenticated
 */
export async function GET(request: NextRequest) {
  try {
    // Get Directory-based session (temporary auth approach)
    const session = await getAuthSession()

    if (!session) {
      console.log("Profile API: No session found")
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    console.log("Profile API: Session found", {
      email: session.email,
      directory_id: session.directory_id,
      is_admin: session.is_admin
    })

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    // Load user profile from Users table
    // Try matching Users.id with directory.id (as string)
    // Note: This is a temporary approach - Users.id should match directory.id.toString()
    // If the relationship is different, adjust the matching logic
    // OLD: supabase.from("Users").select("*").eq("id", directoryIdString)
    // Users table does not exist — query profiles by school_id instead
    console.log("Profile API: Searching profiles table for school_id:", session.directory_id)

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("school_id", session.directory_id)
      .maybeSingle()

    if (profileError) {
      console.error("Profile API: Error querying profiles table:", profileError)
    }

    if (!profileData) {
      console.log("Profile API: Profile not found, returning session-based fallback")
      const emailName = session.email.split("@")[0].replace(/_/g, " ")
      const displayName = emailName
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      return NextResponse.json({
        id: session.directory_id.toString(),
        email: session.email,
        first_name: displayName,
        last_name: null,
        nickname: null,
        voice_section: null,
        membership_status: "Trainee",
        current_term_stat: "Non-Performing",
        committee: null,
        is_admin: session.is_admin,
        school_id: session.directory_id,
      })
    }

    console.log("Profile API: Profile found")
    return NextResponse.json({
      ...profileData,
      is_admin: session.is_admin,  // always use session value — DB may lag after first migration
    })
  } catch (error) {
    console.error("Profile API: Unexpected error:", error)
    return NextResponse.json(
      { 
        error: "An error occurred while fetching profile",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
