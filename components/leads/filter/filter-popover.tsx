"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Filter } from "lucide-react"
import type { LeadFilter } from "@/types/lead"

interface FilterPopoverProps {
  filters: LeadFilter
  onFilterChange: (key: keyof LeadFilter, value: string | undefined) => void
  activeFilterCount: number
  onClearFilters: () => void
}

export function FilterPopover({ filters, onFilterChange, activeFilterCount, onClearFilters }: FilterPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex gap-2">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 rounded-full px-1 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filters</h4>
            <p className="text-sm text-muted-foreground">Filter leads by various criteria</p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-sm font-medium col-span-1">
                Status
              </label>
              <Select value={filters.status} onValueChange={(value) => onFilterChange("status", value)}>
                <SelectTrigger id="status" className="col-span-3">
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="meeting_set">Meeting Set</SelectItem>
                  <SelectItem value="not_interested">Not Interested</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="grade" className="text-sm font-medium col-span-1">
                Grade
              </label>
              <Select value={filters.grade} onValueChange={(value) => onFilterChange("grade", value)}>
                <SelectTrigger id="grade" className="col-span-3">
                  <SelectValue placeholder="Any grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A Grade</SelectItem>
                  <SelectItem value="B">B Grade</SelectItem>
                  <SelectItem value="C">C Grade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="industry" className="text-sm font-medium col-span-1">
                Industry
              </label>
              <Select value={filters.industry} onValueChange={(value) => onFilterChange("industry", value)}>
                <SelectTrigger id="industry" className="col-span-3">
                  <SelectValue placeholder="Any industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="lastContacted" className="text-sm font-medium col-span-1">
                Last Contacted
              </label>
              <Select
                value={filters.lastContactedDays}
                onValueChange={(value) => onFilterChange("lastContactedDays", value)}
              >
                <SelectTrigger id="lastContacted" className="col-span-3">
                  <SelectValue placeholder="Any time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="never">Never contacted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              Clear Filters
            </Button>
            <Button size="sm">Apply Filters</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
