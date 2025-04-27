"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

export function AISettings() {
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
            <Select defaultValue="gpt-4o">
              <SelectTrigger id="model">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature</Label>
            <div className="flex items-center space-x-4">
              <Slider id="temperature" defaultValue={[0.7]} max={1} step={0.1} className="flex-1" />
              <span className="w-12 text-center">0.7</span>
            </div>
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
              defaultValue="You are an AI assistant for IT staffing sales. Your goal is to help find qualified IT professionals for companies. Be professional, concise, and personable in your communications."
            />
            <p className="text-xs text-muted-foreground">
              The system prompt provides context and instructions to the AI model.
            </p>
          </div>
        </CardContent>
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
            <Switch id="auto-follow-up" defaultChecked />
          </div>

          <div className="space-y-2">
            <Label htmlFor="follow-up-days">Follow-up Days</Label>
            <Select defaultValue="3">
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
            <Switch id="approval-mode" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="working-hours">Working Hours Only</Label>
              <p className="text-xs text-muted-foreground">Only send messages during business hours (9 AM - 5 PM)</p>
            </div>
            <Switch id="working-hours" defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
