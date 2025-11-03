import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/supabase"

/**
 * POST /api/tasks - Create a new task
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      status = "todo",
      priority = "medium",
      assignee_id,
      assigned_by,
      team_id,
      org_id,
      due_date,
    } = body

    if (!title || !team_id || !org_id || !assigned_by) {
      return NextResponse.json(
        { error: "title, team_id, org_id, and assigned_by are required" },
        { status: 400 },
      )
    }

    const { data: task, error } = await supabaseAdmin
      .from("tasks")
      .insert([
        {
          title,
          description,
          status,
          priority,
          assignee_id,
          assigned_by,
          team_id,
          org_id,
          due_date,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error("Create task error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

/**
 * GET /api/tasks - Get tasks (with permission filtering)
 */
export async function GET(request: NextRequest) {
  try {
    const org_id = request.nextUrl.searchParams.get("org_id")
    const team_id = request.nextUrl.searchParams.get("team_id")
    const assignee_id = request.nextUrl.searchParams.get("assignee_id")
    const status = request.nextUrl.searchParams.get("status")

    if (!org_id) {
      return NextResponse.json(
        { error: "org_id is required" },
        { status: 400 },
      )
    }

    let query = supabaseAdmin
      .from("tasks")
      .select("*, assigned_by_user:assigned_by(id, name, email), assignee:assignee_id(id, name, email)")
      .eq("org_id", org_id)

    if (team_id) {
      query = query.eq("team_id", team_id)
    }

    if (assignee_id) {
      query = query.eq("assignee_id", assignee_id)
    }

    if (status) {
      query = query.eq("status", status)
    }

    const { data: tasks, error } = await query.order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Get tasks error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

/**
 * PUT /api/tasks/:id - Update task
 */
export async function PUT(request: NextRequest) {
  try {
    const pathSegments = request.nextUrl.pathname.split("/")
    const id = pathSegments[pathSegments.length - 1]

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 },
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      status,
      priority,
      assignee_id,
      due_date,
      completed_date,
    } = body

    const updates: Record<string, any> = {}
    if (title) updates.title = title
    if (description) updates.description = description
    if (status) updates.status = status
    if (priority) updates.priority = priority
    if (assignee_id !== undefined) updates.assignee_id = assignee_id
    if (due_date) updates.due_date = due_date
    if (completed_date) updates.completed_date = completed_date
    updates.updated_at = new Date().toISOString()

    const { data: task, error } = await supabaseAdmin
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Update task error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
