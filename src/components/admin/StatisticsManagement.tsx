
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { BarChart as BarChartIcon, ListFilter, Trophy, Plus, Pencil, Trash2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from "@/integrations/supabase/client";
import { TopScorer, YellowCardLeader } from '@/types';

const StatisticsManagement = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedChampionship, setSelectedChampionship] = useState<string>('all');
  const [championships, setChampionships] = useState<{id: string, name: string}[]>([]);
  const [teams, setTeams] = useState<{id: string, name: string, category: string}[]>([]);
  const [players, setPlayers] = useState<{id: string, name: string, team_id: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Top scorers state
  const [topScorers, setTopScorers] = useState<TopScorer[]>([]);
  const [isAddingScorerOpen, setIsAddingScorerOpen] = useState(false);
  const [isEditingScorerOpen, setIsEditingScorerOpen] = useState(false);
  const [selectedScorer, setSelectedScorer] = useState<TopScorer | null>(null);
  const [scorerForm, setScorerForm] = useState({
    playerId: '',
    teamId: '',
    goals: 0,
    category: '',
    championshipId: ''
  });
  
  // Yellow card leaders state
  const [yellowCardLeaders, setYellowCardLeaders] = useState<YellowCardLeader[]>([]);
  const [isAddingCardLeaderOpen, setIsAddingCardLeaderOpen] = useState(false);
  const [isEditingCardLeaderOpen, setIsEditingCardLeaderOpen] = useState(false);
  const [selectedCardLeader, setSelectedCardLeader] = useState<YellowCardLeader | null>(null);
  const [cardLeaderForm, setCardLeaderForm] = useState({
    playerId: '',
    teamId: '',
    yellowCards: 0,
    category: '',
    championshipId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch championships
      const { data: championshipsData, error: championshipsError } = await supabase
        .from('championships')
        .select('id, name')
        .order('name');
      
      if (championshipsError) throw championshipsError;
      setChampionships(championshipsData || []);
      
      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('id, name, category')
        .order('name');
      
      if (teamsError) throw teamsError;
      setTeams(teamsData || []);
      
      // Fetch players
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('id, name, team_id')
        .order('name');
      
      if (playersError) throw playersError;
      setPlayers(playersData || []);
      
      // Fetch top scorers
      const { data: scorersData, error: scorersError } = await supabase
        .from('top_scorers')
        .select(`
          id,
          player_id,
          team_id,
          goals,
          category,
          championship_id,
          players(name),
          teams(name)
        `)
        .order('goals', { ascending: false });
      
      if (scorersError) throw scorersError;
      
      const transformedScorers = (scorersData || []).map(scorer => ({
        id: scorer.id,
        playerId: scorer.player_id,
        name: scorer.players?.name || 'Desconhecido',
        teamId: scorer.team_id,
        team: scorer.teams?.name || 'Time desconhecido',
        goals: scorer.goals,
        category: scorer.category,
        championshipId: scorer.championship_id
      }));
      
      setTopScorers(transformedScorers);
      
      // Fetch yellow card leaders
      const { data: cardLeadersData, error: cardLeadersError } = await supabase
        .from('yellow_card_leaders')
        .select(`
          id,
          player_id,
          team_id,
          yellow_cards,
          category,
          championship_id,
          players(name),
          teams(name)
        `)
        .order('yellow_cards', { ascending: false });
      
      if (cardLeadersError) throw cardLeadersError;
      
      const transformedCardLeaders = (cardLeadersData || []).map(leader => ({
        id: leader.id,
        playerId: leader.player_id,
        name: leader.players?.name || 'Desconhecido',
        teamId: leader.team_id,
        team: leader.teams?.name || 'Time desconhecido',
        yellowCards: leader.yellow_cards,
        category: leader.category,
        championshipId: leader.championship_id
      }));
      
      setYellowCardLeaders(transformedCardLeaders);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as estatísticas."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle scorers
  const handleAddScorer = async () => {
    if (!scorerForm.playerId || !scorerForm.teamId || scorerForm.goals <= 0 || !scorerForm.category) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('top_scorers')
        .insert({
          player_id: scorerForm.playerId,
          team_id: scorerForm.teamId,
          goals: scorerForm.goals,
          category: scorerForm.category,
          championship_id: scorerForm.championshipId || null
        })
        .select(`
          id,
          player_id,
          team_id,
          goals,
          category,
          championship_id,
          players(name),
          teams(name)
        `);

      if (error) throw error;

      if (data && data.length > 0) {
        const newScorer: TopScorer = {
          id: data[0].id,
          playerId: data[0].player_id,
          name: data[0].players?.name || 'Desconhecido',
          teamId: data[0].team_id,
          team: data[0].teams?.name || 'Time desconhecido',
          goals: data[0].goals,
          category: data[0].category,
          championshipId: data[0].championship_id
        };

        setTopScorers([...topScorers, newScorer]);
        
        toast({
          title: "Artilheiro adicionado",
          description: "O artilheiro foi adicionado com sucesso."
        });
        
        resetScorerForm();
        setIsAddingScorerOpen(false);
      }
    } catch (error) {
      console.error('Error adding top scorer:', error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar artilheiro",
        description: "Não foi possível adicionar o artilheiro."
      });
    }
  };

  const handleUpdateScorer = async () => {
    if (!selectedScorer) return;
    
    if (!scorerForm.playerId || !scorerForm.teamId || scorerForm.goals <= 0 || !scorerForm.category) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('top_scorers')
        .update({
          player_id: scorerForm.playerId,
          team_id: scorerForm.teamId,
          goals: scorerForm.goals,
          category: scorerForm.category,
          championship_id: scorerForm.championshipId || null
        })
        .eq('id', selectedScorer.id)
        .select(`
          id,
          player_id,
          team_id,
          goals,
          category,
          championship_id,
          players(name),
          teams(name)
        `);

      if (error) throw error;

      if (data && data.length > 0) {
        const updatedScorer: TopScorer = {
          id: data[0].id,
          playerId: data[0].player_id,
          name: data[0].players?.name || 'Desconhecido',
          teamId: data[0].team_id,
          team: data[0].teams?.name || 'Time desconhecido',
          goals: data[0].goals,
          category: data[0].category,
          championshipId: data[0].championship_id
        };

        setTopScorers(topScorers.map(scorer => 
          scorer.id === selectedScorer.id ? updatedScorer : scorer
        ));
        
        toast({
          title: "Artilheiro atualizado",
          description: "O artilheiro foi atualizado com sucesso."
        });
        
        setSelectedScorer(null);
        resetScorerForm();
        setIsEditingScorerOpen(false);
      }
    } catch (error) {
      console.error('Error updating top scorer:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar artilheiro",
        description: "Não foi possível atualizar o artilheiro."
      });
    }
  };

  const handleDeleteScorer = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este artilheiro?')) return;

    try {
      const { error } = await supabase
        .from('top_scorers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTopScorers(topScorers.filter(scorer => scorer.id !== id));
      
      toast({
        title: "Artilheiro removido",
        description: "O artilheiro foi removido com sucesso."
      });
    } catch (error) {
      console.error('Error deleting top scorer:', error);
      toast({
        variant: "destructive",
        title: "Erro ao remover artilheiro",
        description: "Não foi possível remover o artilheiro."
      });
    }
  };

  const editScorer = (scorer: TopScorer) => {
    setSelectedScorer(scorer);
    setScorerForm({
      playerId: scorer.playerId,
      teamId: scorer.teamId,
      goals: scorer.goals,
      category: scorer.category,
      championshipId: scorer.championshipId || ''
    });
    setIsEditingScorerOpen(true);
  };

  const resetScorerForm = () => {
    setScorerForm({
      playerId: '',
      teamId: '',
      goals: 0,
      category: '',
      championshipId: ''
    });
  };

  // Handle card leaders
  const handleAddCardLeader = async () => {
    if (!cardLeaderForm.playerId || !cardLeaderForm.teamId || cardLeaderForm.yellowCards <= 0 || !cardLeaderForm.category) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('yellow_card_leaders')
        .insert({
          player_id: cardLeaderForm.playerId,
          team_id: cardLeaderForm.teamId,
          yellow_cards: cardLeaderForm.yellowCards,
          category: cardLeaderForm.category,
          championship_id: cardLeaderForm.championshipId || null
        })
        .select(`
          id,
          player_id,
          team_id,
          yellow_cards,
          category,
          championship_id,
          players(name),
          teams(name)
        `);

      if (error) throw error;

      if (data && data.length > 0) {
        const newCardLeader: YellowCardLeader = {
          id: data[0].id,
          playerId: data[0].player_id,
          name: data[0].players?.name || 'Desconhecido',
          teamId: data[0].team_id,
          team: data[0].teams?.name || 'Time desconhecido',
          yellowCards: data[0].yellow_cards,
          category: data[0].category,
          championshipId: data[0].championship_id
        };

        setYellowCardLeaders([...yellowCardLeaders, newCardLeader]);
        
        toast({
          title: "Líder de cartões adicionado",
          description: "O jogador foi adicionado à lista de cartões com sucesso."
        });
        
        resetCardLeaderForm();
        setIsAddingCardLeaderOpen(false);
      }
    } catch (error) {
      console.error('Error adding yellow card leader:', error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar jogador",
        description: "Não foi possível adicionar o jogador à lista de cartões."
      });
    }
  };

  const handleUpdateCardLeader = async () => {
    if (!selectedCardLeader) return;
    
    if (!cardLeaderForm.playerId || !cardLeaderForm.teamId || cardLeaderForm.yellowCards <= 0 || !cardLeaderForm.category) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('yellow_card_leaders')
        .update({
          player_id: cardLeaderForm.playerId,
          team_id: cardLeaderForm.teamId,
          yellow_cards: cardLeaderForm.yellowCards,
          category: cardLeaderForm.category,
          championship_id: cardLeaderForm.championshipId || null
        })
        .eq('id', selectedCardLeader.id)
        .select(`
          id,
          player_id,
          team_id,
          yellow_cards,
          category,
          championship_id,
          players(name),
          teams(name)
        `);

      if (error) throw error;

      if (data && data.length > 0) {
        const updatedCardLeader: YellowCardLeader = {
          id: data[0].id,
          playerId: data[0].player_id,
          name: data[0].players?.name || 'Desconhecido',
          teamId: data[0].team_id,
          team: data[0].teams?.name || 'Time desconhecido',
          yellowCards: data[0].yellow_cards,
          category: data[0].category,
          championshipId: data[0].championship_id
        };

        setYellowCardLeaders(yellowCardLeaders.map(leader => 
          leader.id === selectedCardLeader.id ? updatedCardLeader : leader
        ));
        
        toast({
          title: "Dados atualizados",
          description: "Os cartões do jogador foram atualizados com sucesso."
        });
        
        setSelectedCardLeader(null);
        resetCardLeaderForm();
        setIsEditingCardLeaderOpen(false);
      }
    } catch (error) {
      console.error('Error updating yellow card leader:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar dados",
        description: "Não foi possível atualizar os cartões do jogador."
      });
    }
  };

  const handleDeleteCardLeader = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este jogador da lista de cartões?')) return;

    try {
      const { error } = await supabase
        .from('yellow_card_leaders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setYellowCardLeaders(yellowCardLeaders.filter(leader => leader.id !== id));
      
      toast({
        title: "Jogador removido",
        description: "O jogador foi removido da lista de cartões com sucesso."
      });
    } catch (error) {
      console.error('Error deleting yellow card leader:', error);
      toast({
        variant: "destructive",
        title: "Erro ao remover jogador",
        description: "Não foi possível remover o jogador da lista de cartões."
      });
    }
  };

  const editCardLeader = (leader: YellowCardLeader) => {
    setSelectedCardLeader(leader);
    setCardLeaderForm({
      playerId: leader.playerId,
      teamId: leader.teamId,
      yellowCards: leader.yellowCards,
      category: leader.category,
      championshipId: leader.championshipId || ''
    });
    setIsEditingCardLeaderOpen(true);
  };

  const resetCardLeaderForm = () => {
    setCardLeaderForm({
      playerId: '',
      teamId: '',
      yellowCards: 0,
      category: '',
      championshipId: ''
    });
  };

  const filteredTopScorers = topScorers
    .filter(scorer => selectedCategory === 'all' || scorer.category === selectedCategory)
    .filter(scorer => selectedChampionship === 'all' || scorer.championshipId === selectedChampionship)
    .sort((a, b) => b.goals - a.goals);
    
  const filteredYellowCardLeaders = yellowCardLeaders
    .filter(leader => selectedCategory === 'all' || leader.category === selectedCategory)
    .filter(leader => selectedChampionship === 'all' || leader.championshipId === selectedChampionship)
    .sort((a, b) => b.yellowCards - a.yellowCards);
    
  const goalsChartData = filteredTopScorers.slice(0, 10).map(scorer => ({
    name: scorer.name,
    gols: scorer.goals,
    time: scorer.team,
  }));
    
  const cardsChartData = filteredYellowCardLeaders.slice(0, 10).map(leader => ({
    name: leader.name,
    cartões: leader.yellowCards,
    time: leader.team,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a237e]">Gerenciamento de Estatísticas</h2>
        
        <div className="flex items-center space-x-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Categorias</SelectItem>
              <SelectItem value="SUB-11">SUB-11</SelectItem>
              <SelectItem value="SUB-13">SUB-13</SelectItem>
              <SelectItem value="SUB-15">SUB-15</SelectItem>
              <SelectItem value="SUB-17">SUB-17</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedChampionship} onValueChange={setSelectedChampionship}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione um campeonato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Campeonatos</SelectItem>
              {championships.map(championship => (
                <SelectItem key={championship.id} value={championship.id}>
                  {championship.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => toast({
            title: "Recurso em desenvolvimento",
            description: "A exportação de estatísticas será implementada em breve."
          })}>
            <ListFilter className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="topscorers">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="topscorers" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Artilheiros
          </TabsTrigger>
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <BarChartIcon className="h-4 w-4" />
            Cartões
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="topscorers">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Artilheiros {selectedCategory !== 'all' ? `- ${selectedCategory}` : ''}</CardTitle>
              <Button 
                className="bg-[#1a237e] text-white hover:bg-blue-800"
                onClick={() => setIsAddingScorerOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" /> Adicionar Artilheiro
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center text-gray-500">
                  Carregando dados de artilharia...
                </div>
              ) : filteredTopScorers.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  Não há dados de artilharia para esta categoria.
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-2 text-left">Pos.</th>
                            <th className="px-4 py-2 text-left">Jogador</th>
                            <th className="px-4 py-2 text-left">Time</th>
                            <th className="px-4 py-2 text-center">Categoria</th>
                            <th className="px-4 py-2 text-center">Gols</th>
                            <th className="px-4 py-2 text-center">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTopScorers.map((scorer, index) => (
                            <tr key={scorer.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3">{index + 1}</td>
                              <td className="px-4 py-3 font-medium">{scorer.name}</td>
                              <td className="px-4 py-3">{scorer.team}</td>
                              <td className="px-4 py-3 text-center">{scorer.category}</td>
                              <td className="px-4 py-3 text-center font-bold">{scorer.goals}</td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex justify-center space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => editScorer(scorer)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Pencil size={16} className="text-blue-600" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleDeleteScorer(scorer.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Trash2 size={16} className="text-red-500" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={goalsChartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="gols" fill="#1a237e" name="Gols" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cards">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Cartões Amarelos {selectedCategory !== 'all' ? `- ${selectedCategory}` : ''}</CardTitle>
              <Button 
                className="bg-[#1a237e] text-white hover:bg-blue-800"
                onClick={() => setIsAddingCardLeaderOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" /> Adicionar Jogador
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center text-gray-500">
                  Carregando dados de cartões...
                </div>
              ) : filteredYellowCardLeaders.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  Não há dados de cartões para esta categoria.
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-2 text-left">Pos.</th>
                            <th className="px-4 py-2 text-left">Jogador</th>
                            <th className="px-4 py-2 text-left">Time</th>
                            <th className="px-4 py-2 text-center">Categoria</th>
                            <th className="px-4 py-2 text-center">Cartões</th>
                            <th className="px-4 py-2 text-center">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredYellowCardLeaders.map((leader, index) => (
                            <tr key={leader.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3">{index + 1}</td>
                              <td className="px-4 py-3 font-medium">{leader.name}</td>
                              <td className="px-4 py-3">{leader.team}</td>
                              <td className="px-4 py-3 text-center">{leader.category}</td>
                              <td className="px-4 py-3 text-center font-bold">{leader.yellowCards}</td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex justify-center space-x-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => editCardLeader(leader)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Pencil size={16} className="text-blue-600" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleDeleteCardLeader(leader.id)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Trash2 size={16} className="text-red-500" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={cardsChartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="cartões" fill="#FFC107" name="Cartões Amarelos" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Top Scorer Dialog */}
      <Dialog open={isAddingScorerOpen} onOpenChange={setIsAddingScorerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Artilheiro</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="player">Jogador</Label>
              <Select onValueChange={(value) => setScorerForm({...scorerForm, playerId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um jogador" />
                </SelectTrigger>
                <SelectContent>
                  {players.map(player => (
                    <SelectItem key={player.id} value={player.id}>{player.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="team">Time</Label>
              <Select onValueChange={(value) => setScorerForm({...scorerForm, teamId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um time" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>{team.name} ({team.category})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select onValueChange={(value) => setScorerForm({...scorerForm, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUB-11">SUB-11</SelectItem>
                  <SelectItem value="SUB-13">SUB-13</SelectItem>
                  <SelectItem value="SUB-15">SUB-15</SelectItem>
                  <SelectItem value="SUB-17">SUB-17</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="championship">Campeonato (opcional)</Label>
              <Select onValueChange={(value) => setScorerForm({...scorerForm, championshipId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um campeonato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {championships.map(championship => (
                    <SelectItem key={championship.id} value={championship.id}>{championship.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goals">Número de Gols</Label>
              <Input 
                id="goals" 
                type="number" 
                value={scorerForm.goals}
                onChange={(e) => setScorerForm({...scorerForm, goals: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetScorerForm();
              setIsAddingScorerOpen(false);
            }}>
              Cancelar
            </Button>
            <Button className="bg-[#1a237e]" onClick={handleAddScorer}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Top Scorer Dialog */}
      <Dialog open={isEditingScorerOpen} onOpenChange={setIsEditingScorerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Artilheiro</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="player">Jogador</Label>
              <Select 
                value={scorerForm.playerId} 
                onValueChange={(value) => setScorerForm({...scorerForm, playerId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um jogador" />
                </SelectTrigger>
                <SelectContent>
                  {players.map(player => (
                    <SelectItem key={player.id} value={player.id}>{player.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="team">Time</Label>
              <Select 
                value={scorerForm.teamId} 
                onValueChange={(value) => setScorerForm({...scorerForm, teamId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um time" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>{team.name} ({team.category})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select 
                value={scorerForm.category} 
                onValueChange={(value) => setScorerForm({...scorerForm, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUB-11">SUB-11</SelectItem>
                  <SelectItem value="SUB-13">SUB-13</SelectItem>
                  <SelectItem value="SUB-15">SUB-15</SelectItem>
                  <SelectItem value="SUB-17">SUB-17</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="championship">Campeonato (opcional)</Label>
              <Select 
                value={scorerForm.championshipId} 
                onValueChange={(value) => setScorerForm({...scorerForm, championshipId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um campeonato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {championships.map(championship => (
                    <SelectItem key={championship.id} value={championship.id}>{championship.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goals">Número de Gols</Label>
              <Input 
                id="goals" 
                type="number" 
                value={scorerForm.goals}
                onChange={(e) => setScorerForm({...scorerForm, goals: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSelectedScorer(null);
              resetScorerForm();
              setIsEditingScorerOpen(false);
            }}>
              Cancelar
            </Button>
            <Button className="bg-[#1a237e]" onClick={handleUpdateScorer}>
              Atualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Yellow Card Leader Dialog */}
      <Dialog open={isAddingCardLeaderOpen} onOpenChange={setIsAddingCardLeaderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Jogador à Lista de Cartões</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="player">Jogador</Label>
              <Select onValueChange={(value) => setCardLeaderForm({...cardLeaderForm, playerId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um jogador" />
                </SelectTrigger>
                <SelectContent>
                  {players.map(player => (
                    <SelectItem key={player.id} value={player.id}>{player.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="team">Time</Label>
              <Select onValueChange={(value) => setCardLeaderForm({...cardLeaderForm, teamId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um time" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>{team.name} ({team.category})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select onValueChange={(value) => setCardLeaderForm({...cardLeaderForm, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUB-11">SUB-11</SelectItem>
                  <SelectItem value="SUB-13">SUB-13</SelectItem>
                  <SelectItem value="SUB-15">SUB-15</SelectItem>
                  <SelectItem value="SUB-17">SUB-17</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="championship">Campeonato (opcional)</Label>
              <Select onValueChange={(value) => setCardLeaderForm({...cardLeaderForm, championshipId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um campeonato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {championships.map(championship => (
                    <SelectItem key={championship.id} value={championship.id}>{championship.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="yellowCards">Número de Cartões Amarelos</Label>
              <Input 
                id="yellowCards" 
                type="number" 
                value={cardLeaderForm.yellowCards}
                onChange={(e) => setCardLeaderForm({...cardLeaderForm, yellowCards: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetCardLeaderForm();
              setIsAddingCardLeaderOpen(false);
            }}>
              Cancelar
            </Button>
            <Button className="bg-[#1a237e]" onClick={handleAddCardLeader}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Yellow Card Leader Dialog */}
      <Dialog open={isEditingCardLeaderOpen} onOpenChange={setIsEditingCardLeaderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cartões do Jogador</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="player">Jogador</Label>
              <Select 
                value={cardLeaderForm.playerId} 
                onValueChange={(value) => setCardLeaderForm({...cardLeaderForm, playerId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um jogador" />
                </SelectTrigger>
                <SelectContent>
                  {players.map(player => (
                    <SelectItem key={player.id} value={player.id}>{player.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="team">Time</Label>
              <Select 
                value={cardLeaderForm.teamId} 
                onValueChange={(value) => setCardLeaderForm({...cardLeaderForm, teamId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um time" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>{team.name} ({team.category})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select 
                value={cardLeaderForm.category} 
                onValueChange={(value) => setCardLeaderForm({...cardLeaderForm, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUB-11">SUB-11</SelectItem>
                  <SelectItem value="SUB-13">SUB-13</SelectItem>
                  <SelectItem value="SUB-15">SUB-15</SelectItem>
                  <SelectItem value="SUB-17">SUB-17</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="championship">Campeonato (opcional)</Label>
              <Select 
                value={cardLeaderForm.championshipId} 
                onValueChange={(value) => setCardLeaderForm({...cardLeaderForm, championshipId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um campeonato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {championships.map(championship => (
                    <SelectItem key={championship.id} value={championship.id}>{championship.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="yellowCards">Número de Cartões Amarelos</Label>
              <Input 
                id="yellowCards" 
                type="number" 
                value={cardLeaderForm.yellowCards}
                onChange={(e) => setCardLeaderForm({...cardLeaderForm, yellowCards: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSelectedCardLeader(null);
              resetCardLeaderForm();
              setIsEditingCardLeaderOpen(false);
            }}>
              Cancelar
            </Button>
            <Button className="bg-[#1a237e]" onClick={handleUpdateCardLeader}>
              Atualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StatisticsManagement;
