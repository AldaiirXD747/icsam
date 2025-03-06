
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, Edit, Trash2, Search, Upload, User, 
  Activity, FileText
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Tipos
interface PlayerStats {
  games: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

interface Player {
  id: number;
  teamId: number;
  name: string;
  number: number;
  position: string;
  age: number;
  photo?: string;
  stats: PlayerStats;
}

interface PlayerManagementProps {
  teamId: number;
  teamName: string;
}

const positions = [
  "Goleiro",
  "Lateral Direito",
  "Lateral Esquerdo",
  "Zagueiro",
  "Volante",
  "Meio Campo",
  "Meia Atacante",
  "Ponta Direita",
  "Ponta Esquerda",
  "Centroavante",
  "Atacante"
];

const PlayerManagement: React.FC<PlayerManagementProps> = ({ teamId, teamName }) => {
  const { toast } = useToast();
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 101,
      teamId: 1,
      name: 'Miguel Santos',
      number: 10,
      position: 'Meia Atacante',
      age: 13,
      photo: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      stats: {
        games: 12,
        goals: 8,
        assists: 6,
        yellowCards: 2,
        redCards: 0,
      },
    },
    {
      id: 102,
      teamId: 1,
      name: 'João Pedro',
      number: 9,
      position: 'Atacante',
      age: 13,
      photo: 'https://images.unsplash.com/photo-1560761098-22010169a486?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      stats: {
        games: 12,
        goals: 5,
        assists: 3,
        yellowCards: 1,
        redCards: 0,
      },
    },
  ].filter(player => player.teamId === teamId));

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [isEditingPlayer, setIsEditingPlayer] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showPlayerStats, setShowPlayerStats] = useState(false);
  
  const [newPlayer, setNewPlayer] = useState<Partial<Player & {teamId: number}>>({
    teamId,
    name: '',
    number: 0,
    position: '',
    age: 0,
    photo: '',
    stats: {
      games: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
    }
  });
  
  // Gerenciar adição de jogador
  const handleAddPlayer = () => {
    // Validação básica
    if (!newPlayer.name || !newPlayer.position || !newPlayer.number) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Simulação de adição ao banco de dados
    const playerToAdd = {
      ...newPlayer,
      id: Date.now(), // Simulando um ID único
      teamId,
      stats: newPlayer.stats || {
        games: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
      }
    } as Player;
    
    setPlayers([...players, playerToAdd]);
    setNewPlayer({
      teamId,
      name: '',
      number: 0,
      position: '',
      age: 0,
      photo: '',
      stats: {
        games: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
      }
    });
    setIsAddingPlayer(false);
    
    toast({
      title: "Sucesso",
      description: "Jogador adicionado com sucesso!",
      duration: 3000,
    });
  };
  
  // Gerenciar edição de jogador
  const handleEditPlayer = () => {
    if (!selectedPlayer) return;
    
    const updatedPlayers = players.map(player => 
      player.id === selectedPlayer.id ? { ...selectedPlayer } : player
    );
    
    setPlayers(updatedPlayers);
    setIsEditingPlayer(false);
    
    toast({
      title: "Sucesso",
      description: "Jogador atualizado com sucesso!",
      duration: 3000,
    });
  };
  
  // Gerenciar remoção de jogador
  const handleDeletePlayer = (id: number) => {
    const updatedPlayers = players.filter(player => player.id !== id);
    setPlayers(updatedPlayers);
    
    toast({
      title: "Sucesso",
      description: "Jogador removido com sucesso!",
      duration: 3000,
    });
  };
  
  // Filtrar jogadores com base na pesquisa
  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.position.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (showPlayerStats && selectedPlayer) {
    return (
      <div>
        <Button 
          variant="outline" 
          className="mb-4"
          onClick={() => {
            setShowPlayerStats(false);
            setSelectedPlayer(null);
          }}
        >
          Voltar para Jogadores
        </Button>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                {selectedPlayer.photo ? (
                  <img 
                    src={selectedPlayer.photo} 
                    alt={selectedPlayer.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-full h-full p-4 text-gray-400" />
                )}
              </div>
              <div>
                <CardTitle>{selectedPlayer.name}</CardTitle>
                <CardDescription>
                  #{selectedPlayer.number} • {selectedPlayer.position} • {selectedPlayer.age} anos
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="stats">
              <TabsList className="mb-4">
                <TabsTrigger value="stats">Estatísticas</TabsTrigger>
                <TabsTrigger value="history">Histórico</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stats">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-gray-500">Jogos</p>
                        <p className="text-2xl font-bold">{selectedPlayer.stats.games}</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-gray-500">Gols</p>
                        <p className="text-2xl font-bold">{selectedPlayer.stats.goals}</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-gray-500">Assistências</p>
                        <p className="text-2xl font-bold">{selectedPlayer.stats.assists}</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-gray-500">Cartões Amarelos</p>
                        <p className="text-2xl font-bold text-yellow-500">{selectedPlayer.stats.yellowCards}</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-sm text-gray-500">Cartões Vermelhos</p>
                        <p className="text-2xl font-bold text-red-500">{selectedPlayer.stats.redCards}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="font-medium mb-3">Atualizar Estatísticas</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="update-games">Jogos</Label>
                          <Input 
                            id="update-games" 
                            type="number" 
                            value={selectedPlayer.stats.games} 
                            onChange={(e) => setSelectedPlayer({
                              ...selectedPlayer,
                              stats: {
                                ...selectedPlayer.stats,
                                games: parseInt(e.target.value) || 0
                              }
                            })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="update-goals">Gols</Label>
                          <Input 
                            id="update-goals" 
                            type="number" 
                            value={selectedPlayer.stats.goals}
                            onChange={(e) => setSelectedPlayer({
                              ...selectedPlayer,
                              stats: {
                                ...selectedPlayer.stats,
                                goals: parseInt(e.target.value) || 0
                              }
                            })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="update-assists">Assistências</Label>
                          <Input 
                            id="update-assists" 
                            type="number" 
                            value={selectedPlayer.stats.assists}
                            onChange={(e) => setSelectedPlayer({
                              ...selectedPlayer,
                              stats: {
                                ...selectedPlayer.stats,
                                assists: parseInt(e.target.value) || 0
                              }
                            })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="update-yellow">Cartões Amarelos</Label>
                          <Input 
                            id="update-yellow" 
                            type="number" 
                            value={selectedPlayer.stats.yellowCards}
                            onChange={(e) => setSelectedPlayer({
                              ...selectedPlayer,
                              stats: {
                                ...selectedPlayer.stats,
                                yellowCards: parseInt(e.target.value) || 0
                              }
                            })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="update-red">Cartões Vermelhos</Label>
                          <Input 
                            id="update-red" 
                            type="number" 
                            value={selectedPlayer.stats.redCards}
                            onChange={(e) => setSelectedPlayer({
                              ...selectedPlayer,
                              stats: {
                                ...selectedPlayer.stats,
                                redCards: parseInt(e.target.value) || 0
                              }
                            })}
                          />
                        </div>
                      </div>
                      <Button 
                        className="mt-4"
                        onClick={handleEditPlayer}
                      >
                        Salvar Alterações
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <FileText className="mx-auto h-12 w-12 text-gray-300" />
                      <h3 className="mt-4 text-lg font-medium">Histórico não disponível</h3>
                      <p className="mt-2 text-gray-500">
                        O histórico detalhado de partidas do jogador será implementado em breve.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-[#1a237e]">
            Jogadores do {teamName}
          </CardTitle>
          <CardDescription>
            Gerencie os jogadores do time, adicione novos atletas ou atualize estatísticas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Buscar jogador..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isAddingPlayer} onOpenChange={setIsAddingPlayer}>
              <DialogTrigger asChild>
                <Button className="bg-[#1a237e] hover:bg-[#0d1442]">
                  <PlusCircle size={16} className="mr-2" />
                  Adicionar Jogador
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Jogador</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes do novo jogador para o time {teamName}.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nome*
                    </Label>
                    <Input
                      id="name"
                      value={newPlayer.name}
                      onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="number" className="text-right">
                      Número*
                    </Label>
                    <Input
                      id="number"
                      type="number"
                      value={newPlayer.number || ''}
                      onChange={(e) => setNewPlayer({...newPlayer, number: parseInt(e.target.value) || 0})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="position" className="text-right">
                      Posição*
                    </Label>
                    <Select 
                      onValueChange={(value) => setNewPlayer({...newPlayer, position: value})}
                      value={newPlayer.position}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione uma posição" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map(pos => (
                          <SelectItem key={pos} value={pos}>
                            {pos}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="age" className="text-right">
                      Idade
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      value={newPlayer.age || ''}
                      onChange={(e) => setNewPlayer({...newPlayer, age: parseInt(e.target.value) || 0})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="photo" className="text-right">
                      Foto
                    </Label>
                    <div className="col-span-3 flex gap-2">
                      <Input
                        id="photo"
                        value={newPlayer.photo || ''}
                        onChange={(e) => setNewPlayer({...newPlayer, photo: e.target.value})}
                        className="flex-grow"
                        placeholder="URL da foto"
                      />
                      <Button type="button" variant="outline" className="shrink-0">
                        <Upload size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddingPlayer(false)}>
                    Cancelar
                  </Button>
                  <Button type="button" onClick={handleAddPlayer}>
                    Adicionar Jogador
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {filteredPlayers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlayers.map(player => (
                <Card key={player.id} className="overflow-hidden">
                  <div className="p-4 flex items-center gap-4 border-b">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                      {player.photo ? (
                        <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{player.name}</h3>
                      <p className="text-sm text-gray-500">#{player.number} • {player.position}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-500">Jogos</p>
                        <p className="font-medium">{player.stats.games}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-500">Gols</p>
                        <p className="font-medium">{player.stats.goals}</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-500">Assistências</p>
                        <p className="font-medium">{player.stats.assists}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
                    <Dialog open={isEditingPlayer && selectedPlayer?.id === player.id} onOpenChange={(open) => {
                      setIsEditingPlayer(open);
                      if (!open) setSelectedPlayer(null);
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedPlayer(player);
                            setIsEditingPlayer(true);
                          }}
                        >
                          <Edit size={14} className="mr-1" />
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        {selectedPlayer && (
                          <>
                            <DialogHeader>
                              <DialogTitle>Editar Jogador</DialogTitle>
                              <DialogDescription>
                                Atualize as informações do jogador {selectedPlayer.name}.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">
                                  Nome
                                </Label>
                                <Input
                                  id="edit-name"
                                  value={selectedPlayer.name}
                                  onChange={(e) => setSelectedPlayer({...selectedPlayer, name: e.target.value})}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-number" className="text-right">
                                  Número
                                </Label>
                                <Input
                                  id="edit-number"
                                  type="number"
                                  value={selectedPlayer.number}
                                  onChange={(e) => setSelectedPlayer({
                                    ...selectedPlayer, 
                                    number: parseInt(e.target.value) || 0
                                  })}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-position" className="text-right">
                                  Posição
                                </Label>
                                <Select 
                                  value={selectedPlayer.position}
                                  onValueChange={(value) => setSelectedPlayer({...selectedPlayer, position: value})}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione uma posição" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {positions.map(pos => (
                                      <SelectItem key={pos} value={pos}>
                                        {pos}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              {/* Resto do formulário similar ao adicionar */}
                            </div>
                            <DialogFooter>
                              <Button type="button" variant="outline" onClick={() => setIsEditingPlayer(false)}>
                                Cancelar
                              </Button>
                              <Button type="button" onClick={handleEditPlayer}>
                                Salvar Alterações
                              </Button>
                            </DialogFooter>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleDeletePlayer(player.id)}
                    >
                      <Trash2 size={14} className="mr-1" />
                      Excluir
                    </Button>
                    <Button 
                      size="sm"
                      variant="default"
                      onClick={() => {
                        setSelectedPlayer(player);
                        setShowPlayerStats(true);
                      }}
                    >
                      <Activity size={14} className="mr-1" />
                      Estatísticas
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-lg bg-gray-50">
              <User size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum jogador encontrado</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Tente outro termo de pesquisa ou adicione um novo jogador.' : 'Comece adicionando um novo jogador.'}
              </p>
              <Button 
                onClick={() => setIsAddingPlayer(true)}
                className="bg-[#1a237e] hover:bg-[#0d1442]"
              >
                <PlusCircle size={16} className="mr-2" />
                Adicionar Novo Jogador
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerManagement;
