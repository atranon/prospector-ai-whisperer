"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Bot, Key } from "lucide-react"
import { IntegrationSettings } from "@/components/integration-settings"
import { ProtectedLayout } from "@/components/protected-layout"

export default function IntegrationsPage() {
  return (
    <ProtectedLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Integrations</h2>
          <div className="flex items-center space-x-2">
            <Button>Save Changes</Button>
          </div>
        </div>

        <Tabs defaultValue="services" className="space-y-4">
          <TabsList>
            <TabsTrigger value="services">
              <Database className="mr-2 h-4 w-4" />
              Connected Services
            </TabsTrigger>
            <TabsTrigger value="api">
              <Key className="mr-2 h-4 w-4" />
              API Keys
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Bot className="mr-2 h-4 w-4" />
              AI Services
            </TabsTrigger>
          </TabsList>
          <TabsContent value="services" className="space-y-4">
            <IntegrationSettings />
          </TabsContent>
          <TabsContent value="api" className="space-y-4">
            {/* API Keys content will go here */}
          </TabsContent>
          <TabsContent value="ai" className="space-y-4">
            {/* AI Services content will go here */}
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedLayout>
  )
}
