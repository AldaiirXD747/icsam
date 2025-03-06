
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ChampionshipType } from '@/types/database';
import { Trophy, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Championships = () => {
  const [championships, setChampionships] = useState<ChampionshipType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { toast } = useToast();
  
  useEffect(() => {
    fetchChampionships();
  }, []);
  
  const fetchChampionships = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('championships')
        .select('*')
        .order('year', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        // Process JSON fields
        const processedData = data.map(championship => {
          return {
            id: championship.id,
            name: championship.name,
            year: championship.year,
            description: championship.description || "",
            banner_image: championship.banner_image || "",
            start_date: championship.start_date,
            end_date: championship.end_date,
            location: championship.location,
            categories: Array.isArray(championship.categories) 
              ? championship.categories 
              : typeof championship.categories === 'string' 
                ? JSON.parse(championship.categories) 
                : championship.categories || [],
            organizer: championship.organizer || "",
            sponsors: Array.isArray(championship.sponsors) 
              ? championship.sponsors 
              : typeof championship.sponsors === 'string' 
                ? JSON.parse(championship.sponsors) 
                : championship.sponsors || [],
            status: championship.status as 'upcoming' | 'ongoing' | 'finished'
          } as ChampionshipType;
        });
        
        setChampionships(processedData);
      }
    } catch (error) {
      console.error('Error fetching championships:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar campeonatos",
        description: "Não foi possível carregar a lista de campeonatos."
      });
    } finally {
      setLoading(false);
    }
  };
  
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
    return matchesYear && matchesStatus;
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
            <h1 className="text-3xl font-bold text-blue-primary mb-2">Todos os Campeonatos</h1>
            <p className="text-gray-600">Confira todos os campeonatos organizados pelo Instituto Santa Maria.</p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div>
              <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
              <select
                id="year-filter"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="rounded-md border border-gray-300 py-2 px-3 text-sm"
              >
                <option value="all">Todos os anos</option>
                {years.map((year, i) => (
                  <option key={i} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-md border border-gray-300 py-2 px-3 text-sm"
              >
                <option value="all">Todos</option>
                <option value="upcoming">Próximos</option>
                <option value="ongoing">Em andamento</option>
                <option value="finished">Finalizados</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Carregando campeonatos...</p>
            </div>
          ) : filteredChampionships.length === 0 ? (
            <div className="glass-card p-8 text-center">
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
                  className="glass-card overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-48">
                    <img
                      src={championship.banner_image || '/placeholder.svg'} 
                      alt={championship.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                      <div className="inline-block bg-lime-primary px-2 py-1 rounded-full mb-2">
                        <span className="text-blue-primary font-medium text-xs">{championship.year}</span>
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
                        <Calendar className="h-5 w-5 text-blue-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Período</p>
                          <p className="font-medium">{formatDate(championship.start_date)} - {formatDate(championship.end_date)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-blue-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Local</p>
                          <p className="font-medium">{championship.location}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end items-center text-blue-primary font-medium">
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
