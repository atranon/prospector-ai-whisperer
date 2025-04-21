
import { Sidebar } from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SettingsTabs } from "@/components/settings/SettingsTabs";

const SettingsPage = () => {
  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:block w-64">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <SettingsHeader />
          <SettingsTabs />
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
