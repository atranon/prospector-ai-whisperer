export type Profile = {
  id: string
  full_name: string | null
  company: string | null
  created_at: string
  updated_at: string
}

export type Lead = {
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

export type Campaign = {
  id: string
  name: string
  description: string | null
  status: string
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

export type CampaignLead = {
  campaign_id: string
  lead_id: string
  status: string
  created_at: string
}

export type Activity = {
  id: string
  lead_id: string | null
  campaign_id: string | null
  message_id: string | null
  type: string
  description: string | null
  metadata: any
  created_at: string
}

export type ApiKey = {
  id: string
  name: string
  key_type: string
  key_value: string
  status: string
  last_used: string | null
  created_at: string
  updated_at: string
}

export type Integration = {
  id: string
  name: string
  type: string
  config: any
  status: string
  last_synced: string | null
  created_at: string
  updated_at: string
}
