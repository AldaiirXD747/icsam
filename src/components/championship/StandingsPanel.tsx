import React, { useState } from 'react';
import { BarChart2 } from 'lucide-react';
import type { ChampionshipStanding } from '@/types/championship';

interface StandingsPanelProps {
  standings: ChampionshipStanding[];
  groups: string[];
  isLoading: boolean;
}

const StandingsPanel: React.FC<StandingsPanelProps> = ({ standings, groups, isLoading }) => {
  const [selectedGroup, setSelectedGroup] = useState<string>(groups[0] || '');
  
  // Filter standings by selected group
  const filteredStandings = standings.filter(standing => {
    // If no group is selected, show all
    if (!selectedGroup) return true;
    
    // Otherwise filter by the selected group
    // Note: In a real scenario, you would need to join the standings with teams to get the group_name
    return true; // For now, we're showing all standings
  });
  
  if (isLoading) {
    return (
      <div className="bg-gray-100 p-8 rounded-lg text-center animate-pulse">
        <div className="h-10 w-10 bg-gray-300 rounded-full mx-auto mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
      </div>
    );
  }

  if (filteredStandings.length === 0) {
    return (
      <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
        <BarChart2 className="h-10 w-10 mx-auto mb-2 text-gray-400" />
        Classificação não disponível neste momento.
      </div>
    );
  }

  return (
    <div>
      {groups.length > 1 && (
        <div className="mb-4 flex gap-2">
          {groups.map(group => (
            <button
              key={group}
              className={`px-3 py-1 text-sm font-medium rounded ${
                selectedGroup === group
                  ? 'bg-[#1a237e] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedGroup(group)}
            >
              Grupo {group}
            </button>
          ))}
        </div>
      )}
      
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pos
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                PTS
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                J
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                V
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                E
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                D
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                GP
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                GC
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                SG
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStandings.map((team) => (
              <tr key={team.team_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {team.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                      {team.team_logo ? (
                        <img src={team.team_logo} alt={team.team_name} className="h-6 w-6 object-contain" />
                      ) : (
                        <span className="text-xs font-bold text-[#1a237e]">{team.team_name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{team.team_name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-[#1a237e]">
                  {team.points}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                  {team.played}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 hidden sm:table-cell">
                  {team.won}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 hidden sm:table-cell">
                  {team.drawn}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 hidden sm:table-cell">
                  {team.lost}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 hidden md:table-cell">
                  {team.goals_for}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 hidden md:table-cell">
                  {team.goals_against}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                  {team.goal_difference}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        <span className="mr-2">PTS: Pontos</span>
        <span className="mr-2">J: Jogos</span>
        <span className="mr-2">V: Vitórias</span>
        <span className="mr-2">E: Empates</span>
        <span className="mr-2">D: Derrotas</span>
        <span className="mr-2">GP: Gols Pró</span>
        <span className="mr-2">GC: Gols Contra</span>
        <span>SG: Saldo de Gols</span>
      </div>
    </div>
  );
};

export default StandingsPanel;
