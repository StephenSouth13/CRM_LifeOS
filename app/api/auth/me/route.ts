import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/supabase"

const ADMIN_EMAILS = new Set([
  "stephensouth1307@gmail.com",
  "anhlong13@gmail.com",
  "anhlong13",
])

export async function POST(request: NextRequest) {
  try {
    const { id, email } = await request.json()
    if (!id || !email) {
      return NextResponse.json({ error: "Missing id or email" }, { status: 400 })
    }

    const { data: userProfile } = await supabaseAdmin
      .from("user_profiles")
      .select("*, memberships(*)")
      .eq("id", id)
      .single()

    if (!userProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const primaryMembership = userProfile.memberships?.find((m: any) => m.is_primary)
    if (!primaryMembership) {
      return NextResponse.json({ error: "Membership not found" }, { status: 404 })
    }

    const role = ADMIN_EMAILS.has(String(email).toLowerCase()) ? "ADMIN" : primaryMembership.role

    return NextResponse.json({
      user: {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        avatar: userProfile.avatar,
        role,
        orgId: primaryMembership.org_id,
        teamId: primaryMembership.team_id,
        manager_id: userProfile.manager_id,
        status: userProfile.status,
        createdAt: userProfile.created_at,
        updatedAt: userProfile.updated_at,
      },
    })
  } catch (error) {
    console.error("/api/auth/me error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
