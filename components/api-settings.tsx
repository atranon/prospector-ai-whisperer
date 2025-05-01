"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Save } from "lucide-react"

export function APISettings() {
  const [showOpenAI, setShowOpenAI] = useState(false)
  const [apiKeys, setApiKeys] = useState({
    openai: "",
  })

  const handleChange = (key: string, value: string) => {
    setApiKeys((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    // In a real app, this would save to Supabase securely
    console.log("Saving API keys:", apiKeys)
    alert("API keys saved!")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>OpenAI API Key</CardTitle>
          <CardDescription>
            Required for AI text generation. Get your API key from the{" "}
            <a
              href="https://platform.openai.com/account/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              OpenAI dashboard
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="openai-key">API Key</Label>
            <div className="flex">
              <div className="relative flex-1">
                <Input
                  id="openai-key"
                  type={showOpenAI ? "text" : "password"}
                  placeholder="sk-..."
                  value={apiKeys.openai}
                  onChange={(e) => handleChange("openai", e.target.value)}
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setShowOpenAI(!showOpenAI)}
                >
                  {showOpenAI ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showOpenAI ? "Hide" : "Show"} API Key</span>
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Your API key is stored securely and never shared with third parties.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save API Key
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cost Management</CardTitle>
          <CardDescription>Tips for managing your OpenAI API costs</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Use GPT-3.5 Turbo for most tasks (much cheaper than GPT-4)</li>
            <li>Set a maximum daily message limit in Agent Settings</li>
            <li>Use shorter, more focused prompts to reduce token usage</li>
            <li>Monitor your usage in the OpenAI dashboard regularly</li>
            <li>Set up usage limits in your OpenAI account settings</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
