
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Calendar, Users, Loader2 } from 'lucide-react';
import { getChampionshipStatistics } from '@/lib/championshipApi';
import { toast } from '@/hooks/use-toast';

export interface StatisticsTablesProps {
  championshipId: string;
  category: string;
  type: 'scorers' | 'cards' | 'teams';
}

interface Scorer {
  player_id: string;
  player_name: string;
  team_name: string;
  team_logo?: string;
  goals: number;
}

interface CardStatistic {
  player_id: string;
  player_name: string;
  team_name: string;
  team_logo?: string;
  yellow_cards: number;
  red_cards: number;
}

interface TeamStatistic {
  team_id: string;
  team_name: string;
  team_logo?: string;
  total_goals: number;
  matches_played: number;
  goals_per_match: number;
}

const StatisticsTables: React.FC<StatisticsTablesProps> = ({ championshipId, category, type }) => {
  const [data, setData] = useState<Scorer[] | CardStatistic[] | TeamStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStatistics = async () => {
      if (!championshipId || championshipId === 'todos-campeonatos') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const statisticsData = await getChampionshipStatistics(championshipId, category, type);
        setData(statisticsData || []);
      } catch (err) {
        console.error(`Error loading ${type} statistics:`, err);
        setError(`Não foi possível carregar as estatísticas de ${
          type === 'scorers' ? 'artilheiros' : 
          type === 'cards' ? 'cartões' : 'times'
        }.`);
        toast({
          title: "Erro ao carregar estatísticas",
          description: "Ocorreu um problema ao buscar os dados. Tente novamente mais tarde.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, [championshipId, category, type]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-primary mr-2" />
        <p className="text-gray-500">Carregando estatísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!championshipId || championshipId === 'todos-campeonatos') {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        {type === 'scorers' ? <BarChart className="h-16 w-16 text-gray-300 mb-4" /> : 
         type === 'cards' ? <Calendar className="h-16 w-16 text-gray-300 mb-4" /> :
         <Users className="h-16 w-16 text-gray-300 mb-4" />}
        <h3 className="text-lg font-medium text-gray-400">
          Selecione um campeonato para visualizar as estatísticas
        </h3>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        {type === 'scorers' ? <BarChart className="h-16 w-16 text-gray-300 mb-4" /> : 
         type === 'cards' ? <Calendar className="h-16 w-16 text-gray-300 mb-4" /> :
         <Users className="h-16 w-16 text-gray-300 mb-4" />}
        <h3 className="text-lg font-medium text-gray-400">
          Nenhum dado disponível para esta categoria
        </h3>
      </div>
    );
  }

  // Render appropriate table based on type
  if (type === 'scorers') {
    const scorers = data as Scorer[];
    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-50">
            <TableHead className="w-12 text-center">Pos</TableHead>
            <TableHead>Jogador</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-center">Gols</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scorers.map((scorer, index) => (
            <TableRow key={scorer.player_id} className="hover:bg-blue-50/50">
              <TableCell className="text-center font-medium">{index + 1}</TableCell>
              <TableCell>{scorer.player_name}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {scorer.team_logo && (
                    <img
                      src={scorer.team_logo}
                      alt={scorer.team_name}
                      className="h-6 w-6 mr-2 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  )}
                  <span>{scorer.team_name}</span>
                </div>
              </TableCell>
              <TableCell className="text-center font-semibold">{scorer.goals}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (type === 'cards') {
    const cardStats = data as CardStatistic[];
    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-50">
            <TableHead className="w-12 text-center">Pos</TableHead>
            <TableHead>Jogador</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-center">Cartões Amarelos</TableHead>
            <TableHead className="text-center">Cartões Vermelhos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cardStats.map((stat, index) => (
            <TableRow key={stat.player_id} className="hover:bg-blue-50/50">
              <TableCell className="text-center font-medium">{index + 1}</TableCell>
              <TableCell>{stat.player_name}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {stat.team_logo && (
                    <img
                      src={stat.team_logo}
                      alt={stat.team_name}
                      className="h-6 w-6 mr-2 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  )}
                  <span>{stat.team_name}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">{stat.yellow_cards}</TableCell>
              <TableCell className="text-center">{stat.red_cards}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (type === 'teams') {
    const teamStats = data as TeamStatistic[];
    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-blue-50">
            <TableHead className="w-12 text-center">Pos</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-center">Jogos</TableHead>
            <TableHead className="text-center">Gols Marcados</TableHead>
            <TableHead className="text-center">Média p/ Jogo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teamStats.map((stat, index) => (
            <TableRow key={stat.team_id} className="hover:bg-blue-50/50">
              <TableCell className="text-center font-medium">{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {stat.team_logo && (
                    <img
                      src={stat.team_logo}
                      alt={stat.team_name}
                      className="h-6 w-6 mr-2 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  )}
                  <span>{stat.team_name}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">{stat.matches_played}</TableCell>
              <TableCell className="text-center">{stat.total_goals}</TableCell>
              <TableCell className="text-center">{stat.goals_per_match.toFixed(1)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
  
  return null;
};

export default StatisticsTables;
