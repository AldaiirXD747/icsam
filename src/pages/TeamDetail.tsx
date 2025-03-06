
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Shield, User, Calendar, MapPin, Trophy, UserCog } from 'lucide-react';

// Mock data for a team
const teamData = {
  'guerreiros': {
    id: 'guerreiros',
    name: 'Guerreiros',
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/9.png',
    categories: ['SUB-11', 'SUB-13'],
    group: 'B',
    foundingYear: '2020',
    location: 'Santa Maria, DF',
    coach: 'Carlos Silva',
    players: [
      { id: 1, name: 'João Silva', number: 1, position: 'Goleiro', goals: 0, photo: 'https://img.freepik.com/fotos-gratis/crianca-masculina-feliz-jogando-futebol-sozinho_23-2148900152.jpg' },
      { id: 2, name: 'Pedro Santos', number: 2, position: 'Defensor', goals: 0, photo: 'https://img.freepik.com/fotos-gratis/menino-jogando-futebol-com-espaco-de-copia_23-2148770377.jpg' },
      { id: 3, name: 'Lucas Ferreira', number: 5, position: 'Defensor', goals: 0, photo: 'https://img.freepik.com/fotos-gratis/menino-jogando-futebol_23-2148844646.jpg' },
      { id: 4, name: 'Matheus Oliveira', number: 8, position: 'Meio-Campo', goals: 1, photo: 'https://img.freepik.com/fotos-gratis/retrato-de-uma-crianca-feliz-com-uma-bola-de-futebol_23-2148860243.jpg' },
      { id: 5, name: 'Gabriel Costa', number: 10, position: 'Atacante', goals: 2, photo: 'https://img.freepik.com/fotos-gratis/menino-com-bola-isolada-na-parede-branca_231208-1392.jpg' }
    ],
    matches: [
      {
        id: 10,
        date: '15/02/2025',
        category: 'SUB-11',
        opponent: 'Monte',
        result: 'Derrota',
        score: '0-3',
        venue: 'Campo do Instituto'
      },
      {
        id: 13,
        date: '22/02/2025',
        category: 'SUB-11',
        opponent: 'Atlético City',
        result: 'Agendado',
        score: '-',
        venue: 'Campo do Instituto'
      }
    ],
    stats: {
      totalMatches: 1,
      wins: 0,
      draws: 0,
      losses: 1,
      goalsScored: 0,
      goalsConceded: 3,
      yellowCards: 1,
      redCards: 0
    }
  },
  'furacao': {
    id: 'furacao',
    name: 'Furacão',
    logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png',
    categories: ['SUB-11', 'SUB-13'],
    group: 'A',
    foundingYear: '2018',
    location: 'Gama, DF',
    coach: 'Roberto Alves',
    players: [
      { id: 1, name: 'Miguel Gomes', number: 1, position: 'Goleiro', goals: 0, photo: 'https://img.freepik.com/fotos-gratis/menino-jogando-futebol-com-espaco-de-copia_23-2148770377.jpg' },
      { id: 2, name: 'Renato Lima', number: 4, position: 'Defensor', goals: 0, photo: 'https://img.freepik.com/fotos-gratis/retrato-de-uma-crianca-feliz-com-uma-bola-de-futebol_23-2148860243.jpg' },
      { id: 3, name: 'Leandro Sousa', number: 5, position: 'Defensor', goals: 0, photo: 'https://img.freepik.com/fotos-gratis/menino-jogando-futebol_23-2148844646.jpg' },
      { id: 4, name: 'Leonardo Ribeiro', number: 8, position: 'Meio-Campo', goals: 2, photo: 'https://img.freepik.com/fotos-gratis/menino-com-bola-isolada-na-parede-branca_231208-1392.jpg' },
      { id: 5, name: 'Carlos Mendes', number: 9, position: 'Atacante', goals: 5, photo: 'https://img.freepik.com/fotos-gratis/crianca-masculina-feliz-jogando-futebol-sozinho_23-2148900152.jpg' }
    ],
    matches: [
      {
        id: 1,
        date: '09/02/2025',
        category: 'SUB-11',
        opponent: 'Federal',
        result: 'Vitória',
        score: '6-0',
        venue: 'Campo do Instituto'
      },
      {
        id: 12,
        date: '23/02/2025',
        category: 'SUB-11',
        opponent: 'Alvinegro',
        result: 'Agendado',
        score: '-',
        venue: 'Campo do Instituto'
      }
    ],
    stats: {
      totalMatches: 1,
      wins: 1,
      draws: 0,
      losses: 0,
      goalsScored: 6,
      goalsConceded: 0,
      yellowCards: 0,
      redCards: 0
    }
  }
};

const TeamDetail = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const team = teamId ? teamData[teamId as keyof typeof teamData] : undefined;
  
  if (!team) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-24 flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-primary mb-4">Time não encontrado</h1>
            <p className="text-gray-600 mb-8">O time que você está procurando não existe.</p>
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
          <Link to="/teams" className="inline-flex items-center mb-8 text-blue-primary hover:text-blue-light transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Voltar para Times
          </Link>
          
          {/* Team Header */}
          <div className="glass-card p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-40 h-40 flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold text-blue-primary mb-2">{team.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-600 mt-3">
                  <div className="flex items-center">
                    <Shield size={18} className="mr-2 text-blue-primary" />
                    <span>Grupo {team.group}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={18} className="mr-2 text-blue-primary" />
                    <span>Fundado em {team.foundingYear}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={18} className="mr-2 text-blue-primary" />
                    <span>{team.location}</span>
                  </div>
                  <div className="flex items-center">
                    <User size={18} className="mr-2 text-blue-primary" />
                    <span>{team.players.length} Jogadores</span>
                  </div>
                  <div className="flex items-center">
                    <UserCog size={18} className="mr-2 text-blue-primary" />
                    <span>Técnico: {team.coach}</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                  {team.categories.map(category => (
                    <span 
                      key={category} 
                      className="inline-block bg-blue-50 text-blue-primary rounded-full px-3 py-1 text-sm font-semibold"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs for different sections */}
          <Tabs defaultValue="players">
            <TabsList className="mb-8">
              <TabsTrigger value="players">Jogadores</TabsTrigger>
              <TabsTrigger value="matches">Jogos</TabsTrigger>
              <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            </TabsList>
            
            {/* Players Tab */}
            <TabsContent value="players">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.players.map(player => (
                  <div key={player.id} className="glass-card p-4 flex items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                      <img 
                        src={player.photo} 
                        alt={player.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-xl font-semibold mr-2">{player.name}</span>
                        <span className="bg-blue-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                          {player.number}
                        </span>
                      </div>
                      <p className="text-gray-600">{player.position}</p>
                      <p className="text-sm">
                        <span className="font-medium text-blue-primary">{player.goals}</span> {player.goals === 1 ? 'gol' : 'gols'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            {/* Matches Tab */}
            <TabsContent value="matches">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                  <thead className="bg-blue-primary text-white">
                    <tr>
                      <th className="py-3 px-4 text-left">Data</th>
                      <th className="py-3 px-4 text-left">Categoria</th>
                      <th className="py-3 px-4 text-left">Adversário</th>
                      <th className="py-3 px-4 text-center">Resultado</th>
                      <th className="py-3 px-4 text-center">Placar</th>
                      <th className="py-3 px-4 text-left">Local</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {team.matches.map(match => (
                      <tr key={match.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">{match.date}</td>
                        <td className="py-3 px-4">{match.category}</td>
                        <td className="py-3 px-4">{match.opponent}</td>
                        <td className="py-3 px-4 text-center">
                          <span 
                            className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                              match.result === 'Vitória' 
                                ? 'bg-green-100 text-green-800'
                                : match.result === 'Derrota'
                                  ? 'bg-red-100 text-red-800'
                                  : match.result === 'Empate'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {match.result}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center font-semibold">{match.score}</td>
                        <td className="py-3 px-4">{match.venue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            {/* Stats Tab */}
            <TabsContent value="stats">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 text-center">
                  <div className="flex justify-center items-center mb-3">
                    <Trophy className="text-blue-primary h-8 w-8" />
                  </div>
                  <div className="text-4xl font-bold text-blue-primary">{team.stats.wins}</div>
                  <div className="text-gray-600 mt-1">Vitórias</div>
                </div>
                
                <div className="glass-card p-6 text-center">
                  <div className="flex justify-center items-center mb-3">
                    <div className="rounded-full h-8 w-8 flex items-center justify-center bg-blue-primary text-white">D</div>
                  </div>
                  <div className="text-4xl font-bold text-blue-primary">{team.stats.draws}</div>
                  <div className="text-gray-600 mt-1">Empates</div>
                </div>
                
                <div className="glass-card p-6 text-center">
                  <div className="flex justify-center items-center mb-3">
                    <div className="rounded-full h-8 w-8 flex items-center justify-center bg-red-500 text-white">L</div>
                  </div>
                  <div className="text-4xl font-bold text-blue-primary">{team.stats.losses}</div>
                  <div className="text-gray-600 mt-1">Derrotas</div>
                </div>
                
                <div className="glass-card p-6 text-center">
                  <div className="flex justify-center items-center mb-3">
                    <div className="rounded-full h-8 w-8 flex items-center justify-center bg-green-500 text-white">G</div>
                  </div>
                  <div className="text-4xl font-bold text-blue-primary">{team.stats.goalsScored}</div>
                  <div className="text-gray-600 mt-1">Gols Marcados</div>
                </div>
              </div>
              
              <div className="glass-card p-6 mt-8">
                <h3 className="text-xl font-semibold text-blue-primary mb-6 text-center">Estatísticas da Equipe</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-medium">Jogos Disputados</span>
                    <span>{team.stats.totalMatches}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-medium">Gols Sofridos</span>
                    <span>{team.stats.goalsConceded}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-medium">Saldo de Gols</span>
                    <span className={team.stats.goalsScored - team.stats.goalsConceded > 0 ? 'text-green-600' : 'text-red-600'}>
                      {team.stats.goalsScored - team.stats.goalsConceded > 0 ? '+' : ''}
                      {team.stats.goalsScored - team.stats.goalsConceded}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-medium">Aproveitamento</span>
                    <span>
                      {team.stats.totalMatches > 0 
                        ? `${Math.round((team.stats.wins * 3 + team.stats.draws) / (team.stats.totalMatches * 3) * 100)}%` 
                        : '0%'}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-medium">Cartões Amarelos</span>
                    <span>{team.stats.yellowCards}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="font-medium">Cartões Vermelhos</span>
                    <span>{team.stats.redCards}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TeamDetail;
