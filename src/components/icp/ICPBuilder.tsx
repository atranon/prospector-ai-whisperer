
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ICPBuilder() {
  const [icpName, setIcpName] = useState("My ICP");
  const [companySize, setCompanySize] = useState([50, 1000]);
  const [includeDecisionMakers, setIncludeDecisionMakers] = useState(true);
  
  return (
    <Tabs defaultValue="company" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="company">Company Criteria</TabsTrigger>
        <TabsTrigger value="contact">Contact Criteria</TabsTrigger>
        <TabsTrigger value="engagement">Engagement Rules</TabsTrigger>
      </TabsList>
      
      <TabsContent value="company">
        <Card>
          <CardHeader>
            <CardTitle>Company Criteria</CardTitle>
            <CardDescription>
              Define the attributes of your ideal customer's organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="icp-name">ICP Name</Label>
              <Input 
                id="icp-name" 
                value={icpName} 
                onChange={(e) => setIcpName(e.target.value)}
                placeholder="Name this ICP profile" 
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="industry">Industry</Label>
              <Select defaultValue="saas">
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saas">SaaS / Software</SelectItem>
                  <SelectItem value="financial">Financial Services</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label>Company Size (employees)</Label>
                <span className="text-sm text-muted-foreground">
                  {companySize[0]} - {companySize[1]}
                </span>
              </div>
              <Slider 
                defaultValue={companySize} 
                min={10} 
                max={10000} 
                step={10} 
                onValueChange={(value) => setCompanySize(value as number[])} 
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="location">Locations</Label>
              <Input id="location" placeholder="United States, Europe, etc." />
              <p className="text-xs text-muted-foreground mt-1">Enter comma-separated regions or countries</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="funding" 
                defaultChecked 
              />
              <Label htmlFor="funding">Only include companies with recent funding</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Save & Continue</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="contact">
        <Card>
          <CardHeader>
            <CardTitle>Contact Criteria</CardTitle>
            <CardDescription>
              Define the attributes of your ideal point of contact
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="job-titles">Job Titles</Label>
              <Input id="job-titles" placeholder="CEO, CTO, VP of Marketing, etc." />
              <p className="text-xs text-muted-foreground mt-1">Enter comma-separated job titles</p>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="seniority">Seniority Level</Label>
              <Select defaultValue="executive">
                <SelectTrigger id="seniority">
                  <SelectValue placeholder="Select seniority level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="c-level">C-Level</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                  <SelectItem value="director">Director</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="individual">Individual Contributor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="decision-makers" 
                checked={includeDecisionMakers} 
                onCheckedChange={setIncludeDecisionMakers}
              />
              <Label htmlFor="decision-makers">Target decision makers only</Label>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="skills">Skills & Interests</Label>
              <Input id="skills" placeholder="AI, Digital Transformation, Growth" />
              <p className="text-xs text-muted-foreground mt-1">Enter comma-separated skills/interests</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Back</Button>
            <Button>Save & Continue</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="engagement">
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
      </TabsContent>
    </Tabs>
  );
}
