
import React from "react";

export function AgentTasks() {
  // This would list the current and recent tasks for the agent.
  return (
    <section className="p-4 bg-card rounded shadow mt-4">
      <h2 className="font-bold text-lg mb-2">Current Tasks</h2>
      <ul className="list-disc ml-5 text-muted-foreground">
        <li>Prospecting for SaaS clients</li>
        <li>Running messaging sequence #2</li>
        <li>Monitoring inbox responses</li>
      </ul>
    </section>
  );
}
