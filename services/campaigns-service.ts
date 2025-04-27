import { getSupabaseBrowserClient } from "@/lib/supabase"
import type { Campaign } from "@/types/database"

export async function getCampaigns(): Promise<Campaign[]> {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("campaigns").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching campaigns:", error)
    return []
  }

  return data || []
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("campaigns").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching campaign:", error)
    return null
  }

  return data
}

export async function createCampaign(
  campaign: Omit<Campaign, "id" | "created_at" | "updated_at">,
): Promise<Campaign | null> {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("campaigns").insert([campaign]).select().single()

  if (error) {
    console.error("Error creating campaign:", error)
    return null
  }

  return data
}

export async function updateCampaign(id: string, campaign: Partial<Campaign>): Promise<Campaign | null> {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("campaigns").update(campaign).eq("id", id).select().single()

  if (error) {
    console.error("Error updating campaign:", error)
    return null
  }

  return data
}

export async function deleteCampaign(id: string): Promise<boolean> {
  const supabase = getSupabaseBrowserClient()

  const { error } = await supabase.from("campaigns").delete().eq("id", id)

  if (error) {
    console.error("Error deleting campaign:", error)
    return false
  }

  return true
}
