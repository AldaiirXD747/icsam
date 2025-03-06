
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, Edit, Trash2, Users, Search, ArrowLeft, Upload
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
import { Separator } from "@/components/ui/toast";
import PlayerManagement from './PlayerManagement';

// Tipos
interface Team {
  id: number;
  name: string;
  logo: string;
  categories: string[];
  group: string;
  foundingYear: string;
  location: string;
  coach: string;
  stadium?: string;
  colors?: string;
}

const TeamManagement = () => {
  const { toast } = useToast();
  const [teams, setTeams] = useState<Team[]>([
    {
      id: 1,
      name: 'Guerreiros',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/9.png',
      categories: ['SUB-11', 'SUB-13'],
      group: 'B',
      foundingYear: '2020',
      location: 'Santa Maria, DF',
      coach: 'Carlos Silva',
    },
    {
      id: 2,
      name: 'Furacão',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png',
      categories: ['SUB-11', 'SUB-13'],
      group: 'A',
      foundingYear: '2018',
      location: 'Gama, DF',
      coach: 'Roberto Alves',
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPlayers, setShowPlayers] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isAddingTeam, setIsAddingTeam] = useState(false);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [newTeam, setNewTeam] = useState<Partial<Team>>({
    name: '',
    logo: '',
    categories: [],
    group: '',
    foundingYear: '',
    location: '',
    coach: '',
    stadium: '',
    colors: ''
  });
  
  // Gerenciar adição de time
  const handleAddTeam = () => {
    // Validação básica
    if (!newTeam.name || !newTeam.group) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Simulação de adição ao banco de dados
    const teamToAdd = {
      ...newTeam,
      id: teams.length + 1,
      categories: newTeam.categories || [],
    } as Team;
    
    setTeams([...teams, teamToAdd]);
    setNewTeam({
      name: '',
      logo: '',
      categories: [],
      group: '',
      foundingYear: '',
      location: '',
      coach: '',
      stadium: '',
      colors: ''
    });
    setIsAddingTeam(false);
    
    toast({
      title: "Sucesso",
      description: "Time adicionado com sucesso!",
      duration: 3000,
    });
  };
  
  // Gerenciar edição de time
  const handleEditTeam = () => {
    if (!selectedTeam) return;
    
    const updatedTeams = teams.map(team => 
      team.id === selectedTeam.id ? { ...selectedTeam } : team
    );
    
    setTeams(updatedTeams);
    setIsEditingTeam(false);
    
    toast({
      title: "Sucesso",
      description: "Time atualizado com sucesso!",
      duration: 3000,
    });
  };
  
  // Gerenciar remoção de time
  const handleDeleteTeam = (id: number) => {
    const updatedTeams = teams.filter(team => team.id !== id);
    setTeams(updatedTeams);
    
    toast({
      title: "Sucesso",
      description: "Time removido com sucesso!",
      duration: 3000,
    });
  };
  
  // Filtrar times com base na pesquisa
  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Ir para gerenciamento de jogadores de um time específico
  const handleManagePlayers = (team: Team) => {
    setSelectedTeam(team);
    setShowPlayers(true);
  };
  
  if (showPlayers && selectedTeam) {
    return (
      <div>
        <Button 
          variant="outline" 
          className="mb-4 flex items-center gap-2"
          onClick={() => {
            setShowPlayers(false);
            setSelectedTeam(null);
          }}
        >
          <ArrowLeft size={16} />
          Voltar para Times
        </Button>
        <PlayerManagement teamId={selectedTeam.id} teamName={selectedTeam.name} />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-[#1a237e]">Gerenciar Times</CardTitle>
          <CardDescription>
            Adicione, edite ou remova times do sistema. Você também pode gerenciar os jogadores de cada time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Buscar time..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isAddingTeam} onOpenChange={setIsAddingTeam}>
              <DialogTrigger asChild>
                <Button className="bg-[#1a237e] hover:bg-[#0d1442]">
                  <PlusCircle size={16} className="mr-2" />
                  Adicionar Novo Time
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Time</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes do novo time. Os campos com * são obrigatórios.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nome *
                    </Label>
                    <Input
                      id="name"
                      value={newTeam.name}
                      onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="logo" className="text-right">
                      Logo URL
                    </Label>
                    <div className="col-span-3 flex gap-2">
                      <Input
                        id="logo"
                        value={newTeam.logo}
                        onChange={(e) => setNewTeam({...newTeam, logo: e.target.value})}
                        className="flex-grow"
                        placeholder="URL da imagem"
                      />
                      <Button type="button" variant="outline" className="shrink-0">
                        <Upload size={16} />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="group" className="text-right">
                      Grupo *
                    </Label>
                    <Select 
                      onValueChange={(value) => setNewTeam({...newTeam, group: value})}
                      value={newTeam.group}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecione um grupo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Grupo A</SelectItem>
                        <SelectItem value="B">Grupo B</SelectItem>
                        <SelectItem value="C">Grupo C</SelectItem>
                        <SelectItem value="D">Grupo D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="categories" className="text-right">
                      Categorias
                    </Label>
                    <div className="col-span-3 flex flex-wrap gap-2">
                      {['SUB-11', 'SUB-13', 'SUB-15', 'SUB-17'].map(cat => (
                        <Button
                          key={cat}
                          type="button"
                          variant={newTeam.categories?.includes(cat) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const categories = newTeam.categories || [];
                            if (categories.includes(cat)) {
                              setNewTeam({
                                ...newTeam, 
                                categories: categories.filter(c => c !== cat)
                              });
                            } else {
                              setNewTeam({...newTeam, categories: [...categories, cat]});
                            }
                          }}
                        >
                          {cat}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="foundingYear" className="text-right">
                      Ano de Fundação
                    </Label>
                    <Input
                      id="foundingYear"
                      value={newTeam.foundingYear}
                      onChange={(e) => setNewTeam({...newTeam, foundingYear: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Localização
                    </Label>
                    <Input
                      id="location"
                      value={newTeam.location}
                      onChange={(e) => setNewTeam({...newTeam, location: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="coach" className="text-right">
                      Técnico
                    </Label>
                    <Input
                      id="coach"
                      value={newTeam.coach}
                      onChange={(e) => setNewTeam({...newTeam, coach: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stadium" className="text-right">
                      Estádio
                    </Label>
                    <Input
                      id="stadium"
                      value={newTeam.stadium}
                      onChange={(e) => setNewTeam({...newTeam, stadium: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="colors" className="text-right">
                      Cores
                    </Label>
                    <Input
                      id="colors"
                      value={newTeam.colors}
                      onChange={(e) => setNewTeam({...newTeam, colors: e.target.value})}
                      className="col-span-3"
                      placeholder="Ex: Azul e Branco"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddingTeam(false)}>
                    Cancelar
                  </Button>
                  <Button type="button" onClick={handleAddTeam}>
                    Adicionar Time
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {filteredTeams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTeams.map(team => (
                <Card key={team.id} className="overflow-hidden">
                  <div className="p-4 flex items-center gap-4 border-b">
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                      {team.logo ? (
                        <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
                      ) : (
                        <Users size={24} className="text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{team.name}</h3>
                      <p className="text-sm text-gray-500">Grupo {team.group}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {team.categories?.map(cat => (
                        <span key={cat} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {cat}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Técnico: {team.coach || 'Não informado'}</p>
                      <p>Localização: {team.location || 'Não informada'}</p>
                    </div>
                  </div>
                  <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedTeam(team);
                            setIsEditingTeam(true);
                          }}
                        >
                          <Edit size={14} className="mr-1" />
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        {selectedTeam && (
                          <>
                            <DialogHeader>
                              <DialogTitle>Editar Time</DialogTitle>
                              <DialogDescription>
                                Atualize as informações do time {selectedTeam.name}.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">
                                  Nome
                                </Label>
                                <Input
                                  id="edit-name"
                                  value={selectedTeam.name}
                                  onChange={(e) => setSelectedTeam({...selectedTeam, name: e.target.value})}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-logo" className="text-right">
                                  Logo URL
                                </Label>
                                <div className="col-span-3 flex gap-2">
                                  <Input
                                    id="edit-logo"
                                    value={selectedTeam.logo}
                                    onChange={(e) => setSelectedTeam({...selectedTeam, logo: e.target.value})}
                                    className="flex-grow"
                                  />
                                  <Button type="button" variant="outline" className="shrink-0">
                                    <Upload size={16} />
                                  </Button>
                                </div>
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-group" className="text-right">
                                  Grupo
                                </Label>
                                <Select 
                                  value={selectedTeam.group}
                                  onValueChange={(value) => setSelectedTeam({...selectedTeam, group: value})}
                                >
                                  <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione um grupo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="A">Grupo A</SelectItem>
                                    <SelectItem value="B">Grupo B</SelectItem>
                                    <SelectItem value="C">Grupo C</SelectItem>
                                    <SelectItem value="D">Grupo D</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              {/* Categorias, Localização, etc. similar ao formulário de adicionar */}
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-categories" className="text-right">
                                  Categorias
                                </Label>
                                <div className="col-span-3 flex flex-wrap gap-2">
                                  {['SUB-11', 'SUB-13', 'SUB-15', 'SUB-17'].map(cat => (
                                    <Button
                                      key={cat}
                                      type="button"
                                      variant={selectedTeam.categories?.includes(cat) ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => {
                                        if (selectedTeam.categories.includes(cat)) {
                                          setSelectedTeam({
                                            ...selectedTeam, 
                                            categories: selectedTeam.categories.filter(c => c !== cat)
                                          });
                                        } else {
                                          setSelectedTeam({...selectedTeam, categories: [...selectedTeam.categories, cat]});
                                        }
                                      }}
                                    >
                                      {cat}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="button" variant="outline" onClick={() => setIsEditingTeam(false)}>
                                Cancelar
                              </Button>
                              <Button type="button" onClick={handleEditTeam}>
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
                      onClick={() => handleDeleteTeam(team.id)}
                    >
                      <Trash2 size={14} className="mr-1" />
                      Excluir
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleManagePlayers(team)}
                    >
                      <Users size={14} className="mr-1" />
                      Jogadores
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-lg bg-gray-50">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum time encontrado</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Tente outro termo de pesquisa ou adicione um novo time.' : 'Comece adicionando um novo time.'}
              </p>
              <Button 
                onClick={() => setIsAddingTeam(true)}
                className="bg-[#1a237e] hover:bg-[#0d1442]"
              >
                <PlusCircle size={16} className="mr-2" />
                Adicionar Novo Time
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement;
