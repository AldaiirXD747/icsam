
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getTeam } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { MapPin, Calendar, User, Phone, Mail, Trophy, Users } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  number: number | null;
  position: string;
  photo: string | null;
  category: string | null;
  team_id: string;
}

interface Match {
  id: string;
  date: string;
  time: string;
  location: string;
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  status: string;
  category: string;
  round: string | null;
  home_team_name?: string;
  away_team_name?: string;
}

const TeamDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [teamCategories, setTeamCategories] = useState<string[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Record<string, { name: string, logo: string | null }>>({});

  const { data: team, isLoading: isTeamLoading } = useQuery({
    queryKey: ['team', id],
    queryFn: () => getTeam(id || ''),
    enabled: !!id
  });

  // Fetch team categories
  useEffect(() => {
    if (!id) return;

    const fetchTeamCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('category')
          .eq('name', team?.name);

        if (error) throw error;
        
        const categories = data.map(item => item.category);
        setTeamCategories(categories);
        
        // Set active category to the first one by default
        if (categories.length > 0 && !activeCategory) {
          setActiveCategory(categories[0]);
        }
      } catch (error) {
        console.error('Error fetching team categories:', error);
      }
    };

    if (team?.name) {
      fetchTeamCategories();
    }
  }, [id, team?.name, activeCategory]);

  // Fetch players for the active category
  useEffect(() => {
    if (!id || !activeCategory) return;

    const fetchPlayers = async () => {
      try {
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .eq('team_id', id)
          .eq('category', activeCategory);

        if (error) throw error;
        setPlayers(data || []);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    fetchPlayers();
  }, [id, activeCategory]);

  // Fetch all teams for match display
  useEffect(() => {
    const fetchAllTeams = async () => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('id, name, logo');

        if (error) throw error;

        const teamsMap: Record<string, { name: string, logo: string | null }> = {};
        data?.forEach(team => {
          teamsMap[team.id] = { name: team.name, logo: team.logo };
        });

        setTeams(teamsMap);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchAllTeams();
  }, []);

  // Fetch matches for the team
  useEffect(() => {
    if (!id) return;

    const fetchMatches = async () => {
      try {
        const { data, error } = await supabase
          .from('matches')
          .select('*')
          .or(`home_team.eq.${id},away_team.eq.${id}`)
          .order('date', { ascending: false })
          .limit(10);

        if (error) throw error;

        // Add team names to matches
        const processedMatches = data.map(match => ({
          ...match,
          home_team_name: teams[match.home_team]?.name || 'Time não encontrado',
          away_team_name: teams[match.away_team]?.name || 'Time não encontrado'
        }));

        setMatches(processedMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    if (Object.keys(teams).length > 0) {
      fetchMatches();
    }
  }, [id, teams]);

  if (isTeamLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-primary"></div>
        </main>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Time não encontrado</h2>
            <p className="mt-2 text-gray-600">O time que você está procurando não existe ou foi removido.</p>
          </div>
        </main>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          {/* Team Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                {team.logo || team.logoUrl ? (
                  <img 
                    src={team.logo || team.logoUrl} 
                    alt={team.name} 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Trophy className="w-16 h-16 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-center md:text-left text-blue-primary">{team.name}</h1>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={18} />
                    <span>Origem: {team.city || 'Brasília'}, {team.state || 'DF'}</span>
                  </div>
                  
                  {team.foundationDate && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={18} />
                      <span>Fundado em: {team.foundationDate}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <User size={18} />
                    <span>Responsável: {team.description || 'Não informado'}</span>
                  </div>
                  
                  {team.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={18} />
                      <span>Telefone: {team.phone}</span>
                    </div>
                  )}
                  
                  {team.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={18} />
                      <span>Email: {team.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Categories Selection */}
            {teamCategories.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-3">Categorias:</h3>
                <div className="flex flex-wrap gap-2">
                  {teamCategories.map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        activeCategory === category
                          ? 'bg-blue-primary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="players" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="players" className="text-base">
                <Users className="w-4 h-4 mr-2" />
                Atletas
              </TabsTrigger>
              <TabsTrigger value="matches" className="text-base">
                <Trophy className="w-4 h-4 mr-2" />
                Partidas
              </TabsTrigger>
            </TabsList>

            {/* Players Tab */}
            <TabsContent value="players" className="space-y-6">
              {!activeCategory ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Selecione uma categoria para ver os atletas.</p>
                </div>
              ) : players.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum atleta cadastrado</h3>
                  <p className="text-gray-500">
                    Este time ainda não possui atletas cadastrados na categoria {activeCategory}.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {players.map(player => (
                    <Card key={player.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="bg-blue-primary text-white p-4">
                          <h3 className="font-bold">{player.name} {player.number && `#${player.number}`}</h3>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
                              {player.photo ? (
                                <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                              ) : (
                                <User size={24} className="text-gray-500" />
                              )}
                            </div>
                            <div>
                              <p><span className="font-semibold">Posição:</span> {player.position}</p>
                              <p><span className="font-semibold">Número:</span> {player.number || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Matches Tab */}
            <TabsContent value="matches" className="space-y-6">
              {matches.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma partida encontrada</h3>
                  <p className="text-gray-500">
                    Este time ainda não possui partidas registradas.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Time Casa</TableHead>
                        <TableHead>Placar</TableHead>
                        <TableHead>Time Visitante</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {matches.map(match => {
                        const isHomeTeam = match.home_team === id;
                        const statusMap: Record<string, string> = {
                          'scheduled': 'Agendado',
                          'in_progress': 'Em andamento',
                          'completed': 'Finalizado',
                          'postponed': 'Adiado',
                          'canceled': 'Cancelado'
                        };
                        
                        return (
                          <TableRow key={match.id}>
                            <TableCell>{formatDate(match.date)}</TableCell>
                            <TableCell>
                              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {match.category}
                              </span>
                            </TableCell>
                            <TableCell className={isHomeTeam ? 'font-semibold' : ''}>
                              {match.home_team_name}
                            </TableCell>
                            <TableCell>
                              {match.home_score !== null && match.away_score !== null 
                                ? `${match.home_score} x ${match.away_score}` 
                                : 'x'}
                            </TableCell>
                            <TableCell className={!isHomeTeam ? 'font-semibold' : ''}>
                              {match.away_team_name}
                            </TableCell>
                            <TableCell>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                match.status === 'completed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : match.status === 'canceled' 
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}>
                                {statusMap[match.status] || match.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default TeamDetail;
