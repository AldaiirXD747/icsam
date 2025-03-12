
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChampionshipMatch, MatchStatus } from '@/types/championship';

interface MatchCardProps {
  match: ChampionshipMatch;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
  const getStatusBadgeColor = (status: MatchStatus) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'live':
      case 'in_progress':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'finished':
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'postponed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: MatchStatus) => {
    switch (status) {
      case 'scheduled':
        return 'Agendado';
      case 'live':
        return 'Ao vivo';
      case 'in_progress':
        return 'Em andamento';
      case 'finished':
      case 'completed':
        return 'Finalizado';
      case 'cancelled':
        return 'Cancelado';
      case 'postponed':
        return 'Adiado';
      default:
        return status;
    }
  };

  return (
    <Link to={`/match/${match.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-600">{match.time}</span>
            </div>
            <Badge className={getStatusBadgeColor(match.status)}>
              {getStatusLabel(match.status)}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center my-4">
            <div className="flex flex-col items-center w-2/5">
              <div className="w-12 h-12 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-2">
                <img 
                  src={match.home_team_logo || '/placeholder.svg'} 
                  alt={match.home_team_name} 
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
              <span className="text-sm font-medium text-center line-clamp-1">{match.home_team_name}</span>
            </div>
            
            <div className="w-1/5 flex flex-col items-center">
              <div className="text-xl font-bold">
                {match.home_score !== null ? match.home_score : '-'} 
                <span className="mx-1">×</span>
                {match.away_score !== null ? match.away_score : '-'}
              </div>
            </div>
            
            <div className="flex flex-col items-center w-2/5">
              <div className="w-12 h-12 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center mb-2">
                <img 
                  src={match.away_team_logo || '/placeholder.svg'} 
                  alt={match.away_team_name} 
                  className="w-10 h-10 object-contain" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
              <span className="text-sm font-medium text-center line-clamp-1">{match.away_team_name}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="line-clamp-1">{match.location}</span>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-xs">
              {match.category}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MatchCard;
