"use client"

import { CampaignCard } from "@/components/outreach/campaign-card"
import { mockCampaigns } from "@/data/mock-campaigns"

export function OutreachCampaigns() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockCampaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  )
}
