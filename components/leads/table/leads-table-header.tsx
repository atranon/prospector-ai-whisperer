"use client"

import { ChevronDown, ChevronUp } from "lucide-react"

export type SortField = "name" | "company" | "status" | "grade" | "lastContacted"
export type SortDirection = "asc" | "desc"

interface LeadsTableHeaderProps {
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
}

export function LeadsTableHeader({ sortField, sortDirection, onSort }: LeadsTableHeaderProps) {
  const getSortIcon = (field: SortField) => {
    if (field !== sortField) return null
    return sortDirection === "asc" ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
  }

  return (
    <thead>
      <tr className="border-b bg-muted/50">
        <th className="py-3 px-4 text-left text-sm font-medium cursor-pointer" onClick={() => onSort("name")}>
          <div className="flex items-center">
            Name
            {getSortIcon("name")}
          </div>
        </th>
        <th className="py-3 px-4 text-left text-sm font-medium cursor-pointer" onClick={() => onSort("company")}>
          <div className="flex items-center">
            Company
            {getSortIcon("company")}
          </div>
        </th>
        <th className="py-3 px-4 text-left text-sm font-medium cursor-pointer" onClick={() => onSort("status")}>
          <div className="flex items-center">
            Status
            {getSortIcon("status")}
          </div>
        </th>
        <th className="py-3 px-4 text-left text-sm font-medium cursor-pointer" onClick={() => onSort("grade")}>
          <div className="flex items-center">
            Grade
            {getSortIcon("grade")}
          </div>
        </th>
        <th className="py-3 px-4 text-left text-sm font-medium cursor-pointer" onClick={() => onSort("lastContacted")}>
          <div className="flex items-center">
            Last Contacted
            {getSortIcon("lastContacted")}
          </div>
        </th>
        <th className="py-3 px-4 text-right text-sm font-medium">Actions</th>
      </tr>
    </thead>
  )
}
