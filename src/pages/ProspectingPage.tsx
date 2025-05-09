
import { Sidebar } from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { ProspectingDashboard } from "@/components/prospecting/ProspectingDashboard";
import { Button } from "@/components/ui/button";

const ProspectingPage = () => {
  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:block w-64">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Prospecting</h1>
              <p className="text-muted-foreground">Find and manage potential clients that match your ICP</p>
            </div>
            
            <div className="flex flex-col xs:flex-row gap-2">
              <Button variant="outline">Import Prospects</Button>
              <Button className="bg-accent hover:bg-accent/90">Find New Prospects</Button>
            </div>
          </div>
          
          <ProspectingDashboard />
        </main>
      </div>
    </div>
  );
};

export default ProspectingPage;
