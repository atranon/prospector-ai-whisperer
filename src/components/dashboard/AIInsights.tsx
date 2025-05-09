
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AIInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights & Recommendations</CardTitle>
        <CardDescription>
          Intelligence gathered from your prospecting activities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-md bg-secondary p-4">
          <h3 className="text-sm font-medium mb-2">Message Optimization</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Your messages mentioning "cost savings" have a 37% higher response rate than those focusing on "features".
          </p>
          <Button variant="outline" size="sm">Apply to Templates</Button>
        </div>
        
        <div className="rounded-md bg-secondary p-4">
          <h3 className="text-sm font-medium mb-2">ICP Refinement</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Companies with 50-200 employees in the healthcare sector are responding at 2.4x your average rate.
          </p>
          <Button variant="outline" size="sm">Refine ICP</Button>
        </div>
        
        <div className="rounded-md bg-secondary p-4">
          <h3 className="text-sm font-medium mb-2">Timing Optimization</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Messages sent on Tuesday and Wednesday mornings are generating the highest engagement.
          </p>
          <Button variant="outline" size="sm">Adjust Schedule</Button>
        </div>
        
        <div className="rounded-md border-l-4 border-accent p-4">
          <h3 className="text-sm font-medium mb-2">AI Assistant Recommendation</h3>
          <p className="text-sm text-muted-foreground mb-3">
            8 prospects with high match scores haven't been contacted yet. Would you like me to prepare personalized messages for them?
          </p>
          <div className="flex space-x-2">
            <Button size="sm" className="bg-accent hover:bg-accent/90">Generate Messages</Button>
            <Button variant="outline" size="sm">View Prospects</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
