
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, Pencil, Trash2, Users, UserPlus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
// Remove Separator import since it's not available

// Mock data
const mockTeams = [
  { id: 1, name: 'Flamengo', category: 'SUB-11', group: 'A', logo: 'https://placehold.co/200x200?text=Logo' },
  { id: 2, name: 'Vasco', category: 'SUB-11', group: 'B', logo: 'https://placehold.co/200x200?text=Logo' },
  { id: 3, name: 'Fluminense', category: 'SUB-13', group: 'A', logo: 'https://placehold.co/200x200?text=Logo' },
];

const mockPlayers = [
  { id: 1, name: 'Carlos Silva', position: 'Atacante', teamId: 1, photo: 'https://placehold.co/200x200?text=Jogador' },
  { id: 2, name: 'Rafael Oliveira', position: 'Goleiro', teamId: 1, photo: 'https://placehold.co/200x200?text=Jogador' },
  { id: 3, name: 'João Pedro', position: 'Zagueiro', teamId: 2, photo: 'https://placehold.co/200x200?text=Jogador' },
];

const TeamManagement = () => {
  const [teams, setTeams] = useState(mockTeams);
  const [players, setPlayers] = useState(mockPlayers);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('list');
  const [playerManagementMode, setPlayerManagementMode] = useState<'list' | 'add' | 'edit'>('list');
  const { toast } = useToast();

  // Team form states
  const [teamName, setTeamName] = useState('');
  const [teamCategory, setTeamCategory] = useState('');
  const [teamGroup, setTeamGroup] = useState('');
  const [teamLogo, setTeamLogo] = useState('');

  // Player form states
  const [playerName, setPlayerName] = useState('');
  const [playerPosition, setPlayerPosition] = useState('');
  const [playerTeamId, setPlayerTeamId] = useState<number | null>(null);
  const [playerPhoto, setPlayerPhoto] = useState('');

  const handleAddTeam = () => {
    if (!teamName || !teamCategory || !teamGroup) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const newTeam = {
      id: teams.length > 0 ? Math.max(...teams.map(t => t.id)) + 1 : 1,
      name: teamName,
      category: teamCategory,
      group: teamGroup,
      logo: teamLogo || 'https://placehold.co/200x200?text=Logo'
    };

    setTeams([...teams, newTeam]);
    resetTeamForm();
    setActiveTab('list');
    
    toast({
      title: "Sucesso",
      description: "Time adicionado com sucesso!",
    });
  };

  const handleUpdateTeam = () => {
    if (!selectedTeam) return;
    
    if (!teamName || !teamCategory || !teamGroup) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const updatedTeams = teams.map(team => 
      team.id === selectedTeam.id 
      ? {
          ...team,
          name: teamName,
          category: teamCategory,
          group: teamGroup,
          logo: teamLogo || team.logo
        }
      : team
    );

    setTeams(updatedTeams);
    resetTeamForm();
    setSelectedTeam(null);
    setActiveTab('list');
    
    toast({
      title: "Sucesso",
      description: "Time atualizado com sucesso!",
    });
  };

  const handleDeleteTeam = (teamId: number) => {
    // Check if team has players
    const teamHasPlayers = players.some(player => player.teamId === teamId);
    
    if (teamHasPlayers) {
      toast({
        title: "Ação não permitida",
        description: "Este time possui jogadores cadastrados. Remova os jogadores primeiro.",
        variant: "destructive"
      });
      return;
    }
    
    setTeams(teams.filter(team => team.id !== teamId));
    
    toast({
      title: "Sucesso",
      description: "Time removido com sucesso!",
    });
  };

  const handleEditTeam = (team: any) => {
    setSelectedTeam(team);
    setTeamName(team.name);
    setTeamCategory(team.category);
    setTeamGroup(team.group);
    setTeamLogo(team.logo);
    setActiveTab('edit');
  };

  const resetTeamForm = () => {
    setTeamName('');
    setTeamCategory('');
    setTeamGroup('');
    setTeamLogo('');
  };

  const handleAddPlayer = () => {
    if (!playerName || !playerPosition || !playerTeamId) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const newPlayer = {
      id: players.length > 0 ? Math.max(...players.map(p => p.id)) + 1 : 1,
      name: playerName,
      position: playerPosition,
      teamId: playerTeamId,
      photo: playerPhoto || 'https://placehold.co/200x200?text=Jogador'
    };

    setPlayers([...players, newPlayer]);
    resetPlayerForm();
    setPlayerManagementMode('list');
    
    toast({
      title: "Sucesso",
      description: "Jogador adicionado com sucesso!",
    });
  };

  const handleUpdatePlayer = () => {
    if (!selectedPlayer) return;
    
    if (!playerName || !playerPosition || !playerTeamId) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const updatedPlayers = players.map(player => 
      player.id === selectedPlayer.id 
      ? {
          ...player,
          name: playerName,
          position: playerPosition,
          teamId: playerTeamId,
          photo: playerPhoto || player.photo
        }
      : player
    );

    setPlayers(updatedPlayers);
    resetPlayerForm();
    setSelectedPlayer(null);
    setPlayerManagementMode('list');
    
    toast({
      title: "Sucesso",
      description: "Jogador atualizado com sucesso!",
    });
  };

  const handleDeletePlayer = (playerId: number) => {
    setPlayers(players.filter(player => player.id !== playerId));
    
    toast({
      title: "Sucesso",
      description: "Jogador removido com sucesso!",
    });
  };

  const handleEditPlayer = (player: any) => {
    setSelectedPlayer(player);
    setPlayerName(player.name);
    setPlayerPosition(player.position);
    setPlayerTeamId(player.teamId);
    setPlayerPhoto(player.photo);
    setPlayerManagementMode('edit');
  };

  const resetPlayerForm = () => {
    setPlayerName('');
    setPlayerPosition('');
    setPlayerTeamId(null);
    setPlayerPhoto('');
  };

  return (
    <div className="space-y-8">
      <Tabs defaultValue="teams" className="w-full">
        <TabsList>
          <TabsTrigger value="teams" className="flex items-center gap-2">
            <Users size={16} />
            <span>Times</span>
          </TabsTrigger>
          <TabsTrigger value="players" className="flex items-center gap-2">
            <UserPlus size={16} />
            <span>Jogadores</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="teams" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-blue-primary">Gerenciamento de Times</h2>
            {activeTab === 'list' && (
              <Button 
                onClick={() => setActiveTab('add')}
                className="flex items-center gap-2"
              >
                <PlusCircle size={16} />
                Adicionar Novo Time
              </Button>
            )}
          </div>
          
          {activeTab === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map(team => (
                <Card key={team.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-blue-primary text-white p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold">{team.name}</h3>
                        <div className="space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-white hover:text-blue-primary hover:bg-white"
                            onClick={() => handleEditTeam(team)}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-white hover:text-blue-primary hover:bg-white"
                            onClick={() => handleDeleteTeam(team.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center space-x-4">
                        <img src={team.logo} alt={team.name} className="w-16 h-16 object-cover rounded" />
                        <div>
                          <p><span className="font-semibold">Categoria:</span> {team.category}</p>
                          <p><span className="font-semibold">Grupo:</span> {team.group}</p>
                          <p><span className="font-semibold">Jogadores:</span> {players.filter(p => p.teamId === team.id).length}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {teams.length === 0 && (
                <div className="col-span-full text-center p-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Nenhum time cadastrado ainda.</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'add' && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4 text-blue-primary">Adicionar Novo Time</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">Nome do Time *</label>
                    <Input 
                      id="teamName" 
                      value={teamName} 
                      onChange={(e) => setTeamName(e.target.value)} 
                      placeholder="Ex: Flamengo"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="teamCategory" className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                    <Input 
                      id="teamCategory" 
                      value={teamCategory} 
                      onChange={(e) => setTeamCategory(e.target.value)} 
                      placeholder="Ex: SUB-11"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="teamGroup" className="block text-sm font-medium text-gray-700 mb-1">Grupo *</label>
                    <Input 
                      id="teamGroup" 
                      value={teamGroup} 
                      onChange={(e) => setTeamGroup(e.target.value)} 
                      placeholder="Ex: A"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="teamLogo" className="block text-sm font-medium text-gray-700 mb-1">URL do Logo</label>
                    <Input 
                      id="teamLogo" 
                      value={teamLogo} 
                      onChange={(e) => setTeamLogo(e.target.value)} 
                      placeholder="https://exemplo.com/logo.png"
                    />
                  </div>
                  
                  <div className="pt-2 flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => {
                      resetTeamForm();
                      setActiveTab('list');
                    }}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddTeam}>
                      Adicionar Time
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'edit' && selectedTeam && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4 text-blue-primary">Editar Time</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-1">Nome do Time *</label>
                    <Input 
                      id="teamName" 
                      value={teamName} 
                      onChange={(e) => setTeamName(e.target.value)} 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="teamCategory" className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                    <Input 
                      id="teamCategory" 
                      value={teamCategory} 
                      onChange={(e) => setTeamCategory(e.target.value)} 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="teamGroup" className="block text-sm font-medium text-gray-700 mb-1">Grupo *</label>
                    <Input 
                      id="teamGroup" 
                      value={teamGroup} 
                      onChange={(e) => setTeamGroup(e.target.value)} 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="teamLogo" className="block text-sm font-medium text-gray-700 mb-1">URL do Logo</label>
                    <Input 
                      id="teamLogo" 
                      value={teamLogo} 
                      onChange={(e) => setTeamLogo(e.target.value)} 
                    />
                  </div>
                  
                  <div className="pt-2 flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => {
                      resetTeamForm();
                      setSelectedTeam(null);
                      setActiveTab('list');
                    }}>
                      Cancelar
                    </Button>
                    <Button onClick={handleUpdateTeam}>
                      Atualizar Time
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="players" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-blue-primary">Gerenciamento de Jogadores</h2>
            {playerManagementMode === 'list' && (
              <Button 
                onClick={() => setPlayerManagementMode('add')}
                className="flex items-center gap-2"
              >
                <PlusCircle size={16} />
                Adicionar Novo Jogador
              </Button>
            )}
          </div>
          
          {playerManagementMode === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map(player => {
                const playerTeam = teams.find(t => t.id === player.teamId);
                return (
                  <Card key={player.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="bg-blue-primary text-white p-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-bold">{player.name}</h3>
                          <div className="space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-white hover:text-blue-primary hover:bg-white"
                              onClick={() => handleEditPlayer(player)}
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-white hover:text-blue-primary hover:bg-white"
                              onClick={() => handleDeletePlayer(player.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center space-x-4">
                          <img src={player.photo} alt={player.name} className="w-16 h-16 object-cover rounded-full" />
                          <div>
                            <p><span className="font-semibold">Posição:</span> {player.position}</p>
                            <p><span className="font-semibold">Time:</span> {playerTeam?.name || 'N/A'}</p>
                            <p><span className="font-semibold">Categoria:</span> {playerTeam?.category || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {players.length === 0 && (
                <div className="col-span-full text-center p-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Nenhum jogador cadastrado ainda.</p>
                </div>
              )}
            </div>
          )}
          
          {playerManagementMode === 'add' && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4 text-blue-primary">Adicionar Novo Jogador</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">Nome do Jogador *</label>
                    <Input 
                      id="playerName" 
                      value={playerName} 
                      onChange={(e) => setPlayerName(e.target.value)} 
                      placeholder="Ex: João Silva"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="playerPosition" className="block text-sm font-medium text-gray-700 mb-1">Posição *</label>
                    <Input 
                      id="playerPosition" 
                      value={playerPosition} 
                      onChange={(e) => setPlayerPosition(e.target.value)} 
                      placeholder="Ex: Atacante"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="playerTeam" className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                    <select 
                      id="playerTeam" 
                      value={playerTeamId || ''} 
                      onChange={(e) => setPlayerTeamId(Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Selecione um time</option>
                      {teams.map(team => (
                        <option key={team.id} value={team.id}>
                          {team.name} ({team.category})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="playerPhoto" className="block text-sm font-medium text-gray-700 mb-1">URL da Foto</label>
                    <Input 
                      id="playerPhoto" 
                      value={playerPhoto} 
                      onChange={(e) => setPlayerPhoto(e.target.value)} 
                      placeholder="https://exemplo.com/foto.png"
                    />
                  </div>
                  
                  <div className="pt-2 flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => {
                      resetPlayerForm();
                      setPlayerManagementMode('list');
                    }}>
                      Cancelar
                    </Button>
                    <Button onClick={handleAddPlayer}>
                      Adicionar Jogador
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {playerManagementMode === 'edit' && selectedPlayer && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4 text-blue-primary">Editar Jogador</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">Nome do Jogador *</label>
                    <Input 
                      id="playerName" 
                      value={playerName} 
                      onChange={(e) => setPlayerName(e.target.value)} 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="playerPosition" className="block text-sm font-medium text-gray-700 mb-1">Posição *</label>
                    <Input 
                      id="playerPosition" 
                      value={playerPosition} 
                      onChange={(e) => setPlayerPosition(e.target.value)} 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="playerTeam" className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                    <select 
                      id="playerTeam" 
                      value={playerTeamId || ''} 
                      onChange={(e) => setPlayerTeamId(Number(e.target.value))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Selecione um time</option>
                      {teams.map(team => (
                        <option key={team.id} value={team.id}>
                          {team.name} ({team.category})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="playerPhoto" className="block text-sm font-medium text-gray-700 mb-1">URL da Foto</label>
                    <Input 
                      id="playerPhoto" 
                      value={playerPhoto} 
                      onChange={(e) => setPlayerPhoto(e.target.value)} 
                    />
                  </div>
                  
                  <div className="pt-2 flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => {
                      resetPlayerForm();
                      setSelectedPlayer(null);
                      setPlayerManagementMode('list');
                    }}>
                      Cancelar
                    </Button>
                    <Button onClick={handleUpdatePlayer}>
                      Atualizar Jogador
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamManagement;
