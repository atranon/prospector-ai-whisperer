"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, Calendar, BarChart3, Zap } from "lucide-react"
import { AgentStatus } from "@/components/agent-status"
import { RecentActivity } from "@/components/recent-activity"
import { LeadsSummary } from "@/components/leads-summary"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ProtectedLayout } from "@/components/protected-layout"

export default function Dashboard() {
  return (
    <ProtectedLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button>
              <Zap className="mr-2 h-4 w-4" />
              Run Agent
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Leads" value="1,248" description="+180 from last month" icon={Users} />
          <StatsCard title="Messages Sent" value="624" description="+42 in the last week" icon={MessageSquare} />
          <StatsCard title="Meetings Set" value="24" description="+8 from last month" icon={Calendar} />
          <StatsCard title="Response Rate" value="18.2%" description="+2.1% from last month" icon={BarChart3} />
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
            </CardHeader>
            <CardContent>
              <AgentStatus />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Leads Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <LeadsSummary />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <h3 className="font-medium mb-2">Follow-up Tasks</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You have 12 follow-up tasks scheduled for this week.
                  </p>
                  <Button size="sm">View All Tasks</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  )
}
