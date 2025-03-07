
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

// Types for matches
export type MatchStatus = 'scheduled' | 'in_progress' | 'completed' | 'postponed' | 'canceled';

export interface Match {
  id: string;
  date: string;
  time: string;
  location: string;
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  status: MatchStatus;
  category: string;
  round: string | null;
  championship_id: string | null;
  created_at?: string;
  home_team_name?: string;
  away_team_name?: string;
}

// Types for statistics
export interface TopScorer {
  id: string;
  player_id: string;
  team_id: string;
  goals: number;
  category: string;
  championship_id: string | null;
  created_at?: string;
}

export interface YellowCardLeader {
  id: string;
  player_id: string;
  team_id: string;
  yellow_cards: number;
  category: string;
  championship_id: string | null;
  created_at?: string;
}
