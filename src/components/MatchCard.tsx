
import React from 'react';

type MatchStatus = 'scheduled' | 'live' | 'finished';

interface MatchCardProps {
  id: number;
  homeTeam: {
    name: string;
    logo: string;
    score?: number;
  };
  awayTeam: {
    name: string;
    logo: string;
    score?: number;
  };
  category: string;
  date: string;
  time: string;
  group: string;
  status: MatchStatus;
  venue?: string;
}

const StatusBadge: React.FC<{ status: MatchStatus }> = ({ status }) => {
  const statusMap = {
    scheduled: { text: 'Agendado', classes: 'bg-gray-100 text-gray-800' },
    live: { text: 'Ao Vivo', classes: 'bg-red-100 text-red-800 animate-pulse' },
    finished: { text: 'Finalizado', classes: 'bg-blue-100 text-blue-800' },
  };

  const { text, classes } = statusMap[status];

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes}`}>
      {text}
    </span>
  );
};

const MatchCard: React.FC<MatchCardProps> = ({
  id,
  homeTeam,
  awayTeam,
  category,
  date,
  time,
  group,
  status,
  venue,
}) => {
  const showScore = status === 'live' || status === 'finished';

  return (
    <div className="glass-card overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="bg-blue-primary text-white px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{category}</span>
          <span className="text-xs px-2 py-0.5 bg-white bg-opacity-20 rounded-full">Grupo {group}</span>
        </div>
        <StatusBadge status={status} />
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">{date}</div>
          <div className="text-sm font-medium">{time}</div>
        </div>
        
        <div className="flex items-center justify-between">
          {/* Home Team */}
          <div className="flex flex-col items-center w-2/5">
            <div className="h-16 w-16 flex items-center justify-center mb-2">
              <img 
                src={homeTeam.logo} 
                alt={homeTeam.name} 
                className="h-full object-contain"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold text-blue-primary">{homeTeam.name}</p>
            </div>
          </div>
          
          {/* Score */}
          <div className="flex items-center justify-center w-1/5">
            {showScore ? (
              <div className="text-2xl font-bold">
                <span className={status === 'live' && homeTeam.score && homeTeam.score > (awayTeam.score || 0) ? 'text-lime-primary' : ''}>
                  {homeTeam.score || 0}
                </span>
                <span className="mx-1">-</span>
                <span className={status === 'live' && awayTeam.score && awayTeam.score > (homeTeam.score || 0) ? 'text-lime-primary' : ''}>
                  {awayTeam.score || 0}
                </span>
              </div>
            ) : (
              <div className="text-lg font-semibold text-gray-400">vs</div>
            )}
          </div>
          
          {/* Away Team */}
          <div className="flex flex-col items-center w-2/5">
            <div className="h-16 w-16 flex items-center justify-center mb-2">
              <img 
                src={awayTeam.logo} 
                alt={awayTeam.name} 
                className="h-full object-contain"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold text-blue-primary">{awayTeam.name}</p>
            </div>
          </div>
        </div>
        
        {venue && (
          <div className="mt-4 text-center text-sm text-gray-500">
            {venue}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
