import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MatchCard from '../components/MatchCard';
import { Calendar, Search, Filter } from 'lucide-react';

// Define types to match MatchCard component requirements
type MatchStatus = 'scheduled' | 'live' | 'finished';

// Mock data for matches with the correct status types
const matchesData = [
  {
    id: 1,
    homeTeam: {
      name: 'Furacão',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png',
      score: 6
    },
    awayTeam: {
      name: 'Federal',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/6.png',
      score: 0
    },
    category: 'SUB-11',
    date: '09/02/2025',
    time: '09:00',
    group: 'A',
    status: 'finished' as MatchStatus,
    venue: 'Campo Sintético - Quadra 120'
  },
  {
    id: 2,
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
    time: '10:30',
    group: 'A',
    status: 'finished' as MatchStatus,
    venue: 'Campo Sintético - Quadra 120'
  },
  {
    id: 3,
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
    time: '09:00',
    group: 'B',
    status: 'finished' as MatchStatus,
    venue: 'Campo Sintético - Quadra 120'
  },
  {
    id: 4,
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
    status: 'finished' as MatchStatus,
    venue: 'Campo Sintético - Quadra 120'
  },
  {
    id: 5,
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
    status: 'finished' as MatchStatus,
    venue: 'Campo Sintético - Quadra 120'
  },
  {
    id: 6,
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
    time: '10:30',
    group: 'A',
    status: 'finished' as MatchStatus,
    venue: 'Campo Sintético - Quadra 120'
  },
  {
    id: 7,
    homeTeam: {
      name: 'Federal',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/6.png',
      score: 2
    },
    awayTeam: {
      name: 'Grêmio',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/Captura-de-tela-2025-02-13-112406.png',
      score: 1
    },
    category: 'SUB-11',
    date: '16/02/2025',
    time: '09:00',
    group: 'A',
    status: 'finished' as MatchStatus,
    venue: 'Campo Sintético - Quadra 120'
  },
  {
    id: 8,
    homeTeam: {
      name: 'Estrela',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/5.png',
      score: 3
    },
    awayTeam: {
      name: 'Alvinegro',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/1.png',
      score: 1
    },
    category: 'SUB-11',
    date: '16/02/2025',
    time: '10:30',
    group: 'A',
    status: 'finished' as MatchStatus,
    venue: 'Campo Sintético - Quadra 120'
  },
  {
    id: 9,
    homeTeam: {
      name: 'Atlético City',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/7.png',
      score: 1
    },
    awayTeam: {
      name: 'Lyon',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/lion.png',
      score: 0
    },
    category: 'SUB-11',
    date: '15/02/2025',
    time: '09:00',
    group: 'B',
    status: 'finished' as MatchStatus,
    venue: 'Campo Sintético - Quadra 120'
  },
  {
    id: 10,
    homeTeam: {
      name: 'Monte',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/2.png',
      score: 3
    },
    awayTeam: {
      name: 'Guerreiros',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/9.png',
      score: 0
    },
    category: 'SUB-11',
    date: '15/02/2025',
    time: '10:30',
    group: 'B',
    status: 'finished' as MatchStatus,
    venue: 'Campo Sintético - Quadra 120'
  },
  {
    id: 11,
    homeTeam: {
      name: 'Federal',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/6.png',
      score: 0
    },
    awayTeam: {
      name: 'Estrela',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/5.png',
      score: 0
    },
    category: 'SUB-11',
    date: '23/02/2025',
    time: '09:00',
    group: 'A',
    status: 'scheduled' as MatchStatus,
    venue: 'Campo Sintético - Quadra 120'
  },
  {
    id: 12,
    homeTeam: {
      name: 'Alvinegro',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/1.png',
      score: 0
    },
    awayTeam: {
      name: 'Furacão',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png',
      score: 0
    },
    category: 'SUB-11',
    date: '23/02/2025',
    time: '10:30',
    group: 'A',
    status: 'scheduled' as MatchStatus,
    venue: 'Campo Sintético - Quadra 120'
  },
  {
    id: 13,
    homeTeam: {
      name: 'Atlético City',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/7.png',
      score: 0
    },
    awayTeam: {
      name: 'Guerreiros',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/9.png',
      score: 0
    },
    category: 'SUB-11',
    date: '22/02/2025',
    time: '09:00',
    group: 'B',
    status: 'scheduled' as MatchStatus,
    venue: 'Campo Sintético - Quadra 120'
  }
];

const Matches = () => {
  const { championshipId } = useParams<{ championshipId?: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Filter matches based on search term, category, group, and status
  const filteredMatches = matchesData.filter(match => {
    const matchesSearch = 
      match.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      match.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || match.category === selectedCategory;
    const matchesGroup = selectedGroup === 'all' || match.group === selectedGroup;
    const matchesStatus = selectedStatus === 'all' || match.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesGroup && matchesStatus;
  });

  // Group matches by date
  const groupedMatches = filteredMatches.reduce((groups, match) => {
    if (!groups[match.date]) {
      groups[match.date] = [];
    }
    groups[match.date].push(match);
    return groups;
  }, {} as Record<string, typeof matchesData>);

  // Get unique dates and sort them
  const dates = Object.keys(groupedMatches).sort((a, b) => {
    const dateA = new Date(a.split('/').reverse().join('/'));
    const dateB = new Date(b.split('/').reverse().join('/'));
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-24 flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-primary mb-4">
              {championshipId ? 'Jogos do Campeonato' : 'Todos os Jogos'}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Confira os jogos {championshipId ? 'deste campeonato' : 'de todos os campeonatos'}, 
              resultados e próximos confrontos.
            </p>
          </div>

          {/* Filters */}
          <div className="glass-card p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-primary"
                  placeholder="Buscar time..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

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
                  <option value="finished">Concluídos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Matches by Date */}
          {dates.length > 0 ? (
            dates.map(date => (
              <div key={date} className="mb-10">
                <div className="flex items-center mb-4">
                  <Calendar className="text-blue-primary mr-2" />
                  <h2 className="text-xl font-semibold text-blue-primary">{date}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedMatches[date].map(match => (
                    <MatchCard key={match.id} {...match} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">Nenhum jogo encontrado com os filtros selecionados.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Matches;
