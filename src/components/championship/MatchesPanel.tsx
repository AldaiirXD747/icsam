
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ClipboardList, Calendar } from 'lucide-react';
import type { ChampionshipMatch } from '@/types/championship';

interface MatchesPanelProps {
  matches: ChampionshipMatch[];
  isLoading: boolean;
  selectedCategory?: string;
}

const MatchesPanel: React.FC<MatchesPanelProps> = ({ matches, isLoading, selectedCategory }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  
  // Filter matches by status and category
  const filteredMatches = matches.filter(match => {
    if (selectedCategory && match.category !== selectedCategory) {
      return false;
    }
    
    if (activeTab === 'upcoming') {
      return ['scheduled', 'confirmed', 'in_progress'].includes(match.status);
    } else {
      return ['completed', 'finalizado', 'encerrado'].includes(match.status);
    }
  });
  
  // Group matches by date
  const groupedMatches: Record<string, ChampionshipMatch[]> = {};
  
  // Create a Set to track unique matches to avoid duplicates
  const uniqueMatchKeys = new Set<string>();
  
  filteredMatches.forEach(match => {
    // Create a unique key for this match
    const matchKey = `${match.home_team}-${match.away_team}-${match.category}-${match.date}`;
    
    // Skip if we've already processed this match (prevents duplicates)
    if (uniqueMatchKeys.has(matchKey)) {
      return;
    }
    
    // Mark this match as processed
    uniqueMatchKeys.add(matchKey);
    
    // Use the date for grouping
    const matchDate = match.date;
    
    if (!groupedMatches[matchDate]) {
      groupedMatches[matchDate] = [];
    }
    
    groupedMatches[matchDate].push(match);
  });
  
  // Sort dates chronologically
  const sortedDates = Object.keys(groupedMatches).sort((a, b) => {
    if (activeTab === 'upcoming') {
      return new Date(a).getTime() - new Date(b).getTime(); // Ascending for upcoming
    } else {
      return new Date(b).getTime() - new Date(a).getTime(); // Descending for completed
    }
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

  return (
    <div>
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 -mb-px font-medium text-sm ${
            activeTab === 'upcoming'
              ? 'border-b-2 border-[#1a237e] text-[#1a237e]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          Próximas Partidas
        </button>
        <button
          className={`py-2 px-4 -mb-px font-medium text-sm ${
            activeTab === 'completed'
              ? 'border-b-2 border-[#1a237e] text-[#1a237e]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('completed')}
        >
          Partidas Finalizadas
        </button>
      </div>

      {sortedDates.length === 0 ? (
        <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
          <ClipboardList className="h-10 w-10 mx-auto mb-2 text-gray-400" />
          {activeTab === 'upcoming' 
            ? 'Não há partidas agendadas para este campeonato.'
            : 'Não há partidas finalizadas neste campeonato.'}
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-5 w-5 text-[#1a237e]" />
                <h3 className="font-medium text-gray-700">
                  {format(new Date(date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </h3>
              </div>
              
              <div className="space-y-3">
                {groupedMatches[date].map(match => (
                  <div 
                    key={match.id} 
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {match.round && (
                      <div className="bg-gray-50 py-1 px-3 text-xs text-gray-500 border-b border-gray-100">
                        {match.round}
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-500">
                          {match.time.substring(0, 5)} • {match.location}
                        </span>
                        <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {match.category}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden mr-2">
                            {match.home_team_logo ? (
                              <img src={match.home_team_logo} alt={match.home_team_name} className="w-6 h-6 object-contain" />
                            ) : (
                              <span className="text-xs font-bold text-[#1a237e]">
                                {match.home_team_name?.charAt(0) || '?'}
                              </span>
                            )}
                          </div>
                          <span className="font-medium">{match.home_team_name || 'Time A'}</span>
                        </div>
                        
                        {activeTab === 'completed' || match.status === 'completed' || match.status === 'finalizado' || match.status === 'encerrado' ? (
                          <div className="mx-4 px-3 py-1 bg-gray-100 rounded-md flex items-center justify-center">
                            <span className="font-bold text-lg text-[#1a237e]">{match.home_score || 0}</span>
                            <span className="text-gray-400 mx-1">-</span>
                            <span className="font-bold text-lg text-[#1a237e]">{match.away_score || 0}</span>
                          </div>
                        ) : (
                          <span className="mx-2 text-gray-400 text-sm font-medium">vs</span>
                        )}
                        
                        <div className="flex items-center justify-end flex-1">
                          <span className="font-medium">{match.away_team_name || 'Time B'}</span>
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden ml-2">
                            {match.away_team_logo ? (
                              <img src={match.away_team_logo} alt={match.away_team_name} className="w-6 h-6 object-contain" />
                            ) : (
                              <span className="text-xs font-bold text-[#1a237e]">
                                {match.away_team_name?.charAt(0) || '?'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchesPanel;
