"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, MessageSquare, Calendar, ThumbsUp } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "message_sent",
      icon: <MessageSquare className="h-4 w-4" />,
      iconBg: "bg-blue-100 dark:bg-blue-800",
      iconColor: "text-blue-600 dark:text-blue-200",
      title: "Message sent to Sarah Johnson",
      description: "Initial outreach message sent via LinkedIn",
      time: "10 minutes ago",
      avatar: {
        name: "SJ",
        image: null,
      },
    },
    {
      id: 2,
      type: "lead_found",
      icon: <Users className="h-4 w-4" />,
      iconBg: "bg-green-100 dark:bg-green-800",
      iconColor: "text-green-600 dark:text-green-200",
      title: "New lead discovered",
      description: "Michael Chen, CTO at TechNova - A-grade match",
      time: "25 minutes ago",
      avatar: {
        name: "MC",
        image: null,
      },
    },
    {
      id: 3,
      type: "meeting_scheduled",
      icon: <Calendar className="h-4 w-4" />,
      iconBg: "bg-purple-100 dark:bg-purple-800",
      iconColor: "text-purple-600 dark:text-purple-200",
      title: "Meeting scheduled",
      description: "Demo call with David Wilson, IT Director at GlobalCorp",
      time: "1 hour ago",
      avatar: {
        name: "DW",
        image: null,
      },
    },
    {
      id: 4,
      type: "response_received",
      icon: <ThumbsUp className="h-4 w-4" />,
      iconBg: "bg-amber-100 dark:bg-amber-800",
      iconColor: "text-amber-600 dark:text-amber-200",
      title: "Response received",
      description: "Positive reply from Alex Rivera, VP Engineering",
      time: "2 hours ago",
      avatar: {
        name: "AR",
        image: null,
      },
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-4">
          <div className={`mt-0.5 rounded-full p-1 ${activity.iconBg}`}>
            <div className={activity.iconColor}>{activity.icon}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">{activity.title}</p>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
          </div>
          <div className="ml-auto">
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.avatar.image || undefined} />
              <AvatarFallback>{activity.avatar.name}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      ))}
    </div>
  )
}
