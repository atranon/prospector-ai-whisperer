"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface CampaignTargetingProps {
  data: {
    status: string[]
    grade: string[]
    industry: string[]
    lastContactedDays: string
  }
  updateData: (data: {
    status: string[]
    grade: string[]
    industry: string[]
    lastContactedDays: string
  }) => void
}

export function CampaignTargeting({ data, updateData }: CampaignTargetingProps) {
  const handleStatusChange = (status: string, checked: boolean) => {
    if (checked) {
      updateData({ ...data, status: [...data.status, status] })
    } else {
      updateData({ ...data, status: data.status.filter((s) => s !== status) })
    }
  }

  const handleGradeChange = (grade: string, checked: boolean) => {
    if (checked) {
      updateData({ ...data, grade: [...data.grade, grade] })
    } else {
      updateData({ ...data, grade: data.grade.filter((g) => g !== grade) })
    }
  }

  const handleIndustryChange = (industry: string, checked: boolean) => {
    if (checked) {
      updateData({ ...data, industry: [...data.industry, industry] })
    } else {
      updateData({ ...data, industry: data.industry.filter((i) => i !== industry) })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Lead Status</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="status-new"
              checked={data.status.includes("new")}
              onCheckedChange={(checked) => handleStatusChange("new", !!checked)}
            />
            <Label htmlFor="status-new">New</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="status-contacted"
              checked={data.status.includes("contacted")}
              onCheckedChange={(checked) => handleStatusChange("contacted", !!checked)}
            />
            <Label htmlFor="status-contacted">Contacted</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="status-responded"
              checked={data.status.includes("responded")}
              onCheckedChange={(checked) => handleStatusChange("responded", !!checked)}
            />
            <Label htmlFor="status-responded">Responded</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="status-not-interested"
              checked={data.status.includes("not_interested")}
              onCheckedChange={(checked) => handleStatusChange("not_interested", !!checked)}
            />
            <Label htmlFor="status-not-interested">Not Interested</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Lead Grade</Label>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="grade-a"
              checked={data.grade.includes("A")}
              onCheckedChange={(checked) => handleGradeChange("A", !!checked)}
            />
            <Label htmlFor="grade-a">A Grade</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="grade-b"
              checked={data.grade.includes("B")}
              onCheckedChange={(checked) => handleGradeChange("B", !!checked)}
            />
            <Label htmlFor="grade-b">B Grade</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="grade-c"
              checked={data.grade.includes("C")}
              onCheckedChange={(checked) => handleGradeChange("C", !!checked)}
            />
            <Label htmlFor="grade-c">C Grade</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Industry</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="industry-technology"
              checked={data.industry.includes("technology")}
              onCheckedChange={(checked) => handleIndustryChange("technology", !!checked)}
            />
            <Label htmlFor="industry-technology">Technology</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="industry-finance"
              checked={data.industry.includes("finance")}
              onCheckedChange={(checked) => handleIndustryChange("finance", !!checked)}
            />
            <Label htmlFor="industry-finance">Finance</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="industry-healthcare"
              checked={data.industry.includes("healthcare")}
              onCheckedChange={(checked) => handleIndustryChange("healthcare", !!checked)}
            />
            <Label htmlFor="industry-healthcare">Healthcare</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="industry-retail"
              checked={data.industry.includes("retail")}
              onCheckedChange={(checked) => handleIndustryChange("retail", !!checked)}
            />
            <Label htmlFor="industry-retail">Retail</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="industry-manufacturing"
              checked={data.industry.includes("manufacturing")}
              onCheckedChange={(checked) => handleIndustryChange("manufacturing", !!checked)}
            />
            <Label htmlFor="industry-manufacturing">Manufacturing</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="industry-education"
              checked={data.industry.includes("education")}
              onCheckedChange={(checked) => handleIndustryChange("education", !!checked)}
            />
            <Label htmlFor="industry-education">Education</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastContacted">Last Contacted</Label>
        <Select
          value={data.lastContactedDays}
          onValueChange={(value) => updateData({ ...data, lastContactedDays: value })}
        >
          <SelectTrigger id="lastContacted">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="never">Never contacted</SelectItem>
            <SelectItem value="7">Within last 7 days</SelectItem>
            <SelectItem value="30">Within last 30 days</SelectItem>
            <SelectItem value="90">Within last 90 days</SelectItem>
            <SelectItem value="any">Any time</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
