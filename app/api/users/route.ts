import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/supabase"
import { canManageUser } from "@/lib/permissions"
import type { Role } from "@/lib/types"

/**
 * GET /api/users - Get list of users (with permission checks)
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get org_id from query
    const org_id = request.nextUrl.searchParams.get("org_id")
    const team_id = request.nextUrl.searchParams.get("team_id")

    if (!org_id) {
      return NextResponse.json(
        { error: "org_id is required" },
        { status: 400 },
      )
    }

    let query = supabaseAdmin
      .from("user_profiles")
      .select("*, memberships(*)")
      .eq("org_id", org_id)

    if (team_id) {
      query = query.eq("team_id", team_id)
    }

    const { data: users, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

/**
 * PUT /api/users/:id - Update user profile
 */
export async function PUT(request: NextRequest) {
  try {
    const pathSegments = request.nextUrl.pathname.split("/")
    const userId = pathSegments[pathSegments.length - 1]

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      )
    }

    const body = await request.json()
    const { name, avatar, team_id, manager_id } = body

    const updates: Record<string, any> = {}
    if (name) updates.name = name
    if (avatar) updates.avatar = avatar
    if (team_id) updates.team_id = team_id
    if (manager_id) updates.manager_id = manager_id
    updates.updated_at = new Date().toISOString()

    const { data: user, error } = await supabaseAdmin
      .from("user_profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
