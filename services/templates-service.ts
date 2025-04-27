import { getSupabaseBrowserClient } from "@/lib/supabase"
import type { MessageTemplate } from "@/types/database"

export async function getMessageTemplates(): Promise<MessageTemplate[]> {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("message_templates").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching message templates:", error)
    return []
  }

  return data || []
}

export async function getMessageTemplate(id: string): Promise<MessageTemplate | null> {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("message_templates").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching message template:", error)
    return null
  }

  return data
}

export async function createMessageTemplate(
  template: Omit<MessageTemplate, "id" | "created_at" | "updated_at">,
): Promise<MessageTemplate | null> {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("message_templates").insert([template]).select().single()

  if (error) {
    console.error("Error creating message template:", error)
    return null
  }

  return data
}

export async function updateMessageTemplate(
  id: string,
  template: Partial<MessageTemplate>,
): Promise<MessageTemplate | null> {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("message_templates").update(template).eq("id", id).select().single()

  if (error) {
    console.error("Error updating message template:", error)
    return null
  }

  return data
}

export async function deleteMessageTemplate(id: string): Promise<boolean> {
  const supabase = getSupabaseBrowserClient()

  const { error } = await supabase.from("message_templates").delete().eq("id", id)

  if (error) {
    console.error("Error deleting message template:", error)
    return false
  }

  return true
}
