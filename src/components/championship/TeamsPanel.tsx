
import React from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import type { ChampionshipTeam } from '@/types/championship';

interface TeamsPanelProps {
  teams: ChampionshipTeam[];
  isLoading: boolean;
  selectedCategory?: string;
}

const TeamsPanel: React.FC<TeamsPanelProps> = ({ teams, isLoading, selectedCategory }) => {
  // Group teams by group_name
  const groupedTeams = teams.reduce((acc, team) => {
    // If category filter is applied and team doesn't match, skip it
    if (selectedCategory && team.category !== selectedCategory) {
      return acc;
    }
    
    const groupName = team.group_name || 'Sem grupo';
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(team);
    return acc;
  }, {} as Record<string, ChampionshipTeam[]>);

  if (isLoading) {
    return (
      <div className="bg-gray-100 p-8 rounded-lg text-center animate-pulse">
        <div className="h-10 w-10 bg-gray-300 rounded-full mx-auto mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
      </div>
    );
  }

  if (Object.keys(groupedTeams).length === 0) {
    return (
      <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
        <Users className="h-10 w-10 mx-auto mb-2 text-gray-400" />
        {selectedCategory 
          ? `Nenhum time cadastrado na categoria ${selectedCategory}.`
          : 'Nenhum time cadastrado neste campeonato ainda.'}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedTeams).map(([groupName, groupTeams]) => (
        <div key={groupName} className="rounded-lg overflow-hidden border border-gray-200">
          <div className="bg-[#1a237e] text-white font-semibold py-3 px-4">
            Grupo {groupName}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {groupTeams.map(team => (
              <Link 
                to={`/times/${team.id}`} 
                key={team.id}
                className="flex items-center p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                  {team.logo ? (
                    <img src={team.logo} alt={team.name} className="w-10 h-10 object-contain" />
                  ) : (
                    <span className="text-xl font-bold text-[#1a237e]">{team.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{team.name}</h3>
                  <p className="text-sm text-gray-500">{team.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamsPanel;
