
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agent_configs: {
        Row: {
          id: string
          name: string
          description: string | null
          model: string | null
          frequency: Json
          created_at: string
          updated_at: string
          user_id: string
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          model?: string | null
          frequency?: Json
          created_at?: string
          updated_at?: string
          user_id: string
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          model?: string | null
          frequency?: Json
          created_at?: string
          updated_at?: string
          user_id?: string
          is_active?: boolean
        }
      }
      agent_tasks: {
        Row: {
          id: string
          agent_id: string
          task_type: string
          status: string
          description: string | null
          created_at: string
          completed_at: string | null
          result: Json | null
        }
        Insert: {
          id?: string
          agent_id: string
          task_type: string
          status?: string
          description?: string | null
          created_at?: string
          completed_at?: string | null
          result?: Json | null
        }
        Update: {
          id?: string
          agent_id?: string
          task_type?: string
          status?: string
          description?: string | null
          created_at?: string
          completed_at?: string | null
          result?: Json | null
        }
      }
      agent_logs: {
        Row: {
          id: string
          agent_id: string
          level: string
          message: string
          created_at: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          agent_id: string
          level?: string
          message: string
          created_at?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          agent_id?: string
          level?: string
          message?: string
          created_at?: string
          metadata?: Json | null
        }
      }
    }
  }
}
