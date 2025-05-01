import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// Define types
type Lead = {
  name: string
  title: string
  company: string
  industry?: string
  linkedin_url?: string
  notes?: string
}

type LeadScore = {
  grade: "A" | "B" | "C"
  reasons: string[]
  fitScore: number
}

type MessageGeneration = {
  message: string
  personalization: string[]
}

// ICP criteria schema
const ICPSchema = z.object({
  industries: z.array(z.string()).optional(),
  companySize: z.string().optional(),
  titles: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  locations: z.array(z.string()).optional(),
})

type ICP = z.infer<typeof ICPSchema>

export async function scoreLead(lead: Lead, icp: ICP): Promise<LeadScore> {
  try {
    // Use a simpler model for cost efficiency
    const model = openai("gpt-3.5-turbo")

    const prompt = `
      You are an AI assistant that scores sales leads based on how well they match an Ideal Customer Profile (ICP).
      
      Lead information:
      - Name: ${lead.name}
      - Title: ${lead.title}
      - Company: ${lead.company}
      - Industry: ${lead.industry || "Unknown"}
      ${lead.notes ? `- Additional notes: ${lead.notes}` : ""}
      
      Ideal Customer Profile (ICP):
      - Industries: ${icp.industries?.join(", ") || "Any"}
      - Company Size: ${icp.companySize || "Any"}
      - Target Titles: ${icp.titles?.join(", ") || "Any"}
      - Technologies: ${icp.technologies?.join(", ") || "Any"}
      - Locations: ${icp.locations?.join(", ") || "Any"}
      
      Grade this lead from A to C:
      - A: Excellent match with ICP (80-100% match)
      - B: Good match with ICP (50-79% match)
      - C: Poor match with ICP (0-49% match)
      
      Provide a fit score (0-100) and 2-3 specific reasons for your grading.
    `

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.3, // Lower temperature for more consistent scoring
    })

    // Parse the response - in a production app, you'd want more robust parsing
    const gradeMatch = text.match(/Grade: ([ABC])/i)
    const scoreMatch = text.match(/Fit Score: (\d+)/i)
    const reasonsMatch = text.match(/Reasons:([\s\S]+)/i)

    const grade = gradeMatch ? (gradeMatch[1] as "A" | "B" | "C") : "C"
    const fitScore = scoreMatch ? Number.parseInt(scoreMatch[1], 10) : 50

    let reasons: string[] = []
    if (reasonsMatch) {
      reasons = reasonsMatch[1]
        .split(/\d+\./)
        .filter(Boolean)
        .map((reason) => reason.trim())
    }

    return {
      grade,
      fitScore,
      reasons,
    }
  } catch (error) {
    console.error("Error scoring lead:", error)
    return {
      grade: "C",
      fitScore: 0,
      reasons: ["Error processing lead score"],
    }
  }
}

export async function generatePersonalizedMessage(
  lead: Lead,
  templateContent: string,
  additionalContext?: string,
): Promise<MessageGeneration> {
  try {
    // Use a simpler model for cost efficiency
    const model = openai("gpt-3.5-turbo")

    const prompt = `
      You are an AI assistant that personalizes outreach messages for sales professionals.
      
      Lead information:
      - Name: ${lead.name}
      - Title: ${lead.title}
      - Company: ${lead.company}
      - Industry: ${lead.industry || "Unknown"}
      ${lead.notes ? `- Additional notes: ${lead.notes}` : ""}
      ${additionalContext ? `- Additional context: ${additionalContext}` : ""}
      
      Template message:
      """
      ${templateContent}
      """
      
      Please personalize this message for the lead. Replace any placeholders like {{first_name}}, {{company}}, etc.
      Add 1-2 sentences of personalization based on the lead's information  {{company}}, etc.
      Add 1-2 sentences of personalization based on the lead's information. Focus on making the message feel tailored to their specific role, company, or industry.
      
      Return the personalized message and list the specific personalizations you made.
    `

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.7, // Higher temperature for more creative personalization
    })

    // Parse the response - in a production app, you'd want more robust parsing
    const messageMatch = text.match(/Personalized message:([\s\S]+?)(?:Personalizations:|$)/i)
    const personalizationsMatch = text.match(/Personalizations:([\s\S]+)/i)

    const message = messageMatch ? messageMatch[1].trim() : templateContent

    let personalizations: string[] = []
    if (personalizationsMatch) {
      personalizations = personalizationsMatch[1]
        .split(/\d+\./)
        .filter(Boolean)
        .map((p) => p.trim())
    }

    return {
      message,
      personalization: personalizations,
    }
  } catch (error) {
    console.error("Error generating personalized message:", error)
    return {
      message: templateContent,
      personalization: ["Error generating personalization"],
    }
  }
}

export async function generateFollowUpMessage(
  lead: Lead,
  previousMessage: string,
  daysElapsed: number,
): Promise<MessageGeneration> {
  try {
    // Use a simpler model for cost efficiency
    const model = openai("gpt-3.5-turbo")

    const prompt = `
      You are an AI assistant that creates follow-up messages for sales professionals.
      
      Lead information:
      - Name: ${lead.name}
      - Title: ${lead.title}
      - Company: ${lead.company}
      
      Previous message sent ${daysElapsed} days ago:
      """
      ${previousMessage}
      """
      
      Create a brief, friendly follow-up message that:
      1. References the previous message
      2. Adds a new angle or value proposition
      3. Ends with a clear call to action
      4. Is no more than 3-4 sentences
      
      The tone should be professional but conversational, not pushy.
    `

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.7,
    })

    // In a production app, you'd want more robust parsing
    const messageMatch = text.match(/Follow-up message:([\s\S]+?)(?:Personalizations:|$)/i)
    const personalizationsMatch = text.match(/Personalizations:([\s\S]+)/i)

    const message = messageMatch ? messageMatch[1].trim() : text.trim()

    let personalizations: string[] = []
    if (personalizationsMatch) {
      personalizations = personalizationsMatch[1]
        .split(/\d+\./)
        .filter(Boolean)
        .map((p) => p.trim())
    }

    return {
      message,
      personalization: personalizations,
    }
  } catch (error) {
    console.error("Error generating follow-up message:", error)
    return {
      message: `Hi ${lead.name}, I wanted to follow up on my previous message. Would you have time for a quick chat this week?`,
      personalization: ["Error generating follow-up"],
    }
  }
}
