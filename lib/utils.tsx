
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Badge } from "@/components/ui/badge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Status badge utility function
export function getStatusBadge(status: string) {
  switch (status) {
    case "new":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300">New</Badge>
    case "contacted":
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-300">Contacted</Badge>
    case "responded":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">Responded</Badge>
    case "meeting_set":
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-300">Meeting Set</Badge>
    case "not_interested":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300">Not Interested</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300">{status}</Badge>
  }
}

// Grade badge utility function
export function getGradeBadge(grade: string) {
  switch (grade) {
    case "A":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">{grade}</Badge>
    case "B":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300">{grade}</Badge>
    case "C":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300">{grade}</Badge>
    case "D":
      return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900 dark:text-orange-300">{grade}</Badge>
    case "F":
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-300">{grade}</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300">{grade}</Badge>
  }
}
