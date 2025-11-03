import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 },
      )
    }

    // Authenticate user with Supabase
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      })

    if (authError) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 },
      )
    }

    // Get user profile with role
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .select("*, memberships(*)")
      .eq("id", authData.user.id)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 },
      )
    }

    // Get primary membership for role
    const primaryMembership = userProfile.memberships?.find(
      (m: any) => m.is_primary,
    )

    if (!primaryMembership) {
      return NextResponse.json(
        { error: "User membership not found" },
        { status: 404 },
      )
    }

    return NextResponse.json({
      user: {
        id: userProfile.id,
        email: userProfile.email,
        name: userProfile.name,
        avatar: userProfile.avatar,
        role: primaryMembership.role,
        orgId: primaryMembership.org_id,
        teamId: primaryMembership.team_id,
        manager_id: userProfile.manager_id,
        status: userProfile.status,
        createdAt: userProfile.created_at,
        updatedAt: userProfile.updated_at,
      },
      session: authData.session,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
