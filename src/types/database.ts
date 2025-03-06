

export type ChampionshipType = {
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
  sponsors: { name: string; logo: string }[];
  status: 'upcoming' | 'ongoing' | 'finished';
  created_at?: string;
};

export type TeamAccountType = {
  id: string;
  team_id: string;
  user_id: string;
  email: string;
  created_at?: string;
};

export type MatchStatus = 'scheduled' | 'in_progress' | 'completed' | 'postponed' | 'canceled';

export type Match = {
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
};

export type TopScorerType = {
  id: string;
  player_id: string;
  team_id: string;
  goals: number;
  category: string;
  championship_id: string | null;
  created_at?: string;
};

export type YellowCardLeaderType = {
  id: string;
  player_id: string;
  team_id: string;
  yellow_cards: number;
  category: string;
  championship_id: string | null;
  created_at?: string;
};
