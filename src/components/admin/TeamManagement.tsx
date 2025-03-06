
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Pencil, Trash2, Users, Mail, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Label } from '@/components/ui/label';

type Team = {
  id: string;
  name: string;
  logo: string | null;
  category: string;
  group_name: string;
  playerCount?: number;
  email?: string | null;
};

const TeamManagement = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const { toast } = useToast();
  const [isCredentialsDialogOpen, setIsCredentialsDialogOpen] = useState(false);

  // Team form states
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    group_name: '',
    logo: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Fetch teams data from Supabase
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      // Get teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('name');

      if (teamsError) throw teamsError;
      
      // Get player counts for each team using a separate query instead of group_by
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('team_id');
        
      if (playersError) throw playersError;
      
      // Count players per team manually
      const playerCountByTeam: Record<string, number> = {};
      playersData?.forEach(player => {
        if (player.team_id) {
          playerCountByTeam[player.team_id] = (playerCountByTeam[player.team_id] || 0) + 1;
        }
      });
      
      // Get team user accounts
      const { data: teamAccounts, error: teamAccountsError } = await supabase
        .from('team_accounts')
        .select('team_id, email');
        
      if (teamAccountsError) throw teamAccountsError;
      
      // Create a map of team ID to email
      const teamEmailMap: Record<string, string> = {};
      teamAccounts?.forEach(account => {
        if (account.team_id) {
          teamEmailMap[account.team_id] = account.email;
        }
      });
      
      // Map player counts and emails to teams
      const teamsWithCounts = teamsData?.map(team => ({
        ...team,
        playerCount: playerCountByTeam[team.id] || 0,
        email: teamEmailMap[team.id] || null
      })) || [];
      
      setTeams(teamsWithCounts);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar times",
        description: "Não foi possível carregar os times."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      group_name: '',
      logo: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleAddTeam = async () => {
    if (!formData.name || !formData.category || !formData.group_name) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, categoria e grupo."
      });
      return;
    }

    // If email and password are provided, validate them
    if (formData.email && formData.password) {
      if (!validateEmail(formData.email)) {
        toast({
          variant: "destructive",
          title: "E-mail inválido",
          description: "Por favor, forneça um e-mail válido."
        });
        return;
      }

      if (formData.password.length < 6) {
        toast({
          variant: "destructive",
          title: "Senha muito curta",
          description: "A senha deve ter pelo menos 6 caracteres."
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          variant: "destructive",
          title: "Senhas não coincidem",
          description: "A senha e a confirmação de senha devem ser iguais."
        });
        return;
      }
    }

    try {
      // First, create the team
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert([{
          name: formData.name,
          category: formData.category,
          group_name: formData.group_name,
          logo: formData.logo || null
        }])
        .select();

      if (teamError) throw teamError;

      if (teamData) {
        const newTeam = {
          ...teamData[0],
          playerCount: 0,
          email: formData.email || null
        };
        
        // If email and password are provided, create a user account
        if (formData.email && formData.password) {
          // First, register the user with Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                team_id: newTeam.id,
                role: 'team'
              }
            }
          });
          
          if (authError) throw authError;

          // Then, create a record in team_accounts table
          if (authData.user) {
            const { error: accountError } = await supabase
              .from('team_accounts')
              .insert([{
                team_id: newTeam.id,
                user_id: authData.user.id,
                email: formData.email
              }]);
              
            if (accountError) throw accountError;
            
            // Update newTeam with email
            newTeam.email = formData.email;
          }
        }
        
        setTeams([...teams, newTeam]);
        
        toast({
          title: "Time adicionado",
          description: "O time foi adicionado com sucesso."
        });
        
        resetForm();
        setActiveTab('list');
      }
    } catch (error) {
      console.error('Error adding team:', error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar time",
        description: "Não foi possível adicionar o time."
      });
    }
  };

  const handleUpdateTeam = async () => {
    if (!selectedTeam) return;
    
    if (!formData.name || !formData.category || !formData.group_name) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, categoria e grupo."
      });
      return;
    }

    // If email is provided, validate it
    if (formData.email && !validateEmail(formData.email)) {
      toast({
        variant: "destructive",
        title: "E-mail inválido",
        description: "Por favor, forneça um e-mail válido."
      });
      return;
    }

    // If password is provided, validate it
    if (formData.password) {
      if (formData.password.length < 6) {
        toast({
          variant: "destructive",
          title: "Senha muito curta",
          description: "A senha deve ter pelo menos 6 caracteres."
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          variant: "destructive",
          title: "Senhas não coincidem",
          description: "A senha e a confirmação de senha devem ser iguais."
        });
        return;
      }
    }

    try {
      // First, update the team
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .update({
          name: formData.name,
          category: formData.category,
          group_name: formData.group_name,
          logo: formData.logo || null
        })
        .eq('id', selectedTeam.id)
        .select();

      if (teamError) throw teamError;

      // Check if team account exists
      const { data: existingAccount, error: accountQueryError } = await supabase
        .from('team_accounts')
        .select('*')
        .eq('team_id', selectedTeam.id)
        .single();
        
      if (accountQueryError && accountQueryError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected if no account exists
        throw accountQueryError;
      }

      // Handle email/password updates
      if (formData.email) {
        if (existingAccount) {
          // Update existing account with new email
          if (existingAccount.email !== formData.email) {
            // Get the user from auth
            const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
              existingAccount.user_id
            );
            
            if (userError) throw userError;
            
            if (userData && userData.user) {
              // Update auth email
              const { error: updateAuthError } = await supabase.auth.admin.updateUserById(
                userData.user.id,
                { email: formData.email }
              );
              
              if (updateAuthError) throw updateAuthError;
              
              // Update team_accounts table
              const { error: updateAccountError } = await supabase
                .from('team_accounts')
                .update({ email: formData.email })
                .eq('team_id', selectedTeam.id);
                
              if (updateAccountError) throw updateAccountError;
            }
          }
          
          // Update password if provided
          if (formData.password) {
            const { error: passwordError } = await supabase.auth.admin.updateUserById(
              existingAccount.user_id,
              { password: formData.password }
            );
            
            if (passwordError) throw passwordError;
          }
        } else {
          // Create new account with provided email/password
          if (formData.password) {
            // Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
              email: formData.email,
              password: formData.password,
              options: {
                data: {
                  team_id: selectedTeam.id,
                  role: 'team'
                }
              }
            });
            
            if (authError) throw authError;
            
            // Create record in team_accounts
            if (authData.user) {
              const { error: newAccountError } = await supabase
                .from('team_accounts')
                .insert([{
                  team_id: selectedTeam.id,
                  user_id: authData.user.id,
                  email: formData.email
                }]);
                
              if (newAccountError) throw newAccountError;
            }
          } else {
            toast({
              variant: "warning",
              title: "Senha necessária",
              description: "É necessário definir uma senha ao criar uma nova conta."
            });
            return;
          }
        }
      }

      if (teamData) {
        const updatedTeam = {
          ...teamData[0],
          playerCount: selectedTeam.playerCount,
          email: formData.email || selectedTeam.email
        };
        
        setTeams(teams.map(team => 
          team.id === selectedTeam.id ? updatedTeam : team
        ));
        
        toast({
          title: "Time atualizado",
          description: "O time foi atualizado com sucesso."
        });
        
        resetForm();
        setSelectedTeam(null);
        setActiveTab('list');
      }
    } catch (error) {
      console.error('Error updating team:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar time",
        description: "Não foi possível atualizar o time."
      });
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    // Check if team has players
    const teamHasPlayers = teams.find(team => team.id === teamId)?.playerCount ?? 0 > 0;
    
    if (teamHasPlayers) {
      toast({
        variant: "destructive",
        title: "Ação bloqueada",
        description: "Este time possui jogadores. Remova os jogadores primeiro."
      });
      return;
    }
    
    if (!confirm("Tem certeza que deseja excluir este time?")) return;

    try {
      // First delete team account if exists
      const { data: accountData, error: accountError } = await supabase
        .from('team_accounts')
        .select('user_id')
        .eq('team_id', teamId);
        
      if (accountError) throw accountError;
      
      if (accountData && accountData.length > 0) {
        // Delete the user from auth
        const { error: authError } = await supabase.auth.admin.deleteUser(
          accountData[0].user_id
        );
        
        if (authError) throw authError;
        
        // Delete from team_accounts
        const { error: deleteAccountError } = await supabase
          .from('team_accounts')
          .delete()
          .eq('team_id', teamId);
          
        if (deleteAccountError) throw deleteAccountError;
      }

      // Then delete the team
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (error) throw error;

      setTeams(teams.filter(team => team.id !== teamId));
      
      toast({
        title: "Time removido",
        description: "O time foi removido com sucesso."
      });
    } catch (error) {
      console.error('Error deleting team:', error);
      toast({
        variant: "destructive",
        title: "Erro ao remover time",
        description: "Não foi possível remover o time."
      });
    }
  };

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team);
    setFormData({
      name: team.name,
      category: team.category,
      group_name: team.group_name,
      logo: team.logo || '',
      email: team.email || '',
      password: '',
      confirmPassword: ''
    });
    setActiveTab('edit');
  };

  const handleManageCredentials = (team: Team) => {
    setSelectedTeam(team);
    setFormData(prev => ({
      ...prev,
      email: team.email || '',
      password: '',
      confirmPassword: ''
    }));
    setIsCredentialsDialogOpen(true);
  };

  const handleCredentialsSubmit = async () => {
    if (!selectedTeam) return;
    
    if (!formData.email || !validateEmail(formData.email)) {
      toast({
        variant: "destructive",
        title: "E-mail inválido",
        description: "Por favor, forneça um e-mail válido."
      });
      return;
    }

    if (!formData.password) {
      toast({
        variant: "destructive",
        title: "Senha necessária",
        description: "Por favor, forneça uma senha."
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres."
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não coincidem",
        description: "A senha e a confirmação de senha devem ser iguais."
      });
      return;
    }

    try {
      // Check if team account exists
      const { data: existingAccount, error: accountQueryError } = await supabase
        .from('team_accounts')
        .select('*')
        .eq('team_id', selectedTeam.id)
        .single();
        
      if (accountQueryError && accountQueryError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected if no account exists
        throw accountQueryError;
      }

      if (existingAccount) {
        // Update existing account
        // Update auth email and password
        const { error: updateAuthError } = await supabase.auth.admin.updateUserById(
          existingAccount.user_id,
          { 
            email: formData.email,
            password: formData.password
          }
        );
        
        if (updateAuthError) throw updateAuthError;
        
        // Update team_accounts table if email changed
        if (existingAccount.email !== formData.email) {
          const { error: updateAccountError } = await supabase
            .from('team_accounts')
            .update({ email: formData.email })
            .eq('team_id', selectedTeam.id);
            
          if (updateAccountError) throw updateAccountError;
        }
      } else {
        // Create new account
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              team_id: selectedTeam.id,
              role: 'team'
            }
          }
        });
        
        if (authError) throw authError;
        
        // Create record in team_accounts
        if (authData.user) {
          const { error: newAccountError } = await supabase
            .from('team_accounts')
            .insert([{
              team_id: selectedTeam.id,
              user_id: authData.user.id,
              email: formData.email
            }]);
            
          if (newAccountError) throw newAccountError;
        }
      }

      // Update the local teams state
      setTeams(teams.map(team => 
        team.id === selectedTeam.id 
          ? { ...team, email: formData.email } 
          : team
      ));
      
      toast({
        title: "Credenciais atualizadas",
        description: "As credenciais do time foram atualizadas com sucesso."
      });
      
      setIsCredentialsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error updating credentials:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar credenciais",
        description: "Não foi possível atualizar as credenciais do time."
      });
    }
  };

  // Helper function to validate email
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Filter teams based on search and category
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || team.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = [...new Set(teams.map(team => team.category))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a237e]">Gerenciamento de Times</h2>
        {activeTab === 'list' && (
          <Button 
            onClick={() => setActiveTab('add')}
            className="flex items-center gap-2 bg-[#1a237e] text-white hover:bg-blue-800"
          >
            <PlusCircle size={16} />
            Adicionar Novo Time
          </Button>
        )}
      </div>
      
      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex-1">
              <Input
                placeholder="Buscar times..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="rounded-md border border-input px-3 py-2 text-sm"
              >
                <option value="all">Todas Categorias</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Carregando times...</p>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum time encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTeams.map(team => (
                <Card key={team.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-[#1a237e] text-white p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold">{team.name}</h3>
                        <div className="space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-white hover:text-[#1a237e] hover:bg-white"
                            onClick={() => handleEditTeam(team)}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-white hover:text-[#1a237e] hover:bg-white"
                            onClick={() => handleDeleteTeam(team.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
                          {team.logo ? (
                            <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
                          ) : (
                            <Users size={24} className="text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p><span className="font-semibold">Categoria:</span> {team.category}</p>
                          <p><span className="font-semibold">Grupo:</span> {team.group_name}</p>
                          <p><span className="font-semibold">Jogadores:</span> {team.playerCount}</p>
                          <div className="mt-1 flex items-center">
                            <span className="font-semibold mr-1">Acesso:</span>
                            {team.email ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <Mail size={14} /> {team.email}
                              </span>
                            ) : (
                              <span className="text-red-500">Não configurado</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1 text-[#1a237e]"
                          onClick={() => handleManageCredentials(team)}
                        >
                          <Lock size={14} />
                          {team.email ? 'Atualizar credenciais' : 'Configurar acesso'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'add' && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-4 text-[#1a237e]">Adicionar Novo Time</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">Nome do Time *</label>
                <Input 
                  id="teamName" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Ex: Flamengo"
                />
              </div>
              
              <div>
                <label htmlFor="teamCategory" className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                <Input 
                  id="teamCategory" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange} 
                  placeholder="Ex: SUB-11"
                />
              </div>
              
              <div>
                <label htmlFor="teamGroup" className="block text-sm font-medium text-gray-700 mb-1">Grupo *</label>
                <Input 
                  id="teamGroup" 
                  name="group_name" 
                  value={formData.group_name} 
                  onChange={handleInputChange} 
                  placeholder="Ex: A"
                />
              </div>
              
              <div>
                <label htmlFor="teamLogo" className="block text-sm font-medium text-gray-700 mb-1">URL do Logo</label>
                <Input 
                  id="teamLogo" 
                  name="logo" 
                  value={formData.logo} 
                  onChange={handleInputChange} 
                  placeholder="https://exemplo.com/logo.png"
                />
              </div>
              
              <div className="pt-4 border-t mt-4">
                <h4 className="font-semibold text-[#1a237e] mb-3">Credenciais de Acesso</h4>
                <p className="text-gray-500 text-sm mb-3">
                  Opcionalmente, você pode criar um acesso para este time gerenciar seus próprios dados.
                </p>
                
                <div>
                  <label htmlFor="teamEmail" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <Input 
                    id="teamEmail" 
                    name="email" 
                    type="email"
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="exemplo@time.com"
                  />
                </div>
                
                <div className="mt-3">
                  <label htmlFor="teamPassword" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                  <Input 
                    id="teamPassword" 
                    name="password" 
                    type="password"
                    value={formData.password} 
                    onChange={handleInputChange} 
                    placeholder="Digite uma senha"
                  />
                </div>
                
                <div className="mt-3">
                  <label htmlFor="teamConfirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
                  <Input 
                    id="teamConfirmPassword" 
                    name="confirmPassword" 
                    type="password"
                    value={formData.confirmPassword} 
                    onChange={handleInputChange} 
                    placeholder="Confirme a senha"
                  />
                </div>
              </div>
              
              <div className="pt-2 flex gap-2 justify-end">
                <Button variant="outline" onClick={() => {
                  resetForm();
                  setActiveTab('list');
                }}>
                  Cancelar
                </Button>
                <Button onClick={handleAddTeam} className="bg-[#1a237e] text-white hover:bg-blue-800">
                  Adicionar Time
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {activeTab === 'edit' && selectedTeam && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-4 text-[#1a237e]">Editar Time</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">Nome do Time *</label>
                <Input 
                  id="teamName" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div>
                <label htmlFor="teamCategory" className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                <Input 
                  id="teamCategory" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div>
                <label htmlFor="teamGroup" className="block text-sm font-medium text-gray-700 mb-1">Grupo *</label>
                <Input 
                  id="teamGroup" 
                  name="group_name" 
                  value={formData.group_name} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div>
                <label htmlFor="teamLogo" className="block text-sm font-medium text-gray-700 mb-1">URL do Logo</label>
                <Input 
                  id="teamLogo" 
                  name="logo" 
                  value={formData.logo} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="pt-4 border-t mt-4">
                <h4 className="font-semibold text-[#1a237e] mb-3">Credenciais de Acesso</h4>
                
                <div>
                  <label htmlFor="teamEmail" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                  <Input 
                    id="teamEmail" 
                    name="email" 
                    type="email"
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="exemplo@time.com"
                  />
                </div>
                
                <div className="mt-3">
                  <label htmlFor="teamPassword" className="block text-sm font-medium text-gray-700 mb-1">Nova Senha (deixe em branco para manter a atual)</label>
                  <Input 
                    id="teamPassword" 
                    name="password" 
                    type="password"
                    value={formData.password} 
                    onChange={handleInputChange} 
                    placeholder="Digite para alterar a senha"
                  />
                </div>
                
                {formData.password && (
                  <div className="mt-3">
                    <label htmlFor="teamConfirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                    <Input 
                      id="teamConfirmPassword" 
                      name="confirmPassword" 
                      type="password"
                      value={formData.confirmPassword} 
                      onChange={handleInputChange} 
                      placeholder="Confirme a nova senha"
                    />
                  </div>
                )}
              </div>
              
              <div className="pt-2 flex gap-2 justify-end">
                <Button variant="outline" onClick={() => {
                  resetForm();
                  setSelectedTeam(null);
                  setActiveTab('list');
                }}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateTeam} className="bg-[#1a237e] text-white hover:bg-blue-800">
                  Atualizar Time
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Credentials Dialog */}
      <Dialog open={isCredentialsDialogOpen} onOpenChange={setIsCredentialsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[#1a237e]">
              {selectedTeam?.email ? 'Atualizar Credenciais' : 'Configurar Acesso'} - {selectedTeam?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="credentialsEmail">E-mail *</Label>
              <Input 
                id="credentialsEmail" 
                name="email" 
                type="email"
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="exemplo@time.com"
              />
            </div>
            
            <div>
              <Label htmlFor="credentialsPassword">
                {selectedTeam?.email ? 'Nova Senha *' : 'Senha *'}
              </Label>
              <Input 
                id="credentialsPassword" 
                name="password" 
                type="password"
                value={formData.password} 
                onChange={handleInputChange} 
                placeholder="Digite uma senha"
              />
            </div>
            
            <div>
              <Label htmlFor="credentialsConfirmPassword">Confirmar Senha *</Label>
              <Input 
                id="credentialsConfirmPassword" 
                name="confirmPassword" 
                type="password"
                value={formData.confirmPassword} 
                onChange={handleInputChange} 
                placeholder="Confirme a senha"
              />
            </div>
            
            <div className="pt-2 flex gap-2 justify-end">
              <Button variant="outline" onClick={() => {
                setIsCredentialsDialogOpen(false);
              }}>
                Cancelar
              </Button>
              <Button onClick={handleCredentialsSubmit} className="bg-[#1a237e] text-white hover:bg-blue-800">
                Salvar Credenciais
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
