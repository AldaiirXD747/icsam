
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TeamManagement from '@/components/admin/TeamManagement';
import ChampionshipManagement from '@/components/admin/ChampionshipManagement';
import MatchManagement from '@/components/admin/MatchManagement';
import StatisticsManagement from '@/components/admin/StatisticsManagement';
import PlayerManagement from '@/components/admin/PlayerManagement';
import GalleryManagement from '@/components/admin/GalleryManagement';
import { useUser } from '@/lib/clerk-mock';
import { BarChart4, Trophy, Users, CalendarDays, Medal, ImageIcon } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("championships");
  const { user, isLoaded } = useUser();

  // In a real application, we would check if the user is authenticated
  // and has the appropriate permissions to access the admin dashboard

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6 text-blue-primary">Painel Administrativo</h1>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Gerenciamento do Sistema</CardTitle>
              <CardDescription>
                Gerencie campeonatos, times, jogadores, partidas, estatísticas e mais.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  <TabsTrigger value="championships" className="data-[state=active]:bg-blue-primary data-[state=active]:text-white">
                    <Trophy className="h-4 w-4 mr-2" />
                    Campeonatos
                  </TabsTrigger>
                  <TabsTrigger value="teams" className="data-[state=active]:bg-blue-primary data-[state=active]:text-white">
                    <Users className="h-4 w-4 mr-2" />
                    Times
                  </TabsTrigger>
                  <TabsTrigger value="players" className="data-[state=active]:bg-blue-primary data-[state=active]:text-white">
                    <Users className="h-4 w-4 mr-2" />
                    Jogadores
                  </TabsTrigger>
                  <TabsTrigger value="matches" className="data-[state=active]:bg-blue-primary data-[state=active]:text-white">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Partidas
                  </TabsTrigger>
                  <TabsTrigger value="statistics" className="data-[state=active]:bg-blue-primary data-[state=active]:text-white">
                    <BarChart4 className="h-4 w-4 mr-2" />
                    Estatísticas
                  </TabsTrigger>
                  <TabsTrigger value="gallery" className="data-[state=active]:bg-blue-primary data-[state=active]:text-white">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Galeria
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="championships" className="p-4 border rounded-md min-h-[500px]">
                  <ChampionshipManagement />
                </TabsContent>
                
                <TabsContent value="teams" className="p-4 border rounded-md min-h-[500px]">
                  <TeamManagement />
                </TabsContent>
                
                <TabsContent value="players" className="p-4 border rounded-md min-h-[500px]">
                  <PlayerManagement />
                </TabsContent>
                
                <TabsContent value="matches" className="p-4 border rounded-md min-h-[500px]">
                  <MatchManagement />
                </TabsContent>
                
                <TabsContent value="statistics" className="p-4 border rounded-md min-h-[500px]">
                  <StatisticsManagement />
                </TabsContent>
                
                <TabsContent value="gallery" className="p-4 border rounded-md min-h-[500px]">
                  <GalleryManagement />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
