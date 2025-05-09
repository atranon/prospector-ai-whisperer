import { Button } from "@/components/ui/button"
import { MessageSquare, Calendar, MoreHorizontal } from "lucide-react"
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

interface LeadsTableRowProps {
  lead: Lead
}

export function LeadsTableRow({ lead }: LeadsTableRowProps) {
  return (
    <tr className="border-b">
      <td className="py-3 px-4">
        <div className="flex flex-col">
          <span className="font-medium">{lead.name}</span>
          <span className="text-xs text-muted-foreground">{lead.title}</span>
        </div>
      </td>
      <td className="py-3 px-4">{lead.company}</td>
      <td className="py-3 px-4">{getStatusBadge(lead.status)}</td>
      <td className="py-3 px-4">{getGradeBadge(lead.grade)}</td>
      <td className="py-3 px-4">{lead.lastContacted ? new Date(lead.lastContacted).toLocaleDateString() : "Never"}</td>
      <td className="py-3 px-4 text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon">
            <MessageSquare className="h-4 w-4" />
            <span className="sr-only">Message</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Calendar className="h-4 w-4" />
            <span className="sr-only">Schedule</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
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
      </td>
    </tr>
  )
}
