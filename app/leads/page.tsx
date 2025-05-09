"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { LeadsTable } from "@/components/leads-table"
import { LeadsGrid } from "@/components/leads-grid"
import { LeadsFilter } from "@/components/leads-filter"
import { LeadsViewToggle } from "@/components/leads-view-toggle"
import { ImportLeadsDialog } from "@/components/leads/import-export/import-leads-dialog"
import { ExportLeadsDialog } from "@/components/leads/import-export/export-leads-dialog"
import { ProtectedLayout } from "@/components/protected-layout"
import type { LeadFilter } from "@/types/lead"

export default function LeadsPage() {
  const [view, setView] = useState<"table" | "grid">("table")
  const [filters, setFilters] = useState<LeadFilter>({})

  const handleFilterChange = (newFilters: LeadFilter) => {
    setFilters(newFilters)
  }

  return (
    <ProtectedLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
          <div className="flex items-center space-x-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
            <ImportLeadsDialog />
            <ExportLeadsDialog />
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Your Leads</CardTitle>
            <LeadsViewToggle view={view} onViewChange={setView} />
          </CardHeader>
          <CardContent className="space-y-4">
            <LeadsFilter onFilterChange={handleFilterChange} />
            {view === "table" ? <LeadsTable filters={filters} /> : <LeadsGrid filters={filters} />}
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  )
}
