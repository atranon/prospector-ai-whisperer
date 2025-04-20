
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export function MessagingTemplates() {
  const [templateContent, setTemplateContent] = useState(
    "Hi {{first_name}},\n\nI noticed your work at {{company}} and was particularly impressed with your focus on {{interest}}.\n\nOur platform has helped similar {{industry}} companies achieve {{benefit}}. Would you be open to a quick chat this week to discuss how we might be able to help {{company}} as well?\n\nBest regards,\n{{user_name}}"
  );

  return (
    <Tabs defaultValue="linkedin" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
        <TabsTrigger value="email">Email</TabsTrigger>
        <TabsTrigger value="custom">Custom</TabsTrigger>
      </TabsList>
      
      <TabsContent value="linkedin">
        <Card>
          <CardHeader>
            <CardTitle>LinkedIn Message Templates</CardTitle>
            <CardDescription>
              Create personalized templates for LinkedIn outreach
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="template-name">Template Name</Label>
              <Input id="template-name" placeholder="E.g., LinkedIn First Touch" defaultValue="LinkedIn Value Proposition" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="template-content">Message Content</Label>
                <div className="flex space-x-1">
                  <Badge variant="outline">{"{{first_name}}"}</Badge>
                  <Badge variant="outline">{"{{company}}"}</Badge>
                  <Badge variant="outline">+ Insert Variable</Badge>
                </div>
              </div>
              <Textarea
                id="template-content"
                value={templateContent}
                onChange={(e) => setTemplateContent(e.target.value)}
                className="min-h-[200px]"
              />
              <p className="text-xs text-muted-foreground mt-1">Use variables like {"{{first_name}}"} to personalize</p>
            </div>
            
            <div className="rounded-md bg-secondary p-3">
              <div className="text-sm font-medium mb-2">AI Suggestions</div>
              <div className="space-y-2">
                <div className="text-xs rounded-md bg-background p-2 cursor-pointer hover:bg-muted">
                  Make your message more concise by removing unnecessary words.
                </div>
                <div className="text-xs rounded-md bg-background p-2 cursor-pointer hover:bg-muted">
                  Include a specific question to increase response rates.
                </div>
                <div className="text-xs rounded-md bg-background p-2 cursor-pointer hover:bg-muted">
                  Add a reference to a recent company announcement for personalization.
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button variant="outline">Test Send</Button>
            </div>
            <Button>Save Template</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="email">
        <Card>
          <CardHeader>
            <CardTitle>Email Templates</CardTitle>
            <CardDescription>
              Create personalized templates for email outreach
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email-subject">Email Subject</Label>
              <Input id="email-subject" placeholder="E.g., Quick question about {{company}}'s {{focus_area}}" defaultValue="Opportunity for {{company}} in {{industry}}" />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="email-template">Email Body</Label>
              <Textarea
                id="email-template"
                placeholder="Write your email template here..."
                className="min-h-[200px]"
                defaultValue="Dear {{first_name}},\n\nI hope this email finds you well. I recently came across {{company}} and was impressed by your work in {{industry}}.\n\nI'm reaching out because we've helped similar companies achieve {{benefit}} through our platform.\n\nWould you be available for a 15-minute call this week to discuss how we might be able to help {{company}} as well?\n\nBest regards,\n{{user_name}}\n{{user_title}}"
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="follow-up-timing">Follow-up Timing</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center space-x-2 border rounded-md p-2">
                  <Input type="radio" id="3-days" name="follow-up" className="h-4 w-4" defaultChecked />
                  <Label htmlFor="3-days" className="text-sm">3 days</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-2">
                  <Input type="radio" id="5-days" name="follow-up" className="h-4 w-4" />
                  <Label htmlFor="5-days" className="text-sm">5 days</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-2">
                  <Input type="radio" id="custom-days" name="follow-up" className="h-4 w-4" />
                  <Label htmlFor="custom-days" className="text-sm">Custom</Label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button variant="outline">Test Email</Button>
            </div>
            <Button>Save Template</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="custom">
        <Card>
          <CardHeader>
            <CardTitle>Custom Platform Templates</CardTitle>
            <CardDescription>
              Create templates for other platforms or channels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input id="platform-name" placeholder="E.g., Twitter, Instagram, etc." />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="custom-template">Message Content</Label>
                <Textarea
                  id="custom-template"
                  placeholder="Write your custom template here..."
                  className="min-h-[200px]"
                />
              </div>
              
              <div className="rounded-md bg-secondary p-3">
                <div className="text-sm font-medium">AI Template Generation</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Let AI generate a template based on your target audience and goals
                </p>
                <div className="mt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Generate Template with AI
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Save Template</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
