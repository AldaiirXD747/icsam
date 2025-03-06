
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus, Calendar, Clock, MapPin, Users, Flag } from 'lucide-react';

// Define the types
type Team = {
  id: string;
  name: string;
  logo: string;
};

type MatchStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

type Match = {
  id: number;
  date: string;
  time: string;
  location: string;
  category: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  championshipId: number;
  round: string;
};

// Mock data
const mockTeams: Team[] = [
  { id: "1", name: "Federal", logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/6.png" },
  { id: "2", name: "Estrela", logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/5.png" },
  { id: "3", name: "Alvinegro", logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/1.png" },
  { id: "4", name: "Furacão", logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png" },
  { id: "5", name: "Monte", logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/2.png" },
  { id: "6", name: "Lyon", logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/lion.png" },
  { id: "7", name: "BSA", logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/4.png" },
  { id: "8", name: "Atlético City", logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/7.png" },
];

const mockMatches: Match[] = [
  {
    id: 1,
    date: "2025-02-23",
    time: "09:00",
    location: "Campo do Instituto",
    category: "SUB-11",
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: null,
    awayScore: null,
    status: "scheduled",
    championshipId: 1,
    round: "1"
  },
  {
    id: 2,
    date: "2025-02-23",
    time: "10:30",
    location: "Campo do Instituto",
    category: "SUB-11",
    homeTeam: mockTeams[2],
    awayTeam: mockTeams[3],
    homeScore: null,
    awayScore: null,
    status: "scheduled",
    championshipId: 1,
    round: "1"
  },
  {
    id: 3,
    date: "2025-02-09",
    time: "09:00",
    location: "Campo do Instituto",
    category: "SUB-13",
    homeTeam: mockTeams[4],
    awayTeam: mockTeams[5],
    homeScore: 2,
    awayScore: 0,
    status: "completed",
    championshipId: 1,
    round: "1"
  },
  {
    id: 4,
    date: "2025-02-15",
    time: "11:00",
    location: "Campo do Instituto",
    category: "SUB-13",
    homeTeam: mockTeams[6],
    awayTeam: mockTeams[7],
    homeScore: 1,
    awayScore: 3,
    status: "completed",
    championshipId: 1,
    round: "2"
  }
];

// Status badge color mapping
const statusColorMap: Record<MatchStatus, string> = {
  "scheduled": "bg-blue-100 text-blue-800",
  "in_progress": "bg-green-100 text-green-800",
  "completed": "bg-gray-100 text-gray-800",
  "cancelled": "bg-red-100 text-red-800"
};

// Status display text mapping
const statusTextMap: Record<MatchStatus, string> = {
  "scheduled": "Agendado",
  "in_progress": "Em andamento",
  "completed": "Finalizado",
  "cancelled": "Cancelado"
};

const MatchManagement: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>(mockMatches);
  const [selectedTab, setSelectedTab] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: "",
    category: "",
    homeTeamId: "",
    awayTeamId: "",
    homeScore: "",
    awayScore: "",
    status: "scheduled" as MatchStatus,
    championshipId: "1",
    round: ""
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Filter matches based on search term and filters
  const filteredMatches = matches.filter(match => {
    const matchesSearch = 
      match.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      match.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || match.category === filterCategory;
    const matchesTab = selectedTab === "all" || match.status === selectedTab;
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  // Create a new match
  const handleCreateMatch = () => {
    if (!formData.date || !formData.time || !formData.location || 
        !formData.category || !formData.homeTeamId || !formData.awayTeamId || !formData.round) {
      toast({
        variant: "destructive",
        title: "Erro ao criar partida",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    const homeTeam = mockTeams.find(team => team.id === formData.homeTeamId);
    const awayTeam = mockTeams.find(team => team.id === formData.awayTeamId);

    if (!homeTeam || !awayTeam) {
      toast({
        variant: "destructive",
        title: "Erro ao criar partida",
        description: "Times selecionados inválidos.",
      });
      return;
    }

    if (homeTeam.id === awayTeam.id) {
      toast({
        variant: "destructive",
        title: "Erro ao criar partida",
        description: "O time da casa e o time visitante não podem ser o mesmo.",
      });
      return;
    }

    const newMatch: Match = {
      id: matches.length + 1,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      category: formData.category,
      homeTeam,
      awayTeam,
      homeScore: null,
      awayScore: null,
      status: formData.status,
      championshipId: parseInt(formData.championshipId),
      round: formData.round
    };

    setMatches([...matches, newMatch]);
    setIsCreating(false);
    resetForm();
    
    toast({
      title: "Partida criada",
      description: "A partida foi criada com sucesso.",
    });
  };

  // Update an existing match
  const handleUpdateMatch = () => {
    if (!currentMatch) return;

    if (!formData.date || !formData.time || !formData.location || 
        !formData.category || !formData.round) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar partida",
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    const homeTeam = formData.homeTeamId ? 
      mockTeams.find(team => team.id === formData.homeTeamId) : 
      currentMatch.homeTeam;
      
    const awayTeam = formData.awayTeamId ? 
      mockTeams.find(team => team.id === formData.awayTeamId) : 
      currentMatch.awayTeam;

    if (!homeTeam || !awayTeam) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar partida",
        description: "Times selecionados inválidos.",
      });
      return;
    }

    if (homeTeam.id === awayTeam.id) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar partida",
        description: "O time da casa e o time visitante não podem ser o mesmo.",
      });
      return;
    }

    const homeScore = formData.homeScore === "" ? null : parseInt(formData.homeScore);
    const awayScore = formData.awayScore === "" ? null : parseInt(formData.awayScore);

    const updatedMatch: Match = {
      ...currentMatch,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      category: formData.category,
      homeTeam,
      awayTeam,
      homeScore,
      awayScore,
      status: formData.status,
      championshipId: parseInt(formData.championshipId),
      round: formData.round
    };

    const updatedMatches = matches.map(match => 
      match.id === currentMatch.id ? updatedMatch : match
    );

    setMatches(updatedMatches);
    setIsEditing(false);
    setCurrentMatch(null);
    resetForm();
    
    toast({
      title: "Partida atualizada",
      description: "A partida foi atualizada com sucesso.",
    });
  };

  // Delete a match
  const handleDeleteMatch = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta partida?")) {
      const updatedMatches = matches.filter(match => match.id !== id);
      setMatches(updatedMatches);
      
      toast({
        title: "Partida excluída",
        description: "A partida foi excluída com sucesso.",
      });
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      date: "",
      time: "",
      location: "",
      category: "",
      homeTeamId: "",
      awayTeamId: "",
      homeScore: "",
      awayScore: "",
      status: "scheduled",
      championshipId: "1",
      round: ""
    });
  };

  // Open edit dialog
  const openEditDialog = (match: Match) => {
    setCurrentMatch(match);
    setFormData({
      date: match.date,
      time: match.time,
      location: match.location,
      category: match.category,
      homeTeamId: match.homeTeam.id,
      awayTeamId: match.awayTeam.id,
      homeScore: match.homeScore !== null ? match.homeScore.toString() : "",
      awayScore: match.awayScore !== null ? match.awayScore.toString() : "",
      status: match.status,
      championshipId: match.championshipId.toString(),
      round: match.round
    });
    setIsEditing(true);
  };

  // Format the date for display
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-primary">Gerenciamento de Partidas</h2>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="bg-blue-primary text-white hover:bg-blue-light">
              <Plus size={16} className="mr-2" /> Nova Partida
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Nova Partida</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Local</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Local da partida"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-input px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="SUB-11">SUB-11</option>
                    <option value="SUB-13">SUB-13</option>
                    <option value="SUB-15">SUB-15</option>
                    <option value="SUB-17">SUB-17</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="round">Rodada</Label>
                  <Input
                    id="round"
                    name="round"
                    value={formData.round}
                    onChange={handleInputChange}
                    placeholder="Ex: 1"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="homeTeamId">Time da Casa</Label>
                <select
                  id="homeTeamId"
                  name="homeTeamId"
                  value={formData.homeTeamId}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm"
                  required
                >
                  <option value="">Selecione o time...</option>
                  {mockTeams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="awayTeamId">Time Visitante</Label>
                <select
                  id="awayTeamId"
                  name="awayTeamId"
                  value={formData.awayTeamId}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input px-3 py-2 text-sm"
                  required
                >
                  <option value="">Selecione o time...</option>
                  {mockTeams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancelar</Button>
              <Button onClick={handleCreateMatch} className="bg-blue-primary text-white hover:bg-blue-light">Criar Partida</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1">
            <Input
              placeholder="Buscar partidas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-md border border-input px-3 py-2 text-sm"
            >
              <option value="all">Todas Categorias</option>
              <option value="SUB-11">SUB-11</option>
              <option value="SUB-13">SUB-13</option>
              <option value="SUB-15">SUB-15</option>
              <option value="SUB-17">SUB-17</option>
            </select>
          </div>
        </div>

        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full grid grid-cols-5 mb-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="scheduled">Agendados</TabsTrigger>
            <TabsTrigger value="in_progress">Em andamento</TabsTrigger>
            <TabsTrigger value="completed">Finalizados</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            {filteredMatches.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma partida encontrada.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMatches.map(match => (
                  <Card key={match.id} className="overflow-hidden">
                    <CardHeader className="bg-blue-primary text-white py-3 px-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{formatDate(match.date)} • {match.time}</span>
                        </div>
                        <div className={`text-xs font-medium rounded-full px-2 py-1 ${statusColorMap[match.status]}`}>
                          {statusTextMap[match.status]}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-600">{match.location}</span>
                      </div>
                      
                      <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-gray-500" />
                          <span className="text-sm text-gray-600">{match.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Flag size={16} className="text-gray-500" />
                          <span className="text-sm text-gray-600">Rodada {match.round}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-4">
                        <div className="flex flex-col items-center">
                          <img 
                            src={match.homeTeam.logo} 
                            alt={match.homeTeam.name} 
                            className="w-12 h-12 object-contain mb-1"
                          />
                          <span className="text-sm font-medium text-center">{match.homeTeam.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-blue-primary text-white rounded flex items-center justify-center font-bold">
                            {match.homeScore !== null ? match.homeScore : "-"}
                          </div>
                          <span className="font-bold">x</span>
                          <div className="w-10 h-10 bg-blue-primary text-white rounded flex items-center justify-center font-bold">
                            {match.awayScore !== null ? match.awayScore : "-"}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-center">
                          <img 
                            src={match.awayTeam.logo} 
                            alt={match.awayTeam.name} 
                            className="w-12 h-12 object-contain mb-1"
                          />
                          <span className="text-sm font-medium text-center">{match.awayTeam.name}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Dialog open={isEditing && currentMatch?.id === match.id} onOpenChange={(open) => {
                          if (!open) {
                            setIsEditing(false);
                            setCurrentMatch(null);
                            resetForm();
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openEditDialog(match)}
                              className="flex items-center gap-1"
                            >
                              <Edit size={14} /> Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Editar Partida</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-date">Data</Label>
                                  <Input
                                    id="edit-date"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-time">Horário</Label>
                                  <Input
                                    id="edit-time"
                                    name="time"
                                    type="time"
                                    value={formData.time}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-location">Local</Label>
                                <Input
                                  id="edit-location"
                                  name="location"
                                  value={formData.location}
                                  onChange={handleInputChange}
                                  placeholder="Local da partida"
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-category">Categoria</Label>
                                  <select
                                    id="edit-category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-input px-3 py-2 text-sm"
                                    required
                                  >
                                    <option value="SUB-11">SUB-11</option>
                                    <option value="SUB-13">SUB-13</option>
                                    <option value="SUB-15">SUB-15</option>
                                    <option value="SUB-17">SUB-17</option>
                                  </select>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-round">Rodada</Label>
                                  <Input
                                    id="edit-round"
                                    name="round"
                                    value={formData.round}
                                    onChange={handleInputChange}
                                    placeholder="Ex: 1"
                                    required
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-homeTeamId">Time da Casa</Label>
                                <select
                                  id="edit-homeTeamId"
                                  name="homeTeamId"
                                  value={formData.homeTeamId}
                                  onChange={handleInputChange}
                                  className="w-full rounded-md border border-input px-3 py-2 text-sm"
                                  required
                                >
                                  {mockTeams.map(team => (
                                    <option key={team.id} value={team.id}>{team.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-awayTeamId">Time Visitante</Label>
                                <select
                                  id="edit-awayTeamId"
                                  name="awayTeamId"
                                  value={formData.awayTeamId}
                                  onChange={handleInputChange}
                                  className="w-full rounded-md border border-input px-3 py-2 text-sm"
                                  required
                                >
                                  {mockTeams.map(team => (
                                    <option key={team.id} value={team.id}>{team.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-homeScore">Gols Casa</Label>
                                  <Input
                                    id="edit-homeScore"
                                    name="homeScore"
                                    type="number"
                                    min="0"
                                    value={formData.homeScore}
                                    onChange={handleInputChange}
                                    placeholder="Gols"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-awayScore">Gols Visitante</Label>
                                  <Input
                                    id="edit-awayScore"
                                    name="awayScore"
                                    type="number"
                                    min="0"
                                    value={formData.awayScore}
                                    onChange={handleInputChange}
                                    placeholder="Gols"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-status">Status</Label>
                                  <select
                                    id="edit-status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-input px-3 py-2 text-sm"
                                    required
                                  >
                                    <option value="scheduled">Agendado</option>
                                    <option value="in_progress">Em andamento</option>
                                    <option value="completed">Finalizado</option>
                                    <option value="cancelled">Cancelado</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => {
                                setIsEditing(false);
                                setCurrentMatch(null);
                                resetForm();
                              }}>Cancelar</Button>
                              <Button onClick={handleUpdateMatch} className="bg-blue-primary text-white hover:bg-blue-light">Salvar Alterações</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteMatch(match.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 size={14} /> Excluir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MatchManagement;
