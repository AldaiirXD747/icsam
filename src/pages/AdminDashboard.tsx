
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, Clipboard, Trophy, Calendar, BarChart, 
  Settings, LogOut 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    // In a real app, this would call supabase.auth.signOut()
    toast({
      title: "Desconectado",
      description: "Você foi desconectado com sucesso.",
      duration: 3000,
    });
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut size={16} />
            Sair
          </Button>
        </div>
        
        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Users size={16} />
              <span className="hidden md:inline">Times</span>
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
          
          <TabsContent value="teams" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Gerenciar Times</h2>
              <p className="text-gray-600 mb-6">Adicione, edite ou remova times do sistema.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* This would be populated with team management components */}
                <div className="border rounded-lg p-4 text-center">
                  <p className="font-semibold">Adicionar Novo Time</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <p className="font-semibold">Editar Times Existentes</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <p className="font-semibold">Gerenciar Jogadores</p>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="matches" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Gerenciar Partidas</h2>
              <p className="text-gray-600">Adicione resultados de jogos e agende novas partidas.</p>
            </Card>
          </TabsContent>
          
          <TabsContent value="championships" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Gerenciar Campeonatos</h2>
              <p className="text-gray-600">Crie e gerencie campeonatos e torneios.</p>
            </Card>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Agenda de Jogos</h2>
              <p className="text-gray-600">Visualize e organize o calendário de jogos.</p>
            </Card>
          </TabsContent>
          
          <TabsContent value="statistics" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Estatísticas</h2>
              <p className="text-gray-600">Visualize dados e estatísticas do sistema.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
