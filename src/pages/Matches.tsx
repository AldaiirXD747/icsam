
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDays, Clock, MapPin, Flag, UserIcon, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { getChampionships } from '@/lib/api'; // Updated import
import { getAllTeams } from '@/lib/teamApi';
import { getAllMatches } from '@/lib/matchApi';
import { MatchStatus, Team } from '@/types/championship';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [championships, setChampionships] = useState([]);
  const [selectedChampionship, setSelectedChampionship] = useState('todos-campeonatos');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const matchesData = await getAllMatches();
      setMatches(matchesData || []);

      const teamsData = await getAllTeams();
      setTeams(teamsData || []);

      const championshipsData = await getChampionships();
      setChampionships(championshipsData || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load matches. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter(match => {
    if (selectedChampionship !== 'todos-campeonatos' && match.championship_id !== selectedChampionship) {
      return false;
    }

    if (categoryFilter !== 'all' && match.category !== categoryFilter) {
      return false;
    }

    const searchTerm = searchQuery.toLowerCase();
    return (
      match.home_team_name?.toLowerCase().includes(searchTerm) ||
      match.away_team_name?.toLowerCase().includes(searchTerm) ||
      match.location?.toLowerCase().includes(searchTerm)
    );
  });

  const getStatusBadgeColor = (status: MatchStatus) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'live':
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'finished':
      case 'completed':
      case 'finalizado':
      case 'encerrado':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'postponed':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const renderTeam = (team: Team | string, position: 'home' | 'away') => {
    // If team is a string (team ID), try to find the team in the teams list
    if (typeof team === 'string') {
      const teamObj = teams.find(t => t.id === team);
      if (!teamObj) {
        return (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
              <UserIcon className="w-6 h-6 text-gray-400" />
            </div>
            <p className="mt-1 text-xs text-gray-500">Time não encontrado</p>
          </div>
        );
      }
      
      return (
        <div className={`flex flex-col items-center ${position === 'home' ? '' : ''}`}>
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow">
            <img 
              src={teamObj.logo || '/placeholder.svg'} 
              alt={teamObj.name} 
              className="w-10 h-10 object-contain" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
          <p className="mt-1 text-xs font-medium text-center">{teamObj.name}</p>
        </div>
      );
    }
    
    // If team is already a team object
    return (
      <div className={`flex flex-col items-center ${position === 'home' ? '' : ''}`}>
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow">
          <img 
            src={team.logo || '/placeholder.svg'} 
            alt={team.name} 
            className="w-10 h-10 object-contain" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
        <p className="mt-1 text-xs font-medium text-center">{team.name}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="mr-2 h-8 w-8 animate-spin text-blue-primary" />
        Carregando partidas...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-6">
        <h1 className="text-3xl font-semibold text-center text-blue-primary mb-4">Partidas</h1>

        <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-2">
          <Input
            type="text"
            placeholder="Buscar time ou local..."
            className="w-full md:w-auto"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />

          <div className="flex items-center gap-2">
            <Select value={selectedChampionship} onValueChange={setSelectedChampionship}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Todos os Campeonatos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos-campeonatos">Todos os Campeonatos</SelectItem>
                {championships.map((champ: any) => (
                  <SelectItem key={champ.id} value={champ.id}>{champ.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todas as Categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                <SelectItem value="sub-15">Sub-15</SelectItem>
                <SelectItem value="sub-17">Sub-17</SelectItem>
                <SelectItem value="sub-20">Sub-20</SelectItem>
                <SelectItem value="profissional">Profissional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMatches.map((match: any) => (
            <Link key={match.id} to={`/partida/${match.id}`} className="block">
              <Card className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      {format(new Date(match.date), 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {match.time}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    {renderTeam(match.home_team, 'home')}
                    <div className="text-2xl font-bold text-gray-800">
                      {match.home_score !== null ? match.home_score : '-'} x {match.away_score !== null ? match.away_score : '-'}
                    </div>
                    {renderTeam(match.away_team, 'away')}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {match.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Flag className="h-4 w-4" />
                      {match.category}
                    </div>
                  </div>

                  <div className="mt-2">
                    <Badge className={getStatusBadgeColor(match.status as MatchStatus)}>
                      {match.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Matches;
