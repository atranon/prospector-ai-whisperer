
import React from "react";

export function AgentLogs() {
  // Show the agent's recent logs (activity, errors, etc).
  return (
    <section className="p-4 bg-card rounded shadow mt-4">
      <h2 className="font-bold text-lg mb-2">Agent Logs</h2>
      <div className="bg-muted rounded px-3 py-2 text-xs font-mono text-muted-foreground">
        [2024-04-17 14:01] Started prospecting workflow. <br />
        [2024-04-17 14:05] Contacted 10 new leads. <br />
        [2024-04-17 14:10] Awaiting message replies... <br />
      </div>
    </section>
  );
}
