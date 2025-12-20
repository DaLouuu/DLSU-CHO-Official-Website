import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/types/database.types"

/**
 * Email Login API Route
 * 
 * Validates credentials against Directory table and creates a session.
 * This is a temporary replacement for Google OAuth.
 * 
 * Authentication Rules:
 * - Email must exist in Directory table
 * - Admin: id = 12207101 AND email = dana_guillarte@dlsu.edu.ph
 * - All other users are members
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    // Query Directory table by email
    const normalizedEmail = email.trim().toLowerCase()
    
    console.log("=== LOGIN ATTEMPT DEBUG ===")
    console.log("Searching for email:", normalizedEmail)
    console.log("Original email from request:", email)
    
    // First, try to get the entry - use maybeSingle() to avoid error if not found
    const { data: directoryEntry, error: directoryError } = await supabase
      .from("directory")
      .select("*")
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
      entry: directoryEntry ? { id: directoryEntry.id, email: directoryEntry.email } : null
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
      
      // Try getting all entries and filtering (less efficient but more forgiving)
      const { data: allEntries, error: allError } = await supabase
        .from("directory")
        .select("id, email")
      
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
            .eq("id", matchingEntry.id)
            .single()
          
          if (fullEntry) {
            // Use the found entry
            const sessionData = {
              email: fullEntry.email,
              directory_id: fullEntry.id,
              is_admin: fullEntry.id === 12207101 && fullEntry.email.toLowerCase() === "dana_guillarte@dlsu.edu.ph",
              timestamp: Date.now(),
            }
            
            const response = NextResponse.json(
              { 
                success: true,
                user: {
                  email: fullEntry.email,
                  id: fullEntry.id,
                },
                redirect: sessionData.is_admin ? "/admin/attendance-overview" : "/attendance-overview",
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

    // Check if user is admin
    // Admin: id = 12207101 AND email = dana_guillarte@dlsu.edu.ph
    const isAdmin = directoryEntry.id === 12207101 && 
                    directoryEntry.email.toLowerCase() === "dana_guillarte@dlsu.edu.ph"

    // Determine redirect path
    let redirectPath = "/attendance-overview" // Default for members
    if (isAdmin) {
      redirectPath = "/admin/attendance-overview"
    }

    // Create a secure session cookie with directory information
    const sessionData = {
      email: directoryEntry.email,
      directory_id: directoryEntry.id,
      is_admin: isAdmin,
      timestamp: Date.now(),
    }

    const response = NextResponse.json(
      { 
        success: true,
        user: {
          email: directoryEntry.email,
          id: directoryEntry.id,
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

