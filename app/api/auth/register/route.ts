import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, org_id } = body

    if (!email || !password || !name || !org_id) {
      return NextResponse.json(
        { error: "Email, password, name, and org_id are required" },
        { status: 400 },
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from("user_profiles")
      .select("id")
      .eq("email", email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      )
    }

    // Create auth user
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: false,
      })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 },
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 400 },
      )
    }

    // Create user profile
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .insert([
        {
          id: authData.user.id,
          email,
          name,
          org_id,
          status: "active",
        },
      ])
      .select()
      .single()

    if (profileError) {
      // Clean up auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json(
        { error: "Failed to create user profile" },
        { status: 400 },
      )
    }

    const ADMIN_EMAILS = new Set([
      "stephensouth1307@gmail.com",
      "anhlong13@gmail.com",
      "anhlong13",
    ])
    const assignedRole = ADMIN_EMAILS.has(String(email).toLowerCase()) ? "ADMIN" : "STUDENT_L1"

    // Create membership with default role
    const { error: membershipError } = await supabaseAdmin
      .from("memberships")
      .insert([
        {
          user_id: authData.user.id,
          org_id,
          role: assignedRole,
          is_primary: true,
        },
      ])

    if (membershipError) {
      return NextResponse.json(
        { error: "Failed to create membership" },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        user: {
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name,
          role: assignedRole,
          orgId: org_id,
          status: userProfile.status,
        },
        message: "User registered successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
