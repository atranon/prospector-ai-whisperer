
"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface CampaignMessagesProps {
  data: {
    initialTemplate: string
    followUp1Template: string
    followUp2Template: string
  }
  updateData: (data: {
    initialTemplate: string
    followUp1Template: string
    followUp2Template: string
  }) => void
}

export function CampaignMessages({ data, updateData }: CampaignMessagesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const userName = "Your Name" // Replace with actual user name or fetch from context/API

  const handleTemplateSelect = (value: string) => {
    setSelectedTemplate(value)
    // In a real app, you would fetch the template content from your API
    // For now, we'll just use some placeholder content
    if (value === "template1") {
      updateData({
        ...data,
        initialTemplate:
          "Hi {{first_name}},\n\nI noticed you're leading the tech team at {{company}} and thought you might be interested in our IT staffing solutions. We specialize in finding top tech talent for companies in the {{industry}} industry.\n\nWould you be open to a quick chat about your current hiring needs?\n\nBest,\n" +
          userName,
      })
    } else if (value === "template2") {
      updateData({
        ...data,
        initialTemplate:
          "Hello {{first_name}},\n\nI came across your profile and saw that you're the {{title}} at {{company}}. I wanted to reach out because we've helped similar companies in the {{industry}} industry find exceptional IT talent.\n\nDo you have 15 minutes this week to discuss how we might be able to support your team?\n\nRegards,\n" +
          userName,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="template-select">Use Existing Template</Label>
        <Select onValueChange={handleTemplateSelect}>
          <SelectTrigger id="template-select">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="template1">IT Staffing Introduction</SelectItem>
            <SelectItem value="template2">Tech Talent Outreach</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="initial-message">Initial Message</Label>
        <Textarea
          id="initial-message"
          value={data.initialTemplate}
          onChange={(e) => updateData({ ...data, initialTemplate: e.target.value })}
          placeholder="Write your initial outreach message here. Use {{placeholders}} for personalization."
          className="min-h-[150px]"
        />
        <p className="text-xs text-muted-foreground">
          Available placeholders: {`{{first_name}}`}, {`{{last_name}}`}, {`{{company}}`}, {`{{title}}`}, {`{{industry}}`},{" "}
          {`{{user_name}}`}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="follow-up-1">First Follow-up (3 days later)</Label>
        <Textarea
          id="follow-up-1"
          value={data.followUp1Template}
          onChange={(e) => updateData({ ...data, followUp1Template: e.target.value })}
          placeholder="Write your first follow-up message here."
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="follow-up-2">Second Follow-up (7 days later)</Label>
        <Textarea
          id="follow-up-2"
          value={data.followUp2Template}
          onChange={(e) => updateData({ ...data, followUp2Template: e.target.value })}
          placeholder="Write your second follow-up message here."
          className="min-h-[100px]"
        />
      </div>
    </div>
  )
}
