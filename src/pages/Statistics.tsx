
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for player statistics
const playerStats = [
  {
    id: 1,
    name: "Lucas Silva",
    teamName: "Federal",
    teamLogo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/6.png",
    goals: 7,
    assists: 3,
    yellowCards: 1,
    redCards: 0,
    category: "SUB-11",
  },
  {
    id: 2,
    name: "Pedro Alves",
    teamName: "Furacão",
    teamLogo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png",
    goals: 5,
    assists: 4,
    yellowCards: 2,
    redCards: 0,
    category: "SUB-11",
  },
  {
    id: 3,
    name: "João Costa",
    teamName: "Atlético City",
    teamLogo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/7.png",
    goals: 4,
    assists: 1,
    yellowCards: 0,
    redCards: 0,
    category: "SUB-11",
  },
  {
    id: 4,
    name: "Matheus Oliveira",
    teamName: "Grêmio",
    teamLogo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/Captura-de-tela-2025-02-13-112406.png",
    goals: 8,
    assists: 2,
    yellowCards: 1,
    redCards: 1,
    category: "SUB-13",
  },
  {
    id: 5,
    name: "Gabriel Santos",
    teamName: "BSA",
    teamLogo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/4.png",
    goals: 6,
    assists: 5,
    yellowCards: 3,
    redCards: 0,
    category: "SUB-13",
  },
  {
    id: 6,
    name: "Rafael Lima",
    teamName: "Lyon",
    teamLogo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/lion.png",
    goals: 5,
    assists: 3,
    yellowCards: 2,
    redCards: 0,
    category: "SUB-13",
  },
  {
    id: 7,
    name: "Felipe Souza",
    teamName: "Monte",
    teamLogo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/2.png",
    goals: 4,
    assists: 6,
    yellowCards: 1,
    redCards: 0,
    category: "SUB-13",
  }
];

// Mock data for team statistics
const teamStats = [
  {
    id: 1,
    name: "Atlético City",
    logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/7.png",
    goalsScored: 12,
    goalsConceded: 5,
    wins: 2,
    draws: 1,
    losses: 0,
    category: "SUB-13",
  },
  {
    id: 2,
    name: "Furacão",
    logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png",
    goalsScored: 10,
    goalsConceded: 3,
    wins: 2,
    draws: 0,
    losses: 0,
    category: "SUB-11",
  },
  {
    id: 3,
    name: "Grêmio",
    logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/Captura-de-tela-2025-02-13-112406.png",
    goalsScored: 9,
    goalsConceded: 4,
    wins: 2,
    draws: 0,
    losses: 0,
    category: "SUB-13",
  },
  {
    id: 4,
    name: "Monte",
    logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/2.png",
    goalsScored: 13,
    goalsConceded: 0,
    wins: 2,
    draws: 0,
    losses: 0,
    category: "SUB-13",
  },
  {
    id: 5,
    name: "BSA",
    logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/4.png",
    goalsScored: 2,
    goalsConceded: 7,
    wins: 0,
    draws: 0,
    losses: 2,
    category: "SUB-11",
  }
];

// Prepare chart data for top scorers
const prepareGoalScorerChartData = (players, category) => {
  return players
    .filter(player => category === 'all' || player.category === category)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 5)
    .map(player => ({
      name: player.name,
      goals: player.goals,
      team: player.teamName,
    }));
};

// Prepare chart data for top assisters
const prepareAssistChartData = (players, category) => {
  return players
    .filter(player => category === 'all' || player.category === category)
    .sort((a, b) => b.assists - a.assists)
    .slice(0, 5)
    .map(player => ({
      name: player.name,
      assists: player.assists,
      team: player.teamName,
    }));
};

// Prepare chart data for team goals
const prepareTeamGoalChartData = (teams, category) => {
  return teams
    .filter(team => category === 'all' || team.category === category)
    .sort((a, b) => b.goalsScored - a.goalsScored)
    .slice(0, 5)
    .map(team => ({
      name: team.name,
      goalsScored: team.goalsScored,
      goalsConceded: team.goalsConceded,
    }));
};

const Statistics = () => {
  const { championshipId } = useParams<{ championshipId?: string }>();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Prepare chart data
  const topScorersData = prepareGoalScorerChartData(playerStats, selectedCategory);
  const topAssistersData = prepareAssistChartData(playerStats, selectedCategory);
  const teamGoalsData = prepareTeamGoalChartData(teamStats, selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-24 flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-primary mb-4">
              {championshipId ? 'Estatísticas do Campeonato' : 'Estatísticas Gerais'}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Acompanhe as estatísticas dos jogadores e times. Veja quem são os artilheiros, 
              os líderes em assistências e outras métricas importantes.
            </p>
          </div>
          
          {/* Category Filter */}
          <div className="glass-card p-6 mb-8">
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por Categoria
            </label>
            <select
              id="category-filter"
              className="w-full md:w-64 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-primary"
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
          
          {/* Tabs for different statistics */}
          <Tabs defaultValue="players">
            <TabsList className="w-full max-w-md mx-auto">
              <TabsTrigger value="players" className="flex-1">Jogadores</TabsTrigger>
              <TabsTrigger value="teams" className="flex-1">Times</TabsTrigger>
            </TabsList>
            
            {/* Player Statistics */}
            <TabsContent value="players">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Top Scorers */}
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-blue-primary mb-4">Artilheiros</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={topScorersData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
                                  <p className="font-medium">{payload[0].payload.name}</p>
                                  <p className="text-sm text-gray-600">{payload[0].payload.team}</p>
                                  <p className="font-bold text-blue-primary">
                                    {payload[0].value} gols
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend />
                        <Bar dataKey="goals" fill="#1a237e" name="Gols" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Top Scorers Table */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Top 5 Artilheiros</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Jogador
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Time
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Gols
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {playerStats
                            .filter(player => selectedCategory === 'all' || player.category === selectedCategory)
                            .sort((a, b) => b.goals - a.goals)
                            .slice(0, 5)
                            .map(player => (
                              <tr key={player.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="font-medium text-gray-900">{player.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <img src={player.teamLogo} alt={player.teamName} className="h-6 w-6 mr-2" />
                                    <span>{player.teamName}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-blue-primary font-bold">
                                  {player.goals}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                {/* Top Assisters */}
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-blue-primary mb-4">Assistências</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={topAssistersData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
                                  <p className="font-medium">{payload[0].payload.name}</p>
                                  <p className="text-sm text-gray-600">{payload[0].payload.team}</p>
                                  <p className="font-bold text-blue-primary">
                                    {payload[0].value} assistências
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend />
                        <Bar dataKey="assists" fill="#c6ff00" name="Assistências" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Top Assisters Table */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Top 5 Assistências</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Jogador
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Time
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Assistências
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {playerStats
                            .filter(player => selectedCategory === 'all' || player.category === selectedCategory)
                            .sort((a, b) => b.assists - a.assists)
                            .slice(0, 5)
                            .map(player => (
                              <tr key={player.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="font-medium text-gray-900">{player.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <img src={player.teamLogo} alt={player.teamName} className="h-6 w-6 mr-2" />
                                    <span>{player.teamName}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-lime-primary font-bold">
                                  {player.assists}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                {/* Discipline Stats */}
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-blue-primary mb-4">Cartões</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Jogador
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amarelos
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vermelhos
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {playerStats
                          .filter(player => selectedCategory === 'all' || player.category === selectedCategory)
                          .sort((a, b) => (b.yellowCards + b.redCards*2) - (a.yellowCards + a.redCards*2))
                          .slice(0, 10)
                          .map(player => (
                            <tr key={player.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">{player.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img src={player.teamLogo} alt={player.teamName} className="h-6 w-6 mr-2" />
                                  <span>{player.teamName}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs inline-flex text-center bg-yellow-100 text-yellow-800 rounded-md">
                                  {player.yellowCards}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs inline-flex text-center bg-red-100 text-red-800 rounded-md">
                                  {player.redCards}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Team Statistics */}
            <TabsContent value="teams">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Team Goals */}
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-blue-primary mb-4">Gols por Time</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={teamGoalsData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="goalsScored" fill="#1a237e" name="Gols Marcados" />
                        <Bar dataKey="goalsConceded" fill="#ff5252" name="Gols Sofridos" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Team Performance */}
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold text-blue-primary mb-4">Desempenho dos Times</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vitórias
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Empates
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Derrotas
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Saldo
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {teamStats
                          .filter(team => selectedCategory === 'all' || team.category === selectedCategory)
                          .sort((a, b) => {
                            // Sort by points first (3 for win, 1 for draw)
                            const pointsA = a.wins * 3 + a.draws;
                            const pointsB = b.wins * 3 + b.draws;
                            if (pointsB !== pointsA) return pointsB - pointsA;
                            
                            // If points are equal, sort by goal difference
                            const diffA = a.goalsScored - a.goalsConceded;
                            const diffB = b.goalsScored - b.goalsConceded;
                            if (diffB !== diffA) return diffB - diffA;
                            
                            // If goal difference is equal, sort by goals scored
                            return b.goalsScored - a.goalsScored;
                          })
                          .map(team => (
                            <tr key={team.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img src={team.logo} alt={team.name} className="h-8 w-8 mr-2" />
                                  <span className="font-medium">{team.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">
                                {team.wins}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-yellow-600 font-medium">
                                {team.draws}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-red-600 font-medium">
                                {team.losses}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap font-bold">
                                <span className={
                                  team.goalsScored - team.goalsConceded > 0 
                                  ? 'text-green-600'
                                  : team.goalsScored - team.goalsConceded < 0
                                    ? 'text-red-600'
                                    : 'text-gray-600'
                                }>
                                  {team.goalsScored - team.goalsConceded > 0 ? '+' : ''}
                                  {team.goalsScored - team.goalsConceded}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
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

export default Statistics;
