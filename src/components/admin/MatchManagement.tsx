
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Calendar, Clock, MapPin, Users, Flag, Trophy } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

type Team = {
  id: string;
  name: string;
  logo: string | null;
  category: string;
  group_name: string;
};

type Player = {
  id: string;
  name: string;
  position: string;
  number: number | null;
  team_id: string;
};

type Goal = {
  id: string;
  match_id: string;
  player_id: string;
  team_id: string;
  minute: number | null;
  half: string | null;
  player_name?: string;
};

type MatchStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

type Match = {
  id: string;
  date: string;
  time: string;
  location: string;
  category: string;
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  status: MatchStatus;
  championship_id: string | null;
  round: string;
  homeTeamDetails?: Team;
  awayTeamDetails?: Team;
  goals?: Goal[];
};

const statusColorMap: Record<MatchStatus, string> = {
  "scheduled": "bg-blue-100 text-blue-800",
  "in_progress": "bg-green-100 text-green-800",
  "completed": "bg-gray-100 text-gray-800",
  "cancelled": "bg-red-100 text-red-800"
};

const statusTextMap: Record<MatchStatus, string> = {
  "scheduled": "Agendado",
  "in_progress": "Em andamento",
  "completed": "Finalizado",
  "cancelled": "Cancelado"
};

const MatchManagement: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedTab, setSelectedTab] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [homeTeamPlayers, setHomeTeamPlayers] = useState<Player[]>([]);
  const [awayTeamPlayers, setAwayTeamPlayers] = useState<Player[]>([]);
  const [isManagingGoals, setIsManagingGoals] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: "Campo do Instituto",
    category: "",
    home_team: "",
    away_team: "",
    home_score: "",
    away_score: "",
    status: "scheduled" as MatchStatus,
    championship_id: "",
    round: ""
  });

  const [goals, setGoals] = useState<Goal[]>([]);
  const [tempGoals, setTempGoals] = useState<Goal[]>([]);
  const [newGoalData, setNewGoalData] = useState({
    player_id: "",
    team_id: "",
    minute: "",
    half: "1"
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('name');

      if (teamsError) throw teamsError;
      setTeams(teamsData || []);

      // Fetch players
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('*')
        .order('name');

      if (playersError) throw playersError;
      setPlayers(playersData || []);

      // Fetch matches with team details
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select(`
          *,
          homeTeam:home_team(id, name, logo, category, group_name),
          awayTeam:away_team(id, name, logo, category, group_name)
        `)
        .order('date', { ascending: false });

      if (matchesError) throw matchesError;

      // Fetch goals for all matches
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select(`
          *,
          players:player_id(name)
        `);

      if (goalsError) throw goalsError;

      // Transform matches and add team details and goals
      const transformedMatches = matchesData?.map(match => {
        const matchGoals = goalsData?.filter(goal => goal.match_id === match.id) || [];
        const transformedGoals = matchGoals.map(goal => ({
          ...goal,
          player_name: goal.players?.name
        }));
        
        return {
          ...match,
          homeTeamDetails: match.homeTeam,
          awayTeamDetails: match.awayTeam,
          goals: transformedGoals
        };
      }) || [];

      setMatches(transformedMatches);
      setGoals(goalsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados necessários."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // When the team changes, update the available players
    if (name === 'home_team' || name === 'away_team') {
      if (name === 'home_team') {
        const homePlayers = players.filter(player => player.team_id === value);
        setHomeTeamPlayers(homePlayers);
      } else {
        const awayPlayers = players.filter(player => player.team_id === value);
        setAwayTeamPlayers(awayPlayers);
      }
    }
  };

  const handleCreateMatch = async () => {
    if (!formData.date || !formData.time || !formData.location || 
        !formData.category || !formData.home_team || !formData.away_team || !formData.round) {
      toast({
        variant: "destructive",
        title: "Erro ao criar partida",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    const homeTeam = teams.find(team => team.id === formData.home_team);
    const awayTeam = teams.find(team => team.id === formData.away_team);

    if (!homeTeam || !awayTeam) {
      toast({
        variant: "destructive",
        title: "Erro ao criar partida",
        description: "Times selecionados inválidos.",
      });
      return;
    }

    if (homeTeam.id === awayTeam.id) {
      toast({
        variant: "destructive",
        title: "Erro ao criar partida",
        description: "O time da casa e o time visitante não podem ser o mesmo.",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('matches')
        .insert([{
          date: formData.date,
          time: formData.time,
          location: formData.location,
          category: formData.category,
          home_team: formData.home_team,
          away_team: formData.away_team,
          home_score: null,
          away_score: null,
          status: formData.status,
          championship_id: formData.championship_id || null,
          round: formData.round
        }])
        .select(`
          *,
          homeTeam:home_team(id, name, logo, category, group_name),
          awayTeam:away_team(id, name, logo, category, group_name)
        `);

      if (error) throw error;

      if (data && data.length > 0) {
        const newMatch = {
          ...data[0],
          homeTeamDetails: data[0].homeTeam,
          awayTeamDetails: data[0].awayTeam,
          goals: []
        };
        
        setMatches([newMatch, ...matches]);
        setIsCreating(false);
        resetForm();
        
        toast({
          title: "Partida criada",
          description: "A partida foi criada com sucesso.",
        });
      }
    } catch (error) {
      console.error('Error creating match:', error);
      toast({
        variant: "destructive",
        title: "Erro ao criar partida",
        description: "Ocorreu um erro ao criar a partida.",
      });
    }
  };

  const handleUpdateMatch = async () => {
    if (!currentMatch) return;

    if (!formData.date || !formData.time || !formData.location || 
        !formData.category || !formData.round) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar partida",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    const homeTeam = formData.home_team ? 
      teams.find(team => team.id === formData.home_team) : 
      teams.find(team => team.id === currentMatch.home_team);
      
    const awayTeam = formData.away_team ? 
      teams.find(team => team.id === formData.away_team) : 
      teams.find(team => team.id === currentMatch.away_team);

    if (!homeTeam || !awayTeam) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar partida",
        description: "Times selecionados inválidos.",
      });
      return;
    }

    if (homeTeam.id === awayTeam.id) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar partida",
        description: "O time da casa e o time visitante não podem ser o mesmo.",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('matches')
        .update({
          date: formData.date,
          time: formData.time,
          location: formData.location,
          category: formData.category,
          home_team: formData.home_team || currentMatch.home_team,
          away_team: formData.away_team || currentMatch.away_team,
          status: formData.status,
          championship_id: formData.championship_id || null,
          round: formData.round
        })
        .eq('id', currentMatch.id)
        .select(`
          *,
          homeTeam:home_team(id, name, logo, category, group_name),
          awayTeam:away_team(id, name, logo, category, group_name)
        `);

      if (error) throw error;

      if (data && data.length > 0) {
        const currentGoals = currentMatch.goals || [];
        
        const updatedMatch = {
          ...data[0],
          homeTeamDetails: data[0].homeTeam,
          awayTeamDetails: data[0].awayTeam,
          goals: currentGoals
        };
        
        setMatches(matches.map(match => 
          match.id === currentMatch.id ? updatedMatch : match
        ));
        
        setIsEditing(false);
        setCurrentMatch(null);
        resetForm();
        
        toast({
          title: "Partida atualizada",
          description: "A partida foi atualizada com sucesso.",
        });
      }
    } catch (error) {
      console.error('Error updating match:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar partida",
        description: "Ocorreu um erro ao atualizar a partida.",
      });
    }
  };

  const handleDeleteMatch = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta partida?")) return;

    try {
      // Goals will be automatically deleted due to the CASCADE constraint
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMatches(matches.filter(match => match.id !== id));
      
      toast({
        title: "Partida excluída",
        description: "A partida foi excluída com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting match:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir partida",
        description: "Ocorreu um erro ao excluir a partida.",
      });
    }
  };

  const handleManageGoals = (match: Match) => {
    setCurrentMatch(match);
    setIsManagingGoals(true);
    // Load existing goals for this match
    const matchGoals = match.goals || [];
    setTempGoals([...matchGoals]);
    
    // Set available players for both teams
    const homePlayers = players.filter(player => player.team_id === match.home_team);
    const awayPlayers = players.filter(player => player.team_id === match.away_team);
    setHomeTeamPlayers(homePlayers);
    setAwayTeamPlayers(awayPlayers);
  };

  const handleAddGoal = () => {
    if (!newGoalData.player_id || !newGoalData.team_id) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, selecione o jogador e o time."
      });
      return;
    }

    if (!currentMatch) return;

    const player = players.find(p => p.id === newGoalData.player_id);
    
    if (!player) {
      toast({
        variant: "destructive",
        title: "Jogador inválido",
        description: "O jogador selecionado não foi encontrado."
      });
      return;
    }
    
    // Check if player belongs to selected team
    if (player.team_id !== newGoalData.team_id) {
      toast({
        variant: "destructive",
        title: "Time inválido",
        description: "O jogador selecionado não pertence ao time selecionado."
      });
      return;
    }

    const newGoal: Goal = {
      id: `temp-${Date.now()}`, // Temporary ID until we save to the database
      match_id: currentMatch.id,
      player_id: newGoalData.player_id,
      team_id: newGoalData.team_id,
      minute: newGoalData.minute ? parseInt(newGoalData.minute) : null,
      half: newGoalData.half || null,
      player_name: player.name
    };

    setTempGoals([...tempGoals, newGoal]);
    
    // Reset new goal form
    setNewGoalData({
      player_id: "",
      team_id: "",
      minute: "",
      half: "1"
    });
  };

  const handleRemoveGoal = (index: number) => {
    const updatedGoals = [...tempGoals];
    updatedGoals.splice(index, 1);
    setTempGoals(updatedGoals);
  };

  const handleSaveGoals = async () => {
    if (!currentMatch) return;

    try {
      // First, delete all existing goals for this match (easier than determining which to update/delete/insert)
      const { error: deleteError } = await supabase
        .from('goals')
        .delete()
        .eq('match_id', currentMatch.id);

      if (deleteError) throw deleteError;

      // Then insert all the temporary goals
      if (tempGoals.length > 0) {
        const goalsToInsert = tempGoals.map(goal => ({
          match_id: goal.match_id,
          player_id: goal.player_id,
          team_id: goal.team_id,
          minute: goal.minute,
          half: goal.half
        }));

        const { data: insertedGoals, error: insertError } = await supabase
          .from('goals')
          .insert(goalsToInsert)
          .select(`
            *,
            players:player_id(name)
          `);

        if (insertError) throw insertError;

        // Transform the inserted goals to include player_name
        const transformedGoals = insertedGoals?.map(goal => ({
          ...goal,
          player_name: goal.players?.name
        }));

        // Update the match in state
        const homeTeamGoalCount = tempGoals.filter(g => g.team_id === currentMatch.home_team).length;
        const awayTeamGoalCount = tempGoals.filter(g => g.team_id === currentMatch.away_team).length;

        const updatedMatches = matches.map(match => {
          if (match.id === currentMatch.id) {
            return {
              ...match,
              home_score: homeTeamGoalCount,
              away_score: awayTeamGoalCount,
              goals: transformedGoals
            };
          }
          return match;
        });

        setMatches(updatedMatches);
      }

      setIsManagingGoals(false);
      setCurrentMatch(null);
      setTempGoals([]);

      toast({
        title: "Gols salvos",
        description: "Os gols foram salvos com sucesso."
      });

      // Refresh data to get updated scores
      fetchData();
    } catch (error) {
      console.error('Error saving goals:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar gols",
        description: "Ocorreu um erro ao salvar os gols."
      });
    }
  };

  const resetForm = () => {
    setFormData({
      date: "",
      time: "",
      location: "Campo do Instituto",
      category: "",
      home_team: "",
      away_team: "",
      home_score: "",
      away_score: "",
      status: "scheduled",
      championship_id: "",
      round: ""
    });
  };

  const openEditDialog = (match: Match) => {
    setCurrentMatch(match);
    setFormData({
      date: match.date,
      time: match.time,
      location: match.location,
      category: match.category,
      home_team: match.home_team,
      away_team: match.away_team,
      home_score: match.home_score?.toString() || "",
      away_score: match.away_score?.toString() || "",
      status: match.status,
      championship_id: match.championship_id || "",
      round: match.round
    });
    
    // Set available players for both teams
    const homePlayers = players.filter(player => player.team_id === match.home_team);
    const awayPlayers = players.filter(player => player.team_id === match.away_team);
    setHomeTeamPlayers(homePlayers);
    setAwayTeamPlayers(awayPlayers);
    
    setIsEditing(true);
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // Get all categories for the filter
  const categories = [...new Set(matches.map(match => match.category))];

  // Filter matches based on search term, category, and tab
  const filteredMatches = matches.filter(match => {
    const homeTeamName = match.homeTeamDetails?.name?.toLowerCase() || '';
    const awayTeamName = match.awayTeamDetails?.name?.toLowerCase() || '';
    const location = match.location.toLowerCase();
    
    const matchesSearch = 
      homeTeamName.includes(searchTerm.toLowerCase()) || 
      awayTeamName.includes(searchTerm.toLowerCase()) ||
      location.includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || match.category === filterCategory;
    const matchesTab = selectedTab === "all" || match.status === selectedTab;
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a237e]">Gerenciamento de Partidas</h2>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="bg-[#1a237e] text-white hover:bg-blue-800">
              <Plus size={16} className="mr-2" /> Nova Partida
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Nova Partida</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Local</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Local da partida"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="SUB-11">SUB-11</option>
                    <option value="SUB-13">SUB-13</option>
                    <option value="SUB-15">SUB-15</option>
                    <option value="SUB-17">SUB-17</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="round">Rodada</Label>
                  <Input
                    id="round"
                    name="round"
                    value={formData.round}
                    onChange={handleInputChange}
                    placeholder="Ex: 1"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="home_team">Time da Casa</Label>
                <select
                  id="home_team"
                  name="home_team"
                  value={formData.home_team}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm"
                  required
                >
                  <option value="">Selecione o time...</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name} ({team.category})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="away_team">Time Visitante</Label>
                <select
                  id="away_team"
                  name="away_team"
                  value={formData.away_team}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm"
                  required
                >
                  <option value="">Selecione o time...</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name} ({team.category})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setIsCreating(false);
                resetForm();
              }}>Cancelar</Button>
              <Button onClick={handleCreateMatch} className="bg-[#1a237e] text-white hover:bg-blue-800">Criar Partida</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1">
            <Input
              placeholder="Buscar partidas..."
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

        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full grid grid-cols-5 mb-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="scheduled">Agendados</TabsTrigger>
            <TabsTrigger value="in_progress">Em andamento</TabsTrigger>
            <TabsTrigger value="completed">Finalizados</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Carregando partidas...</p>
              </div>
            ) : filteredMatches.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma partida encontrada.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMatches.map(match => (
                  <Card key={match.id} className="overflow-hidden">
                    <CardHeader className="bg-[#1a237e] text-white py-3 px-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{formatDate(match.date)} • {match.time}</span>
                        </div>
                        <div className={`text-xs font-medium rounded-full px-2 py-1 ${statusColorMap[match.status]}`}>
                          {statusTextMap[match.status]}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-600">{match.location}</span>
                      </div>
                      
                      <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-gray-500" />
                          <span className="text-sm text-gray-600">{match.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Flag size={16} className="text-gray-500" />
                          <span className="text-sm text-gray-600">Rodada {match.round}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-4">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 flex items-center justify-center bg-white shadow-sm rounded-full overflow-hidden">
                            {match.homeTeamDetails?.logo ? (
                              <img 
                                src={match.homeTeamDetails.logo} 
                                alt={match.homeTeamDetails.name} 
                                className="w-10 h-10 object-contain"
                              />
                            ) : (
                              <Users size={20} className="text-gray-400" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-center mt-1">{match.homeTeamDetails?.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-[#1a237e] text-white rounded flex items-center justify-center font-bold">
                            {match.home_score !== null ? match.home_score : "-"}
                          </div>
                          <span className="font-bold">x</span>
                          <div className="w-10 h-10 bg-[#1a237e] text-white rounded flex items-center justify-center font-bold">
                            {match.away_score !== null ? match.away_score : "-"}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 flex items-center justify-center bg-white shadow-sm rounded-full overflow-hidden">
                            {match.awayTeamDetails?.logo ? (
                              <img 
                                src={match.awayTeamDetails.logo} 
                                alt={match.awayTeamDetails.name} 
                                className="w-10 h-10 object-contain"
                              />
                            ) : (
                              <Users size={20} className="text-gray-400" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-center mt-1">{match.awayTeamDetails?.name}</span>
                        </div>
                      </div>

                      {/* Show goal scorers */}
                      {match.goals && match.goals.length > 0 && (
                        <div className="mb-4 p-2 border border-gray-100 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Trophy size={16} className="text-yellow-500" />
                            <span className="font-medium">Gols:</span>
                          </div>
                          <ul className="text-sm space-y-1">
                            {match.goals.map((goal, index) => (
                              <li key={goal.id || index} className="flex justify-between">
                                <span>{goal.player_name}</span>
                                <span className="text-gray-500">
                                  {goal.minute ? `${goal.minute}' ${goal.half === '2' ? '2T' : '1T'}` : ''}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleManageGoals(match)}
                          className="flex items-center gap-1"
                        >
                          <Trophy size={14} /> Gols
                        </Button>

                        <Dialog open={isEditing && currentMatch?.id === match.id} onOpenChange={(open) => {
                          if (!open) {
                            setIsEditing(false);
                            setCurrentMatch(null);
                            resetForm();
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openEditDialog(match)}
                              className="flex items-center gap-1"
                            >
                              <Edit size={14} /> Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Editar Partida</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-date">Data</Label>
                                  <Input
                                    id="edit-date"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-time">Horário</Label>
                                  <Input
                                    id="edit-time"
                                    name="time"
                                    type="time"
                                    value={formData.time}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-location">Local</Label>
                                <Input
                                  id="edit-location"
                                  name="location"
                                  value={formData.location}
                                  onChange={handleInputChange}
                                  placeholder="Local da partida"
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-category">Categoria</Label>
                                  <select
                                    id="edit-category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-input px-3 py-2 text-sm"
                                    required
                                  >
                                    <option value="SUB-11">SUB-11</option>
                                    <option value="SUB-13">SUB-13</option>
                                    <option value="SUB-15">SUB-15</option>
                                    <option value="SUB-17">SUB-17</option>
                                  </select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-round">Rodada</Label>
                                  <Input
                                    id="edit-round"
                                    name="round"
                                    value={formData.round}
                                    onChange={handleInputChange}
                                    placeholder="Ex: 1"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-status">Status</Label>
                                <select
                                  id="edit-status"
                                  name="status"
                                  value={formData.status}
                                  onChange={handleInputChange}
                                  className="w-full rounded-md border border-input px-3 py-2 text-sm"
                                  required
                                >
                                  <option value="scheduled">Agendado</option>
                                  <option value="in_progress">Em andamento</option>
                                  <option value="completed">Finalizado</option>
                                  <option value="cancelled">Cancelado</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => {
                                setIsEditing(false);
                                setCurrentMatch(null);
                                resetForm();
                              }}>Cancelar</Button>
                              <Button onClick={handleUpdateMatch} className="bg-[#1a237e] text-white hover:bg-blue-800">Salvar Alterações</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteMatch(match.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 size={14} /> Excluir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Goals Management Dialog */}
      <Dialog open={isManagingGoals} onOpenChange={(open) => {
        if (!open) {
          setIsManagingGoals(false);
          setCurrentMatch(null);
          setTempGoals([]);
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Gerenciar Gols da Partida</DialogTitle>
          </DialogHeader>
          {currentMatch && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{formatDate(currentMatch.date)} • {currentMatch.time}</span>
                  <Badge variant="outline">{currentMatch.category}</Badge>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-white shadow-sm rounded-full overflow-hidden mb-1">
                      {currentMatch.homeTeamDetails?.logo ? (
                        <img 
                          src={currentMatch.homeTeamDetails.logo} 
                          alt={currentMatch.homeTeamDetails.name} 
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <Users size={20} className="text-gray-400" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{currentMatch.homeTeamDetails?.name}</span>
                  </div>
                  
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{tempGoals.filter(g => g.team_id === currentMatch.home_team).length}</span>
                    <span className="text-xl">x</span>
                    <span className="text-2xl font-bold">{tempGoals.filter(g => g.team_id === currentMatch.away_team).length}</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-white shadow-sm rounded-full overflow-hidden mb-1">
                      {currentMatch.awayTeamDetails?.logo ? (
                        <img 
                          src={currentMatch.awayTeamDetails.logo} 
                          alt={currentMatch.awayTeamDetails.name} 
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <Users size={20} className="text-gray-400" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{currentMatch.awayTeamDetails?.name}</span>
                  </div>
                </div>
              </div>

              {/* Form to add a new goal */}
              <div className="space-y-3 p-3 border border-gray-200 rounded-lg">
                <h3 className="font-medium flex items-center gap-2">
                  <Trophy size={16} className="text-yellow-500" />
                  Adicionar Gol
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="goal-team" className="text-sm">Time</Label>
                    <select
                      id="goal-team"
                      name="team_id"
                      value={newGoalData.team_id}
                      onChange={(e) => setNewGoalData({...newGoalData, team_id: e.target.value})}
                      className="w-full rounded-md border border-input px-3 py-2 text-sm"
                    >
                      <option value="">Selecione o time</option>
                      <option value={currentMatch.home_team}>{currentMatch.homeTeamDetails?.name}</option>
                      <option value={currentMatch.away_team}>{currentMatch.awayTeamDetails?.name}</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="goal-player" className="text-sm">Jogador</Label>
                    <select
                      id="goal-player"
                      name="player_id"
                      value={newGoalData.player_id}
                      onChange={(e) => setNewGoalData({...newGoalData, player_id: e.target.value})}
                      className="w-full rounded-md border border-input px-3 py-2 text-sm"
                    >
                      <option value="">Selecione o jogador</option>
                      {newGoalData.team_id === currentMatch.home_team ? (
                        homeTeamPlayers.map(player => (
                          <option key={player.id} value={player.id}>
                            {player.name} {player.number ? `(${player.number})` : ''}
                          </option>
                        ))
                      ) : newGoalData.team_id === currentMatch.away_team ? (
                        awayTeamPlayers.map(player => (
                          <option key={player.id} value={player.id}>
                            {player.name} {player.number ? `(${player.number})` : ''}
                          </option>
                        ))
                      ) : null}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="goal-minute" className="text-sm">Minuto (opcional)</Label>
                    <Input
                      id="goal-minute"
                      name="minute"
                      type="number"
                      min="1"
                      max="90"
                      placeholder="Ex: 32"
                      value={newGoalData.minute}
                      onChange={(e) => setNewGoalData({...newGoalData, minute: e.target.value})}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal-half" className="text-sm">Tempo</Label>
                    <select
                      id="goal-half"
                      name="half"
                      value={newGoalData.half}
                      onChange={(e) => setNewGoalData({...newGoalData, half: e.target.value})}
                      className="w-full rounded-md border border-input px-3 py-2 text-sm"
                    >
                      <option value="1">1º Tempo</option>
                      <option value="2">2º Tempo</option>
                    </select>
                  </div>
                </div>
                <div className="pt-2">
                  <Button 
                    onClick={handleAddGoal}
                    className="w-full bg-[#1a237e] text-white hover:bg-blue-800"
                  >
                    Adicionar Gol
                  </Button>
                </div>
              </div>

              {/* List of goals */}
              <div className="space-y-2">
                <h3 className="font-medium">Gols da Partida ({tempGoals.length})</h3>
                {tempGoals.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-2">Nenhum gol registrado</p>
                ) : (
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {tempGoals.map((goal, index) => {
                      const player = players.find(p => p.id === goal.player_id);
                      const isHomeTeam = goal.team_id === currentMatch.home_team;
                      const teamName = isHomeTeam 
                        ? currentMatch.homeTeamDetails?.name 
                        : currentMatch.awayTeamDetails?.name;
                      
                      return (
                        <div key={goal.id || index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isHomeTeam ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                            <span>{goal.player_name || player?.name}</span>
                            <span className="text-xs text-gray-500">({teamName})</span>
                            {goal.minute && (
                              <span className="text-xs text-gray-500">
                                {goal.minute}' {goal.half === '2' ? '2T' : '1T'}
                              </span>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveGoal(index)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => {
                  setIsManagingGoals(false);
                  setCurrentMatch(null);
                  setTempGoals([]);
                }}>Cancelar</Button>
                <Button 
                  onClick={handleSaveGoals}
                  className="bg-[#1a237e] text-white hover:bg-blue-800"
                >
                  Salvar Gols
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MatchManagement;
