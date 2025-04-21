
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function AgentConfigForm() {
  // This form will edit agent settings (name, description, model, ...).
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
      <Button type="submit">Save Changes</Button>
    </form>
  );
}
