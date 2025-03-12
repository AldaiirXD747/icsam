
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';

interface Player {
  id: string;
  name: string;
  number: number | null;
  position: string;
}

interface CustomMatch {
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

const statisticTypes = [
  { value: 'goal', label: 'Gol' },
  { value: 'yellow_card', label: 'Cartão Amarelo' },
  { value: 'red_card', label: 'Cartão Vermelho' },
  { value: 'assist', label: 'Assistência' },
  { value: 'own_goal', label: 'Gol Contra' },
  { value: 'penalty_saved', label: 'Pênalti Defendido' },
  { value: 'penalty_missed', label: 'Pênalti Perdido' },
];

const formSchema = z.object({
  statistic_type: z.string().min(1, { message: "Selecione o tipo de estatística" }),
  player_id: z.string().min(1, { message: "Selecione o jogador" }),
  quantity: z.number().min(1, { message: "Quantidade deve ser pelo menos 1" }).max(10),
  minute: z.number().min(1, { message: "Minuto deve ser válido" }).max(120).optional(),
  half: z.string().optional(),
});

const MatchStatisticsManagement: React.FC = () => {
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [activeMatch, setActiveMatch] = useState<CustomMatch | null>(null);
  const [teamPlayers, setTeamPlayers] = useState<Player[]>([]);

  // Fetch matches that are completed (for statistics)
  const { data: matches, isLoading: isLoadingMatches } = useQuery({
    queryKey: ['completed-matches-with-players'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_matches_with_teams_and_players');
        
        if (error) {
          throw error;
        }
        
        // Transform received data to match our CustomMatch type
        const transformedData: CustomMatch[] = (data as any[]).map(item => {
          return {
            match_id: item.match_id,
            match_date: item.match_date,
            match_time: item.match_time,
            match_location: item.match_location,
            match_category: item.match_category,
            match_status: item.match_status,
            match_round: item.match_round,
            home_team_id: item.home_team_id,
            home_team_name: item.home_team_name,
            away_team_id: item.away_team_id,
            away_team_name: item.away_team_name,
            home_players: Array.isArray(item.home_players) ? item.home_players : [],
            away_players: Array.isArray(item.away_players) ? item.away_players : []
          };
        });
        
        return transformedData;
      } catch (error) {
        console.error("Erro ao buscar partidas:", error);
        return [] as CustomMatch[];
      }
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      statistic_type: "",
      player_id: "",
      quantity: 1,
      minute: undefined,
      half: "",
    },
  });

  // Effect to update active match when a match is selected
  useEffect(() => {
    if (selectedMatch && matches) {
      const match = matches.find(m => m.match_id === selectedMatch);
      if (match) {
        setActiveMatch(match);
        // Reset team selection when match changes
        setSelectedTeam(null);
      }
    } else {
      setActiveMatch(null);
      setSelectedTeam(null);
    }
  }, [selectedMatch, matches]);

  // Effect to update team players when a team is selected
  useEffect(() => {
    if (selectedTeam && activeMatch) {
      if (selectedTeam === activeMatch.home_team_id) {
        setTeamPlayers(activeMatch.home_players);
      } else if (selectedTeam === activeMatch.away_team_id) {
        setTeamPlayers(activeMatch.away_players);
      }
    } else {
      setTeamPlayers([]);
    }
    // Reset form when team changes
    form.reset();
  }, [selectedTeam, activeMatch, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedMatch || !selectedTeam) {
      toast.error("Selecione uma partida e um time");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('match_statistics')
        .insert({
          match_id: selectedMatch,
          team_id: selectedTeam,
          player_id: values.player_id,
          statistic_type: values.statistic_type,
          quantity: values.quantity,
          minute: values.minute || null,
          half: values.half || null
        });

      if (error) throw error;

      toast.success("Estatística adicionada com sucesso!");
      form.reset({
        statistic_type: "",
        player_id: "",
        quantity: 1,
        minute: undefined,
        half: "",
      });
    } catch (error: any) {
      console.error("Erro ao adicionar estatística:", error);
      toast.error(`Erro: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Partidas</CardTitle>
          <CardDescription>
            Adicione estatísticas para jogadores de partidas completadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Match Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="match-select">Selecione uma Partida</Label>
                <Select 
                  value={selectedMatch || ""} 
                  onValueChange={(value) => setSelectedMatch(value)}
                >
                  <SelectTrigger id="match-select">
                    <SelectValue placeholder="Selecione uma partida" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingMatches ? (
                      <div className="p-2 flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Carregando partidas...</span>
                      </div>
                    ) : (
                      matches?.map((match) => (
                        <SelectItem key={match.match_id} value={match.match_id}>
                          {match.home_team_name} vs {match.away_team_name} ({match.match_date})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Show selected match details */}
              {activeMatch && (
                <div>
                  <div className="mb-2">
                    <strong>Detalhes da Partida:</strong>
                  </div>
                  <p>
                    Data: {new Date(activeMatch.match_date).toLocaleDateString('pt-BR')} - {activeMatch.match_time}
                  </p>
                  <p>Local: {activeMatch.match_location}</p>
                  <p>Categoria: {activeMatch.match_category}</p>
                  {activeMatch.match_round && <p>Rodada: {activeMatch.match_round}</p>}
                </div>
              )}
            </div>

            {/* Team Selection */}
            {activeMatch && (
              <div>
                <Label htmlFor="team-select">Selecione um Time</Label>
                <Select 
                  value={selectedTeam || ""} 
                  onValueChange={(value) => setSelectedTeam(value)}
                >
                  <SelectTrigger id="team-select">
                    <SelectValue placeholder="Selecione um time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={activeMatch.home_team_id}>
                      {activeMatch.home_team_name} (Casa)
                    </SelectItem>
                    <SelectItem value={activeMatch.away_team_id}>
                      {activeMatch.away_team_name} (Visitante)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Statistics Form */}
            {selectedTeam && teamPlayers.length > 0 && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="player_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jogador</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um jogador" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {teamPlayers.map((player) => (
                                <SelectItem key={player.id} value={player.id}>
                                  {player.name} {player.number ? `(${player.number})` : ''} - {player.position}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="statistic_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Estatística</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {statisticTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantidade</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1} 
                              max={10}
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="minute"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minuto</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1}
                              max={120}
                              placeholder="Ex: 23"
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="half"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tempo</FormLabel>
                          <Select 
                            onValueChange={field.onChange}
                            value={field.value || ''}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o tempo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="first">1º Tempo</SelectItem>
                              <SelectItem value="second">2º Tempo</SelectItem>
                              <SelectItem value="extra_first">1º Tempo Extra</SelectItem>
                              <SelectItem value="extra_second">2º Tempo Extra</SelectItem>
                              <SelectItem value="penalties">Pênaltis</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="mt-4">
                    Adicionar Estatística
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchStatisticsManagement;
