import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, Settings, BarChart3, Calendar, Users, MessageSquare } from "lucide-react"

export interface Campaign {
  id: number
  name: string
  description: string
  status: "active" | "paused" | "scheduled" | "completed"
  progress: number
  stats: {
    leads: number
    sent: number
    responses: number
    meetings: number
  }
  startDate: string
  endDate: string
}

interface CampaignCardProps {
  campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
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
    <Card key={campaign.id}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium">{campaign.name}</h3>
            <p className="text-sm text-muted-foreground">{campaign.description}</p>
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
  )
}
