
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  number: number | null;
  position: string;
}

interface Team {
  id: string;
  name: string;
}

interface Match {
  match_id: string;
  match_date: string;
  match_time: string;
  match_location: string;
  match_category: string;
  match_status: string;
  match_round: string | null;
  home_team_id: string;
  home_team_name: string;
  away_team_id: string;
  away_team_name: string;
  home_players: Player[];
  away_players: Player[];
}

const MatchStatisticsManagement = () => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>("");
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [selectedTeamName, setSelectedTeamName] = useState<string>("");
  const [statType, setStatType] = useState<string>("goal");
  const [quantity, setQuantity] = useState<number>(1);
  const [minute, setMinute] = useState<number | undefined>(undefined);
  const [half, setHalf] = useState<string>("first");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  // Fetch completed matches with teams and players
  const { data: matches, isLoading: isLoadingMatches, error: matchesError } = useQuery({
    queryKey: ['completedMatches'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_matches_with_teams_and_players');
      
      if (error) {
        console.error("Error fetching completed matches:", error);
        throw error;
      }
      
      return data as Match[];
    }
  });

  useEffect(() => {
    if (selectedMatch) {
      // Reset player and team selection when match changes
      setSelectedPlayerId("");
      setSelectedTeamId("");
      setSelectedTeamName("");
    }
  }, [selectedMatch]);

  useEffect(() => {
    if (selectedTeamId) {
      if (selectedMatch?.home_team_id === selectedTeamId) {
        setSelectedTeamName(selectedMatch.home_team_name);
      } else if (selectedMatch?.away_team_id === selectedTeamId) {
        setSelectedTeamName(selectedMatch.away_team_name);
      }
    }
  }, [selectedTeamId, selectedMatch]);

  const handleAddStatistic = async () => {
    if (!selectedMatch || !selectedPlayerId || !selectedTeamId) {
      toast.error("Por favor, selecione partida, time e jogador antes de adicionar estatística.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('match_statistics')
        .insert({
          match_id: selectedMatch.match_id,
          player_id: selectedPlayerId,
          team_id: selectedTeamId,
          statistic_type: statType,
          quantity: quantity,
          minute: minute || null,
          half: half
        })
        .select();

      if (error) {
        console.error("Error adding statistic:", error);
        toast.error(`Erro ao adicionar estatística: ${error.message}`);
        return;
      }

      toast.success(`Estatística adicionada com sucesso!`);
      setDialogOpen(false);
      
      // Reset form
      setQuantity(1);
      setMinute(undefined);
      setHalf("first");
    } catch (err) {
      console.error("Error in statistic submission:", err);
      toast.error("Erro ao adicionar estatística");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlayers = (teamId: string): Player[] => {
    if (!selectedMatch) return [];
    
    if (teamId === selectedMatch.home_team_id) {
      return selectedMatch.home_players || [];
    } else if (teamId === selectedMatch.away_team_id) {
      return selectedMatch.away_players || [];
    }
    
    return [];
  };

  if (isLoadingMatches) {
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="h-10 w-10 animate-spin text-blue-primary" />
        <p className="ml-2">Carregando partidas...</p>
      </div>
    );
  }

  if (matchesError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
        <p>Erro ao carregar partidas. Por favor, tente novamente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Adicionar Estatísticas de Partida</h2>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Adicionar Estatística</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Adicionar Estatística de Jogador</DialogTitle>
              <DialogDescription>
                Adicione estatísticas como gols ou cartões para jogadores específicos em uma partida.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="match">Partida</Label>
                <Select
                  value={selectedMatch?.match_id || ""}
                  onValueChange={(value) => {
                    const match = matches?.find(m => m.match_id === value);
                    setSelectedMatch(match || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma partida" />
                  </SelectTrigger>
                  <SelectContent>
                    {matches?.map((match) => (
                      <SelectItem key={match.match_id} value={match.match_id}>
                        {match.home_team_name} vs {match.away_team_name} - {new Date(match.match_date).toLocaleDateString('pt-BR')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedMatch && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="team">Time</Label>
                    <Select
                      value={selectedTeamId}
                      onValueChange={(value) => setSelectedTeamId(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={selectedMatch.home_team_id}>
                          {selectedMatch.home_team_name} (Casa)
                        </SelectItem>
                        <SelectItem value={selectedMatch.away_team_id}>
                          {selectedMatch.away_team_name} (Visitante)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedTeamId && (
                    <div className="space-y-2">
                      <Label htmlFor="player">Jogador</Label>
                      <Select
                        value={selectedPlayerId}
                        onValueChange={(value) => setSelectedPlayerId(value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um jogador" />
                        </SelectTrigger>
                        <SelectContent>
                          {getPlayers(selectedTeamId).map((player) => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.name} {player.number ? `(${player.number})` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {selectedPlayerId && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="statType">Tipo de Estatística</Label>
                        <Select
                          value={statType}
                          onValueChange={(value) => setStatType(value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="goal">Gol</SelectItem>
                            <SelectItem value="yellow_card">Cartão Amarelo</SelectItem>
                            <SelectItem value="red_card">Cartão Vermelho</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantidade</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                          min={1}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="minute">Minuto (opcional)</Label>
                          <Input
                            id="minute"
                            type="number"
                            value={minute || ""}
                            onChange={(e) => setMinute(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                            placeholder="Ex: 45"
                            min={0}
                            max={120}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="half">Tempo</Label>
                          <Select value={half} onValueChange={(value) => setHalf(value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="first">Primeiro Tempo</SelectItem>
                              <SelectItem value="second">Segundo Tempo</SelectItem>
                              <SelectItem value="extra_time">Prorrogação</SelectItem>
                              <SelectItem value="penalties">Pênaltis</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
              
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={handleAddStatistic} 
                  disabled={!selectedMatch || !selectedPlayerId || !selectedTeamId || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Adicionar Estatística'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas por Partida</CardTitle>
          <CardDescription>
            Selecione uma partida para ver ou adicionar estatísticas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="matchSelect">Partida</Label>
              <Select
                value={selectedMatch?.match_id || ""}
                onValueChange={(value) => {
                  const match = matches?.find(m => m.match_id === value);
                  setSelectedMatch(match || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma partida" />
                </SelectTrigger>
                <SelectContent>
                  {matches?.map((match) => (
                    <SelectItem key={match.match_id} value={match.match_id}>
                      {match.home_team_name} vs {match.away_team_name} - {new Date(match.match_date).toLocaleDateString('pt-BR')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedMatch && (
              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                  <TabsTrigger value="homeTeam">{selectedMatch.home_team_name}</TabsTrigger>
                  <TabsTrigger value="awayTeam">{selectedMatch.away_team_name}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <div className="p-4 rounded-md border">
                    <h3 className="font-medium mb-2">Detalhes da Partida</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p><span className="font-medium">Data:</span> {new Date(selectedMatch.match_date).toLocaleDateString('pt-BR')}</p>
                        <p><span className="font-medium">Horário:</span> {selectedMatch.match_time}</p>
                        <p><span className="font-medium">Local:</span> {selectedMatch.match_location}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Categoria:</span> {selectedMatch.match_category}</p>
                        <p><span className="font-medium">Status:</span> {selectedMatch.match_status}</p>
                        <p><span className="font-medium">Rodada:</span> {selectedMatch.match_round || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="homeTeam">
                  <div className="space-y-4">
                    <h3 className="font-medium">Jogadores do {selectedMatch.home_team_name}</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Número</TableHead>
                          <TableHead>Posição</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedMatch.home_players?.map((player) => (
                          <TableRow key={player.id}>
                            <TableCell className="font-medium">{player.name}</TableCell>
                            <TableCell>{player.number || 'N/A'}</TableCell>
                            <TableCell>{player.position}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedTeamId(selectedMatch.home_team_id);
                                  setSelectedPlayerId(player.id);
                                  setDialogOpen(true);
                                }}
                              >
                                Adicionar Estatística
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="awayTeam">
                  <div className="space-y-4">
                    <h3 className="font-medium">Jogadores do {selectedMatch.away_team_name}</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Número</TableHead>
                          <TableHead>Posição</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedMatch.away_players?.map((player) => (
                          <TableRow key={player.id}>
                            <TableCell className="font-medium">{player.name}</TableCell>
                            <TableCell>{player.number || 'N/A'}</TableCell>
                            <TableCell>{player.position}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedTeamId(selectedMatch.away_team_id);
                                  setSelectedPlayerId(player.id);
                                  setDialogOpen(true);
                                }}
                              >
                                Adicionar Estatística
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchStatisticsManagement;
