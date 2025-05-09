import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// Get all settings
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data, error } = await supabase.from("settings").select("*")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Convert array to object for easier access
    const settings = data.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value
        return acc
      },
      {} as Record<string, any>,
    )

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

// Update a setting
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { key, value } = await request.json()

    // Check if setting exists
    const { data: existingSetting } = await supabase.from("settings").select("*").eq("key", key).single()

    let result

    if (existingSetting) {
      // Update existing setting
      const { data, error } = await supabase.from("settings").update({ value }).eq("key", key).select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      result = data[0]
    } else {
      // Create new setting
      const { data, error } = await supabase.from("settings").insert({ key, value }).select()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      result = data[0]
    }

    return NextResponse.json({ setting: result })
  } catch (error) {
    console.error("Error updating setting:", error)
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 })
  }
}
