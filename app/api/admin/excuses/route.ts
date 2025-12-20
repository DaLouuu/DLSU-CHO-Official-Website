import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { Database, Status } from "@/types/database.types"
import { sendNotification } from "@/lib/notifications"

// GET /api/admin/excuses?section=soprano
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const section = searchParams.get("section")

  const supabase = createRouteHandlerClient<Database>({ cookies })

  // Verify admin status
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: adminData } = await supabase.from("Users").select("is_admin").eq("id", session.user.id).single()

  if (!adminData?.is_admin) {
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
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: adminData } = await supabase.from("Users").select("is_admin").eq("id", session.user.id).single()

  if (!adminData?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Get user details for notification
  const { data: userData } = await supabase.from("Users").select("name").eq("id", userId).single()

  // Get user email
  const { data: directoryData } = await supabase.from("Directory").select("email").eq("id", userId).single()

  // Update request status
  const { data, error } = await supabase
    .from("ExcuseRequests")
    .update({
      status,
      notes,
      approved_by: session.user.id,
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
