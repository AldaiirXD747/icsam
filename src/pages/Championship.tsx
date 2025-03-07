
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Trophy, Users, ClipboardList, 
  BarChart2, ArrowLeft
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import our API functions
import { 
  getChampionshipById, 
  getChampionshipTeams, 
  getChampionshipMatches, 
  getChampionshipStandings,
  getChampionshipTopScorers,
  getChampionshipYellowCards
} from '@/lib/championshipApi';

// Import our custom components
import ChampionshipHeader from '@/components/championship/ChampionshipHeader';
import TeamsPanel from '@/components/championship/TeamsPanel';
import MatchesPanel from '@/components/championship/MatchesPanel';
import StandingsPanel from '@/components/championship/StandingsPanel';
import StatisticsPanel from '@/components/championship/StatisticsPanel';

const Championship = () => {
  const { id: championshipId } = useParams<{ id: string }>();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch championship data
  const { 
    data: championship,
    isLoading: isLoadingChampionship,
    error: championshipError
  } = useQuery({
    queryKey: ['championship', championshipId],
    queryFn: () => getChampionshipById(championshipId || ''),
    enabled: !!championshipId,
  });

  // Fetch teams data
  const {
    data: teams = [],
    isLoading: isLoadingTeams
  } = useQuery({
    queryKey: ['championshipTeams', championshipId, selectedCategory],
    queryFn: () => getChampionshipTeams(championshipId || '', selectedCategory),
    enabled: !!championshipId,
  });

  // Fetch matches data
  const {
    data: matches = [],
    isLoading: isLoadingMatches
  } = useQuery({
    queryKey: ['championshipMatches', championshipId, selectedCategory],
    queryFn: () => getChampionshipMatches(championshipId || '', { category: selectedCategory }),
    enabled: !!championshipId,
  });

  // Fetch standings data - only when a category is selected
  const {
    data: standings = [],
    isLoading: isLoadingStandings
  } = useQuery({
    queryKey: ['championshipStandings', championshipId, selectedCategory],
    queryFn: () => getChampionshipStandings(championshipId || '', selectedCategory || ''),
    enabled: !!championshipId && !!selectedCategory,
  });

  // Fetch top scorers data
  const {
    data: topScorers = [],
    isLoading: isLoadingTopScorers
  } = useQuery({
    queryKey: ['championshipTopScorers', championshipId, selectedCategory],
    queryFn: () => getChampionshipTopScorers(championshipId || '', selectedCategory),
    enabled: !!championshipId,
  });

  // Fetch yellow card leaders data
  const {
    data: yellowCardLeaders = [],
    isLoading: isLoadingYellowCards
  } = useQuery({
    queryKey: ['championshipYellowCards', championshipId, selectedCategory],
    queryFn: () => getChampionshipYellowCards(championshipId || '', selectedCategory),
    enabled: !!championshipId,
  });

  // Set the first category as selected when championship data is loaded
  useEffect(() => {
    if (championship && championship.categories && championship.categories.length > 0 && !selectedCategory) {
      setSelectedCategory(championship.categories[0]);
    }
  }, [championship, selectedCategory]);

  // Determine unique groups from teams data
  const groups = [...new Set(teams.map(team => team.group_name))].sort();

  // Handle championship loading error
  useEffect(() => {
    if (championshipError) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os dados do campeonato"
      });
    }
  }, [championshipError, toast]);

  if (isLoadingChampionship) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-24 flex-grow flex items-center justify-center">
          <p className="text-gray-500">Carregando detalhes do campeonato...</p>
        </div>
      </div>
    );
  }

  if (!championship) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-24 flex-grow flex items-center justify-center">
          <div className="text-center">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Campeonato não encontrado</h2>
            <p className="text-gray-500 mb-6">O campeonato que você está procurando não existe ou foi removido.</p>
            <Button onClick={() => navigate('/campeonatos')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para lista de campeonatos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-24 flex-grow">
        <ChampionshipHeader 
          championship={championship} 
          showFullDescription={showFullDescription}
          toggleDescription={() => setShowFullDescription(!showFullDescription)}
        />
        
        <div className="container mx-auto px-4 py-6">
          {/* Category selector if multiple categories exist */}
          {championship.categories.length > 1 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Categorias</h2>
              <div className="flex flex-wrap gap-2">
                {championship.categories.map((category) => (
                  <button
                    key={category}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      selectedCategory === category
                        ? 'bg-[#1a237e] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="teams" className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Times</span>
              </TabsTrigger>
              <TabsTrigger value="matches" className="flex items-center gap-1">
                <ClipboardList className="h-4 w-4" />
                <span className="hidden sm:inline">Partidas</span>
              </TabsTrigger>
              <TabsTrigger value="standings" className="flex items-center gap-1">
                <BarChart2 className="h-4 w-4" />
                <span className="hidden sm:inline">Classificação</span>
              </TabsTrigger>
              <TabsTrigger value="statistics" className="flex items-center gap-1">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Estatísticas</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="teams" className="py-6">
              <h3 className="text-xl font-semibold text-[#1a237e] mb-4">Times Participantes</h3>
              <TeamsPanel 
                teams={teams} 
                isLoading={isLoadingTeams}
                selectedCategory={selectedCategory}
              />
            </TabsContent>
            
            <TabsContent value="matches" className="py-6">
              <h3 className="text-xl font-semibold text-[#1a237e] mb-4">Partidas</h3>
              <MatchesPanel 
                matches={matches} 
                isLoading={isLoadingMatches}
                selectedCategory={selectedCategory}
              />
            </TabsContent>
            
            <TabsContent value="standings" className="py-6">
              <h3 className="text-xl font-semibold text-[#1a237e] mb-4">Classificação</h3>
              {selectedCategory ? (
                <StandingsPanel 
                  standings={standings} 
                  groups={groups}
                  isLoading={isLoadingStandings}
                />
              ) : (
                <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700">
                  Por favor, selecione uma categoria para ver a classificação.
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="statistics" className="py-6">
              <h3 className="text-xl font-semibold text-[#1a237e] mb-4">Estatísticas</h3>
              <StatisticsPanel 
                topScorers={topScorers} 
                yellowCardLeaders={yellowCardLeaders}
                isLoading={isLoadingTopScorers || isLoadingYellowCards}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Championship;
