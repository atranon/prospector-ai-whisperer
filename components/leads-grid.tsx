"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, MessageSquare, Calendar, Building, Mail } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LeadsGrid() {
  const leads = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "CTO",
      company: "TechSolutions Inc.",
      email: "sarah.johnson@techsolutions.com",
      status: "new",
      grade: "A",
      lastActivity: "2 days ago",
      avatar: {
        name: "SJ",
        image: null,
      },
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "VP Engineering",
      company: "InnovateTech",
      email: "michael.chen@innovatetech.com",
      status: "contacted",
      grade: "A",
      lastActivity: "1 day ago",
      avatar: {
        name: "MC",
        image: null,
      },
    },
    {
      id: 3,
      name: "David Wilson",
      title: "IT Director",
      company: "GlobalCorp",
      email: "david.wilson@globalcorp.com",
      status: "responded",
      grade: "B",
      lastActivity: "5 hours ago",
      avatar: {
        name: "DW",
        image: null,
      },
    },
    {
      id: 4,
      name: "Alex Rivera",
      title: "VP Engineering",
      company: "FutureTech",
      email: "alex.rivera@futuretech.com",
      status: "meeting_set",
      grade: "A",
      lastActivity: "3 hours ago",
      avatar: {
        name: "AR",
        image: null,
      },
    },
    {
      id: 5,
      name: "Jessica Lee",
      title: "CIO",
      company: "DataDrive Systems",
      email: "jessica.lee@datadrive.com",
      status: "not_interested",
      grade: "C",
      lastActivity: "1 week ago",
      avatar: {
        name: "JL",
        image: null,
      },
    },
    {
      id: 6,
      name: "Robert Kim",
      title: "Head of IT",
      company: "Quantum Innovations",
      email: "robert.kim@quantum.com",
      status: "new",
      grade: "B",
      lastActivity: "3 days ago",
      avatar: {
        name: "RK",
        image: null,
      },
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="outline">New</Badge>
      case "contacted":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
          >
            Contacted
          </Badge>
        )
      case "responded":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
          >
            Responded
          </Badge>
        )
      case "meeting_set":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
          >
            Meeting Set
          </Badge>
        )
      case "not_interested":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
          >
            Not Interested
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case "A":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
            {grade}
          </Badge>
        )
      case "B":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300">
            {grade}
          </Badge>
        )
      case "C":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-300">
            {grade}
          </Badge>
        )
      default:
        return <Badge>{grade}</Badge>
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {leads.map((lead) => (
        <Card key={lead.id}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={lead.avatar.image || undefined} />
                  <AvatarFallback>{lead.avatar.name}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{lead.name}</h3>
                  <p className="text-sm text-muted-foreground">{lead.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {getGradeBadge(lead.grade)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Change Status</DropdownMenuItem>
                    <DropdownMenuItem>Update Grade</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 dark:text-red-400">Delete Lead</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{lead.company}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs">{lead.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>{getStatusBadge(lead.status)}</div>
                <div className="text-xs text-muted-foreground">Last activity: {lead.lastActivity}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <div className="flex w-full justify-between">
              <Button variant="outline" size="sm" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>
              <Button variant="outline" size="sm" className="ml-2 w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
