
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface EngagementRulesProps {
  messagingFramework: "aida" | "4t";
  setMessagingFramework: (v: "aida" | "4t") => void;
}

const TEMPLATE_4T = `Hi {{first_name}},\n\nI see you're with {{company}}. Many {{industry}} leaders like you are tackling {{trigger}}. We built {{tool}} to help teams {{target}}. Can I share a quick tip on how you could {{teaser}}?\n\nBest,\n{{user_name}}`;
const TEMPLATE_AIDA = `Hi {{first_name}},\n\nAre you looking to take {{company}}’s {{focus_area}} to the next level? [Attention]\n\nMany in {{industry}} achieve outstanding results by {{interest}}. [Interest]\n\nImagine increasing {{benefit}} with a simple change. [Desire]\n\nWould you be open to connecting for 10 minutes to explore? [Action]\n\nBest regards,\n{{user_name}}`;

export function EngagementRules({
  messagingFramework,
  setMessagingFramework
}: EngagementRulesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Rules</CardTitle>
        <CardDescription>
          Define how and when to engage with prospects
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="platforms">Outreach Platforms</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            <Button variant="outline" className="rounded-full" size="sm">
              LinkedIn
            </Button>
            <Button variant="outline" className="rounded-full" size="sm">
              Email
            </Button>
            <Button variant="outline" className="rounded-full" size="sm">
              Twitter
            </Button>
            <Button variant="secondary" className="rounded-full" size="sm">
              + Add Platform
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="framework">Messaging Framework</Label>
          <Select
            value={messagingFramework}
            onValueChange={v => setMessagingFramework(v as "aida" | "4t")}
          >
            <SelectTrigger id="framework">
              <SelectValue placeholder="Select messaging framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aida">AIDA (Attention-Interest-Desire-Action)</SelectItem>
              <SelectItem value="4t">4T (Trigger, Target, Tool, Teaser)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Pick a framework to optimize message hooks and response rates.
          </p>
        </div>

        <div className="space-y-1">
          <Label>Sample Initial Message</Label>
          <div className="bg-muted p-3 rounded text-sm whitespace-pre-line font-mono">
            {messagingFramework === "aida" ? TEMPLATE_AIDA : TEMPLATE_4T}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Customize and use variables to tailor your outreach.
          </p>
        </div>

        <div className="space-y-1">
          <Label htmlFor="frequency">Contact Frequency</Label>
          <Select defaultValue="weekly">
            <SelectTrigger id="frequency">
              <SelectValue placeholder="Select contact frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Bi-weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="follow-up">Follow-up Strategy</Label>
          <Select defaultValue="3-touches">
            <SelectTrigger id="follow-up">
              <SelectValue placeholder="Select follow-up strategy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-touch">Single touch</SelectItem>
              <SelectItem value="3-touches">3-touch sequence</SelectItem>
              <SelectItem value="5-touches">5-touch sequence</SelectItem>
              <SelectItem value="custom">Custom sequence</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="personalize" defaultChecked />
          <Label htmlFor="personalize">Auto-personalize messages with AI</Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Back</Button>
        <Button>Save ICP Profile</Button>
      </CardFooter>
    </Card>
  );
}
