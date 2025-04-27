"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Copy, Eye, EyeOff, RefreshCw, Plus } from "lucide-react"
import { useState } from "react"

export function APISettings() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({
    openai: false,
    linkedin: false,
    clay: false,
  })

  const toggleShowKey = (key: string) => {
    setShowKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const apiKeys = [
    {
      id: "openai",
      name: "OpenAI API Key",
      description: "Used for AI text generation and analysis",
      value: "sk-••••••••••••••••••••••••••••••",
      status: "active",
      lastUsed: "10 minutes ago",
    },
    {
      id: "linkedin",
      name: "LinkedIn API Key",
      description: "Used for LinkedIn profile data and messaging",
      value: "li-••••••••••••••••••••••••••••••",
      status: "active",
      lastUsed: "1 hour ago",
    },
    {
      id: "clay",
      name: "Clay API Key",
      description: "Used for lead data enrichment",
      value: "clay-••••••••••••••••••••••••••••••",
      status: "inactive",
      lastUsed: "Never",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">API Keys</h3>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add API Key
        </Button>
      </div>

      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <Card key={apiKey.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{apiKey.name}</CardTitle>
                  <CardDescription>{apiKey.description}</CardDescription>
                </div>
                <Badge
                  className={
                    apiKey.status === "active"
                      ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300"
                  }
                >
                  {apiKey.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`key-${apiKey.id}`}>API Key</Label>
                  <div className="flex">
                    <div className="relative flex-1">
                      <Input
                        id={`key-${apiKey.id}`}
                        value={showKeys[apiKey.id] ? "sk-actual-key-would-be-here-1234567890" : apiKey.value}
                        readOnly
                        className="pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => toggleShowKey(apiKey.id)}
                      >
                        {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showKeys[apiKey.id] ? "Hide" : "Show"} API Key</span>
                      </Button>
                    </div>
                    <Button variant="outline" size="icon" className="ml-2">
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy API Key</span>
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Last used: {apiKey.lastUsed}</p>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
                <Button variant="outline" size="sm" className="text-red-500">
                  Revoke
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
