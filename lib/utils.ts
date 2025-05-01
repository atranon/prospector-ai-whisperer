import { Badge } from "@/components/ui/badge"

export function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(" ")
}

export function getStatusBadge(status: string) {
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

export function getGradeBadge(grade: string) {
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
