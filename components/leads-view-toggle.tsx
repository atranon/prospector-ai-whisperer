"use client"

import { Button } from "@/components/ui/button"
import { LayoutGrid, LayoutList } from "lucide-react"

interface LeadsViewToggleProps {
  view: "table" | "grid"
  onViewChange: (view: "table" | "grid") => void
}

export function LeadsViewToggle({ view, onViewChange }: LeadsViewToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={view === "table" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewChange("table")}
        className="h-8 w-8 p-0"
      >
        <LayoutList className="h-4 w-4" />
        <span className="sr-only">Table view</span>
      </Button>
      <Button
        variant={view === "grid" ? "default" : "outline"}
        size="sm"
        onClick={() => onViewChange("grid")}
        className="h-8 w-8 p-0"
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="sr-only">Grid view</span>
      </Button>
    </div>
  )
}
