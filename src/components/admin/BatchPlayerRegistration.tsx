
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

type Team = {
  id: string;
  name: string;
  category: string;
};

const BatchPlayerRegistration = () => {
  const [inputData, setInputData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const { data, error } = await supabase.from('teams').select('*').order('name');
      if (error) throw error;
      setTeams(data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar times",
        description: "Não foi possível carregar a lista de times."
      });
    }
  };

  const parsePlayerNames = (input: string): string[] => {
    return input
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.includes('SUB -') && !line.includes('ATLETAS'));
  };

  const handleSubmit = async () => {
    if (!selectedTeam) {
      toast({
        variant: "destructive",
        title: "Time não selecionado",
        description: "Por favor, selecione um time antes de cadastrar jogadores."
      });
      return;
    }

    if (!selectedCategory) {
      toast({
        variant: "destructive",
        title: "Categoria não selecionada",
        description: "Por favor, selecione uma categoria antes de cadastrar jogadores."
      });
      return;
    }

    const playerNames = parsePlayerNames(inputData);
    
    if (playerNames.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhum jogador encontrado",
        description: "Não foi possível identificar nomes de jogadores no texto inserido."
      });
      return;
    }

    // Confirm before proceeding
    if (!window.confirm(`Cadastrar ${playerNames.length} jogadores para o time selecionado?`)) {
      return;
    }

    try {
      setIsLoading(true);
      
      const players = playerNames.map(name => ({
        name,
        team_id: selectedTeam,
        position: 'Não especificada', // Default position
        category: selectedCategory
      }));

      const { data, error } = await supabase
        .from('players')
        .insert(players)
        .select();

      if (error) throw error;

      toast({
        title: "Jogadores cadastrados",
        description: `${players.length} jogadores foram cadastrados com sucesso.`
      });
      
      setInputData('');
    } catch (error) {
      console.error('Error registering players:', error);
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar jogadores",
        description: "Ocorreu um erro ao cadastrar os jogadores no sistema."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastro em Lote de Jogadores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um time" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name} ({team.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomes dos Jogadores (um por linha)
            </label>
            <Textarea
              placeholder="Gabriel Lopes Gonçalves&#10;Jorge Herbet Rodrigues dos Santos&#10;David Luan Volinês de Carvalho"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              rows={15}
            />
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !inputData.trim() || !selectedTeam || !selectedCategory}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Cadastrar Jogadores'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchPlayerRegistration;
