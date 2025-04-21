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
                <CardContent className="space-y-8">
                  {/* Social & Outreach Networks */}
                  <div>
                    <h4 className="font-semibold text-base mb-3">Social & Outreach Networks</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* LinkedIn */}
                      <div className="rounded-md border p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            {/* LinkedIn Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="none" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M8 11v5" /><circle cx="8" cy="8" r="1" /><path d="M12 16v-3a2 2 0 1 1 4 0v3" /></svg>
                          </div>
                          <div>
                            <h3 className="font-medium">LinkedIn</h3>
                            <p className="text-xs text-muted-foreground">Find and message prospects</p>
                          </div>
                        </div>
                        <Button>Connect</Button>
                      </div>
                      {/* X (Twitter) */}
                      <div className="rounded-md border p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            {/* X Icon */}
                            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3 21 21"/><path d="M21 3 3 21"/></svg>
                          </div>
                          <div>
                            <h3 className="font-medium">X (Twitter)</h3>
                            <p className="text-xs text-muted-foreground">Outreach on X/Twitter</p>
                          </div>
                        </div>
                        <Button>Connect</Button>
                      </div>
                      {/* LinkedIn Sales Navigator */}
                      <div className="rounded-md border p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" stroke="currentColor" fill="none" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M10 7h4v10h-4z" /><path d="M7 10h10v4H7z" /></svg>
                          </div>
                          <div>
                            <h3 className="font-medium">Sales Navigator</h3>
                            <p className="text-xs text-muted-foreground">Advanced LinkedIn outreach</p>
                          </div>
                        </div>
                        <Button>Connect</Button>
                      </div>
                    </div>
                  </div>

                  {/* Job Networks */}
                  <div>
                    <h4 className="font-semibold text-base mb-3">Job Platforms</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Upwork */}
                      <div className="rounded-md border p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center">
                            {/* Upwork Icon */}
                            <span className="font-bold text-green-600 text-lg">Up</span>
                          </div>
                          <div>
                            <h3 className="font-medium">Upwork</h3>
                            <p className="text-xs text-muted-foreground">Find freelancers & prospects</p>
                          </div>
                        </div>
                        <Button>Connect</Button>
                      </div>
                      {/* Indeed */}
                      <div className="rounded-md border p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                            {/* Indeed Icon */}
                            <span className="font-bold text-blue-600 text-lg">in</span>
                          </div>
                          <div>
                            <h3 className="font-medium">Indeed</h3>
                            <p className="text-xs text-muted-foreground">Access top job seekers</p>
                          </div>
                        </div>
                        <Button>Connect</Button>
                      </div>
                    </div>
                  </div>

                  {/* CRMs & Data Providers */}
                  <div>
                    <h4 className="font-semibold text-base mb-3">CRM & Data Providers</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* ZoomInfo */}
                      <div className="rounded-md border p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-yellow-50 flex items-center justify-center">
                            {/* ZoomInfo Icon */}
                            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 16h8M8 12h8M8 8h8"/></svg>
                          </div>
                          <div>
                            <h3 className="font-medium">ZoomInfo</h3>
                            <p className="text-xs text-muted-foreground">B2B contact data</p>
                          </div>
                        </div>
                        <Button>Connect</Button>
                      </div>
                      {/* Salesforce */}
                      <div className="rounded-md border p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                            {/* Salesforce Icon */}
                            <span className="font-bold text-blue-600 text-base">SF</span>
                          </div>
                          <div>
                            <h3 className="font-medium">Salesforce</h3>
                            <p className="text-xs text-muted-foreground">CRM integration</p>
                          </div>
                        </div>
                        <Button>Connect</Button>
                      </div>
                      {/* HubSpot */}
                      <div className="rounded-md border p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center">
                            {/* HubSpot Icon */}
                            <span className="font-bold text-orange-600 text-base">HS</span>
                          </div>
                          <div>
                            <h3 className="font-medium">HubSpot</h3>
                            <p className="text-xs text-muted-foreground">CRM integration</p>
                          </div>
                        </div>
                        <Button>Connect</Button>
                      </div>
                      {/* Pipedrive */}
                      <div className="rounded-md border p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {/* Pipedrive Icon */}
                            <span className="font-bold text-gray-700 text-base">PD</span>
                          </div>
                          <div>
                            <h3 className="font-medium">Pipedrive</h3>
                            <p className="text-xs text-muted-foreground">CRM integration</p>
                          </div>
                        </div>
                        <Button>Connect</Button>
                      </div>
                    </div>
                  </div>

                  {/* Scheduling & Meetings */}
                  <div>
                    <h4 className="font-semibold text-base mb-3">Scheduling & Meetings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Calendly */}
                      <div className="rounded-md border p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
                            {/* Calendly Icon */}
                            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 8h8v8H8z"/></svg>
                          </div>
                          <div>
                            <h3 className="font-medium">Calendly</h3>
                            <p className="text-xs text-muted-foreground">Schedule meetings</p>
                          </div>
                        </div>
                        <Button>Connect</Button>
                      </div>
                    </div>
                  </div>

                  {/* Communication */}
                  <div>
                    <h4 className="font-semibold text-base mb-3">Communication</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Slack */}
                      <div className="rounded-md border p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-pink-50 flex items-center justify-center">
                            {/* Slack Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 20 20"><rect width="2.5" height="7.5" rx="1" x="8.75" y="1"/><rect width="2.5" height="7.5" rx="1" x="8.75" y="11.5"/><rect width="7.5" height="2.5" rx="1" x="1" y="8.75"/><rect width="7.5" height="2.5" rx="1" x="11.5" y="8.75"/></svg>
                          </div>
                          <div>
                            <h3 className="font-medium">Slack</h3>
                            <p className="text-xs text-muted-foreground">Team communication</p>
                          </div>
                        </div>
                        <Button>Connect</Button>
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
