import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth provider
import { AuthProviderWrapper, withAuth } from './hooks/useAuth';

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
import ResetPassword from './pages/ResetPassword';

// Páginas Auth
import Login from './pages/Login';
import Reset from './pages/Reset';

// Páginas Admin
import AdminDashboard from './pages/AdminDashboard';
import AdminStandings from './pages/AdminStandings';

// Páginas de time
import TeamLogin from './pages/TeamLogin';
import TeamDashboard from './pages/TeamDashboard';

// Componentes
import { Toaster } from './components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ScrollToTop from './components/ScrollToTop';
import BackToTopButton from './components/BackToTopButton';

// Wrap protected routes
const ProtectedAdminDashboard = withAuth(AdminDashboard, 'admin');
const ProtectedAdminStandings = withAuth(AdminStandings, 'admin');
const ProtectedTeamDashboard = withAuth(TeamDashboard, 'team');

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

import AddMatchDataPage from './pages/admin/AddMatchDataPage';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProviderWrapper>
          {/* ScrollToTop garante que as páginas começam do topo quando navegamos */}
          <ScrollToTop />
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

                {/* Rotas de Autenticação */}
                <Route path="/admin/login" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset" element={<Reset />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/team/login" element={<TeamLogin />} />

                {/* Rotas Admin Protegidas */}
                <Route path="/admin" element={<ProtectedAdminDashboard />} />
                <Route path="/admin/championships" element={<ProtectedAdminDashboard />} />
                <Route path="/admin/teams" element={<ProtectedAdminDashboard />} />
                <Route path="/admin/matches" element={<ProtectedAdminDashboard />} />
                <Route path="/admin/standings" element={<ProtectedAdminStandings />} />
                <Route path="/admin/statistics" element={<ProtectedAdminDashboard />} />
                <Route path="/admin/statistics/top-scorers" element={<ProtectedAdminDashboard />} />
                <Route path="/admin/statistics/yellow-cards" element={<ProtectedAdminDashboard />} />
                <Route path="/admin/gallery" element={<ProtectedAdminDashboard />} />
                <Route path="/admin/transparency" element={<ProtectedAdminDashboard />} />
                <Route path="/admin/sync" element={<ProtectedAdminDashboard />} />

                {/* Rotas de Time Protegidas */}
                <Route path="/team/dashboard" element={<ProtectedTeamDashboard />} />

                {/* Redirects */}
                <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
                <Route path="/team" element={<Navigate to="/team/dashboard" replace />} />

                {/* Rota 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            {/* Botão para voltar ao topo e para a página inicial */}
            <BackToTopButton />
            <Toaster />
          </div>
        </AuthProviderWrapper>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
