
import { Sidebar } from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:block w-64">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Configure your ProspectorAI account and integrations</p>
          </div>
          
          <Tabs defaultValue="integrations" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="integrations">Platform Integrations</TabsTrigger>
              <TabsTrigger value="api">API Configuration</TabsTrigger>
              <TabsTrigger value="account">Account Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="integrations">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Integrations</CardTitle>
                  <CardDescription>
                    Connect to the platforms you use for prospecting and outreach
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">LinkedIn</h3>
                          <p className="text-sm text-muted-foreground">Connect to find and message prospects</p>
                        </div>
                      </div>
                      <Button>Connect</Button>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">Email Providers</h3>
                          <p className="text-sm text-muted-foreground">Connect to your email for outreach</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline">Gmail</Button>
                        <Button variant="outline">Outlook</Button>
                        <Button variant="outline">SMTP</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
                            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">CRM Integration</h3>
                          <p className="text-sm text-muted-foreground">Sync prospects with your CRM</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline">Salesforce</Button>
                        <Button variant="outline">HubSpot</Button>
                        <Button variant="outline">Other</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="api">
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
            </TabsContent>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="John Doe" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" defaultValue="john@example.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input id="company" defaultValue="Acme Inc." />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="job-title">Job Title</Label>
                      <Input id="job-title" defaultValue="Sales Manager" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Notification Preferences</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive updates about prospects and responses</p>
                      </div>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="browser-notifications">Browser Notifications</Label>
                        <p className="text-xs text-muted-foreground">Show alerts in your browser</p>
                      </div>
                      <Switch id="browser-notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="weekly-digest">Weekly Activity Digest</Label>
                        <p className="text-xs text-muted-foreground">Receive a summary of weekly activity</p>
                      </div>
                      <Switch id="weekly-digest" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">Sign Out</Button>
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
