import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"
import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/AboutPage'
import TeamsPage from '@/pages/TeamsPage'
import ChampionshipsPage from '@/pages/ChampionshipsPage'
import ChampionshipDetails from '@/pages/ChampionshipDetails'
import ContactPage from '@/pages/ContactPage'
import MatchesPage from '@/pages/MatchesPage'
import AdminDashboard from '@/pages/AdminDashboard'
import DatabaseCleanup from '@/pages/admin/DatabaseCleanup'
import LoadBaseForteData from '@/pages/admin/LoadBaseForteData'
import ScrollToTop from '@/components/ScrollToTop'
import BackToTopButton from '@/components/BackToTopButton'
import '@/App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/times" element={<TeamsPage />} />
        <Route path="/campeonatos" element={<ChampionshipsPage />} />
        <Route path="/campeonatos/:id" element={<ChampionshipDetails />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/partidas" element={<MatchesPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/database-cleanup" element={<DatabaseCleanup />} />
        <Route path="/admin/load-base-forte" element={<LoadBaseForteData />} />
      </Routes>
      <ScrollToTop />
      <BackToTopButton />
      <Toaster />
    </BrowserRouter>
  )
}

export default App
