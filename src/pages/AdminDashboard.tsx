
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Shield, 
  Users, 
  CalendarDays, 
  ChevronRight, 
  PlusCircle, 
  BarChart3, 
  Settings, 
  Bell 
} from 'lucide-react';

// Mock data for dashboard
const dashboardData = {
  championships: 1,
  teams: 10,
  players: 120,
  matches: {
    completed: 12,
    upcoming: 35,
    total: 47
  },
  recentMatches: [
    {
      id: 8,
      date: '16/02/2025',
      homeTeam: 'Estrela',
      awayTeam: 'Alvinegro',
      result: '3-1',
      category: 'SUB-11'
    },
    {
      id: 9,
      date: '15/02/2025',
      homeTeam: 'Atlético City',
      awayTeam: 'Lyon',
      result: '1-0',
      category: 'SUB-11'
    },
    {
      id: 10,
      date: '15/02/2025',
      homeTeam: 'Monte',
      awayTeam: 'Guerreiros',
      result: '3-0',
      category: 'SUB-11'
    }
  ],
  upcomingMatches: [
    {
      id: 11,
      date: '23/02/2025',
      time: '09:00',
      homeTeam: 'Federal',
      awayTeam: 'Estrela',
      category: 'SUB-11',
      venue: 'Campo do Instituto'
    },
    {
      id: 12,
      date: '23/02/2025',
      time: '10:30',
      homeTeam: 'Alvinegro',
      awayTeam: 'Furacão',
      category: 'SUB-11',
      venue: 'Campo do Instituto'
    },
    {
      id: 13,
      date: '22/02/2025',
      time: '09:00',
      homeTeam: 'Atlético City',
      awayTeam: 'Guerreiros',
      category: 'SUB-11',
      venue: 'Campo do Instituto'
    }
  ],
  notifications: [
    {
      id: 1,
      type: 'info',
      message: 'Nova inscrição de time recebida: Real FC',
      time: '2 horas atrás'
    },
    {
      id: 2,
      type: 'warning',
      message: 'Jogo entre Furacao e Alvinegro precisa de mesário',
      time: '5 horas atrás'
    },
    {
      id: 3,
      type: 'success',
      message: 'Resultados da rodada atualizado com sucesso',
      time: '1 dia atrás'
    }
  ]
};

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-primary shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/cropped-LOGO-INSTITUTO-CORTADA-1.png" 
              alt="Instituto Criança Santa Maria" 
              className="h-10 mr-3"
            />
            <div>
              <h1 className="text-white text-lg font-semibold">Painel Administrativo</h1>
              <p className="text-blue-100 text-xs">Base Forte – 2025</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative">
              <Bell className="text-white" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-primary font-bold mr-2">
                A
              </div>
              <span className="text-white">Admin</span>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg h-[calc(100vh-4rem)] fixed">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link to="/admin" className="flex items-center space-x-3 text-blue-primary font-medium p-3 rounded-lg bg-blue-50">
                  <BarChart3 size={20} />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/championships" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 p-3 rounded-lg transition-colors">
                  <Trophy size={20} />
                  <span>Campeonatos</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/teams" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 p-3 rounded-lg transition-colors">
                  <Shield size={20} />
                  <span>Times</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/players" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 p-3 rounded-lg transition-colors">
                  <Users size={20} />
                  <span>Jogadores</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/matches" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 p-3 rounded-lg transition-colors">
                  <CalendarDays size={20} />
                  <span>Jogos e Rodadas</span>
                </Link>
              </li>
              <li>
                <Link to="/admin/settings" className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 p-3 rounded-lg transition-colors">
                  <Settings size={20} />
                  <span>Configurações</span>
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="absolute bottom-4 w-full px-4">
            <Link to="/" className="flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-primary p-2 transition-colors">
              <span>Visualizar site</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="ml-64 flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <Trophy className="text-blue-primary h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Campeonatos</p>
                  <h3 className="text-2xl font-bold text-gray-800">{dashboardData.championships}</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-3 mr-4">
                  <Shield className="text-green-600 h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Times</p>
                  <h3 className="text-2xl font-bold text-gray-800">{dashboardData.teams}</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 rounded-full p-3 mr-4">
                  <Users className="text-purple-600 h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Jogadores</p>
                  <h3 className="text-2xl font-bold text-gray-800">{dashboardData.players}</h3>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="bg-orange-100 rounded-full p-3 mr-4">
                  <CalendarDays className="text-orange-600 h-6 w-6" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Jogos</p>
                  <h3 className="text-2xl font-bold text-gray-800">{dashboardData.matches.total}</h3>
                  <div className="flex text-xs mt-1 space-x-3">
                    <span className="text-green-600">{dashboardData.matches.completed} concluídos</span>
                    <span className="text-blue-600">{dashboardData.matches.upcoming} agendados</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link to="/admin/teams/new" className="bg-white rounded-lg shadow-sm p-6 flex items-center hover:shadow-md transition-shadow">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <PlusCircle className="text-blue-primary h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Adicionar time</h3>
                <p className="text-gray-500 text-sm">Registre um novo time</p>
              </div>
            </Link>
            
            <Link to="/admin/players/new" className="bg-white rounded-lg shadow-sm p-6 flex items-center hover:shadow-md transition-shadow">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <PlusCircle className="text-green-600 h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Adicionar jogador</h3>
                <p className="text-gray-500 text-sm">Registre um novo jogador</p>
              </div>
            </Link>
            
            <Link to="/admin/matches/new" className="bg-white rounded-lg shadow-sm p-6 flex items-center hover:shadow-md transition-shadow">
              <div className="bg-purple-100 rounded-full p-3 mr-4">
                <PlusCircle className="text-purple-600 h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Criar jogo</h3>
                <p className="text-gray-500 text-sm">Agende um novo jogo</p>
              </div>
            </Link>
          </div>
          
          {/* Recent Matches and Upcoming Matches */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Resultados Recentes</h2>
                <Link to="/admin/matches" className="text-sm text-blue-primary hover:underline">Ver todos</Link>
              </div>
              <div className="space-y-4">
                {dashboardData.recentMatches.map((match) => (
                  <div key={match.id} className="border-b pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{match.homeTeam} vs {match.awayTeam}</div>
                        <div className="text-sm text-gray-500">{match.date} • {match.category}</div>
                      </div>
                      <div className="font-bold text-blue-primary">{match.result}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Próximos Jogos</h2>
                <Link to="/admin/matches" className="text-sm text-blue-primary hover:underline">Ver todos</Link>
              </div>
              <div className="space-y-4">
                {dashboardData.upcomingMatches.map((match) => (
                  <div key={match.id} className="border-b pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{match.homeTeam} vs {match.awayTeam}</div>
                        <div className="text-sm text-gray-500">{match.date} • {match.time} • {match.category}</div>
                        <div className="text-xs text-gray-400">{match.venue}</div>
                      </div>
                      <Link to={`/admin/matches/${match.id}`} className="text-blue-primary hover:text-blue-light">
                        <ChevronRight size={20} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Notificações</h2>
              <Link to="/admin/notifications" className="text-sm text-blue-primary hover:underline">Ver todas</Link>
            </div>
            <div className="space-y-4">
              {dashboardData.notifications.map((notification) => (
                <div key={notification.id} className="border-l-4 pl-4 py-2" 
                  style={{ 
                    borderColor: notification.type === 'info' 
                      ? '#3b82f6' 
                      : notification.type === 'warning' 
                        ? '#f59e0b' 
                        : '#10b981' 
                  }}
                >
                  <div className="font-medium">{notification.message}</div>
                  <div className="text-sm text-gray-500">{notification.time}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
