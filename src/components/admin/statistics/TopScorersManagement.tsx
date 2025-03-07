import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TopScorer } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DataTableRowProps<T> {
  item: T;
}

function DataTableRow<T extends TopScorer>({ item }: DataTableRowProps<T>) {
  return (
    <TableRow key={item.id}>
      <TableCell className="font-medium">{item.name}</TableCell>
      <TableCell>{item.team}</TableCell>
      <TableCell>{item.goals}</TableCell>
      <TableCell>{item.category}</TableCell>
      <TableCell className="text-right">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <span className="sr-only">Editar</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.082.285a.75.75 0 00.693.943h.281a5.25 5.25 0 002.214-1.32L19.513 8.199z" />
              </svg>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar artilheiro</DialogTitle>
              <DialogDescription>
                Atualize os dados do artilheiro. Clique em salvar quando estiver satisfeito.
              </DialogDescription>
            </DialogHeader>
            <EditTopScorerForm topScorer={item} />
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  )
}

interface DataTableProps<T> {
  items: T[];
}

function DataTable<T extends TopScorer>({ items }: DataTableProps<T>) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Gols</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <DataTableRow key={item.id} item={item} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

const formSchema = z.object({
  playerId: z.string().min(2, {
    message: 'PlayerId deve ter pelo menos 2 caracteres.',
  }),
  teamId: z.string().min(2, {
    message: 'TeamId deve ter pelo menos 2 caracteres.',
  }),
  goals: z.number().min(0, {
    message: 'Gols deve ser maior ou igual a zero.',
  }),
  category: z.string().min(2, {
    message: 'Categoria deve ter pelo menos 2 caracteres.',
  }),
  championshipId: z.string().optional(),
})

interface TopScorersManagementProps {
  championshipId: string | undefined;
}

const TopScorersManagement: React.FC<TopScorersManagementProps> = ({ championshipId }) => {
  const [open, setOpen] = useState(false);
  const [topScorers, setTopScorers] = useState<TopScorer[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  const { data, refetch } = useQuery({
    queryKey: ['topScorers', championshipId],
    queryFn: async () => {
      if (!championshipId) return [];
      const { data, error } = await supabase
        .from('top_scorers')
        .select('*')
        .eq('championship_id', championshipId);

      if (error) {
        console.error('Error fetching top scorers:', error);
        return [];
      }

      // Fetch additional data for each top scorer
      const enrichedTopScorers = await Promise.all(
        data.map(async (scorer) => {
          const player = players.find((p) => p.id === scorer.player_id);
          const team = teams.find((t) => t.id === scorer.team_id);

          return {
            ...scorer,
            name: player ? player.name : 'Desconhecido',
            team: team ? team.name : 'Time desconhecido',
          };
        })
      );

      setTopScorers(enrichedTopScorers);
      return enrichedTopScorers;
    },
    enabled: !!championshipId && players.length > 0 && teams.length > 0,
  });

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase.from('players').select('*');
      if (error) {
        console.error('Error fetching players:', error);
        return;
      }
      setPlayers(data || []);
    };

    const fetchTeams = async () => {
      const { data, error } = await supabase.from('teams').select('*');
      if (error) {
        console.error('Error fetching teams:', error);
        return;
      }
      setTeams(data || []);
    };

    fetchPlayers();
    fetchTeams();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playerId: '',
      teamId: '',
      goals: 0,
      category: 'SUB-15',
      championshipId: championshipId,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data, error } = await supabase
        .from('top_scorers')
        .insert([
          {
            player_id: values.playerId,
            team_id: values.teamId,
            goals: values.goals,
            category: values.category,
            championship_id: championshipId,
          },
        ])
        .select();

      if (error) {
        console.error('Error creating top scorer:', error);
        toast.error('Erro ao criar artilheiro.');
        return;
      }

      refetch();
      toast.success('Artilheiro criado com sucesso!');
      setOpen(false);
    } catch (error) {
      console.error('Error creating top scorer:', error);
      toast.error('Erro ao criar artilheiro.');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Artilheiros</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="primary">Adicionar artilheiro</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar artilheiro</DialogTitle>
              <DialogDescription>
                Crie um novo artilheiro para o campeonato. Clique em salvar quando estiver satisfeito.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="playerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jogador</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um jogador" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {players.map((player) => (
                            <SelectItem key={player.id} value={player.id}>{player.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Selecione o jogador que será o artilheiro.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="teamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teams.map((team) => (
                            <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Selecione o time do jogador.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gols</FormLabel>
                      <FormControl>
                        <Input placeholder="Gols" type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Número de gols marcados pelo jogador.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <Input placeholder="Categoria" {...field} />
                      </FormControl>
                      <FormDescription>
                        Categoria do jogador.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Salvar</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable
        items={topScorers.map((scorer) => ({
          id: scorer.id,
          player_id: scorer.playerId || scorer.player_id || '',
          team_id: scorer.teamId || scorer.team_id || '',
          championship_id: scorer.championshipId || scorer.championship_id || null,
          name: scorer.name || 'Desconhecido',
          team: scorer.team || 'Time desconhecido',
          goals: scorer.goals,
          category: scorer.category,
          // Include both camelCase and snake_case properties
          playerId: scorer.playerId || scorer.player_id || '',
          teamId: scorer.teamId || scorer.team_id || '',
          championshipId: scorer.championshipId || scorer.championship_id || null,
        }))}
      />
    </div>
  );
};

export default TopScorersManagement;

interface EditTopScorerFormProps {
  topScorer: TopScorer;
}

const EditTopScorerForm: React.FC<EditTopScorerFormProps> = ({ topScorer }) => {
  const [players, setPlayers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase.from('players').select('*');
      if (error) {
        console.error('Error fetching players:', error);
        return;
      }
      setPlayers(data || []);
    };

    const fetchTeams = async () => {
      const { data, error } = await supabase.from('teams').select('*');
      if (error) {
        console.error('Error fetching teams:', error);
        return;
      }
      setTeams(data || []);
    };

    fetchPlayers();
    fetchTeams();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playerId: topScorer.playerId || '',
      teamId: topScorer.teamId || '',
      goals: topScorer.goals,
      category: topScorer.category,
      championshipId: topScorer.championshipId,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data, error } = await supabase
        .from('top_scorers')
        .update({
          player_id: values.playerId,
          team_id: values.teamId,
          goals: values.goals,
          category: values.category,
          championship_id: values.championshipId,
        })
        .eq('id', topScorer.id)
        .select();

      if (error) {
        console.error('Error updating top scorer:', error);
        toast.error('Erro ao atualizar artilheiro.');
        return;
      }

      toast.success('Artilheiro atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating top scorer:', error);
      toast.error('Erro ao atualizar artilheiro.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="playerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jogador</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um jogador" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {players.map((player) => (
                    <SelectItem key={player.id} value={player.id}>{player.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Selecione o jogador que será o artilheiro.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="teamId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Selecione o time do jogador.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="goals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gols</FormLabel>
              <FormControl>
                <Input placeholder="Gols" type="number" {...field} />
              </FormControl>
              <FormDescription>
                Número de gols marcados pelo jogador.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <FormControl>
                <Input placeholder="Categoria" {...field} />
              </FormControl>
              <FormDescription>
                Categoria do jogador.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  );
};
