"use client"

import { Progress } from "@/components/ui/progress"
import { Play, Pause, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function AgentStatus() {
  const [isRunning, setIsRunning] = useState(true)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`h-3 w-3 rounded-full ${isRunning ? "bg-green-500" : "bg-amber-500"}`}></div>
          <span className="font-medium">{isRunning ? "Active" : "Paused"}</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Resume
            </>
          )}
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Daily message quota</span>
          <span className="font-medium">24/50</span>
        </div>
        <Progress value={48} className="h-2" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>API usage</span>
          <span className="font-medium">68%</span>
        </div>
        <Progress value={68} className="h-2" />
      </div>

      <div className="rounded-md bg-amber-50 p-3 dark:bg-amber-950">
        <div className="flex items-start space-x-3">
          <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
          <div>
            <h5 className="text-sm font-medium text-amber-800 dark:text-amber-300">Attention Required</h5>
            <p className="text-sm text-amber-700 dark:text-amber-400">
              LinkedIn API rate limit at 80%. Consider slowing down outreach.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
