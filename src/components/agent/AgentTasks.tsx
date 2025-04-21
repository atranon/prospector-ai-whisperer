
import React from "react";
import { Badge } from "@/components/ui/badge";

export function AgentTasks() {
  // This would list the current and recent tasks for the agent.
  return (
    <section className="p-4 bg-card rounded shadow mt-4">
      <h2 className="font-bold text-lg mb-2">Current Tasks</h2>
      <ul className="space-y-3">
        <li className="flex items-center justify-between">
          <span className="text-sm">Technical staffing outreach - Healthcare sector</span>
          <Badge variant="secondary" className="text-xs">In progress</Badge>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-sm">Newsletter subscriber follow-ups</span>
          <Badge variant="secondary" className="text-xs">Scheduled</Badge>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-sm">Senior developers - SaaS companies</span>
          <Badge variant="secondary" className="text-xs">In progress</Badge>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-sm">Response monitoring - Previous campaigns</span>
          <Badge variant="secondary" className="text-xs">Ongoing</Badge>
        </li>
      </ul>
    </section>
  );
}
