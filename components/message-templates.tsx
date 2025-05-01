"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Copy, Trash2, Plus } from "lucide-react"

export function MessageTemplates() {
  const [templates, setTemplates] = useState<any[]>([])

  return (
    <div className="space-y-4">
      {templates.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </div>
                  <Badge variant="outline">{template.type === "linkedin" ? "LinkedIn" : "Email"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="rounded-md bg-muted p-3">
                  <p className="text-sm whitespace-pre-line">{template.content}</p>
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
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Plus className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No templates yet</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            Create your first message template to start personalizing your outreach.
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </div>
      )}
    </div>
  )
}
