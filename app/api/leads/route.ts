import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { scoreLead } from "@/lib/ai-service"

// Get all leads
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ leads: data })
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
  }
}

// Create a new lead
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()

    // Get ICP settings
    const { data: icpData } = await supabase.from("settings").select("value").eq("key", "icp").single()

    const icp = icpData?.value || {}

    // Score the lead using AI
    const leadScore = await scoreLead(body, icp)

    // Insert the lead with the score
    const { data, error } = await supabase
      .from("leads")
      .insert({
        ...body,
        grade: leadScore.grade,
        notes: body.notes || `Fit score: ${leadScore.fitScore}. ${leadScore.reasons.join(" ")}`,
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ lead: data[0] })
  } catch (error) {
    console.error("Error creating lead:", error)
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 })
  }
}
