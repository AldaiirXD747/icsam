// Types for gallery
export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  championshipId: string;
  createdAt: string | Date;
  featured?: boolean;
}

// Types for teams
export interface Team {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  logo?: string;
  category: string;
  group_name: string;
  active: boolean;
  websiteUrl?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  foundationDate?: string;
}

// Types for users
export interface User {
  id: string;
  email: string;
  teamId?: string;
  name?: string;
}

// Types for championships
export interface Championship {
  id: string;
  name: string;
  year: string;
  description: string;
  banner_image: string;
  start_date: string;
  end_date: string;
  location: string;
  categories: string[];
  organizer: string;
  sponsors: any[];
  status: 'upcoming' | 'ongoing' | 'finished';
}

// Types for players
export type Player = {
  id: string;
  name: string;
  number: number | null;
  position: string;
  photo: string | null;
  team_id: string;
  category?: string | null;
};

// Types for matches
export type MatchStatus = 'scheduled' | 'in_progress' | 'completed' | 'postponed' | 'canceled';

export interface AdminMatch {
  id: string;
  date: string;
  time: string;
  location: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  category: string;
  round: string | null;
  championshipId: string | null;
  homeTeamName?: string;
  awayTeamName?: string;
}

export interface Match {
  id: string;
  date: string;
  time: string;
  location: string;
  // Snake case properties (from database)
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  championship_id: string | null;
  // Camel case properties (used in components)
  homeTeam?: string;
  awayTeam?: string;
  homeScore?: number | null;
  awayScore?: number | null;
  championshipId?: string | null;
  status: MatchStatus;
  category: string;
  round: string | null;
  created_at?: string;
  // Team names
  home_team_name?: string;
  away_team_name?: string;
  homeTeamName?: string;
  awayTeamName?: string;
}

// Types for statistics
export type TopScorer = {
  id: string;
  player_id?: string;
  playerId?: string;
  team_id?: string;
  teamId?: string;
  name?: string;
  team?: string;
  goals: number;
  category: string;
  championship_id?: string | null;
  championshipId?: string | null;
};

export type YellowCardLeader = {
  id: string;
  player_id?: string;
  playerId?: string;
  team_id?: string;
  teamId?: string;
  name?: string;
  team?: string;
  yellow_cards?: number;
  yellowCards?: number;
  category: string;
  championship_id?: string | null;
  championshipId?: string | null;
};

export type RedCardLeader = {
  id: string;
  player_id?: string;
  playerId?: string;
  team_id?: string;
  teamId?: string;
  name?: string;
  team?: string;
  red_cards: number;
  category: string;
  championship_id?: string | null;
  championshipId?: string | null;
};

export type MatchStatistic = {
  id: string;
  match_id: string;
  player_id: string;
  team_id: string;
  statistic_type: 'goal' | 'yellow_card' | 'red_card';
  quantity: number;
  minute?: number;
  half?: 'first' | 'second' | 'extra_time' | 'penalties';
  created_at?: string;
};
