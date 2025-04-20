
import { Sidebar } from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentProspects } from "@/components/dashboard/RecentProspects";
import { AIInsights } from "@/components/dashboard/AIInsights";

const Index = () => {
  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:block w-64">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="space-y-6">
            <HeroSection />
            <StatsCards />
            <div className="grid gap-6 md:grid-cols-2">
              <RecentProspects />
              <AIInsights />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
