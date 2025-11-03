import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/supabase"

// Only allow server-side invocation with POST
export async function POST(_request: NextRequest) {
  try {
    // Known demo/mock accounts to remove
    const mockEmails = ["longvsm@lifeos.com", "demo@lifeos.com"]

    const { data: users } = await supabaseAdmin
      .from("user_profiles")
      .select("id, email")
      .in("email", mockEmails)

    if (!users || users.length === 0) {
      return NextResponse.json({ removed: 0 })
    }

    // Delete memberships first
    const userIds = users.map((u) => u.id)
    await supabaseAdmin.from("memberships").delete().in("user_id", userIds)

    // Delete profiles
    await supabaseAdmin.from("user_profiles").delete().in("id", userIds)

    // Delete auth users
    for (const u of users) {
      try {
        await supabaseAdmin.auth.admin.deleteUser(u.id)
      } catch (e) {
        console.warn("Failed to delete auth user:", u.email, e)
      }
    }

    return NextResponse.json({ removed: users.length })
  } catch (error) {
    console.error("Cleanup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
