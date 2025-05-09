
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FolderIcon, MessagesSquare, Settings, Users, Search, Bot } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: FolderIcon,
  },
  {
    title: "ICP Builder",
    href: "/icp",
    icon: Users,
  },
  {
    title: "Prospecting",
    href: "/prospecting",
    icon: Search,
  },
  {
    title: "Messaging",
    href: "/messaging",
    icon: MessagesSquare,
  },
  {
    title: "Agent",
    href: "/agent",
    icon: Bot,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const location = useLocation();
  
  return (
    <div className="group flex flex-col bg-sidebar h-full border-r">
      <ScrollArea className="flex-1">
        <div className="px-3 py-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  location.pathname === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
                
                {item.title === "Messaging" && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                    5
                  </span>
                )}
              </Link>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="space-y-1">
            <div className="px-3 py-2">
              <h3 className="text-xs font-medium text-sidebar-foreground">Recent Campaigns</h3>
            </div>
            {["SaaS Companies Q2", "Enterprise CTOs", "Startup Founders"].map((campaign) => (
              <Button
                key={campaign}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              >
                {campaign}
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
      <div className="p-3 border-t">
        <Button className="w-full" size="sm">
          <span className="sr-only">New Campaign</span>
          <span>+ New Campaign</span>
        </Button>
      </div>
    </div>
  );
}
