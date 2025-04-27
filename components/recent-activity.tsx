"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MessageSquare, Calendar, ThumbsUp } from "lucide-react"
import { useAppContext } from "@/contexts/app-context"
import { Skeleton } from "@/components/ui/skeleton"

export function RecentActivity() {
  const { recentActivities, isLoading } = useAppContext()

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "message_sent":
        return {
          icon: <MessageSquare className="h-4 w-4" />,
          iconBg: "bg-blue-100 dark:bg-blue-800",
          iconColor: "text-blue-600 dark:text-blue-200",
        }
      case "lead_found":
        return {
          icon: <Users className="h-4 w-4" />,
          iconBg: "bg-green-100 dark:bg-green-800",
          iconColor: "text-green-600 dark:text-green-200",
        }
      case "meeting_scheduled":
        return {
          icon: <Calendar className="h-4 w-4" />,
          iconBg: "bg-purple-100 dark:bg-purple-800",
          iconColor: "text-purple-600 dark:text-purple-200",
        }
      case "response_received":
        return {
          icon: <ThumbsUp className="h-4 w-4" />,
          iconBg: "bg-amber-100 dark:bg-amber-800",
          iconColor: "text-amber-600 dark:text-amber-200",
        }
      default:
        return {
          icon: <MessageSquare className="h-4 w-4" />,
          iconBg: "bg-gray-100 dark:bg-gray-800",
          iconColor: "text-gray-600 dark:text-gray-200",
        }
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-start space-x-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (recentActivities.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No recent activities found.</div>
  }

  return (
    <div className="space-y-4">
      {recentActivities.map((activity) => {
        const { icon, iconBg, iconColor } = getActivityIcon(activity.type)
        const initials =
          activity.description
            ?.split(" ")
            .slice(0, 2)
            .map((word) => word[0])
            .join("") || "AP"

        return (
          <div key={activity.id} className="flex items-start space-x-4">
            <div className={`mt-0.5 rounded-full p-1 ${iconBg}`}>
              <div className={iconColor}>{icon}</div>
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">{activity.description}</p>
                <span className="text-xs text-muted-foreground">{getTimeAgo(activity.created_at)}</span>
              </div>
              <p className="text-sm text-muted-foreground">{activity.metadata?.details || ""}</p>
            </div>
            <div className="ml-auto">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.metadata?.avatar || undefined} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        )
      })}
    </div>
  )
}
