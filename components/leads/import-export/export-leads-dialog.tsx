"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Download, Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export function ExportLeadsDialog() {
  const [format, setFormat] = useState("csv")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFields, setSelectedFields] = useState({
    name: true,
    title: true,
    company: true,
    email: true,
    status: true,
    grade: true,
    industry: true,
    lastContacted: true,
    notes: false,
  })

  const handleFieldChange = (field: string, checked: boolean) => {
    setSelectedFields((prev) => ({
      ...prev,
      [field]: checked,
    }))
  }

  const handleExport = async () => {
    setIsLoading(true)

    try {
      // In a real app, you would call your API to export the leads
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate a download
      const link = document.createElement("a")
      link.href = "#"
      link.download = `leads-export-${new Date().toISOString().split("T")[0]}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setIsOpen(false)
    } catch (err) {
      console.error("Failed to export leads", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Leads</DialogTitle>
          <DialogDescription>Choose the format and fields you want to include in your export.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Export Format</Label>
            <RadioGroup defaultValue="csv" value={format} onValueChange={setFormat} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv">CSV</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="xlsx" id="xlsx" />
                <Label htmlFor="xlsx">Excel</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label>Fields to Include</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="name"
                  checked={selectedFields.name}
                  onCheckedChange={(checked) => handleFieldChange("name", !!checked)}
                />
                <Label htmlFor="name">Name</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="title"
                  checked={selectedFields.title}
                  onCheckedChange={(checked) => handleFieldChange("title", !!checked)}
                />
                <Label htmlFor="title">Title</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="company"
                  checked={selectedFields.company}
                  onCheckedChange={(checked) => handleFieldChange("company", !!checked)}
                />
                <Label htmlFor="company">Company</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email"
                  checked={selectedFields.email}
                  onCheckedChange={(checked) => handleFieldChange("email", !!checked)}
                />
                <Label htmlFor="email">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="status"
                  checked={selectedFields.status}
                  onCheckedChange={(checked) => handleFieldChange("status", !!checked)}
                />
                <Label htmlFor="status">Status</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="grade"
                  checked={selectedFields.grade}
                  onCheckedChange={(checked) => handleFieldChange("grade", !!checked)}
                />
                <Label htmlFor="grade">Grade</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="industry"
                  checked={selectedFields.industry}
                  onCheckedChange={(checked) => handleFieldChange("industry", !!checked)}
                />
                <Label htmlFor="industry">Industry</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lastContacted"
                  checked={selectedFields.lastContacted}
                  onCheckedChange={(checked) => handleFieldChange("lastContacted", !!checked)}
                />
                <Label htmlFor="lastContacted">Last Contacted</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notes"
                  checked={selectedFields.notes}
                  onCheckedChange={(checked) => handleFieldChange("notes", !!checked)}
                />
                <Label htmlFor="notes">Notes</Label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              "Export Leads"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
