import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import IcpPage from "./pages/IcpPage";
import MessagingPage from "./pages/MessagingPage";
import ProspectingPage from "./pages/ProspectingPage";
import SettingsPage from "./pages/SettingsPage";
import AgentPage from "./pages/AgentPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/components/auth/AuthProvider";
import AuthForm from "@/components/auth/AuthForm";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import React from "react";

const queryClient = new QueryClient();

const ProtectedApp = () => {
  const { user, loading, signOut } = useSupabaseAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <>
      <div className="fixed top-0 right-0 p-2 z-50">
        <button
          onClick={signOut}
          className="rounded px-3 py-1 text-sm bg-muted text-muted-foreground border hover:bg-destructive hover:text-destructive-foreground">
          Logout
        </button>
      </div>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/icp" element={<IcpPage />} />
          <Route path="/messaging" element={<MessagingPage />} />
          <Route path="/prospecting" element={<ProspectingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/agent" element={<AgentPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <AuthProvider>
    <TooltipProvider>
      <QueryClientProvider client={queryClient}>
        <ProtectedApp />
      </QueryClientProvider>
    </TooltipProvider>
  </AuthProvider>
);

export default App;
