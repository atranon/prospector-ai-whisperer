
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
