
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Pencil, Trash2, Calendar } from 'lucide-react';
import { format, parse } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { Match } from '@/types';

type MatchFormData = {
  date: string;
  time: string;
  location: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'postponed' | 'canceled';
  category: string;
  round: string | null;
  championshipId: string | null;
};

const MatchManagement = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterChampionship, setFilterChampionship] = useState("all");
  const [championships, setChampionships] = useState<{ id: string; name: string }[]>([]);
  const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
  const { toast } = useToast();

  // Form states
  const [formData, setFormData] = useState<MatchFormData>({
    date: '',
    time: '',
    location: '',
    homeTeam: '',
    awayTeam: '',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    category: '',
    round: null,
    championshipId: null,
  });

  // Fetch matches data from Supabase
  useEffect(() => {
    fetchMatches();
    fetchChampionshipList();
    fetchTeamList();
  }, []);

  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team_name:home_team (name),
          away_team_name:away_team (name)
        `)
        .order('date', { ascending: false });

      if (error) throw error;

      // Transform the data to match our interface
      const transformedData = data.map(match => ({
        id: match.id,
        date: match.date,
        time: match.time,
        location: match.location,
        homeTeam: match.home_team,
        awayTeam: match.away_team,
        homeScore: match.home_score,
        awayScore: match.away_score,
        status: match.status as Match['status'],
        category: match.category,
        round: match.round,
        championshipId: match.championship_id,
        homeTeamName: match.home_team_name ? match.home_team_name.name : '',
        awayTeamName: match.away_team_name ? match.away_team_name.name : '',
      }));

      setMatches(transformedData);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar partidas",
        description: "Não foi possível carregar as partidas."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChampionshipList = async () => {
    try {
      const { data, error } = await supabase
        .from('championships')
        .select('id, name')
        .order('name');

      if (error) throw error;

      setChampionships(data || []);
    } catch (error) {
      console.error('Error fetching championships:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar campeonatos",
        description: "Não foi possível carregar a lista de campeonatos."
      });
    }
  };

  const fetchTeamList = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('id, name')
        .order('name');

      if (error) throw error;

      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar times",
        description: "Não foi possível carregar a lista de times."
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMatch = async () => {
    if (!validateForm()) return;

    try {
      const { data, error } = await supabase
        .from('matches')
        .insert({
          date: formData.date,
          time: formData.time,
          location: formData.location,
          home_team: formData.homeTeam,
          away_team: formData.awayTeam,
          home_score: formData.homeScore,
          away_score: formData.awayScore,
          status: formData.status,
          category: formData.category,
          round: formData.round,
          championship_id: formData.championshipId,
        })
        .select(`
          *,
          home_team_name:home_team (name),
          away_team_name:away_team (name)
        `);

      if (error) throw error;

      // Transform to match our interface
      const newMatch = {
        id: data[0].id,
        date: data[0].date,
        time: data[0].time,
        location: data[0].location,
        homeTeam: data[0].home_team,
        awayTeam: data[0].away_team,
        homeScore: data[0].home_score,
        awayScore: data[0].away_score,
        status: data[0].status as Match['status'],
        category: data[0].category,
        round: data[0].round,
        championshipId: data[0].championship_id,
        homeTeamName: data[0].home_team_name ? data[0].home_team_name.name : '',
        awayTeamName: data[0].away_team_name ? data[0].away_team_name.name : '',
      };

      setMatches([newMatch, ...matches]);

      toast({
        title: "Partida adicionada",
        description: "A partida foi adicionada com sucesso."
      });

      resetForm();
      setActiveTab('list');
    } catch (error) {
      console.error('Error adding match:', error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar partida",
        description: "Não foi possível adicionar a partida."
      });
    }
  };

  const handleUpdateMatch = async () => {
    if (!selectedMatch || !validateForm()) return;

    try {
      const { data, error } = await supabase
        .from('matches')
        .update({
          date: formData.date,
          time: formData.time,
          location: formData.location,
          home_team: formData.homeTeam,
          away_team: formData.awayTeam,
          home_score: formData.homeScore,
          away_score: formData.awayScore,
          status: formData.status,
          category: formData.category,
          round: formData.round,
          championship_id: formData.championshipId,
        })
        .eq('id', selectedMatch.id)
        .select(`
          *,
          home_team_name:home_team (name),
          away_team_name:away_team (name)
        `);

      if (error) throw error;

      // Transform to match our interface
      const updatedMatch = {
        id: data[0].id,
        date: data[0].date,
        time: data[0].time,
        location: data[0].location,
        homeTeam: data[0].home_team,
        awayTeam: data[0].away_team,
        homeScore: data[0].home_score,
        awayScore: data[0].away_score,
        status: data[0].status as Match['status'],
        category: data[0].category,
        round: data[0].round,
        championshipId: data[0].championship_id,
        homeTeamName: data[0].home_team_name ? data[0].home_team_name.name : '',
        awayTeamName: data[0].away_team_name ? data[0].away_team_name.name : '',
      };

      setMatches(matches.map(m => 
        m.id === selectedMatch.id ? updatedMatch : m
      ));

      toast({
        title: "Partida atualizada",
        description: "A partida foi atualizada com sucesso."
      });

      resetForm();
      setSelectedMatch(null);
      setActiveTab('list');
    } catch (error) {
      console.error('Error updating match:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar partida",
        description: "Não foi possível atualizar a partida."
      });
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta partida?")) return;

    try {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', matchId);

      if (error) throw error;

      // Remove the match from the list
      setMatches(matches.filter(match => match.id !== matchId));

      toast({
        title: "Partida removida",
        description: "A partida foi removida com sucesso."
      });
    } catch (error) {
      console.error('Error deleting match:', error);
      toast({
        variant: "destructive",
        title: "Erro ao remover partida",
        description: "Não foi possível remover a partida."
      });
    }
  };

  const handleEditMatch = (match: Match) => {
    setSelectedMatch(match);

    setFormData({
      date: match.date,
      time: match.time,
      location: match.location,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      status: match.status,
      category: match.category,
      round: match.round || null,
      championshipId: match.championshipId || null,
    });

    setActiveTab('edit');
  };

  const resetForm = () => {
    setFormData({
      date: '',
      time: '',
      location: '',
      homeTeam: '',
      awayTeam: '',
      homeScore: null,
      awayScore: null,
      status: 'scheduled',
      category: '',
      round: null,
      championshipId: null,
    });
  };

  const validateForm = () => {
    const requiredFields = ['date', 'time', 'location', 'homeTeam', 'awayTeam', 'category', 'status'] as const;
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: `Por favor, preencha os campos: ${missingFields.join(', ')}.`
      });
      return false;
    }

    // Validate if homeTeam and awayTeam are different
    if (formData.homeTeam === formData.awayTeam) {
      toast({
        variant: "destructive",
        title: "Times inválidos",
        description: "O time da casa e o time visitante devem ser diferentes."
      });
      return false;
    }

    return true;
  };

  // Filter matches based on search and category
  const filteredMatches = matches.filter(match => {
    const matchesSearch =
      match.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (match.homeTeamName && match.homeTeamName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (match.awayTeamName && match.awayTeamName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = filterCategory === "all" || match.category === filterCategory;
    const matchesStatus = filterStatus === "all" || match.status === filterStatus;
    const matchesChampionship = filterChampionship === "all" || match.championshipId === filterChampionship;

    return matchesSearch && matchesCategory && matchesStatus && matchesChampionship;
  });

  const formatStatus = (status: Match['status']) => {
    switch (status) {
      case 'scheduled':
        return 'Agendado';
      case 'in_progress':
        return 'Em andamento';
      case 'completed':
        return 'Finalizado';
      case 'postponed':
        return 'Adiado';
      case 'canceled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a237e]">Gerenciamento de Partidas</h2>
        {activeTab === 'list' && (
          <Button
            onClick={() => setActiveTab('add')}
            className="flex items-center gap-2 bg-[#1a237e] text-white hover:bg-blue-800"
          >
            <PlusCircle size={16} />
            Adicionar Nova Partida
          </Button>
        )}
      </div>

      {activeTab === 'list' && (
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
                <option value="all">Todas as Categorias</option>
                {/* Aqui você pode adicionar as opções de categoria dinamicamente, se necessário */}
                <option value="SUB-11">SUB-11</option>
                <option value="SUB-13">SUB-13</option>
                <option value="SUB-15">SUB-15</option>
                <option value="SUB-17">SUB-17</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-md border border-input px-3 py-2 text-sm"
              >
                <option value="all">Todos os Status</option>
                <option value="scheduled">Agendado</option>
                <option value="in_progress">Em Andamento</option>
                <option value="completed">Finalizado</option>
                <option value="postponed">Adiado</option>
                <option value="canceled">Cancelado</option>
              </select>
              <select
                value={filterChampionship}
                onChange={(e) => setFilterChampionship(e.target.value)}
                className="rounded-md border border-input px-3 py-2 text-sm"
              >
                <option value="all">Todos os Campeonatos</option>
                {championships.map(championship => (
                  <option key={championship.id} value={championship.id}>{championship.name}</option>
                ))}
              </select>
            </div>
          </div>

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
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="font-semibold">Data:</p>
                          <p>{new Date(match.date).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Hora:</p>
                          <p>{match.time}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Local:</p>
                          <p>{match.location}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Categoria:</p>
                          <p>{match.category}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Status:</p>
                          <p>{formatStatus(match.status)}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Campeonato:</p>
                          <p>{championships.find(c => c.id === match.championshipId)?.name || 'Nenhum'}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="font-semibold">Times:</p>
                        <p>{match.homeTeamName} x {match.awayTeamName}</p>
                      </div>
                      <div className="mt-2">
                        <p className="font-semibold">Placar:</p>
                        <p>{match.homeScore !== null ? match.homeScore : '-'} x {match.awayScore !== null ? match.awayScore : '-'}</p>
                      </div>
                    </div>
                    <div className="flex justify-end p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                        onClick={() => handleEditMatch(match)}
                      >
                        <Pencil size={16} className="text-blue-800" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 bg-white/80 hover:bg-white ml-2"
                        onClick={() => handleDeleteMatch(match.id)}
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {(activeTab === 'add' || activeTab === 'edit') && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-4 text-[#1a237e]">
              {activeTab === 'add' ? 'Adicionar Nova Partida' : 'Editar Partida'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Hora *</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Local *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Ex: Campo do Instituto - Santa Maria, DF"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Ex: SUB-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="homeTeam">Time da Casa *</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, homeTeam: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o time da casa" defaultValue={formData.homeTeam} />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map(team => (
                      <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="awayTeam">Time Visitante *</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, awayTeam: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o time visitante" defaultValue={formData.awayTeam} />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map(team => (
                      <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="homeScore">Placar Time da Casa</Label>
                <Input
                  id="homeScore"
                  name="homeScore"
                  type="number"
                  value={formData.homeScore || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, homeScore: e.target.value === '' ? null : parseInt(e.target.value) }))}
                  placeholder="Ex: 2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="awayScore">Placar Time Visitante</Label>
                <Input
                  id="awayScore"
                  name="awayScore"
                  type="number"
                  value={formData.awayScore || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, awayScore: e.target.value === '' ? null : parseInt(e.target.value) }))}
                  placeholder="Ex: 1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input px-3 py-2"
                >
                  <option value="scheduled">Agendado</option>
                  <option value="in_progress">Em andamento</option>
                  <option value="completed">Finalizado</option>
                  <option value="postponed">Adiado</option>
                  <option value="canceled">Cancelado</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="round">Rodada</Label>
                <Input
                  id="round"
                  name="round"
                  value={formData.round || ''}
                  onChange={handleInputChange}
                  placeholder="Ex: Final"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="championshipId">Campeonato</Label>
                <select
                  id="championshipId"
                  name="championshipId"
                  value={formData.championshipId || ''}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input px-3 py-2"
                >
                  <option value="">Nenhum</option>
                  {championships.map(championship => (
                    <option key={championship.id} value={championship.id}>{championship.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setSelectedMatch(null);
                  setActiveTab('list');
                }}
              >
                Cancelar
              </Button>
              <Button
                className="bg-[#1a237e] text-white hover:bg-blue-800"
                onClick={activeTab === 'add' ? handleAddMatch : handleUpdateMatch}
              >
                {activeTab === 'add' ? 'Adicionar Partida' : 'Atualizar Partida'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MatchManagement;
