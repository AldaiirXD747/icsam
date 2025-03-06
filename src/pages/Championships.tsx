
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useToast } from '@/components/ui/use-toast';
import { Trophy, Calendar, MapPin, ChevronRight, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ChampionshipType } from '@/types/database';

// Mock data for championships
const mockChampionships: ChampionshipType[] = [
  {
    id: "1",
    name: "Campeonato Base Forte 2023",
    year: "2023",
    description: "Campeonato anual com todas as categorias",
    banner_image: "https://example.com/banner1.jpg",
    start_date: "2023-03-15",
    end_date: "2023-11-20",
    location: "Campo do Instituto - Santa Maria, DF",
    categories: ["SUB-11", "SUB-13", "SUB-15", "SUB-17"],
    organizer: "Instituto Criança Santa Maria",
    sponsors: [
      { name: "Patrocinador 1", logo: "https://example.com/logo1.png" },
      { name: "Patrocinador 2", logo: "https://example.com/logo2.png" }
    ],
    status: "finished"
  },
  {
    id: "2",
    name: "Campeonato Base Forte 2024",
    year: "2024",
    description: "Edição 2024 do tradicional campeonato",
    banner_image: "https://example.com/banner2.jpg",
    start_date: "2024-03-10",
    end_date: "2024-11-25",
    location: "Campo do Instituto - Santa Maria, DF",
    categories: ["SUB-11", "SUB-13", "SUB-15", "SUB-17"],
    organizer: "Instituto Criança Santa Maria",
    sponsors: [
      { name: "Patrocinador 1", logo: "https://example.com/logo1.png" },
      { name: "Patrocinador 3", logo: "https://example.com/logo3.png" }
    ],
    status: "ongoing"
  },
  {
    id: "3",
    name: "Copa Revelação 2025",
    year: "2025",
    description: "Novo torneio para revelar talentos",
    banner_image: "https://example.com/banner3.jpg",
    start_date: "2025-01-15",
    end_date: "2025-06-30",
    location: "Estádio Municipal - Brasília, DF",
    categories: ["SUB-13", "SUB-15"],
    organizer: "Instituto Criança Santa Maria",
    sponsors: [
      { name: "Patrocinador 2", logo: "https://example.com/logo2.png" },
      { name: "Patrocinador 4", logo: "https://example.com/logo4.png" }
    ],
    status: "upcoming"
  }
];

const Championships = () => {
  const [championships, setChampionships] = useState<ChampionshipType[]>(mockChampionships);
  const [loading, setLoading] = useState(false);
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { toast } = useToast();
  
  // Format dates for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy', { locale: ptBR });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };
  
  // Get unique years for filter
  const years = [...new Set(championships.map(championship => championship.year))];
  
  // Filter championships
  const filteredChampionships = championships.filter(championship => {
    const matchesYear = filterYear === "all" || championship.year === filterYear;
    const matchesStatus = filterStatus === "all" || championship.status === filterStatus;
    const matchesSearch = searchTerm.trim() === "" || 
      championship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      championship.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesYear && matchesStatus && matchesSearch;
  });
  
  // Map status to display text
  const formatStatus = (status: 'upcoming' | 'ongoing' | 'finished') => {
    switch (status) {
      case 'upcoming': return 'Próximo';
      case 'ongoing': return 'Em andamento';
      case 'finished': return 'Finalizado';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1a237e] mb-2">Todos os Campeonatos</h1>
            <p className="text-gray-600">Confira todos os campeonatos organizados pelo Instituto Santa Maria.</p>
          </div>
          
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar campeonatos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="w-full sm:w-auto">
                <Select value={filterYear} onValueChange={setFilterYear}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filtrar por ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os anos</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-auto">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="upcoming">Próximos</SelectItem>
                    <SelectItem value="ongoing">Em andamento</SelectItem>
                    <SelectItem value="finished">Finalizados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                className="ml-auto"
                onClick={() => {
                  setFilterYear("all");
                  setFilterStatus("all");
                  setSearchTerm("");
                }}
              >
                Limpar filtros
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Carregando campeonatos...</p>
            </div>
          ) : filteredChampionships.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum campeonato encontrado</h3>
              <p className="text-gray-500">Não há campeonatos cadastrados ou correspondentes aos filtros selecionados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChampionships.map((championship) => (
                <Link
                  key={championship.id}
                  to={`/championships/${championship.id}`}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-48">
                    <img
                      src={championship.banner_image || '/placeholder.svg'} 
                      alt={championship.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                      <div className="inline-block bg-[#c6ff00] px-2 py-1 rounded-full mb-2">
                        <span className="text-[#1a237e] font-medium text-xs">{championship.year}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">{championship.name}</h3>
                      <div className="flex items-center mt-2">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          championship.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                          championship.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {formatStatus(championship.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-[#1a237e] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Período</p>
                          <p className="font-medium">{formatDate(championship.start_date)} - {formatDate(championship.end_date)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-[#1a237e] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Local</p>
                          <p className="font-medium">{championship.location}</p>
                        </div>
                      </div>
                      
                      {championship.categories.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Categorias</p>
                          <div className="flex flex-wrap gap-1">
                            {championship.categories.map((category, index) => (
                              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                {category}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex justify-end items-center text-[#1a237e] font-medium">
                      <span>Ver detalhes</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Championships;
