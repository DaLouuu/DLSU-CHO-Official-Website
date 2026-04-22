import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { Database } from "@/types/database.types"
import { getAuthSession } from "@/lib/auth/session"

// GET /api/admin/excuses/history — returns Approved and Rejected excuse_requests
export async function GET(request: Request) {
  const customSession = await getAuthSession()
  if (!customSession?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const section = searchParams.get("section")

  const supabase = createRouteHandlerClient<Database>({ cookies })

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
    .in("status", ["Approved", "Rejected"])
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const filtered = section
    ? data?.filter((r) => {
        const p = r.profiles as { voice_section?: string } | null
        return p?.voice_section?.toLowerCase() === section.toLowerCase()
      })
    : data

  return NextResponse.json(filtered)
}
