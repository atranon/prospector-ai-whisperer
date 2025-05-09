
import React from "react";
import { Button } from "@/components/ui/button";

export function AgentActions() {
  // Actions: start/stop/restart agent, etc.
  return (
    <section className="flex gap-2 p-4 bg-card rounded shadow mt-4">
      <Button className="bg-green-600 hover:bg-green-700">Start</Button>
      <Button variant="destructive">Stop</Button>
      <Button variant="outline">Restart</Button>
    </section>
  );
}
