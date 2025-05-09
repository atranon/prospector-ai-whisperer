
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IntegrationsPanel from "@/components/settings/IntegrationsPanel";
import ApiConfigurationPanel from "@/components/settings/ApiConfigurationPanel";
import AccountSettingsPanel from "@/components/settings/AccountSettingsPanel";

export const SettingsTabs = () => (
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
);
