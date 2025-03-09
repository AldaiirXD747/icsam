
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
  
  // Allow both snake_case and camelCase for compatibility
  homeScore?: number | null;
  awayScore?: number | null;
  championshipId?: string | null;
  created_at?: string;
  createdAt?: string;
}

export interface Player {
  id: string;
  name: string;
  number?: number;
  position: string;
  team_id?: string;
  teamId?: string;
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
  groupName?: string;
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
  team_id?: string;
  name?: string;
  teams?: any[]; // For compatibility with UserManagement component
}

export interface Championship {
  id: string;
  name: string;
  year: string;
  description?: string;
  banner_image?: string;
  bannerImage?: string;
  start_date: string;
  startDate?: string;
  end_date: string;
  endDate?: string;
  location: string;
  categories: string[];
  organizer?: string;
  sponsors: string[];
  status: 'upcoming' | 'ongoing' | 'finished';
}

// Add types that are used in admin components
export type MatchStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'postponed' | 'live';

export interface AdminMatch extends Match {
  homeTeamName?: string;
  home_team_name?: string;
  awayTeamName?: string;
  away_team_name?: string;
  homeTeamLogo?: string;
  home_team_logo?: string;
  awayTeamLogo?: string;
  away_team_logo?: string;
  championship?: Championship;
}

export interface TopScorer {
  id: string;
  player_id: string;
  playerId?: string;
  team_id: string;
  teamId?: string;
  goals: number;
  category: string;
  championship_id?: string;
  championshipId?: string;
  player_name?: string;
  playerName?: string;
  team_name?: string;
  teamName?: string;
  team_logo?: string;
  teamLogo?: string;
  name?: string;
  team?: any;
}

export interface YellowCardLeader {
  id: string;
  player_id: string;
  playerId?: string;
  team_id: string;
  teamId?: string;
  yellow_cards: number;
  yellowCards?: number;
  category: string;
  championship_id?: string;
  championshipId?: string;
  player_name?: string;
  playerName?: string;
  team_name?: string;
  teamName?: string;
  team_logo?: string;
  teamLogo?: string;
  name?: string;
  team?: any;
}

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  imageUrl?: string;
  championship_id?: string;
  championshipId?: string;
  featured?: boolean;
  created_at?: string;
  createdAt?: string;
}

export interface TransparencyDocument {
  id: string;
  title: string;
  description?: string;
  category: string;
  file_url: string;
  fileUrl?: string;
  icon_type: string;
  iconType?: string;
  published_date: string;
  publishedDate?: string;
  created_at?: string;
  createdAt?: string;
}
