
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import TeamCard from '@/components/TeamCard';
import { getTeams } from '@/lib/api';
import { Team } from '@/types';

const Teams = () => {
  const { data: teams, isLoading, error } = useQuery({
    queryKey: ['teams'],
    queryFn: () => getTeams(),
  });

  // Group teams by name to avoid duplication
  const uniqueTeams = React.useMemo(() => {
    if (!teams) return [];
    
    const teamMap = new Map<string, Team>();
    
    teams.forEach(team => {
      if (!teamMap.has(team.name)) {
        teamMap.set(team.name, team);
      }
    });
    
    return Array.from(teamMap.values());
  }, [teams]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-primary mb-4">Times Participantes</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Conheça os times que participam dos nossos campeonatos. Clique em cada time para ver mais detalhes.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">Não foi possível carregar os times. Por favor, tente novamente mais tarde.</p>
            </div>
          ) : uniqueTeams.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum time cadastrado</h3>
              <p className="text-gray-500">
                Novos times serão exibidos aqui quando forem cadastrados pelo Painel Administrativo.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {uniqueTeams.map((team) => (
                <TeamCard 
                  key={team.id} 
                  id={team.id}
                  name={team.name} 
                  logo={team.logo || team.logoUrl || ''} 
                  category={team.category}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Teams;
