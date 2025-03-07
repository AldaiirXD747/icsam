import { AdminMatch } from '@/types';

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
