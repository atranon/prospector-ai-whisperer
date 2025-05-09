
import React from "react";
import { Badge } from "@/components/ui/badge";

export const AgentHeader = () => (
  <div className="mb-6 flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Agent Management</h1>
      <p className="text-muted-foreground">Configure and monitor your outreach super agent</p>
    </div>
    <Badge className="bg-green-600">Active</Badge>
  </div>
);
