import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/supabase"

/**
 * POST /api/leave-requests - Create a new leave request
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id,
      org_id,
      team_id,
      type,
      start_date,
      end_date,
      reason,
    } = body

    if (!user_id || !org_id || !type || !start_date || !end_date || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      )
    }

    // Calculate number of days
    const startDate = new Date(start_date)
    const endDate = new Date(end_date)
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

    const { data: leaveRequest, error } = await supabaseAdmin
      .from("leave_requests")
      .insert([
        {
          user_id,
          org_id,
          team_id,
          type,
          start_date,
          end_date,
          days,
          reason,
          status: "pending",
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ leaveRequest }, { status: 201 })
  } catch (error) {
    console.error("Create leave request error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

/**
 * GET /api/leave-requests - Get leave requests
 */
export async function GET(request: NextRequest) {
  try {
    const org_id = request.nextUrl.searchParams.get("org_id")
    const user_id = request.nextUrl.searchParams.get("user_id")
    const team_id = request.nextUrl.searchParams.get("team_id")
    const status = request.nextUrl.searchParams.get("status")

    if (!org_id) {
      return NextResponse.json(
        { error: "org_id is required" },
        { status: 400 },
      )
    }

    let query = supabaseAdmin
      .from("leave_requests")
      .select("*, user:user_id(id, name, email), approved_by_user:approved_by(id, name, email)")
      .eq("org_id", org_id)

    if (user_id) {
      query = query.eq("user_id", user_id)
    }

    if (team_id) {
      query = query.eq("team_id", team_id)
    }

    if (status) {
      query = query.eq("status", status)
    }

    const { data: requests, error } = await query.order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ requests })
  } catch (error) {
    console.error("Get leave requests error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

/**
 * PUT /api/leave-requests/:id - Update/Approve leave request
 */
export async function PUT(request: NextRequest) {
  try {
    const pathSegments = request.nextUrl.pathname.split("/")
    const id = pathSegments[pathSegments.length - 1]

    if (!id) {
      return NextResponse.json(
        { error: "Leave request ID is required" },
        { status: 400 },
      )
    }

    const body = await request.json()
    const { status, approved_by, notes } = body

    const updates: Record<string, any> = {}
    if (status) {
      updates.status = status
      if (status !== "pending") {
        updates.approved_at = new Date().toISOString()
      }
    }
    if (approved_by) updates.approved_by = approved_by
    if (notes) updates.notes = notes

    const { data: leaveRequest, error } = await supabaseAdmin
      .from("leave_requests")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      leaveRequest,
      message: "Leave request updated successfully",
    })
  } catch (error) {
    console.error("Update leave request error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
