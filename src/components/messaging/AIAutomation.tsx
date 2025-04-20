
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";

export function AIAutomation() {
  const [isActive, setIsActive] = useState(true);
  const [aiPersonality, setAiPersonality] = useState("professional");
  const [engagementLevel, setEngagementLevel] = useState([70]);
  
  return (
    <Tabs defaultValue="settings" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="settings">AI Settings</TabsTrigger>
        <TabsTrigger value="enhance">Message Enhancement</TabsTrigger>
        <TabsTrigger value="schedule">Automation Schedule</TabsTrigger>
      </TabsList>
      
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>AI Agent Settings</CardTitle>
            <CardDescription>
              Configure how your AI assistant works for you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">AI Assistant Status</h3>
                <p className="text-sm text-muted-foreground">Enable or disable the AI assistant</p>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
            
            <div className="space-y-3">
              <Label>AI Personality</Label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "professional", label: "Professional" },
                  { id: "friendly", label: "Friendly" },
                  { id: "direct", label: "Direct" },
                  { id: "creative", label: "Creative" },
                ].map((personality) => (
                  <div
                    key={personality.id}
                    className={`rounded-md border p-3 cursor-pointer ${
                      aiPersonality === personality.id ? "bg-primary text-primary-foreground border-primary" : ""
                    }`}
                    onClick={() => setAiPersonality(personality.id)}
                  >
                    <div className="text-sm font-medium">{personality.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Engagement Level</Label>
                <span className="text-sm text-muted-foreground">
                  {engagementLevel[0]}%
                </span>
              </div>
              <Slider 
                defaultValue={engagementLevel} 
                max={100} 
                step={1} 
                onValueChange={(value) => setEngagementLevel(value as number[])} 
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Conservative</span>
                <span>Balanced</span>
                <span>Aggressive</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="response-handling">Response Handling</Label>
              <Select defaultValue="auto-respond">
                <SelectTrigger id="response-handling">
                  <SelectValue placeholder="Select response handling" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="notify-only">Notify Only</SelectItem>
                  <SelectItem value="suggest-response">Suggest Response</SelectItem>
                  <SelectItem value="auto-respond">Auto-respond with Approval</SelectItem>
                  <SelectItem value="fully-automated">Fully Automated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="learning-mode">AI Learning Mode</Label>
              <Select defaultValue="active">
                <SelectTrigger id="learning-mode">
                  <SelectValue placeholder="Select learning mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passive">Passive (Learn from my messages)</SelectItem>
                  <SelectItem value="active">Active (Learn & suggest improvements)</SelectItem>
                  <SelectItem value="expert">Expert (Full autonomy within guidelines)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="enhance">
        <Card>
          <CardHeader>
            <CardTitle>Message Enhancement</CardTitle>
            <CardDescription>
              Configure how the AI improves your outreach messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Auto-personalize Messages</h3>
                  <p className="text-sm text-muted-foreground">Customize messages based on prospect data</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Reference Recent News</h3>
                  <p className="text-sm text-muted-foreground">Include relevant company/industry news</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Optimize Subject Lines</h3>
                  <p className="text-sm text-muted-foreground">Generate high-performing email subjects</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">A/B Test Messages</h3>
                  <p className="text-sm text-muted-foreground">Test different message variations</p>
                </div>
                <Switch />
              </div>
            </div>
            
            <div className="rounded-md bg-secondary p-4 space-y-4">
              <h3 className="font-medium">Enhancement Focus</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "brevity", label: "Brevity", checked: true },
                  { id: "clarity", label: "Clarity", checked: true },
                  { id: "relevance", label: "Relevance", checked: true },
                  { id: "personalization", label: "Personalization", checked: true },
                  { id: "persuasion", label: "Persuasion", checked: false },
                  { id: "urgency", label: "Urgency", checked: false },
                ].map((focus) => (
                  <div key={focus.id} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id={focus.id} 
                      defaultChecked={focus.checked}
                      className="h-4 w-4 rounded border-gray-300" 
                    />
                    <Label htmlFor={focus.id} className="text-sm">{focus.label}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="forbidden-phrases">Phrases to Avoid</Label>
              <Input 
                id="forbidden-phrases" 
                placeholder="just checking in, touching base, etc."
                defaultValue="just checking in, to whom it may concern, sorry to bother" 
              />
              <p className="text-xs text-muted-foreground">
                The AI will avoid using these phrases in your messages
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="schedule">
        <Card>
          <CardHeader>
            <CardTitle>Automation Schedule</CardTitle>
            <CardDescription>
              Configure when and how the AI agent works
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="max-daily">Daily Message Limit</Label>
              <Select defaultValue="50">
                <SelectTrigger id="max-daily">
                  <SelectValue placeholder="Select message limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 messages/day</SelectItem>
                  <SelectItem value="50">50 messages/day</SelectItem>
                  <SelectItem value="100">100 messages/day</SelectItem>
                  <SelectItem value="custom">Custom limit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Active Hours</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input id="start-time" type="time" defaultValue="09:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input id="end-time" type="time" defaultValue="17:00" />
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Active Days</h3>
              <div className="flex flex-wrap gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                  <div 
                    key={day} 
                    className={`px-3 py-1 border rounded-md cursor-pointer text-sm ${
                      i < 5 ? "bg-primary text-primary-foreground" : ""
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Throttling</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-interval">Minimum Interval</Label>
                  <Select defaultValue="15">
                    <SelectTrigger id="min-interval">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-per-hour">Max Per Hour</Label>
                  <Input id="max-per-hour" type="number" min="1" defaultValue="10" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                These settings help make your outreach appear more natural
              </p>
            </div>
            
            <div className="mt-4">
              <Button>Apply Schedule Settings</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
