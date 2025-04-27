"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Database } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAppContext } from "@/contexts/app-context"

export function SeedDatabaseButton() {
  const [isSeeding, setIsSeeding] = useState(false)
  const { toast } = useToast()
  const { refreshData } = useAppContext()

  const handleSeedDatabase = async () => {
    setIsSeeding(true)

    try {
      const response = await fetch("/api/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Database seeded",
          description: "Sample data has been added to your database.",
        })

        // Refresh data to show the latest changes
        refreshData()
      } else {
        toast({
          title: "Seeding failed",
          description: data.error || "An unknown error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error seeding database:", error)
      toast({
        title: "Error",
        description: "Failed to seed the database. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <Button onClick={handleSeedDatabase} disabled={isSeeding} variant="outline">
      <Database className="mr-2 h-4 w-4" />
      {isSeeding ? "Seeding..." : "Seed Database"}
    </Button>
  )
}
