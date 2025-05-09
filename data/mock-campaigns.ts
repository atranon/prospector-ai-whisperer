import type { Campaign } from "@/components/outreach/campaign-card"

export const mockCampaigns: Campaign[] = [
  {
    id: 1,
    name: "Q2 IT Directors Campaign",
    description: "Targeting IT Directors in Finance sector",
    status: "active",
    progress: 65,
    stats: {
      leads: 120,
      sent: 78,
      responses: 14,
      meetings: 5,
    },
    startDate: "Apr 15, 2023",
    endDate: "Jun 30, 2023",
  },
  {
    id: 2,
    name: "CTOs in Healthcare",
    description: "Outreach to CTOs in Healthcare companies",
    status: "paused",
    progress: 32,
    stats: {
      leads: 85,
      sent: 27,
      responses: 6,
      meetings: 2,
    },
    startDate: "May 1, 2023",
    endDate: "Jul 15, 2023",
  },
  {
    id: 3,
    name: "Tech Leads Follow-up",
    description: "Follow-up campaign for previous contacts",
    status: "scheduled",
    progress: 0,
    stats: {
      leads: 50,
      sent: 0,
      responses: 0,
      meetings: 0,
    },
    startDate: "Jun 1, 2023",
    endDate: "Jul 31, 2023",
  },
]
