
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Match, MatchStatus } from '@/types';
import { convertDbMatchToMatch } from '@/utils/typeConverters';

const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('matches')
          .select(`
            *,
            home_team_details:teams!matches_home_team_fkey(name),
            away_team_details:teams!matches_away_team_fkey(name)
          `)
          .order('date');
        
        if (error) throw error;
        
        // Convert database matches to application Match type
        const formattedMatches = data?.map(match => {
          const appMatch = convertDbMatchToMatch(match);
          
          // Add team names if available
          if (match.home_team_details) {
            appMatch.home_team_name = match.home_team_details.name;
          }
          
          if (match.away_team_details) {
            appMatch.away_team_name = match.away_team_details.name;
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

  return (
    <div className="min-h-screen flex flex-col">
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
              {/* Match cards will be rendered here */}
              {matches.map(match => (
                <div key={match.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-500">{match.date} - {match.time}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      match.status === 'completed' ? 'bg-green-100 text-green-800' :
                      match.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {match.status === 'completed' ? 'Finalizado' :
                       match.status === 'in_progress' ? 'Em andamento' :
                       match.status === 'scheduled' ? 'Agendado' :
                       match.status === 'postponed' ? 'Adiado' : 'Cancelado'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-center flex-1">
                      <p className="font-semibold">{match.home_team_name || 'Time da Casa'}</p>
                      {match.status === 'completed' && <p className="text-2xl font-bold">{match.home_score}</p>}
                    </div>
                    
                    <div className="mx-4">
                      <span className="text-gray-400">VS</span>
                    </div>
                    
                    <div className="text-center flex-1">
                      <p className="font-semibold">{match.away_team_name || 'Time Visitante'}</p>
                      {match.status === 'completed' && <p className="text-2xl font-bold">{match.away_score}</p>}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Local:</span> {match.location}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Categoria:</span> {match.category}
                    </p>
                    {match.round && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Rodada:</span> {match.round}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Matches;
