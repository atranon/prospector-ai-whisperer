interface LeadsGridEmptyProps {
  hasFilters: boolean
}

export function LeadsGridEmpty({ hasFilters }: LeadsGridEmptyProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
      <h3 className="text-lg font-medium mb-1">No leads found</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">
        {hasFilters
          ? "No leads match your current filters. Try adjusting your filters or add new leads."
          : "Add your first lead manually or import leads from a CSV file to get started."}
      </p>
    </div>
  )
}
