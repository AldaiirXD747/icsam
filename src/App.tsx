
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Teams from "./pages/Teams";
import TeamDetail from "./pages/TeamDetail";
import PlayerDetail from "./pages/PlayerDetail";
import Matches from "./pages/Matches";
import Statistics from "./pages/Statistics";
import Standings from "./pages/Standings";
import Championship from "./pages/Championship";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:teamId" element={<TeamDetail />} />
          <Route path="/players/:playerId" element={<PlayerDetail />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/championships/:championshipId" element={<Championship />} />
          <Route path="/championships/:championshipId/teams" element={<Teams />} />
          <Route path="/championships/:championshipId/matches" element={<Matches />} />
          <Route path="/championships/:championshipId/statistics" element={<Statistics />} />
          <Route path="/championships/:championshipId/standings" element={<Standings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
