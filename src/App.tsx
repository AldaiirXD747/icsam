
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Index from '@/pages/Index'
import About from '@/pages/About'
import Teams from '@/pages/Teams'
import Championships from '@/pages/Championships'
import Championship from '@/pages/Championship'
import Contact from '@/pages/Contact'
import Matches from '@/pages/Matches'
import AdminDashboard from '@/pages/AdminDashboard'
import DatabaseCleanup from '@/pages/admin/DatabaseCleanup'
import LoadBaseForteData from '@/pages/admin/LoadBaseForteData'
import ScrollToTop from '@/components/ScrollToTop'
import BackToTopButton from '@/components/BackToTopButton'
import Standings from '@/pages/Standings'
import Statistics from '@/pages/Statistics'
import '@/App.css'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/times" element={<Teams />} />
          <Route path="/campeonatos" element={<Championships />} />
          <Route path="/campeonatos/:id" element={<Championship />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/partidas" element={<Matches />} />
          <Route path="/jogos" element={<Matches />} />
          <Route path="/estatisticas" element={<Statistics />} />
          <Route path="/classificacao" element={<Standings />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/database-cleanup" element={<DatabaseCleanup />} />
          <Route path="/admin/load-base-forte" element={<LoadBaseForteData />} />
        </Routes>
        <ScrollToTop />
        <BackToTopButton />
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
