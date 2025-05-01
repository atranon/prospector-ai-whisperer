"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

interface CampaignScheduleProps {
  data: {
    startDate: string
    endDate: string
    maxDailyMessages: number
    workingHoursOnly: boolean
  }
  updateData: (data: {
    startDate: string
    endDate: string
    maxDailyMessages: number
    workingHoursOnly: boolean
  }) => void
}

export function CampaignSchedule({ data, updateData }: CampaignScheduleProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date</Label>
          <Input
            id="start-date"
            type="date"
            value={data.startDate}
            onChange={(e) => updateData({ ...data, startDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-date">End Date</Label>
          <Input
            id="end-date"
            type="date"
            value={data.endDate}
            onChange={(e) => updateData({ ...data, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="max-daily">Maximum Daily Messages</Label>
        <Input
          id="max-daily"
          type="number"
          min="1"
          max="100"
          value={data.maxDailyMessages}
          onChange={(e) => updateData({ ...data, maxDailyMessages: Number.parseInt(e.target.value) })}
        />
        <p className="text-xs text-muted-foreground">
          Limit the number of messages sent per day to avoid rate limits and maintain quality.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="working-hours">Working Hours Only</Label>
          <p className="text-xs text-muted-foreground">Only send messages during business hours (9 AM - 5 PM)</p>
        </div>
        <Switch
          id="working-hours"
          checked={data.workingHoursOnly}
          onCheckedChange={(checked) => updateData({ ...data, workingHoursOnly: checked })}
        />
      </div>
    </div>
  )
}
