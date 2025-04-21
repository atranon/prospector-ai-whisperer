
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

interface CompanyCriteriaProps {
  icpName: string;
  setIcpName: (v: string) => void;
  companySize: number[];
  setCompanySize: (v: number[]) => void;
}

export function CompanyCriteria({
  icpName,
  setIcpName,
  companySize,
  setCompanySize
}: CompanyCriteriaProps) {
  return (
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
          <Switch id="funding" defaultChecked />
          <Label htmlFor="funding">Only include companies with recent funding</Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Save & Continue</Button>
      </CardFooter>
    </Card>
  );
}
