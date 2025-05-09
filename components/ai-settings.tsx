"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"

export function AISettings() {
  const [settings, setSettings] = useState({
    model: "gpt-3.5-turbo",
    temperature: "0.7",
    systemPrompt:
      "You are an AI assistant for IT staffing sales. Your goal is to help find qualified IT professionals for companies. Be professional, concise, and personable in your communications.",
    autoFollowUp: true,
    followUpDays: "3",
    requireApproval: true,
    workingHoursOnly: true,
    maxDailyMessages: "20",
  })

  const handleChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    // In a real app, this would save to Supabase
    console.log("Saving settings:", settings)
    alert("Settings saved!")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Model Settings</CardTitle>
          <CardDescription>Configure the AI models used by your agent</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="model">Primary AI Model</Label>
            <Select value={settings.model} onValueChange={(value) => handleChange("model", value)}>
              <SelectTrigger id="model">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Recommended)</SelectItem>
                <SelectItem value="gpt-4">GPT-4 (Higher cost)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              GPT-3.5 Turbo is recommended for cost efficiency. GPT-4 provides better results but at higher cost.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature</Label>
            <Select value={settings.temperature} onValueChange={(value) => handleChange("temperature", value)}>
              <SelectTrigger id="temperature">
                <SelectValue placeholder="Select temperature" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.3">0.3 - More focused</SelectItem>
                <SelectItem value="0.5">0.5 - Balanced</SelectItem>
                <SelectItem value="0.7">0.7 - Default</SelectItem>
                <SelectItem value="0.9">0.9 - More creative</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Controls randomness: Lower values are more deterministic, higher values are more creative.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="system-prompt">System Prompt</Label>
            <Textarea
              id="system-prompt"
              placeholder="Enter system prompt"
              className="min-h-[100px]"
              value={settings.systemPrompt}
              onChange={(e) => handleChange("systemPrompt", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              The system prompt provides context and instructions to the AI model.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Model Settings</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Agent Behavior</CardTitle>
          <CardDescription>Configure how your AI agent operates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-follow-up">Automatic Follow-ups</Label>
              <p className="text-xs text-muted-foreground">
                Automatically send follow-up messages after a period of no response
              </p>
            </div>
            <Switch
              id="auto-follow-up"
              checked={settings.autoFollowUp}
              onCheckedChange={(checked) => handleChange("autoFollowUp", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="follow-up-days">Follow-up Days</Label>
            <Select value={settings.followUpDays} onValueChange={(value) => handleChange("followUpDays", value)}>
              <SelectTrigger id="follow-up-days">
                <SelectValue placeholder="Select days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 days</SelectItem>
                <SelectItem value="3">3 days</SelectItem>
                <SelectItem value="5">5 days</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="approval-mode">Require Approval</Label>
              <p className="text-xs text-muted-foreground">Require manual approval before sending messages</p>
            </div>
            <Switch
              id="approval-mode"
              checked={settings.requireApproval}
              onCheckedChange={(checked) => handleChange("requireApproval", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="working-hours">Working Hours Only</Label>
              <p className="text-xs text-muted-foreground">Only send messages during business hours (9 AM - 5 PM)</p>
            </div>
            <Switch
              id="working-hours"
              checked={settings.workingHoursOnly}
              onCheckedChange={(checked) => handleChange("workingHoursOnly", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-daily">Maximum Daily Messages</Label>
            <Input
              id="max-daily"
              type="number"
              value={settings.maxDailyMessages}
              onChange={(e) => handleChange("maxDailyMessages", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Limit the number of messages sent per day to avoid rate limits and maintain quality
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Agent Settings</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
