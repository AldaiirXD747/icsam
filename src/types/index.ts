
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

export interface Match {
  id: string;
  date: string;
  time: string;
  location: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number | null;
  awayScore?: number | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'postponed' | 'canceled';
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
