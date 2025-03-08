
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import TeamCard from '@/components/TeamCard';
import { getTeams } from '@/lib/api';
import { Team } from '@/types';
import { Shield, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Teams = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const { data: teams, isLoading, error } = useQuery({
    queryKey: ['teams'],
    queryFn: () => getTeams(),
  });

  // Group teams by name to avoid duplication and collect all categories
  const uniqueTeams = React.useMemo(() => {
    if (!teams) return [];
    
    const teamMap = new Map<string, Team & { categories: string[] }>();
    
    teams.forEach(team => {
      if (!teamMap.has(team.name)) {
        teamMap.set(team.name, { ...team, categories: [team.category] });
      } else {
        // If the team already exists, add the category to the list if it's not already there
        const existingTeam = teamMap.get(team.name)!;
        if (!existingTeam.categories.includes(team.category)) {
          existingTeam.categories.push(team.category);
        }
      }
    });
    
    return Array.from(teamMap.values());
  }, [teams]);

  // Filter teams based on search term
  const filteredTeams = React.useMemo(() => {
    if (!searchTerm.trim()) return uniqueTeams;
    
    const normalizedSearch = searchTerm.toLowerCase().trim();
    return uniqueTeams.filter(team => 
      team.name.toLowerCase().includes(normalizedSearch) ||
      team.categories.some(cat => cat.toLowerCase().includes(normalizedSearch))
    );
  }, [uniqueTeams, searchTerm]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      <Navbar />
      <main className="flex-grow pt-24 pb-16"> {/* Updated pt-16 to pt-24 for more space at the top */}
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-blue-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-blue-primary">Times Participantes</h1>
            </div>
            <p className="text-gray-600 max-w-3xl mx-auto mb-8">
              Conheça os times que participam dos nossos campeonatos. Clique em cada time para ver mais detalhes.
            </p>
            
            {/* Search bar */}
            <div className="max-w-md mx-auto relative mb-10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  type="text" 
                  placeholder="Buscar times ou categorias..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-6 border-blue-100 focus:border-blue-300 rounded-full shadow-sm"
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">Não foi possível carregar os times. Por favor, tente novamente mais tarde.</p>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-blue-100">
              {searchTerm ? (
                <>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum time encontrado</h3>
                  <p className="text-gray-500">
                    Não encontramos nenhum time correspondente à sua busca. Tente outros termos.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum time cadastrado</h3>
                  <p className="text-gray-500">
                    Novos times serão exibidos aqui quando forem cadastrados pelo Painel Administrativo.
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Mostrando {filteredTeams.length} {filteredTeams.length === 1 ? 'time' : 'times'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredTeams.map((team) => (
                  <TeamCard 
                    key={team.id} 
                    id={team.id}
                    name={team.name} 
                    logo={team.logo || team.logoUrl || ''} 
                    categories={team.categories}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Teams;
