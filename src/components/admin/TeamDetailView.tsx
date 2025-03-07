
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart4, 
  CalendarDays, 
  ChevronLeft, 
  Users, 
  Trophy, 
  MapPin, 
  Phone, 
  Mail, 
  Link as LinkIcon,
  ArrowLeft,
  User
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Team, Player } from "@/types";
import { useToast } from "@/components/ui/use-toast";

interface TeamDetailViewProps {
  team: Team;
  onBack: () => void;
}

const TeamDetailView: React.FC<TeamDetailViewProps> = ({ team, onBack }) => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>(team.category || "");
  const [categories, setCategories] = useState<string[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [teamUsers, setTeamUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchTeamData = async () => {
      setIsLoading(true);
      try {
        // Fetch all categories this team participates in
        const { data: teamCategories, error: categoryError } = await supabase
          .from('teams')
          .select('category')
          .eq('name', team.name)
          .order('category');
        
        if (categoryError) throw categoryError;
        
        const uniqueCategories = Array.from(new Set(teamCategories.map(t => t.category)));
        setCategories(uniqueCategories);
        
        if (uniqueCategories.length > 0 && !selectedCategory) {
          setSelectedCategory(uniqueCategories[0]);
        }
        
        // Set initial category if not set and we have categories
        const category = selectedCategory || (uniqueCategories.length > 0 ? uniqueCategories[0] : team.category);
        
        // Fetch players for this team and category
        await fetchPlayersByCategory(team.id, category);
        
        // Fetch matches
        await fetchMatchesByCategory(team.id, category);
        
        // Fetch standings
        await fetchStandingsByCategory(team.id, category);
        
        // Fetch team users (presidents/admins)
        await fetchTeamUsers(team.id);
        
      } catch (error: any) {
        console.error("Error fetching team data:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: error.message
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTeamData();
  }, [team.id, team.name]);
  
  useEffect(() => {
    if (selectedCategory) {
      fetchPlayersByCategory(team.id, selectedCategory);
      fetchMatchesByCategory(team.id, selectedCategory);
      fetchStandingsByCategory(team.id, selectedCategory);
    }
  }, [selectedCategory]);
  
  const fetchPlayersByCategory = async (teamId: string, category: string) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('team_id', teamId)
        .eq('category', category);
      
      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };
  
  const fetchMatchesByCategory = async (teamId: string, category: string) => {
    try {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team_details:home_team(name, logo),
          away_team_details:away_team(name, logo)
        `)
        .eq('category', category)
        .or(`home_team.eq.${teamId},away_team.eq.${teamId}`)
        .order('date', { ascending: false });
      
      if (error) throw error;
      setMatches(data || []);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };
  
  const fetchStandingsByCategory = async (teamId: string, category: string) => {
    try {
      const { data, error } = await supabase
        .from('standings')
        .select(`
          *,
          teams:team_id(name, logo)
        `)
        .eq('category', category)
        .eq('team_id', teamId);
      
      if (error) throw error;
      setStandings(data || []);
    } catch (error) {
      console.error("Error fetching standings:", error);
    }
  };
  
  const fetchTeamUsers = async (teamId: string) => {
    try {
      const { data, error } = await supabase
        .from('team_accounts')
        .select('*')
        .eq('team_id', teamId);
      
      if (error) throw error;
      setTeamUsers(data || []);
    } catch (error) {
      console.error("Error fetching team users:", error);
    }
  };
  
  const getMatchResult = (match: any) => {
    if (match.status !== 'completed' && match.status !== 'finalizado' && match.status !== 'encerrado') {
      return 'Pendente';
    }
    
    if (match.home_team === team.id) {
      if (match.home_score > match.away_score) return 'Vitória';
      if (match.home_score < match.away_score) return 'Derrota';
      return 'Empate';
    } else {
      if (match.away_score > match.home_score) return 'Vitória';
      if (match.away_score < match.home_score) return 'Derrota';
      return 'Empate';
    }
  };
  
  const getResultColor = (result: string) => {
    switch (result) {
      case 'Vitória': return 'bg-green-100 text-green-800';
      case 'Derrota': return 'bg-red-100 text-red-800';
      case 'Empate': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchScore = (match: any) => {
    if (match.home_score === null || match.away_score === null) {
      return '- x -';
    }
    return `${match.home_score} x ${match.away_score}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a237e]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold text-[#1a237e]">Detalhes do Time</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="mb-4">
                <Avatar className="h-24 w-24">
                  {team.logoUrl ? (
                    <AvatarImage src={team.logoUrl} alt={team.name} />
                  ) : null}
                  <AvatarFallback className="text-2xl bg-[#1a237e] text-white">
                    {team.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <h3 className="text-xl font-bold mb-1">{team.name}</h3>
              
              {categories.length > 0 && (
                <div className="mt-4 w-full">
                  <label className="block text-sm font-medium mb-1">Categoria</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="mt-6 w-full">
                <h4 className="font-medium text-sm text-gray-500 mb-2">Informações de Contato</h4>
                
                {team.email && (
                  <div className="flex items-center mt-2">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{team.email}</span>
                  </div>
                )}
                
                {team.phone && (
                  <div className="flex items-center mt-2">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{team.phone}</span>
                  </div>
                )}
                
                {team.websiteUrl && (
                  <div className="flex items-center mt-2">
                    <LinkIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <a href={team.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                      Website
                    </a>
                  </div>
                )}
                
                {team.address && (
                  <div className="flex items-center mt-2">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{team.address}</span>
                  </div>
                )}
              </div>
              
              {teamUsers.length > 0 && (
                <div className="mt-6 w-full">
                  <h4 className="font-medium text-sm text-gray-500 mb-2">Responsáveis</h4>
                  
                  {teamUsers.map((user) => (
                    <div key={user.id} className="flex items-center mt-2 p-2 bg-gray-50 rounded-md">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="overview" className="data-[state=active]:bg-[#1a237e] data-[state=active]:text-white">
                  <BarChart4 className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Desempenho</span>
                </TabsTrigger>
                <TabsTrigger value="matches" className="data-[state=active]:bg-[#1a237e] data-[state=active]:text-white">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Partidas</span>
                </TabsTrigger>
                <TabsTrigger value="players" className="data-[state=active]:bg-[#1a237e] data-[state=active]:text-white">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Jogadores</span>
                </TabsTrigger>
                <TabsTrigger value="standings" className="data-[state=active]:bg-[#1a237e] data-[state=active]:text-white">
                  <Trophy className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Classificação</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {standings.length > 0 ? (
                    <>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Visão Geral</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-gray-50 p-3 rounded-md text-center">
                              <div className="text-sm text-gray-500">Jogos</div>
                              <div className="text-2xl font-bold">{standings[0].played}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-md text-center">
                              <div className="text-sm text-gray-500">Pontos</div>
                              <div className="text-2xl font-bold">{standings[0].points}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-md text-center">
                              <div className="text-sm text-gray-500">Posição</div>
                              <div className="text-2xl font-bold">{standings[0].position}º</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-md text-center">
                              <div className="text-sm text-gray-500">Gols</div>
                              <div className="text-2xl font-bold">{standings[0].goals_for} / {standings[0].goals_against}</div>
                            </div>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                            <div className="bg-green-50 p-2 rounded-md">
                              <div className="text-xs text-gray-500">Vitórias</div>
                              <div className="text-xl font-bold text-green-600">{standings[0].won}</div>
                            </div>
                            <div className="bg-yellow-50 p-2 rounded-md">
                              <div className="text-xs text-gray-500">Empates</div>
                              <div className="text-xl font-bold text-yellow-600">{standings[0].drawn}</div>
                            </div>
                            <div className="bg-red-50 p-2 rounded-md">
                              <div className="text-xs text-gray-500">Derrotas</div>
                              <div className="text-xl font-bold text-red-600">{standings[0].lost}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Detalhes da Equipe</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between py-1 border-b">
                              <span className="text-gray-500">Categoria</span>
                              <span className="font-medium">{selectedCategory}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b">
                              <span className="text-gray-500">Grupo</span>
                              <span className="font-medium">{standings[0].group_name}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b">
                              <span className="text-gray-500">Jogadores</span>
                              <span className="font-medium">{players.length}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b">
                              <span className="text-gray-500">Saldo de Gols</span>
                              <span className="font-medium">{standings[0].goal_difference}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <div className="col-span-2 p-4 text-center">
                      <p className="text-gray-500">Não há dados de classificação disponíveis para esta equipe nesta categoria.</p>
                    </div>
                  )}
                  
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Últimas Partidas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {matches.length > 0 ? (
                        <ScrollArea className="h-[200px]">
                          <div className="space-y-2">
                            {matches.slice(0, 5).map((match) => (
                              <div key={match.id} className="flex items-center justify-between p-2 border rounded-md">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="h-8 w-8">
                                    {match.home_team_details?.logo ? (
                                      <AvatarImage src={match.home_team_details.logo} alt={match.home_team_details.name} />
                                    ) : null}
                                    <AvatarFallback className="text-xs bg-gray-200">
                                      {match.home_team_details?.name?.substring(0, 2).toUpperCase() || 'H'}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm font-medium">{match.home_team_details?.name}</span>
                                  <span className="font-bold">{getMatchScore(match)}</span>
                                  <span className="text-sm font-medium">{match.away_team_details?.name}</span>
                                  <Avatar className="h-8 w-8">
                                    {match.away_team_details?.logo ? (
                                      <AvatarImage src={match.away_team_details.logo} alt={match.away_team_details.name} />
                                    ) : null}
                                    <AvatarFallback className="text-xs bg-gray-200">
                                      {match.away_team_details?.name?.substring(0, 2).toUpperCase() || 'A'}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                                <div className="flex items-center">
                                  <Badge className={getResultColor(getMatchResult(match))}>
                                    {getMatchResult(match)}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      ) : (
                        <p className="text-center text-gray-500">Não há partidas registradas para esta equipe nesta categoria.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="matches" className="p-4">
                <ScrollArea className="h-[500px]">
                  {matches.length > 0 ? (
                    <div className="space-y-4">
                      {matches.map((match) => (
                        <Card key={match.id} className="overflow-hidden">
                          <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                            <div className="text-sm">
                              <span className="font-medium">{new Date(match.date).toLocaleDateString('pt-BR')}</span>
                              {match.time && (
                                <span className="ml-2">{match.time.substring(0, 5)}</span>
                              )}
                            </div>
                            <Badge className={getResultColor(getMatchResult(match))}>
                              {getMatchResult(match)}
                            </Badge>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-center space-x-4">
                              <div className="text-center">
                                <Avatar className="h-16 w-16 mx-auto mb-2">
                                  {match.home_team_details?.logo ? (
                                    <AvatarImage src={match.home_team_details.logo} alt={match.home_team_details.name} />
                                  ) : null}
                                  <AvatarFallback className="text-lg bg-gray-200">
                                    {match.home_team_details?.name?.substring(0, 2).toUpperCase() || 'H'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{match.home_team_details?.name}</div>
                              </div>
                              
                              <div className="text-center">
                                <div className="text-3xl font-bold">
                                  {match.home_score !== null ? match.home_score : '-'} : {match.away_score !== null ? match.away_score : '-'}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {match.status === 'completed' || match.status === 'finalizado' || match.status === 'encerrado' 
                                    ? 'Finalizado' 
                                    : match.status === 'in_progress' ? 'Em andamento' : 'Agendado'}
                                </div>
                              </div>
                              
                              <div className="text-center">
                                <Avatar className="h-16 w-16 mx-auto mb-2">
                                  {match.away_team_details?.logo ? (
                                    <AvatarImage src={match.away_team_details.logo} alt={match.away_team_details.name} />
                                  ) : null}
                                  <AvatarFallback className="text-lg bg-gray-200">
                                    {match.away_team_details?.name?.substring(0, 2).toUpperCase() || 'A'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="font-medium">{match.away_team_details?.name}</div>
                              </div>
                            </div>
                            
                            <div className="mt-4 text-sm text-center text-gray-500">
                              Local: {match.location}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <p className="text-gray-500">Não há partidas registradas para esta equipe nesta categoria.</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="players" className="p-4">
                <ScrollArea className="h-[500px]">
                  {players.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {players.map((player) => (
                        <Card key={player.id} className="overflow-hidden">
                          <div className="flex p-4">
                            <Avatar className="h-16 w-16 mr-4">
                              {player.photo ? (
                                <AvatarImage src={player.photo} alt={player.name} />
                              ) : null}
                              <AvatarFallback className="bg-[#1a237e] text-white">
                                {player.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-bold">{player.name}</h4>
                              <div className="flex items-center mt-1">
                                <Badge variant="outline" className="mr-2">
                                  {player.position}
                                </Badge>
                                {player.number && (
                                  <Badge variant="secondary"># {player.number}</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <p className="text-gray-500">Não há jogadores registrados para esta equipe nesta categoria.</p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="standings" className="p-4">
                {standings.length > 0 ? (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Estatísticas de Desempenho</CardTitle>
                      <CardDescription>
                        {selectedCategory} - {standings[0].group_name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Estatística</TableHead>
                            <TableHead>Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Posição</TableCell>
                            <TableCell>{standings[0].position}º</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Pontos</TableCell>
                            <TableCell>{standings[0].points}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Jogos</TableCell>
                            <TableCell>{standings[0].played}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Vitórias</TableCell>
                            <TableCell>{standings[0].won}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Empates</TableCell>
                            <TableCell>{standings[0].drawn}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Derrotas</TableCell>
                            <TableCell>{standings[0].lost}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Gols Marcados</TableCell>
                            <TableCell>{standings[0].goals_for}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Gols Sofridos</TableCell>
                            <TableCell>{standings[0].goals_against}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Saldo de Gols</TableCell>
                            <TableCell>{standings[0].goal_difference}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center p-8">
                    <p className="text-gray-500">Não há dados de classificação disponíveis para esta equipe nesta categoria.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamDetailView;
