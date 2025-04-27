import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Get the OpenAI API key from environment variables
const getOpenAIConfig = () => {
  // For server components
  return {
    apiKey: process.env.OPENAI_API_KEY || "",
  }
}

export async function scoreLeadWithAI(leadData: any): Promise<string> {
  try {
    const prompt = `
      Score this sales lead from A to C based on the following criteria:
      - A: High-value prospect, decision maker, clear need
      - B: Medium-value prospect, influencer, potential need
      - C: Low-value prospect, not decision maker, unclear need
      
      Lead information:
      Name: ${leadData.name}
      Title: ${leadData.title || "Unknown"}
      Company: ${leadData.company || "Unknown"}
      Notes: ${leadData.notes || "None"}
      
      Return only a single letter grade: A, B, or C.
    `

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo", getOpenAIConfig()),
      prompt,
    })

    // Extract just the grade letter
    const grade = text.trim().charAt(0)
    return ["A", "B", "C"].includes(grade) ? grade : "C"
  } catch (error) {
    console.error("Error scoring lead with AI:", error)
    return "C" // Default to C if there's an error
  }
}

export async function generatePersonalizedMessage(template: string, leadData: any): Promise<string> {
  try {
    const prompt = `
      Personalize the following message template for a sales outreach:
      
      Template: ${template}
      
      Lead information:
      Name: ${leadData.name}
      Title: ${leadData.title || "Unknown"}
      Company: ${leadData.company || "Unknown"}
      
      Replace any variables like {{first_name}}, {{company}}, etc. with the appropriate information.
      Make the message sound natural and personalized.
      Keep the same general structure and intent of the original template.
    `

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo", getOpenAIConfig()),
      prompt,
    })

    return text.trim()
  } catch (error) {
    console.error("Error generating personalized message:", error)

    // Fallback to basic variable replacement
    let message = template
    message = message.replace(/{{first_name}}/g, leadData.name.split(" ")[0])
    message = message.replace(/{{company}}/g, leadData.company || "[Company]")

    return message
  }
}
