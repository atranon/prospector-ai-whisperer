
import { Sidebar } from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { MessagingTemplates } from "@/components/messaging/MessagingTemplates";
import { AIAutomation } from "@/components/messaging/AIAutomation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MessagingPage = () => {
  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:block w-64">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Messaging Center</h1>
            <p className="text-muted-foreground">Create and manage outreach templates</p>
          </div>
          
          <Tabs defaultValue="templates" className="w-full mb-6">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="templates">Message Templates</TabsTrigger>
              <TabsTrigger value="ai">AI Automation</TabsTrigger>
            </TabsList>
            <TabsContent value="templates">
              <MessagingTemplates />
            </TabsContent>
            <TabsContent value="ai">
              <AIAutomation />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default MessagingPage;
