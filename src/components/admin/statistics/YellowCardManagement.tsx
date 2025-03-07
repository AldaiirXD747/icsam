
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle, Save, Trash2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import StatisticsChart from './StatisticsChart';
import { YellowCardLeader } from '@/types';

interface YellowCardManagementProps {
  isLoading?: boolean;
  yellowCardLeaders?: YellowCardLeader[];
  setYellowCardLeaders?: React.Dispatch<React.SetStateAction<YellowCardLeader[]>>;
  filteredYellowCardLeaders?: YellowCardLeader[];
  selectedCategory?: string;
  teams?: { id: string, name: string }[];
  players?: { id: string, name: string, team_id: string }[];
  championships?: { id: string, name: string }[];
}

const YellowCardManagement: React.FC<YellowCardManagementProps> = ({
  isLoading,
  yellowCardLeaders,
  setYellowCardLeaders,
  filteredYellowCardLeaders,
  selectedCategory,
  teams,
  players,
  championships
}) => {
  const { toast } = useToast();
  const [category, setCategory] = useState<string>(selectedCategory || 'Sub-15');
  const [search, setSearch] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [cardsCount, setCardsCount] = useState<number>(1);
  const [editingLeaders, setEditingLeaders] = useState<YellowCardLeader[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Use the filtered yellow card leaders or create an empty array if nothing is available
  const leadersList = filteredYellowCardLeaders || [];

  useEffect(() => {
    if (filteredYellowCardLeaders) {
      setEditingLeaders([...filteredYellowCardLeaders]);
    }
  }, [filteredYellowCardLeaders]);

  // Filter players by selected team
  const filteredPlayers = players?.filter(player => 
    !selectedTeam || player.team_id === selectedTeam
  ) || [];

  const handleAddYellowCards = async () => {
    if (!selectedPlayer || !selectedTeam || cardsCount <= 0) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Selecione um jogador, um time e informe a quantidade de cartões."
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

    // First, check if this player already exists in the leaders list
    const existingLeader = editingLeaders.find(leader => 
      leader.playerId === selectedPlayer && 
      leader.category === category
    );

    setIsSaving(true);
    try {
      if (existingLeader) {
        // Update existing record
        const updatedCards = existingLeader.yellowCards + cardsCount;
        const { error } = await supabase
          .from('yellow_card_leaders')
          .update({ yellow_cards: updatedCards })
          .eq('id', existingLeader.id);

        if (error) throw error;

        // Update local state
        setEditingLeaders(prev => prev.map(leader => 
          leader.id === existingLeader.id 
            ? { ...leader, yellowCards: updatedCards } 
            : leader
        ));

        toast({
          title: "Cartões atualizados",
          description: `${cardsCount} cartões adicionados para ${player.name}.`
        });
      } else {
        // Create a new record
        const { data, error } = await supabase
          .from('yellow_card_leaders')
          .insert({
            player_id: player.id,
            team_id: team.id,
            yellow_cards: cardsCount,
            category: category,
            championship_id: null // Can be updated to selected championship if needed
          })
          .select()
          .single();

        if (error) throw error;

        // Add to local state
        const newLeader: YellowCardLeader = {
          id: data.id,
          playerId: player.id,
          teamId: team.id,
          name: player.name,
          team: team.name,
          yellowCards: cardsCount,
          category: category,
          championshipId: null
        };

        setEditingLeaders(prev => [...prev, newLeader]);

        toast({
          title: "Cartões adicionados",
          description: `${player.name} adicionado com ${cardsCount} cartões amarelos.`
        });
      }

      // Reset form
      setSelectedPlayer('');
      setCardsCount(1);
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

  const handleUpdateYellowCards = async (leader: YellowCardLeader, newCards: number) => {
    if (newCards < 0) {
      toast({
        variant: "destructive",
        title: "Valor inválido",
        description: "A quantidade de cartões não pode ser negativa."
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('yellow_card_leaders')
        .update({ yellow_cards: newCards })
        .eq('id', leader.id);

      if (error) throw error;

      // Update local state
      setEditingLeaders(prev => prev.map(l => 
        l.id === leader.id ? { ...l, yellowCards: newCards } : l
      ));

      toast({
        title: "Cartões atualizados",
        description: `Cartões de ${leader.name} atualizados para ${newCards}.`
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

  const handleDeleteLeader = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este registro de cartões?")) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('yellow_card_leaders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setEditingLeaders(prev => prev.filter(leader => leader.id !== id));

      toast({
        title: "Registro removido",
        description: "O registro de cartões foi removido com sucesso."
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
  const chartData = editingLeaders
    .filter(leader => 
      leader.name.toLowerCase().includes(search.toLowerCase()) &&
      (!selectedCategory || leader.category === selectedCategory)
    )
    .map(leader => ({
      name: leader.name,
      value: leader.yellowCards,
      team: leader.team
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-[#1a237e]">Gerenciamento de Cartões Amarelos</CardTitle>
        <CardDescription>Visualize e gerencie os líderes de cartões amarelos.</CardDescription>
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
          <CardTitle className="text-lg mb-4">Adicionar/Atualizar Cartões Amarelos</CardTitle>
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
              <Label htmlFor="cards">Quantidade de Cartões</Label>
              <Input 
                type="number" 
                id="cards" 
                min={1} 
                value={cardsCount}
                onChange={(e) => setCardsCount(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleAddYellowCards} 
                disabled={isSaving}
                className="w-full bg-[#1a237e] hover:bg-[#303f9f]"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {isSaving ? "Salvando..." : "Adicionar Cartões"}
              </Button>
            </div>
          </div>
        </Card>

        {chartData.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Estatísticas de Cartões Amarelos</h3>
            <div className="h-[400px]">
              <StatisticsChart 
                data={chartData.slice(0, 10)} // Show top 10 leaders
                dataKey="value" 
                name="Cartões Amarelos" 
                fill="#FFC107"
              />
            </div>
          </div>
        )}

        <ScrollArea className="h-[400px]">
          <div className="w-full">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left p-3 border-b">Nome</th>
                  <th className="text-left p-3 border-b">Time</th>
                  <th className="text-left p-3 border-b">Cartões</th>
                  <th className="text-left p-3 border-b">Ações</th>
                </tr>
              </thead>
              <tbody>
                {editingLeaders
                  .filter(leader => 
                    leader.name.toLowerCase().includes(search.toLowerCase()) &&
                    (!selectedCategory || leader.category === selectedCategory)
                  )
                  .sort((a, b) => b.yellowCards - a.yellowCards)
                  .map((leader) => (
                    <tr key={leader.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{leader.name}</td>
                      <td className="p-3">{leader.team}</td>
                      <td className="p-3">
                        <Input 
                          type="number" 
                          value={leader.yellowCards} 
                          min={0}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value)) {
                              handleUpdateYellowCards(leader, value);
                            }
                          }}
                          className="w-20"
                        />
                      </td>
                      <td className="p-3">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteLeader(leader.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default YellowCardManagement;
