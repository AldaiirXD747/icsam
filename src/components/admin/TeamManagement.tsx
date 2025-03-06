
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Pencil, Trash2, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

type Team = {
  id: string;
  name: string;
  logo: string | null;
  category: string;
  group_name: string;
  playerCount?: number;
};

const TeamManagement = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const { toast } = useToast();

  // Team form states
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    group_name: '',
    logo: ''
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
      
      // Map player counts to teams
      const teamsWithPlayerCounts = teamsData?.map(team => ({
        ...team,
        playerCount: playerCountByTeam[team.id] || 0
      })) || [];
      
      setTeams(teamsWithPlayerCounts);
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
      logo: ''
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

    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([{
          name: formData.name,
          category: formData.category,
          group_name: formData.group_name,
          logo: formData.logo || null
        }])
        .select();

      if (error) throw error;

      if (data) {
        const newTeam = {
          ...data[0],
          playerCount: 0
        };
        
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

    try {
      const { data, error } = await supabase
        .from('teams')
        .update({
          name: formData.name,
          category: formData.category,
          group_name: formData.group_name,
          logo: formData.logo || null
        })
        .eq('id', selectedTeam.id)
        .select();

      if (error) throw error;

      if (data) {
        const updatedTeam = {
          ...data[0],
          playerCount: selectedTeam.playerCount
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
      logo: team.logo || ''
    });
    setActiveTab('edit');
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
                        </div>
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
    </div>
  );
};

export default TeamManagement;
