import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { BarChart as BarChartIcon, Trophy } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { TopScorer, YellowCardLeader } from '@/types';
import { normalizeTopScorer, normalizeYellowCardLeader } from '@/utils/typeConverters';
import StatisticsFilters from './statistics/StatisticsFilters';
import TopScorersManagement from './statistics/TopScorersManagement';
import YellowCardManagement from './statistics/YellowCardManagement';

const StatisticsManagement = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedChampionship, setSelectedChampionship] = useState<string>('all');
  const [championships, setChampionships] = useState<{id: string, name: string}[]>([]);
  const [teams, setTeams] = useState<{id: string, name: string, category: string}[]>([]);
  const [players, setPlayers] = useState<{id: string, name: string, team_id: string}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Top scorers state
  const [topScorers, setTopScorers] = useState<TopScorer[]>([]);
  
  // Yellow card leaders state
  const [yellowCardLeaders, setYellowCardLeaders] = useState<YellowCardLeader[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch championships
      const { data: championshipsData, error: championshipsError } = await supabase
        .from('championships')
        .select('id, name')
        .order('name');
      
      if (championshipsError) throw championshipsError;
      setChampionships(championshipsData || []);
      
      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('id, name, category')
        .order('name');
      
      if (teamsError) throw teamsError;
      setTeams(teamsData || []);
      
      // Fetch players
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select('id, name, team_id')
        .order('name');
      
      if (playersError) throw playersError;
      setPlayers(playersData || []);
      
      // Fetch top scorers
      const { data: scorersData, error: scorersError } = await supabase
        .from('top_scorers')
        .select(`
          id,
          player_id,
          team_id,
          goals,
          category,
          championship_id,
          players(name),
          teams(name)
        `)
        .order('goals', { ascending: false });
      
      if (scorersError) throw scorersError;
      
      const transformedScorers = (scorersData || []).map(scorer => {
        return normalizeTopScorer({
          id: scorer.id,
          player_id: scorer.player_id,
          playerId: scorer.player_id,
          name: scorer.players?.name || 'Desconhecido',
          team_id: scorer.team_id,
          teamId: scorer.team_id,
          team: scorer.teams?.name || 'Time desconhecido',
          goals: scorer.goals,
          category: scorer.category,
          championship_id: scorer.championship_id,
          championshipId: scorer.championship_id
        });
      });
      
      setTopScorers(transformedScorers);
      
      // Fetch yellow card leaders
      const { data: cardLeadersData, error: cardLeadersError } = await supabase
        .from('yellow_card_leaders')
        .select(`
          id,
          player_id,
          team_id,
          yellow_cards,
          category,
          championship_id,
          players(name),
          teams(name)
        `)
        .order('yellow_cards', { ascending: false });
      
      if (cardLeadersError) throw cardLeadersError;
      
      const transformedCardLeaders = (cardLeadersData || []).map(leader => {
        return normalizeYellowCardLeader({
          id: leader.id,
          player_id: leader.player_id,
          playerId: leader.player_id,
          name: leader.players?.name || 'Desconhecido',
          team_id: leader.team_id,
          teamId: leader.team_id,
          team: leader.teams?.name || 'Time desconhecido',
          yellow_cards: leader.yellow_cards,
          yellowCards: leader.yellow_cards,
          category: leader.category,
          championship_id: leader.championship_id,
          championshipId: leader.championship_id
        });
      });
      
      setYellowCardLeaders(transformedCardLeaders);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as estatísticas."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTopScorers = topScorers
    .filter(scorer => selectedCategory === 'all' || scorer.category === selectedCategory)
    .filter(scorer => selectedChampionship === 'all' || scorer.championshipId === selectedChampionship)
    .sort((a, b) => b.goals - a.goals);
    
  const filteredYellowCardLeaders = yellowCardLeaders
    .filter(leader => selectedCategory === 'all' || leader.category === selectedCategory)
    .filter(leader => selectedChampionship === 'all' || leader.championshipId === selectedChampionship)
    .sort((a, b) => b.yellowCards - a.yellowCards);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a237e]">Gerenciamento de Estatísticas</h2>
        
        <StatisticsFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedChampionship={selectedChampionship}
          setSelectedChampionship={setSelectedChampionship}
          championships={championships}
        />
      </div>
      
      <Tabs defaultValue="topscorers">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="topscorers" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Artilheiros
          </TabsTrigger>
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <BarChartIcon className="h-4 w-4" />
            Cartões
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="topscorers">
          <TopScorersManagement
            isLoading={isLoading}
            topScorers={topScorers}
            setTopScorers={setTopScorers}
            filteredTopScorers={filteredTopScorers}
            selectedCategory={selectedCategory}
            teams={teams}
            players={players}
            championships={championships}
          />
        </TabsContent>
        
        <TabsContent value="cards">
          <YellowCardManagement
            isLoading={isLoading}
            yellowCardLeaders={yellowCardLeaders}
            setYellowCardLeaders={setYellowCardLeaders}
            filteredYellowCardLeaders={filteredYellowCardLeaders}
            selectedCategory={selectedCategory}
            teams={teams}
            players={players}
            championships={championships}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatisticsManagement;
