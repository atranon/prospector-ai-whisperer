
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentConfigForm } from "@/components/agent/AgentConfigForm";
import { AgentMetrics } from "@/components/agent/AgentMetrics";
import { AgentLogs } from "@/components/agent/AgentLogs";
import { AgentIntegrations } from "@/components/agent/AgentIntegrations";

export const AgentTabLayout = () => (
  <Tabs defaultValue="config" className="w-full">
    <TabsList className="grid w-full grid-cols-4">
      <TabsTrigger value="config">Configuration</TabsTrigger>
      <TabsTrigger value="metrics">Metrics</TabsTrigger>
      <TabsTrigger value="logs">Activity Logs</TabsTrigger>
      <TabsTrigger value="integrations">Integrations</TabsTrigger>
    </TabsList>

    <TabsContent value="config">
      <Card>
        <CardHeader>
          <CardTitle>Agent Configuration</CardTitle>
          <CardDescription>
            Customize your agent's settings and behavior for technical staffing and sales outreach
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AgentConfigForm />
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="metrics">
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>
            Monitor your agent's performance and engagement statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AgentMetrics />
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="logs">
      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
          <CardDescription>
            Review your agent's recent activities and interactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AgentLogs />
        </CardContent>
      </Card>
    </TabsContent>

    <TabsContent value="integrations">
      <Card>
        <CardHeader>
          <CardTitle>Platform Integrations</CardTitle>
          <CardDescription>
            Connect your agent to various platforms and services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AgentIntegrations />
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
);
