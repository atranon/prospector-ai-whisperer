import { Button } from "@/components/ui/button"
import { Plus, Upload } from "lucide-react"

interface LeadsTableEmptyProps {
  hasFilters: boolean
}

export function LeadsTableEmpty({ hasFilters }: LeadsTableEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-3 mb-4">
        <Plus className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-1">No leads found</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">
        {hasFilters
          ? "No leads match your current filters. Try adjusting your filters or add new leads."
          : "Add your first lead manually or import leads from a CSV file to get started."}
      </p>
      <div className="flex gap-2">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Import CSV
        </Button>
      </div>
    </div>
  )
}
