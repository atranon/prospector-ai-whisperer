"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageTemplates } from "@/components/message-templates"
import { OutreachCampaigns } from "@/components/outreach-campaigns"
import { OutreachAnalytics } from "@/components/outreach-analytics"
import { CampaignWizard } from "@/components/outreach/campaign-wizard/campaign-wizard"
import { ProtectedLayout } from "@/components/protected-layout"

export default function OutreachPage() {
  return (
    <ProtectedLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Outreach</h2>
          <div className="flex items-center space-x-2">
            <CampaignWizard />
          </div>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-4">
          <TabsList>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="campaigns" className="space-y-4">
            <OutreachCampaigns />
          </TabsContent>
          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Message Templates</CardTitle>
                <CardDescription>Create and manage your outreach message templates</CardDescription>
              </CardHeader>
              <CardContent>
                <MessageTemplates />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <OutreachAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedLayout>
  )
}
