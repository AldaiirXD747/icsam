
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Trophy, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ChampionshipStanding } from '@/types/championship';

export interface StandingsTableProps {
  championshipId: string;
  category: string;
}

const StandingsTable: React.FC<StandingsTableProps> = ({ championshipId, category }) => {
  const [standings, setStandings] = useState<ChampionshipStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStandings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!category || category === 'all') {
          setStandings([]);
          setLoading(false);
          return;
        }
        
        // Log the query parameters for debugging
        console.log(`Fetching standings for category: ${category}`);
        
        // Get teams with standings directly from Supabase
        const { data, error } = await supabase
          .from('standings')
          .select(`
            *,
            teams:team_id (
              name,
              logo
            )
          `)
          .eq('category', category)
          .order('position', { ascending: true });
        
        if (error) {
          console.error('Error fetching standings:', error);
          throw error;
        }
        
        console.log(`Retrieved ${data?.length || 0} standings records`);
        
        // Format data for display
        const formattedData = data.map(item => ({
          position: item.position,
          team_id: item.team_id,
          team_name: item.teams?.name || 'Time Desconhecido',
          team_logo: item.teams?.logo || null,
          points: item.points,
          played: item.played,
          won: item.won,
          drawn: item.drawn,
          lost: item.lost,
          goals_for: item.goals_for,
          goals_against: item.goals_against,
          goal_difference: item.goal_difference
        }));
        
        setStandings(formattedData);
      } catch (err) {
        console.error('Error loading standings:', err);
        setError('Não foi possível carregar a classificação.');
      } finally {
        setLoading(false);
      }
    };

    loadStandings();
  }, [championshipId, category]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-primary mr-2" />
        <p className="text-gray-500">Carregando classificação...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  if (standings.length === 0) {
    return (
      <div className="text-center py-8">
        <Trophy className="h-8 w-8 mx-auto text-gray-300 mb-2" />
        <p className="text-gray-500">
          {category === 'all' 
            ? 'Selecione uma categoria para visualizar a classificação.' 
            : 'Nenhuma classificação disponível para esta categoria.'}
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-blue-50">
          <TableHead className="w-12 text-center">Pos</TableHead>
          <TableHead>Time</TableHead>
          <TableHead className="text-center">P</TableHead>
          <TableHead className="text-center">J</TableHead>
          <TableHead className="text-center">V</TableHead>
          <TableHead className="text-center">E</TableHead>
          <TableHead className="text-center">D</TableHead>
          <TableHead className="text-center">GP</TableHead>
          <TableHead className="text-center">GC</TableHead>
          <TableHead className="text-center">SG</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {standings.map((standing) => (
          <TableRow key={standing.team_id} className="hover:bg-blue-50/50">
            <TableCell className="text-center font-medium">{standing.position}</TableCell>
            <TableCell>
              <div className="flex items-center">
                {standing.team_logo && (
                  <img
                    src={standing.team_logo}
                    alt={standing.team_name}
                    className="h-6 w-6 mr-2 object-contain"
                    onError={(e) => {
                      // If image fails to load, use a default placeholder
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                )}
                <span>{standing.team_name}</span>
              </div>
            </TableCell>
            <TableCell className="text-center font-semibold">{standing.points}</TableCell>
            <TableCell className="text-center">{standing.played}</TableCell>
            <TableCell className="text-center">{standing.won}</TableCell>
            <TableCell className="text-center">{standing.drawn}</TableCell>
            <TableCell className="text-center">{standing.lost}</TableCell>
            <TableCell className="text-center">{standing.goals_for}</TableCell>
            <TableCell className="text-center">{standing.goals_against}</TableCell>
            <TableCell className="text-center">{standing.goal_difference}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default StandingsTable;
