import { cookies } from "next/headers"
import type { Database } from "@/types/database.types"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

/**
 * Session management utilities for email + school ID authentication
 * This is a temporary replacement for Google OAuth
 */

export interface AuthSession {
  email: string
  directory_id: number
  is_admin: boolean
  timestamp: number
}

/**
 * Get the current authentication session from cookies
 * Returns null if no valid session exists
 */
export async function getAuthSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = cookies()
    const authCookie = cookieStore.get("auth_session")

    if (!authCookie?.value) {
      return null
    }

    const sessionData = JSON.parse(authCookie.value) as AuthSession

    // Validate session is not expired (7 days)
    const sevenDaysAgo = Date.now() - 60 * 60 * 24 * 7 * 1000
    if (sessionData.timestamp < sevenDaysAgo) {
      return null
    }

    return sessionData
  } catch (error) {
    console.error("Error reading auth session:", error)
    return null
  }
}

/**
 * Get directory entry from Directory table based on session
 * Returns the directory entry with admin status
 */
export async function getDirectoryFromSession() {
  const session = await getAuthSession()
  if (!session) {
    return null
  }

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

  // OLD: .eq("id", session.directory_id)  — actual PK column is school_id
  const { data: directoryData, error } = await supabase
    .from("directory")
    .select("*")
    .eq("school_id", session.directory_id)
    .single()

  if (error || !directoryData) {
    return null
  }

  return {
    ...directoryData,
    is_admin: session.is_admin,
  }
}

/**
 * Clear the authentication session
 */
export function clearAuthSession() {
  const cookieStore = cookies()
  cookieStore.delete("auth_session")
}

