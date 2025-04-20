
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  return (
    <header className="border-b border-border sticky top-0 bg-background z-10">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">P</div>
          <span>Prospector<span className="text-accent">AI</span></span>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          <div className="relative rounded-md hidden md:flex">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="pl-8 h-9 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent"></span>
          </Button>
          
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src="" alt="User" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
