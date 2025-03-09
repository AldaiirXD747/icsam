
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BarChart, Users, Trophy, Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatisticsTables from '@/components/StatisticsTables';

const Statistics = () => {
  const location = useLocation();
  const [selectedChampionship, setSelectedChampionship] = useState('base-forte-2025');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Set default championship based on route
  useEffect(() => {
    if (location.pathname.includes('/base-forte-2025')) {
      setSelectedChampionship('base-forte-2025');
    }
  }, [location.pathname]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-[#1a237e] mb-4">Estatísticas</h1>
          <p className="text-gray-600 mb-8">
            Acompanhe todas as estatísticas dos campeonatos organizados pelo Instituto Criança Santa Maria.
          </p>
          
          <Card className="mb-8">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="flex items-center text-blue-primary">
                <Filter className="mr-2 h-5 w-5" />
                Filtrar Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Campeonato
                  </label>
                  <Select value={selectedChampionship} onValueChange={setSelectedChampionship}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um campeonato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos-campeonatos">Todos os campeonatos</SelectItem>
                      <SelectItem value="base-forte-2025">Campeonato Base Forte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      <SelectItem value="SUB-11">SUB-11</SelectItem>
                      <SelectItem value="SUB-13">SUB-13</SelectItem>
                      <SelectItem value="SUB-15">SUB-15</SelectItem>
                      <SelectItem value="SUB-17">SUB-17</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="scorers">
            <TabsList className="mb-6">
              <TabsTrigger value="scorers" className="data-[state=active]:bg-blue-primary data-[state=active]:text-white">
                Artilheiros
              </TabsTrigger>
              <TabsTrigger value="cards" className="data-[state=active]:bg-blue-primary data-[state=active]:text-white">
                Cartões
              </TabsTrigger>
              <TabsTrigger value="teams" className="data-[state=active]:bg-blue-primary data-[state=active]:text-white">
                Times
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="scorers">
              <Card>
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardTitle className="flex items-center text-blue-primary">
                    <Trophy className="mr-2 h-5 w-5" />
                    Artilheiros do Campeonato
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <StatisticsTables 
                    championshipId={selectedChampionship} 
                    category={selectedCategory} 
                    type="scorers"
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="cards">
              <Card>
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardTitle className="flex items-center text-blue-primary">
                    <Calendar className="mr-2 h-5 w-5" />
                    Cartões do Campeonato
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <StatisticsTables 
                    championshipId={selectedChampionship} 
                    category={selectedCategory} 
                    type="cards"
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="teams">
              <Card>
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardTitle className="flex items-center text-blue-primary">
                    <Users className="mr-2 h-5 w-5" />
                    Estatísticas dos Times
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <StatisticsTables 
                    championshipId={selectedChampionship} 
                    category={selectedCategory} 
                    type="teams"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Statistics;
