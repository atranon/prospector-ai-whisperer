import { createClient } from "@supabase/supabase-js"
import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

// Client-side Supabase client (singleton pattern)
let clientInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (typeof window === "undefined") {
    throw new Error("getSupabaseClient should only be called in the browser")
  }

  if (!clientInstance) {
    clientInstance = createClientComponentClient<Database>({
      options: {
        autoRefreshToken: true,
        persistSession: true,
      },
    })
  }
  return clientInstance
}

// Server-side Supabase client
export const getServerSupabaseClient = () => {
  if (typeof window !== "undefined") {
    throw new Error("getServerSupabaseClient should only be called on the server")
  }

  try {
    return createServerComponentClient<Database>({ cookies })
  } catch (error) {
    console.error("Error creating server supabase client:", error)
    throw error
  }
}

// Direct client for admin operations
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables for admin client")
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}
