import React from 'react';
import { Team } from '@/types/championship';

interface ChampionshipHeaderProps {
  homeTeam: Team | string;
  awayTeam: Team | string;
  teams: Team[];
}

const ChampionshipHeader: React.FC<ChampionshipHeaderProps> = ({ homeTeam, awayTeam, teams }) => {
  // Update to handle both string and Team object types
  const renderTeam = (team: Team | string, index: number) => {
    // If team is a string (id), try to find it in teams array
    if (typeof team === 'string') {
      const teamObj = teams.find(t => t.id === team);
      if (!teamObj) return null;
      
      return (
        <div key={teamObj.id} className="flex flex-col items-center mx-2">
          <div className="w-12 h-12 bg-white rounded-full p-1 shadow-md flex items-center justify-center">
            <img 
              src={teamObj.logo || '/placeholder.svg'} 
              alt={teamObj.name} 
              className="w-10 h-10 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
          <p className="mt-2 text-xs font-medium">{teamObj.name}</p>
        </div>
      );
    }
    
    // If team is an object, render it directly
    return (
      <div key={team.id || index} className="flex flex-col items-center mx-2">
        <div className="w-12 h-12 bg-white rounded-full p-1 shadow-md flex items-center justify-center">
          <img 
            src={team.logo || '/placeholder.svg'} 
            alt={team.name} 
            className="w-10 h-10 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
        <p className="mt-2 text-xs font-medium">{team.name}</p>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center">
      {renderTeam(homeTeam, 0)}
      <span className="mx-4 text-gray-500">vs</span>
      {renderTeam(awayTeam, 1)}
    </div>
  );
};

export default ChampionshipHeader;
