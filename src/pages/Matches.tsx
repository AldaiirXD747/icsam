
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MatchCard from '@/components/MatchCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, CalendarClock, CalendarCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Match } from '@/types';

// Interface to represent the database response
interface MatchResponse {
  id: string;
  date: string;
  time: string;
  location: string;
  category: string;
  status: string;
  championship_id: string | null;
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  round: string | null;
  homeTeam?: {
    name: string;
    logo: string | null;
  } | null;
  awayTeam?: {
    name: string;
    logo: string | null;
  } | null;
}

const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('matches')
          .select(`
            *,
            homeTeam:home_team(name, logo),
            awayTeam:away_team(name, logo)
          `)
          .order('date', { ascending: true })
          .order('time', { ascending: true });
        
        if (error) throw error;
        
        // Transform the data to match the expected Match type
        const transformedData = (data || []).map((match: MatchResponse): Match => ({
          id: match.id,
          date: match.date,
          time: match.time,
          location: match.location,
          homeTeam: match.home_team,
          awayTeam: match.away_team,
          homeScore: match.home_score,
          awayScore: match.away_score,
          status: mapStatus(match.status),
          category: match.category,
          round: match.round,
          championshipId: match.championship_id,
          homeTeamName: match.homeTeam?.name || 'Time da Casa',
          awayTeamName: match.awayTeam?.name || 'Time Visitante',
          // Add other properties from Match type as needed
        }));
        
        setMatches(transformedData);
      } catch (err) {
        console.error('Erro ao carregar partidas:', err);
        setError('Não foi possível carregar as partidas. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // Helper function to map database status to the MatchCard status
  const mapStatus = (dbStatus: string): 'scheduled' | 'live' | 'finished' => {
    switch (dbStatus) {
      case 'ongoing':
      case 'live':
        return 'live';
      case 'completed':
      case 'finalizado':
        return 'finished';
      default:
        return 'scheduled';
    }
  };

  const upcomingMatches = matches.filter(match => match.status === 'scheduled');
  const ongoingMatches = matches.filter(match => match.status === 'live');
  const completedMatches = matches.filter(match => match.status === 'finished');

  // Helper function to render each match with properly formatted data for the MatchCard
  const renderMatchCard = (match: Match) => {
    return (
      <MatchCard
        key={match.id}
        id={parseInt(match.id)}
        homeTeam={{
          name: match.homeTeamName || 'Time da Casa',
          logo: match.homeTeam ? `/lovable-uploads/f6948c38-54be-49e9-9699-59f65b3d9ad6.png` : '/placeholder.svg',
          score: match.homeScore || 0
        }}
        awayTeam={{
          name: match.awayTeamName || 'Time Visitante',
          logo: match.awayTeam ? `/lovable-uploads/f1f2ae6a-22d0-4a9b-89ac-d11a3e1db81b.png` : '/placeholder.svg',
          score: match.awayScore || 0
        }}
        category={match.category}
        date={match.date}
        time={match.time}
        group={match.round || 'A'}
        status={match.status as 'scheduled' | 'live' | 'finished'}
        venue={match.location}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-primary mb-4">Jogos</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Acompanhe os jogos dos nossos campeonatos, resultados e próximas partidas.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">{error}</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma partida cadastrada</h3>
              <p className="text-gray-500">
                Novas partidas serão exibidas aqui quando forem cadastradas pelo Painel Administrativo.
              </p>
            </div>
          ) : (
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all" className="data-[state=active]:bg-blue-primary data-[state=active]:text-white">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Todos ({matches.length})
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="data-[state=active]:bg-blue-primary data-[state=active]:text-white">
                  <CalendarClock className="h-4 w-4 mr-2" />
                  Próximos ({upcomingMatches.length})
                </TabsTrigger>
                <TabsTrigger value="ongoing" className="data-[state=active]:bg-blue-primary data-[state=active]:text-white">
                  <CalendarClock className="h-4 w-4 mr-2" />
                  Em Andamento ({ongoingMatches.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-blue-primary data-[state=active]:text-white">
                  <CalendarCheck className="h-4 w-4 mr-2" />
                  Finalizados ({completedMatches.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {matches.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Nenhuma partida disponível</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {matches.map(match => renderMatchCard(match))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="upcoming" className="space-y-4">
                {upcomingMatches.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Nenhuma partida agendada</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {upcomingMatches.map(match => renderMatchCard(match))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="ongoing" className="space-y-4">
                {ongoingMatches.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Nenhuma partida em andamento</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ongoingMatches.map(match => renderMatchCard(match))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-4">
                {completedMatches.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Nenhuma partida finalizada</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {completedMatches.map(match => renderMatchCard(match))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Matches;
