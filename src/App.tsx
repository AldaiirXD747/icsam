import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Páginas
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import Championships from './pages/Championships';
import Championship from './pages/Championship';
import Matches from './pages/Matches';
import MatchDetail from './pages/MatchDetail';
import Standings from './pages/Standings';
import Statistics from './pages/Statistics';
import Gallery from './pages/Gallery';
import PlayerDetail from './pages/PlayerDetail';
import Transparencia from './pages/Transparencia';
import NotFound from './pages/NotFound';

// Páginas Admin
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminStandings from './pages/AdminStandings';

// Páginas de time
import TeamLogin from './pages/TeamLogin';
import TeamDashboard from './pages/TeamDashboard';

// Componentes
import { Toaster } from './components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <div className="flex-grow">
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<Index />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/contato" element={<Contact />} />
              
              {/* Rotas em português e inglês para compatibilidade */}
              <Route path="/times" element={<Teams />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/times/:id" element={<TeamDetail />} />
              <Route path="/teams/:id" element={<TeamDetail />} />
              
              <Route path="/campeonatos" element={<Championships />} />
              <Route path="/championships" element={<Championships />} />
              <Route path="/campeonatos/:id" element={<Championship />} />
              <Route path="/championships/:id" element={<Championship />} />
              
              <Route path="/jogos" element={<Matches />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/jogos/:id" element={<MatchDetail />} />
              <Route path="/matches/:id" element={<MatchDetail />} />
              
              <Route path="/classificacao" element={<Standings />} />
              <Route path="/standings" element={<Standings />} />
              
              <Route path="/estatisticas" element={<Statistics />} />
              <Route path="/statistics" element={<Statistics />} />
              
              <Route path="/galeria" element={<Gallery />} />
              <Route path="/gallery" element={<Gallery />} />
              
              <Route path="/jogadores/:id" element={<PlayerDetail />} />
              <Route path="/players/:id" element={<PlayerDetail />} />
              
              <Route path="/transparencia" element={<Transparencia />} />

              {/* Rotas Admin */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/championships" element={<AdminDashboard />} />
              <Route path="/admin/teams" element={<AdminDashboard />} />
              <Route path="/admin/matches" element={<AdminDashboard />} />
              <Route path="/admin/standings" element={<AdminStandings />} />
              <Route path="/admin/statistics" element={<AdminDashboard />} />
              <Route path="/admin/statistics/top-scorers" element={<AdminDashboard />} />
              <Route path="/admin/statistics/yellow-cards" element={<AdminDashboard />} />
              <Route path="/admin/gallery" element={<AdminDashboard />} />
              <Route path="/admin/transparency" element={<AdminDashboard />} />
              <Route path="/admin/sync" element={<AdminDashboard />} />

              {/* Rotas de Times */}
              <Route path="/team/login" element={<TeamLogin />} />
              <Route path="/team/dashboard" element={<TeamDashboard />} />

              {/* Rota 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
