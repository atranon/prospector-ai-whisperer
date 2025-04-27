export type Lead = {
  id: string
  name: string
  title?: string
  company?: string
  email?: string
  phone?: string
  linkedin_url?: string
  status: "new" | "contacted" | "responded" | "meeting_set" | "not_interested"
  grade: "A" | "B" | "C"
  notes?: string
  created_at: string
  updated_at: string
}

export type Campaign = {
  id: string
  name: string
  description?: string
  status: "draft" | "active" | "paused" | "scheduled" | "completed"
  start_date?: string
  end_date?: string
  created_at: string
  updated_at: string
}

export type MessageTemplate = {
  id: string
  name: string
  description?: string
  content: string
  type: "linkedin" | "email"
  variables?: Record<string, any>
  created_at: string
  updated_at: string
}

export type Message = {
  id: string
  lead_id: string
  campaign_id?: string
  template_id?: string
  content: string
  type: "linkedin" | "email"
  status: "draft" | "scheduled" | "sent" | "delivered" | "opened" | "replied"
  scheduled_at?: string
  sent_at?: string
  created_at: string
  updated_at: string
}

export type Activity = {
  id: string
  lead_id?: string
  campaign_id?: string
  message_id?: string
  type: "message_sent" | "lead_found" | "meeting_scheduled" | "response_received"
  description?: string
  metadata?: Record<string, any>
  created_at: string
}

export type ApiKey = {
  id: string
  name: string
  key_type: string
  key_value: string
  status: "active" | "inactive"
  last_used?: string
  created_at: string
  updated_at: string
}

export type Integration = {
  id: string
  name: string
  type: "linkedin" | "email" | "clay" | "calendar"
  config?: Record<string, any>
  status: "connected" | "not_connected"
  last_synced?: string
  created_at: string
  updated_at: string
}

export type Setting = {
  id: string
  name: string
  value: Record<string, any>
  created_at: string
  updated_at: string
}
