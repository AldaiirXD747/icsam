
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TeamCard from '../components/TeamCard';
import { Search } from 'lucide-react';

// Mock data for teams with numeric ids
const teamsData = [
  {
    id: 1,
    name: 'Guerreiros',
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/9.png',
    categories: ['SUB-11', 'SUB-13'],
    group: 'B',
    foundingYear: '2020',
    location: 'Santa Maria, DF',
    coach: 'Carlos Silva',
    players: 18
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
    players: 22
  },
  {
    id: 3,
    name: 'Atlético City',
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/7.png',
    categories: ['SUB-11', 'SUB-13'],
    group: 'B',
    foundingYear: '2019',
    location: 'Taguatinga, DF',
    coach: 'Paulo Mendes',
    players: 20
  },
  {
    id: 4,
    name: 'Federal',
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/6.png',
    categories: ['SUB-11', 'SUB-13'],
    group: 'A',
    foundingYear: '2015',
    location: 'Plano Piloto, DF',
    coach: 'João Ferreira',
    players: 24
  },
  {
    id: 5,
    name: 'Estrela',
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/5.png',
    categories: ['SUB-11', 'SUB-13'],
    group: 'A',
    foundingYear: '2017',
    location: 'Ceilândia, DF',
    coach: 'Marcos Souza',
    players: 19
  },
  {
    id: 6,
    name: 'BSA',
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/4.png',
    categories: ['SUB-11', 'SUB-13'],
    group: 'B',
    foundingYear: '2016',
    location: 'Sobradinho, DF',
    coach: 'Rafael Costa',
    players: 21
  },
  {
    id: 7,
    name: 'Monte',
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/2.png',
    categories: ['SUB-11', 'SUB-13'],
    group: 'B',
    foundingYear: '2014',
    location: 'Planaltina, DF',
    coach: 'Pedro Lima',
    players: 23
  },
  {
    id: 8,
    name: 'Alvinegro',
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/1.png',
    categories: ['SUB-11', 'SUB-13'],
    group: 'A',
    foundingYear: '2019',
    location: 'Águas Claras, DF',
    coach: 'André Santos',
    players: 20
  },
  {
    id: 9,
    name: 'Lyon',
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/lion.png',
    categories: ['SUB-11', 'SUB-13'],
    group: 'B',
    foundingYear: '2020',
    location: 'Samambaia, DF',
    coach: 'Gustavo Oliveira',
    players: 19
  },
  {
    id: 10,
    name: 'Grêmio',
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/Captura-de-tela-2025-02-13-112406.png',
    categories: ['SUB-11', 'SUB-13'],
    group: 'A',
    foundingYear: '2018',
    location: 'Recanto das Emas, DF',
    coach: 'Luciano Pereira',
    players: 22
  }
];

const Teams = () => {
  const { championshipId } = useParams<{ championshipId?: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter teams based on search term, group, and category
  const filteredTeams = teamsData.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || team.group === selectedGroup;
    const matchesCategory = selectedCategory === 'all' || team.categories.includes(selectedCategory);
    return matchesSearch && matchesGroup && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-24 flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-primary mb-4">
              {championshipId ? 'Times do Campeonato' : 'Todos os Times'}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Conheça os times que participam {championshipId ? 'deste campeonato' : 'dos nossos campeonatos'} 
              e acompanhe seu desempenho ao longo da competição.
            </p>
          </div>

          {/* Filters */}
          <div className="glass-card p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              {/* Group Filter */}
              <div>
                <label htmlFor="group-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por Grupo
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

              {/* Category Filter */}
              <div>
                <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por Categoria
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
            </div>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.length > 0 ? (
              filteredTeams.map(team => (
                <TeamCard
                  key={team.id}
                  id={team.id}
                  name={team.name}
                  logo={team.logo}
                  categories={team.categories}
                  group={team.group}
                />
              ))
            ) : (
              <div className="col-span-full py-8 text-center">
                <p className="text-lg text-gray-500">Nenhum time encontrado com os filtros selecionados.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Teams;
