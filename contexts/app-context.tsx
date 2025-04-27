"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getLeads } from "@/services/leads-service"
import { getCampaigns } from "@/services/campaigns-service"
import { getMessageTemplates } from "@/services/templates-service"
import { getActivities } from "@/services/activities-service"
import type { Lead, Campaign, MessageTemplate, Activity } from "@/types/database"

interface AppContextType {
  leads: Lead[]
  campaigns: Campaign[]
  messageTemplates: MessageTemplate[]
  recentActivities: Activity[]
  isLoading: boolean
  refreshData: () => Promise<void>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [messageTemplates, setMessageTemplates] = useState<MessageTemplate[]>([])
  const [recentActivities, setRecentActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshData = async () => {
    setIsLoading(true)
    try {
      const [leadsData, campaignsData, templatesData, activitiesData] = await Promise.all([
        getLeads(),
        getCampaigns(),
        getMessageTemplates(),
        getActivities(20),
      ])

      setLeads(leadsData)
      setCampaigns(campaignsData)
      setMessageTemplates(templatesData)
      setRecentActivities(activitiesData)
    } catch (error) {
      console.error("Error refreshing data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  return (
    <AppContext.Provider
      value={{
        leads,
        campaigns,
        messageTemplates,
        recentActivities,
        isLoading,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
