
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { YellowCardLeader } from '@/types';
import StatisticsChart from './StatisticsChart';

interface YellowCardManagementProps {
  isLoading: boolean;
  yellowCardLeaders: YellowCardLeader[];
  setYellowCardLeaders: React.Dispatch<React.SetStateAction<YellowCardLeader[]>>;
  filteredYellowCardLeaders: YellowCardLeader[];
  selectedCategory: string;
  teams: {id: string, name: string, category: string}[];
  players: {id: string, name: string, team_id: string}[];
  championships: {id: string, name: string}[];
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
  const [isAddingCardLeaderOpen, setIsAddingCardLeaderOpen] = useState(false);
  const [isEditingCardLeaderOpen, setIsEditingCardLeaderOpen] = useState(false);
  const [selectedCardLeader, setSelectedCardLeader] = useState<YellowCardLeader | null>(null);
  const [cardLeaderForm, setCardLeaderForm] = useState({
    playerId: '',
    teamId: '',
    yellowCards: 0,
    category: '',
    championshipId: ''
  });

  const cardsChartData = filteredYellowCardLeaders.slice(0, 10).map(leader => ({
    name: leader.name,
    cartões: leader.yellowCards,
    time: leader.team,
  }));

  const handleAddCardLeader = async () => {
    if (!cardLeaderForm.playerId || !cardLeaderForm.teamId || cardLeaderForm.yellowCards <= 0 || !cardLeaderForm.category) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('yellow_card_leaders')
        .insert({
          player_id: cardLeaderForm.playerId,
          team_id: cardLeaderForm.teamId,
          yellow_cards: cardLeaderForm.yellowCards,
          category: cardLeaderForm.category,
          championship_id: cardLeaderForm.championshipId || null
        })
        .select(`
          id,
          player_id,
          team_id,
          yellow_cards,
          category,
          championship_id,
          players(name),
          teams(name)
        `);

      if (error) throw error;

      if (data && data.length > 0) {
        const newCardLeader: YellowCardLeader = {
          id: data[0].id,
          playerId: data[0].player_id,
          name: data[0].players?.name || 'Desconhecido',
          teamId: data[0].team_id,
          team: data[0].teams?.name || 'Time desconhecido',
          yellowCards: data[0].yellow_cards,
          category: data[0].category,
          championshipId: data[0].championship_id
        };

        setYellowCardLeaders([...yellowCardLeaders, newCardLeader]);
        
        toast({
          title: "Líder de cartões adicionado",
          description: "O jogador foi adicionado à lista de cartões com sucesso."
        });
        
        resetCardLeaderForm();
        setIsAddingCardLeaderOpen(false);
      }
    } catch (error) {
      console.error('Error adding yellow card leader:', error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar jogador",
        description: "Não foi possível adicionar o jogador à lista de cartões."
      });
    }
  };

  const handleUpdateCardLeader = async () => {
    if (!selectedCardLeader) return;
    
    if (!cardLeaderForm.playerId || !cardLeaderForm.teamId || cardLeaderForm.yellowCards <= 0 || !cardLeaderForm.category) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('yellow_card_leaders')
        .update({
          player_id: cardLeaderForm.playerId,
          team_id: cardLeaderForm.teamId,
          yellow_cards: cardLeaderForm.yellowCards,
          category: cardLeaderForm.category,
          championship_id: cardLeaderForm.championshipId || null
        })
        .eq('id', selectedCardLeader.id)
        .select(`
          id,
          player_id,
          team_id,
          yellow_cards,
          category,
          championship_id,
          players(name),
          teams(name)
        `);

      if (error) throw error;

      if (data && data.length > 0) {
        const updatedCardLeader: YellowCardLeader = {
          id: data[0].id,
          playerId: data[0].player_id,
          name: data[0].players?.name || 'Desconhecido',
          teamId: data[0].team_id,
          team: data[0].teams?.name || 'Time desconhecido',
          yellowCards: data[0].yellow_cards,
          category: data[0].category,
          championshipId: data[0].championship_id
        };

        setYellowCardLeaders(yellowCardLeaders.map(leader => 
          leader.id === selectedCardLeader.id ? updatedCardLeader : leader
        ));
        
        toast({
          title: "Dados atualizados",
          description: "Os cartões do jogador foram atualizados com sucesso."
        });
        
        setSelectedCardLeader(null);
        resetCardLeaderForm();
        setIsEditingCardLeaderOpen(false);
      }
    } catch (error) {
      console.error('Error updating yellow card leader:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar dados",
        description: "Não foi possível atualizar os cartões do jogador."
      });
    }
  };

  const handleDeleteCardLeader = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este jogador da lista de cartões?')) return;

    try {
      const { error } = await supabase
        .from('yellow_card_leaders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setYellowCardLeaders(yellowCardLeaders.filter(leader => leader.id !== id));
      
      toast({
        title: "Jogador removido",
        description: "O jogador foi removido da lista de cartões com sucesso."
      });
    } catch (error) {
      console.error('Error deleting yellow card leader:', error);
      toast({
        variant: "destructive",
        title: "Erro ao remover jogador",
        description: "Não foi possível remover o jogador da lista de cartões."
      });
    }
  };

  const editCardLeader = (leader: YellowCardLeader) => {
    setSelectedCardLeader(leader);
    setCardLeaderForm({
      playerId: leader.playerId,
      teamId: leader.teamId,
      yellowCards: leader.yellowCards,
      category: leader.category,
      championshipId: leader.championshipId || ''
    });
    setIsEditingCardLeaderOpen(true);
  };

  const resetCardLeaderForm = () => {
    setCardLeaderForm({
      playerId: '',
      teamId: '',
      yellowCards: 0,
      category: '',
      championshipId: ''
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Cartões Amarelos {selectedCategory !== 'all' ? `- ${selectedCategory}` : ''}</CardTitle>
          <Button 
            className="bg-[#1a237e] text-white hover:bg-blue-800"
            onClick={() => setIsAddingCardLeaderOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Adicionar Jogador
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">
              Carregando dados de cartões...
            </div>
          ) : filteredYellowCardLeaders.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              Não há dados de cartões para esta categoria.
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Pos.</th>
                        <th className="px-4 py-2 text-left">Jogador</th>
                        <th className="px-4 py-2 text-left">Time</th>
                        <th className="px-4 py-2 text-center">Categoria</th>
                        <th className="px-4 py-2 text-center">Cartões</th>
                        <th className="px-4 py-2 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredYellowCardLeaders.map((leader, index) => (
                        <tr key={leader.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{index + 1}</td>
                          <td className="px-4 py-3 font-medium">{leader.name}</td>
                          <td className="px-4 py-3">{leader.team}</td>
                          <td className="px-4 py-3 text-center">{leader.category}</td>
                          <td className="px-4 py-3 text-center font-bold">{leader.yellowCards}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => editCardLeader(leader)}
                                className="h-8 w-8 p-0"
                              >
                                <Pencil size={16} className="text-blue-600" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteCardLeader(leader.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 size={16} className="text-red-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <StatisticsChart 
                data={cardsChartData} 
                dataKey="cartões" 
                fill="#FFC107" 
                name="Cartões Amarelos" 
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Yellow Card Leader Dialog */}
      <Dialog open={isAddingCardLeaderOpen} onOpenChange={setIsAddingCardLeaderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Jogador à Lista de Cartões</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="player">Jogador</Label>
              <Select onValueChange={(value) => setCardLeaderForm({...cardLeaderForm, playerId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um jogador" />
                </SelectTrigger>
                <SelectContent>
                  {players.map(player => (
                    <SelectItem key={player.id} value={player.id}>{player.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="team">Time</Label>
              <Select onValueChange={(value) => setCardLeaderForm({...cardLeaderForm, teamId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um time" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>{team.name} ({team.category})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select onValueChange={(value) => setCardLeaderForm({...cardLeaderForm, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUB-11">SUB-11</SelectItem>
                  <SelectItem value="SUB-13">SUB-13</SelectItem>
                  <SelectItem value="SUB-15">SUB-15</SelectItem>
                  <SelectItem value="SUB-17">SUB-17</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="championship">Campeonato (opcional)</Label>
              <Select onValueChange={(value) => setCardLeaderForm({...cardLeaderForm, championshipId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um campeonato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {championships.map(championship => (
                    <SelectItem key={championship.id} value={championship.id}>{championship.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="yellowCards">Número de Cartões Amarelos</Label>
              <Input 
                id="yellowCards" 
                type="number" 
                value={cardLeaderForm.yellowCards}
                onChange={(e) => setCardLeaderForm({...cardLeaderForm, yellowCards: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetCardLeaderForm();
              setIsAddingCardLeaderOpen(false);
            }}>
              Cancelar
            </Button>
            <Button className="bg-[#1a237e]" onClick={handleAddCardLeader}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Yellow Card Leader Dialog */}
      <Dialog open={isEditingCardLeaderOpen} onOpenChange={setIsEditingCardLeaderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cartões do Jogador</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="player">Jogador</Label>
              <Select 
                value={cardLeaderForm.playerId} 
                onValueChange={(value) => setCardLeaderForm({...cardLeaderForm, playerId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um jogador" />
                </SelectTrigger>
                <SelectContent>
                  {players.map(player => (
                    <SelectItem key={player.id} value={player.id}>{player.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="team">Time</Label>
              <Select 
                value={cardLeaderForm.teamId} 
                onValueChange={(value) => setCardLeaderForm({...cardLeaderForm, teamId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um time" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>{team.name} ({team.category})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select 
                value={cardLeaderForm.category} 
                onValueChange={(value) => setCardLeaderForm({...cardLeaderForm, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUB-11">SUB-11</SelectItem>
                  <SelectItem value="SUB-13">SUB-13</SelectItem>
                  <SelectItem value="SUB-15">SUB-15</SelectItem>
                  <SelectItem value="SUB-17">SUB-17</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="championship">Campeonato (opcional)</Label>
              <Select 
                value={cardLeaderForm.championshipId} 
                onValueChange={(value) => setCardLeaderForm({...cardLeaderForm, championshipId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um campeonato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  {championships.map(championship => (
                    <SelectItem key={championship.id} value={championship.id}>{championship.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="yellowCards">Número de Cartões Amarelos</Label>
              <Input 
                id="yellowCards" 
                type="number" 
                value={cardLeaderForm.yellowCards}
                onChange={(e) => setCardLeaderForm({...cardLeaderForm, yellowCards: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSelectedCardLeader(null);
              resetCardLeaderForm();
              setIsEditingCardLeaderOpen(false);
            }}>
              Cancelar
            </Button>
            <Button className="bg-[#1a237e]" onClick={handleUpdateCardLeader}>
              Atualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default YellowCardManagement;
