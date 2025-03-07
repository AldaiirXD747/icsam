
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getChampionships } from '@/lib/api';
import { Loader2, Calendar, MapPin, Trophy, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Championship } from '@/types';

const Championships = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'upcoming' | 'finished'>('all');
  
  const { data: championships = [], isLoading, error } = useQuery({
    queryKey: ['championships'],
    queryFn: getChampionships,
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-primary" />
        <span className="mt-4 text-gray-600">Carregando campeonatos...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Erro ao carregar campeonatos</h2>
          <p className="text-red-600">Não foi possível carregar a lista de campeonatos. Por favor, tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }
  
  const filteredChampionships = championships.filter(championship => {
    if (activeTab === 'all') return true;
    return championship.status === activeTab;
  });
  
  // Sort championships by year, most recent first
  const sortedChampionships = [...filteredChampionships].sort((a, b) => {
    return parseInt(b.year) - parseInt(a.year);
  });
  
  const getStatusBadgeColor = (status: Championship['status']) => {
    switch (status) {
      case 'ongoing':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'finished':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusLabel = (status: Championship['status']) => {
    switch (status) {
      case 'ongoing':
        return 'Em andamento';
      case 'upcoming':
        return 'Próximo';
      case 'finished':
        return 'Finalizado';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1a237e] mb-2">Nossos Campeonatos</h1>
          <p className="text-gray-600">Confira todos os campeonatos organizados pelo Instituto Criança Santa Maria</p>
        </div>
        
        <div className="mb-8">
          <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="ongoing">Em andamento</TabsTrigger>
              <TabsTrigger value="upcoming">Próximos</TabsTrigger>
              <TabsTrigger value="finished">Finalizados</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {sortedChampionships.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow-md">
            <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum campeonato encontrado
            </h3>
            <p className="text-gray-500">
              Não há campeonatos correspondentes ao filtro selecionado.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedChampionships.map((championship) => (
              <Link
                to={`/campeonatos/${championship.id}`}
                key={championship.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={championship.banner_image || '/lovable-uploads/d9479deb-326b-4848-89fb-ef3e3f4c9601.png'}
                    alt={championship.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(championship.status)}`}>
                      {getStatusLabel(championship.status)}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-bold text-[#1a237e] mb-2 line-clamp-1">
                    {championship.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {championship.description || 'Campeonato organizado pelo Instituto Criança Santa Maria'}
                  </p>
                  
                  <div className="flex flex-col space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-[#c6ff00]" />
                      {championship.start_date && championship.end_date ? (
                        <span>
                          {format(new Date(championship.start_date), 'dd/MM/yyyy', { locale: ptBR })} - {format(new Date(championship.end_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      ) : (
                        <span>Data a definir</span>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-[#c6ff00]" />
                      <span>{championship.location || 'Local a definir'}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Trophy className="h-4 w-4 mr-2 text-[#c6ff00]" />
                      <span>
                        {Array.isArray(championship.categories) && championship.categories.length > 0
                          ? championship.categories.join(', ')
                          : 'Todas as categorias'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Championships;
