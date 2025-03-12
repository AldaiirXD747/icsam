
export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'postponed' | 'cancelled' | 'finalizado' | 'encerrado' | 'in_progress' | 'finished' | 'canceled';

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

export interface ChampionshipStanding {
  id?: string;
  team_id: string;
  team_name: string;
  team_logo?: string | null;
  position: number;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  category?: string;
  group_name?: string;
}

export interface Team {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  category?: string;
  group_name?: string;
  active?: boolean;
}

export interface ChampionshipTeam extends Team {
  players?: any[];
  stats?: {
    position: number;
    points: number;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goals_for: number;
    goals_against: number;
    goal_difference: number;
  };
}

export interface MatchWithPlayers extends ChampionshipMatch {
  homePlayers?: any[];
  awayPlayers?: any[];
}

// User types
export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teams?: UserTeamAssociation[];
  created_at?: string;
}

export type UserRole = 'admin' | 'team_manager';

export interface UserTeamAssociation {
  id: string;
  user_id: string;
  team_id: string;
  team_name?: string;
  team_category?: string;
  team_logo?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  teams?: string[];
}

export interface UpdateUserPayload {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  teams?: string[];
}

