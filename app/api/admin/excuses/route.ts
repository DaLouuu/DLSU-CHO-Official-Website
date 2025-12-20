import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { Database, Status } from "@/types/database.types"
import { sendNotification } from "@/lib/services/notifications"
import { getAuthSession } from "@/lib/auth/session"

// Helper function to check admin status
async function checkAdminStatus(): Promise<boolean> {
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

  // Check Supabase Auth session first
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    const { data: adminData } = await supabase.from("Users").select("is_admin").eq("id", session.user.id).single()
    return adminData?.is_admin || false
  }

  // Check Directory-based custom session
  const customSession = await getAuthSession()
  if (customSession) {
    return customSession.is_admin || false
  }

  return false
}

// GET /api/admin/excuses?section=soprano
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const section = searchParams.get("section")

  const supabase = createRouteHandlerClient<Database>({ cookies })

  // Verify admin status
  const isAdmin = await checkAdminStatus()
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Fetch requests by section
  const query = supabase
    .from("ExcuseRequests")
    .select(`
      *,
      Users (
        name,
        section
      )
    `)
    .eq("status", "Pending")

  if (section) {
    query.eq("Users.section", section)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// PATCH /api/admin/excuses/:userId/:date
export async function PATCH(request: Request, { params }: { params: { userId: string; date: string } }) {
  const { userId, date } = params
  const { status, notes }: { status: Status; notes?: string } = await request.json()

  // Validate status
  if (!["Approved", "Rejected", "Pending"].includes(status)) {
    return NextResponse.json({ error: "Invalid status value" }, { status: 400 })
  }

  const supabase = createRouteHandlerClient<Database>({ cookies })

  // Verify admin status
  const isAdmin = await checkAdminStatus()
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Get current user ID for approved_by field
  const cookieStore = cookies()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const customSession = await getAuthSession()
  const currentUserId = session?.user.id || customSession?.directory_id.toString() || ""

  // Get user details for notification
  const { data: userData } = await supabase.from("Users").select("name").eq("id", userId).single()

  // Get user email from Directory
  // Note: userId might be from Users table (string), so we try to match it
  // If userId is numeric, use it directly; otherwise we might need to join through Users table
  const userIdNum = parseInt(userId)
  const { data: directoryData } = await supabase
      .from("directory")
    .select("email")
    .eq("id", userIdNum)
    .single()

  // Update request status
  const { data, error } = await supabase
    .from("ExcuseRequests")
    .update({
      status,
      notes,
      approved_by: currentUserId,
      approved_at: new Date().toISOString(),
    })
    .eq("userID", userId)
    .eq("date", date)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Send notification
  if (directoryData?.email && userData?.name) {
    await sendNotification({
      type: status === "Approved" ? "excuse_approved" : status === "Rejected" ? "excuse_rejected" : "excuse_pending",
      recipientEmail: directoryData.email,
      recipientName: userData.name,
      details: {
        date,
        notes,
      },
    })
  }

  return NextResponse.json(data)
}
