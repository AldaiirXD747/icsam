
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, Edit, Trash2, Search, Calendar, Clock, 
  MapPin, ChevronDown, ChevronUp, Check, X
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/button";

// Tipos
interface Team {
  id: number;
  name: string;
  logo: string;
}

interface Match {
  id: number;
  date: string;
  time: string;
  location: string;
  category: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  championshipId: number;
  round: string;
}

// Dados simulados de times
const teamsData: Team[] = [
  {
    id: 1,
    name: 'Guerreiros',
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/9.png',
  },
  {
    id: 2,
    name: 'Furacão',
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png',
  },
  {
    id: 3,
    name: 'Atlético City',
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/7.png',
  },
  {
    id: 4,
    name: 'Federal',
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/6.png',
  },
  {
    id: 5,
    name: 'Estrela',
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/5.png',
  },
  {
    id: 6,
    name: 'BSA',
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/4.png',
  },
  {
    id: 7,
    name: 'Monte',
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/2.png',
  },
  {
    id: 8,
    name: 'Alvinegro',
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/1.png',
  },
];

// Dados simulados de campeonatos
const championshipsData = [
  { id: 1, name: 'Base Forte - 2025' },
  { id: 2, name: 'Torneio de Verão 2025' },
];

const MatchManagement = () => {
  const { toast } = useToast();
  const [matches, setMatches] = useState<Match[]>([
    {
      id: 1,
      date: '2025-03-15',
      time: '14:00',
      location: 'Estádio Bezerrão, Gama',
      category: 'SUB-13',
      homeTeam: teamsData[0], // Guerreiros
      awayTeam: teamsData[6], // Monte
      homeScore: null,
      awayScore: null,
      status: 'scheduled',
      championshipId: 1,
      round: 'Fase de Grupos - Rodada 1',
    },
    {
      id: 2,
      date: '2025-03-16',
      time: '10:00',
      location: 'Campo do Setor O, Ceilândia',
      category: 'SUB-11',
      homeTeam: teamsData[4], // Estrela
      awayTeam: teamsData[1], // Furacão
      homeScore: 1,
      awayScore: 3,
      status: 'completed',
      championshipId: 1,
      round: 'Fase de Grupos - Rodada 1',
    },
    {
      id: 3,
      date: '2025-03-16',
      time: '15:30',
      location: 'Campo do CAVE, Guará',
      category: 'SUB-13',
      homeTeam: teamsData[2], // Atlético City
      awayTeam: teamsData[5], // BSA
      homeScore: 2,
      awayScore: 2,
      status: 'completed',
      championshipId: 1,
      round: 'Fase de Grupos - Rodada 1',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterChampionship, setFilterChampionship] = useState<number | 'all'>('all');
  
  const [isAddingMatch, setIsAddingMatch] = useState(false);
  const [isEditingMatch, setIsEditingMatch] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isUpdatingScore, setIsUpdatingScore] = useState(false);
  
  const [newMatch, setNewMatch] = useState<Partial<Match>>({
    date: '',
    time: '',
    location: '',
    category: '',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    championshipId: 1,
    round: 'Fase de Grupos - Rodada 1',
  });
  
  // Filtragem de partidas
  const filteredMatches = matches.filter(match => {
    const matchesSearch = 
      match.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || match.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || match.status === filterStatus;
    const matchesChampionship = filterChampionship === 'all' || match.championshipId === filterChampionship;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesChampionship;
  });
  
  // Gerenciar adição de partida
  const handleAddMatch = () => {
    // Validação básica
    if (!newMatch.date || !newMatch.time || !newMatch.homeTeam || !newMatch.awayTeam || !newMatch.category) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (newMatch.homeTeam?.id === newMatch.awayTeam?.id) {
      toast({
        title: "Erro",
        description: "Os times mandante e visitante não podem ser o mesmo.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Simulação de adição ao banco de dados
    const matchToAdd = {
      ...newMatch,
      id: Date.now(),
      homeScore: null,
      awayScore: null,
      status: 'scheduled',
    } as Match;
    
    setMatches([...matches, matchToAdd]);
    setNewMatch({
      date: '',
      time: '',
      location: '',
      category: '',
      homeScore: null,
      awayScore: null,
      status: 'scheduled',
      championshipId: 1,
      round: 'Fase de Grupos - Rodada 1',
    });
    setIsAddingMatch(false);
    
    toast({
      title: "Sucesso",
      description: "Partida adicionada com sucesso!",
      duration: 3000,
    });
  };
  
  // Gerenciar edição de partida
  const handleEditMatch = () => {
    if (!selectedMatch) return;
    
    const updatedMatches = matches.map(match => 
      match.id === selectedMatch.id ? { ...selectedMatch } : match
    );
    
    setMatches(updatedMatches);
    setIsEditingMatch(false);
    
    toast({
      title: "Sucesso",
      description: "Partida atualizada com sucesso!",
      duration: 3000,
    });
  };
  
  // Gerenciar atualização de placar
  const handleUpdateScore = () => {
    if (!selectedMatch) return;
    
    const updatedMatch = {
      ...selectedMatch,
      status: 'completed',
    };
    
    const updatedMatches = matches.map(match => 
      match.id === selectedMatch.id ? updatedMatch : match
    );
    
    setMatches(updatedMatches);
    setIsUpdatingScore(false);
    setSelectedMatch(null);
    
    toast({
      title: "Sucesso",
      description: "Placar atualizado com sucesso!",
      duration: 3000,
    });
  };
  
  // Gerenciar remoção de partida
  const handleDeleteMatch = (id: number) => {
    const updatedMatches = matches.filter(match => match.id !== id);
    setMatches(updatedMatches);
    
    toast({
      title: "Sucesso",
      description: "Partida removida com sucesso!",
      duration: 3000,
    });
  };
  
  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  // Formatar status para exibição
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'scheduled':
        return <Badge className="bg-blue-500">Agendada</Badge>;
      case 'in_progress':
        return <Badge className="bg-green-500">Em andamento</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500">Concluída</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelada</Badge>;
      default:
        return <Badge className="bg-gray-300">Desconhecido</Badge>;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-[#1a237e]">Gerenciar Partidas</CardTitle>
          <CardDescription>
            Adicione, edite ou remova partidas do sistema. Você também pode atualizar os placares.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  placeholder="Buscar partida..." 
                  className="pl-10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Dialog open={isAddingMatch} onOpenChange={setIsAddingMatch}>
                <DialogTrigger asChild>
                  <Button className="bg-[#1a237e] hover:bg-[#0d1442]">
                    <PlusCircle size={16} className="mr-2" />
                    Adicionar Partida
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Adicionar Nova Partida</DialogTitle>
                    <DialogDescription>
                      Preencha os detalhes da nova partida. Os campos com * são obrigatórios.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="championship">Campeonato*</Label>
                        <Select
                          value={String(newMatch.championshipId)}
                          onValueChange={(value) => setNewMatch({...newMatch, championshipId: parseInt(value)})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um campeonato" />
                          </SelectTrigger>
                          <SelectContent>
                            {championshipsData.map(championship => (
                              <SelectItem key={championship.id} value={String(championship.id)}>
                                {championship.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="category">Categoria*</Label>
                        <Select
                          value={newMatch.category}
                          onValueChange={(value) => setNewMatch({...newMatch, category: value})}
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
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Data*</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newMatch.date}
                          onChange={(e) => setNewMatch({...newMatch, date: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Horário*</Label>
                        <Input
                          id="time"
                          type="time"
                          value={newMatch.time}
                          onChange={(e) => setNewMatch({...newMatch, time: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="location">Local*</Label>
                      <Input
                        id="location"
                        value={newMatch.location || ''}
                        onChange={(e) => setNewMatch({...newMatch, location: e.target.value})}
                        placeholder="Ex: Estádio Bezerrão, Gama"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="round">Rodada/Fase</Label>
                      <Input
                        id="round"
                        value={newMatch.round || ''}
                        onChange={(e) => setNewMatch({...newMatch, round: e.target.value})}
                        placeholder="Ex: Fase de Grupos - Rodada 1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="homeTeam">Time Mandante*</Label>
                        <Select
                          onValueChange={(value) => {
                            const team = teamsData.find(t => t.id === parseInt(value));
                            setNewMatch({...newMatch, homeTeam: team});
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o time mandante" />
                          </SelectTrigger>
                          <SelectContent>
                            {teamsData.map(team => (
                              <SelectItem key={team.id} value={String(team.id)}>
                                {team.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="awayTeam">Time Visitante*</Label>
                        <Select
                          onValueChange={(value) => {
                            const team = teamsData.find(t => t.id === parseInt(value));
                            setNewMatch({...newMatch, awayTeam: team});
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o time visitante" />
                          </SelectTrigger>
                          <SelectContent>
                            {teamsData.map(team => (
                              <SelectItem key={team.id} value={String(team.id)}>
                                {team.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddingMatch(false)}>
                      Cancelar
                    </Button>
                    <Button type="button" onClick={handleAddMatch}>
                      Adicionar Partida
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="filter-category">Filtrar por Categoria</Label>
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    <SelectItem value="SUB-11">SUB-11</SelectItem>
                    <SelectItem value="SUB-13">SUB-13</SelectItem>
                    <SelectItem value="SUB-15">SUB-15</SelectItem>
                    <SelectItem value="SUB-17">SUB-17</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="filter-status">Filtrar por Status</Label>
                <Select
                  value={filterStatus}
                  onValueChange={setFilterStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="scheduled">Agendadas</SelectItem>
                    <SelectItem value="in_progress">Em andamento</SelectItem>
                    <SelectItem value="completed">Concluídas</SelectItem>
                    <SelectItem value="cancelled">Canceladas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="filter-championship">Filtrar por Campeonato</Label>
                <Select
                  value={String(filterChampionship)}
                  onValueChange={(value) => setFilterChampionship(value === 'all' ? 'all' : parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os campeonatos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os campeonatos</SelectItem>
                    {championshipsData.map(championship => (
                      <SelectItem key={championship.id} value={String(championship.id)}>
                        {championship.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {filteredMatches.length > 0 ? (
            <div className="space-y-4">
              <Accordion type="multiple" className="space-y-4">
                {filteredMatches.map(match => (
                  <AccordionItem 
                    key={match.id} 
                    value={String(match.id)}
                    className="border rounded-lg overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 py-2 hover:no-underline">
                      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-left">
                        <div className="md:col-span-3 flex items-center gap-2">
                          <Calendar size={16} className="text-gray-500" />
                          <span>{formatDate(match.date)}</span>
                          <span className="text-gray-500 text-sm">{match.time}</span>
                        </div>
                        <div className="md:col-span-6 flex flex-col sm:flex-row sm:items-center justify-center gap-2">
                          <div className="flex items-center gap-2 justify-end flex-1">
                            <span className="font-medium">{match.homeTeam.name}</span>
                            <img 
                              src={match.homeTeam.logo} 
                              alt={match.homeTeam.name}
                              className="w-6 h-6 object-contain" 
                            />
                          </div>
                          <div className="mx-2 font-bold text-center">
                            {match.homeScore !== null && match.awayScore !== null
                              ? `${match.homeScore} - ${match.awayScore}`
                              : "vs"}
                          </div>
                          <div className="flex items-center gap-2 justify-start flex-1">
                            <img 
                              src={match.awayTeam.logo} 
                              alt={match.awayTeam.name}
                              className="w-6 h-6 object-contain" 
                            />
                            <span className="font-medium">{match.awayTeam.name}</span>
                          </div>
                        </div>
                        <div className="md:col-span-3 flex flex-wrap items-center gap-2 justify-end">
                          <Badge className="bg-[#1a237e]">{match.category}</Badge>
                          {getStatusLabel(match.status)}
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3 border-t bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin size={16} className="mt-0.5 text-gray-500" />
                            <div>
                              <p className="font-medium">Local:</p>
                              <p>{match.location}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-start gap-2 text-sm">
                            <Calendar size={16} className="mt-0.5 text-gray-500" />
                            <div>
                              <p className="font-medium">Campeonato:</p>
                              <p>
                                {championshipsData.find(c => c.id === match.championshipId)?.name || 'Desconhecido'}
                                {match.round && ` • ${match.round}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap justify-end gap-2 mt-4">
                        <Dialog open={isUpdatingScore && selectedMatch?.id === match.id} onOpenChange={(open) => {
                          setIsUpdatingScore(open);
                          if (!open) setSelectedMatch(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedMatch(match);
                                setIsUpdatingScore(true);
                              }}
                            >
                              {match.status === 'completed' ? 'Editar Placar' : 'Informar Placar'}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            {selectedMatch && (
                              <>
                                <DialogHeader>
                                  <DialogTitle>Atualizar Placar</DialogTitle>
                                  <DialogDescription>
                                    Informe o resultado da partida entre {selectedMatch.homeTeam.name} e {selectedMatch.awayTeam.name}.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="flex items-center justify-center gap-6">
                                    <div className="text-center">
                                      <div className="w-16 h-16 mx-auto">
                                        <img 
                                          src={selectedMatch.homeTeam.logo} 
                                          alt={selectedMatch.homeTeam.name}
                                          className="w-full h-full object-contain" 
                                        />
                                      </div>
                                      <p className="mt-2 font-medium">{selectedMatch.homeTeam.name}</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 items-center">
                                      <div>
                                        <Label htmlFor="home-score">Gols</Label>
                                        <Input
                                          id="home-score"
                                          type="number"
                                          min="0"
                                          value={selectedMatch.homeScore !== null ? selectedMatch.homeScore : ''}
                                          onChange={(e) => setSelectedMatch({
                                            ...selectedMatch, 
                                            homeScore: e.target.value === '' ? null : parseInt(e.target.value)
                                          })}
                                          className="text-center text-lg"
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="away-score">Gols</Label>
                                        <Input
                                          id="away-score"
                                          type="number"
                                          min="0"
                                          value={selectedMatch.awayScore !== null ? selectedMatch.awayScore : ''}
                                          onChange={(e) => setSelectedMatch({
                                            ...selectedMatch, 
                                            awayScore: e.target.value === '' ? null : parseInt(e.target.value)
                                          })}
                                          className="text-center text-lg"
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="text-center">
                                      <div className="w-16 h-16 mx-auto">
                                        <img 
                                          src={selectedMatch.awayTeam.logo} 
                                          alt={selectedMatch.awayTeam.name}
                                          className="w-full h-full object-contain" 
                                        />
                                      </div>
                                      <p className="mt-2 font-medium">{selectedMatch.awayTeam.name}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4">
                                    <Label htmlFor="status">Status da Partida</Label>
                                    <Select
                                      value={selectedMatch.status}
                                      onValueChange={(value: 'scheduled' | 'in_progress' | 'completed' | 'cancelled') => 
                                        setSelectedMatch({...selectedMatch, status: value})
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecione o status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="scheduled">Agendada</SelectItem>
                                        <SelectItem value="in_progress">Em andamento</SelectItem>
                                        <SelectItem value="completed">Concluída</SelectItem>
                                        <SelectItem value="cancelled">Cancelada</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button type="button" variant="outline" onClick={() => setIsUpdatingScore(false)}>
                                    Cancelar
                                  </Button>
                                  <Button type="button" onClick={handleUpdateScore}>
                                    Salvar Placar
                                  </Button>
                                </DialogFooter>
                              </>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Dialog open={isEditingMatch && selectedMatch?.id === match.id} onOpenChange={(open) => {
                          setIsEditingMatch(open);
                          if (!open) setSelectedMatch(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedMatch(match);
                                setIsEditingMatch(true);
                              }}
                            >
                              <Edit size={14} className="mr-1" />
                              Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            {selectedMatch && (
                              <>
                                <DialogHeader>
                                  <DialogTitle>Editar Partida</DialogTitle>
                                  <DialogDescription>
                                    Atualize as informações da partida.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  {/* Formulário similar ao adicionar partida */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="edit-date">Data</Label>
                                      <Input
                                        id="edit-date"
                                        type="date"
                                        value={selectedMatch.date}
                                        onChange={(e) => setSelectedMatch({...selectedMatch, date: e.target.value})}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-time">Horário</Label>
                                      <Input
                                        id="edit-time"
                                        type="time"
                                        value={selectedMatch.time}
                                        onChange={(e) => setSelectedMatch({...selectedMatch, time: e.target.value})}
                                      />
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="edit-location">Local</Label>
                                    <Input
                                      id="edit-location"
                                      value={selectedMatch.location}
                                      onChange={(e) => setSelectedMatch({...selectedMatch, location: e.target.value})}
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="edit-category">Categoria</Label>
                                    <Select
                                      value={selectedMatch.category}
                                      onValueChange={(value) => setSelectedMatch({...selectedMatch, category: value})}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
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
                                <DialogFooter>
                                  <Button type="button" variant="outline" onClick={() => setIsEditingMatch(false)}>
                                    Cancelar
                                  </Button>
                                  <Button type="button" onClick={handleEditMatch}>
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
                          onClick={() => handleDeleteMatch(match.id)}
                        >
                          <Trash2 size={14} className="mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ) : (
            <div className="text-center p-8 border rounded-lg bg-gray-50">
              <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma partida encontrada</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' || filterChampionship !== 'all'
                  ? 'Tente outros filtros ou adicione uma nova partida.'
                  : 'Comece adicionando uma nova partida.'}
              </p>
              <Button 
                onClick={() => setIsAddingMatch(true)}
                className="bg-[#1a237e] hover:bg-[#0d1442]"
              >
                <PlusCircle size={16} className="mr-2" />
                Adicionar Nova Partida
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchManagement;
