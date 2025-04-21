
import React from "react";

export function AgentOverview() {
  // This will show a summary of the super agent's identity and state.
  return (
    <section className="mb-4 p-4 bg-card rounded shadow">
      <h2 className="font-bold text-lg mb-2">Super Agent Overview</h2>
      <div className="text-muted-foreground text-sm">
        {/* Placeholder for basic info */}
        <p>Name: <span className="font-medium">My Super Agent</span></p>
        <p>Status: <span className="font-medium text-green-600">Running</span></p>
        <p>Description: <span>Automates prospecting & messaging workflows.</span></p>
      </div>
    </section>
  );
}
