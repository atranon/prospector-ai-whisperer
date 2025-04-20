
import { Sidebar } from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { ICPBuilder } from "@/components/icp/ICPBuilder";

const IcpPage = () => {
  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:block w-64">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">ICP Builder</h1>
            <p className="text-muted-foreground">Define your ideal customer profile for targeted prospecting</p>
          </div>
          <ICPBuilder />
        </main>
      </div>
    </div>
  );
};

export default IcpPage;
