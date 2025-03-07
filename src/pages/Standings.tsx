
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StandingsTable from '../components/StandingsTable';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw } from 'lucide-react';

const Standings = () => {
  const { championshipId } = useParams<{ championshipId?: string }>();
  const [selectedCategory, setSelectedCategory] = useState<string>('SUB-11');
  const [categories, setCategories] = useState<string[]>([]);
  const [standingsData, setStandingsData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchCategories();
    fetchStandingsData();
  }, []);
  
  useEffect(() => {
    if (selectedCategory) {
      fetchStandingsData();
    }
  }, [selectedCategory]);
  
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('category')
        .order('category');
      
      if (error) throw error;
      
      if (data) {
        const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
        setCategories(uniqueCategories);
        
        if (uniqueCategories.length > 0 && !selectedCategory) {
          setSelectedCategory(uniqueCategories[0]);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      setError('Não foi possível carregar as categorias');
    }
  };
  
  const fetchStandingsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: groups, error: groupsError } = await supabase
        .from('teams')
        .select('group_name')
        .eq('category', selectedCategory)
        .order('group_name');
      
      if (groupsError) throw groupsError;
      
      const uniqueGroups = Array.from(new Set(groups.map(item => item.group_name)));
      const standingsResult: any = {};
      
      for (const group of uniqueGroups) {
        const { data: standings, error: standingsError } = await supabase
          .from('standings')
          .select(`
            id,
            position,
            points,
            played,
            won,
            drawn,
            lost,
            goals_for,
            goals_against,
            goal_difference,
            team_id,
            teams (
              id,
              name,
              logo
            )
          `)
          .eq('category', selectedCategory)
          .eq('group_name', group)
          .order('position');
        
        if (standingsError) throw standingsError;
        
        // Transform to the format expected by StandingsTable
        const formattedStandings = standings.map(standing => ({
          id: standing.team_id,
          name: standing.teams?.name || 'Time desconhecido',
          logo: standing.teams?.logo || '',
          played: standing.played,
          wins: standing.won,
          draws: standing.drawn,
          losses: standing.lost,
          goalsFor: standing.goals_for,
          goalsAgainst: standing.goals_against,
          points: standing.points
        }));
        
        standingsResult[group] = formattedStandings;
      }
      
      const categoryData = { ...standingsData };
      categoryData[selectedCategory] = standingsResult;
      setStandingsData(categoryData);
    } catch (error) {
      console.error('Erro ao buscar dados de classificação:', error);
      setError('Não foi possível carregar a classificação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-24 flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-primary mb-4">
              {championshipId ? 'Classificação do Campeonato' : 'Classificação Geral'}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Confira a tabela de classificação atualizada de cada grupo por categoria.
            </p>
          </div>
          
          {/* Category Tabs */}
          {categories.length > 0 && (
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-md shadow-sm">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 text-sm font-medium first:rounded-l-lg last:rounded-r-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-primary text-white'
                        : 'bg-white text-blue-primary border border-blue-primary hover:bg-blue-50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Loading state */}
          {loading && (
            <div className="flex justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-primary" />
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={fetchStandingsData} 
                className="mt-4 px-4 py-2 bg-blue-primary text-white rounded hover:bg-blue-700"
              >
                Tentar novamente
              </button>
            </div>
          )}
          
          {/* Standing Tables */}
          {!loading && !error && standingsData[selectedCategory] && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(standingsData[selectedCategory]).map(([group, teams]) => (
                <StandingsTable 
                  key={`${selectedCategory}-${group}`} 
                  teams={teams as any[]} 
                  category={selectedCategory} 
                  group={group} 
                />
              ))}
            </div>
          )}
          
          {/* No data state */}
          {!loading && !error && (!standingsData[selectedCategory] || Object.keys(standingsData[selectedCategory]).length === 0) && (
            <div className="text-center py-12 text-gray-500">
              Nenhuma classificação encontrada para esta categoria.
            </div>
          )}
          
          {/* Legend */}
          <div className="glass-card p-6 mt-8">
            <h3 className="text-lg font-semibold text-blue-primary mb-4">Legenda</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex items-center">
                <span className="mr-2">Pos:</span>
                <span className="text-gray-600">Posição</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">J:</span>
                <span className="text-gray-600">Jogos</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-green-600 font-medium">V:</span>
                <span className="text-gray-600">Vitórias</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-yellow-600">E:</span>
                <span className="text-gray-600">Empates</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-red-600">D:</span>
                <span className="text-gray-600">Derrotas</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">GP:</span>
                <span className="text-gray-600">Gols Pró</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">GC:</span>
                <span className="text-gray-600">Gols Contra</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">SG:</span>
                <span className="text-gray-600">Saldo de Gols</span>
              </div>
              <div className="flex items-center">
                <span className="px-2 py-1 mr-2 bg-blue-primary text-white font-bold rounded-md">P:</span>
                <span className="text-gray-600">Pontos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Standings;
