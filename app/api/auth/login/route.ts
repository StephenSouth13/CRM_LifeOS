import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/supabase"

// Demo users for testing (fallback when Supabase is not fully set up)
const DEMO_USERS: Record<string, { password: string; user: any }> = {
  "bod@demo.com": {
    password: "123456",
    user: {
      id: "bod-user-1",
      email: "bod@demo.com",
      name: "BOD User",
      avatar: "/person-holding-keys.png",
      role: "BOD",
      orgId: "org-demo-1",
      teamId: null,
      manager_id: null,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  "admin@demo.com": {
    password: "123456",
    user: {
      id: "admin-user-1",
      email: "admin@demo.com",
      name: "Admin User",
      avatar: "/admin-interface.png",
      role: "ADMIN",
      orgId: "org-demo-1",
      teamId: null,
      manager_id: null,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  "leader@demo.com": {
    password: "123456",
    user: {
      id: "leader-user-1",
      email: "leader@demo.com",
      name: "Team Leader",
      avatar: "/abstract-geometric-shapes.png",
      role: "LEADER",
      orgId: "org-demo-1",
      teamId: "team-demo-1",
      manager_id: "admin-user-1",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  "student3@demo.com": {
    password: "123456",
    user: {
      id: "student3-user-1",
      email: "student3@demo.com",
      name: "Student L3",
      avatar: "/abstract-geometric-shapes.png",
      role: "STUDENT_L3",
      orgId: "org-demo-1",
      teamId: "team-demo-1",
      manager_id: "leader-user-1",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  "student2@demo.com": {
    password: "123456",
    user: {
      id: "student2-user-1",
      email: "student2@demo.com",
      name: "Student L2",
      avatar: "/abstract-geometric-shapes.png",
      role: "STUDENT_L2",
      orgId: "org-demo-1",
      teamId: "team-demo-1",
      manager_id: "leader-user-1",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  "student1@demo.com": {
    password: "123456",
    user: {
      id: "student1-user-1",
      email: "student1@demo.com",
      name: "Student L1",
      avatar: "/abstract-geometric-shapes.png",
      role: "STUDENT_L1",
      orgId: "org-demo-1",
      teamId: "team-demo-1",
      manager_id: "student3-user-1",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  "mentor@demo.com": {
    password: "123456",
    user: {
      id: "mentor-user-1",
      email: "mentor@demo.com",
      name: "Mentor Coach",
      avatar: "/abstract-geometric-shapes.png",
      role: "MENTOR",
      orgId: "org-demo-1",
      teamId: "team-demo-1",
      manager_id: "leader-user-1",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
}

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

    // First, try Supabase authentication (production)
    try {
      const { data: authData, error: authError } =
        await supabaseAdmin.auth.signInWithPassword({
          email,
          password,
        })

      if (!authError && authData.user) {
        // Supabase auth succeeded, get user profile
        const { data: userProfile, error: profileError } = await supabaseAdmin
          .from("user_profiles")
          .select("*, memberships(*)")
          .eq("id", authData.user.id)
          .single()

        if (!profileError && userProfile) {
          const primaryMembership = userProfile.memberships?.find(
            (m: any) => m.is_primary,
          )

          if (primaryMembership) {
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
          }
        }
      }
    } catch (supabaseError) {
      console.log("Supabase auth not available, falling back to demo users")
    }

    // Fallback: Check demo users for testing
    const demoUser = DEMO_USERS[email]
    if (demoUser && demoUser.password === password) {
      return NextResponse.json({
        user: demoUser.user,
        session: null,
        isDemoMode: true,
      })
    }

    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
