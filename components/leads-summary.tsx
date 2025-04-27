"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useAppContext } from "@/contexts/app-context"
import { Skeleton } from "@/components/ui/skeleton"

export function LeadsSummary() {
  const { leads, isLoading } = useAppContext()

  // Count leads by status
  const leadsByStatus = {
    new: leads.filter((lead) => lead.status === "new").length,
    contacted: leads.filter((lead) => lead.status === "contacted").length,
    responded: leads.filter((lead) => lead.status === "responded").length,
    meeting_set: leads.filter((lead) => lead.status === "meeting_set").length,
    not_interested: leads.filter((lead) => lead.status === "not_interested").length,
  }

  // Count leads by grade
  const leadsByGrade = {
    A: leads.filter((lead) => lead.grade === "A").length,
    B: leads.filter((lead) => lead.grade === "B").length,
    C: leads.filter((lead) => lead.grade === "C").length,
  }

  // Calculate total leads
  const totalLeads = leads.length

  // Calculate percentages
  const getPercentage = (count: number) => {
    return totalLeads > 0 ? (count / totalLeads) * 100 : 0
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-2 w-full" />
        </div>
      </div>
    )
  }

  return (
    <Tabs defaultValue="status">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="status">By Status</TabsTrigger>
        <TabsTrigger value="quality">By Quality</TabsTrigger>
      </TabsList>
      <TabsContent value="status" className="space-y-4 pt-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>New</span>
            <span className="font-medium">{leadsByStatus.new}</span>
          </div>
          <Progress value={getPercentage(leadsByStatus.new)} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Contacted</span>
            <span className="font-medium">{leadsByStatus.contacted}</span>
          </div>
          <Progress value={getPercentage(leadsByStatus.contacted)} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Responded</span>
            <span className="font-medium">{leadsByStatus.responded}</span>
          </div>
          <Progress value={getPercentage(leadsByStatus.responded)} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Meeting Set</span>
            <span className="font-medium">{leadsByStatus.meeting_set}</span>
          </div>
          <Progress value={getPercentage(leadsByStatus.meeting_set)} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Not Interested</span>
            <span className="font-medium">{leadsByStatus.not_interested}</span>
          </div>
          <Progress value={getPercentage(leadsByStatus.not_interested)} className="h-2" />
        </div>
      </TabsContent>
      <TabsContent value="quality" className="space-y-4 pt-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>A Grade</span>
            <span className="font-medium">{leadsByGrade.A}</span>
          </div>
          <Progress value={getPercentage(leadsByGrade.A)} className="h-2 bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>B Grade</span>
            <span className="font-medium">{leadsByGrade.B}</span>
          </div>
          <Progress value={getPercentage(leadsByGrade.B)} className="h-2 bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>C Grade</span>
            <span className="font-medium">{leadsByGrade.C}</span>
          </div>
          <Progress value={getPercentage(leadsByGrade.C)} className="h-2 bg-muted" />
        </div>
      </TabsContent>
    </Tabs>
  )
}
