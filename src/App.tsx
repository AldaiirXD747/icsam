import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import './App.css';

// Pages
import Index from './pages/Index';
import About from './pages/About';
import Sobre from './pages/Sobre';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import Championships from './pages/Championships';
import Championship from './pages/Championship';
import Matches from './pages/Matches';
import MatchDetail from './pages/MatchDetail';
import PlayerDetail from './pages/PlayerDetail';
import Standings from './pages/Standings';
import Statistics from './pages/Statistics';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Transparencia from './pages/Transparencia';
import Login from './pages/Login';
import TeamLogin from './pages/TeamLogin';
import Reset from './pages/Reset';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import AdminStandings from './pages/AdminStandings';
import TeamDashboard from './pages/TeamDashboard';
import NotFound from './pages/NotFound';

// Admin Pages
import UpdateMatchResults from './pages/admin/UpdateMatchResults';
import AddMatchDataPage from './pages/admin/AddMatchDataPage';
import BatchPlayerRegistrationPage from './pages/admin/BatchPlayerRegistrationPage';
import LoadBaseForteData from './pages/admin/LoadBaseForteData';
import DatabaseCleanup from './pages/admin/DatabaseCleanup';

// Components
import ScrollToTop from './components/ScrollToTop';
import BackToTopButton from './components/BackToTopButton';
import ErrorBoundary from './components/ErrorBoundary';

// Authentication
import { withAuth } from './hooks/auth/withAuth';

const AdminDashboardAuth = withAuth(AdminDashboard, ['admin']);
const AdminStandingsAuth = withAuth(AdminStandings, ['admin']);
const UpdateMatchResultsAuth = withAuth(UpdateMatchResults, ['admin']);
const AddMatchDataPageAuth = withAuth(AddMatchDataPage, ['admin']);
const BatchPlayerRegistrationPageAuth = withAuth(BatchPlayerRegistrationPage, ['admin']);
const LoadBaseForteDataAuth = withAuth(LoadBaseForteData, ['admin']);
const DatabaseCleanupAuth = withAuth(DatabaseCleanup, ['admin']);
const TeamDashboardAuth = withAuth(TeamDashboard, ['team', 'team_manager']);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/times" element={<Teams />} />
          <Route path="/time/:teamId" element={<TeamDetail />} />
          <Route path="/campeonatos" element={<Championships />} />
          <Route path="/campeonato/:championshipId" element={<Championship />} />
          <Route path="/partidas" element={<Matches />} />
          <Route path="/partida/:matchId" element={<MatchDetail />} />
          <Route path="/jogador/:playerId" element={<PlayerDetail />} />
          <Route path="/tabelas" element={<Standings />} />
          <Route path="/estatisticas" element={<Statistics />} />
          <Route path="/galeria" element={<Gallery />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/transparencia" element={<Transparencia />} />
          <Route path="/login" element={<Login />} />
          <Route path="/team-login" element={<TeamLogin />} />
          <Route path="/reset" element={<Reset />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/admin" element={<AdminDashboardAuth />} />
          <Route path="/admin/tabelas" element={<AdminStandingsAuth />} />
          <Route path="/admin/update-match-results" element={<UpdateMatchResultsAuth />} />
          <Route path="/admin/add-match-data" element={<AddMatchDataPageAuth />} />
          <Route path="/admin/batch-player-registration" element={<BatchPlayerRegistrationPageAuth />} />
          <Route path="/admin/load-base-forte-data" element={<LoadBaseForteDataAuth />} />
          <Route path="/admin/database-cleanup" element={<DatabaseCleanupAuth />} />
          <Route path="/team-dashboard" element={<TeamDashboardAuth />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ScrollToTop />
        <BackToTopButton />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
