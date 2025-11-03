import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/supabase"

/**
 * POST /api/attendance - Create attendance log (check-in/out)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id,
      org_id,
      team_id,
      type,
      lat,
      lon,
      wifi_ssid,
    } = body

    if (!user_id || !org_id || !type) {
      return NextResponse.json(
        { error: "user_id, org_id, and type are required" },
        { status: 400 },
      )
    }

    if (type !== "check_in" && type !== "check_out") {
      return NextResponse.json(
        { error: "type must be check_in or check_out" },
        { status: 400 },
      )
    }

    let updateData: Record<string, any> = {}
    let checkField: string
    let checkLocField: string
    let checkWifiField: string

    if (type === "check_in") {
      checkField = "check_in_time"
      checkLocField = "check_in_lat"
      checkWifiField = "check_in_wifi_ssid"
      updateData = {
        check_in_time: new Date().toISOString(),
        check_in_lat: lat,
        check_in_lon: lon,
        check_in_wifi_ssid: wifi_ssid,
        status: "pending",
      }
    } else {
      checkField = "check_out_time"
      checkLocField = "check_out_lat"
      checkWifiField = "check_out_wifi_ssid"
      updateData = {
        check_out_time: new Date().toISOString(),
        check_out_lat: lat,
        check_out_lon: lon,
        check_out_wifi_ssid: wifi_ssid,
      }
    }

    // Check if today's record exists
    const today = new Date().toISOString().split("T")[0]
    const { data: existingLog } = await supabaseAdmin
      .from("attendance_logs")
      .select("id")
      .eq("user_id", user_id)
      .eq("org_id", org_id)
      .gte("check_in_time", `${today}T00:00:00`)
      .lte("check_in_time", `${today}T23:59:59`)
      .single()

    let result

    if (existingLog && type === "check_out") {
      // Update existing record with check-out
      result = await supabaseAdmin
        .from("attendance_logs")
        .update(updateData)
        .eq("id", existingLog.id)
        .select()
        .single()
    } else if (!existingLog && type === "check_in") {
      // Create new record
      result = await supabaseAdmin
        .from("attendance_logs")
        .insert([
          {
            user_id,
            org_id,
            team_id,
            ...updateData,
          },
        ])
        .select()
        .single()
    } else {
      return NextResponse.json(
        { error: "Invalid attendance operation" },
        { status: 400 },
      )
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 },
      )
    }

    return NextResponse.json({
      log: result.data,
      message: `Checked ${type === "check_in" ? "in" : "out"} successfully`,
    })
  } catch (error) {
    console.error("Attendance error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

/**
 * GET /api/attendance - Get attendance logs (with permission checks)
 */
export async function GET(request: NextRequest) {
  try {
    const user_id = request.nextUrl.searchParams.get("user_id")
    const org_id = request.nextUrl.searchParams.get("org_id")
    const team_id = request.nextUrl.searchParams.get("team_id")
    const startDate = request.nextUrl.searchParams.get("start_date")
    const endDate = request.nextUrl.searchParams.get("end_date")

    if (!org_id) {
      return NextResponse.json(
        { error: "org_id is required" },
        { status: 400 },
      )
    }

    let query = supabaseAdmin
      .from("attendance_logs")
      .select("*")
      .eq("org_id", org_id)

    if (user_id) {
      query = query.eq("user_id", user_id)
    }

    if (team_id) {
      query = query.eq("team_id", team_id)
    }

    if (startDate) {
      query = query.gte("check_in_time", startDate)
    }

    if (endDate) {
      query = query.lte("check_in_time", endDate)
    }

    const { data: logs, error } = await query.order("check_in_time", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ logs })
  } catch (error) {
    console.error("Get attendance error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

/**
 * PUT /api/attendance/:id - Verify/approve attendance (LEADER/ADMIN/BOD only)
 */
export async function PUT(request: NextRequest) {
  try {
    const pathSegments = request.nextUrl.pathname.split("/")
    const id = pathSegments[pathSegments.length - 1]

    if (!id) {
      return NextResponse.json(
        { error: "Attendance log ID is required" },
        { status: 400 },
      )
    }

    const body = await request.json()
    const { status, verified_by, notes } = body

    const updates: Record<string, any> = {}
    if (status) updates.status = status
    if (verified_by) updates.verified_by = verified_by
    if (notes) updates.notes = notes
    if (status !== "pending") updates.verified_at = new Date().toISOString()

    const { data: log, error } = await supabaseAdmin
      .from("attendance_logs")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      log,
      message: "Attendance verified successfully",
    })
  } catch (error) {
    console.error("Update attendance error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
