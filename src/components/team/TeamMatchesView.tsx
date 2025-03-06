
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';

type Match = {
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
};

type Team = {
  id: string;
  name: string;
  logo: string | null;
};

const TeamMatchesView = ({ teamId }: { teamId: string }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Record<string, Team>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  useEffect(() => {
    fetchData();
  }, [teamId]);
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // First, fetch all teams to get their names and logos
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('id, name, logo');
        
      if (teamsError) throw teamsError;
      
      // Create a map of team ID to team details
      const teamsMap: Record<string, Team> = {};
      teamsData?.forEach(team => {
        teamsMap[team.id] = team;
      });
      
      setTeams(teamsMap);
      
      // Fetch matches where the team is either home or away
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .or(`home_team.eq.${teamId},away_team.eq.${teamId}`)
        .order('date', { ascending: true });
        
      if (matchesError) throw matchesError;
      
      // Add team names to matches
      const processedMatches = matchesData?.map(match => ({
        ...match,
        home_team_name: teamsMap[match.home_team]?.name || 'Time não encontrado',
        away_team_name: teamsMap[match.away_team]?.name || 'Time não encontrado'
      })) || [];
      
      setMatches(processedMatches);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar partidas",
        description: "Não foi possível carregar as partidas do time."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatMatchDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'dd/MM/yyyy');
    } catch (e) {
      return dateStr;
    }
  };
  
  const formatMatchTime = (timeStr: string) => {
    return timeStr.substring(0, 5); // Format "HH:MM" from "HH:MM:SS"
  };
  
  const getMatchStatus = (match: Match) => {
    switch (match.status) {
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
        return match.status;
    }
  };
  
  const filteredMatches = matches.filter(match => {
    const searchLower = searchTerm.toLowerCase();
    return (
      match.home_team_name?.toLowerCase().includes(searchLower) ||
      match.away_team_name?.toLowerCase().includes(searchLower) ||
      match.location.toLowerCase().includes(searchLower) ||
      match.category.toLowerCase().includes(searchLower) ||
      (match.round && match.round.toLowerCase().includes(searchLower))
    );
  });
  
  // Group matches by status
  const upcomingMatches = filteredMatches.filter(m => m.status === 'scheduled' || m.status === 'postponed');
  const completedMatches = filteredMatches.filter(m => m.status === 'completed');
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1a237e]">Partidas do Time</h2>
        <p className="text-gray-500 mt-1">Visualize todos os jogos do seu time</p>
      </div>
      
      <Input
        placeholder="Buscar partidas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full"
      />
      
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando partidas...</p>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhuma partida encontrada.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {upcomingMatches.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-[#1a237e] mb-4">Próximas Partidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingMatches.map(match => (
                  <Card key={match.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          {match.category}
                        </span>
                        <span className="text-sm font-medium px-2 py-1 bg-gray-100 text-gray-800 rounded">
                          {getMatchStatus(match)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} />
                          <span>{formatMatchDate(match.date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={16} />
                          <span>{formatMatchTime(match.time)}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-center flex-1">
                          <p className="font-semibold">{match.home_team_name}</p>
                        </div>
                        <div className="text-center px-4">
                          <span className="text-lg font-bold">vs</span>
                        </div>
                        <div className="text-center flex-1">
                          <p className="font-semibold">{match.away_team_name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} />
                        <span>{match.location}</span>
                      </div>
                      
                      {match.round && (
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Rodada:</span> {match.round}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {completedMatches.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-[#1a237e] mb-4">Partidas Finalizadas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedMatches.map(match => (
                  <Card key={match.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          {match.category}
                        </span>
                        <span className="text-sm font-medium px-2 py-1 bg-gray-100 text-gray-800 rounded">
                          {getMatchStatus(match)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} />
                          <span>{formatMatchDate(match.date)}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-center flex-1">
                          <p className="font-semibold">{match.home_team_name}</p>
                          <p className="text-2xl font-bold mt-1">{match.home_score ?? '-'}</p>
                        </div>
                        <div className="text-center px-4">
                          <span className="text-lg font-bold">x</span>
                        </div>
                        <div className="text-center flex-1">
                          <p className="font-semibold">{match.away_team_name}</p>
                          <p className="text-2xl font-bold mt-1">{match.away_score ?? '-'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} />
                        <span>{match.location}</span>
                      </div>
                      
                      {match.round && (
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Rodada:</span> {match.round}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamMatchesView;
