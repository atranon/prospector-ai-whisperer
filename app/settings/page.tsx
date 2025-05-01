"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, Key } from "lucide-react"
import { AISettings } from "@/components/ai-settings"
import { APISettings } from "@/components/api-settings"
import { ProtectedLayout } from "@/components/protected-layout"

export default function SettingsPage() {
  return (
    <ProtectedLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        </div>

        <Tabs defaultValue="ai" className="space-y-4">
          <TabsList>
            <TabsTrigger value="ai">
              <Bot className="mr-2 h-4 w-4" />
              AI Configuration
            </TabsTrigger>
            <TabsTrigger value="api">
              <Key className="mr-2 h-4 w-4" />
              API Keys
            </TabsTrigger>
          </TabsList>
          <TabsContent value="ai" className="space-y-4">
            <AISettings />
          </TabsContent>
          <TabsContent value="api" className="space-y-4">
            <APISettings />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedLayout>
  )
}
