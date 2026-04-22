import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/types/database.types"

/**
 * Email Login API Route
 *
 * Validates credentials against the directory table and creates a session.
 * Admin status is determined by the is_admin field in the Users table.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, school_id } = body

    if (!email || !school_id) {
      return NextResponse.json(
        { error: "Email and school ID are required" },
        { status: 400 }
      )
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    const normalizedEmail = email.trim().toLowerCase()
    const schoolIdNum = parseInt(String(school_id).trim(), 10)

    if (isNaN(schoolIdNum)) {
      return NextResponse.json({ error: "Invalid email or ID number." }, { status: 401 })
    }

    console.log("=== LOGIN ATTEMPT DEBUG ===")
    console.log("Searching for email:", normalizedEmail, "school_id:", schoolIdNum)

    // Match BOTH email and school_id — acts as credential validation
    const { data: directoryEntry, error: directoryError } = await supabase
      .from("directory")
      .select("*")
      .eq("school_id", schoolIdNum)
      .eq("email", normalizedEmail)
      .maybeSingle()

    // Log for debugging
    console.log("Directory lookup result:", {
      email: normalizedEmail,
      found: !!directoryEntry,
      error: directoryError ? {
        message: directoryError.message,
        code: directoryError.code,
        details: directoryError.details,
        hint: directoryError.hint
      } : null,
      // entry: directoryEntry ? { id: directoryEntry.id, email: directoryEntry.email } : null  // OLD — column is school_id
      entry: directoryEntry ? { school_id: directoryEntry.school_id, email: directoryEntry.email } : null
    })

    // If we got an error (not just "not found"), log it
    if (directoryError) {
      console.error("Directory lookup error:", {
        email: normalizedEmail,
        error: directoryError,
        errorCode: directoryError.code,
        errorMessage: directoryError.message,
        errorDetails: directoryError.details,
        errorHint: directoryError.hint
      })
      
      // Return generic error to prevent credential enumeration
      return NextResponse.json(
        { error: "Invalid email or ID number." },
        { status: 401 }
      )
    }

    // If entry not found, try a case-insensitive search as fallback
    if (!directoryEntry) {
      console.log("Entry not found with exact match, trying case-insensitive search...")
      
      // Try matching by school_id + case-insensitive email as fallback
      const { data: allEntries, error: allError } = await supabase
        .from("directory")
        .select("school_id, email")
        .eq("school_id", schoolIdNum)
      
      if (!allError && allEntries) {
        const matchingEntry = allEntries.find(
          entry => entry.email?.toLowerCase() === normalizedEmail
        )
        
        if (matchingEntry) {
          console.log("Found entry with case-insensitive search:", matchingEntry)
          // Re-fetch the full entry
          const { data: fullEntry } = await supabase
            .from("directory")
            .select("*")
            // .eq("id", matchingEntry.id)  // OLD — column is school_id
            .eq("school_id", matchingEntry.school_id)
            .single()

          if (fullEntry) {
            // .from("Users").select("is_admin").eq("id", ...)  // OLD — Users table does not exist
            const { data: profileRecord } = await supabase
              .from("profiles")
              .select("is_admin")
              .eq("school_id", fullEntry.school_id)
              .maybeSingle()
            const isAdmin = profileRecord?.is_admin ?? false

            const sessionData = {
              email: fullEntry.email,
              // directory_id: fullEntry.id,  // OLD — column is school_id
              directory_id: fullEntry.school_id,
              is_admin: isAdmin,
              timestamp: Date.now(),
            }

            const response = NextResponse.json(
              {
                success: true,
                user: {
                  email: fullEntry.email,
                  // id: fullEntry.id,  // OLD — column is school_id
                  id: fullEntry.school_id,
                },
                redirect: isAdmin ? "/admin/attendance-overview" : "/attendance-overview",
              },
              { status: 200 }
            )
            
            response.cookies.set("auth_session", JSON.stringify(sessionData), {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 60 * 60 * 24 * 7,
              path: "/",
            })
            
            return response
          }
        } else {
          console.log("No matching entry found in all entries. Total entries:", allEntries.length)
          console.log("Sample entries:", allEntries.slice(0, 3))
        }
      }
      
      // Entry not found
      console.error("Directory entry not found for email:", normalizedEmail)
      return NextResponse.json(
        { error: "Invalid email or ID number." },
        { status: 401 }
      )
    }

    // Look up admin status from profiles table (Users table does not exist)
    // OLD: const { data: userRecord } = await supabase.from("Users").select("is_admin").eq("id", directoryEntry.id.toString()).maybeSingle()
    const { data: profileRecord } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("school_id", directoryEntry.school_id)
      .maybeSingle()
    const isAdmin = profileRecord?.is_admin ?? false

    // Determine redirect path
    let redirectPath = "/attendance-overview"
    if (isAdmin) {
      redirectPath = "/admin/attendance-overview"
    }

    // Create a secure session cookie with directory information
    const sessionData = {
      email: directoryEntry.email,
      // directory_id: directoryEntry.id,  // OLD — column is school_id
      directory_id: directoryEntry.school_id,
      is_admin: isAdmin,
      timestamp: Date.now(),
    }

    const response = NextResponse.json(
      {
        success: true,
        user: {
          email: directoryEntry.email,
          // id: directoryEntry.id,  // OLD — column is school_id
          id: directoryEntry.school_id,
        },
        redirect: redirectPath,
      },
      { status: 200 }
    )

    // Set secure HTTP-only session cookie
    response.cookies.set("auth_session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    )
  }
}

