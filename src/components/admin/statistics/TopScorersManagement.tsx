
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle, Save, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import StatisticsChart from './StatisticsChart';
import { TopScorer } from '@/types';

interface TopScorersManagementProps {
  isLoading?: boolean;
  topScorers?: TopScorer[];
  setTopScorers?: React.Dispatch<React.SetStateAction<TopScorer[]>>;
  filteredTopScorers?: TopScorer[];
  selectedCategory?: string;
  teams?: { id: string, name: string }[];
  players?: { id: string, name: string, team_id: string }[];
  championships?: { id: string, name: string }[];
}

const TopScorersManagement: React.FC<TopScorersManagementProps> = ({
  isLoading,
  topScorers,
  setTopScorers,
  filteredTopScorers,
  selectedCategory,
  teams,
  players,
  championships
}) => {
  const { toast } = useToast();
  const [category, setCategory] = useState<string>(selectedCategory || 'Sub-15');
  const [search, setSearch] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingScorers, setEditingScorers] = useState<TopScorer[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [goalsCount, setGoalsCount] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);

  // Use the filtered top scorers or create an empty array if nothing is available
  const scorersList = filteredTopScorers || [];

  useEffect(() => {
    if (filteredTopScorers) {
      setEditingScorers([...filteredTopScorers]);
    }
  }, [filteredTopScorers]);

  // Filter players by selected team
  const filteredPlayers = players?.filter(player => 
    !selectedTeam || player.team_id === selectedTeam
  ) || [];

  const handleAddGoals = async () => {
    if (!selectedPlayer || !selectedTeam || goalsCount <= 0) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Selecione um jogador, um time e informe a quantidade de gols."
      });
      return;
    }

    const player = players?.find(p => p.id === selectedPlayer);
    const team = teams?.find(t => t.id === selectedTeam);
    
    if (!player || !team) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Jogador ou time não encontrado."
      });
      return;
    }

    // First, check if this player already exists in the scorer list
    const existingScorer = editingScorers.find(scorer => 
      scorer.playerId === selectedPlayer && 
      scorer.category === category
    );

    setIsSaving(true);
    try {
      if (existingScorer) {
        // Update existing record
        const updatedGoals = existingScorer.goals + goalsCount;
        const { error } = await supabase
          .from('top_scorers')
          .update({ goals: updatedGoals })
          .eq('id', existingScorer.id);

        if (error) throw error;

        // Update local state
        setEditingScorers(prev => prev.map(scorer => 
          scorer.id === existingScorer.id 
            ? { ...scorer, goals: updatedGoals } 
            : scorer
        ));

        toast({
          title: "Gols atualizados",
          description: `${goalsCount} gols adicionados para ${player.name}.`
        });
      } else {
        // Create a new record
        const { data, error } = await supabase
          .from('top_scorers')
          .insert({
            player_id: player.id,
            team_id: team.id,
            goals: goalsCount,
            category: category,
            championship_id: null // Can be updated to selected championship if needed
          })
          .select()
          .single();

        if (error) throw error;

        // Add to local state
        const newScorer: TopScorer = {
          id: data.id,
          playerId: player.id,
          teamId: team.id,
          name: player.name,
          team: team.name,
          goals: goalsCount,
          category: category,
          championshipId: null
        };

        setEditingScorers(prev => [...prev, newScorer]);

        toast({
          title: "Artilheiro adicionado",
          description: `${player.name} adicionado com ${goalsCount} gols.`
        });
      }

      // Reset form
      setSelectedPlayer('');
      setGoalsCount(1);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error.message
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateGoals = async (scorer: TopScorer, newGoals: number) => {
    if (newGoals < 0) {
      toast({
        variant: "destructive",
        title: "Valor inválido",
        description: "A quantidade de gols não pode ser negativa."
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('top_scorers')
        .update({ goals: newGoals })
        .eq('id', scorer.id);

      if (error) throw error;

      // Update local state
      setEditingScorers(prev => prev.map(s => 
        s.id === scorer.id ? { ...s, goals: newGoals } : s
      ));

      toast({
        title: "Gols atualizados",
        description: `Gols de ${scorer.name} atualizados para ${newGoals}.`
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: error.message
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteScorer = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este artilheiro?")) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('top_scorers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setEditingScorers(prev => prev.filter(scorer => scorer.id !== id));

      toast({
        title: "Artilheiro removido",
        description: "O artilheiro foi removido com sucesso."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: error.message
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Fix the chart data format to properly match the StatisticsChart component requirements
  const chartData = editingScorers
    .filter(scorer => 
      scorer.name.toLowerCase().includes(search.toLowerCase()) &&
      (!selectedCategory || scorer.category === selectedCategory)
    )
    .map(scorer => ({
      name: scorer.name,
      value: scorer.goals,
      team: scorer.team
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-[#1a237e]">Artilheiros</CardTitle>
        <CardDescription>Gerencie os artilheiros por categoria e visualize estatísticas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sub-11">Sub-11</SelectItem>
                <SelectItem value="Sub-13">Sub-13</SelectItem>
                <SelectItem value="Sub-15">Sub-15</SelectItem>
                <SelectItem value="Sub-17">Sub-17</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="search">Pesquisar</Label>
            <Input
              type="search"
              id="search"
              placeholder="Pesquisar por nome"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Card className="p-4 border border-gray-200">
          <CardTitle className="text-lg mb-4">Adicionar/Atualizar Gols</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="team">Time</Label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os times</SelectItem>
                  {teams?.map((team) => (
                    <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="player">Jogador</Label>
              <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o jogador" />
                </SelectTrigger>
                <SelectContent>
                  {filteredPlayers.map((player) => (
                    <SelectItem key={player.id} value={player.id}>{player.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="goals">Quantidade de Gols</Label>
              <Input 
                type="number" 
                id="goals" 
                min={1} 
                value={goalsCount}
                onChange={(e) => setGoalsCount(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleAddGoals} 
                disabled={isSaving}
                className="w-full bg-[#1a237e] hover:bg-[#303f9f]"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {isSaving ? "Salvando..." : "Adicionar Gols"}
              </Button>
            </div>
          </div>
        </Card>

        {chartData.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Estatísticas de Gols</h3>
            <div className="h-[400px]">
              <StatisticsChart 
                data={chartData.slice(0, 10)} // Show top 10 scorers
                dataKey="value" 
                name="Gols" 
                fill="#4CAF50" 
              />
            </div>
          </div>
        )}

        <Table>
          <TableCaption>Lista de artilheiros</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Gols</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editingScorers
              .filter(scorer => 
                scorer.name.toLowerCase().includes(search.toLowerCase()) &&
                (!selectedCategory || scorer.category === selectedCategory)
              )
              .sort((a, b) => b.goals - a.goals)
              .map((scorer) => (
                <TableRow key={scorer.id}>
                  <TableCell className="font-medium">{scorer.name}</TableCell>
                  <TableCell>{scorer.team}</TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      value={scorer.goals} 
                      min={0}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value)) {
                          handleUpdateGoals(scorer, value);
                        }
                      }}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteScorer(scorer.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopScorersManagement;
