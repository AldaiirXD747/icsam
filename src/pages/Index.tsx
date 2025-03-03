
import { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import TeamRegistration from '@/components/TeamRegistration';
import TopScorers from '@/components/TopScorers';
import MatchCard from '@/components/MatchCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Mock data for upcoming matches
const upcomingMatches = [
  {
    id: 1,
    homeTeam: {
      name: 'Federal',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/6.png',
    },
    awayTeam: {
      name: 'Estrela',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/5.png',
    },
    category: 'SUB-11',
    date: '23/02/2025',
    time: '09:00',
    group: 'A',
    status: 'scheduled' as const,
    venue: 'Campo do Instituto'
  },
  {
    id: 2,
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
    status: 'scheduled' as const,
    venue: 'Campo do Instituto'
  },
  {
    id: 3,
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
    status: 'finished' as const,
    venue: 'Campo do Instituto'
  },
  {
    id: 4,
    homeTeam: {
      name: 'BSA',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/4.png',
      score: 1
    },
    awayTeam: {
      name: 'Atlético City',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/7.png',
      score: 3
    },
    category: 'SUB-13',
    date: '15/02/2025',
    time: '11:00',
    group: 'B',
    status: 'live' as const,
    venue: 'Campo do Instituto'
  }
];

// Mock data for standings
const standings = [
  { 
    team: 'Furacão', 
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png',
    played: 2, 
    won: 2, 
    drawn: 0, 
    lost: 0, 
    goalsFor: 7, 
    goalsAgainst: 0, 
    points: 6, 
    group: 'A', 
    category: 'SUB-11' 
  },
  { 
    team: 'Grêmio Ocidental', 
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/Captura-de-tela-2025-02-13-112406.png',
    played: 2, 
    won: 1, 
    drawn: 0, 
    lost: 1, 
    goalsFor: 5, 
    goalsAgainst: 2, 
    points: 3, 
    group: 'A', 
    category: 'SUB-11' 
  },
  { 
    team: 'Federal', 
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/6.png',
    played: 2, 
    won: 1, 
    drawn: 0, 
    lost: 1, 
    goalsFor: 2, 
    goalsAgainst: 7, 
    points: 3, 
    group: 'A', 
    category: 'SUB-11' 
  },
  { 
    team: 'Estrela', 
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/5.png',
    played: 2, 
    won: 1, 
    drawn: 0, 
    lost: 1, 
    goalsFor: 3, 
    goalsAgainst: 3, 
    points: 3, 
    group: 'A', 
    category: 'SUB-11' 
  },
  { 
    team: 'Alvinegro', 
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/1.png',
    played: 1, 
    won: 0, 
    drawn: 0, 
    lost: 1, 
    goalsFor: 1, 
    goalsAgainst: 3, 
    points: 0, 
    group: 'A', 
    category: 'SUB-11' 
  },
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('SUB-11');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredStandings = standings.filter(team => team.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        
        {/* Matches Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-lime-primary bg-opacity-20 px-4 py-1.5 rounded-full mb-2">
                <span className="text-blue-primary font-medium text-sm">Acompanhe os Jogos</span>
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-primary">Próximos Confrontos</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Confira os resultados dos jogos anteriores e os próximos confrontos do campeonato.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingMatches.map((match, index) => (
                <div 
                  key={match.id} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <MatchCard {...match} />
                </div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <a href="/matches" className="btn-primary inline-flex items-center">
                Ver Todos os Jogos
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>
        
        {/* Standings Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-lime-primary bg-opacity-20 px-4 py-1.5 rounded-full mb-2">
                <span className="text-blue-primary font-medium text-sm">Classificação</span>
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-primary">Tabela de Classificação</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Acompanhe a classificação dos times no Campeonato Base Forte 2025.
              </p>
              
              <div className="flex justify-center mt-6 mb-8">
                <div className="inline-flex rounded-md shadow-sm">
                  <button
                    onClick={() => setSelectedCategory('SUB-11')}
                    className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                      selectedCategory === 'SUB-11'
                        ? 'bg-blue-primary text-white'
                        : 'bg-white text-blue-primary border border-blue-primary hover:bg-blue-50'
                    }`}
                  >
                    SUB-11
                  </button>
                  <button
                    onClick={() => setSelectedCategory('SUB-13')}
                    className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                      selectedCategory === 'SUB-13'
                        ? 'bg-blue-primary text-white'
                        : 'bg-white text-blue-primary border border-blue-primary hover:bg-blue-50'
                    }`}
                  >
                    SUB-13
                  </button>
                </div>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto glass-card overflow-hidden animate-scale-in">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-primary text-white">
                      <th className="px-4 py-3 text-left">Pos</th>
                      <th className="px-4 py-3 text-left">Time</th>
                      <th className="px-4 py-3 text-center">P</th>
                      <th className="px-4 py-3 text-center">J</th>
                      <th className="px-4 py-3 text-center">V</th>
                      <th className="px-4 py-3 text-center">E</th>
                      <th className="px-4 py-3 text-center">D</th>
                      <th className="px-4 py-3 text-center">GP</th>
                      <th className="px-4 py-3 text-center">GC</th>
                      <th className="px-4 py-3 text-center">SG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      // Loading skeleton
                      Array(5).fill(0).map((_, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="px-4 py-3">
                            <div className="h-4 bg-gray-200 rounded animate-pulse w-4"></div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse mr-3"></div>
                              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                            </div>
                          </td>
                          {Array(8).fill(0).map((_, i) => (
                            <td key={i} className="px-4 py-3 text-center">
                              <div className="h-4 bg-gray-200 rounded animate-pulse w-4 mx-auto"></div>
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      filteredStandings.map((team, index) => (
                        <tr 
                          key={team.team} 
                          className={`border-b border-gray-200 ${
                            index < 3 ? 'bg-green-50' : ''
                          }`}
                        >
                          <td className="px-4 py-3 font-medium">{index + 1}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              <img 
                                src={team.logo} 
                                alt={team.team} 
                                className="w-8 h-8 object-contain mr-3"
                              />
                              <span className="font-medium">{team.team}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center font-bold">{team.points}</td>
                          <td className="px-4 py-3 text-center">{team.played}</td>
                          <td className="px-4 py-3 text-center">{team.won}</td>
                          <td className="px-4 py-3 text-center">{team.drawn}</td>
                          <td className="px-4 py-3 text-center">{team.lost}</td>
                          <td className="px-4 py-3 text-center">{team.goalsFor}</td>
                          <td className="px-4 py-3 text-center">{team.goalsAgainst}</td>
                          <td className="px-4 py-3 text-center">{team.goalsFor - team.goalsAgainst}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
        
        {/* Top Scorers Section */}
        <TopScorers />
        
        {/* Team Registration Section */}
        <TeamRegistration />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
