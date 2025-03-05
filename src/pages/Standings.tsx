
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StandingsTable from '../components/StandingsTable';

// Mock data for team standings
const standingsData = {
  'SUB-11': {
    'A': [
      {
        id: 'furacao-sub11',
        name: 'Furacão',
        logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png',
        played: 2,
        wins: 2,
        draws: 0,
        losses: 0,
        goalsFor: 7,
        goalsAgainst: 0,
        points: 6
      },
      {
        id: 'federal-sub11',
        name: 'Federal',
        logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/6.png',
        played: 2,
        wins: 1,
        draws: 0,
        losses: 1,
        goalsFor: 2,
        goalsAgainst: 7,
        points: 3
      },
      {
        id: 'gremio-sub11',
        name: 'Grêmio',
        logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/Captura-de-tela-2025-02-13-112406.png',
        played: 2,
        wins: 1,
        draws: 0,
        losses: 1,
        goalsFor: 3,
        goalsAgainst: 2,
        points: 3
      },
      {
        id: 'estrela-sub11',
        name: 'Estrela',
        logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/5.png',
        played: 2,
        wins: 1,
        draws: 0,
        losses: 1,
        goalsFor: 4,
        goalsAgainst: 3,
        points: 3
      },
      {
        id: 'alvinegro-sub11',
        name: 'Alvinegro',
        logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/1.png',
        played: 1,
        wins: 0,
        draws: 0,
        losses: 1,
        goalsFor: 1,
        goalsAgainst: 3,
        points: 0
      }
    ],
    'B': [
      {
        id: 'atletico-city-sub11',
        name: 'Atlético City',
        logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/7.png',
        played: 2,
        wins: 2,
        draws: 0,
        losses: 0,
        goalsFor: 6,
        goalsAgainst: 0,
        points: 6
      },
      {
        id: 'monte-sub11',
        name: 'Monte',
        logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/2.png',
        played: 2,
        wins: 2,
        draws: 0,
        losses: 0,
        goalsFor: 6,
        goalsAgainst: 0,
        points: 6
      },
      {
        id: 'guerreiros-sub11',
        name: 'Guerreiros',
        logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/9.png',
        played: 1,
        wins: 0,
        draws: 0,
        losses: 1,
        goalsFor: 0,
        goalsAgainst: 3,
        points: 0
      },
      {
        id: 'lyon-sub11',
        name: 'Lyon',
        logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/lion.png',
        played: 2,
        wins: 0,
        draws: 0,
        losses: 2,
        goalsFor: 0,
        goalsAgainst: 4,
        points: 0
      },
      {
        id: 'bsa-sub11',
        name: 'BSA',
        logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/4.png',
        played: 1,
        wins: 0,
        draws: 0,
        losses: 1,
        goalsFor: 0,
        goalsAgainst: 5,
        points: 0
      }
    ]
  },
  'SUB-13': {
    'A': [
      {
        id: 'gremio-sub13',
        name: 'Grêmio',
        logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/Captura-de-tela-2025-02-13-112406.png',
        played: 2,
        wins: 2,
        draws: 0,
        losses: 0,
        goalsFor: 7,
        goalsAgainst: 1,
        points: 6
      },
      {
        id: 'furacao-sub13',
        name: 'Furacão',
        logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png',
        played: 1,
        wins: 1,
        draws: 0,
        losses: 0,
        goalsFor: 1,
        goalsAgainst: 0,
        points: 3
      },
      {
        id: 'alvinegro-sub13',
        name: 'Alvinegro',
        logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/1.png',
        played: 1,
        wins: 1,
        draws: 0,
        losses: 0,
        goalsFor: 2,
        goalsAgainst: 0,
        points: 3
      },
      {
        id: 'federal-sub13',
        name: 'Federal',
        logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/6.png',
        played: 2,
        wins: 0,
        draws: 0,
        losses: 2,
        goalsFor: 1,
        goalsAgainst: 4,
        points: 0
      },
      {
        id: 'estrela-sub13',
        name: 'Estrela',
        logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/5.png',
        played: 2,
        wins: 0,
        draws: 0,
        losses: 2,
        goalsFor: 0,
        goalsAgainst: 6,
        points: 0
      }
    ],
    'B': [
      {
        id: 'monte-sub13',
        name: 'Monte',
        logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/2.png',
        played: 2,
        wins: 2,
        draws: 0,
        losses: 0,
        goalsFor: 10,
        goalsAgainst: 0,
        points: 6
      },
      {
        id: 'atletico-city-sub13',
        name: 'Atlético City',
        logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/7.png',
        played: 2,
        wins: 1,
        draws: 1,
        losses: 0,
        goalsFor: 5,
        goalsAgainst: 4,
        points: 4
      },
      {
        id: 'lyon-sub13',
        name: 'Lyon',
        logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/lion.png',
        played: 2,
        wins: 0,
        draws: 1,
        losses: 1,
        goalsFor: 3,
        goalsAgainst: 5,
        points: 1
      },
      {
        id: 'bsa-sub13',
        name: 'BSA',
        logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/4.png',
        played: 1,
        wins: 0,
        draws: 0,
        losses: 1,
        goalsFor: 1,
        goalsAgainst: 2,
        points: 0
      },
      {
        id: 'guerreiros-sub13',
        name: 'Guerreiros',
        logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/9.png',
        played: 1,
        wins: 0,
        draws: 0,
        losses: 1,
        goalsFor: 0,
        goalsAgainst: 8,
        points: 0
      }
    ]
  }
};

const Standings = () => {
  const { championshipId } = useParams<{ championshipId?: string }>();
  const [selectedCategory, setSelectedCategory] = useState<string>('SUB-11');
  
  const categories = Object.keys(standingsData);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-24 flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-primary mb-4">
              {championshipId ? 'Classificação do Campeonato' : 'Classificação Geral'}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Confira a tabela de classificação atualizada de cada grupo por categoria.
            </p>
          </div>
          
          {/* Category Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md shadow-sm">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 text-sm font-medium first:rounded-l-lg last:rounded-r-lg transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-primary text-white'
                      : 'bg-white text-blue-primary border border-blue-primary hover:bg-blue-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {/* Standing Tables */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(standingsData[selectedCategory as keyof typeof standingsData]).map(([group, teams]) => (
              <StandingsTable 
                key={`${selectedCategory}-${group}`} 
                teams={teams} 
                category={selectedCategory} 
                group={group} 
              />
            ))}
          </div>
          
          {/* Legend */}
          <div className="glass-card p-6 mt-8">
            <h3 className="text-lg font-semibold text-blue-primary mb-4">Legenda</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex items-center">
                <span className="mr-2">Pos:</span>
                <span className="text-gray-600">Posição</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">J:</span>
                <span className="text-gray-600">Jogos</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-green-600 font-medium">V:</span>
                <span className="text-gray-600">Vitórias</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-yellow-600">E:</span>
                <span className="text-gray-600">Empates</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-red-600">D:</span>
                <span className="text-gray-600">Derrotas</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">GP:</span>
                <span className="text-gray-600">Gols Pró</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">GC:</span>
                <span className="text-gray-600">Gols Contra</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">SG:</span>
                <span className="text-gray-600">Saldo de Gols</span>
              </div>
              <div className="flex items-center">
                <span className="px-2 py-1 mr-2 bg-blue-primary text-white font-bold rounded-md">P:</span>
                <span className="text-gray-600">Pontos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Standings;
