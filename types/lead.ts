export type Lead = {
  id: number
  name: string
  title: string
  company: string
  email: string
  status: string
  grade: string
  industry?: string
  lastContacted?: string
  lastActivity?: string
  avatar?: {
    name: string
    image: string | null
  }
}

export type LeadFilter = {
  status?: string
  grade?: string
  industry?: string
  lastContactedDays?: string
}

export type SortField = "name" | "company" | "status" | "grade" | "lastContacted"
export type SortDirection = "asc" | "desc"
