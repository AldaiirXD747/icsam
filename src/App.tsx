
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import Index from './pages/Index';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Reset from './pages/Reset';
import ResetPassword from './pages/ResetPassword';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import Championship from './pages/Championship';
import Matches from './pages/Matches';
import MatchDetail from './pages/MatchDetail';
import Statistics from './pages/Statistics';
import Standings from './pages/Standings';
import TeamLogin from './pages/TeamLogin';
import TeamDashboard from './pages/TeamDashboard';
import Transparencia from './pages/Transparencia';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Championships from './pages/Championships';
import Sobre from './pages/Sobre';
import PlayerDetail from './pages/PlayerDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminStandings from './pages/AdminStandings';
import { AuthProvider } from './hooks/auth';
import { useUser } from './lib/clerk-mock';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from './components/ui/toaster';
import ErrorBoundary from './components/ErrorBoundary';
import { executeDataCleanup } from './utils/executeDataCleanup';
import DatabaseCleanup from './pages/admin/DatabaseCleanup';
import LoadBaseForteData from './pages/admin/LoadBaseForteData';

function App() {
  // Execute the data cleanup once
  useEffect(() => {
    // Execute the data cleanup function
    executeDataCleanup().then(result => {
      console.log("Cleanup completed on app load:", result);
    });
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/transparencia" element={<Transparencia />} />
            <Route path="/galeria" element={<Gallery />} />
            <Route path="/contato" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset" element={<Reset />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/team-login" element={<TeamLogin />} />
            <Route path="/team-dashboard" element={<TeamDashboard />} />
            <Route path="/times" element={<Teams />} />
            <Route path="/team/:id" element={<TeamDetail />} />
            <Route path="/player/:id" element={<PlayerDetail />} />
            <Route path="/campeonatos" element={<Championships />} />
            <Route path="/campeonatos/:id" element={<Championship />} />
            <Route path="/partidas" element={<Matches />} />
            <Route path="/match/:id" element={<MatchDetail />} />
            <Route path="/estatisticas" element={<Statistics />} />
            <Route path="/classificacao" element={<Standings />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/standings" element={<AdminStandings />} />
            <Route path="/admin/database-cleanup" element={<DatabaseCleanup />} />
            <Route path="/admin/load-base-forte" element={<LoadBaseForteData />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
