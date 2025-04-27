"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAppContext } from "@/contexts/app-context"
import { OpenAIKeyForm } from "@/components/openai-key-form"

export function RunAgentButton() {
  const [isRunning, setIsRunning] = useState(false)
  const [showApiKeyForm, setShowApiKeyForm] = useState(false)
  const { toast } = useToast()
  const { refreshData } = useAppContext()

  const handleRunAgent = async () => {
    setIsRunning(true)

    try {
      const response = await fetch("/api/agent/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Agent run successful",
          description: data.message,
        })

        // Refresh data to show the latest changes
        refreshData()
      } else {
        // Check if the error is related to missing API key
        if (data.error && data.error.includes("API key")) {
          setShowApiKeyForm(true)
        } else {
          toast({
            title: "Agent run failed",
            description: data.error || "An unknown error occurred",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error running agent:", error)
      toast({
        title: "Error",
        description: "Failed to run the agent. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <>
      <Button onClick={handleRunAgent} disabled={isRunning}>
        <Zap className="mr-2 h-4 w-4" />
        {isRunning ? "Running..." : "Run Agent"}
      </Button>

      {showApiKeyForm && (
        <OpenAIKeyForm
          onSuccess={() => {
            setShowApiKeyForm(false)
            handleRunAgent()
          }}
        />
      )}
    </>
  )
}
