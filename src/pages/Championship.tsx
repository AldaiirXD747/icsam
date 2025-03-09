
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Calendar, Users, BarChart, AlertCircle, Loader2 } from 'lucide-react';
import StandingsTable from '@/components/StandingsTable';
import StatisticsTables from '@/components/StatisticsTables';
import { getChampionshipById, getChampionshipTeams, getChampionshipMatches, getChampionshipStandings, getChampionshipTopScorers, getChampionshipYellowCards } from '@/lib/championshipApi';

const Championship = () => {
  const { id } = useParams<{ id: string }>();
  const [championship, setChampionship] = useState<any>(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [topScorers, setTopScorers] = useState([]);
  const [yellowCards, setYellowCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('SUB-11');
  
  useEffect(() => {
    const loadChampionshipData = async () => {
      try {
        setLoading(true);
        
        if (!id) return;
        
        // Buscar dados do campeonato
        const championshipData = await getChampionshipById(id);
        setChampionship(championshipData);
        
        // Buscar times do campeonato
        const teamsData = await getChampionshipTeams(id);
        setTeams(teamsData);
        
        // Buscar partidas do campeonato
        const matchesData = await getChampionshipMatches(id);
        setMatches(matchesData);
        
        // Buscar artilheiros
        const scorersData = await getChampionshipTopScorers(id);
        setTopScorers(scorersData);
        
        // Buscar cartões
        const cardsData = await getChampionshipYellowCards(id);
        setYellowCards(cardsData);
      } catch (error) {
        console.error('Erro ao carregar dados do campeonato:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadChampionshipData();
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">Carregando dados do campeonato...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!championship) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">Campeonato não encontrado</h2>
            <p className="text-gray-500 mt-2">O campeonato solicitado não existe ou foi removido.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Filtrar times por grupo
  const teamsByGroup = teams.reduce((acc, team: any) => {
    if (!acc[team.group_name]) {
      acc[team.group_name] = [];
    }
    acc[team.group_name].push(team);
    return acc;
  }, {});
  
  // Organizar partidas por rodada
  const matchesByRound = matches.reduce((acc, match: any) => {
    if (match.category !== activeCategory) return acc;
    
    if (!acc[match.round]) {
      acc[match.round] = [];
    }
    acc[match.round].push(match);
    return acc;
  }, {});
  
  // Ordenar as rodadas em ordem
  const roundOrder: string[] = [
    'Primeira Rodada',
    'Segunda Rodada',
    'Terceira Rodada',
    'Quarta Rodada',
    'Quinta Rodada',
    'Semifinal',
    'Final'
  ];
  
  const sortedRounds = Object.keys(matchesByRound).sort(
    (a, b) => roundOrder.indexOf(a) - roundOrder.indexOf(b)
  );
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Banner do Campeonato */}
          <div className="relative mb-8 rounded-lg overflow-hidden shadow-md">
            {championship.banner_image ? (
              <img 
                src={championship.banner_image} 
                alt={championship.name} 
                className="w-full h-48 md:h-64 object-cover"
              />
            ) : (
              <div className="w-full h-48 md:h-64 bg-gradient-to-r from-blue-500 to-blue-700"></div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl font-bold">{championship.name}</h1>
                <p className="text-xl">{championship.year}</p>
                <div className="flex items-center mt-2">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>
                    {new Date(championship.start_date).toLocaleDateString('pt-BR')} a {new Date(championship.end_date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Seletor de Categoria */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#1a237e]">Dados do Campeonato</h2>
              
              <div className="flex space-x-2">
                {championship.categories.map((category: string) => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-full font-medium ${
                      activeCategory === category
                        ? 'bg-blue-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Conteúdo Organizado em Abas */}
          <Tabs defaultValue="partidas">
            <TabsList className="mb-8 flex flex-wrap justify-center sm:justify-start w-full overflow-x-auto">
              <TabsTrigger value="partidas" className="py-3 px-4 data-[state=active]:bg-blue-primary data-[state=active]:text-white">
                Partidas
              </TabsTrigger>
              <TabsTrigger value="classificacao" className="py-3 px-4 data-[state=active]:bg-blue-primary data-[state=active]:text-white">
                Classificação
              </TabsTrigger>
              <TabsTrigger value="times" className="py-3 px-4 data-[state=active]:bg-blue-primary data-[state=active]:text-white">
                Times
              </TabsTrigger>
              <TabsTrigger value="estatisticas" className="py-3 px-4 data-[state=active]:bg-blue-primary data-[state=active]:text-white">
                Estatísticas
              </TabsTrigger>
            </TabsList>
            
            {/* Aba de Partidas */}
            <TabsContent value="partidas">
              <div className="space-y-8">
                {sortedRounds.map((round) => (
                  <Card key={round}>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                      <CardTitle className="flex items-center text-blue-primary">
                        <Calendar className="mr-2 h-5 w-5" />
                        {round}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 pt-4">
                        {matchesByRound[round].map((match: any) => (
                          <div key={match.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center">
                              <div className="flex-1 text-right">
                                <div className="font-semibold">{match.home_team}</div>
                              </div>
                              
                              <div className="flex items-center mx-4">
                                <div className="flex justify-end w-12 text-right">
                                  {match.status === 'completed' ? (
                                    <span className="text-xl font-bold">{match.home_score}</span>
                                  ) : (
                                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">vs</span>
                                  )}
                                </div>
                                <div className="px-3 text-center">
                                  {match.status === 'completed' ? (
                                    <span className="text-xl font-bold">:</span>
                                  ) : (
                                    <span className="text-xs px-2 py-1 rounded">
                                      {new Date(match.date).toLocaleDateString('pt-BR')} {match.time}
                                    </span>
                                  )}
                                </div>
                                <div className="flex justify-start w-12">
                                  {match.status === 'completed' ? (
                                    <span className="text-xl font-bold">{match.away_score}</span>
                                  ) : (
                                    <span></span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex-1">
                                <div className="font-semibold">{match.away_team}</div>
                              </div>
                            </div>
                            
                            {match.status === 'completed' && (
                              <div className="text-center text-xs text-gray-500 mt-2">
                                {new Date(match.date).toLocaleDateString('pt-BR')} {match.time} - {match.location}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Aba de Classificação */}
            <TabsContent value="classificacao">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.keys(teamsByGroup).map((groupName) => (
                  <Card key={groupName}>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                      <CardTitle className="flex items-center text-blue-primary">
                        <Trophy className="mr-2 h-5 w-5" />
                        Grupo {groupName} - {activeCategory}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <StandingsTable
                        championshipId={id || ''}
                        category={activeCategory}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Aba de Times */}
            <TabsContent value="times">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(teamsByGroup).map(([groupName, groupTeams]) => (
                  <Card key={groupName}>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                      <CardTitle className="flex items-center text-blue-primary">
                        <Users className="mr-2 h-5 w-5" />
                        Grupo {groupName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        {(groupTeams as any[]).map((team) => (
                          <div key={team.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center">
                            {team.logo ? (
                              <img
                                src={team.logo}
                                alt={team.name}
                                className="h-12 w-12 mr-3 object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                                }}
                              />
                            ) : (
                              <div className="h-12 w-12 mr-3 bg-gray-200 rounded-full flex items-center justify-center">
                                <Users className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <h3 className="font-medium">{team.name}</h3>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Aba de Estatísticas */}
            <TabsContent value="estatisticas">
              <div className="space-y-8">
                <Card>
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <CardTitle className="flex items-center text-blue-primary">
                      <Trophy className="mr-2 h-5 w-5" />
                      Artilheiros do Campeonato
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <StatisticsTables 
                      championshipId={id || ''} 
                      category={activeCategory} 
                      type="scorers"
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <CardTitle className="flex items-center text-blue-primary">
                      <BarChart className="mr-2 h-5 w-5" />
                      Cartões do Campeonato
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <StatisticsTables 
                      championshipId={id || ''} 
                      category={activeCategory} 
                      type="cards"
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <CardTitle className="flex items-center text-blue-primary">
                      <Users className="mr-2 h-5 w-5" />
                      Estatísticas dos Times
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <StatisticsTables 
                      championshipId={id || ''} 
                      category={activeCategory} 
                      type="teams"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Championship;
