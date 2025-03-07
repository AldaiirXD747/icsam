
import { Json } from "@/integrations/supabase/types";

export interface ChampionshipFull {
  id: string;
  name: string;
  year: string;
  description: string | null;
  banner_image: string | null;
  start_date: string;
  end_date: string;
  location: string;
  categories: string[];
  organizer: string | null;
  sponsors: {
    name: string;
    logo?: string;
  }[];
  status: 'upcoming' | 'ongoing' | 'finished';
}

export interface ChampionshipTeam {
  id: string;
  name: string;
  logo: string | null;
  category: string;
  group_name: string;
}

export interface ChampionshipMatch {
  id: string;
  date: string;
  time: string;
  location: string;
  category: string;
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  status: string;
  round: string | null;
  home_team_name?: string;
  away_team_name?: string;
  home_team_logo?: string | null;
  away_team_logo?: string | null;
}

export interface ChampionshipStanding {
  position: number;
  team_id: string;
  team_name: string;
  team_logo: string | null;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
}

// New interface for the RPC function result
export interface MatchWithPlayers {
  match_id: string;
  match_date: string;
  match_time: string;
  match_location: string;
  match_category: string;
  match_status: string;
  match_round: string | null;
  home_team_id: string;
  home_team_name: string;
  away_team_id: string;
  away_team_name: string;
  home_players: Json;
  away_players: Json;
}

// User roles
export type UserRole = 'admin' | 'team_manager';

// User management interfaces
export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  team_id?: string | null;
  team_name?: string | null;
  created_at?: string;
}
