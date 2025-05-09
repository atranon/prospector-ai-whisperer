import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CampaignReviewProps {
  data: {
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
}

export function CampaignReview({ data }: CampaignReviewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Campaign Details</h3>
        <Card>
          <CardContent className="pt-4">
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium">Name:</dt>
                <dd>{data.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Description:</dt>
                <dd className="text-right">{data.description}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Target Audience</h3>
        <Card>
          <CardContent className="pt-4">
            <dl className="space-y-2">
              <div>
                <dt className="font-medium mb-1">Status:</dt>
                <dd>
                  <div className="flex flex-wrap gap-1">
                    {data.targetAudience.status.length > 0 ? (
                      data.targetAudience.status.map((status) => (
                        <Badge key={status} variant="outline">
                          {status.replace("_", " ")}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">Any status</span>
                    )}
                  </div>
                </dd>
              </div>
              <div>
                <dt className="font-medium mb-1">Grade:</dt>
                <dd>
                  <div className="flex flex-wrap gap-1">
                    {data.targetAudience.grade.length > 0 ? (
                      data.targetAudience.grade.map((grade) => (
                        <Badge key={grade} variant="outline">
                          {grade} Grade
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">Any grade</span>
                    )}
                  </div>
                </dd>
              </div>
              <div>
                <dt className="font-medium mb-1">Industry:</dt>
                <dd>
                  <div className="flex flex-wrap gap-1">
                    {data.targetAudience.industry.length > 0 ? (
                      data.targetAudience.industry.map((industry) => (
                        <Badge key={industry} variant="outline">
                          {industry}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">Any industry</span>
                    )}
                  </div>
                </dd>
              </div>
              <div>
                <dt className="font-medium mb-1">Last Contacted:</dt>
                <dd>
                  {data.targetAudience.lastContactedDays === "never"
                    ? "Never contacted"
                    : data.targetAudience.lastContactedDays === "any"
                      ? "Any time"
                      : `Within last ${data.targetAudience.lastContactedDays} days`}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Schedule</h3>
        <Card>
          <CardContent className="pt-4">
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="font-medium">Start Date:</dt>
                <dd>{formatDate(data.schedule.startDate)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">End Date:</dt>
                <dd>{formatDate(data.schedule.endDate)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Max Daily Messages:</dt>
                <dd>{data.schedule.maxDailyMessages}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium">Working Hours Only:</dt>
                <dd>{data.schedule.workingHoursOnly ? "Yes" : "No"}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Messages</h3>
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Initial Message:</h4>
                <p className="text-sm whitespace-pre-line border rounded-md p-2 bg-muted/50">
                  {data.messages.initialTemplate || "No initial message set"}
                </p>
              </div>
              {data.messages.followUp1Template && (
                <div>
                  <h4 className="font-medium mb-1">First Follow-up:</h4>
                  <p className="text-sm whitespace-pre-line border rounded-md p-2 bg-muted/50">
                    {data.messages.followUp1Template}
                  </p>
                </div>
              )}
              {data.messages.followUp2Template && (
                <div>
                  <h4 className="font-medium mb-1">Second Follow-up:</h4>
                  <p className="text-sm whitespace-pre-line border rounded-md p-2 bg-muted/50">
                    {data.messages.followUp2Template}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
