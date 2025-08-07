
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth-context';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

// Import pages
import Dashboard from './page';
import LoginPage from './auth/login/page';
import LeadsPage from './leads/page';
import OutreachPage from './outreach/page';
import SettingsPage from './settings/page';
import AnalyticsPage from './analytics/page';
import IntegrationsPage from './integrations/page';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" attribute="class">
      <AuthProvider>
        <Router>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route path="/leads" element={<LeadsPage />} />
                  <Route path="/outreach" element={<OutreachPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/integrations" element={<IntegrationsPage />} />
                </Routes>
              </div>
            </div>
          </SidebarProvider>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
