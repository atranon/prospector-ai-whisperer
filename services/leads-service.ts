import { getSupabaseBrowserClient } from "@/lib/supabase"
import type { Lead } from "@/types/database"

export async function getLeads(): Promise<Lead[]> {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching leads:", error)
    return []
  }

  return data || []
}

export async function getLead(id: string): Promise<Lead | null> {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("leads").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching lead:", error)
    return null
  }

  return data
}

export async function createLead(lead: Omit<Lead, "id" | "created_at" | "updated_at">): Promise<Lead | null> {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("leads").insert([lead]).select().single()

  if (error) {
    console.error("Error creating lead:", error)
    return null
  }

  return data
}

export async function updateLead(id: string, lead: Partial<Lead>): Promise<Lead | null> {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("leads").update(lead).eq("id", id).select().single()

  if (error) {
    console.error("Error updating lead:", error)
    return null
  }

  return data
}

export async function deleteLead(id: string): Promise<boolean> {
  const supabase = getSupabaseBrowserClient()

  const { error } = await supabase.from("leads").delete().eq("id", id)

  if (error) {
    console.error("Error deleting lead:", error)
    return false
  }

  return true
}
