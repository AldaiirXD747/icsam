import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { supabase } from "@/integrations/supabase/client";
import { ChampionshipMatch, MatchStatus, Team } from '@/types/championship';
import { getAllMatches } from '@/lib/matchApi';
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from '@/lib/utils';

const formSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  time: z.string().min(1, {
    message: "Time is required",
  }),
  home_team: z.string().min(1, {
    message: "Home team is required",
  }),
  away_team: z.string().min(1, {
    message: "Away team is required",
  }),
  home_score: z.string().nullable(),
  away_score: z.string().nullable(),
  category: z.string().min(1, {
    message: "Category is required",
  }),
  status: z.string(),
  location: z.string().min(1, {
    message: "Location is required",
  }),
  round: z.string().nullable(),
  championship_id: z.string().nullable(),
})

const MatchManagement = () => {
  const { toast } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  const [championships, setChampionships] = useState<{ id: string; name: string; }[]>([]);
  const [matches, setMatches] = useState<ChampionshipMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      time: '16:00',
      home_team: '',
      away_team: '',
      home_score: null,
      away_score: null,
      category: 'Sub-17',
      status: 'scheduled',
      location: '',
      round: null,
      championship_id: null,
    },
  })

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('id, name, logo')
        .order('name');

      if (teamsError) throw teamsError;
      setTeams(teamsData || []);

      // Fetch championships
      const { data: championshipsData, error: championshipsError } = await supabase
        .from('championships')
        .select('id, name')
        .order('name');

      if (championshipsError) throw championshipsError;
      setChampionships(championshipsData || []);

      // Fetch matches
      const matchesData = await getAllMatches();
      setMatches(matchesData);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Convert form values to match the database schema
      const matchToCreate = {
        date: format(values.date, 'yyyy-MM-dd'),
        time: values.time,
        home_team: values.home_team,
        away_team: values.away_team,
        home_score: values.home_score ? parseInt(values.home_score, 10) : null,
        away_score: values.away_score ? parseInt(values.away_score, 10) : null,
        category: values.category,
        status: values.status,
        location: values.location,
        round: values.round,
        championship_id: values.championship_id,
      };

      // Insert the new match into the database
      const { data, error } = await supabase
        .from('matches')
        .insert([matchToCreate]);

      if (error) {
        console.error('Error creating match:', error);
        toast({
          variant: "destructive",
          title: "Erro ao criar partida",
          description: "Não foi possível criar a partida."
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Partida criada com sucesso!",
      });

      // Reset the form after successful submission
      form.reset();
    } catch (error) {
      console.error('Error creating match:', error);
      toast({
        variant: "destructive",
        title: "Erro ao criar partida",
        description: "Ocorreu um erro ao criar a partida."
      });
    }
  };

  // Update the function that handles team selection to properly type cast
  const handleTeamSelection = (teamId: string, type: 'home' | 'away') => {
    const selectedTeam = teams.find(team => team.id === teamId);
    
    if (type === 'home') {
      setMatchData({
        ...matchData,
        home_team: teamId,
        home_team_name: selectedTeam?.name || '',
        home_team_logo: selectedTeam?.logo || ''
      });
    } else {
      setMatchData({
        ...matchData,
        away_team: teamId,
        away_team_name: selectedTeam?.name || '',
        away_team_logo: selectedTeam?.logo || ''
      });
    }
  };

  // Fix match status handling
  const handleStatusChange = (status: string) => {
    // Safely cast the status to MatchStatus
    const matchStatus = status as MatchStatus;
    setMatchData({
      ...matchData,
      status: matchStatus
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-[#1a237e] mb-4">Gerenciar Partidas</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Partidas Registradas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => (
            <Card key={match.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">{formatDate(match.date)}</span>
                  <span className="text-sm text-gray-600">{match.time}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-center">
                    <p className="font-semibold">{match.home_team_name}</p>
                    <img 
                      src={match.home_team_logo || '/placeholder.svg'} 
                      alt={match.home_team_name} 
                      className="w-12 h-12 mx-auto object-contain"
                    />
                  </div>
                  <div className="text-2xl font-bold">
                    {match.home_score ?? '-'} x {match.away_score ?? '-'}
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{match.away_team_name}</p>
                    <img 
                      src={match.away_team_logo || '/placeholder.svg'} 
                      alt={match.away_team_name} 
                      className="w-12 h-12 mx-auto object-contain"
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Local: {match.location}</p>
                  <p>Categoria: {match.category}</p>
                  <p>Status: {match.status}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Adicionar Nova Partida</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Escolha uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Data da partida.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormDescription>
                    Horário da partida.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="home_team"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Time da Casa</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o time da casa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Time que jogará em casa.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="away_team"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Time Visitante</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o time visitante" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Time que jogará como visitante.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="home_score"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Placar Casa</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Gols do time da casa" {...field} />
                    </FormControl>
                    <FormDescription>
                      Número de gols marcados pelo time da casa.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="away_score"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Placar Visitante</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Gols do time visitante" {...field} />
                    </FormControl>
                    <FormDescription>
                      Número de gols marcados pelo time visitante.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Sub-15">Sub-15</SelectItem>
                      <SelectItem value="Sub-17">Sub-17</SelectItem>
                      <SelectItem value="Sub-20">Sub-20</SelectItem>
                      <SelectItem value="Profissional">Profissional</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Categoria da partida.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="scheduled">Agendado</SelectItem>
                      <SelectItem value="live">Ao vivo</SelectItem>
                      <SelectItem value="in_progress">Em progresso</SelectItem>
                      <SelectItem value="finished">Finalizado</SelectItem>
                      <SelectItem value="completed">Completo</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                      <SelectItem value="postponed">Adiado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Status da partida.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localização</FormLabel>
                  <FormControl>
                    <Input placeholder="Local da partida" {...field} />
                  </FormControl>
                  <FormDescription>
                    Local onde a partida será realizada.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="round"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rodada</FormLabel>
                  <FormControl>
                    <Input placeholder="Rodada da partida" {...field} />
                  </FormControl>
                  <FormDescription>
                    Rodada em que a partida será realizada.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="championship_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campeonato</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o campeonato" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {championships.map((championship) => (
                        <SelectItem key={championship.id} value={championship.id}>{championship.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Campeonato ao qual a partida pertence.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Criar Partida</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default MatchManagement;
