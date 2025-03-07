
export interface Team {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  foundationDate?: string | Date;
  active: boolean;
  category?: string;
  group_name?: string;
  logo?: string;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  teamId?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  championshipId: string;
  createdAt: string | Date;
  featured?: boolean;
}

// Unified match status type for consistency across the application
export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'postponed' | 'canceled' | 'in_progress' | 'completed';

export interface Match {
  id: string;
  date: string;
  time: string;
  location: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number | null;
  awayScore?: number | null;
  status: MatchStatus;
  category: string;
  round?: string | null;
  championshipId?: string | null;
  homeTeamName?: string;
  awayTeamName?: string;
}

export interface TopScorer {
  id: string;
  playerId: string;
  name: string;
  team: string;
  teamId: string;
  goals: number;
  category: string;
  championshipId?: string;
}

export interface YellowCardLeader {
  id: string;
  playerId: string;
  name: string;
  team: string;
  teamId: string;
  yellowCards: number;
  category: string;
  championshipId?: string;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  number?: number | null;
  photo?: string | null;
  team_id: string;
  team_name?: string;
  team_logo?: string;
  team_category?: string;
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
  categories: string[] | null;
  organizer?: string;
  sponsors?: any[];
  status: 'upcoming' | 'ongoing' | 'finished';
}
