
import { AdminMatch, Match, TopScorer, YellowCardLeader } from '@/types';

/**
 * Convert an AdminMatch object to a database match object
 */
export const convertMatchToDbMatch = (match: AdminMatch) => {
  return {
    id: match.id || undefined, // Don't include for new records
    home_team: match.homeTeam,
    away_team: match.awayTeam,
    home_score: match.homeScore,
    away_score: match.awayScore,
    date: match.date,
    time: match.time,
    location: match.location,
    status: match.status,
    category: match.category,
    round: match.round,
    championship_id: match.championshipId,
  };
};

/**
 * Convert a database match object to an AdminMatch object
 */
export const convertDbMatchToAdminMatch = (
  dbMatch: any, 
  homeTeamName: string, 
  awayTeamName: string
): AdminMatch => {
  return {
    id: dbMatch.id,
    homeTeam: dbMatch.home_team,
    awayTeam: dbMatch.away_team,
    homeScore: dbMatch.home_score,
    awayScore: dbMatch.away_score,
    date: dbMatch.date,
    time: dbMatch.time,
    location: dbMatch.location,
    status: dbMatch.status,
    category: dbMatch.category,
    round: dbMatch.round || null,
    championshipId: dbMatch.championship_id || null,
    homeTeamName: homeTeamName,
    awayTeamName: awayTeamName,
  };
};

/**
 * Convert a database match object to a Match object
 */
export const convertDbMatchToMatch = (dbMatch: any): Match => {
  return {
    id: dbMatch.id,
    home_team: dbMatch.home_team,
    away_team: dbMatch.away_team,
    home_score: dbMatch.home_score,
    away_score: dbMatch.away_score,
    date: dbMatch.date,
    time: dbMatch.time,
    location: dbMatch.location,
    status: dbMatch.status,
    category: dbMatch.category,
    round: dbMatch.round || null,
    championship_id: dbMatch.championship_id || null,
  };
};

/**
 * Normalize a top scorer object
 */
export const normalizeTopScorer = (scorer: any): TopScorer => {
  return {
    id: scorer.id,
    playerId: scorer.playerId || scorer.player_id,
    teamId: scorer.teamId || scorer.team_id,
    name: scorer.name,
    team: scorer.team,
    goals: scorer.goals,
    category: scorer.category,
    championshipId: scorer.championshipId || scorer.championship_id,
  };
};

/**
 * Normalize a yellow card leader object
 */
export const normalizeYellowCardLeader = (leader: any): YellowCardLeader => {
  return {
    id: leader.id,
    playerId: leader.playerId || leader.player_id,
    teamId: leader.teamId || leader.team_id,
    name: leader.name,
    team: leader.team,
    yellowCards: leader.yellowCards || leader.yellow_cards,
    category: leader.category,
    championshipId: leader.championshipId || leader.championship_id,
  };
};
