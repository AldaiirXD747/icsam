
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Star, Award, Shield } from "lucide-react";

// Empty data for player statistics
const playerStats = [];

// Empty data for team statistics
const teamStats = [];

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
    <div className="min-h-screen flex flex-col bg-gray-50">
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
            <Select 
              value={selectedCategory} 
              onValueChange={(value) => setSelectedCategory(value)}
            >
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                <SelectItem value="SUB-11">SUB-11</SelectItem>
                <SelectItem value="SUB-13">SUB-13</SelectItem>
                <SelectItem value="SUB-15">SUB-15</SelectItem>
                <SelectItem value="SUB-17">SUB-17</SelectItem>
              </SelectContent>
            </Select>
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
                <div className="glass-card p-6 shadow-md rounded-xl hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Trophy className="h-6 w-6 text-blue-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-blue-primary">Artilheiros</h2>
                  </div>
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">Nenhum dado disponível</h3>
                      <p>Estatísticas de artilheiros serão exibidas quando adicionadas no painel administrativo.</p>
                    </div>
                  </div>
                </div>
                
                {/* Top Assisters */}
                <div className="glass-card p-6 shadow-md rounded-xl hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="bg-lime-100 p-2 rounded-full mr-3">
                      <Star className="h-6 w-6 text-lime-600" />
                    </div>
                    <h2 className="text-xl font-bold text-blue-primary">Assistências</h2>
                  </div>
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Star className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">Nenhum dado disponível</h3>
                      <p>Estatísticas de assistências serão exibidas quando adicionadas no painel administrativo.</p>
                    </div>
                  </div>
                </div>
                
                {/* Discipline Stats */}
                <div className="glass-card p-6 shadow-md rounded-xl hover:shadow-lg transition-shadow lg:col-span-2">
                  <div className="flex items-center mb-4">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                      <Award className="h-6 w-6 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-blue-primary">Cartões</h2>
                  </div>
                  <div className="py-16 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Award className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">Nenhum dado disponível</h3>
                      <p>Estatísticas de cartões serão exibidas quando adicionadas no painel administrativo.</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Team Statistics */}
            <TabsContent value="teams">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Team Goals */}
                <div className="glass-card p-6 shadow-md rounded-xl hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Shield className="h-6 w-6 text-blue-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-blue-primary">Gols por Time</h2>
                  </div>
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Shield className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">Nenhum dado disponível</h3>
                      <p>Estatísticas de gols por time serão exibidas quando adicionadas no painel administrativo.</p>
                    </div>
                  </div>
                </div>
                
                {/* Team Performance */}
                <div className="glass-card p-6 shadow-md rounded-xl hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Trophy className="h-6 w-6 text-blue-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-blue-primary">Desempenho dos Times</h2>
                  </div>
                  <div className="py-16 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Trophy className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">Nenhum dado disponível</h3>
                      <p>Estatísticas de desempenho dos times serão exibidas quando adicionadas no painel administrativo.</p>
                    </div>
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
