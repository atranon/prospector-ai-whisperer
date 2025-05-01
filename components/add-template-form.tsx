"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

export function AddTemplateForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [template, setTemplate] = useState({
    name: "",
    description: "",
    content: "",
    type: "initial",
    channel: "linkedin",
  })

  const handleChange = (field: string, value: string) => {
    setTemplate((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(template),
      })

      if (!response.ok) {
        throw new Error("Failed to add template")
      }

      const data = await response.json()
      console.log("Template added:", data)

      // Reset form
      setTemplate({
        name: "",
        description: "",
        content: "",
        type: "initial",
        channel: "linkedin",
      })

      // Call success callback
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error adding template:", error)
      alert("Failed to add template. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Message Template</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name *</Label>
            <Input
              id="name"
              placeholder="Initial Outreach"
              value={template.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="First touch message for new leads"
              value={template.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Template Type *</Label>
            <Select value={template.type} onValueChange={(value) => handleChange("type", value)} required>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="initial">Initial Outreach</SelectItem>
                <SelectItem value="follow_up_1">First Follow-up</SelectItem>
                <SelectItem value="follow_up_2">Second Follow-up</SelectItem>
                <SelectItem value="meeting_request">Meeting Request</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel">Channel *</Label>
            <Select value={template.channel} onValueChange={(value) => handleChange("channel", value)} required>
              <SelectTrigger id="channel">
                <SelectValue placeholder="Select channel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Message Content *</Label>
            <Textarea
              id="content"
              placeholder="Hi {{first_name}}, I noticed you're leading the tech team at {{company}}..."
              value={template.content}
              onChange={(e) => handleChange("content", e.target.value)}
              className="min-h-[200px]"
              required
            />
            <p className="text-xs text-muted-foreground">
              Use variables like {{ first_name }}, {{ company }}, etc. for personalization.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Template...
              </>
            ) : (
              "Create Template"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
