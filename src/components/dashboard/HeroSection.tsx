
export function HeroSection() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Welcome to <span className="gradient-text">ProspectorAI</span></h1>
        <p className="text-muted-foreground">Your intelligent assistant for client prospecting and outreach</p>
      </div>
      <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="flex flex-col gap-1 rounded-lg border p-3">
          <h3 className="font-medium">Define your ICP</h3>
          <p className="text-sm text-muted-foreground">Set up your ideal customer profile criteria</p>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border p-3">
          <h3 className="font-medium">Find Prospects</h3>
          <p className="text-sm text-muted-foreground">Discover potential clients matching your ICP</p>
        </div>
        <div className="flex flex-col gap-1 rounded-lg border p-3">
          <h3 className="font-medium">Automate Outreach</h3>
          <p className="text-sm text-muted-foreground">Connect and engage with personalized messages</p>
        </div>
      </div>
    </div>
  );
}
