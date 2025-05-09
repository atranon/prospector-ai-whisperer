
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const integrations = [
  {
    section: "Social & Outreach Networks",
    items: [
      {
        name: "LinkedIn",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="none" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M8 11v5" /><circle cx="8" cy="8" r="1" /><path d="M12 16v-3a2 2 0 1 1 4 0v3" /></svg>
        ),
        description: "Find and message prospects",
      },
      {
        name: "X (Twitter)",
        icon: (
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3 21 21"/><path d="M21 3 3 21"/></svg>
        ),
        description: "Outreach on X/Twitter",
      },
      {
        name: "Sales Navigator",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" stroke="currentColor" fill="none" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M10 7h4v10h-4z" /><path d="M7 10h10v4H7z" /></svg>
        ),
        description: "Advanced LinkedIn outreach",
      },
    ],
  },
  {
    section: "Job Platforms",
    items: [
      {
        name: "Upwork",
        icon: <span className="font-bold text-green-600 text-lg">Up</span>,
        description: "Find freelancers & prospects",
      },
      {
        name: "Indeed",
        icon: <span className="font-bold text-blue-600 text-lg">in</span>,
        description: "Access top job seekers",
      },
    ],
  },
  {
    section: "CRM & Data Providers",
    items: [
      {
        name: "ZoomInfo",
        icon: (
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 16h8M8 12h8M8 8h8"/></svg>
        ),
        description: "B2B contact data",
      },
      {
        name: "Salesforce",
        icon: <span className="font-bold text-blue-600 text-base">SF</span>,
        description: "CRM integration",
      },
      {
        name: "HubSpot",
        icon: <span className="font-bold text-orange-600 text-base">HS</span>,
        description: "CRM integration",
      },
      {
        name: "Pipedrive",
        icon: <span className="font-bold text-gray-700 text-base">PD</span>,
        description: "CRM integration",
      },
    ],
  },
  {
    section: "Scheduling & Meetings",
    items: [
      {
        name: "Calendly",
        icon: (
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 8h8v8H8z"/></svg>
        ),
        description: "Schedule meetings",
      },
    ],
  },
  {
    section: "Communication",
    items: [
      {
        name: "Slack",
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 20 20"><rect width="2.5" height="7.5" rx="1" x="8.75" y="1"/><rect width="2.5" height="7.5" rx="1" x="8.75" y="11.5"/><rect width="7.5" height="2.5" rx="1" x="1" y="8.75"/><rect width="7.5" height="2.5" rx="1" x="11.5" y="8.75"/></svg>
        ),
        description: "Team communication",
      },
    ],
  },
];

export default function IntegrationsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Integrations</CardTitle>
        <CardDescription>
          Connect to the platforms you use for prospecting and outreach
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {integrations.map(section => (
          <div key={section.section}>
            <h4 className="font-semibold text-base mb-3">{section.section}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.items.map(item => (
                <div key={item.name} className="rounded-md border p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      item.name === "Slack"
                        ? "bg-pink-50"
                        : item.name === "Calendly"
                        ? "bg-purple-50"
                        : item.name === "HubSpot"
                        ? "bg-orange-50"
                        : item.name === "ZoomInfo"
                        ? "bg-yellow-50"
                        : item.name === "Indeed" || item.name === "Salesforce"
                        ? "bg-blue-50"
                        : item.name === "Pipedrive"
                        ? "bg-gray-100"
                        : item.name === "Upwork"
                        ? "bg-green-50"
                        : "bg-blue-100"
                    }`}>
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <Button>Connect</Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
