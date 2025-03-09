
// Add or update this interface in your types file
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
}

export interface User {
  id: string;
  email: string;
  teamId?: string;
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
