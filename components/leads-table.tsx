"use client"

import { useState } from "react"
import { LeadsTableHeader, type SortField, type SortDirection } from "@/components/leads/table/leads-table-header"
import { LeadsTableRow } from "@/components/leads/table/leads-table-row"
import { LeadsTableEmpty } from "@/components/leads/table/leads-table-empty"
import type { Lead, LeadFilter } from "@/types/lead"
import { mockLeads } from "@/data/mock-leads"

interface LeadsTableProps {
  filters?: LeadFilter
}

export function LeadsTable({ filters = {} }: LeadsTableProps) {
  const [leads] = useState<Lead[]>(mockLeads)
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

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

  // Apply sorting
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    let comparison = 0

    switch (sortField) {
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "company":
        comparison = a.company.localeCompare(b.company)
        break
      case "status":
        comparison = a.status.localeCompare(b.status)
        break
      case "grade":
        comparison = a.grade.localeCompare(b.grade)
        break
      case "lastContacted":
        const dateA = a.lastContacted ? new Date(a.lastContacted).getTime() : 0
        const dateB = b.lastContacted ? new Date(b.lastContacted).getTime() : 0
        comparison = dateA - dateB
        break
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  if (sortedLeads.length === 0) {
    return <LeadsTableEmpty hasFilters={Object.keys(filters).length > 0} />
  }

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <LeadsTableHeader sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
        <tbody>
          {sortedLeads.map((lead) => (
            <LeadsTableRow key={lead.id} lead={lead} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
