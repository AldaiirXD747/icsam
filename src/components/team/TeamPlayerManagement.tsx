
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PlusCircle, Pencil, Trash2, User, Upload } from 'lucide-react';
import { MultiFileUpload, FileWithPreview } from '@/components/ui/multi-file-upload';

type Player = {
  id: string;
  name: string;
  number: number | null;
  position: string;
  photo: string | null;
  team_id: string;
};

type PlayerFormData = {
  name: string;
  number: string;
  position: string;
  photo: string;
};

const TeamPlayerManagement = ({ teamId }: { teamId: string }) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<PlayerFormData>({
    name: '',
    number: '',
    position: '',
    photo: ''
  });
  
  useEffect(() => {
    fetchPlayers();
  }, [teamId]);
  
  const fetchPlayers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('team_id', teamId)
        .order('name');
        
      if (error) throw error;
      
      setPlayers(data || []);
    } catch (error) {
      console.error('Error fetching players:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar jogadores",
        description: "Não foi possível carregar a lista de jogadores."
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
      name: '',
      number: '',
      position: '',
      photo: ''
    });
    setUploadedFiles([]);
  };

  const handleFilesChange = (files: FileWithPreview[]) => {
    setUploadedFiles(files);
  };

  const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `player-photos/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('player-photos')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('player-photos')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar foto",
        description: "Não foi possível fazer o upload da foto."
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleAddPlayer = async () => {
    if (!formData.name || !formData.position) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha o nome e a posição do jogador."
      });
      return;
    }
    
    try {
      let photoUrl = formData.photo;
      
      if (uploadedFiles.length > 0) {
        const uploadedUrl = await uploadPhoto(uploadedFiles[0].file);
        if (uploadedUrl) {
          photoUrl = uploadedUrl;
        }
      }
      
      const { data, error } = await supabase
        .from('players')
        .insert({
          name: formData.name,
          number: formData.number ? parseInt(formData.number) : null,
          position: formData.position,
          photo: photoUrl || null,
          team_id: teamId
        })
        .select();
        
      if (error) throw error;
      
      if (data) {
        setPlayers([...players, data[0]]);
        toast({
          title: "Jogador adicionado",
          description: "O jogador foi adicionado com sucesso."
        });
        resetForm();
        setActiveTab('list');
      }
    } catch (error) {
      console.error('Error adding player:', error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar jogador",
        description: "Não foi possível adicionar o jogador."
      });
    }
  };
  
  const handleUpdatePlayer = async () => {
    if (!selectedPlayer) return;
    
    if (!formData.name || !formData.position) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha o nome e a posição do jogador."
      });
      return;
    }
    
    try {
      let photoUrl = formData.photo;
      
      if (uploadedFiles.length > 0) {
        const uploadedUrl = await uploadPhoto(uploadedFiles[0].file);
        if (uploadedUrl) {
          photoUrl = uploadedUrl;
        }
      }
      
      const { data, error } = await supabase
        .from('players')
        .update({
          name: formData.name,
          number: formData.number ? parseInt(formData.number) : null,
          position: formData.position,
          photo: photoUrl || null
        })
        .eq('id', selectedPlayer.id)
        .select();
        
      if (error) throw error;
      
      if (data) {
        setPlayers(players.map(player => 
          player.id === selectedPlayer.id ? data[0] : player  
        ));
        toast({
          title: "Jogador atualizado",
          description: "O jogador foi atualizado com sucesso."
        });
        resetForm();
        setSelectedPlayer(null);
        setActiveTab('list');
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
  
  const handleDeletePlayer = async (playerId: string) => {
    if (!confirm("Tem certeza que deseja excluir este jogador?")) return;
    
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', playerId);
        
      if (error) throw error;
      
      setPlayers(players.filter(player => player.id !== playerId));
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
  
  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setFormData({
      name: player.name,
      number: player.number?.toString() || '',
      position: player.position,
      photo: player.photo || ''
    });
    setActiveTab('edit');
    setUploadedFiles([]);
  };
  
  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (player.number?.toString() || '').includes(searchTerm)
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a237e]">Jogadores do Time</h2>
        {activeTab === 'list' && (
          <Button 
            onClick={() => setActiveTab('add')}
            className="flex items-center gap-2 bg-[#1a237e] text-white hover:bg-blue-800"
          >
            <PlusCircle size={16} />
            Adicionar Jogador
          </Button>
        )}
      </div>
      
      {activeTab === 'list' && (
        <div className="space-y-4">
          <Input
            placeholder="Buscar jogadores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
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
                        <h3 className="font-bold">{player.name} {player.number && `#${player.number}`}</h3>
                        <div className="space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-white hover:text-[#1a237e] hover:bg-white"
                            onClick={() => handleEditPlayer(player)}
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
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
                          {player.photo ? (
                            <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                          ) : (
                            <User size={24} className="text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p><span className="font-semibold">Posição:</span> {player.position}</p>
                          <p><span className="font-semibold">Número:</span> {player.number || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
      
      {(activeTab === 'add' || activeTab === 'edit') && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-4 text-[#1a237e]">
              {activeTab === 'add' ? 'Adicionar Jogador' : 'Editar Jogador'}
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-1">Nome do Jogador *</Label>
                <Input 
                  id="playerName" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Ex: João Silva"
                />
              </div>
              
              <div>
                <Label htmlFor="playerNumber" className="block text-sm font-medium text-gray-700 mb-1">Número</Label>
                <Input 
                  id="playerNumber" 
                  name="number" 
                  type="number"
                  value={formData.number} 
                  onChange={handleInputChange} 
                  placeholder="Ex: 10"
                />
              </div>
              
              <div>
                <Label htmlFor="playerPosition" className="block text-sm font-medium text-gray-700 mb-1">Posição *</Label>
                <select
                  id="playerPosition"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input px-3 py-2"
                >
                  <option value="">Selecione uma posição</option>
                  <option value="Goleiro">Goleiro</option>
                  <option value="Zagueiro">Zagueiro</option>
                  <option value="Lateral">Lateral</option>
                  <option value="Volante">Volante</option>
                  <option value="Meio-Campo">Meio-Campo</option>
                  <option value="Atacante">Atacante</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label className="block text-sm font-medium text-gray-700">Foto do Jogador</Label>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="playerPhotoUpload" className="block text-sm font-medium text-gray-700 mb-1">
                      Upload de Foto
                    </Label>
                    <div className="max-w-md">
                      <MultiFileUpload 
                        onFilesChange={handleFilesChange} 
                        maxFiles={1} 
                      />
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <Label htmlFor="playerPhotoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                      Ou URL da Foto
                    </Label>
                    <Input 
                      id="playerPhotoUrl" 
                      name="photo" 
                      value={formData.photo} 
                      onChange={handleInputChange} 
                      placeholder="https://exemplo.com/foto.jpg"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-2 flex gap-2 justify-end">
                <Button variant="outline" onClick={() => {
                  resetForm();
                  setSelectedPlayer(null);
                  setActiveTab('list');
                }}>
                  Cancelar
                </Button>
                <Button 
                  onClick={activeTab === 'add' ? handleAddPlayer : handleUpdatePlayer} 
                  className="bg-[#1a237e] text-white hover:bg-blue-800"
                  disabled={isUploading}
                >
                  {isUploading ? "Enviando..." : activeTab === 'add' ? 'Adicionar Jogador' : 'Atualizar Jogador'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamPlayerManagement;
