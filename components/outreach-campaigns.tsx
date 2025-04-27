"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, Settings, BarChart3, Calendar, Users, MessageSquare } from "lucide-react"

export function OutreachCampaigns() {
  const campaigns = [
    {
      id: 1,
      name: "Q2 IT Directors Campaign",
      description: "Targeting IT Directors in Finance sector",
      status: "active",
      progress: 65,
      stats: {
        leads: 120,
        sent: 78,
        responses: 14,
        meetings: 5,
      },
      startDate: "Apr 15, 2023",
      endDate: "Jun 30, 2023",
    },
    {
      id: 2,
      name: "CTOs in Healthcare",
      description: "Outreach to CTOs in Healthcare companies",
      status: "paused",
      progress: 32,
      stats: {
        leads: 85,
        sent: 27,
        responses: 6,
        meetings: 2,
      },
      startDate: "May 1, 2023",
      endDate: "Jul 15, 2023",
    },
    {
      id: 3,
      name: "Tech Leads Follow-up",
      description: "Follow-up campaign for previous contacts",
      status: "scheduled",
      progress: 0,
      stats: {
        leads: 50,
        sent: 0,
        responses: 0,
        meetings: 0,
      },
      startDate: "Jun 1, 2023",
      endDate: "Jul 31, 2023",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
            Active
          </Badge>
        )
      case "paused":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-300">
            Paused
          </Badge>
        )
      case "scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300">
            Scheduled
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300">
            Completed
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{campaign.name}</CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>
                </div>
                {getStatusBadge(campaign.status)}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{campaign.progress}%</span>
                  </div>
                  <Progress value={campaign.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md bg-muted p-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{campaign.stats.leads}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Leads</p>
                  </div>
                  <div className="rounded-md bg-muted p-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{campaign.stats.sent}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Messages Sent</p>
                  </div>
                  <div className="rounded-md bg-muted p-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{campaign.stats.responses}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Responses</p>
                  </div>
                  <div className="rounded-md bg-muted p-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{campaign.stats.meetings}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Meetings</p>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{campaign.startDate}</span>
                  <span>to</span>
                  <span>{campaign.endDate}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="mr-2 h-4 w-4" />
                Analytics
              </Button>
              {campaign.status === "active" ? (
                <Button variant="outline" size="sm">
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </Button>
              ) : campaign.status === "paused" ? (
                <Button variant="outline" size="sm">
                  <Play className="mr-2 h-4 w-4" />
                  Resume
                </Button>
              ) : (
                <Button variant="outline" size="sm">
                  <Play className="mr-2 h-4 w-4" />
                  Start
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
