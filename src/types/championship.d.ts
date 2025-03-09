
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

export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';

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

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export type UserRole = 'admin' | 'team' | 'user';

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  role?: UserRole;
}

export interface UserTeamAssociation {
  id: string;
  user_id: string;
  team_id: string;
  created_at: string;
}
