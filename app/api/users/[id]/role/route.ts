import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/supabase"
import { canManageUser } from "@/lib/permissions"
import type { Role } from "@/lib/types"

/**
 * PUT /api/users/[id]/role - Update user role
 * Only ADMIN and BOD can manage roles
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const userId = params.id

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      )
    }

    const body = await request.json()
    const { new_role, org_id, assigned_by } = body

    if (!new_role || !org_id || !assigned_by) {
      return NextResponse.json(
        { error: "new_role, org_id, and assigned_by are required" },
        { status: 400 },
      )
    }

    // Get assigner's role to check if they can manage the new role
    const { data: assignerMembership } = await supabaseAdmin
      .from("memberships")
      .select("role")
      .eq("user_id", assigned_by)
      .eq("org_id", org_id)
      .single()

    if (!assignerMembership) {
      return NextResponse.json(
        { error: "Assigner membership not found" },
        { status: 404 },
      )
    }

    const assignerRole = assignerMembership.role as Role

    // Check if assigner can manage the new role
    if (!canManageUser(assignerRole, new_role as Role)) {
      return NextResponse.json(
        { error: "You don't have permission to assign this role" },
        { status: 403 },
      )
    }

    // Update membership
    const { data: updatedMembership, error } = await supabaseAdmin
      .from("memberships")
      .update({
        role: new_role,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("org_id", org_id)
      .eq("is_primary", true)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Log action in audit log
    await supabaseAdmin.from("audit_logs").insert([
      {
        user_id: assigned_by,
        org_id: org_id,
        action: "ROLE_CHANGED",
        resource_type: "user",
        resource_id: userId,
        changes: {
          old_role: assignerRole,
          new_role,
        },
      },
    ])

    return NextResponse.json({
      membership: updatedMembership,
      message: `User role updated to ${new_role}`,
    })
  } catch (error) {
    console.error("Update role error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

/**
 * GET /api/users/[id]/role - Get user role information
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const userId = params.id
    const org_id = request.nextUrl.searchParams.get("org_id")

    if (!userId || !org_id) {
      return NextResponse.json(
        { error: "User ID and org_id are required" },
        { status: 400 },
      )
    }

    const { data: membership, error } = await supabaseAdmin
      .from("memberships")
      .select("*")
      .eq("user_id", userId)
      .eq("org_id", org_id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ membership })
  } catch (error) {
    console.error("Get role error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
