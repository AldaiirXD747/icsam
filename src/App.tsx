
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

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Index />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/times" element={<Teams />} />
        <Route path="/times/:id" element={<TeamDetail />} />
        <Route path="/campeonatos" element={<Championships />} />
        <Route path="/campeonatos/:id" element={<Championship />} />
        <Route path="/jogos" element={<Matches />} />
        <Route path="/jogos/:id" element={<MatchDetail />} />
        <Route path="/classificacao" element={<Standings />} />
        <Route path="/estatisticas" element={<Statistics />} />
        <Route path="/galeria" element={<Gallery />} />
        <Route path="/jogadores/:id" element={<PlayerDetail />} />
        <Route path="/transparencia" element={<Transparencia />} />

        {/* Rotas Admin */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/login" element={<Login />} /> {/* New route added for /login */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/championships" element={<AdminDashboard />} />
        <Route path="/admin/teams" element={<AdminDashboard />} />
        <Route path="/admin/matches" element={<AdminDashboard />} />
        <Route path="/admin/standings" element={<AdminStandings />} />
        <Route path="/admin/statistics" element={<AdminDashboard />} />
        <Route path="/admin/statistics/top-scorers" element={<AdminDashboard />} />
        <Route path="/admin/statistics/yellow-cards" element={<AdminDashboard />} />
        <Route path="/admin/gallery" element={<AdminDashboard />} />
        <Route path="/admin/sync" element={<AdminDashboard />} />

        {/* Rotas de Times */}
        <Route path="/team/login" element={<TeamLogin />} />
        <Route path="/team/dashboard" element={<TeamDashboard />} />

        {/* Rota 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
