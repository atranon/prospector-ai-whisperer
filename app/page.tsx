import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MessageSquare, Calendar, BarChart3 } from "lucide-react"
import { AgentStatus } from "@/components/agent-status"
import { RecentActivity } from "@/components/recent-activity"
import { LeadsSummary } from "@/components/leads-summary"
import { RunAgentButton } from "@/components/run-agent-button"
import { SeedDatabaseButton } from "@/components/seed-database-button"

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <SeedDatabaseButton />
          <RunAgentButton />
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="agent">Agent Configuration</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">+180 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">624</div>
                <p className="text-xs text-muted-foreground">+42 in the last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Meetings Set</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+8 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.2%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Agent Status</CardTitle>
                <CardDescription>Current status and performance of your AI agent</CardDescription>
              </CardHeader>
              <CardContent>
                <AgentStatus />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Lead Summary</CardTitle>
                <CardDescription>Breakdown of leads by status and quality</CardDescription>
              </CardHeader>
              <CardContent>
                <LeadsSummary />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Next Actions</CardTitle>
                <CardDescription>Upcoming tasks for your agent</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-2">
                    <div className="mt-0.5 rounded-full bg-blue-100 p-1 dark:bg-blue-800">
                      <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-200" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Send 15 initial outreach messages</p>
                      <p className="text-sm text-muted-foreground">Scheduled for today at 2:00 PM</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="mt-0.5 rounded-full bg-yellow-100 p-1 dark:bg-yellow-800">
                      <MessageSquare className="h-4 w-4 text-yellow-600 dark:text-yellow-200" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Follow up with 8 leads</p>
                      <p className="text-sm text-muted-foreground">Scheduled for tomorrow at 10:00 AM</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="mt-0.5 rounded-full bg-green-100 p-1 dark:bg-green-800">
                      <Users className="h-4 w-4 text-green-600 dark:text-green-200" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Find 50 new leads matching ICP</p>
                      <p className="text-sm text-muted-foreground">Scheduled for Wednesday at 9:00 AM</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>Detailed metrics and performance analytics</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Analytics Dashboard</h3>
                <p className="mt-2 text-sm text-muted-foreground">Detailed analytics will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="agent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Configuration</CardTitle>
              <CardDescription>Configure your AI agent's behavior and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Agent Status</h3>
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span>Active</span>
                    <div className="flex-1"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Ideal Customer Profile</h3>
                  <Card>
                    <CardContent className="p-4">
                      <ul className="space-y-2">
                        <li className="flex items-center justify-between">
                          <span className="text-sm font-medium">Industries</span>
                          <span className="text-sm">Technology, Finance, Healthcare</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-sm font-medium">Company Size</span>
                          <span className="text-sm">100-1000 employees</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-sm font-medium">Titles</span>
                          <span className="text-sm">CTO, VP Engineering, IT Director</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-sm font-medium">Technologies</span>
                          <span className="text-sm">React, Node.js, AWS</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Message Templates</h3>
                  <Card>
                    <CardContent className="p-4">
                      <ul className="space-y-2">
                        <li className="flex items-center justify-between">
                          <span className="text-sm font-medium">Initial Outreach</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-sm font-medium">Follow-up #1</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span className="text-sm font-medium">Follow-up #2</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
