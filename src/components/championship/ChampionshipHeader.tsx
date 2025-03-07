
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, MapPin, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import type { ChampionshipFull } from '@/types/championship';

interface ChampionshipHeaderProps {
  championship: ChampionshipFull;
  showFullDescription: boolean;
  toggleDescription: () => void;
}

const ChampionshipHeader: React.FC<ChampionshipHeaderProps> = ({ 
  championship, 
  showFullDescription, 
  toggleDescription 
}) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusInfo = (status: 'upcoming' | 'ongoing' | 'finished') => {
    switch (status) {
      case 'upcoming': return { text: 'Próximo', color: 'bg-blue-100 text-blue-800' };
      case 'ongoing': return { text: 'Em andamento', color: 'bg-green-100 text-green-800' };
      case 'finished': return { text: 'Finalizado', color: 'bg-gray-100 text-gray-800' };
      default: return { text: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const statusInfo = getStatusInfo(championship.status);

  return (
    <div className="relative">
      <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-300 relative">
        <img 
          src={championship.banner_image || '/lovable-uploads/d9479deb-326b-4848-89fb-ef3e3f4c9601.png'} 
          alt={championship.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="relative -mt-24 bg-white rounded-t-lg shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <div className="flex items-center mb-2">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                  {statusInfo.text}
                </span>
                <span className="ml-3 text-gray-500">{championship.year}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a237e]">{championship.name}</h1>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-[#1a237e] mt-1" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Período</h3>
                <p className="font-medium">{formatDate(championship.start_date)} - {formatDate(championship.end_date)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-[#1a237e] mt-1" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Local</h3>
                <p className="font-medium">{championship.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Trophy className="h-5 w-5 text-[#1a237e] mt-1" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Organizador</h3>
                <p className="font-medium">{championship.organizer || 'Instituto Criança Santa Maria'}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="font-semibold text-xl mb-3">Descrição</h2>
            <div className="relative">
              <p className={`text-gray-600 ${showFullDescription ? '' : 'line-clamp-3'}`}>
                {championship.description || 'Campeonato organizado pelo Instituto Criança Santa Maria.'}
              </p>
              {championship.description && championship.description.length > 150 && (
                <button 
                  onClick={toggleDescription}
                  className="text-[#1a237e] font-medium flex items-center mt-2"
                >
                  {showFullDescription ? (
                    <>
                      Mostrar menos <ChevronUp className="ml-1 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Mostrar mais <ChevronDown className="ml-1 h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="font-semibold text-xl mb-3">Categorias</h2>
            <div className="flex flex-wrap gap-2">
              {championship.categories.map((category, index) => (
                <span 
                  key={index} 
                  className="bg-gray-100 text-[#1a237e] px-3 py-1 rounded-full text-sm font-medium"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          
          {championship.sponsors && championship.sponsors.length > 0 && (
            <div className="mb-8">
              <h2 className="font-semibold text-xl mb-3">Patrocinadores</h2>
              <div className="flex flex-wrap gap-6 items-center">
                {championship.sponsors.map((sponsor, index) => (
                  <div key={index} className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
                    {sponsor.logo ? (
                      <img 
                        src={sponsor.logo} 
                        alt={sponsor.name} 
                        className="h-8 mr-2" 
                      />
                    ) : null}
                    <span className="font-medium">{sponsor.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChampionshipHeader;
