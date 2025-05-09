export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          company: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          company?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          company?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          owner_id: string
          name: string
          title: string | null
          company: string
          email: string | null
          phone: string | null
          linkedin_url: string | null
          status: string
          grade: string | null
          fit_score: number | null
          industry: string | null
          notes: string | null
          last_contacted: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          title?: string | null
          company: string
          email?: string | null
          phone?: string | null
          linkedin_url?: string | null
          status?: string
          grade?: string | null
          fit_score?: number | null
          industry?: string | null
          notes?: string | null
          last_contacted?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          title?: string | null
          company?: string
          email?: string | null
          phone?: string | null
          linkedin_url?: string | null
          status?: string
          grade?: string | null
          fit_score?: number | null
          industry?: string | null
          notes?: string | null
          last_contacted?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          name: string
          description: string | null
          status: string
          start_date: string | null
          end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          status?: string
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          status?: string
          start_date?: string | null
          end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      campaign_leads: {
        Row: {
          campaign_id: string
          lead_id: string
          status: string
          created_at: string
        }
        Insert: {
          campaign_id: string
          lead_id: string
          status?: string
          created_at?: string
        }
        Update: {
          campaign_id?: string
          lead_id?: string
          status?: string
          created_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          lead_id: string | null
          campaign_id: string | null
          message_id: string | null
          type: string
          description: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          lead_id?: string | null
          campaign_id?: string | null
          message_id?: string | null
          type: string
          description?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          lead_id?: string | null
          campaign_id?: string | null
          message_id?: string | null
          type?: string
          description?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          name: string
          key_type: string
          key_value: string
          status: string
          last_used: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          key_type: string
          key_value: string
          status?: string
          last_used?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          key_type?: string
          key_value?: string
          status?: string
          last_used?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      integrations: {
        Row: {
          id: string
          name: string
          type: string
          config: Json
          status: string
          last_synced: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          config: Json
          status?: string
          last_synced?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          config?: Json
          status?: string
          last_synced?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
