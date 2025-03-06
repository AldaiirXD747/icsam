
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Pencil, Trash2, User, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

type Player = {
  id: string;
  name: string;
  position: string;
  number: number | null;
  photo: string | null;
  team_id: string;
  team_name?: string;
  team_logo?: string;
  team_category?: string;
};

type Team = {
  id: string;
  name: string;
  logo: string | null;
  category: string;
  group_name: string;
};

const PlayerManagement = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    number: "",
    photo: "",
    team_id: ""
  });

  // Fetch players and teams data from Supabase
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('name');

      if (teamsError) throw teamsError;
      setTeams(teamsData || []);

      // Fetch players with team information
      const { data: playersData, error: playersError } = await supabase
        .from('players')
        .select(`
          *,
          teams:team_id (
            name,
            logo,
            category
          )
        `)
        .order('name');

      if (playersError) throw playersError;
      
      // Transform data to include team information directly in player objects
      const transformedPlayers = playersData?.map(player => ({
        ...player,
        team_name: player.teams?.name,
        team_logo: player.teams?.logo,
        team_category: player.teams?.category
      })) || [];
      
      setPlayers(transformedPlayers);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os jogadores e times."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      position: "",
      number: "",
      photo: "",
      team_id: ""
    });
  };

  const handleCreatePlayer = async () => {
    if (!formData.name || !formData.position || !formData.team_id) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, posição e time."
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('players')
        .insert([{
          name: formData.name,
          position: formData.position,
          number: formData.number ? parseInt(formData.number) : null,
          photo: formData.photo || null,
          team_id: formData.team_id
        }])
        .select(`
          *,
          teams:team_id (
            name,
            logo,
            category
          )
        `);

      if (error) throw error;

      if (data && data.length > 0) {
        const newPlayer = {
          ...data[0],
          team_name: data[0].teams?.name,
          team_logo: data[0].teams?.logo,
          team_category: data[0].teams?.category
        };
        
        setPlayers([...players, newPlayer]);
        
        toast({
          title: "Jogador adicionado",
          description: "O jogador foi adicionado com sucesso."
        });
        
        setIsCreating(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating player:', error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar jogador",
        description: "Não foi possível adicionar o jogador."
      });
    }
  };

  const handleUpdatePlayer = async () => {
    if (!selectedPlayer) return;
    
    if (!formData.name || !formData.position || !formData.team_id) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, posição e time."
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('players')
        .update({
          name: formData.name,
          position: formData.position,
          number: formData.number ? parseInt(formData.number) : null,
          photo: formData.photo || null,
          team_id: formData.team_id
        })
        .eq('id', selectedPlayer.id)
        .select(`
          *,
          teams:team_id (
            name,
            logo,
            category
          )
        `);

      if (error) throw error;

      if (data && data.length > 0) {
        const updatedPlayer = {
          ...data[0],
          team_name: data[0].teams?.name,
          team_logo: data[0].teams?.logo,
          team_category: data[0].teams?.category
        };
        
        setPlayers(players.map(player => 
          player.id === selectedPlayer.id ? updatedPlayer : player
        ));
        
        toast({
          title: "Jogador atualizado",
          description: "O jogador foi atualizado com sucesso."
        });
        
        setIsEditing(false);
        setSelectedPlayer(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error updating player:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar jogador",
        description: "Não foi possível atualizar o jogador."
      });
    }
  };

  const handleDeletePlayer = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este jogador?")) return;

    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPlayers(players.filter(player => player.id !== id));
      
      toast({
        title: "Jogador removido",
        description: "O jogador foi removido com sucesso."
      });
    } catch (error) {
      console.error('Error deleting player:', error);
      toast({
        variant: "destructive",
        title: "Erro ao remover jogador",
        description: "Não foi possível remover o jogador."
      });
    }
  };

  const openEditDialog = (player: Player) => {
    setSelectedPlayer(player);
    setFormData({
      name: player.name,
      position: player.position,
      number: player.number?.toString() || "",
      photo: player.photo || "",
      team_id: player.team_id
    });
    setIsEditing(true);
  };

  // Filter players based on search term and team filter
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = filterTeam === "all" || player.team_id === filterTeam;
    return matchesSearch && matchesTeam;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a237e]">Gerenciamento de Jogadores</h2>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="bg-[#1a237e] text-white hover:bg-blue-800">
              <PlusCircle size={16} className="mr-2" /> Novo Jogador
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Jogador</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nome</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nome do jogador"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="position" className="text-sm font-medium">Posição</label>
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  placeholder="Ex: Atacante, Goleiro, etc."
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="number" className="text-sm font-medium">Número</label>
                <Input
                  id="number"
                  name="number"
                  type="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  placeholder="Número da camisa"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="team_id" className="text-sm font-medium">Time</label>
                <select
                  id="team_id"
                  name="team_id"
                  value={formData.team_id}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Selecione um time</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name} ({team.category})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="photo" className="text-sm font-medium">URL da Foto</label>
                <Input
                  id="photo"
                  name="photo"
                  value={formData.photo}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/foto.png"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setIsCreating(false);
                resetForm();
              }}>Cancelar</Button>
              <Button onClick={handleCreatePlayer} className="bg-[#1a237e] text-white hover:bg-blue-800">
                Adicionar Jogador
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1">
            <Input
              placeholder="Buscar jogadores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              className="rounded-md border border-input px-3 py-2 text-sm"
            >
              <option value="all">Todos os Times</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name} ({team.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Carregando jogadores...</p>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum jogador encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlayers.map(player => (
              <Card key={player.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-[#1a237e] text-white p-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold">{player.name}</h3>
                      <div className="space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-white hover:text-[#1a237e] hover:bg-white"
                          onClick={() => openEditDialog(player)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-white hover:text-[#1a237e] hover:bg-white"
                          onClick={() => handleDeletePlayer(player.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 relative w-16 h-16 overflow-hidden rounded-full bg-gray-100">
                        {player.photo ? (
                          <img 
                            src={player.photo} 
                            alt={player.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <User size={32} className="text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p><span className="font-semibold">Posição:</span> {player.position}</p>
                        {player.number && <p><span className="font-semibold">Número:</span> {player.number}</p>}
                        <div className="flex items-center mt-1">
                          <span className="font-semibold mr-2">Time:</span>
                          <div className="flex items-center">
                            {player.team_logo && (
                              <img 
                                src={player.team_logo} 
                                alt={player.team_name} 
                                className="w-5 h-5 object-contain mr-1"
                              />
                            )}
                            <span>{player.team_name} ({player.team_category})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isEditing} onOpenChange={(open) => {
        if (!open) {
          setIsEditing(false);
          setSelectedPlayer(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Jogador</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-name" className="text-sm font-medium">Nome</label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nome do jogador"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-position" className="text-sm font-medium">Posição</label>
              <Input
                id="edit-position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="Ex: Atacante, Goleiro, etc."
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-number" className="text-sm font-medium">Número</label>
              <Input
                id="edit-number"
                name="number"
                type="number"
                value={formData.number}
                onChange={handleInputChange}
                placeholder="Número da camisa"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-team_id" className="text-sm font-medium">Time</label>
              <select
                id="edit-team_id"
                name="team_id"
                value={formData.team_id}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Selecione um time</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name} ({team.category})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-photo" className="text-sm font-medium">URL da Foto</label>
              <Input
                id="edit-photo"
                name="photo"
                value={formData.photo}
                onChange={handleInputChange}
                placeholder="https://exemplo.com/foto.png"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => {
              setIsEditing(false);
              setSelectedPlayer(null);
              resetForm();
            }}>Cancelar</Button>
            <Button onClick={handleUpdatePlayer} className="bg-[#1a237e] text-white hover:bg-blue-800">
              Atualizar Jogador
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlayerManagement;
