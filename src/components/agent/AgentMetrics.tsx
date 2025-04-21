
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export function AgentMetrics() {
  // Graphs/charts to show performance (placeholder for now)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">Total Outreach</div>
            <div className="text-2xl font-bold">156</div>
            <div className="text-xs text-green-600">+12% from last week</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">Response Rate</div>
            <div className="text-2xl font-bold">23.7%</div>
            <div className="text-xs text-green-600">+5.2% from last week</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">Conversions</div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-green-600">+3 from last week</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="h-48 border rounded bg-muted/50 flex items-center justify-center text-muted-foreground">
        <p>Performance charts coming soon</p>
      </div>
    </div>
  );
}
