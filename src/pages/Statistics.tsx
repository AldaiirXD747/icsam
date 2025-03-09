
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BarChart, Users, Trophy, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Statistics = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-[#1a237e] mb-4">Estatísticas</h1>
          <p className="text-gray-600 mb-8">
            Acompanhe todas as estatísticas dos campeonatos organizados pelo Instituto Criança Santa Maria.
          </p>
          
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
                  <p className="text-gray-500 mb-4">
                    Esta seção mostrará os artilheiros dos campeonatos. Selecione um campeonato no menu para ver os dados.
                  </p>
                  
                  <div className="flex flex-col items-center justify-center py-12">
                    <BarChart className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-400">
                      Selecione um campeonato para visualizar os artilheiros
                    </h3>
                  </div>
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
                  <p className="text-gray-500 mb-4">
                    Esta seção mostrará as estatísticas de cartões dos campeonatos. Selecione um campeonato no menu para ver os dados.
                  </p>
                  
                  <div className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-400">
                      Selecione um campeonato para visualizar as estatísticas de cartões
                    </h3>
                  </div>
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
                  <p className="text-gray-500 mb-4">
                    Esta seção mostrará as estatísticas dos times nos campeonatos. Selecione um campeonato no menu para ver os dados.
                  </p>
                  
                  <div className="flex flex-col items-center justify-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-400">
                      Selecione um campeonato para visualizar as estatísticas dos times
                    </h3>
                  </div>
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
