import { getSupabaseServerClient } from "@/lib/supabase"

export async function seedDatabase() {
  const supabase = getSupabaseServerClient()

  try {
    // Sample leads
    const leads = [
      {
        name: "Sarah Johnson",
        title: "CTO",
        company: "TechSolutions Inc.",
        email: "sarah.johnson@techsolutions.com",
        phone: "555-123-4567",
        linkedin_url: "https://linkedin.com/in/sarahjohnson",
        status: "new",
        grade: "A",
        notes: "Met at TechCrunch conference. Interested in DevOps staffing.",
      },
      {
        name: "Michael Chen",
        title: "VP Engineering",
        company: "InnovateTech",
        email: "michael.chen@innovatetech.com",
        phone: "555-234-5678",
        linkedin_url: "https://linkedin.com/in/michaelchen",
        status: "contacted",
        grade: "A",
        notes: "Looking for React developers for Q3 project.",
      },
      {
        name: "David Wilson",
        title: "IT Director",
        company: "GlobalCorp",
        email: "david.wilson@globalcorp.com",
        phone: "555-345-6789",
        linkedin_url: "https://linkedin.com/in/davidwilson",
        status: "responded",
        grade: "B",
        notes: "Needs cloud migration specialists.",
      },
      {
        name: "Alex Rivera",
        title: "VP Engineering",
        company: "FutureTech",
        email: "alex.rivera@futuretech.com",
        phone: "555-456-7890",
        linkedin_url: "https://linkedin.com/in/alexrivera",
        status: "meeting_set",
        grade: "A",
        notes: "Meeting scheduled for next Tuesday to discuss staffing needs.",
      },
      {
        name: "Jessica Lee",
        title: "CIO",
        company: "DataDrive Systems",
        email: "jessica.lee@datadrive.com",
        phone: "555-567-8901",
        linkedin_url: "https://linkedin.com/in/jessicalee",
        status: "not_interested",
        grade: "C",
        notes: "Not hiring at the moment.",
      },
    ]

    // Sample campaigns
    const campaigns = [
      {
        name: "Q2 IT Directors Campaign",
        description: "Targeting IT Directors in Finance sector",
        status: "active",
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        name: "CTOs in Healthcare",
        description: "Outreach to CTOs in Healthcare companies",
        status: "paused",
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        name: "Tech Leads Follow-up",
        description: "Follow-up campaign for previous contacts",
        status: "scheduled",
        start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    // Sample message templates
    const messageTemplates = [
      {
        name: "Initial Outreach",
        description: "First touch message for new leads",
        content:
          "Hi {{first_name}}, I noticed you're leading the tech team at {{company}}. I help IT leaders find specialized developers for their projects. Would you be open to a quick chat about how we might support your team's initiatives?",
        type: "linkedin",
        variables: { first_name: true, company: true },
      },
      {
        name: "Follow-up #1",
        description: "First follow-up after no response",
        content:
          "Hi {{first_name}}, I wanted to follow up on my previous message. I understand you're busy, but I'd love to share how we've helped companies like {{company}} with their IT staffing needs. Would you have 15 minutes this week?",
        type: "linkedin",
        variables: { first_name: true, company: true },
      },
      {
        name: "Email Introduction",
        description: "Initial email outreach",
        content:
          "Subject: Quick question about {{company}}'s tech initiatives\n\nHi {{first_name}},\n\nI hope this email finds you well. I noticed that {{company}} has been expanding its {{technology}} capabilities, and I wanted to reach out.\n\nWe specialize in providing skilled IT professionals for companies in the {{industry}} space. Would you be open to a brief conversation about how we might support your team's growth?\n\nBest regards,\n{{sender_name}}",
        type: "email",
        variables: { first_name: true, company: true, technology: true, industry: true, sender_name: true },
      },
    ]

    // Sample activities
    const activities = [
      {
        type: "message_sent",
        description: "Message sent to Sarah Johnson",
        metadata: {
          details: "Initial outreach message sent via LinkedIn",
          avatar: null,
        },
      },
      {
        type: "lead_found",
        description: "New lead discovered",
        metadata: {
          details: "Michael Chen, CTO at TechNova - A-grade match",
          avatar: null,
        },
      },
      {
        type: "meeting_scheduled",
        description: "Meeting scheduled",
        metadata: {
          details: "Demo call with David Wilson, IT Director at GlobalCorp",
          avatar: null,
        },
      },
      {
        type: "response_received",
        description: "Response received",
        metadata: {
          details: "Positive reply from Alex Rivera, VP Engineering",
          avatar: null,
        },
      },
    ]

    // Insert sample data
    await supabase.from("leads").delete().eq("id", "dummy").or("id.gt.0")
    await supabase.from("campaigns").delete().eq("id", "dummy").or("id.gt.0")
    await supabase.from("message_templates").delete().eq("id", "dummy").or("id.gt.0")
    await supabase.from("activities").delete().eq("id", "dummy").or("id.gt.0")

    await supabase.from("leads").insert(leads)
    await supabase.from("campaigns").insert(campaigns)
    await supabase.from("message_templates").insert(messageTemplates)
    await supabase.from("activities").insert(activities)

    return { success: true, message: "Database seeded successfully" }
  } catch (error) {
    console.error("Error seeding database:", error)
    return { success: false, error: "Failed to seed database" }
  }
}
