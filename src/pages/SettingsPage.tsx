
import { Sidebar } from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IntegrationsPanel from "@/components/settings/IntegrationsPanel";
import ApiConfigurationPanel from "@/components/settings/ApiConfigurationPanel";
import AccountSettingsPanel from "@/components/settings/AccountSettingsPanel";

const SettingsPage = () => {
  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:block w-64">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Configure your ProspectorAI account and integrations</p>
          </div>
          <Tabs defaultValue="integrations" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="integrations">Platform Integrations</TabsTrigger>
              <TabsTrigger value="api">API Configuration</TabsTrigger>
              <TabsTrigger value="account">Account Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="integrations">
              <IntegrationsPanel />
            </TabsContent>
            <TabsContent value="api">
              <ApiConfigurationPanel />
            </TabsContent>
            <TabsContent value="account">
              <AccountSettingsPanel />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
