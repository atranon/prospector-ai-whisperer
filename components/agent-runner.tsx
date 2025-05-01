"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Pause, AlertCircle } from "lucide-react"

export function AgentRunner() {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState("idle")
  const [logs, setLogs] = useState<string[]>([])

  const startAgent = () => {
    setIsRunning(true)
    setStatus("running")
    setProgress(0)
    setLogs([
      `[${new Date().toLocaleTimeString()}] Agent started`,
      `[${new Date().toLocaleTimeString()}] Fetching leads...`,
    ])

    // Simulate agent progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsRunning(false)
          setStatus("completed")
          setLogs((logs) => [...logs, `[${new Date().toLocaleTimeString()}] Agent completed successfully`])
          return 100
        }

        // Add log messages at certain points
        if (prev === 0) {
          setLogs((logs) => [...logs, `[${new Date().toLocaleTimeString()}] Found 5 leads to process`])
        } else if (prev === 20) {
          setLogs((logs) => [...logs, `[${new Date().toLocaleTimeString()}] Processing lead 1/5: John Smith`])
        } else if (prev === 40) {
          setLogs((logs) => [...logs, `[${new Date().toLocaleTimeString()}] Processing lead 2/5: Sarah Johnson`])
        } else if (prev === 60) {
          setLogs((logs) => [...logs, `[${new Date().toLocaleTimeString()}] Processing lead 3/5: Michael Chen`])
        } else if (prev === 80) {
          setLogs((logs) => [...logs, `[${new Date().toLocaleTimeString()}] Processing lead 4/5: David Wilson`])
        } else if (prev === 90) {
          setLogs((logs) => [...logs, `[${new Date().toLocaleTimeString()}] Processing lead 5/5: Alex Rivera`])
        }

        return prev + 10
      })
    }, 1000)

    return () => clearInterval(interval)
  }

  const pauseAgent = () => {
    setIsRunning(false)
    setStatus("paused")
    setLogs((logs) => [...logs, `[${new Date().toLocaleTimeString()}] Agent paused`])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Agent Runner</CardTitle>
        <CardDescription>Run your AI agent to process leads and send messages</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={`h-3 w-3 rounded-full ${
                status === "running"
                  ? "bg-green-500"
                  : status === "paused"
                    ? "bg-amber-500"
                    : status === "completed"
                      ? "bg-blue-500"
                      : "bg-gray-500"
              }`}
            ></div>
            <span className="font-medium capitalize">{status}</span>
          </div>
          <Badge variant="outline">{progress}% Complete</Badge>
        </div>

        <Progress value={progress} className="h-2" />

        <div className="rounded-md border bg-muted/50 p-4 h-48 overflow-auto">
          <pre className="text-xs font-mono">
            {logs.length > 0 ? logs.join("\n") : "Agent logs will appear here..."}
          </pre>
        </div>

        <div className="rounded-md bg-amber-50 p-3 dark:bg-amber-950">
          <div className="flex items-start space-x-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div>
              <h5 className="text-sm font-medium text-amber-800 dark:text-amber-300">Demo Mode</h5>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                This is a simulation. In a real implementation, the agent would process actual leads and send messages.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {isRunning ? (
          <Button onClick={pauseAgent} variant="outline" className="w-full">
            <Pause className="mr-2 h-4 w-4" />
            Pause Agent
          </Button>
        ) : (
          <Button onClick={startAgent} className="w-full">
            <Zap className="mr-2 h-4 w-4" />
            Run Agent
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
