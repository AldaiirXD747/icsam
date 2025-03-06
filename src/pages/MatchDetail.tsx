
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Clock, MapPin, Users, Award, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for the match
const matchData = {
  id: 1,
  homeTeam: {
    id: 'furacao',
    name: 'Furacão',
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png',
    score: 6
  },
  awayTeam: {
    id: 'federal',
    name: 'Federal',
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/6.png',
    score: 0
  },
  category: 'SUB-11',
  date: '09/02/2025',
  time: '09:00',
  group: 'A',
  status: 'completed',
  venue: 'Campo do Instituto',
  attendance: 120,
  referee: 'Carlos Santos',
  roundInfo: 'Primeira Rodada',
  events: [
    {
      id: 1,
      type: 'goal',
      minute: 12,
      player: {
        id: 101,
        name: 'Pedro Silva',
        team: 'Furacão'
      }
    },
    {
      id: 2,
      type: 'goal',
      minute: 18,
      player: {
        id: 102,
        name: 'João Oliveira',
        team: 'Furacão'
      }
    },
    {
      id: 3,
      type: 'yellowCard',
      minute: 24,
      player: {
        id: 201,
        name: 'Ricardo Almeida',
        team: 'Federal'
      }
    },
    {
      id: 4,
      type: 'goal',
      minute: 31,
      player: {
        id: 103,
        name: 'Lucas Pereira',
        team: 'Furacão'
      }
    },
    {
      id: 5,
      type: 'goal',
      minute: 38,
      player: {
        id: 101,
        name: 'Pedro Silva',
        team: 'Furacão'
      }
    },
    {
      id: 6,
      type: 'substitution',
      minute: 42,
      player: {
        id: 202,
        name: 'Carlos Mendes',
        team: 'Federal'
      },
      substitutionPlayer: {
        id: 203,
        name: 'Roberto Gomes',
        team: 'Federal'
      }
    },
    {
      id: 7,
      type: 'goal',
      minute: 48,
      player: {
        id: 104,
        name: 'Miguel Santos',
        team: 'Furacão'
      }
    },
    {
      id: 8,
      type: 'yellowCard',
      minute: 52,
      player: {
        id: 204,
        name: 'André Lima',
        team: 'Federal'
      }
    },
    {
      id: 9,
      type: 'goal',
      minute: 58,
      player: {
        id: 101,
        name: 'Pedro Silva',
        team: 'Furacão'
      }
    }
  ],
  lineups: {
    home: {
      starting: [
        { id: 101, name: 'Pedro Silva', position: 'Forward' },
        { id: 102, name: 'João Oliveira', position: 'Forward' },
        { id: 103, name: 'Lucas Pereira', position: 'Midfielder' },
        { id: 104, name: 'Miguel Santos', position: 'Midfielder' },
        { id: 105, name: 'Rafael Costa', position: 'Midfielder' },
        { id: 106, name: 'Alexandre Sousa', position: 'Defender' },
        { id: 107, name: 'Bruno Ferreira', position: 'Defender' },
        { id: 108, name: 'Gustavo Monteiro', position: 'Defender' },
        { id: 109, name: 'Diego Alves', position: 'Defender' },
        { id: 110, name: 'Tiago Ribeiro', position: 'Goalkeeper' }
      ],
      substitutes: [
        { id: 111, name: 'Fernando Martins', position: 'Goalkeeper' },
        { id: 112, name: 'Paulo Rocha', position: 'Defender' },
        { id: 113, name: 'Marcelo Pinto', position: 'Midfielder' },
        { id: 114, name: 'Roberto Silva', position: 'Forward' }
      ]
    },
    away: {
      starting: [
        { id: 201, name: 'Ricardo Almeida', position: 'Forward' },
        { id: 202, name: 'Carlos Mendes', position: 'Forward' },
        { id: 204, name: 'André Lima', position: 'Midfielder' },
        { id: 205, name: 'Felipe Nunes', position: 'Midfielder' },
        { id: 206, name: 'Eduardo Santos', position: 'Midfielder' },
        { id: 207, name: 'Marcos Teixeira', position: 'Defender' },
        { id: 208, name: 'Victor Cardoso', position: 'Defender' },
        { id: 209, name: 'Sérgio Oliveira', position: 'Defender' },
        { id: 210, name: 'Renato Gomes', position: 'Defender' },
        { id: 211, name: 'Júlio César', position: 'Goalkeeper' }
      ],
      substitutes: [
        { id: 212, name: 'Leonardo Dias', position: 'Goalkeeper' },
        { id: 213, name: 'Daniel Barbosa', position: 'Defender' },
        { id: 203, name: 'Roberto Gomes', position: 'Midfielder' },
        { id: 214, name: 'Gabriel Costa', position: 'Forward' }
      ]
    }
  },
  stats: {
    possession: { home: 65, away: 35 },
    shots: { home: 14, away: 5 },
    shotsOnTarget: { home: 9, away: 1 },
    corners: { home: 7, away: 2 },
    fouls: { home: 8, away: 12 },
    yellowCards: { home: 1, away: 2 },
    redCards: { home: 0, away: 0 }
  }
};

// Type for the events with substitution player
interface MatchEvent {
  id: number;
  type: string;
  minute: number;
  player: {
    id: number;
    name: string;
    team: string;
  };
  substitutionPlayer?: {
    id: number;
    name: string;
    team: string;
  };
}

const MatchDetail = () => {
  const { matchId } = useParams<{ matchId?: string }>();
  const [activeTab, setActiveTab] = useState<'summary' | 'lineups' | 'stats'>('summary');
  
  // In a real app, you would fetch the match data based on matchId
  const match = matchData;
  
  const EventIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'goal':
        return <span className="inline-block w-5 h-5 bg-lime-primary rounded-full text-white text-xs font-bold flex items-center justify-center">⚽</span>;
      case 'yellowCard':
        return <span className="inline-block w-5 h-5 bg-yellow-400 rounded-sm"></span>;
      case 'redCard':
        return <span className="inline-block w-5 h-5 bg-red-600 rounded-sm"></span>;
      case 'substitution':
        return <span className="inline-block w-5 h-5 text-blue-primary">↔️</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-24 flex-grow">
        <div className="container mx-auto px-4 py-8">
          <Link to="/matches" className="inline-flex items-center text-blue-primary hover:underline mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Jogos
          </Link>
          
          {/* Match Header */}
          <div className="glass-card p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h1 className="text-2xl md:text-3xl font-bold text-blue-primary">
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </h1>
                <p className="text-gray-600">{match.category} - Grupo {match.group}</p>
                <p className="text-gray-500 text-sm">{match.roundInfo}</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <span className="text-xl font-bold">
                    {match.homeTeam.score} - {match.awayTeam.score}
                  </span>
                </div>
                <p className="text-gray-500 mt-2 text-sm">
                  {match.status === 'live' ? (
                    <span className="text-red-500 font-semibold animate-pulse">AO VIVO</span>
                  ) : match.status === 'completed' ? (
                    'Finalizado'
                  ) : (
                    'Agendado'
                  )}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center">
                <Calendar className="text-blue-primary mr-2" size={18} />
                <span className="text-gray-700">{match.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="text-blue-primary mr-2" size={18} />
                <span className="text-gray-700">{match.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="text-blue-primary mr-2" size={18} />
                <span className="text-gray-700">{match.venue}</span>
              </div>
              <div className="flex items-center">
                <Users className="text-blue-primary mr-2" size={18} />
                <span className="text-gray-700">Público: {match.attendance}</span>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-3 px-6 font-medium ${
                activeTab === 'summary' ? 'text-blue-primary border-b-2 border-blue-primary' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('summary')}
            >
              Resumo
            </button>
            <button
              className={`py-3 px-6 font-medium ${
                activeTab === 'lineups' ? 'text-blue-primary border-b-2 border-blue-primary' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('lineups')}
            >
              Escalações
            </button>
            <button
              className={`py-3 px-6 font-medium ${
                activeTab === 'stats' ? 'text-blue-primary border-b-2 border-blue-primary' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('stats')}
            >
              Estatísticas
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="mb-10">
            {activeTab === 'summary' && (
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-blue-primary mb-4">Eventos da Partida</h2>
                <div className="space-y-4">
                  {match.events.map((event: MatchEvent) => (
                    <div key={event.id} className="flex items-center p-2 hover:bg-gray-50 rounded-lg">
                      <div className="w-12 text-center font-medium text-gray-600">{event.minute}'</div>
                      <div className="mx-3">
                        <EventIcon type={event.type} />
                      </div>
                      <div>
                        <span className="font-medium">{event.player.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({event.player.team})</span>
                        
                        {event.type === 'substitution' && event.substitutionPlayer && (
                          <div className="text-sm text-gray-600 mt-1">
                            Saiu: {event.substitutionPlayer.name}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'lineups' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Home Team Lineup */}
                <div className="glass-card p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={match.homeTeam.logo} 
                      alt={match.homeTeam.name} 
                      className="w-10 h-10 mr-3"
                    />
                    <h2 className="text-xl font-semibold text-blue-primary">{match.homeTeam.name}</h2>
                  </div>
                  
                  <h3 className="font-medium text-gray-700 mb-2">Titulares</h3>
                  <div className="space-y-2 mb-6">
                    {match.lineups.home.starting.map(player => (
                      <div key={player.id} className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded">
                        <span>{player.name}</span>
                        <span className="text-sm text-gray-500">{player.position}</span>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="font-medium text-gray-700 mb-2">Reservas</h3>
                  <div className="space-y-2">
                    {match.lineups.home.substitutes.map(player => (
                      <div key={player.id} className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded">
                        <span>{player.name}</span>
                        <span className="text-sm text-gray-500">{player.position}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Away Team Lineup */}
                <div className="glass-card p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={match.awayTeam.logo} 
                      alt={match.awayTeam.name} 
                      className="w-10 h-10 mr-3"
                    />
                    <h2 className="text-xl font-semibold text-blue-primary">{match.awayTeam.name}</h2>
                  </div>
                  
                  <h3 className="font-medium text-gray-700 mb-2">Titulares</h3>
                  <div className="space-y-2 mb-6">
                    {match.lineups.away.starting.map(player => (
                      <div key={player.id} className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded">
                        <span>{player.name}</span>
                        <span className="text-sm text-gray-500">{player.position}</span>
                      </div>
                    ))}
                  </div>
                  
                  <h3 className="font-medium text-gray-700 mb-2">Reservas</h3>
                  <div className="space-y-2">
                    {match.lineups.away.substitutes.map(player => (
                      <div key={player.id} className="flex items-center justify-between py-1 px-2 hover:bg-gray-50 rounded">
                        <span>{player.name}</span>
                        <span className="text-sm text-gray-500">{player.position}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'stats' && (
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-blue-primary mb-6 text-center">Estatísticas da Partida</h2>
                
                <div className="space-y-6">
                  {/* Possession */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{match.stats.possession.home}%</span>
                      <span className="text-gray-600">Posse de Bola</span>
                      <span className="font-medium">{match.stats.possession.away}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-primary rounded-full" 
                        style={{ width: `${match.stats.possession.home}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Shots */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{match.stats.shots.home}</span>
                      <span className="text-gray-600">Finalizações</span>
                      <span className="font-medium">{match.stats.shots.away}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-primary rounded-full" 
                        style={{ width: `${(match.stats.shots.home / (match.stats.shots.home + match.stats.shots.away)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Shots on Target */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{match.stats.shotsOnTarget.home}</span>
                      <span className="text-gray-600">Finalizações no Gol</span>
                      <span className="font-medium">{match.stats.shotsOnTarget.away}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-primary rounded-full" 
                        style={{ width: `${(match.stats.shotsOnTarget.home / (match.stats.shotsOnTarget.home + match.stats.shotsOnTarget.away)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Corners */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{match.stats.corners.home}</span>
                      <span className="text-gray-600">Escanteios</span>
                      <span className="font-medium">{match.stats.corners.away}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-primary rounded-full" 
                        style={{ width: `${(match.stats.corners.home / (match.stats.corners.home + match.stats.corners.away)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Fouls */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{match.stats.fouls.home}</span>
                      <span className="text-gray-600">Faltas</span>
                      <span className="font-medium">{match.stats.fouls.away}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-primary rounded-full" 
                        style={{ width: `${(match.stats.fouls.home / (match.stats.fouls.home + match.stats.fouls.away)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Cards */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-center font-medium mb-2">Cartões Amarelos</h3>
                      <div className="flex justify-center items-center space-x-12">
                        <div className="text-center">
                          <span className="text-xl font-bold">{match.stats.yellowCards.home}</span>
                          <p className="text-sm text-gray-600">{match.homeTeam.name}</p>
                        </div>
                        <div className="text-center">
                          <span className="text-xl font-bold">{match.stats.yellowCards.away}</span>
                          <p className="text-sm text-gray-600">{match.awayTeam.name}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-center font-medium mb-2">Cartões Vermelhos</h3>
                      <div className="flex justify-center items-center space-x-12">
                        <div className="text-center">
                          <span className="text-xl font-bold">{match.stats.redCards.home}</span>
                          <p className="text-sm text-gray-600">{match.homeTeam.name}</p>
                        </div>
                        <div className="text-center">
                          <span className="text-xl font-bold">{match.stats.redCards.away}</span>
                          <p className="text-sm text-gray-600">{match.awayTeam.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MatchDetail;
