
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, BarChart, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import TeamPlayerManagement from '@/components/team/TeamPlayerManagement';
import TeamMatchesView from '@/components/team/TeamMatchesView';
import TeamProfile from '@/components/team/TeamProfile';
import TeamStats from '@/components/team/TeamStats';

const TeamDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teamId, setTeamId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    checkAuth();
  }, []);
  
  const checkAuth = async () => {
    try {
      setLoading(true);
      
      // Check if user is logged in
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      
      if (!session) {
        // Not logged in, redirect to login
        toast({
          variant: "destructive",
          title: "Acesso negado",
          description: "Faça login para acessar o painel do time."
        });
        navigate('/team/login');
        return;
      }
      
      // Get user data from session
      const user = session.user;
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Não foi possível carregar os dados do usuário."
        });
        navigate('/team/login');
        return;
      }
      
      // Check if user is a team account
      // For teams, we expect user.user_metadata.team_id to be set
      const teamId = user.user_metadata?.team_id;
      
      if (!teamId) {
        toast({
          variant: "destructive",
          title: "Acesso negado",
          description: "Esta conta não está associada a nenhum time."
        });
        navigate('/team/login');
        return;
      }
      
      // Get team details
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('name')
        .eq('id', teamId)
        .single();
        
      if (teamError) throw teamError;
      
      if (!teamData) {
        toast({
          variant: "destructive",
          title: "Time não encontrado",
          description: "O time associado a esta conta não foi encontrado."
        });
        navigate('/team/login');
        return;
      }
      
      setTeamId(teamId);
      setTeamName(teamData.name);
    } catch (error) {
      console.error('Error checking auth:', error);
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: "Ocorreu um erro ao verificar suas credenciais."
      });
      navigate('/team/login');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast({
        title: "Desconectado",
        description: "Você foi desconectado com sucesso."
      });
      navigate('/team/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Erro ao desconectar",
        description: "Ocorreu um erro ao tentar desconectar."
      });
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-20 flex-grow flex items-center justify-center">
          <p className="text-gray-500">Carregando painel do time...</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!teamId) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-20 flex-grow flex items-center justify-center">
          <p className="text-gray-500">Acesso não autorizado.</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a237e]">Painel do Time - {teamName}</h1>
          <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut size={16} />
            Sair
          </Button>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Settings size={16} />
              <span className="hidden md:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="players" className="flex items-center gap-2">
              <Users size={16} />
              <span className="hidden md:inline">Jogadores</span>
            </TabsTrigger>
            <TabsTrigger value="matches" className="flex items-center gap-2">
              <Calendar size={16} />
              <span className="hidden md:inline">Partidas</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart size={16} />
              <span className="hidden md:inline">Estatísticas</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <TeamProfile teamId={teamId} />
          </TabsContent>
          
          <TabsContent value="players">
            <TeamPlayerManagement teamId={teamId} />
          </TabsContent>
          
          <TabsContent value="matches">
            <TeamMatchesView teamId={teamId} />
          </TabsContent>
          
          <TabsContent value="stats">
            <TeamStats teamId={teamId} />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default TeamDashboard;
