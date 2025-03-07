
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Match } from '@/types';
import { convertDbMatchToMatch } from '@/utils/typeConverters';
import Navbar from '@/components/Navbar';
import MatchCard from '@/components/MatchCard';

const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamLogos, setTeamLogos] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        
        // Primeiro, vamos buscar todos os times para ter acesso aos logos
        const { data: teamsData, error: teamsError } = await supabase
          .from('teams')
          .select('id, name, logo');
        
        if (teamsError) throw teamsError;
        
        // Criar um mapa de ID do time para seu logo
        const logoMap: {[key: string]: string} = {};
        teamsData?.forEach(team => {
          logoMap[team.id] = team.logo || '/placeholder.svg';
        });
        
        setTeamLogos(logoMap);
        
        // Agora buscar as partidas
        const { data, error } = await supabase
          .from('matches')
          .select(`
            *,
            home_team_details:teams!matches_home_team_fkey(id, name),
            away_team_details:teams!matches_away_team_fkey(id, name)
          `)
          .order('date');
        
        if (error) throw error;
        
        // Convert database matches to application Match type
        const formattedMatches = data?.map(match => {
          const appMatch = convertDbMatchToMatch(match);
          
          // Add team names if available
          if (match.home_team_details) {
            appMatch.home_team_name = match.home_team_details.name;
            appMatch.homeTeamName = match.home_team_details.name;
          }
          
          if (match.away_team_details) {
            appMatch.away_team_name = match.away_team_details.name;
            appMatch.awayTeamName = match.away_team_details.name;
          }
          
          return appMatch;
        }) || [];
        
        setMatches(formattedMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setError('Não foi possível carregar as partidas. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // Função para mapear o status para o tipo esperado pelo MatchCard
  const mapStatus = (status: string): 'scheduled' | 'live' | 'finished' => {
    if (status === 'in_progress') return 'live';
    if (status === 'completed') return 'finished';
    return 'scheduled';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-[#1a237e] mb-6">Partidas</h1>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-blue-primary" />
              <span className="ml-3">Carregando partidas...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-500">{error}</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma partida encontrada</h2>
              <p className="text-gray-500">
                Novas partidas serão exibidas aqui quando forem cadastradas pelo Painel Administrativo.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map(match => (
                <MatchCard
                  key={match.id}
                  id={Number(match.id)}
                  homeTeam={{
                    name: match.home_team_name || 'Time da Casa',
                    logo: teamLogos[match.home_team] || '/placeholder.svg',
                    score: match.home_score
                  }}
                  awayTeam={{
                    name: match.away_team_name || 'Time Visitante',
                    logo: teamLogos[match.away_team] || '/placeholder.svg',
                    score: match.away_score
                  }}
                  category={match.category}
                  date={new Date(match.date).toLocaleDateString('pt-BR')}
                  time={match.time?.substring(0, 5) || ''}
                  group={match.round || ''}
                  status={mapStatus(match.status)}
                  venue={match.location}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Matches;
