
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, Mail, MessageSquare } from "lucide-react";

type Prospect = {
  id: string;
  name: string;
  company: string;
  title: string;
  email?: string;
  linkedin?: string;
  matchScore: number;
  status: "new" | "contacted" | "responded" | "meeting" | "not-interested";
  lastContact?: string;
  avatar?: string;
};

const prospects: Prospect[] = [
  {
    id: "1",
    name: "Alex Johnson",
    company: "TechCorp Inc.",
    title: "CTO",
    email: "alex@techcorp.com",
    linkedin: "linkedin.com/in/alexj",
    matchScore: 92,
    status: "new",
  },
  {
    id: "2",
    name: "Sarah Williams",
    company: "Growth Ventures",
    title: "CMO",
    email: "sarah@growthventures.com",
    linkedin: "linkedin.com/in/sarahw",
    matchScore: 87,
    status: "contacted",
    lastContact: "2 days ago",
  },
  {
    id: "3",
    name: "Michael Chen",
    company: "Innovate Solutions",
    title: "VP of Engineering",
    email: "michael@innovatesolutions.com",
    linkedin: "linkedin.com/in/michaelc",
    matchScore: 85,
    status: "responded",
    lastContact: "1 day ago",
  },
  {
    id: "4",
    name: "Jessica Rodriguez",
    company: "Future Finance",
    title: "Director of Operations",
    email: "jessica@futurefinance.com",
    linkedin: "linkedin.com/in/jessicar",
    matchScore: 78,
    status: "meeting",
    lastContact: "3 days ago",
  },
  {
    id: "5",
    name: "David Kim",
    company: "Strategic Systems",
    title: "CEO",
    email: "david@strategicsystems.com",
    linkedin: "linkedin.com/in/davidk",
    matchScore: 76,
    status: "not-interested",
    lastContact: "1 week ago",
  },
  {
    id: "6",
    name: "Emily Clark",
    company: "DataTech Solutions",
    title: "CIO",
    email: "emily@datatech.com",
    linkedin: "linkedin.com/in/emilyc",
    matchScore: 89,
    status: "new",
  },
  {
    id: "7",
    name: "Robert Patel",
    company: "Cloud Innovations",
    title: "VP of Product",
    email: "robert@cloudinnovations.com",
    linkedin: "linkedin.com/in/robertp",
    matchScore: 82,
    status: "contacted",
    lastContact: "1 day ago",
  },
];

export function ProspectingDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  const filteredProspects = prospects.filter(prospect => {
    // Apply status filter
    if (filterStatus !== "all" && prospect.status !== filterStatus) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return prospect.name.toLowerCase().includes(query) || 
             prospect.company.toLowerCase().includes(query) ||
             prospect.title.toLowerCase().includes(query);
    }
    
    return true;
  });
  
  const getStatusBadge = (status: Prospect["status"]) => {
    switch(status) {
      case "new":
        return <Badge className="bg-blue-500">New</Badge>;
      case "contacted":
        return <Badge variant="outline" className="text-orange-500 border-orange-500">Contacted</Badge>;
      case "responded":
        return <Badge className="bg-green-500">Responded</Badge>;
      case "meeting":
        return <Badge className="bg-violet-500">Meeting Set</Badge>;
      case "not-interested":
        return <Badge variant="outline" className="text-gray-500 border-gray-500">Not Interested</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Prospect Management</CardTitle>
            <CardDescription>
              Manage and track your prospecting activities
            </CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prospects..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>{filterStatus === "all" ? "All Status" : filterStatus}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="meeting">Meeting Set</SelectItem>
                  <SelectItem value="not-interested">Not Interested</SelectItem>
                </SelectContent>
              </Select>
              
              <Button className="flex-shrink-0">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="relative overflow-x-auto rounded-md border">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted">
              <tr>
                <th scope="col" className="px-6 py-3">Prospect</th>
                <th scope="col" className="px-6 py-3">Match</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Last Contact</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProspects.map((prospect) => (
                <tr key={prospect.id} className="bg-card border-b hover:bg-muted/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={prospect.avatar} />
                        <AvatarFallback>{prospect.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{prospect.name}</div>
                        <div className="text-xs text-muted-foreground">{prospect.title} at {prospect.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className={`mr-1.5 h-2 w-2 rounded-full ${
                        prospect.matchScore > 85 ? 'bg-green-500' : 
                        prospect.matchScore > 75 ? 'bg-orange-500' : 'bg-gray-500'
                      }`}></span>
                      {prospect.matchScore}%
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(prospect.status)}
                  </td>
                  <td className="px-6 py-4">
                    {prospect.lastContact || "Never"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button size="sm">
                        Contact
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredProspects.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No prospects match your filters. Try adjusting your search criteria.
          </div>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredProspects.length} of {prospects.length} prospects
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-6 flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h3 className="font-medium mb-1">AI Assistant Insights</h3>
          <div className="text-sm text-muted-foreground">
            3 prospects haven't been contacted in the past 7 days. 
            <Button variant="link" className="p-0 h-auto text-sm">Run follow-up sequence</Button>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">Export List</Button>
          <Button>
            <Mail className="mr-2 h-4 w-4" />
            Bulk Message
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
