import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
// import type { Database, Status } from "@/types/database.types"  // OLD — Status renamed to ExcuseStatus
import type { Database, ExcuseStatus } from "@/types/database.types"
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
    // OLD: supabase.from("Users").select("is_admin").eq("id", session.user.id)
    const { data: adminData } = await supabase.from("profiles").select("is_admin").eq("id", session.user.id).single()
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

  // OLD: supabase.from("ExcuseRequests").select(`*, Users (name, section)`)
  // Fetch excuse requests joined with profiles for member name and section
  const { data, error } = await supabase
    .from("excuse_requests")
    .select(`
      *,
      profiles!account_id_fk (
        first_name,
        last_name,
        nickname,
        voice_section,
        school_id
      )
    `)
    .eq("status", "Pending")

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Filter by section in JS since Supabase doesn't support filtering on joined columns via query builder
  const filtered = section
    ? data?.filter((r) => {
        const p = r.profiles as { voice_section?: string } | null
        return p?.voice_section?.toLowerCase() === section.toLowerCase()
      })
    : data

  return NextResponse.json(filtered)
}

// PATCH /api/admin/excuses — body: { requestId, status, notes }
export async function PATCH(request: Request) {
  // OLD signature: (request, { params: { userId, date } })
  const { requestId, status, notes }: { requestId: number; status: ExcuseStatus; notes?: string } =
    await request.json()

  if (!["Approved", "Rejected", "Pending"].includes(status)) {
    return NextResponse.json({ error: "Invalid status value" }, { status: 400 })
  }

  const supabase = createRouteHandlerClient<Database>({ cookies })

  const isAdmin = await checkAdminStatus()
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Fetch existing request to get account_id_fk for notification lookup
  const { data: existing } = await supabase
    .from("excuse_requests")
    .select("account_id_fk, excused_date")
    .eq("request_id", requestId)
    .maybeSingle()

  // Update status (approved_by / approved_at columns don't exist yet — omitted until migration adds them)
  // OLD: supabase.from("ExcuseRequests").update({ status, notes, approved_by, approved_at }).eq("userID", ...).eq("date", ...)
  const { data, error } = await supabase
    .from("excuse_requests")
    .update({ status, notes })
    .eq("request_id", requestId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Send notification if we can resolve member email
  if (existing?.account_id_fk) {
    // OLD: supabase.from("Users").select("name").eq("id", userId)
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name, email, school_id")
      .eq("id", existing.account_id_fk)
      .maybeSingle()

    if (profile?.email) {
      const recipientName = [profile.first_name, profile.last_name].filter(Boolean).join(" ")
      await sendNotification({
        type: status === "Approved" ? "excuse_approved" : status === "Rejected" ? "excuse_rejected" : "excuse_pending",
        recipientEmail: profile.email,
        recipientName,
        details: {
          date: existing.excused_date ?? "",
          notes,
        },
      })
    }
  }

  return NextResponse.json(data)
}
