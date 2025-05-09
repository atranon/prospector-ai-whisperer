
import { Sidebar } from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { AgentOverview } from "@/components/agent/AgentOverview";
import { AgentActions } from "@/components/agent/AgentActions";
import { AgentTasks } from "@/components/agent/AgentTasks";
import { AgentHeader } from "@/components/agent/AgentHeader";
import { AgentTabLayout } from "@/components/agent/AgentTabLayout";

const AgentPage = () => {
  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:block w-64">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <AgentHeader />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 space-y-6">
              <AgentOverview />
              <AgentActions />
              <AgentTasks />
            </div>
            <div className="col-span-1 md:col-span-2 space-y-6">
              <AgentTabLayout />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AgentPage;
