
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, MapPin, Clock, Calendar, User, Shield } from 'lucide-react';

// Define types
type MatchStatus = 'scheduled' | 'live' | 'completed';

interface MatchPlayer {
  id: number;
  name: string;
  number: number;
  photo: string;
  goals: number;
  yellowCards: number;
  redCards: number;
}

interface MatchEvent {
  id: number;
  type: 'goal' | 'yellow-card' | 'red-card' | 'substitution';
  minute: number;
  player: {
    id: number;
    name: string;
    team: 'home' | 'away';
  };
  substitutionPlayer?: {
    id: number;
    name: string;
  };
}

// Mock data for match details
const matchData = {
  '1': {
    id: 1,
    homeTeam: {
      id: 'furacao',
      name: 'Furacão',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png',
      score: 6,
      players: [
        { id: 1, name: 'Miguel Gomes', number: 1, photo: 'https://img.freepik.com/fotos-gratis/menino-jogando-futebol-com-espaco-de-copia_23-2148770377.jpg', goals: 0, yellowCards: 0, redCards: 0 },
        { id: 2, name: 'Renato Lima', number: 4, photo: 'https://img.freepik.com/fotos-gratis/retrato-de-uma-crianca-feliz-com-uma-bola-de-futebol_23-2148860243.jpg', goals: 1, yellowCards: 0, redCards: 0 },
        { id: 3, name: 'Leandro Sousa', number: 5, photo: 'https://img.freepik.com/fotos-gratis/menino-jogando-futebol_23-2148844646.jpg', goals: 0, yellowCards: 0, redCards: 0 },
        { id: 4, name: 'Leonardo Ribeiro', number: 8, photo: 'https://img.freepik.com/fotos-gratis/menino-com-bola-isolada-na-parede-branca_231208-1392.jpg', goals: 2, yellowCards: 0, redCards: 0 },
        { id: 5, name: 'Carlos Mendes', number: 9, photo: 'https://img.freepik.com/fotos-gratis/crianca-masculina-feliz-jogando-futebol-sozinho_23-2148900152.jpg', goals: 3, yellowCards: 0, redCards: 0 }
      ]
    },
    awayTeam: {
      id: 'federal',
      name: 'Federal',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/6.png',
      score: 0,
      players: [
        { id: 6, name: 'Eduardo Pereira', number: 1, photo: 'https://img.freepik.com/fotos-gratis/crianca-masculina-feliz-jogando-futebol-sozinho_23-2148900152.jpg', goals: 0, yellowCards: 0, redCards: 0 },
        { id: 7, name: 'Daniel Alves', number: 2, photo: 'https://img.freepik.com/fotos-gratis/menino-jogando-futebol_23-2148844646.jpg', goals: 0, yellowCards: 1, redCards: 0 },
        { id: 8, name: 'Felipe Rodrigues', number: 4, photo: 'https://img.freepik.com/fotos-gratis/menino-com-bola-isolada-na-parede-branca_231208-1392.jpg', goals: 0, yellowCards: 0, redCards: 0 },
        { id: 9, name: 'Gustavo Miranda', number: 7, photo: 'https://img.freepik.com/fotos-gratis/retrato-de-uma-crianca-feliz-com-uma-bola-de-futebol_23-2148860243.jpg', goals: 0, yellowCards: 0, redCards: 0 },
        { id: 10, name: 'Bruno Santos', number: 9, photo: 'https://img.freepik.com/fotos-gratis/menino-jogando-futebol-com-espaco-de-copia_23-2148770377.jpg', goals: 0, yellowCards: 0, redCards: 0 }
      ]
    },
    category: 'SUB-11',
    date: '09/02/2025',
    time: '09:00',
    group: 'A',
    status: 'completed' as MatchStatus,
    venue: 'Campo do Instituto',
    events: [
      { id: 1, type: 'goal', minute: 12, player: { id: 5, name: 'Carlos Mendes', team: 'home' } },
      { id: 2, type: 'yellow-card', minute: 18, player: { id: 7, name: 'Daniel Alves', team: 'away' } },
      { id: 3, type: 'goal', minute: 22, player: { id: 4, name: 'Leonardo Ribeiro', team: 'home' } },
      { id: 4, type: 'goal', minute: 29, player: { id: 5, name: 'Carlos Mendes', team: 'home' } },
      { id: 5, type: 'goal', minute: 34, player: { id: 5, name: 'Carlos Mendes', team: 'home' } },
      { id: 6, type: 'goal', minute: 42, player: { id: 4, name: 'Leonardo Ribeiro', team: 'home' } },
      { id: 7, type: 'goal', minute: 48, player: { id: 2, name: 'Renato Lima', team: 'home' } }
    ]
  },
  '2': {
    id: 2,
    homeTeam: {
      id: 'gremio',
      name: 'Grêmio',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/Captura-de-tela-2025-02-13-112406.png',
      score: 2,
      players: [
        { id: 11, name: 'Pedro Costa', number: 1, photo: 'https://img.freepik.com/fotos-gratis/menino-jogando-futebol-com-espaco-de-copia_23-2148770377.jpg', goals: 0, yellowCards: 0, redCards: 0 },
        { id: 12, name: 'Rafael Silva', number: 3, photo: 'https://img.freepik.com/fotos-gratis/retrato-de-uma-crianca-feliz-com-uma-bola-de-futebol_23-2148860243.jpg', goals: 1, yellowCards: 0, redCards: 0 },
        { id: 13, name: 'Marcos Oliveira', number: 5, photo: 'https://img.freepik.com/fotos-gratis/menino-jogando-futebol_23-2148844646.jpg', goals: 0, yellowCards: 0, redCards: 0 },
        { id: 14, name: 'João Fernandes', number: 8, photo: 'https://img.freepik.com/fotos-gratis/menino-com-bola-isolada-na-parede-branca_231208-1392.jpg', goals: 0, yellowCards: 1, redCards: 0 },
        { id: 15, name: 'Lucas Martins', number: 10, photo: 'https://img.freepik.com/fotos-gratis/crianca-masculina-feliz-jogando-futebol-sozinho_23-2148900152.jpg', goals: 1, yellowCards: 0, redCards: 0 }
      ]
    },
    awayTeam: {
      id: 'estrela',
      name: 'Estrela',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/5.png',
      score: 1,
      players: [
        { id: 16, name: 'Henrique Lima', number: 1, photo: 'https://img.freepik.com/fotos-gratis/menino-jogando-futebol_23-2148844646.jpg', goals: 0, yellowCards: 0, redCards: 0 },
        { id: 17, name: 'Ricardo Soares', number: 2, photo: 'https://img.freepik.com/fotos-gratis/crianca-masculina-feliz-jogando-futebol-sozinho_23-2148900152.jpg', goals: 0, yellowCards: 0, redCards: 0 },
        { id: 18, name: 'André Ferreira', number: 4, photo: 'https://img.freepik.com/fotos-gratis/retrato-de-uma-crianca-feliz-com-uma-bola-de-futebol_23-2148860243.jpg', goals: 0, yellowCards: 0, redCards: 0 },
        { id: 19, name: 'Paulo Gomes', number: 8, photo: 'https://img.freepik.com/fotos-gratis/menino-com-bola-isolada-na-parede-branca_231208-1392.jpg', goals: 1, yellowCards: 0, redCards: 0 },
        { id: 20, name: 'Caio Santos', number: 9, photo: 'https://img.freepik.com/fotos-gratis/menino-jogando-futebol-com-espaco-de-copia_23-2148770377.jpg', goals: 0, yellowCards: 0, redCards: 0 }
      ]
    },
    category: 'SUB-11',
    date: '09/02/2025',
    time: '10:30',
    group: 'A',
    status: 'completed' as MatchStatus,
    venue: 'Campo do Instituto',
    events: [
      { id: 1, type: 'goal', minute: 15, player: { id: 12, name: 'Rafael Silva', team: 'home' } },
      { id: 2, type: 'yellow-card', minute: 22, player: { id: 14, name: 'João Fernandes', team: 'home' } },
      { id: 3, type: 'goal', minute: 27, player: { id: 19, name: 'Paulo Gomes', team: 'away' } },
      { id: 4, type: 'goal', minute: 44, player: { id: 15, name: 'Lucas Martins', team: 'home' } }
    ]
  }
};

const MatchDetail = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const match = matchId ? matchData[matchId as keyof typeof matchData] : undefined;
  
  if (!match) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-24 flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-primary mb-4">Jogo não encontrado</h1>
            <p className="text-gray-600 mb-8">O jogo que você está procurando não existe.</p>
            <Link to="/matches" className="btn-primary">
              Voltar para Jogos
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Group events by team
  const homeEvents = match.events.filter(event => event.player.team === 'home');
  const awayEvents = match.events.filter(event => event.player.team === 'away');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-24 flex-grow">
        <div className="container mx-auto px-4 py-8">
          <Link to="/matches" className="inline-flex items-center mb-8 text-blue-primary hover:text-blue-light transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Voltar para Jogos
          </Link>
          
          {/* Match Header */}
          <div className="glass-card mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-primary to-blue-light p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center">
                    <Shield className="mr-2" size={16} />
                    <span>Grupo {match.group}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <User className="mr-2" size={16} />
                    <span>{match.category}</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center">
                    <Calendar className="mr-2" size={16} />
                    <span>{match.date}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Clock className="mr-2" size={16} />
                    <span>{match.time}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center justify-end">
                    <MapPin className="mr-2" size={16} />
                    <span>{match.venue}</span>
                  </div>
                  <div className="mt-1">
                    <span className="uppercase font-semibold px-2 py-1 rounded-full text-xs bg-white text-blue-primary">
                      {match.status === 'completed' ? 'Finalizado' : match.status === 'live' ? 'Ao Vivo' : 'Agendado'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Score */}
            <div className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex flex-col items-center md:items-start mb-6 md:mb-0 order-2 md:order-1">
                  <Link to={`/teams/${match.homeTeam.id}`} className="flex flex-col items-center md:items-start">
                    <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-24 h-24 object-contain mb-2" />
                    <span className="text-xl font-bold">{match.homeTeam.name}</span>
                  </Link>
                </div>
                
                <div className="flex items-center order-1 md:order-2 mb-6 md:mb-0">
                  <div className="text-center mx-6 w-28">
                    <div className="flex justify-center items-center py-4">
                      <span className="text-5xl font-bold text-blue-primary">{match.homeTeam.score}</span>
                      <span className="mx-3 text-3xl text-gray-400">-</span>
                      <span className="text-5xl font-bold text-blue-primary">{match.awayTeam.score}</span>
                    </div>
                    {match.status === 'completed' && (
                      <span className="text-sm text-gray-500">Resultado Final</span>
                    )}
                    {match.status === 'live' && (
                      <span className="text-sm text-red-500 animate-pulse font-medium">Ao Vivo</span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-center md:items-end order-3">
                  <Link to={`/teams/${match.awayTeam.id}`} className="flex flex-col items-center md:items-end">
                    <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-24 h-24 object-contain mb-2" />
                    <span className="text-xl font-bold">{match.awayTeam.name}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Match Events Timeline */}
          <div className="glass-card p-6 mb-8">
            <h2 className="text-2xl font-semibold text-blue-primary mb-6 text-center">Linha do Tempo</h2>
            
            {match.events.length > 0 ? (
              <div className="relative">
                {/* Timeline Center Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>

                {/* Events */}
                {match.events.sort((a, b) => a.minute - b.minute).map((event, index) => (
                  <div key={event.id} className={`relative flex ${
                    event.player.team === 'home' ? 'justify-end md:justify-start' : 'justify-end'
                  } mb-8`}>
                    <div className={`w-full md:w-5/12 ${
                      event.player.team === 'home' ? 'md:text-right md:pr-8' : 'md:pl-8'
                    }`}>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="bg-blue-primary text-white text-xs px-2 py-1 rounded-full">
                            {event.minute}'
                          </span>
                          <span className="font-semibold">
                            {event.player.team === 'home' ? match.homeTeam.name : match.awayTeam.name}
                          </span>
                        </div>
                        
                        {event.type === 'goal' && (
                          <div className="flex items-center">
                            <div className="mr-2 bg-green-100 p-1 rounded-full">
                              <span className="text-green-600 text-xl">⚽</span>
                            </div>
                            <div>
                              <div className="font-medium">Gol!</div>
                              <div className="text-sm text-gray-600">Marcado por {event.player.name}</div>
                            </div>
                          </div>
                        )}
                        
                        {event.type === 'yellow-card' && (
                          <div className="flex items-center">
                            <div className="mr-2 p-1">
                              <div className="w-4 h-6 bg-yellow-500"></div>
                            </div>
                            <div>
                              <div className="font-medium">Cartão Amarelo</div>
                              <div className="text-sm text-gray-600">Para {event.player.name}</div>
                            </div>
                          </div>
                        )}
                        
                        {event.type === 'red-card' && (
                          <div className="flex items-center">
                            <div className="mr-2 p-1">
                              <div className="w-4 h-6 bg-red-500"></div>
                            </div>
                            <div>
                              <div className="font-medium">Cartão Vermelho</div>
                              <div className="text-sm text-gray-600">Para {event.player.name}</div>
                            </div>
                          </div>
                        )}
                        
                        {event.type === 'substitution' && event.substitutionPlayer && (
                          <div className="flex items-center">
                            <div className="mr-2 p-1">
                              <span className="text-blue-primary text-xl">↔️</span>
                            </div>
                            <div>
                              <div className="font-medium">Substituição</div>
                              <div className="text-sm text-gray-600">
                                Entra: {event.player.name}, Sai: {event.substitutionPlayer.name}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Center Circle */}
                    <div className="absolute left-1/2 w-4 h-4 bg-blue-primary rounded-full transform -translate-x-1/2 top-4"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum evento registrado para esta partida.</p>
              </div>
            )}
          </div>
          
          {/* Team Lineups */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Home Team */}
            <div className="glass-card p-6">
              <div className="flex items-center mb-4">
                <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-12 h-12 object-contain mr-3" />
                <h3 className="text-xl font-semibold text-blue-primary">{match.homeTeam.name}</h3>
              </div>
              
              <div className="space-y-3">
                {match.homeTeam.players.map(player => (
                  <div key={player.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <Link to={`/player/${player.id}`} className="font-medium hover:text-blue-primary">
                          {player.name}
                        </Link>
                        <div className="text-xs text-gray-500">#{player.number}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {player.goals > 0 && (
                        <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                          <span className="mr-1">⚽</span>
                          <span>{player.goals}</span>
                        </div>
                      )}
                      
                      {player.yellowCards > 0 && (
                        <div className="flex items-center bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                          <div className="w-2 h-3 bg-yellow-500 mr-1"></div>
                          <span>{player.yellowCards}</span>
                        </div>
                      )}
                      
                      {player.redCards > 0 && (
                        <div className="flex items-center bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                          <div className="w-2 h-3 bg-red-500 mr-1"></div>
                          <span>{player.redCards}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Away Team */}
            <div className="glass-card p-6">
              <div className="flex items-center mb-4">
                <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-12 h-12 object-contain mr-3" />
                <h3 className="text-xl font-semibold text-blue-primary">{match.awayTeam.name}</h3>
              </div>
              
              <div className="space-y-3">
                {match.awayTeam.players.map(player => (
                  <div key={player.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <img src={player.photo} alt={player.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <Link to={`/player/${player.id}`} className="font-medium hover:text-blue-primary">
                          {player.name}
                        </Link>
                        <div className="text-xs text-gray-500">#{player.number}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {player.goals > 0 && (
                        <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                          <span className="mr-1">⚽</span>
                          <span>{player.goals}</span>
                        </div>
                      )}
                      
                      {player.yellowCards > 0 && (
                        <div className="flex items-center bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">
                          <div className="w-2 h-3 bg-yellow-500 mr-1"></div>
                          <span>{player.yellowCards}</span>
                        </div>
                      )}
                      
                      {player.redCards > 0 && (
                        <div className="flex items-center bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                          <div className="w-2 h-3 bg-red-500 mr-1"></div>
                          <span>{player.redCards}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MatchDetail;
