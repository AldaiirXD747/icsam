
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDays, Map, Filter, Trophy, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAllMatches } from '@/lib/matchApi';
import { getAllTeams } from '@/lib/teamApi';
import { ChampionshipMatch, MatchStatus, Team } from '@/types/championship';
import MatchCard from '@/components/MatchCard';

const Matches = () => {
  const [matches, setMatches] = useState<ChampionshipMatch[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRound, setSelectedRound] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  
  // Define available rounds
  const rounds = [
    { id: 'primeira-rodada', name: 'Primeira Rodada (08/02/25)' },
    { id: 'segunda-rodada', name: 'Segunda Rodada (14-15/02/25)' },
    { id: 'terceira-rodada', name: 'Terceira Rodada (22-23/02/25)' },
    { id: 'quarta-rodada', name: 'Quarta Rodada (08/03/25)' },
    { id: 'quinta-rodada', name: 'Quinta Rodada (09/03/25)' },
    { id: 'semifinal', name: 'Semifinal (15/03/25)' },
    { id: 'final', name: 'Final (22/03/25)' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [matchesData, teamsData] = await Promise.all([
        getAllMatches(),
        getAllTeams()
      ]);

      setMatches(matchesData || []);
      setTeams(teamsData || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Erro ao carregar partidas. Por favor, tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Filter matches based on selected filters
  const filteredMatches = matches.filter(match => {
    if (selectedRound !== 'all' && match.round !== selectedRound) {
      return false;
    }
    if (selectedCategory !== 'all' && match.category !== selectedCategory) {
      return false;
    }

    // Filter by group - would need to get team group from teams collection
    if (selectedGroup !== 'all') {
      const homeTeam = teams.find(t => t.id === match.home_team);
      const awayTeam = teams.find(t => t.id === match.away_team);
      if (!(homeTeam?.group_name === selectedGroup || awayTeam?.group_name === selectedGroup)) {
        return false;
      }
    }

    return true;
  });

  // Group matches by date
  const matchesByDate = filteredMatches.reduce((acc, match) => {
    const date = match.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(match);
    return acc;
  }, {} as Record<string, ChampionshipMatch[]>);

  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(matchesByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto py-20 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
          <span>Carregando partidas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-8 pt-24 px-4">
        <h1 className="text-3xl font-bold text-blue-primary mb-2">Partidas</h1>
        <p className="text-gray-600 mb-6">
          Confira todas as partidas do Campeonato Base Forte
        </p>

        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <Filter className="h-5 w-5 mr-2 text-blue-primary" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Rodada</label>
              <Select value={selectedRound} onValueChange={setSelectedRound}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as rodadas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as rodadas</SelectItem>
                  {rounds.map(round => (
                    <SelectItem key={round.id} value={round.id}>{round.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Categoria</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="SUB-11">SUB-11</SelectItem>
                  <SelectItem value="SUB-13">SUB-13</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Grupo</label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os grupos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os grupos</SelectItem>
                  <SelectItem value="A">Grupo A</SelectItem>
                  <SelectItem value="B">Grupo B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Matches by Date */}
        {sortedDates.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Trophy className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-500">Nenhuma partida encontrada</h3>
            <p className="text-gray-400 mt-2">Não há partidas correspondentes aos filtros selecionados.</p>
          </div>
        ) : (
          sortedDates.map(date => (
            <div key={date} className="mb-8">
              <div className="flex items-center mb-4">
                <CalendarDays className="h-5 w-5 text-blue-primary mr-2" />
                <h2 className="text-xl font-semibold">
                  {format(parseISO(date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchesByDate[date].map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
              
              <Separator className="mt-8" />
            </div>
          ))
        )}
        
        {filteredMatches.length > 0 && selectedRound === 'all' && (
          <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Mostrando {filteredMatches.length} partidas no total. 
              Utilize os filtros para refinar sua busca.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Matches;
