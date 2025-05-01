"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { LeadFilter } from "@/types/lead"

interface ActiveFiltersProps {
  filters: LeadFilter
  onFilterChange: (key: keyof LeadFilter, value: string | undefined) => void
  onClearFilters: () => void
}

export function ActiveFilters({ filters, onFilterChange, onClearFilters }: ActiveFiltersProps) {
  const activeFilterCount = Object.keys(filters).length

  if (activeFilterCount === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filters.status && (
        <Badge variant="outline" className="flex items-center gap-1">
          Status: {filters.status}
          <X className="h-3 w-3 cursor-pointer" onClick={() => onFilterChange("status", undefined)} />
        </Badge>
      )}
      {filters.grade && (
        <Badge variant="outline" className="flex items-center gap-1">
          Grade: {filters.grade}
          <X className="h-3 w-3 cursor-pointer" onClick={() => onFilterChange("grade", undefined)} />
        </Badge>
      )}
      {filters.industry && (
        <Badge variant="outline" className="flex items-center gap-1">
          Industry: {filters.industry}
          <X className="h-3 w-3 cursor-pointer" onClick={() => onFilterChange("industry", undefined)} />
        </Badge>
      )}
      {filters.lastContactedDays && (
        <Badge variant="outline" className="flex items-center gap-1">
          Last Contacted: {filters.lastContactedDays === "never" ? "Never" : `Last ${filters.lastContactedDays} days`}
          <X className="h-3 w-3 cursor-pointer" onClick={() => onFilterChange("lastContactedDays", undefined)} />
        </Badge>
      )}
      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={onClearFilters}>
          Clear all
        </Button>
      )}
    </div>
  )
}
