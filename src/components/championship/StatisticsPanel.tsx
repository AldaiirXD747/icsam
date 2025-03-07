
import React, { useState } from 'react';
import { Medal, AlertCircle } from 'lucide-react';

interface TopScorer {
  player: {
    id: string;
    name: string;
    number: number | null;
    position: string;
    photo: string | null;
  };
  team: {
    id: string;
    name: string;
    logo: string | null;
  };
  goals: number;
}

interface YellowCardLeader {
  player: {
    id: string;
    name: string;
    number: number | null;
    position: string;
    photo: string | null;
  };
  team: {
    id: string;
    name: string;
    logo: string | null;
  };
  yellow_cards: number;
}

interface StatisticsPanelProps {
  topScorers: TopScorer[];
  yellowCardLeaders: YellowCardLeader[];
  isLoading: boolean;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ 
  topScorers, 
  yellowCardLeaders, 
  isLoading 
}) => {
  const [activeTab, setActiveTab] = useState<'scorers' | 'yellowCards'>('scorers');
  
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
            activeTab === 'scorers'
              ? 'border-b-2 border-[#1a237e] text-[#1a237e]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('scorers')}
        >
          Artilheiros
        </button>
        <button
          className={`py-2 px-4 -mb-px font-medium text-sm ${
            activeTab === 'yellowCards'
              ? 'border-b-2 border-[#1a237e] text-[#1a237e]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('yellowCards')}
        >
          Cartões Amarelos
        </button>
      </div>

      {activeTab === 'scorers' && (
        <div>
          {topScorers.length === 0 ? (
            <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
              <Medal className="h-10 w-10 mx-auto mb-2 text-gray-400" />
              Ainda não há dados de artilheiros neste campeonato.
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pos
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jogador
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gols
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topScorers.map((scorer, index) => (
                    <tr key={scorer.player.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                            {scorer.player.photo ? (
                              <img src={scorer.player.photo} alt={scorer.player.name} className="h-10 w-10 object-cover" />
                            ) : (
                              <span className="text-xs font-bold text-[#1a237e]">{scorer.player.name.charAt(0)}</span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{scorer.player.name}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden mr-1">
                                {scorer.team.logo ? (
                                  <img src={scorer.team.logo} alt={scorer.team.name} className="w-3 h-3 object-contain" />
                                ) : (
                                  <span className="text-[0.5rem] font-bold text-[#1a237e]">{scorer.team.name.charAt(0)}</span>
                                )}
                              </div>
                              {scorer.team.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-[#1a237e]">
                        {scorer.goals}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'yellowCards' && (
        <div>
          {yellowCardLeaders.length === 0 ? (
            <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
              <AlertCircle className="h-10 w-10 mx-auto mb-2 text-gray-400" />
              Ainda não há dados de cartões amarelos neste campeonato.
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pos
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jogador
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cartões
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {yellowCardLeaders.map((leader, index) => (
                    <tr key={leader.player.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                            {leader.player.photo ? (
                              <img src={leader.player.photo} alt={leader.player.name} className="h-10 w-10 object-cover" />
                            ) : (
                              <span className="text-xs font-bold text-[#1a237e]">{leader.player.name.charAt(0)}</span>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{leader.player.name}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden mr-1">
                                {leader.team.logo ? (
                                  <img src={leader.team.logo} alt={leader.team.name} className="w-3 h-3 object-contain" />
                                ) : (
                                  <span className="text-[0.5rem] font-bold text-[#1a237e]">{leader.team.name.charAt(0)}</span>
                                )}
                              </div>
                              {leader.team.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-amber-500">
                        {leader.yellow_cards}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatisticsPanel;
