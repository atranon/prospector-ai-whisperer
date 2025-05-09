
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FrequencySelector } from "./FrequencySelector";

export function AgentConfigForm() {
  // Example state for config form, could later be integrated with API/backend.
  const [frequency, setFrequency] = useState<{ interval: number; unit: "minutes" | "hours" | "days" }>({
    interval: 1,
    unit: "days",
  });

  return (
    <form className="p-4 bg-card rounded shadow space-y-4">
      <h2 className="font-bold text-lg">Configure Agent</h2>
      <div>
        <Label htmlFor="agent-name">Name</Label>
        <Input id="agent-name" placeholder="Enter agent name" />
      </div>
      <div>
        <Label htmlFor="agent-desc">Description</Label>
        <Input id="agent-desc" placeholder="Describe the agent's purpose" />
      </div>
      <div>
        <Label htmlFor="agent-model">Model</Label>
        <Input id="agent-model" placeholder="e.g., GPT-4, Sonar, etc." />
      </div>
      {/* Frequency setting */}
      <div>
        <FrequencySelector value={frequency} onChange={setFrequency} />
        <p className="text-xs text-muted-foreground mt-1">
          Adjust how often the Super Agent searches for new leads and nurtures prospects.
        </p>
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  );
}
