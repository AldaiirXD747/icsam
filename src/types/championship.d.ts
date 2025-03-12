
export interface ChampionshipStanding {
  position: number;
  team_id: string;
  team_name: string;
  team_logo?: string | null;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
}

export type MatchStatus = 
  | 'scheduled' 
  | 'live' 
  | 'in_progress' 
  | 'finished' 
  | 'completed' 
  | 'cancelled' 
  | 'canceled' 
  | 'postponed' 
  | 'finalizado' 
  | 'encerrado';

// Additional types needed for admin components
export interface ChampionshipMatch {
  id: string;
  date: string;
  time: string;
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  category: string;
  status: MatchStatus;
  location: string;
  round: string | null;
  championship_id?: string | null;
  
  // Adding additional properties for the UI
  home_team_name?: string;
  away_team_name?: string;
  home_team_logo?: string;
  away_team_logo?: string;
  
  // Camel case alternatives for frontend compatibility
  homeTeam?: Team | string;
  awayTeam?: Team | string;
  homeScore?: number | null;
  awayScore?: number | null;
  championshipId?: string | null;
  homeTeamName?: string;
  awayTeamName?: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
}

export interface Team {
  id: string;
  name: string;
  logo?: string;
}

export interface ChampionshipTeam {
  id: string;
  name: string;
  logo?: string;
  category: string;
  group_name: string;
}

export interface ChampionshipFull {
  id: string;
  name: string;
  description?: string;
  year: string;
  start_date: string;
  end_date: string;
  location: string;
  categories: string[];
  status: 'upcoming' | 'ongoing' | 'finished';
  banner_image?: string;
  organizer?: string;
  sponsors: string[];
}

export interface MatchWithPlayers {
  match_id: string;
  match_date: string;
  match_time: string;
  match_location: string;
  match_category: string;
  match_status: string;
  match_round: string;
  home_team_id: string;
  home_team_name: string;
  away_team_id: string;
  away_team_name: string;
  home_players: any[];
  away_players: any[];
}

export type UserRole = 'admin' | 'team_manager';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  teams?: any[]; // For compatibility with UserManagement component
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  teams?: any[]; // For compatibility with UserManagement component
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: UserRole;
  id?: string; // For compatibility with UserManagement component
  password?: string; // For compatibility with UserManagement component
  teams?: any[]; // For compatibility with UserManagement component
}

export interface UserTeamAssociation {
  id: string;
  user_id: string;
  team_id: string;
  created_at: string;
}

export interface FileWithPreview extends File {
  preview: string;
  name: string;
}
