
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, Clipboard, Trophy, Calendar, BarChart, 
  Settings, LogOut, UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import TeamManagement from '@/components/admin/TeamManagement';
import MatchManagement from '@/components/admin/MatchManagement';
import PlayerManagement from '@/components/admin/PlayerManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    // Implementar autenticação real no futuro com Supabase
    toast({
      title: "Desconectado",
      description: "Você foi desconectado com sucesso.",
      duration: 3000,
    });
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a237e]">Painel Administrativo</h1>
          <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut size={16} />
            Sair
          </Button>
        </div>
        
        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="grid grid-cols-6 mb-8">
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Users size={16} />
              <span className="hidden md:inline">Times</span>
            </TabsTrigger>
            <TabsTrigger value="players" className="flex items-center gap-2">
              <UserPlus size={16} />
              <span className="hidden md:inline">Jogadores</span>
            </TabsTrigger>
            <TabsTrigger value="matches" className="flex items-center gap-2">
              <Clipboard size={16} />
              <span className="hidden md:inline">Partidas</span>
            </TabsTrigger>
            <TabsTrigger value="championships" className="flex items-center gap-2">
              <Trophy size={16} />
              <span className="hidden md:inline">Campeonatos</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar size={16} />
              <span className="hidden md:inline">Agenda</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart size={16} />
              <span className="hidden md:inline">Estatísticas</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="teams">
            <TeamManagement />
          </TabsContent>
          
          <TabsContent value="players">
            <PlayerManagement />
          </TabsContent>
          
          <TabsContent value="matches">
            <MatchManagement />
          </TabsContent>
          
          <TabsContent value="championships">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-[#1a237e] mb-4">Gerenciamento de Campeonatos</h2>
              <p className="text-gray-500">Em breve: Gerenciamento completo de campeonatos.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-[#1a237e] mb-4">Gerenciamento de Agenda</h2>
              <p className="text-gray-500">Em breve: Visualização e gerenciamento de agenda de jogos.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="statistics">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-[#1a237e] mb-4">Estatísticas</h2>
              <p className="text-gray-500">Em breve: Visualização e gerenciamento de estatísticas avançadas, incluindo artilheiros, assistências e outras métricas.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
