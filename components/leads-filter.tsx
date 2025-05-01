"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { FilterPopover } from "@/components/leads/filter/filter-popover"
import { ActiveFilters } from "@/components/leads/filter/active-filters"
import type { LeadFilter } from "@/types/lead"

interface LeadsFilterProps {
  onFilterChange: (filters: LeadFilter) => void
}

export function LeadsFilter({ onFilterChange }: LeadsFilterProps) {
  const [filters, setFilters] = useState<LeadFilter>({})
  const [searchQuery, setSearchQuery] = useState("")

  const handleFilterChange = (key: keyof LeadFilter, value: string | undefined) => {
    const newFilters = { ...filters }

    if (value) {
      newFilters[key] = value
    } else {
      delete newFilters[key]
    }

    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // You could add debounce here for better performance
  }

  const clearFilters = () => {
    setFilters({})
    setSearchQuery("")
    onFilterChange({})
  }

  const activeFilterCount = Object.keys(filters).length

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search leads..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <FilterPopover
          filters={filters}
          onFilterChange={handleFilterChange}
          activeFilterCount={activeFilterCount}
          onClearFilters={clearFilters}
        />
      </div>

      <ActiveFilters filters={filters} onFilterChange={handleFilterChange} onClearFilters={clearFilters} />
    </div>
  )
}
