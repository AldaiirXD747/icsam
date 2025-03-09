
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Teams from '@/pages/Teams';
import Championships from '@/pages/Championships';
import Contact from '@/pages/Contact';
import Matches from '@/pages/Matches';
import Statistics from '@/pages/Statistics';
import Standings from '@/pages/Standings';
import NotFound from '@/pages/NotFound';
import ScrollToTop from '@/components/ScrollToTop';
import { Toaster } from '@/components/ui/toaster';
import LoadBaseForteData from '@/pages/admin/LoadBaseForteData';
import UpdateMatchResults from '@/pages/admin/UpdateMatchResults';
import DatabaseCleanup from '@/pages/admin/DatabaseCleanup';

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/championships" element={<Championships />} />
          <Route path="/championships/:id" element={<div>Championship Details</div>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/partidas" element={<Matches />} />
          <Route path="/jogos" element={<Matches />} />
          <Route path="/estatisticas" element={<Statistics />} />
          <Route path="/estatisticas/base-forte-2025" element={<Statistics />} />
          <Route path="/classificacao" element={<Standings />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<div>Admin Dashboard</div>} />
          <Route path="/admin/load-base-forte-data" element={<LoadBaseForteData />} />
          <Route path="/admin/update-match-results" element={<UpdateMatchResults />} />
          <Route path="/admin/database-cleanup" element={<DatabaseCleanup />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
