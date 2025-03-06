
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Activity, Medal, Users, Clock } from 'lucide-react';

type TeamStats = {
  totalMatches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  upcomingMatches: number;
  playerCount: number;
};

const TeamStats = ({ teamId }: { teamId: string }) => {
  const [stats, setStats] = useState<TeamStats>({
    totalMatches: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsScored: 0,
    goalsConceded: 0,
    upcomingMatches: 0,
    playerCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchTeamStats();
  }, [teamId]);
  
  const fetchTeamStats = async () => {
    try {
      setIsLoading(true);
      
      // Get completed matches
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .or(`home_team.eq.${teamId},away_team.eq.${teamId}`)
        .eq('status', 'completed');
        
      if (matchesError) throw matchesError;
      
      // Get upcoming matches
      const { data: upcomingMatchesData, error: upcomingError } = await supabase
        .from('matches')
        .select('*')
        .or(`home_team.eq.${teamId},away_team.eq.${teamId}`)
        .eq('status', 'scheduled');
        
      if (upcomingError) throw upcomingError;
      
      // Get player count
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('id')
        .eq('team_id', teamId);
        
      if (playersError) throw playersError;
      
      // Calculate stats
      let wins = 0;
      let draws = 0;
      let losses = 0;
      let goalsScored = 0;
      let goalsConceded = 0;
      
      matchesData?.forEach(match => {
        if (match.home_team === teamId) {
          // Team played as home
          goalsScored += match.home_score || 0;
          goalsConceded += match.away_score || 0;
          
          if ((match.home_score || 0) > (match.away_score || 0)) wins++;
          else if ((match.home_score || 0) === (match.away_score || 0)) draws++;
          else losses++;
        } else {
          // Team played as away
          goalsScored += match.away_score || 0;
          goalsConceded += match.home_score || 0;
          
          if ((match.away_score || 0) > (match.home_score || 0)) wins++;
          else if ((match.away_score || 0) === (match.home_score || 0)) draws++;
          else losses++;
        }
      });
      
      setStats({
        totalMatches: matchesData?.length || 0,
        wins,
        draws,
        losses,
        goalsScored,
        goalsConceded,
        upcomingMatches: upcomingMatchesData?.length || 0,
        playerCount: playersData?.length || 0
      });
    } catch (error) {
      console.error('Error fetching team stats:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar estatísticas",
        description: "Não foi possível carregar as estatísticas do time."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Carregando estatísticas...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1a237e]">Estatísticas do Time</h2>
        <p className="text-gray-500 mt-1">Resumo de desempenho e números do time</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Jogos</p>
                <p className="text-2xl font-bold">{stats.totalMatches}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                <Activity size={24} />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-gray-500">V</p>
                <p className="font-semibold text-green-600">{stats.wins}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">E</p>
                <p className="font-semibold text-gray-600">{stats.draws}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">D</p>
                <p className="font-semibold text-red-600">{stats.losses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Gols</p>
                <p className="text-2xl font-bold">{stats.goalsScored}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                <Medal size={24} />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Média p/ jogo</p>
                <p className="font-semibold">
                  {stats.totalMatches > 0 
                    ? (stats.goalsScored / stats.totalMatches).toFixed(1) 
                    : '0.0'}
                </p>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-500">Gols sofridos</p>
                <p className="font-semibold">{stats.goalsConceded}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Jogadores</p>
                <p className="text-2xl font-bold">{stats.playerCount}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
                <Users size={24} />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Ativos no elenco</p>
                <p className="font-semibold">{stats.playerCount}</p>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-500">Aproveitamento</p>
                <p className="font-semibold">
                  {stats.totalMatches > 0 
                    ? (((stats.wins * 3 + stats.draws) / (stats.totalMatches * 3)) * 100).toFixed(0) + '%' 
                    : '0%'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Próximos jogos</p>
                <p className="text-2xl font-bold">{stats.upcomingMatches}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-500">
                <Clock size={24} />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Gols marcados</p>
                <p className="font-semibold">{stats.goalsScored}</p>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-500">Saldo de gols</p>
                <p className={`font-semibold ${stats.goalsScored - stats.goalsConceded > 0 ? 'text-green-600' : stats.goalsScored - stats.goalsConceded < 0 ? 'text-red-600' : ''}`}>
                  {stats.goalsScored - stats.goalsConceded}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-[#1a237e] mb-4">Resumo de Desempenho</h3>
          
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-2">Gols por jogo</p>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-blue-600 h-4 rounded-full" 
                  style={{ 
                    width: `${Math.min(stats.totalMatches ? (stats.goalsScored / stats.totalMatches) * 20 : 0, 100)}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>0</span>
                <span>5+</span>
              </div>
            </div>
            
            <div>
              <p className="font-medium mb-2">Aproveitamento de pontos</p>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-green-600 h-4 rounded-full" 
                  style={{ 
                    width: `${stats.totalMatches ? ((stats.wins * 3 + stats.draws) / (stats.totalMatches * 3)) * 100 : 0}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div>
              <p className="font-medium mb-2">Vitórias, Empates e Derrotas</p>
              <div className="flex h-6 w-full overflow-hidden rounded">
                <div 
                  className="bg-green-500 h-full" 
                  style={{ width: `${stats.totalMatches ? (stats.wins / stats.totalMatches) * 100 : 0}%` }}
                ></div>
                <div 
                  className="bg-gray-400 h-full" 
                  style={{ width: `${stats.totalMatches ? (stats.draws / stats.totalMatches) * 100 : 0}%` }}
                ></div>
                <div 
                  className="bg-red-500 h-full" 
                  style={{ width: `${stats.totalMatches ? (stats.losses / stats.totalMatches) * 100 : 0}%` }}
                ></div>
              </div>
              <div className="flex text-xs mt-2 text-gray-600">
                <div className="flex items-center mr-4">
                  <div className="w-3 h-3 bg-green-500 mr-1 rounded-sm"></div>
                  <span>Vitórias ({stats.wins})</span>
                </div>
                <div className="flex items-center mr-4">
                  <div className="w-3 h-3 bg-gray-400 mr-1 rounded-sm"></div>
                  <span>Empates ({stats.draws})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 mr-1 rounded-sm"></div>
                  <span>Derrotas ({stats.losses})</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamStats;
