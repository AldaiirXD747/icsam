
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw, Save, Edit2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const StandingsManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("SUB-11");
  const [groupName, setGroupName] = useState("Grupo A");
  const [standings, setStandings] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["SUB-11", "SUB-13"]);
  const [groups, setGroups] = useState<string[]>(["Grupo A", "Grupo B"]);
  const [editMode, setEditMode] = useState(false);
  const [editedStandings, setEditedStandings] = useState<any[]>([]);
  const { toast } = useToast();

  // Carregar dados ao montar o componente
  useEffect(() => {
    fetchCategories();
    fetchGroups();
  }, []);

  // Carregar dados quando categoria ou grupo mudar
  useEffect(() => {
    fetchStandings();
  }, [category, groupName]);

  // Buscar categorias disponíveis
  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from("teams")
        .select("category")
        .order("category");
      
      if (data) {
        const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
        setCategories(uniqueCategories);
        if (uniqueCategories.length > 0) {
          setCategory(uniqueCategories[0]);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  // Buscar grupos disponíveis
  const fetchGroups = async () => {
    try {
      const { data } = await supabase
        .from("teams")
        .select("group_name")
        .order("group_name");
      
      if (data) {
        const uniqueGroups = Array.from(new Set(data.map(item => item.group_name)));
        setGroups(uniqueGroups);
        if (uniqueGroups.length > 0) {
          setGroupName(uniqueGroups[0]);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar grupos:", error);
    }
  };

  // Buscar dados da classificação
  const fetchStandings = async () => {
    setIsLoading(true);
    try {
      const { data: standingsData, error } = await supabase.rpc("get_standings", {
        p_category: category,
        p_group_name: groupName
      });
      
      if (error) {
        // Caso a função RPC não exista, tentar buscar diretamente da tabela
        const { data: tableData, error: tableError } = await supabase
          .from("standings")
          .select(`
            id,
            position,
            points,
            played,
            won,
            drawn,
            lost,
            goals_for,
            goals_against,
            goal_difference,
            team_id,
            teams (
              id,
              name,
              logo
            )
          `)
          .eq("category", category)
          .eq("group_name", groupName)
          .order("position");
        
        if (tableError) {
          console.error("Erro ao buscar dados da classificação:", tableError);
          toast({
            variant: "destructive",
            title: "Erro ao carregar classificação",
            description: "Não foi possível carregar os dados. Tente novamente mais tarde."
          });
          setStandings([]);
        } else {
          setStandings(tableData || []);
          setEditedStandings(tableData || []);
        }
      } else {
        setStandings(standingsData || []);
        setEditedStandings(standingsData || []);
      }
    } catch (error) {
      console.error("Erro ao buscar classificação:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar classificação",
        description: "Ocorreu um erro ao buscar os dados. Verifique o console para mais detalhes."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Recalcular classificação
  const recalculateStandings = async () => {
    setIsLoading(true);
    try {
      // Chamar a função RPC para recalcular a classificação
      const { error } = await supabase.rpc("recalculate_standings");
      
      if (error) {
        console.error("Erro ao recalcular classificação:", error);
        toast({
          variant: "destructive",
          title: "Erro ao recalcular",
          description: "Não foi possível recalcular a classificação. Tente novamente mais tarde."
        });
      } else {
        toast({
          title: "Classificação recalculada",
          description: "A tabela de classificação foi recalculada com sucesso."
        });
        // Atualizar dados após recalcular
        fetchStandings();
      }
    } catch (error) {
      console.error("Erro ao recalcular classificação:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Salvar alterações manuais
  const saveChanges = async () => {
    setIsLoading(true);
    try {
      let errorCount = 0;
      let successCount = 0;
      
      for (const standing of editedStandings) {
        // Extrair apenas os campos que precisam ser atualizados
        const updateData = {
          position: standing.position,
          points: standing.points,
          played: standing.played,
          won: standing.won,
          drawn: standing.drawn,
          lost: standing.lost,
          goals_for: standing.goals_for,
          goals_against: standing.goals_against,
          goal_difference: standing.goal_difference
        };
        
        // Atualizar no banco de dados
        const { error } = await supabase
          .from("standings")
          .update(updateData)
          .eq("id", standing.id);
        
        if (error) {
          console.error(`Erro ao atualizar classificação para o time ID ${standing.team_id}:`, error);
          errorCount++;
        } else {
          successCount++;
        }
      }
      
      if (errorCount === 0) {
        toast({
          title: "Alterações salvas",
          description: `${successCount} itens atualizados com sucesso.`
        });
        setEditMode(false);
        fetchStandings();
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao salvar alterações",
          description: `${errorCount} erros ocorreram. ${successCount} itens foram atualizados.`
        });
      }
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Manipular alterações nos campos editáveis
  const handleFieldChange = (index: number, field: string, value: number) => {
    const newStandings = [...editedStandings];
    
    // Atualizar o campo específico
    newStandings[index][field] = value;
    
    // Recalcular o saldo de gols automaticamente
    if (field === 'goals_for' || field === 'goals_against') {
      newStandings[index].goal_difference = 
        newStandings[index].goals_for - newStandings[index].goals_against;
    }
    
    setEditedStandings(newStandings);
  };

  return (
    <Card>
      <CardHeader className="bg-blue-50">
        <CardTitle className="text-2xl text-[#1a237e]">Gerenciamento de Classificação</CardTitle>
        <CardDescription>
          Visualize e edite manualmente a tabela de classificação
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Seletor de Categoria */}
            <div className="w-full md:w-auto">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Seletor de Grupo */}
            <div className="w-full md:w-auto">
              <Select value={groupName} onValueChange={setGroupName}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Grupo" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Botões de ação */}
            <div className="flex gap-2 ml-auto">
              {!editMode ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditMode(true)}
                    disabled={isLoading || standings.length === 0}
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={recalculateStandings} 
                    disabled={isLoading}
                    className="bg-[#1a237e] hover:bg-blue-800"
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Recalcular
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditMode(false);
                      setEditedStandings([...standings]);
                    }}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={saveChanges} 
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Salvar
                  </Button>
                </>
              )}
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-[#1a237e]" />
            </div>
          ) : standings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum dado de classificação encontrado para esta categoria e grupo.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-12">Pos</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-center">P</TableHead>
                    <TableHead className="text-center">J</TableHead>
                    <TableHead className="text-center">V</TableHead>
                    <TableHead className="text-center">E</TableHead>
                    <TableHead className="text-center">D</TableHead>
                    <TableHead className="text-center">GP</TableHead>
                    <TableHead className="text-center">GC</TableHead>
                    <TableHead className="text-center">SG</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(editMode ? editedStandings : standings).map((standing, index) => (
                    <TableRow key={standing.id}>
                      <TableCell>
                        {editMode ? (
                          <Input 
                            type="number" 
                            value={standing.position} 
                            onChange={(e) => handleFieldChange(index, 'position', parseInt(e.target.value))}
                            className="w-12 text-center"
                            min="1"
                          />
                        ) : (
                          <span className="font-semibold">{standing.position}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {standing.teams?.logo && (
                            <img 
                              src={standing.teams.logo} 
                              alt={standing.teams?.name} 
                              className="h-6 w-6 object-contain"
                            />
                          )}
                          <span className="font-medium">{standing.teams?.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {editMode ? (
                          <Input 
                            type="number" 
                            value={standing.points} 
                            onChange={(e) => handleFieldChange(index, 'points', parseInt(e.target.value))}
                            className="w-12 text-center"
                            min="0"
                          />
                        ) : (
                          <span className="font-bold">{standing.points}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {editMode ? (
                          <Input 
                            type="number" 
                            value={standing.played} 
                            onChange={(e) => handleFieldChange(index, 'played', parseInt(e.target.value))}
                            className="w-12 text-center"
                            min="0"
                          />
                        ) : (
                          standing.played
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {editMode ? (
                          <Input 
                            type="number" 
                            value={standing.won} 
                            onChange={(e) => handleFieldChange(index, 'won', parseInt(e.target.value))}
                            className="w-12 text-center"
                            min="0"
                          />
                        ) : (
                          standing.won
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {editMode ? (
                          <Input 
                            type="number" 
                            value={standing.drawn} 
                            onChange={(e) => handleFieldChange(index, 'drawn', parseInt(e.target.value))}
                            className="w-12 text-center"
                            min="0"
                          />
                        ) : (
                          standing.drawn
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {editMode ? (
                          <Input 
                            type="number" 
                            value={standing.lost} 
                            onChange={(e) => handleFieldChange(index, 'lost', parseInt(e.target.value))}
                            className="w-12 text-center"
                            min="0"
                          />
                        ) : (
                          standing.lost
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {editMode ? (
                          <Input 
                            type="number" 
                            value={standing.goals_for} 
                            onChange={(e) => handleFieldChange(index, 'goals_for', parseInt(e.target.value))}
                            className="w-12 text-center"
                            min="0"
                          />
                        ) : (
                          standing.goals_for
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {editMode ? (
                          <Input 
                            type="number" 
                            value={standing.goals_against} 
                            onChange={(e) => handleFieldChange(index, 'goals_against', parseInt(e.target.value))}
                            className="w-12 text-center"
                            min="0"
                          />
                        ) : (
                          standing.goals_against
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {editMode ? (
                          <span>{standing.goal_difference}</span>
                        ) : (
                          <span className={
                            standing.goal_difference > 0 ? "text-green-600" : 
                            standing.goal_difference < 0 ? "text-red-600" : ""
                          }>
                            {standing.goal_difference > 0 ? `+${standing.goal_difference}` : standing.goal_difference}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Legenda */}
          <div className="mt-4 text-sm text-gray-500">
            <p>P = Pontos, J = Jogos, V = Vitórias, E = Empates, D = Derrotas, GP = Gols Pró, GC = Gols Contra, SG = Saldo de Gols</p>
            <p className="mt-2 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-green-600" /> 
              A classificação é recalculada automaticamente após cada partida, mas também pode ser editada manualmente.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StandingsManagement;
