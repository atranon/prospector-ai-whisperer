
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface ContactCriteriaProps {
  includeDecisionMakers: boolean;
  setIncludeDecisionMakers: (v: boolean) => void;
}

export function ContactCriteria({
  includeDecisionMakers,
  setIncludeDecisionMakers
}: ContactCriteriaProps) {
  return (
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
  );
}
