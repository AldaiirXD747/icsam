
export interface Match {
  id: string;
  date: string;
  time: string;
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  category: string;
  status: string;
  location: string;
  round: string | null;
  championship_id?: string | null;
  
  // Additional properties for display
  home_team_name?: string;
  away_team_name?: string;
  
  // Team objects with more details (used in the UI)
  homeTeam?: {
    name: string;
    logo: string;
  };
  awayTeam?: {
    name: string;
    logo: string;
  };
}

export interface Player {
  id: string;
  name: string;
  number?: number;
  position: string;
  team_id?: string;
  photo?: string;
  category?: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  logo?: string;
  category?: string;
  group_name?: string;
  active?: boolean;
  
  // Adding properties to solve errors in TeamDetailView and TeamManagement
  email?: string;
  phone?: string;
  websiteUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  foundationDate?: string;
}

export interface User {
  id: string;
  email: string;
  teamId?: string;
  name?: string;
}

export interface Championship {
  id: string;
  name: string;
  year: string;
  description?: string;
  banner_image?: string;
  start_date: string;
  end_date: string;
  location: string;
  categories: string[];
  organizer?: string;
  sponsors: string[];
  status: 'upcoming' | 'ongoing' | 'finished';
}

// Add types that are used in admin components
export type MatchStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';

export interface AdminMatch extends Match {
  homeTeamName?: string;
  awayTeamName?: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  championship?: Championship;
}

export interface TopScorer {
  id: string;
  player_id: string;
  team_id: string;
  goals: number;
  category: string;
  championship_id?: string;
  player_name?: string;
  team_name?: string;
  team_logo?: string;
}

export interface YellowCardLeader {
  id: string;
  player_id: string;
  team_id: string;
  yellow_cards: number;
  category: string;
  championship_id?: string;
  player_name?: string;
  team_name?: string;
  team_logo?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  championship_id?: string;
  featured?: boolean;
  created_at?: string;
}

export interface TransparencyDocument {
  id: string;
  title: string;
  description?: string;
  category: string;
  file_url: string;
  icon_type: string;
  published_date: string;
  created_at?: string;
}
