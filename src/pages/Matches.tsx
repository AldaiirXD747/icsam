import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MatchCard from '../components/MatchCard';
import { Calendar } from 'lucide-react';

// Mock data for matches
const matchesData = [
  {
    id: 1,
    homeTeam: {
      name: 'Federal',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/6.png',
      score: 0
    },
    awayTeam: {
      name: 'Furacão',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png',
      score: 1
    },
    category: 'SUB-13',
    date: '09/02/2025',
    time: '09:00',
    group: 'A',
    status: 'finished',
    venue: 'Campo do Instituto - Santa Maria, DF'
  },
  {
    id: 2,
    homeTeam: {
      name: 'Federal',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/6.png',
      score: 0
    },
    awayTeam: {
      name: 'Furacão',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png',
      score: 6
    },
    category: 'SUB-11',
    date: '09/02/2025',
    time: '10:30',
    group: 'A',
    status: 'finished',
    venue: 'Campo do Instituto - Santa Maria, DF'
  },
  {
    id: 3,
    homeTeam: {
      name: 'Grêmio',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/Captura-de-tela-2025-02-13-112406.png',
      score: 4
    },
    awayTeam: {
      name: 'Estrela',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/5.png',
      score: 0
    },
    category: 'SUB-13',
    date: '09/02/2025',
    time: '13:00',
    group: 'A',
    status: 'finished',
    venue: 'Campo do Instituto - Santa Maria, DF'
  },
  {
    id: 4,
    homeTeam: {
      name: 'Grêmio',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/Captura-de-tela-2025-02-13-112406.png',
      score: 2
    },
    awayTeam: {
      name: 'Estrela',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/5.png',
      score: 1
    },
    category: 'SUB-11',
    date: '09/02/2025',
    time: '14:30',
    group: 'A',
    status: 'finished',
    venue: 'Campo do Instituto - Santa Maria, DF'
  },
  {
    id: 5,
    homeTeam: {
      name: 'Atlético City',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/7.png',
      score: 2
    },
    awayTeam: {
      name: 'BSA',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/4.png',
      score: 1
    },
    category: 'SUB-13',
    date: '09/02/2025',
    time: '16:00',
    group: 'B',
    status: 'finished',
    venue: 'Campo do Instituto - Santa Maria, DF'
  },
  {
    id: 6,
    homeTeam: {
      name: 'Atlético City',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/7.png',
      score: 5
    },
    awayTeam: {
      name: 'BSA',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/4.png',
      score: 0
    },
    category: 'SUB-11',
    date: '09/02/2025',
    time: '17:30',
    group: 'B',
    status: 'finished',
    venue: 'Campo do Instituto - Santa Maria, DF'
  },
  {
    id: 7,
    homeTeam: {
      name: 'Monte',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/2.png',
      score: 2
    },
    awayTeam: {
      name: 'Lyon',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/lion.png',
      score: 0
    },
    category: 'SUB-13',
    date: '09/02/2025',
    time: '09:00',
    group: 'B',
    status: 'finished',
    venue: 'Campo do Instituto - Santa Maria, DF'
  },
  {
    id: 8,
    homeTeam: {
      name: 'Monte',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/2.png',
      score: 3
    },
    awayTeam: {
      name: 'Lyon',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/lion.png',
      score: 0
    },
    category: 'SUB-11',
    date: '09/02/2025',
    time: '10:30',
    group: 'B',
    status: 'finished',
    venue: 'Campo do Instituto - Santa Maria, DF'
  },
  {
    id: 9,
    homeTeam: {
      name: 'Federal',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/6.png',
      score: 1
    },
    awayTeam: {
      name: 'Grêmio',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/Captura-de-tela-2025-02-13-112406.png',
      score: 3
    },
    category: 'SUB-13',
    date: '16/02/2025',
    time: '09:00',
    group: 'A',
    status: 'finished',
    venue: 'Campo do Instituto - Santa Maria, DF'
  },
  {
    id: 10,
    homeTeam: {
      name: 'Alvinegro',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/1.png',
    },
    awayTeam: {
      name: 'Furacão',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png',
    },
    category: 'SUB-11',
    date: '23/02/2025',
    time: '10:30',
    group: 'A',
    status: 'scheduled',
    venue: 'Campo do Instituto - Santa Maria, DF'
  },
  {
    id: 11,
    homeTeam: {
      name: 'Lyon',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/lion.png',
      score: 2
    },
    awayTeam: {
      name: 'Guerreiros',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/9.png',
      score: 2
    },
    category: 'SUB-13',
    date: '15/02/2025',
    time: '13:00',
    group: 'B',
    status: 'live',
    venue: 'Campo do Instituto - Santa Maria, DF'
  }
];

const Matches = () => {
  const { championshipId } = useParams<{ championshipId?: string }>();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Filter matches based on category, group, and status
  const filteredMatches = matchesData.filter(match => {
    const matchesCategory = selectedCategory === 'all' || match.category === selectedCategory;
    const matchesGroup = selectedGroup === 'all' || match.group === selectedGroup;
    const matchesStatus = selectedStatus === 'all' || match.status === selectedStatus;
    return matchesCategory && matchesGroup && matchesStatus;
  });

  // Sort matches by date (newest first) and then by time
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    const dateA = new Date(a.date.split('/').reverse().join('-') + 'T' + a.time + ':00');
    const dateB = new Date(b.date.split('/').reverse().join('-') + 'T' + b.time + ':00');
    
    // For 'live' matches, prioritize them to the top
    if (a.status === 'live' && b.status !== 'live') return -1;
    if (a.status !== 'live' && b.status === 'live') return 1;
    
    // For scheduled matches, prioritize them after live matches
    if (a.status === 'scheduled' && b.status === 'finished') return -1;
    if (a.status === 'finished' && b.status === 'scheduled') return 1;
    
    // Otherwise sort by date and time
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-24 flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="inline-block bg-lime-primary bg-opacity-20 px-4 py-1.5 rounded-full mb-3">
              <span className="text-blue-primary font-medium text-sm">
                <Calendar className="inline-block h-4 w-4 mr-1" />
                Calendário de Jogos
              </span>
            </div>
            <h1 className="text-4xl font-bold text-blue-primary mb-4">
              {championshipId ? 'Jogos do Campeonato' : 'Todos os Jogos'}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Confira os jogos da temporada, resultados e próximos confrontos. Filtre por categoria, grupo ou status.
            </p>
          </div>

          {/* Filters */}
          <div className="glass-card p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  id="category-filter"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-primary"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">Todas as Categorias</option>
                  <option value="SUB-11">SUB-11</option>
                  <option value="SUB-13">SUB-13</option>
                  <option value="SUB-15">SUB-15</option>
                  <option value="SUB-17">SUB-17</option>
                </select>
              </div>

              {/* Group Filter */}
              <div>
                <label htmlFor="group-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Grupo
                </label>
                <select
                  id="group-filter"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-primary"
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                >
                  <option value="all">Todos os Grupos</option>
                  <option value="A">Grupo A</option>
                  <option value="B">Grupo B</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status-filter"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-primary"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">Todos os Status</option>
                  <option value="scheduled">Agendados</option>
                  <option value="live">Ao Vivo</option>
                  <option value="finished">Finalizados</option>
                </select>
              </div>
            </div>
          </div>

          {/* Live Matches */}
          {selectedStatus === 'all' || selectedStatus === 'live' ? (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-blue-primary mb-4 flex items-center">
                <span className="inline-block h-3 w-3 bg-red-500 animate-pulse rounded-full mr-2"></span>
                Jogos ao Vivo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedMatches.filter(match => match.status === 'live').length > 0 ? (
                  sortedMatches
                    .filter(match => match.status === 'live')
                    .map(match => (
                      <MatchCard key={match.id} {...match} />
                    ))
                ) : (
                  <div className="col-span-full py-4 text-center">
                    <p className="text-gray-500">Nenhum jogo ao vivo no momento.</p>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Upcoming Matches */}
          {selectedStatus === 'all' || selectedStatus === 'scheduled' ? (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-blue-primary mb-4">Próximos Jogos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedMatches.filter(match => match.status === 'scheduled').length > 0 ? (
                  sortedMatches
                    .filter(match => match.status === 'scheduled')
                    .map(match => (
                      <MatchCard key={match.id} {...match} />
                    ))
                ) : (
                  <div className="col-span-full py-4 text-center">
                    <p className="text-gray-500">Nenhum jogo agendado com os filtros selecionados.</p>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* Finished Matches */}
          {selectedStatus === 'all' || selectedStatus === 'finished' ? (
            <div>
              <h2 className="text-2xl font-bold text-blue-primary mb-4">Jogos Finalizados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedMatches.filter(match => match.status === 'finished').length > 0 ? (
                  sortedMatches
                    .filter(match => match.status === 'finished')
                    .map(match => (
                      <MatchCard key={match.id} {...match} />
                    ))
                ) : (
                  <div className="col-span-full py-4 text-center">
                    <p className="text-gray-500">Nenhum jogo finalizado com os filtros selecionados.</p>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Matches;
