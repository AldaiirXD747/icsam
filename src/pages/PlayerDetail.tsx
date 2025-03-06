
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, User, Award, Calendar, ChevronRight, Shield } from 'lucide-react';

// Mock data for a player
const playerData = {
  '1': {
    id: 1,
    name: 'Carlos Mendes',
    number: 9,
    position: 'Atacante',
    age: 12,
    birthdate: '15/04/2012',
    category: 'SUB-13',
    team: {
      id: 'furacao',
      name: 'Furacão',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png',
      group: 'A'
    },
    photo: 'https://img.freepik.com/fotos-gratis/crianca-masculina-feliz-jogando-futebol-sozinho_23-2148900152.jpg',
    stats: {
      matches: 2,
      goals: 5,
      assists: 2,
      yellowCards: 0,
      redCards: 0
    },
    matchesPlayed: [
      {
        id: 1,
        date: '09/02/2025',
        opponent: 'Federal',
        result: 'Vitória (6-0)',
        goals: 3,
        assists: 1,
        yellowCards: 0,
        redCards: 0
      },
      {
        id: 5,
        date: '09/02/2025',
        opponent: 'Federal',
        result: 'Vitória (1-0)',
        goals: 2,
        assists: 1,
        yellowCards: 0,
        redCards: 0
      }
    ]
  },
  '2': {
    id: 2,
    name: 'Gabriel Costa',
    number: 10,
    position: 'Atacante',
    age: 11,
    birthdate: '22/05/2013',
    category: 'SUB-11',
    team: {
      id: 'guerreiros',
      name: 'Guerreiros',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/9.png',
      group: 'B'
    },
    photo: 'https://img.freepik.com/fotos-gratis/menino-com-bola-isolada-na-parede-branca_231208-1392.jpg',
    stats: {
      matches: 1,
      goals: 2,
      assists: 0,
      yellowCards: 1,
      redCards: 0
    },
    matchesPlayed: [
      {
        id: 10,
        date: '15/02/2025',
        opponent: 'Monte',
        result: 'Derrota (0-3)',
        goals: 2,
        assists: 0,
        yellowCards: 1,
        redCards: 0
      }
    ]
  }
};

const PlayerDetail = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const player = playerId ? playerData[playerId as keyof typeof playerData] : undefined;
  
  if (!player) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-24 flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-primary mb-4">Jogador não encontrado</h1>
            <p className="text-gray-600 mb-8">O jogador que você está procurando não existe.</p>
            <Link to="/teams" className="btn-primary">
              Voltar para Times
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-24 flex-grow">
        <div className="container mx-auto px-4 py-8">
          <Link to={`/teams/${player.team.id}`} className="inline-flex items-center mb-8 text-blue-primary hover:text-blue-light transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Voltar para {player.team.name}
          </Link>
          
          {/* Player Header */}
          <div className="glass-card overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-primary to-blue-light p-8">
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-6 md:mb-0 md:mr-8 border-4 border-white">
                  <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center md:text-left text-white">
                  <div className="flex items-center justify-center md:justify-start mb-2">
                    <h1 className="text-4xl font-bold mr-3">{player.name}</h1>
                    <span className="bg-white text-blue-primary rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold">
                      {player.number}
                    </span>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
                    <div className="flex items-center">
                      <User size={18} className="mr-2" />
                      <span>{player.position}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={18} className="mr-2" />
                      <span>{player.age} anos ({player.birthdate})</span>
                    </div>
                    <div className="flex items-center">
                      <Award size={18} className="mr-2" />
                      <span>{player.category}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center md:justify-start">
                    <img 
                      src={player.team.logo} 
                      alt={player.team.name} 
                      className="w-8 h-8 object-contain mr-2"
                    />
                    <Link 
                      to={`/teams/${player.team.id}`} 
                      className="text-white hover:underline flex items-center"
                    >
                      {player.team.name} - Grupo {player.team.group}
                      <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-gray-200">
              <div className="p-4 text-center">
                <div className="text-3xl font-bold text-blue-primary">{player.stats.matches}</div>
                <div className="text-gray-600 text-sm">Jogos</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-3xl font-bold text-blue-primary">{player.stats.goals}</div>
                <div className="text-gray-600 text-sm">Gols</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-3xl font-bold text-blue-primary">{player.stats.assists}</div>
                <div className="text-gray-600 text-sm">Assistências</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-3xl font-bold text-yellow-500">{player.stats.yellowCards}</div>
                <div className="text-gray-600 text-sm">Amarelos</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-3xl font-bold text-red-500">{player.stats.redCards}</div>
                <div className="text-gray-600 text-sm">Vermelhos</div>
              </div>
            </div>
          </div>
          
          {/* Match History */}
          <div className="glass-card p-6">
            <h2 className="text-2xl font-semibold text-blue-primary mb-6">Histórico de Jogos</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-blue-primary text-white">
                  <tr>
                    <th className="py-3 px-4 text-left">Data</th>
                    <th className="py-3 px-4 text-left">Adversário</th>
                    <th className="py-3 px-4 text-center">Resultado</th>
                    <th className="py-3 px-4 text-center">Gols</th>
                    <th className="py-3 px-4 text-center">Assistências</th>
                    <th className="py-3 px-4 text-center">Cartões</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {player.matchesPlayed.map(match => (
                    <tr key={match.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{match.date}</td>
                      <td className="py-3 px-4">{match.opponent}</td>
                      <td className="py-3 px-4 text-center">{match.result}</td>
                      <td className="py-3 px-4 text-center font-semibold text-blue-primary">{match.goals}</td>
                      <td className="py-3 px-4 text-center font-semibold text-green-600">{match.assists}</td>
                      <td className="py-3 px-4 text-center">
                        {match.yellowCards > 0 && (
                          <span className="inline-block w-4 h-6 bg-yellow-500 mr-1"></span>
                        )}
                        {match.redCards > 0 && (
                          <span className="inline-block w-4 h-6 bg-red-500"></span>
                        )}
                        {match.yellowCards === 0 && match.redCards === 0 && (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {player.matchesPlayed.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Este jogador ainda não participou de nenhuma partida.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PlayerDetail;
