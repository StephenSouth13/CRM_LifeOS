import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/supabase"

/**
 * POST /api/evaluations - Create evaluation (ASK)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      evaluator_id,
      evaluatee_id,
      org_id,
      team_id,
      type = "manager",
      technical_skills,
      soft_skills,
      knowledge,
      attitude,
      comments,
      impact_on_promotion = false,
    } = body

    if (!evaluator_id || !evaluatee_id || !org_id) {
      return NextResponse.json(
        { error: "evaluator_id, evaluatee_id, and org_id are required" },
        { status: 400 },
      )
    }

    // Calculate overall score as average
    const scores = [technical_skills, soft_skills, knowledge, attitude].filter(
      (s) => s !== undefined && s !== null,
    )
    const overallScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null

    const { data: evaluation, error } = await supabaseAdmin
      .from("evaluations")
      .insert([
        {
          evaluator_id,
          evaluatee_id,
          org_id,
          team_id,
          type,
          technical_skills,
          soft_skills,
          knowledge,
          attitude,
          overall_score: overallScore,
          comments,
          impact_on_promotion,
          is_approved: false,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ evaluation }, { status: 201 })
  } catch (error) {
    console.error("Create evaluation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

/**
 * GET /api/evaluations - Get evaluations
 */
export async function GET(request: NextRequest) {
  try {
    const org_id = request.nextUrl.searchParams.get("org_id")
    const evaluatee_id = request.nextUrl.searchParams.get("evaluatee_id")
    const evaluator_id = request.nextUrl.searchParams.get("evaluator_id")
    const team_id = request.nextUrl.searchParams.get("team_id")
    const is_approved = request.nextUrl.searchParams.get("is_approved")

    if (!org_id) {
      return NextResponse.json(
        { error: "org_id is required" },
        { status: 400 },
      )
    }

    let query = supabaseAdmin
      .from("evaluations")
      .select(`
        *,
        evaluator:evaluator_id(id, name, email),
        evaluatee:evaluatee_id(id, name, email),
        approved_by_user:approved_by(id, name, email)
      `)
      .eq("org_id", org_id)

    if (evaluatee_id) {
      query = query.eq("evaluatee_id", evaluatee_id)
    }

    if (evaluator_id) {
      query = query.eq("evaluator_id", evaluator_id)
    }

    if (team_id) {
      query = query.eq("team_id", team_id)
    }

    if (is_approved !== null) {
      query = query.eq("is_approved", is_approved === "true")
    }

    const { data: evaluations, error } = await query.order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ evaluations })
  } catch (error) {
    console.error("Get evaluations error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

/**
 * PUT /api/evaluations/:id - Update/Approve evaluation
 */
export async function PUT(request: NextRequest) {
  try {
    const pathSegments = request.nextUrl.pathname.split("/")
    const id = pathSegments[pathSegments.length - 1]

    if (!id) {
      return NextResponse.json(
        { error: "Evaluation ID is required" },
        { status: 400 },
      )
    }

    const body = await request.json()
    const {
      technical_skills,
      soft_skills,
      knowledge,
      attitude,
      comments,
      is_approved,
      approved_by,
      impact_on_promotion,
    } = body

    const updates: Record<string, any> = {}
    if (technical_skills !== undefined) updates.technical_skills = technical_skills
    if (soft_skills !== undefined) updates.soft_skills = soft_skills
    if (knowledge !== undefined) updates.knowledge = knowledge
    if (attitude !== undefined) updates.attitude = attitude
    if (comments) updates.comments = comments
    if (impact_on_promotion !== undefined) updates.impact_on_promotion = impact_on_promotion
    if (is_approved !== undefined) {
      updates.is_approved = is_approved
      updates.approved_at = new Date().toISOString()
      if (approved_by) updates.approved_by = approved_by
    }

    // Recalculate overall score if any scores changed
    if (
      technical_skills !== undefined ||
      soft_skills !== undefined ||
      knowledge !== undefined ||
      attitude !== undefined
    ) {
      const scores = [technical_skills, soft_skills, knowledge, attitude].filter(
        (s) => s !== undefined && s !== null,
      )
      if (scores.length > 0) {
        updates.overall_score = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      }
    }

    updates.updated_at = new Date().toISOString()

    const { data: evaluation, error } = await supabaseAdmin
      .from("evaluations")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      evaluation,
      message: "Evaluation updated successfully",
    })
  } catch (error) {
    console.error("Update evaluation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
