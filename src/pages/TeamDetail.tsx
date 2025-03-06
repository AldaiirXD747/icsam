import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, MapPin, Trophy, Users, User, ArrowLeft } from 'lucide-react';

interface Player {
  id: number;
  name: string;
  number: number;
  position: string;
  age: number;
  photo?: string;
  stats: {
    games: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  };
}

interface TeamMatch {
  id: number;
  date: string;
  opponent: string;
  opponentLogo: string;
  result: 'win' | 'loss' | 'draw';
  score: {
    team: number;
    opponent: number;
  };
  category: string;
}

interface Team {
  id: number;
  name: string;
  logo: string;
  categories: string[];
  group: string;
  foundingYear: string;
  location: string;
  coach: string;
  assistantCoach: string;
  director: string;
  colors: string;
  stadium: string;
  achievements: string[];
  players: Player[];
  matchHistory: TeamMatch[];
}

const TeamDetail = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [team, setTeam] = useState<Team | null>(null);

  useEffect(() => {
    const mockTeam = teamsData.find(t => t.id === Number(teamId));
    setTeam(mockTeam || null);
  }, [teamId]);

  if (!team) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Time não encontrado</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/teams" className="flex items-center mb-6 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar para Times
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-6">
            <img src={team.logo} alt={team.name} className="w-32 h-32 object-contain" />
            <div>
              <h1 className="text-3xl font-bold mb-2">{team.name}</h1>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  {team.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <Trophy className="w-5 h-5 mr-2" />
                  Grupo {team.group}
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  Fundado em {team.foundingYear}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Informações do Time</h2>
            <div className="space-y-3">
              <p><strong>Categorias:</strong> {team.categories.join(', ')}</p>
              <p><strong>Cores:</strong> {team.colors}</p>
              <p><strong>Estádio:</strong> {team.stadium}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Comissão Técnica</h2>
            <div className="space-y-3">
              <p><strong>Técnico:</strong> {team.coach}</p>
              <p><strong>Auxiliar Técnico:</strong> {team.assistantCoach}</p>
              <p><strong>Diretor:</strong> {team.director}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Conquistas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                <span>{achievement}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Jogadores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {team.players.map((player) => (
              <Link key={player.id} to={`/players/${player.id}`} className="block">
                <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-w-1 aspect-h-1 mb-4">
                    <img
                      src={player.photo || '/placeholder.svg'}
                      alt={player.name}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="font-semibold">{player.name}</h3>
                  <p className="text-sm text-gray-600">#{player.number} - {player.position}</p>
                  <div className="mt-2 text-sm">
                    <p>Jogos: {player.stats.games}</p>
                    <p>Gols: {player.stats.goals}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Histórico de Partidas</h2>
          <div className="space-y-4">
            {team.matchHistory.map((match) => (
              <div key={match.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">{match.date}</div>
                    <div className="font-semibold">{match.category}</div>
                  </div>
                  <div className={`text-sm font-semibold ${
                    match.result === 'win' ? 'text-green-600' :
                    match.result === 'loss' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {match.result === 'win' ? 'Vitória' :
                     match.result === 'loss' ? 'Derrota' :
                     'Empate'}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <img src={team.logo} alt={team.name} className="w-8 h-8 object-contain" />
                    <span className="font-semibold">{team.name}</span>
                  </div>
                  <div className="font-bold text-lg">{match.score.team} - {match.score.opponent}</div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{match.opponent}</span>
                    <img src={match.opponentLogo} alt={match.opponent} className="w-8 h-8 object-contain" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const teamsData: Team[] = [
  {
    id: 1,
    name: 'Guerreiros',
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/9.png',
    categories: ['SUB-11', 'SUB-13'],
    group: 'B',
    foundingYear: '2020',
    location: 'Santa Maria, DF',
    coach: 'Carlos Silva',
    assistantCoach: 'Roberto Pereira',
    director: 'Antônio Gomes',
    colors: 'Vermelho e Branco',
    stadium: 'Campo do Instituto Santa Maria',
    achievements: ['Vice-campeão Sub-11 (2023)', 'Campeão Sub-13 (2022)'],
    players: [
      {
        id: 101,
        name: 'Miguel Santos',
        number: 10,
        position: 'Meia',
        age: 13,
        photo: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        stats: {
          games: 12,
          goals: 8,
          assists: 6,
          yellowCards: 2,
          redCards: 0,
        },
      },
      {
        id: 102,
        name: 'João Pedro',
        number: 9,
        position: 'Atacante',
        age: 13,
        photo: 'https://images.unsplash.com/photo-1560761098-22010169a486?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        stats: {
          games: 12,
          goals: 5,
          assists: 3,
          yellowCards: 1,
          redCards: 0,
        },
      },
      {
        id: 103,
        name: 'Lucas Oliveira',
        number: 1,
        position: 'Goleiro',
        age: 13,
        photo: 'https://images.unsplash.com/photo-1599834562135-b6fc90e642ca?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        stats: {
          games: 12,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
        },
      },
    ],
    matchHistory: [
      {
        id: 1001,
        date: '09/02/2025',
        opponent: 'Monte',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/2.png',
        result: 'loss',
        score: {
          team: 0,
          opponent: 3,
        },
        category: 'SUB-11',
      },
      {
        id: 1002,
        date: '15/02/2025',
        opponent: 'Monte',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/2.png',
        result: 'loss',
        score: {
          team: 0,
          opponent: 8,
        },
        category: 'SUB-13',
      },
    ],
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
    assistantCoach: 'Marcos Souza',
    director: 'Paulo Ferreira',
    colors: 'Vermelho e Preto',
    stadium: 'Arena Gama',
    achievements: ['Campeão Sub-11 (2023)', 'Campeão Sub-13 (2023)'],
    players: [
      {
        id: 201,
        name: 'Pedro Alves',
        number: 10,
        position: 'Meia',
        age: 11,
        photo: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        stats: {
          games: 12,
          goals: 5,
          assists: 4,
          yellowCards: 1,
          redCards: 0,
        },
      },
      {
        id: 202,
        name: 'Gabriel Costa',
        number: 9,
        position: 'Atacante',
        age: 11,
        photo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        stats: {
          games: 12,
          goals: 6,
          assists: 2,
          yellowCards: 0,
          redCards: 0,
        },
      },
      {
        id: 203,
        name: 'Rafael Lima',
        number: 1,
        position: 'Goleiro',
        age: 11,
        photo: 'https://images.unsplash.com/photo-1599834562135-b6fc90e642ca?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        stats: {
          games: 12,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
        },
      },
      {
        id: 204,
        name: 'Bruno Silva',
        number: 5,
        position: 'Zagueiro',
        age: 13,
        photo: 'https://images.unsplash.com/photo-1564164841584-391b5139b8b6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        stats: {
          games: 10,
          goals: 1,
          assists: 0,
          yellowCards: 3,
          redCards: 0,
        },
      },
      {
        id: 205,
        name: 'Thiago Santos',
        number: 7,
        position: 'Ponta',
        age: 13,
        photo: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        stats: {
          games: 12,
          goals: 4,
          assists: 6,
          yellowCards: 1,
          redCards: 0,
        },
      },
    ],
    matchHistory: [
      {
        id: 2001,
        date: '09/02/2025',
        opponent: 'Federal',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/6.png',
        result: 'win',
        score: {
          team: 6,
          opponent: 0,
        },
        category: 'SUB-11',
      },
      {
        id: 2002,
        date: '09/02/2025',
        opponent: 'Federal',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/6.png',
        result: 'win',
        score: {
          team: 1,
          opponent: 0,
        },
        category: 'SUB-13',
      },
      {
        id: 2003,
        date: '23/02/2025',
        opponent: 'Alvinegro',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/1.png',
        result: 'draw',
        score: {
          team: 1,
          opponent: 1,
        },
        category: 'SUB-11',
      },
    ],
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
    assistantCoach: 'Juliano Costa',
    director: 'Ricardo Alves',
    colors: 'Azul e Branco',
    stadium: 'Estádio Elmo Serejo',
    achievements: ['Campeão Invicto Sub-11 (2022)', 'Vice-campeão Sub-13 (2021)'],
    players: [
      {
        id: 301,
        name: 'João Costa',
        number: 7,
        position: 'Atacante',
        age: 12,
        photo: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        stats: {
          games: 12,
          goals: 7,
          assists: 5,
          yellowCards: 0,
          redCards: 0,
        },
      },
      {
        id: 302,
        name: 'Enzo Gabriel',
        number: 8,
        position: 'Meia',
        age: 12,
        photo: 'https://images.unsplash.com/photo-1544006652-940e95836621?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        stats: {
          games: 12,
          goals: 4,
          assists: 3,
          yellowCards: 1,
          redCards: 0,
        },
      },
      {
        id: 303,
        name: 'Davi Lucas',
        number: 1,
        position: 'Goleiro',
        age: 12,
        photo: 'https://images.unsplash.com/photo-1599834562135-b6fc90e642ca?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        stats: {
          games: 12,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
        },
      },
    ],
    matchHistory: [
      {
        id: 3001,
        date: '09/02/2025',
        opponent: 'BSA',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/4.png',
        result: 'win',
        score: {
          team: 2,
          opponent: 1,
        },
        category: 'SUB-13',
      },
      {
        id: 3002,
        date: '09/02/2025',
        opponent: 'BSA',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/4.png',
        result: 'win',
        score: {
          team: 5,
          opponent: 0,
        },
        category: 'SUB-11',
      },
      {
        id: 3003,
        date: '15/02/2025',
        opponent: 'Lyon',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/lion.png',
        result: 'draw',
        score: {
          team: 3,
          opponent: 3,
        },
        category: 'SUB-13',
      },
    ],
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
    assistantCoach: 'Lucas Pereira',
    director: 'Carlos Eduardo',
    colors: 'Verde e Amarelo',
    stadium: 'Estádio Mané Garrincha',
    achievements: ['Campeão Candango Sub-11 (2020)', 'Vice-campeão Sub-13 (2019)'],
    players: [
      {
        id: 401,
        name: 'Lucas Silva',
        number: 10,
        position: 'Meia',
        age: 11,
        photo: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        stats: {
          games: 12,
          goals: 9,
          assists: 7,
          yellowCards: 1,
          redCards: 0,
        },
      },
      {
        id: 402,
        name: 'Matheus Oliveira',
        number: 9,
        position: 'Atacante',
        age: 11,
        photo: 'https://images.unsplash.com/photo-1508341591423-4347099e1f19?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        stats: {
          games: 12,
          goals: 6,
          assists: 3,
          yellowCards: 0,
          redCards: 0,
        },
      },
      {
        id: 403,
        name: 'Gustavo Henrique',
        number: 1,
        position: 'Goleiro',
        age: 11,
        photo: 'https://images.unsplash.com/photo-1599834562135-b6fc90e642ca?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        stats: {
          games: 12,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
        },
      },
    ],
    matchHistory: [
      {
        id: 4001,
        date: '09/02/2025',
        opponent: 'Furacão',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png',
        result: 'loss',
        score: {
          team: 0,
          opponent: 6,
        },
        category: 'SUB-11',
      },
      {
        id: 4002,
        date: '09/02/2025',
        opponent: 'Furacão',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png',
        result: 'loss',
        score: {
          team: 0,
          opponent: 1,
        },
        category: 'SUB-13',
      },
      {
        id: 4003,
        date: '16/02/2025',
        opponent: 'Grêmio Ocidental',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/Captura-de-tela-2025-02-13-112406.png',
        result: 'win',
        score: {
          team: 2,
          opponent: 1,
        },
        category: 'SUB-11',
      },
    ],
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
    assistantCoach: 'Felipe Almeida',
    director: 'Renato Silva',
    colors: 'Branco e Azul',
    stadium: 'Estádio Abadião',
    achievements: ['Campeão da Copa Brasília Sub-13 (2021)', 'Vice-campeão Sub-11 (2018)'],
    players: [
      {
        id: 501,
        name: 'Vinícius Oliveira',
        number: 7,
        position: 'Atacante',
        age: 12,
        photo: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        stats: {
          games: 12,
          goals: 6,
          assists: 4,
          yellowCards: 0,
          redCards: 0,
        },
      },
      {
        id: 502,
        name: 'Thiago Costa',
        number: 8,
        position: 'Meia',
        age: 12,
        photo: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        stats: {
          games: 12,
          goals: 3,
          assists: 5,
          yellowCards: 1,
          redCards: 0,
        },
      },
      {
        id: 503,
        name: 'Pedro Henrique',
        number: 1,
        position: 'Goleiro',
        age: 12,
        photo: 'https://images.unsplash.com/photo-1599834562135-b6fc90e642ca?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        stats: {
          games: 12,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
        },
      },
    ],
    matchHistory: [
      {
        id: 5001,
        date: '09/02/2025',
        opponent: 'Grêmio Ocidental',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/Captura-de-tela-2025-02-13-112406.png',
        result: 'loss',
        score: {
          team: 0,
          opponent: 4,
        },
        category: 'SUB-13',
      },
      {
        id: 5002,
        date: '09/02/2025',
        opponent: 'Grêmio Ocidental',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/Captura-de-tela-2025-02-13-112406.png',
        result: 'loss',
        score: {
          team: 1,
          opponent: 2,
        },
        category: 'SUB-11',
      },
      {
        id: 5003,
        date: '16/02/2025',
        opponent: 'Alvinegro',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/1.png',
        result: 'loss',
        score: {
          team: 0,
          opponent: 2,
        },
        category: 'SUB-13',
      },
    ],
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
    assistantCoach: 'Daniel Alves',
    director: 'Fernando Santos',
    colors: 'Azul e Branco',
    stadium: 'Estádio Augustinho Lima',
    achievements: ['Campeão da Liga Candanga Sub-13 (2022)', 'Vice-campeão Sub-11 (2021)'],
    players: [
      {
        id: 601,
        name: 'Gabriel Santos',
        number: 7,
        position: 'Atacante',
        age: 12,
        photo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        stats: {
          games: 12,
          goals: 8,
          assists: 5,
          yellowCards: 1,
          redCards: 0,
        },
      },
      {
        id: 602,
        name: 'Lucas Oliveira',
        number: 8,
        position: 'Meia',
        age: 12,
        photo: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        stats: {
          games: 12,
          goals: 4,
          assists: 6,
          yellowCards: 0,
          redCards: 0,
        },
      },
      {
        id: 603,
        name: 'Matheus Costa',
        number: 1,
        position: 'Goleiro',
        age: 12,
        photo: 'https://images.unsplash.com/photo-1599834562135-b6fc90e642ca?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        stats: {
          games: 12,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
        },
      },
    ],
    matchHistory: [
      {
        id: 6001,
        date: '09/02/2025',
        opponent: 'Atlético City',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/7.png',
        result: 'loss',
        score: {
          team: 1,
          opponent: 2,
        },
        category: 'SUB-13',
      },
      {
        id: 6002,
        date: '09/02/2025',
        opponent: 'Atlético City',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/7.png',
        result: 'loss',
        score: {
          team: 0,
          opponent: 5,
        },
        category: 'SUB-11',
      },
      {
        id: 6003,
        date: '22/02/2025',
        opponent: 'Lyon',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/lion.png',
        result: 'win',
        score: {
          team: 2,
          opponent: 1,
        },
        category: 'SUB-13',
      },
    ],
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
    assistantCoach: 'Ricardo Oliveira',
    director: 'Sérgio Mendes',
    colors: 'Verde e Branco',
    stadium: 'Estádio Adonir José de Vargas',
    achievements: ['Campeão Brasiliense Sub-13 (2020)', 'Vice-campeão Sub-11 (2017)'],
    players: [
      {
        id: 701,
        name: 'Rafael Lima',
        number: 7,
        position: 'Atacante',
        age: 13,
        photo: 'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        stats: {
          games: 12,
          goals: 10,
          assists: 6,
          yellowCards: 0,
          redCards: 0,
        },
      },
      {
        id: 702,
        name: 'Gustavo Santos',
        number: 8,
        position: 'Meia',
        age: 13,
        photo: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        stats: {
          games: 12,
          goals: 5,
          assists: 7,
          yellowCards: 1,
          redCards: 0,
        },
      },
      {
        id: 703,
        name: 'Lucas Mendes',
        number: 1,
        position: 'Goleiro',
        age: 13,
        photo: 'https://images.unsplash.com/photo-1599834562135-b6fc90e642ca?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        stats: {
          games: 12,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
        },
      },
    ],
    matchHistory: [
      {
        id: 7001,
        date: '09/02/2025',
        opponent: 'Lyon',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/lion.png',
        result: 'win',
        score: {
          team: 3,
          opponent: 0,
        },
        category: 'SUB-11',
      },
      {
        id: 7002,
        date: '09/02/2025',
        opponent: 'Lyon',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/lion.png',
        result: 'win',
        score: {
          team: 8,
          opponent: 0,
        },
        category: 'SUB-13',
      },
      {
        id: 7003,
        date: '15/02/2025',
        opponent: 'Guerreiros',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/9.png',
        result: 'win',
        score: {
          team: 3,
          opponent: 0,
        },
        category: 'SUB-11',
      },
    ],
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
    assistantCoach: 'Roberto Silva',
    director: 'Paulo Henrique',
    colors: 'Preto e Branco',
    stadium: 'Estádio Serra do Lago',
    achievements: ['Campeão da Copa Cerrado Sub-11 (2021)', 'Vice-campeão Sub-13 (2020)'],
    players: [
      {
        id: 801,
        name: 'Thiago Oliveira',
        number: 7,
        position: 'Atacante',
        age: 12,
        photo: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        stats: {
          games: 12,
          goals: 7,
          assists: 3,
          yellowCards: 2,
          redCards: 0,
        },
      },
    ],
    matchHistory: [
      {
        id: 8001,
        date: '16/02/2025',
        opponent: 'Estrela',
        opponentLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/5.png',
        result: 'win',
        score: {
          team: 2,
          opponent: 0,
        },
        category: 'SUB-13',
      },
    ],
  },
];

export default TeamDetail;
