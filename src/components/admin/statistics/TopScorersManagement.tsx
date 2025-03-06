
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
import { TopScorer } from '@/types';
import StatisticsChart from './StatisticsChart';

interface TopScorersManagementProps {
  isLoading: boolean;
  topScorers: TopScorer[];
  setTopScorers: React.Dispatch<React.SetStateAction<TopScorer[]>>;
  filteredTopScorers: TopScorer[];
  selectedCategory: string;
  teams: {id: string, name: string, category: string}[];
  players: {id: string, name: string, team_id: string}[];
  championships: {id: string, name: string}[];
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
  const [isAddingScorerOpen, setIsAddingScorerOpen] = useState(false);
  const [isEditingScorerOpen, setIsEditingScorerOpen] = useState(false);
  const [selectedScorer, setSelectedScorer] = useState<TopScorer | null>(null);
  const [scorerForm, setScorerForm] = useState({
    playerId: '',
    teamId: '',
    goals: 0,
    category: '',
    championshipId: ''
  });

  const goalsChartData = filteredTopScorers.slice(0, 10).map(scorer => ({
    name: scorer.name,
    gols: scorer.goals,
    time: scorer.team,
  }));

  const handleAddScorer = async () => {
    if (!scorerForm.playerId || !scorerForm.teamId || scorerForm.goals <= 0 || !scorerForm.category) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('top_scorers')
        .insert({
          player_id: scorerForm.playerId,
          team_id: scorerForm.teamId,
          goals: scorerForm.goals,
          category: scorerForm.category,
          championship_id: scorerForm.championshipId || null
        })
        .select(`
          id,
          player_id,
          team_id,
          goals,
          category,
          championship_id,
          players(name),
          teams(name)
        `);

      if (error) throw error;

      if (data && data.length > 0) {
        const newScorer: TopScorer = {
          id: data[0].id,
          playerId: data[0].player_id,
          name: data[0].players?.name || 'Desconhecido',
          teamId: data[0].team_id,
          team: data[0].teams?.name || 'Time desconhecido',
          goals: data[0].goals,
          category: data[0].category,
          championshipId: data[0].championship_id
        };

        setTopScorers([...topScorers, newScorer]);
        
        toast({
          title: "Artilheiro adicionado",
          description: "O artilheiro foi adicionado com sucesso."
        });
        
        resetScorerForm();
        setIsAddingScorerOpen(false);
      }
    } catch (error) {
      console.error('Error adding top scorer:', error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar artilheiro",
        description: "Não foi possível adicionar o artilheiro."
      });
    }
  };

  const handleUpdateScorer = async () => {
    if (!selectedScorer) return;
    
    if (!scorerForm.playerId || !scorerForm.teamId || scorerForm.goals <= 0 || !scorerForm.category) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('top_scorers')
        .update({
          player_id: scorerForm.playerId,
          team_id: scorerForm.teamId,
          goals: scorerForm.goals,
          category: scorerForm.category,
          championship_id: scorerForm.championshipId || null
        })
        .eq('id', selectedScorer.id)
        .select(`
          id,
          player_id,
          team_id,
          goals,
          category,
          championship_id,
          players(name),
          teams(name)
        `);

      if (error) throw error;

      if (data && data.length > 0) {
        const updatedScorer: TopScorer = {
          id: data[0].id,
          playerId: data[0].player_id,
          name: data[0].players?.name || 'Desconhecido',
          teamId: data[0].team_id,
          team: data[0].teams?.name || 'Time desconhecido',
          goals: data[0].goals,
          category: data[0].category,
          championshipId: data[0].championship_id
        };

        setTopScorers(topScorers.map(scorer => 
          scorer.id === selectedScorer.id ? updatedScorer : scorer
        ));
        
        toast({
          title: "Artilheiro atualizado",
          description: "O artilheiro foi atualizado com sucesso."
        });
        
        setSelectedScorer(null);
        resetScorerForm();
        setIsEditingScorerOpen(false);
      }
    } catch (error) {
      console.error('Error updating top scorer:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar artilheiro",
        description: "Não foi possível atualizar o artilheiro."
      });
    }
  };

  const handleDeleteScorer = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este artilheiro?')) return;

    try {
      const { error } = await supabase
        .from('top_scorers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTopScorers(topScorers.filter(scorer => scorer.id !== id));
      
      toast({
        title: "Artilheiro removido",
        description: "O artilheiro foi removido com sucesso."
      });
    } catch (error) {
      console.error('Error deleting top scorer:', error);
      toast({
        variant: "destructive",
        title: "Erro ao remover artilheiro",
        description: "Não foi possível remover o artilheiro."
      });
    }
  };

  const editScorer = (scorer: TopScorer) => {
    setSelectedScorer(scorer);
    setScorerForm({
      playerId: scorer.playerId,
      teamId: scorer.teamId,
      goals: scorer.goals,
      category: scorer.category,
      championshipId: scorer.championshipId || ''
    });
    setIsEditingScorerOpen(true);
  };

  const resetScorerForm = () => {
    setScorerForm({
      playerId: '',
      teamId: '',
      goals: 0,
      category: '',
      championshipId: ''
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Artilheiros {selectedCategory !== 'all' ? `- ${selectedCategory}` : ''}</CardTitle>
          <Button 
            className="bg-[#1a237e] text-white hover:bg-blue-800"
            onClick={() => setIsAddingScorerOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Adicionar Artilheiro
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">
              Carregando dados de artilharia...
            </div>
          ) : filteredTopScorers.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              Não há dados de artilharia para esta categoria.
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
                        <th className="px-4 py-2 text-center">Gols</th>
                        <th className="px-4 py-2 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTopScorers.map((scorer, index) => (
                        <tr key={scorer.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{index + 1}</td>
                          <td className="px-4 py-3 font-medium">{scorer.name}</td>
                          <td className="px-4 py-3">{scorer.team}</td>
                          <td className="px-4 py-3 text-center">{scorer.category}</td>
                          <td className="px-4 py-3 text-center font-bold">{scorer.goals}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => editScorer(scorer)}
                                className="h-8 w-8 p-0"
                              >
                                <Pencil size={16} className="text-blue-600" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteScorer(scorer.id)}
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
                data={goalsChartData} 
                dataKey="gols" 
                fill="#1a237e" 
                name="Gols" 
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Top Scorer Dialog */}
      <Dialog open={isAddingScorerOpen} onOpenChange={setIsAddingScorerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Artilheiro</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="player">Jogador</Label>
              <Select onValueChange={(value) => setScorerForm({...scorerForm, playerId: value})}>
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
              <Select onValueChange={(value) => setScorerForm({...scorerForm, teamId: value})}>
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
              <Select onValueChange={(value) => setScorerForm({...scorerForm, category: value})}>
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
              <Select onValueChange={(value) => setScorerForm({...scorerForm, championshipId: value})}>
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
              <Label htmlFor="goals">Número de Gols</Label>
              <Input 
                id="goals" 
                type="number" 
                value={scorerForm.goals}
                onChange={(e) => setScorerForm({...scorerForm, goals: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetScorerForm();
              setIsAddingScorerOpen(false);
            }}>
              Cancelar
            </Button>
            <Button className="bg-[#1a237e]" onClick={handleAddScorer}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Top Scorer Dialog */}
      <Dialog open={isEditingScorerOpen} onOpenChange={setIsEditingScorerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Artilheiro</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="player">Jogador</Label>
              <Select 
                value={scorerForm.playerId} 
                onValueChange={(value) => setScorerForm({...scorerForm, playerId: value})}
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
                value={scorerForm.teamId} 
                onValueChange={(value) => setScorerForm({...scorerForm, teamId: value})}
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
                value={scorerForm.category} 
                onValueChange={(value) => setScorerForm({...scorerForm, category: value})}
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
                value={scorerForm.championshipId} 
                onValueChange={(value) => setScorerForm({...scorerForm, championshipId: value})}
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
              <Label htmlFor="goals">Número de Gols</Label>
              <Input 
                id="goals" 
                type="number" 
                value={scorerForm.goals}
                onChange={(e) => setScorerForm({...scorerForm, goals: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSelectedScorer(null);
              resetScorerForm();
              setIsEditingScorerOpen(false);
            }}>
              Cancelar
            </Button>
            <Button className="bg-[#1a237e]" onClick={handleUpdateScorer}>
              Atualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TopScorersManagement;
