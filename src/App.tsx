import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Teams from '@/pages/Teams';
import Championships from '@/pages/Championships';
import ChampionshipDetail from '@/pages/ChampionshipDetail';
import Contact from '@/pages/Contact';
import Matches from '@/pages/Matches';
import Statistics from '@/pages/Statistics';
import Standings from '@/pages/Standings';
import ScrollToTop from '@/components/ScrollToTop';
import { Toaster } from '@/components/ui/toaster';
import LoadBaseForteData from '@/pages/admin/LoadBaseForteData';
import UpdateMatchResults from '@/pages/admin/UpdateMatchResults';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/championships" element={<Championships />} />
          <Route path="/championships/:id" element={<ChampionshipDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/partidas" element={<Matches />} />
          <Route path="/jogos" element={<Matches />} />
          <Route path="/estatisticas" element={<Statistics />} />
          <Route path="/classificacao" element={<Standings />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<div>Admin Dashboard</div>} />
          <Route path="/admin/load-base-forte-data" element={<LoadBaseForteData />} />
          <Route path="/admin/update-match-results" element={<UpdateMatchResults />} />
          
          {/* Add more routes as needed */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
