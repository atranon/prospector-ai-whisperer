"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Linkedin, Mail, Database, Calendar, Plus, ExternalLink, Check, X } from "lucide-react"

export function IntegrationSettings() {
  const integrations = [
    {
      id: 1,
      name: "LinkedIn",
      description: "Connect to LinkedIn for profile data and messaging",
      icon: <Linkedin className="h-6 w-6" />,
      status: "connected",
      lastSynced: "2 hours ago",
    },
    {
      id: 2,
      name: "Email (SMTP)",
      description: "Send emails via your SMTP server",
      icon: <Mail className="h-6 w-6" />,
      status: "connected",
      lastSynced: "1 day ago",
    },
    {
      id: 3,
      name: "Clay",
      description: "Import leads and data from Clay",
      icon: <Database className="h-6 w-6" />,
      status: "not_connected",
      lastSynced: null,
    },
    {
      id: 4,
      name: "Google Calendar",
      description: "Schedule and manage meetings",
      icon: <Calendar className="h-6 w-6" />,
      status: "connected",
      lastSynced: "3 hours ago",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Connected Services</h3>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Integration
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-muted p-2">{integration.icon}</div>
                  <div>
                    <CardTitle>{integration.name}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </div>
                {integration.status === "connected" ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
                    <Check className="mr-1 h-3 w-3" />
                    Connected
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
                  >
                    <X className="mr-1 h-3 w-3" />
                    Not Connected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              {integration.status === "connected" && (
                <p className="text-sm text-muted-foreground">Last synced: {integration.lastSynced}</p>
              )}
            </CardContent>
            <CardFooter className="pt-2">
              {integration.status === "connected" ? (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500">
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button size="sm">
                  Connect
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
