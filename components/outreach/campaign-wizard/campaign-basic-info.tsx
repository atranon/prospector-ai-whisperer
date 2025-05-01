"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface CampaignBasicInfoProps {
  data: {
    name: string
    description: string
  }
  updateData: (data: { name: string; description: string }) => void
}

export function CampaignBasicInfo({ data, updateData }: CampaignBasicInfoProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Campaign Name</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => updateData({ ...data, name: e.target.value })}
          placeholder="e.g., Q2 IT Directors Outreach"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => updateData({ ...data, description: e.target.value })}
          placeholder="Briefly describe the purpose of this campaign"
          className="min-h-[100px]"
        />
      </div>
    </div>
  )
}
