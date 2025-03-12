
export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'postponed' | 'cancelled' | 'finalizado' | 'encerrado';

export interface ChampionshipMatch {
  id: string;
  date: string;
  time: string;
  home_team: string;
  away_team: string;
  home_score?: number | null;
  away_score?: number | null;
  location: string;
  category: string;
  status: MatchStatus;
  round?: string;
  championship_id: string;
  
  // Additional fields for UI display
  home_team_name?: string;
  away_team_name?: string;
  home_team_logo?: string;
  away_team_logo?: string;
  
  // Alternative field names for compatibility
  homeTeam?: any;
  awayTeam?: any;
  homeScore?: number | null;
  awayScore?: number | null;
  championshipId?: string;
  homeTeamName?: string;
  awayTeamName?: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
}
