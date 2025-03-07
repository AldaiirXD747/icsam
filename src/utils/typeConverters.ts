
import { Team, User, Match, TopScorer, YellowCardLeader, AdminMatch } from "@/types";
import { Database } from "@/integrations/supabase/types";

/**
 * Converts a database team record to the Team interface used in the application
 */
export const convertDbTeamToTeam = (
  dbTeam: Database["public"]["Tables"]["teams"]["Row"]
): Team => {
  return {
    id: dbTeam.id,
    name: dbTeam.name,
    description: undefined,
    logoUrl: dbTeam.logo || undefined,
    logo: dbTeam.logo || undefined,
    category: dbTeam.category,
    group_name: dbTeam.group_name,
    active: true,
    // These fields might be added to the database in the future
    websiteUrl: undefined,
    email: undefined,
    phone: undefined,
    address: undefined,
    city: undefined,
    state: undefined,
    country: undefined,
    foundationDate: undefined
  };
};

/**
 * Converts a database match record to the Match interface used in the application
 */
export const convertDbMatchToMatch = (
  dbMatch: Database["public"]["Tables"]["matches"]["Row"]
): Match => {
  return {
    id: dbMatch.id,
    date: dbMatch.date,
    time: dbMatch.time,
    location: dbMatch.location,
    home_team: dbMatch.home_team || "",
    away_team: dbMatch.away_team || "",
    home_score: dbMatch.home_score,
    away_score: dbMatch.away_score,
    status: dbMatch.status as Match["status"],
    category: dbMatch.category,
    round: dbMatch.round,
    championship_id: dbMatch.championship_id,
    // Add camelCase variants for component use
    homeTeam: dbMatch.home_team || "",
    awayTeam: dbMatch.away_team || "",
    homeScore: dbMatch.home_score,
    awayScore: dbMatch.away_score,
    championshipId: dbMatch.championship_id,
  };
};

/**
 * Converts a database match record to the AdminMatch interface used in the admin components
 */
export const convertDbMatchToAdminMatch = (
  dbMatch: any,
  homeTeamName?: string,
  awayTeamName?: string
): AdminMatch => {
  return {
    id: dbMatch.id,
    date: dbMatch.date,
    time: dbMatch.time,
    location: dbMatch.location,
    homeTeam: dbMatch.home_team || "",
    awayTeam: dbMatch.away_team || "",
    homeScore: dbMatch.home_score,
    awayScore: dbMatch.away_score,
    status: dbMatch.status as Match["status"],
    category: dbMatch.category,
    round: dbMatch.round || null,
    championshipId: dbMatch.championship_id,
    homeTeamName: homeTeamName || "",
    awayTeamName: awayTeamName || ""
  };
};

/**
 * Converts a Match or AdminMatch object to a format ready for database insertion/update
 */
export const convertMatchToDbMatch = (match: Match | AdminMatch) => {
  // If it's an AdminMatch, convert it to the expected DB format
  if ('homeTeam' in match && !('home_team' in match)) {
    return {
      date: match.date,
      time: match.time,
      location: match.location,
      home_team: match.homeTeam,
      away_team: match.awayTeam,
      home_score: match.homeScore,
      away_score: match.awayScore,
      status: match.status,
      category: match.category,
      round: match.round,
      championship_id: match.championshipId,
    };
  }
  
  // If it's a Match, use both camelCase and snake_case properties
  return {
    date: match.date,
    time: match.time,
    location: match.location,
    home_team: match.home_team || match.homeTeam || "",
    away_team: match.away_team || match.awayTeam || "",
    home_score: match.home_score || match.homeScore,
    away_score: match.away_score || match.awayScore,
    status: match.status,
    category: match.category,
    round: match.round,
    championship_id: match.championship_id || match.championshipId,
  };
};

/**
 * Converts a TopScorer object to ensure both snake_case and camelCase properties are set
 */
export const normalizeTopScorer = (scorer: Partial<TopScorer>): TopScorer => {
  return {
    id: scorer.id || "",
    player_id: scorer.player_id || scorer.playerId || "",
    team_id: scorer.team_id || scorer.teamId || "",
    championship_id: scorer.championship_id || scorer.championshipId || null,
    goals: scorer.goals || 0,
    category: scorer.category || "",
    // Add camelCase variants
    playerId: scorer.player_id || scorer.playerId || "",
    teamId: scorer.team_id || scorer.teamId || "",
    championshipId: scorer.championship_id || scorer.championshipId || null,
    // Keep additional UI properties
    name: scorer.name,
    team: scorer.team,
  };
};

/**
 * Converts a YellowCardLeader object to ensure both snake_case and camelCase properties are set
 */
export const normalizeYellowCardLeader = (leader: Partial<YellowCardLeader>): YellowCardLeader => {
  return {
    id: leader.id || "",
    player_id: leader.player_id || leader.playerId || "",
    team_id: leader.team_id || leader.teamId || "",
    yellow_cards: leader.yellow_cards || leader.yellowCards || 0,
    championship_id: leader.championship_id || leader.championshipId || null,
    category: leader.category || "",
    // Add camelCase variants
    playerId: leader.player_id || leader.playerId || "",
    teamId: leader.team_id || leader.teamId || "",
    yellowCards: leader.yellow_cards || leader.yellowCards || 0,
    championshipId: leader.championship_id || leader.championshipId || null,
    // Keep additional UI properties
    name: leader.name,
    team: leader.team,
  };
};

/**
 * Type-safe utility for handling null values
 */
export const nonNull = <T>(value: T | null | undefined, defaultValue: T): T => {
  return value !== null && value !== undefined ? value : defaultValue;
};
