
import { Sidebar } from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { AgentOverview } from "@/components/agent/AgentOverview";
import { AgentConfigForm } from "@/components/agent/AgentConfigForm";
import { AgentActions } from "@/components/agent/AgentActions";
import { AgentMetrics } from "@/components/agent/AgentMetrics";
import { AgentTasks } from "@/components/agent/AgentTasks";
import { AgentLogs } from "@/components/agent/AgentLogs";
import { AgentIntegrations } from "@/components/agent/AgentIntegrations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AgentPage = () => {
  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:block w-64">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Agent Management</h1>
              <p className="text-muted-foreground">Configure and monitor your outreach super agent</p>
            </div>
            <Badge className="bg-green-600">Active</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 space-y-6">
              <AgentOverview />
              <AgentActions />
              <AgentTasks />
            </div>
            
            <div className="col-span-1 md:col-span-2 space-y-6">
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AgentPage;
