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
    const directoryIdString = session.directory_id.toString()
    console.log("Profile API: Searching Users table for id:", directoryIdString)

    const { data: userData, error: userError } = await supabase
      .from("Users")
      .select("*")
      .eq("id", directoryIdString)
      .maybeSingle()

    if (userError) {
      console.error("Profile API: Error querying Users table:", userError)
    }

    // If not found by ID match, user might not exist in Users table yet
    // Return directory-based profile as fallback
    if (!userData) {
      console.log("Profile API: User not found in Users table, returning directory-based profile")
      // User doesn't exist in Users table - return basic profile from directory
      // This allows the profile page to display even if user hasn't completed full registration
      const emailName = session.email.split("@")[0].replace(/_/g, " ")
      const displayName = emailName
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")

      return NextResponse.json({
        id: session.directory_id.toString(),
        email: session.email,
        name: displayName,
        role: session.is_admin ? "admin" : "member",
        committee: null,
        section: null,
        is_admin: session.is_admin,
        is_performing: false,
        is_executive_board: false,
        admin_role: null,
      })
    }

    console.log("Profile API: User found in Users table")
    // Return full user profile with email from session
    return NextResponse.json({
      ...userData,
      email: session.email,
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
