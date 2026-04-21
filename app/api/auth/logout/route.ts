import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { cookies } from "next/headers"

/**
 * Logout API Route
 * Clears the authentication session cookie
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true }, { status: 200 })

  // Clear the auth session cookie
  response.cookies.delete("auth_session")

  return response
}



