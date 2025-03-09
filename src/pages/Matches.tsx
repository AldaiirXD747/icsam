import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Calendar, Search, Filter, MapPin } from 'lucide-react';
import { Match } from '@/types';
import { convertDbMatchToMatch } from '@/utils/typeConverters';
import Navbar from '@/components/Navbar';
import MatchCard from '@/components/MatchCard';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamLogos, setTeamLogos] = useState<{[key: string]: string}>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 70 } }
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        
        const { data: teamsData, error: teamsError } = await supabase
          .from('teams')
          .select('id, name, logo');
        
        if (teamsError) throw teamsError;
        
        const logoMap: {[key: string]: string} = {};
        teamsData?.forEach(team => {
          logoMap[team.id] = team.logo || '/placeholder.svg';
        });
        
        setTeamLogos(logoMap);
        
        const { data, error } = await supabase
          .from('matches')
          .select(`
            *,
            home_team_details:teams!home_team(id, name, logo),
            away_team_details:teams!away_team(id, name, logo)
          `)
          .order('date', { ascending: true });
        
        if (error) throw error;
        
        console.log("Partidas carregadas:", data?.length || 0);
        
        if (data && data.length > 0) {
          const formattedMatches = data.map(match => {
            return {
              id: match.id,
              date: match.date,
              time: match.time,
              home_team: match.home_team,
              away_team: match.away_team,
              home_score: match.home_score,
              away_score: match.away_score,
              status: match.status,
              category: match.category,
              location: match.location,
              round: match.round,
              home_team_name: match.home_team_details?.name || 'Time da Casa',
              away_team_name: match.away_team_details?.name || 'Time Visitante',
              homeTeamName: match.home_team_details?.name || 'Time da Casa',
              awayTeamName: match.away_team_details?.name || 'Time Visitante',
              homeTeamLogo: match.home_team_details?.logo || '',
              awayTeamLogo: match.away_team_details?.logo || ''
            };
          });
          
          setMatches(formattedMatches);
        } else {
          console.log("Nenhuma partida encontrada");
          setError('Não foram encontradas partidas no sistema.');
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
        setError('Não foi possível carregar as partidas. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const mapStatus = (status: string): 'scheduled' | 'live' | 'finished' => {
    if (status === 'in_progress') return 'live';
    if (status === 'completed') return 'finished';
    return 'scheduled';
  };

  const groupMatchesByDate = (matches: Match[]) => {
    const groups: {[key: string]: Match[]} = {};
    
    matches.forEach(match => {
      const date = new Date(match.date).toLocaleDateString('pt-BR');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(match);
    });
    
    return groups;
  };

  const filteredMatches = matches.filter(match => {
    const matchesSearch = 
      match.home_team_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.away_team_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || match.category === filterCategory;
    
    const matchesStatus = filterStatus === 'all' || match.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  const groupedMatches = groupMatchesByDate(filteredMatches);
  
  const sortedDates = Object.keys(groupedMatches).sort((a, b) => {
    const dateA = new Date(a.split('/').reverse().join('-'));
    const dateB = new Date(b.split('/').reverse().join('-'));
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-28 lg:pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-3xl font-bold text-blue-primary mb-3">Partidas</h1>
            <p className="text-gray-600 max-w-3xl">
              Confira todas as partidas dos campeonatos organizados pelo Instituto Criança Santa Maria.
              Utilize os filtros abaixo para encontrar partidas específicas.
            </p>
          </motion.div>
          
          <motion.div 
            className="mb-8 p-6 rounded-lg bg-white shadow-md border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/>
                <Input 
                  type="text" 
                  placeholder="Buscar por time ou local..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas Categorias</SelectItem>
                    <SelectItem value="SUB-11">SUB-11</SelectItem>
                    <SelectItem value="SUB-13">SUB-13</SelectItem>
                    <SelectItem value="SUB-15">SUB-15</SelectItem>
                    <SelectItem value="SUB-17">SUB-17</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Status</SelectItem>
                    <SelectItem value="scheduled">Agendadas</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluídas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Pill active={filterStatus === 'all'} onClick={() => setFilterStatus('all')}>
                Todos
              </Pill>
              <Pill active={filterStatus === 'in_progress'} onClick={() => setFilterStatus('in_progress')}>
                Em Andamento
              </Pill>
              <Pill active={filterStatus === 'scheduled'} onClick={() => setFilterStatus('scheduled')}>
                Agendadas
              </Pill>
              <Pill active={filterStatus === 'completed'} onClick={() => setFilterStatus('completed')}>
                Concluídas
              </Pill>
            </div>
          </motion.div>
          
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-blue-primary mb-4" />
              <span className="text-gray-600 font-medium">Carregando partidas...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center my-8">
              <p className="text-red-600 font-medium">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Tentar Novamente
              </Button>
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center my-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma partida encontrada</h2>
              <p className="text-gray-500 max-w-lg mx-auto mb-4">
                Não foram encontradas partidas correspondentes aos critérios de busca. Tente ajustar os filtros ou verificar mais tarde.
              </p>
              <Button onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
                setFilterStatus('all');
              }}>
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-8"
            >
              {sortedDates.map(date => (
                <motion.div key={date} variants={item} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                  <div className="bg-blue-primary text-white px-6 py-3 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <h2 className="font-semibold">{date}</h2>
                    <span className="ml-2 text-sm bg-blue-light/40 px-2 py-0.5 rounded">
                      {groupedMatches[date].length} {groupedMatches[date].length === 1 ? 'partida' : 'partidas'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    {groupedMatches[date].map(match => (
                      <div key={match.id} className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg shadow-sm border border-blue-100">
                        <MatchCard
                          id={Number(match.id)}
                          homeTeam={{
                            name: match.home_team_name || 'Time da Casa',
                            logo: match.homeTeamLogo || teamLogos[match.home_team] || '/placeholder.svg',
                            score: match.home_score
                          }}
                          awayTeam={{
                            name: match.away_team_name || 'Time Visitante',
                            logo: match.awayTeamLogo || teamLogos[match.away_team] || '/placeholder.svg',
                            score: match.away_score
                          }}
                          category={match.category}
                          date={new Date(match.date).toLocaleDateString('pt-BR')}
                          time={match.time?.substring(0, 5) || ''}
                          group={match.round || ''}
                          status={mapStatus(match.status)}
                          venue={match.location}
                        />
                        
                        {match.location && (
                          <div className="mt-3 flex items-center text-gray-500 text-sm">
                            <MapPin className="h-4 w-4 mr-1 text-blue-primary" />
                            <span>{match.location}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Pill = ({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) => (
  <button
    className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
      active 
        ? 'bg-blue-primary text-white shadow-sm' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Matches;
