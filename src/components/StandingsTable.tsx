
import React from 'react';

interface Team {
  id: string;
  name: string;
  logo: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

interface StandingsTableProps {
  teams: Team[];
  category: string;
  group: string;
}

const StandingsTable: React.FC<StandingsTableProps> = ({ teams, category, group }) => {
  // Sort teams by points, then goal difference, then goals scored
  const sortedTeams = [...teams].sort((a, b) => {
    // Sort by points first
    if (b.points !== a.points) return b.points - a.points;
    
    // If points are equal, sort by goal difference
    const goalDiffA = a.goalsFor - a.goalsAgainst;
    const goalDiffB = b.goalsFor - b.goalsAgainst;
    if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;
    
    // If goal difference is equal, sort by goals scored
    return b.goalsFor - a.goalsFor;
  });

  return (
    <div className="glass-card overflow-hidden">
      <div className="bg-blue-primary px-4 py-3 text-white">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{category} - Grupo {group}</h3>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pos
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                J
              </th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                V
              </th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                E
              </th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                D
              </th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                GP
              </th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                GC
              </th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                SG
              </th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                P
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTeams.map((team, index) => (
              <tr key={team.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {index + 1}
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 mr-2">
                      <img className="h-8 w-8 object-contain" src={team.logo} alt={team.name} />
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {team.name}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {team.played}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-green-600 text-center font-medium">
                  {team.wins}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-yellow-600 text-center">
                  {team.draws}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-red-600 text-center">
                  {team.losses}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {team.goalsFor}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  {team.goalsAgainst}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-center font-medium">
                  <span 
                    className={
                      team.goalsFor - team.goalsAgainst > 0 
                        ? 'text-green-600' 
                        : team.goalsFor - team.goalsAgainst < 0 
                          ? 'text-red-600' 
                          : 'text-gray-500'
                    }
                  >
                    {team.goalsFor - team.goalsAgainst > 0 ? '+' : ''}
                    {team.goalsFor - team.goalsAgainst}
                  </span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-center">
                  <span className="px-2 py-1 bg-blue-primary text-white font-bold rounded-md">
                    {team.points}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StandingsTable;
