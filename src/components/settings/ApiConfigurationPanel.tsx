
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ApiConfigurationPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>API Configuration</CardTitle>
        <CardDescription>
          Configure API keys for AI and data providers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="openai-api">OpenAI API Key</Label>
          <div className="flex space-x-2">
            <Input id="openai-api" type="password" placeholder="sk-..." className="flex-1" />
            <Button variant="outline">Verify</Button>
          </div>
          <p className="text-xs text-muted-foreground">Used for message personalization and content generation</p>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="prospecting-api">Prospecting Data API</Label>
          <div className="flex space-x-2">
            <Input id="prospecting-api" type="password" placeholder="Your API key" className="flex-1" />
            <Button variant="outline">Verify</Button>
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <input type="radio" id="apollo" name="data-provider" className="h-4 w-4" />
              <Label htmlFor="apollo" className="text-sm">Apollo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="radio" id="zoominfo" name="data-provider" className="h-4 w-4" />
              <Label htmlFor="zoominfo" className="text-sm">ZoomInfo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="radio" id="clearbit" name="data-provider" className="h-4 w-4" />
              <Label htmlFor="clearbit" className="text-sm">Clearbit</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="radio" id="other" name="data-provider" className="h-4 w-4" />
              <Label htmlFor="other" className="text-sm">Other</Label>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="webhook-url">Webhook URL (optional)</Label>
            <Button variant="link" className="h-auto p-0 text-xs">Documentation</Button>
          </div>
          <Input id="webhook-url" placeholder="https://your-webhook-url.com" />
          <p className="text-xs text-muted-foreground">Receive notifications when prospects respond</p>
        </div>

        <div className="pt-4">
          <Button>Save API Configuration</Button>
        </div>
      </CardContent>
    </Card>
  );
}
