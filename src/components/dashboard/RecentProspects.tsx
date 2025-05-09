
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Prospect = {
  id: string;
  name: string;
  company: string;
  title: string;
  matchScore: number;
  avatar?: string;
};

const prospects: Prospect[] = [
  {
    id: "1",
    name: "Alex Johnson",
    company: "TechCorp Inc.",
    title: "CTO",
    matchScore: 92,
  },
  {
    id: "2",
    name: "Sarah Williams",
    company: "Growth Ventures",
    title: "CMO",
    matchScore: 87,
  },
  {
    id: "3",
    name: "Michael Chen",
    company: "Innovate Solutions",
    title: "VP of Engineering",
    matchScore: 85,
  },
  {
    id: "4",
    name: "Jessica Rodriguez",
    company: "Future Finance",
    title: "Director of Operations",
    matchScore: 78,
  },
  {
    id: "5",
    name: "David Kim",
    company: "Strategic Systems",
    title: "CEO",
    matchScore: 76,
  },
];

export function RecentProspects() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Prospects</CardTitle>
        <CardDescription>
          These contacts have been identified based on your current ICP settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {prospects.map((prospect) => (
            <div key={prospect.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={prospect.avatar} />
                  <AvatarFallback>{prospect.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{prospect.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {prospect.title} at {prospect.company}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center rounded-full bg-secondary px-2 text-xs">
                  <span className={`mr-1 h-2 w-2 rounded-full ${prospect.matchScore > 85 ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                  {prospect.matchScore}% match
                </div>
                <Button variant="outline" size="sm">
                  Message
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <Button variant="outline">View All Prospects</Button>
        </div>
      </CardContent>
    </Card>
  );
}
