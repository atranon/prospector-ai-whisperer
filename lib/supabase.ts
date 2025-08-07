
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// For demo purposes, we'll use placeholder values
// In a real app, you would set these in your environment variables
const supabaseUrl = "https://your-project.supabase.co"
const supabaseAnonKey = "your-anon-key"

// Client-side Supabase client (singleton pattern)
let clientInstance: ReturnType<typeof createClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (!clientInstance) {
    clientInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return clientInstance
}

// For backward compatibility
export const createAdminClient = () => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}
