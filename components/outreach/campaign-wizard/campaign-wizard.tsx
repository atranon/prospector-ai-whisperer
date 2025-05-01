"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Loader2 } from "lucide-react"
import { CampaignBasicInfo } from "./campaign-basic-info"
import { CampaignTargeting } from "./campaign-targeting"
import { CampaignMessages } from "./campaign-messages"
import { CampaignSchedule } from "./campaign-schedule"
import { CampaignReview } from "./campaign-review"

type CampaignData = {
  name: string
  description: string
  targetAudience: {
    status: string[]
    grade: string[]
    industry: string[]
    lastContactedDays: string
  }
  messages: {
    initialTemplate: string
    followUp1Template: string
    followUp2Template: string
  }
  schedule: {
    startDate: string
    endDate: string
    maxDailyMessages: number
    workingHoursOnly: boolean
  }
}

export function CampaignWizard() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: "",
    description: "",
    targetAudience: {
      status: [],
      grade: [],
      industry: [],
      lastContactedDays: "30",
    },
    messages: {
      initialTemplate: "",
      followUp1Template: "",
      followUp2Template: "",
    },
    schedule: {
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      maxDailyMessages: 20,
      workingHoursOnly: true,
    },
  })

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateCampaignData = (data: Partial<CampaignData>) => {
    setCampaignData((prev) => ({ ...prev, ...data }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // In a real app, you would call your API to create the campaign
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsOpen(false)
      setCurrentStep(1)
      // Reset form or show success message
    } catch (err) {
      console.error("Failed to create campaign", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>Set up a new outreach campaign in a few simple steps.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Step indicator */}
          <div className="mb-6">
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`flex flex-col items-center ${
                    step <= currentStep ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {step}
                  </div>
                  <span className="text-xs hidden sm:inline">
                    {step === 1
                      ? "Basics"
                      : step === 2
                        ? "Targeting"
                        : step === 3
                          ? "Messages"
                          : step === 4
                            ? "Schedule"
                            : "Review"}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 h-1 bg-muted">
              <div
                className="h-1 bg-primary transition-all"
                style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step content */}
          {currentStep === 1 && <CampaignBasicInfo data={campaignData} updateData={updateCampaignData} />}
          {currentStep === 2 && (
            <CampaignTargeting
              data={campaignData.targetAudience}
              updateData={(data) => updateCampaignData({ targetAudience: data })}
            />
          )}
          {currentStep === 3 && (
            <CampaignMessages
              data={campaignData.messages}
              updateData={(data) => updateCampaignData({ messages: data })}
            />
          )}
          {currentStep === 4 && (
            <CampaignSchedule
              data={campaignData.schedule}
              updateData={(data) => updateCampaignData({ schedule: data })}
            />
          )}
          {currentStep === 5 && <CampaignReview data={campaignData} />}
        </div>

        <DialogFooter>
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {currentStep < 5 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Campaign"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
