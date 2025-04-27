import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const { apiKey } = await req.json()

    if (!apiKey || !apiKey.startsWith("sk-")) {
      return NextResponse.json({ success: false, message: "Invalid API key format" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // Check if the key already exists
    const { data: existingKey } = await supabase.from("api_keys").select("id").eq("key_type", "openai").single()

    if (existingKey) {
      // Update existing key
      await supabase
        .from("api_keys")
        .update({
          key_value: apiKey,
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingKey.id)
    } else {
      // Insert new key
      await supabase.from("api_keys").insert({
        name: "OpenAI API Key",
        key_type: "openai",
        key_value: apiKey,
        status: "active",
      })
    }

    // Also save to settings for easier access
    const { data: existingSetting } = await supabase.from("settings").select("id").eq("id", "openai_api_key").single()

    if (existingSetting) {
      await supabase
        .from("settings")
        .update({
          value: { key: apiKey },
          updated_at: new Date().toISOString(),
        })
        .eq("id", "openai_api_key")
    } else {
      await supabase.from("settings").insert({
        id: "openai_api_key",
        name: "OpenAI API Key",
        value: { key: apiKey },
      })
    }

    // In a real application, you would set the environment variable
    // For now, we'll just return success
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving OpenAI API key:", error)
    return NextResponse.json({ success: false, message: "Failed to save API key" }, { status: 500 })
  }
}
