"use client"

import { useState } from "react"
import { LeadsGridCard } from "@/components/leads/grid/leads-grid-card"
import { LeadsGridEmpty } from "@/components/leads/grid/leads-grid-empty"
import type { Lead, LeadFilter } from "@/types/lead"
import { mockLeads } from "@/data/mock-leads"

interface LeadsGridProps {
  filters?: LeadFilter
}

export function LeadsGrid({ filters = {} }: LeadsGridProps) {
  const [leads] = useState<Lead[]>(mockLeads)

  // Apply filters
  const filteredLeads = leads.filter((lead) => {
    // Apply status filter
    if (filters.status && lead.status !== filters.status) {
      return false
    }

    // Apply grade filter
    if (filters.grade && lead.grade !== filters.grade) {
      return false
    }

    // Apply industry filter
    if (filters.industry && lead.industry !== filters.industry) {
      return false
    }

    // Apply last contacted filter
    if (filters.lastContactedDays) {
      if (filters.lastContactedDays === "never" && lead.lastContacted) {
        return false
      } else if (filters.lastContactedDays !== "never" && lead.lastContacted) {
        const days = Number.parseInt(filters.lastContactedDays)
        const lastContactedDate = new Date(lead.lastContacted)
        const daysAgo = Math.floor((Date.now() - lastContactedDate.getTime()) / (1000 * 60 * 60 * 24))
        if (daysAgo > days) {
          return false
        }
      }
    }

    return true
  })

  if (filteredLeads.length === 0) {
    return <LeadsGridEmpty hasFilters={Object.keys(filters).length > 0} />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredLeads.map((lead) => (
        <LeadsGridCard key={lead.id} lead={lead} />
      ))}
    </div>
  )
}
