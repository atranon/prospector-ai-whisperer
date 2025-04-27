"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Copy, Trash2, Plus } from "lucide-react"

export function MessageTemplates() {
  const templates = [
    {
      id: 1,
      name: "Initial Outreach",
      description: "First touch message for new leads",
      content:
        "Hi {{first_name}}, I noticed you're leading the tech team at {{company}}. I help IT leaders find specialized developers for their projects. Would you be open to a quick chat about how we might support your team's initiatives?",
      type: "linkedin",
      variables: ["first_name", "company"],
      lastEdited: "2 days ago",
    },
    {
      id: 2,
      name: "Follow-up #1",
      description: "First follow-up after no response",
      content:
        "Hi {{first_name}}, I wanted to follow up on my previous message. I understand you're busy, but I'd love to share how we've helped companies like {{company}} with their IT staffing needs. Would you have 15 minutes this week?",
      type: "linkedin",
      variables: ["first_name", "company"],
      lastEdited: "1 week ago",
    },
    {
      id: 3,
      name: "Email Introduction",
      description: "Initial email outreach",
      content:
        "Subject: Quick question about {{company}}'s tech initiatives\n\nHi {{first_name}},\n\nI hope this email finds you well. I noticed that {{company}} has been expanding its {{technology}} capabilities, and I wanted to reach out.\n\nWe specialize in providing skilled IT professionals for companies in the {{industry}} space. Would you be open to a brief conversation about how we might support your team's growth?\n\nBest regards,\n{{sender_name}}",
      type: "email",
      variables: ["first_name", "company", "technology", "industry", "sender_name"],
      lastEdited: "3 days ago",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Message Templates</h3>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className={
                    template.type === "linkedin"
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }
                >
                  {template.type === "linkedin" ? "LinkedIn" : "Email"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm whitespace-pre-line">{template.content}</p>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {template.variables.map((variable) => (
                  <Badge key={variable} variant="secondary" className="text-xs">
                    {`{{${variable}}}`}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div className="text-xs text-muted-foreground">Last edited: {template.lastEdited}</div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Duplicate</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
