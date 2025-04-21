
import React from "react";
import { Button } from "@/components/ui/button";

export function AgentIntegrations() {
  // List/manage agent’s plugins or integrations.
  return (
    <section className="mt-4 p-4 bg-card rounded shadow">
      <h2 className="font-bold text-lg mb-2">Integrations</h2>
      <ul className="list-disc ml-5 text-muted-foreground">
        <li>Gmail <Button size="sm" variant="outline" className="ml-2">Configure</Button></li>
        <li>Slack <Button size="sm" variant="outline" className="ml-2">Configure</Button></li>
      </ul>
      <Button className="mt-2">Add Integration</Button>
    </section>
  );
}
