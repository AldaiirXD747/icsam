
import React from 'react';
import { Calendar, MapPin, Trophy, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ChampionshipDetailsProps {
  id: string;
  name: string;
  year: string;
  description: string;
  bannerImage: string;
  startDate: string;
  endDate: string;
  location: string;
  categories: string[];
  organizer: string;
  sponsors: Array<{
    name: string;
    logo: string;
  }>;
}

const ChampionshipDetails: React.FC<ChampionshipDetailsProps> = ({
  id,
  name,
  year,
  description,
  bannerImage,
  startDate,
  endDate,
  location,
  categories,
  organizer,
  sponsors,
}) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col space-y-8">
        {/* Championship Header */}
        <div className="glass-card overflow-hidden">
          <div className="relative h-64 md:h-96">
            <img
              src={bannerImage}
              alt={`${name} ${year}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
              <div className="inline-block bg-lime-primary px-3 py-1 rounded-full mb-2">
                <span className="text-blue-primary font-medium text-sm">{year}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{name}</h1>
              <p className="text-white/80 max-w-2xl">{description}</p>
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-blue-primary" />
              <div>
                <p className="text-sm text-gray-500">Período</p>
                <p className="font-medium">{startDate} - {endDate}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="h-8 w-8 text-blue-primary" />
              <div>
                <p className="text-sm text-gray-500">Local</p>
                <p className="font-medium">{location}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-primary" />
              <div>
                <p className="text-sm text-gray-500">Categorias</p>
                <p className="font-medium">{categories.join(', ')}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8 text-blue-primary" />
              <div>
                <p className="text-sm text-gray-500">Organizador</p>
                <p className="font-medium">{organizer}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Championship Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to={`/championships/${id}/teams`} className="glass-card p-6 hover:scale-105 transition-all duration-300">
            <h3 className="text-xl font-semibold text-blue-primary mb-2">Times</h3>
            <p className="text-gray-600 mb-4">Conheça os times participantes deste campeonato</p>
            <div className="flex justify-end">
              <div className="w-12 h-12 rounded-full bg-blue-primary flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </Link>
          
          <Link to={`/championships/${id}/matches`} className="glass-card p-6 hover:scale-105 transition-all duration-300">
            <h3 className="text-xl font-semibold text-blue-primary mb-2">Jogos</h3>
            <p className="text-gray-600 mb-4">Confira a tabela de jogos e resultados</p>
            <div className="flex justify-end">
              <div className="w-12 h-12 rounded-full bg-blue-primary flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </Link>
          
          <Link to={`/championships/${id}/standings`} className="glass-card p-6 hover:scale-105 transition-all duration-300">
            <h3 className="text-xl font-semibold text-blue-primary mb-2">Classificação</h3>
            <p className="text-gray-600 mb-4">Veja a tabela de classificação atualizada</p>
            <div className="flex justify-end">
              <div className="w-12 h-12 rounded-full bg-blue-primary flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
            </div>
          </Link>
          
          <Link to={`/championships/${id}/stats`} className="glass-card p-6 hover:scale-105 transition-all duration-300">
            <h3 className="text-xl font-semibold text-blue-primary mb-2">Estatísticas</h3>
            <p className="text-gray-600 mb-4">Estatísticas detalhadas do campeonato</p>
            <div className="flex justify-end">
              <div className="w-12 h-12 rounded-full bg-blue-primary flex items-center justify-center">
                <div className="text-white font-bold">📊</div>
              </div>
            </div>
          </Link>
        </div>
        
        {/* Sponsors Section */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-blue-primary mb-6">Patrocinadores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.map((sponsor, index) => (
              <div key={index} className="p-4 border border-gray-100 rounded-lg flex flex-col items-center">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="h-16 md:h-20 object-contain mb-4"
                />
                <p className="text-center font-medium text-gray-700">{sponsor.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChampionshipDetails;
