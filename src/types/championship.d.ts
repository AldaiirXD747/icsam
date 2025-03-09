
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

export type MatchStatus = 'scheduled' | 'live' | 'finished';
