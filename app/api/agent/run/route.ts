import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"
import { scoreLeadWithAI, generatePersonalizedMessage } from "@/services/ai-service"

export async function POST() {
  const supabase = getSupabaseServerClient()

  try {
    // First, check if we have an OpenAI API key
    const { data: apiKeySetting } = await supabase.from("settings").select("value").eq("id", "openai_api_key").single()

    if (!apiKeySetting?.value?.key) {
      return NextResponse.json(
        { success: false, error: "OpenAI API key not found. Please add your API key in settings." },
        { status: 400 },
      )
    }

    // Set the API key for this request
    process.env.OPENAI_API_KEY = apiKeySetting.value.key

    // 1. Get leads that need processing (new leads without messages)
    const { data: newLeads } = await supabase.from("leads").select("*").eq("status", "new").limit(5)

    if (!newLeads || newLeads.length === 0) {
      return NextResponse.json({ success: true, message: "No new leads to process" })
    }

    // 2. Get a message template for initial outreach
    const { data: templates } = await supabase
      .from("message_templates")
      .select("*")
      .eq("name", "Initial Outreach")
      .limit(1)

    if (!templates || templates.length === 0) {
      return NextResponse.json({ success: false, error: "No message template found" }, { status: 404 })
    }

    const template = templates[0]

    // 3. Process each lead
    const results = await Promise.all(
      newLeads.map(async (lead) => {
        // Score the lead if it doesn't have a meaningful grade
        if (lead.grade === "C") {
          const grade = await scoreLeadWithAI(lead)

          // Update the lead with the AI-generated grade
          await supabase.from("leads").update({ grade }).eq("id", lead.id)

          lead.grade = grade
        }

        // Generate a personalized message
        const content = await generatePersonalizedMessage(template.content, lead)

        // Create a message
        const { data: message } = await supabase
          .from("messages")
          .insert({
            lead_id: lead.id,
            template_id: template.id,
            content,
            type: template.type,
            status: "draft",
            scheduled_at: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // Schedule for 1 hour from now
          })
          .select()
          .single()

        // Update lead status
        await supabase.from("leads").update({ status: "contacted" }).eq("id", lead.id)

        // Create activity
        await supabase.from("activities").insert({
          lead_id: lead.id,
          type: "message_sent",
          description: `Message prepared for ${lead.name}`,
          metadata: {
            details: `Initial outreach message drafted for ${lead.name} at ${lead.company || "Unknown"}`,
            avatar: null,
          },
        })

        return {
          lead_id: lead.id,
          lead_name: lead.name,
          grade: lead.grade,
          message_id: message?.id,
        }
      }),
    )

    return NextResponse.json({
      success: true,
      message: `Processed ${results.length} leads`,
      results,
    })
  } catch (error) {
    console.error("Error running agent:", error)
    return NextResponse.json({ success: false, error: "Failed to run agent" }, { status: 500 })
  }
}
