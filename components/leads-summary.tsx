"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export function LeadsSummary() {
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
            <span className="font-medium">512</span>
          </div>
          <Progress value={41} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Contacted</span>
            <span className="font-medium">384</span>
          </div>
          <Progress value={31} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Responded</span>
            <span className="font-medium">192</span>
          </div>
          <Progress value={15} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Meeting Set</span>
            <span className="font-medium">96</span>
          </div>
          <Progress value={8} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Not Interested</span>
            <span className="font-medium">64</span>
          </div>
          <Progress value={5} className="h-2" />
        </div>
      </TabsContent>
      <TabsContent value="quality" className="space-y-4 pt-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>A Grade</span>
            <span className="font-medium">384</span>
          </div>
          <Progress value={31} className="h-2 bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>B Grade</span>
            <span className="font-medium">512</span>
          </div>
          <Progress value={41} className="h-2 bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>C Grade</span>
            <span className="font-medium">352</span>
          </div>
          <Progress value={28} className="h-2 bg-muted" />
        </div>
      </TabsContent>
    </Tabs>
  )
}
