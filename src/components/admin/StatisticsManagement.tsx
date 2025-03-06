
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { BarChart as BarChartIcon, ListFilter, Trophy } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

type TopScorer = {
  id: number;
  name: string;
  team: string;
  goals: number;
  category: string;
};

type YellowCardLeader = {
  id: number;
  name: string;
  team: string;
  yellowCards: number;
  category: string;
};

const StatisticsManagement = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Mock data for top scorers
  const [topScorers, setTopScorers] = useState<TopScorer[]>([
    { id: 1, name: 'Carlos Silva', team: 'Águias FC', goals: 12, category: 'SUB-13' },
    { id: 2, name: 'Pedro Santos', team: 'Leões FC', goals: 10, category: 'SUB-13' },
    { id: 3, name: 'Lucas Oliveira', team: 'Tigres FC', goals: 9, category: 'SUB-11' },
    { id: 4, name: 'Matheus Costa', team: 'Tubarões FC', goals: 8, category: 'SUB-11' },
    { id: 5, name: 'Gabriel Sousa', team: 'Águias FC', goals: 7, category: 'SUB-13' },
  ]);
  
  // Mock data for yellow card leaders
  const [yellowCardLeaders, setYellowCardLeaders] = useState<YellowCardLeader[]>([
    { id: 1, name: 'João Lima', team: 'Tigres FC', yellowCards: 5, category: 'SUB-13' },
    { id: 2, name: 'Miguel Costa', team: 'Leões FC', yellowCards: 4, category: 'SUB-13' },
    { id: 3, name: 'Fernando Silva', team: 'Águias FC', yellowCards: 3, category: 'SUB-11' },
    { id: 4, name: 'Rafael Santos', team: 'Tubarões FC', yellowCards: 3, category: 'SUB-11' },
    { id: 5, name: 'Rodrigo Oliveira', team: 'Tigres FC', yellowCards: 2, category: 'SUB-13' },
  ]);

  const filteredTopScorers = topScorers
    .filter(scorer => selectedCategory === 'all' || scorer.category === selectedCategory)
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 10);
    
  const filteredYellowCardLeaders = yellowCardLeaders
    .filter(leader => selectedCategory === 'all' || leader.category === selectedCategory)
    .sort((a, b) => b.yellowCards - a.yellowCards)
    .slice(0, 10);
    
  const goalsChartData = filteredTopScorers.map(scorer => ({
    name: scorer.name,
    gols: scorer.goals,
    time: scorer.team,
  }));
    
  const cardsChartData = filteredYellowCardLeaders.map(leader => ({
    name: leader.name,
    cartões: leader.yellowCards,
    time: leader.team,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a237e]">Gerenciamento de Estatísticas</h2>
        
        <div className="flex items-center space-x-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Categorias</SelectItem>
              <SelectItem value="SUB-11">SUB-11</SelectItem>
              <SelectItem value="SUB-13">SUB-13</SelectItem>
              <SelectItem value="SUB-15">SUB-15</SelectItem>
              <SelectItem value="SUB-17">SUB-17</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => toast({
            title: "Recurso em desenvolvimento",
            description: "A exportação de estatísticas será implementada em breve."
          })}>
            <ListFilter className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="topscorers">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="topscorers" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Artilheiros
          </TabsTrigger>
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <BarChartIcon className="h-4 w-4" />
            Cartões
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="topscorers">
          <Card>
            <CardHeader>
              <CardTitle>Artilheiros {selectedCategory !== 'all' ? `- ${selectedCategory}` : ''}</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTopScorers.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  Não há dados de artilharia para esta categoria.
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-2 text-left">Pos.</th>
                            <th className="px-4 py-2 text-left">Jogador</th>
                            <th className="px-4 py-2 text-left">Time</th>
                            <th className="px-4 py-2 text-center">Categoria</th>
                            <th className="px-4 py-2 text-center">Gols</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTopScorers.map((scorer, index) => (
                            <tr key={scorer.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3">{index + 1}</td>
                              <td className="px-4 py-3 font-medium">{scorer.name}</td>
                              <td className="px-4 py-3">{scorer.team}</td>
                              <td className="px-4 py-3 text-center">{scorer.category}</td>
                              <td className="px-4 py-3 text-center font-bold">{scorer.goals}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={goalsChartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="gols" fill="#1a237e" name="Gols" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cards">
          <Card>
            <CardHeader>
              <CardTitle>Cartões Amarelos {selectedCategory !== 'all' ? `- ${selectedCategory}` : ''}</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredYellowCardLeaders.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  Não há dados de cartões para esta categoria.
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-2 text-left">Pos.</th>
                            <th className="px-4 py-2 text-left">Jogador</th>
                            <th className="px-4 py-2 text-left">Time</th>
                            <th className="px-4 py-2 text-center">Categoria</th>
                            <th className="px-4 py-2 text-center">Cartões</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredYellowCardLeaders.map((leader, index) => (
                            <tr key={leader.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3">{index + 1}</td>
                              <td className="px-4 py-3 font-medium">{leader.name}</td>
                              <td className="px-4 py-3">{leader.team}</td>
                              <td className="px-4 py-3 text-center">{leader.category}</td>
                              <td className="px-4 py-3 text-center font-bold">{leader.yellowCards}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={cardsChartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="cartões" fill="#FFC107" name="Cartões Amarelos" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StatisticsManagement;
