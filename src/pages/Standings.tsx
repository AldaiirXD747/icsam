
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Trophy, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StandingsTable from '@/components/StandingsTable';

const Standings = () => {
  const [selectedChampionship, setSelectedChampionship] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-[#1a237e] mb-4">Classificação</h1>
          <p className="text-gray-600 mb-8">
            Acompanhe a classificação dos times nos campeonatos organizados pelo Instituto Criança Santa Maria.
          </p>
          
          <Card className="mb-8">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardTitle className="flex items-center text-blue-primary">
                <Filter className="mr-2 h-5 w-5" />
                Filtrar Classificação
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
                      <SelectItem value="">Todos os campeonatos</SelectItem>
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
          
          {!selectedChampionship ? (
            <div className="bg-white rounded-lg p-8 shadow-md text-center">
              <Trophy className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">
                Selecione um campeonato para visualizar a classificação
              </h3>
              <p className="text-gray-400">
                Escolha um campeonato no filtro acima para ver a tabela de classificação dos times.
              </p>
            </div>
          ) : (
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="flex items-center text-blue-primary">
                  <Trophy className="mr-2 h-5 w-5" />
                  Classificação - {selectedCategory === 'all' ? 'Todas as categorias' : selectedCategory}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <StandingsTable 
                  championshipId={selectedChampionship} 
                  category={selectedCategory} 
                />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Standings;
