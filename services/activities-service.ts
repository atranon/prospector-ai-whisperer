import { getSupabaseBrowserClient } from "@/lib/supabase"
import type { Activity } from "@/types/database"

export async function getActivities(limit = 10): Promise<Activity[]> {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching activities:", error)
    return []
  }

  return data || []
}

export async function createActivity(activity: Omit<Activity, "id" | "created_at">): Promise<Activity | null> {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("activities").insert([activity]).select().single()

  if (error) {
    console.error("Error creating activity:", error)
    return null
  }

  return data
}
