import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
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
import type { Lead } from "@/types/lead"
import { getStatusBadge, getGradeBadge } from "@/lib/utils"

interface LeadsGridCardProps {
  lead: Lead
}

export function LeadsGridCard({ lead }: LeadsGridCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={lead.avatar?.image || undefined} />
              <AvatarFallback>{lead.avatar?.name}</AvatarFallback>
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
  )
}
