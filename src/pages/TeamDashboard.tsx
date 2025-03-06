
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Users, LogOut, Calendar, Trophy, Settings, BarChart3, User
} from 'lucide-react';
import TeamPlayerManagement from '@/components/team/TeamPlayerManagement';
import TeamMatchesView from '@/components/team/TeamMatchesView';
import TeamProfile from '@/components/team/TeamProfile';
import TeamStats from '@/components/team/TeamStats';

const TeamDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkTeamAuth = async () => {
      try {
        setLoading(true);
        
        // Check current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!sessionData.session) {
          // If no session, redirect to login
          navigate('/team/login');
          return;
        }
        
        // Get user data
        const userData = sessionData.session.user;
        setUser(userData);
        
        if (!userData) {
          navigate('/team/login');
          return;
        }
        
        // Check if user has team_id in user metadata
        const teamId = userData.user_metadata?.team_id;
        
        if (!teamId) {
          // Check if user is in team_accounts table
          const { data: accountData, error: accountError } = await supabase
            .from('team_accounts')
            .select('team_id')
            .eq('user_id', userData.id)
            .single();
            
          if (accountError || !accountData) {
            // Not a team user
            toast({
              variant: "destructive",
              title: "Acesso negado",
              description: "Sua conta não está associada a nenhum time."
            });
            
            // Sign out and redirect
            await supabase.auth.signOut();
            navigate('/team/login');
            return;
          }
          
          // Found team_id in team_accounts
          const accountTeamId = accountData.team_id;
          
          // Get team data
          const { data: teamData, error: teamError } = await supabase
            .from('teams')
            .select('*')
            .eq('id', accountTeamId)
            .single();
            
          if (teamError || !teamData) {
            toast({
              variant: "destructive",
              title: "Time não encontrado",
              description: "Não foi possível encontrar informações do seu time."
            });
            
            // Sign out and redirect
            await supabase.auth.signOut();
            navigate('/team/login');
            return;
          }
          
          setTeam(teamData);
        } else {
          // User has team_id in metadata, get team data
          const { data: teamData, error: teamError } = await supabase
            .from('teams')
            .select('*')
            .eq('id', teamId)
            .single();
            
          if (teamError || !teamData) {
            toast({
              variant: "destructive",
              title: "Time não encontrado",
              description: "Não foi possível encontrar informações do seu time."
            });
            
            // Sign out and redirect
            await supabase.auth.signOut();
            navigate('/team/login');
            return;
          }
          
          setTeam(teamData);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Ocorreu um erro ao verificar seu acesso."
        });
        
        // Sign out and redirect
        await supabase.auth.signOut();
        navigate('/team/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkTeamAuth();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          // Handle sign out
          setUser(null);
          setTeam(null);
          navigate('/team/login');
        } else if (event === 'SIGNED_IN' && session) {
          // Update user data on sign in
          setUser(session.user);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, toast]);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Carregando painel do time...</p>
      </div>
    );
  }
  
  if (!team) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-500 mb-4">Não foi possível carregar os dados do time.</p>
        <Button variant="outline" onClick={() => navigate('/team/login')}>
          Voltar para o login
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-[#1a237e] text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            {team.logo ? (
              <img 
                src={team.logo} 
                alt={team.name} 
                className="w-10 h-10 object-contain bg-white rounded-full p-1" 
              />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center bg-white text-[#1a237e] rounded-full">
                <Users size={20} />
              </div>
            )}
            <div>
              <h1 className="font-bold text-lg">{team.name}</h1>
              <p className="text-xs opacity-80">{team.category} - Grupo {team.group_name}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={handleLogout} 
            className="text-white flex items-center gap-2"
          >
            <LogOut size={18} />
            <span className="hidden md:inline">Sair</span>
          </Button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Tabs defaultValue="players" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="players" className="flex items-center gap-2">
              <Users size={16} />
              <span className="hidden md:inline">Jogadores</span>
            </TabsTrigger>
            <TabsTrigger value="matches" className="flex items-center gap-2">
              <Calendar size={16} />
              <span className="hidden md:inline">Jogos</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 size={16} />
              <span className="hidden md:inline">Estatísticas</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Settings size={16} />
              <span className="hidden md:inline">Perfil do Time</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="players">
            <TeamPlayerManagement teamId={team.id} />
          </TabsContent>
          
          <TabsContent value="matches">
            <TeamMatchesView teamId={team.id} />
          </TabsContent>
          
          <TabsContent value="statistics">
            <TeamStats teamId={team.id} />
          </TabsContent>
          
          <TabsContent value="profile">
            <TeamProfile team={team} teamId={team.id} />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-100 p-4 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Instituto Criança Santa Maria - Painel do Time</p>
      </footer>
    </div>
  );
};

export default TeamDashboard;
