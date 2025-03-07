
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Loader2, Save, Trophy, RefreshCw } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const StandingsManagement = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<string[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [standings, setStandings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [savingStanding, setSavingStanding] = useState<string | null>(null);

  // Carregar dados iniciais
  useEffect(() => {
    fetchData();
  }, []);

  // Atualizar dados quando mudar filtros
  useEffect(() => {
    fetchStandings();
  }, [selectedCategory, selectedGroup]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Primeiro, verificar se a tabela existe
      const { error: tableError } = await supabase.rpc('get_standings_table_exists');
      
      if (tableError) {
        // A tabela não existe, tentar criá-la
        await createStandingsTable();
      }
      
      // Buscar categorias e grupos
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('category, group_name')
        .order('category');
      
      if (teamsError) throw teamsError;
      
      // Extrair categorias e grupos únicos
      const uniqueCategories = new Set();
      const uniqueGroups = new Set();
      
      (teamsData || []).forEach(team => {
        if (team.category) uniqueCategories.add(team.category);
        if (team.group_name) uniqueGroups.add(team.group_name);
      });
      
      setCategories(Array.from(uniqueCategories) as string[]);
      setGroups(Array.from(uniqueGroups) as string[]);
      
      // Buscar classificação
      await fetchStandings();
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as categorias e grupos."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStandings = async () => {
    setIsLoading(true);
    try {
      // Construir a consulta base
      let query = supabase
        .from('standings')
        .select(`
          id, 
          team_id, 
          category, 
          group_name, 
          position, 
          points, 
          played, 
          won, 
          drawn, 
          lost, 
          goals_for, 
          goals_against, 
          goal_difference,
          teams:team_id (name, logo)
        `)
        .order('position');
      
      // Aplicar filtros
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }
      
      if (selectedGroup !== 'all') {
        query = query.eq('group_name', selectedGroup);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setStandings(data || []);
    } catch (error) {
      console.error('Erro ao carregar classificação:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar classificação",
        description: "Não foi possível carregar os dados de classificação."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createStandingsTable = async () => {
    try {
      // Criar a tabela standings
      await supabase.rpc('create_standings_table');
      toast({
        title: "Tabela criada com sucesso",
        description: "A tabela de classificação foi criada com sucesso."
      });
      return true;
    } catch (error) {
      console.error("Erro ao criar tabela standings:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar tabela",
        description: "Não foi possível criar a tabela de classificação."
      });
      return false;
    }
  };

  const handleStandingChange = (id: string, field: string, value: any) => {
    const newValue = field === 'position' ? parseInt(value) : parseInt(value);
    
    // Atualizar o estado local
    setStandings(standings.map(standing => {
      if (standing.id === id) {
        const updatedStanding = { ...standing, [field]: newValue };
        
        // Recalcular saldo de gols se necessário
        if (field === 'goals_for' || field === 'goals_against') {
          updatedStanding.goal_difference = updatedStanding.goals_for - updatedStanding.goals_against;
        }
        
        return updatedStanding;
      }
      return standing;
    }));
  };

  const saveStanding = async (standingId: string) => {
    setSavingStanding(standingId);
    
    try {
      const standingToUpdate = standings.find(s => s.id === standingId);
      
      if (!standingToUpdate) {
        throw new Error('Classificação não encontrada');
      }
      
      // Extrair apenas os campos necessários
      const { id, team_id, category, group_name, position, points, played, won, drawn, lost, goals_for, goals_against, goal_difference } = standingToUpdate;
      
      const { error } = await supabase
        .from('standings')
        .update({
          position,
          points,
          played,
          won,
          drawn,
          lost,
          goals_for,
          goals_against,
          goal_difference,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Classificação salva",
        description: "Dados atualizados com sucesso."
      });
    } catch (error) {
      console.error('Erro ao salvar classificação:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível atualizar a classificação."
      });
    } finally {
      setSavingStanding(null);
    }
  };

  const recalculateStandings = async () => {
    setLoadingRefresh(true);
    
    try {
      // Chamar a função para recalcular a classificação no backend
      const { error } = await supabase.rpc('recalculate_standings');
      
      if (error) throw error;
      
      toast({
        title: "Classificação recalculada",
        description: "Dados atualizados com base nas partidas."
      });
      
      // Recarregar a classificação
      await fetchStandings();
    } catch (error) {
      console.error('Erro ao recalcular classificação:', error);
      toast({
        variant: "destructive",
        title: "Erro ao recalcular",
        description: "Não foi possível recalcular a classificação."
      });
    } finally {
      setLoadingRefresh(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a237e]">Gerenciamento de Classificação</h2>
        
        <Button 
          onClick={recalculateStandings} 
          disabled={loadingRefresh}
          className="bg-[#1a237e] text-white hover:bg-blue-800"
        >
          {loadingRefresh ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Recalculando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Recalcular Classificação
            </>
          )}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Tabela de Classificação</CardTitle>
          <CardDescription>
            Visualize e edite a classificação dos times por categoria e grupo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-1">
                Categoria
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="group" className="block text-sm font-medium mb-1">
                Grupo
              </label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger id="group">
                  <SelectValue placeholder="Selecione um grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os grupos</SelectItem>
                  {groups.map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-[#1a237e]" />
            </div>
          ) : standings.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-md">
              <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">Nenhuma classificação encontrada para os filtros selecionados.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>
                  Classificação atualizada. Você pode editar os valores e salvar manualmente.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pos.</TableHead>
                    <TableHead>Time</TableHead>
                    {selectedCategory === 'all' && <TableHead>Categoria</TableHead>}
                    {selectedGroup === 'all' && <TableHead>Grupo</TableHead>}
                    <TableHead>P</TableHead>
                    <TableHead>J</TableHead>
                    <TableHead>V</TableHead>
                    <TableHead>E</TableHead>
                    <TableHead>D</TableHead>
                    <TableHead>GP</TableHead>
                    <TableHead>GC</TableHead>
                    <TableHead>SG</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {standings.map(standing => (
                    <TableRow key={standing.id}>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={standing.position} 
                          onChange={e => handleStandingChange(standing.id, 'position', e.target.value)}
                          className="w-14 text-center"
                          min={1}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {standing.teams?.logo && (
                            <img 
                              src={standing.teams.logo} 
                              alt={standing.teams?.name || 'Time'} 
                              className="w-6 h-6 object-contain"
                            />
                          )}
                          <span>{standing.teams?.name || 'Time desconhecido'}</span>
                        </div>
                      </TableCell>
                      {selectedCategory === 'all' && <TableCell>{standing.category}</TableCell>}
                      {selectedGroup === 'all' && <TableCell>{standing.group_name}</TableCell>}
                      <TableCell>
                        <Input 
                          type="number" 
                          value={standing.points} 
                          onChange={e => handleStandingChange(standing.id, 'points', e.target.value)}
                          className="w-14 text-center font-bold"
                          min={0}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={standing.played} 
                          onChange={e => handleStandingChange(standing.id, 'played', e.target.value)}
                          className="w-14 text-center"
                          min={0}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={standing.won} 
                          onChange={e => handleStandingChange(standing.id, 'won', e.target.value)}
                          className="w-14 text-center"
                          min={0}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={standing.drawn} 
                          onChange={e => handleStandingChange(standing.id, 'drawn', e.target.value)}
                          className="w-14 text-center"
                          min={0}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={standing.lost} 
                          onChange={e => handleStandingChange(standing.id, 'lost', e.target.value)}
                          className="w-14 text-center"
                          min={0}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={standing.goals_for} 
                          onChange={e => handleStandingChange(standing.id, 'goals_for', e.target.value)}
                          className="w-14 text-center"
                          min={0}
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={standing.goals_against} 
                          onChange={e => handleStandingChange(standing.id, 'goals_against', e.target.value)}
                          className="w-14 text-center"
                          min={0}
                        />
                      </TableCell>
                      <TableCell>{standing.goal_difference}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => saveStanding(standing.id)}
                          disabled={savingStanding === standing.id}
                          className="flex items-center"
                        >
                          {savingStanding === standing.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-1" />
                              Salvar
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StandingsManagement;
