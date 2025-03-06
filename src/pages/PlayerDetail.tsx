
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, Calendar, Users, Trophy, Flag, Activity, Award } from 'lucide-react';

// Define player interface
interface PlayerStats {
  games: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

interface MatchPerformance {
  id: number;
  date: string;
  opponent: string;
  opponentLogo: string;
  result: 'win' | 'loss' | 'draw';
  score: {
    team: number;
    opponent: number;
  };
  playerStats: {
    goals: number;
    assists: number;
    yellowCard: boolean;
    redCard: boolean;
    minutesPlayed: number;
  };
}

interface Player {
  id: number;
  name: string;
  fullName: string;
  number: number;
  position: string;
  age: number;
  birthdate: string;
  height: string;
  weight: string;
  photo: string;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  category: string;
  stats: PlayerStats;
  achievements: string[];
  matchPerformances: MatchPerformance[];
}

// Mock player data
const playerData: Player[] = [
  {
    id: 201,
    name: 'Pedro Alves',
    fullName: 'Pedro Henrique Alves Santos',
    number: 10,
    position: 'Meia',
    age: 11,
    birthdate: '12/05/2013',
    height: '1.45m',
    weight: '38kg',
    photo: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    team: {
      id: 2,
      name: 'Furacão',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png',
    },
    category: 'SUB-11',
    stats: {
      games: 12,
      goals: 5,
      assists: 4,
      yellowCards: 1,
      redCards: 0,
    },
    achievements: ['Artilheiro Sub-11 2023', 'Campeão Sub-11 2023'],
    matchPerformances: [
      {
        id: 1,
        date: '09/02/2025',
        opponent: 'Federal',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/6.png',
        result: 'win',
        score: {
          team: 6,
          opponent: 0,
        },
        playerStats: {
          goals: 2,
          assists: 1,
          yellowCard: false,
          redCard: false,
          minutesPlayed: 50,
        },
      },
      {
        id: 2,
        date: '23/02/2025',
        opponent: 'Alvinegro',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/1.png',
        result: 'draw',
        score: {
          team: 1,
          opponent: 1,
        },
        playerStats: {
          goals: 1,
          assists: 0,
          yellowCard: true,
          redCard: false,
          minutesPlayed: 45,
        },
      },
    ],
  },
  {
    id: 101,
    name: 'Miguel Santos',
    fullName: 'Miguel Oliveira Santos',
    number: 10,
    position: 'Meia',
    age: 13,
    birthdate: '10/08/2011',
    height: '1.62m',
    weight: '52kg',
    photo: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    team: {
      id: 1,
      name: 'Guerreiros',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/9.png',
    },
    category: 'SUB-13',
    stats: {
      games: 12,
      goals: 8,
      assists: 6,
      yellowCards: 2,
      redCards: 0,
    },
    achievements: ['Artilheiro Sub-13 2024', 'Craque da Temporada 2023'],
    matchPerformances: [
      {
        id: 1,
        date: '09/02/2025',
        opponent: 'Monte',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/2.png',
        result: 'loss',
        score: {
          team: 0,
          opponent: 3,
        },
        playerStats: {
          goals: 0,
          assists: 0,
          yellowCard: true,
          redCard: false,
          minutesPlayed: 60,
        },
      },
      {
        id: 2,
        date: '15/02/2025',
        opponent: 'Monte',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/2.png',
        result: 'loss',
        score: {
          team: 0,
          opponent: 8,
        },
        playerStats: {
          goals: 0,
          assists: 0,
          yellowCard: false,
          redCard: false,
          minutesPlayed: 50,
        },
      },
    ],
  },
];

const PlayerDetail = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const player = playerData.find((p) => p.id === Number(playerId));

  if (!player) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-24 flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Jogador não encontrado</h1>
            <Link to="/teams" className="btn-primary inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Times
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate player stats per game
  const goalsPerGame = (player.stats.goals / player.stats.games).toFixed(2);
  const assistsPerGame = (player.stats.assists / player.stats.games).toFixed(2);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-24 flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Back button */}
          <div className="mb-6">
            <Link
              to={`/teams/${player.team.id}`}
              className="inline-flex items-center text-blue-primary hover:text-blue-light transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para {player.team.name}
            </Link>
          </div>

          {/* Player Header */}
          <div className="glass-card p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-blue-primary">
                  <img
                    src={player.photo}
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-blue-primary text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold">
                  {player.number}
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-blue-primary mb-2">{player.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-3">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {player.position}
                  </span>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {player.category}
                  </span>
                  <div className="flex items-center">
                    <img
                      src={player.team.logo}
                      alt={player.team.name}
                      className="h-6 w-6 object-contain mr-2"
                    />
                    <span className="text-sm font-medium">{player.team.name}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <span className="block text-xs text-gray-500 mb-1">Idade</span>
                    <span className="text-lg font-bold text-blue-primary">{player.age} anos</span>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <span className="block text-xs text-gray-500 mb-1">Altura</span>
                    <span className="text-lg font-bold text-blue-primary">{player.height}</span>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <span className="block text-xs text-gray-500 mb-1">Peso</span>
                    <span className="text-lg font-bold text-blue-primary">{player.weight}</span>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <span className="block text-xs text-gray-500 mb-1">Jogos</span>
                    <span className="text-lg font-bold text-blue-primary">{player.stats.games}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Player Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-blue-primary mb-4">Estatísticas</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-primary mb-1">{player.stats.goals}</div>
                  <div className="text-sm text-gray-500">Gols</div>
                  <div className="text-xs text-gray-400 mt-1">{goalsPerGame}/jogo</div>
                </div>
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-primary mb-1">{player.stats.assists}</div>
                  <div className="text-sm text-gray-500">Assistências</div>
                  <div className="text-xs text-gray-400 mt-1">{assistsPerGame}/jogo</div>
                </div>
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex gap-1 mb-1">
                    <span className="text-xl font-bold text-yellow-500">{player.stats.yellowCards}</span>
                    <span className="text-xl font-bold text-gray-300">/</span>
                    <span className="text-xl font-bold text-red-500">{player.stats.redCards}</span>
                  </div>
                  <div className="text-sm text-gray-500">Cartões</div>
                  <div className="text-xs text-gray-400 mt-1">amarelos/vermelhos</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-blue-primary mb-4">Informações Pessoais</h2>
              <div className="space-y-3">
                <div className="flex">
                  <span className="text-gray-500 w-1/3">Nome Completo:</span>
                  <span className="font-medium">{player.fullName}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-1/3">Data de Nascimento:</span>
                  <span className="font-medium">{player.birthdate}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-1/3">Categoria:</span>
                  <span className="font-medium">{player.category}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-1/3">Posição:</span>
                  <span className="font-medium">{player.position}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-500 w-1/3">Número:</span>
                  <span className="font-medium">{player.number}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="glass-card p-6 mb-8">
            <h2 className="text-xl font-bold text-blue-primary mb-4">Conquistas</h2>
            <div className="flex flex-wrap gap-3">
              {player.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center bg-blue-50 text-blue-primary px-3 py-2 rounded-full"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">{achievement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Match Performances */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-blue-primary mb-4">Desempenho por Partida</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Adversário
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resultado
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gols
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assistências
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cartões
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Minutos
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {player.matchPerformances.map((match) => (
                    <tr key={match.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {match.date}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={match.opponentLogo}
                            alt={match.opponent}
                            className="h-8 w-8 object-contain mr-3"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {match.opponent}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            match.result === 'win'
                              ? 'bg-green-100 text-green-800'
                              : match.result === 'loss'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {match.score.team} x {match.score.opponent}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span className="font-medium text-blue-primary">
                          {match.playerStats.goals}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span className="font-medium">
                          {match.playerStats.assists}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        {match.playerStats.yellowCard && (
                          <span className="inline-block w-4 h-6 bg-yellow-500 mr-1"></span>
                        )}
                        {match.playerStats.redCard && (
                          <span className="inline-block w-4 h-6 bg-red-500"></span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span className="font-medium">
                          {match.playerStats.minutesPlayed}'
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PlayerDetail;
