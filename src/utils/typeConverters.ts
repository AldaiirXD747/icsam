
import { AdminMatch, Match, TopScorer, YellowCardLeader } from '@/types';

// Function to convert a Match object to an AdminMatch
export const convertToAdminMatch = (match: any): AdminMatch => {
  // Return a complete AdminMatch with both snake_case and camelCase versions
  return {
    id: match.id,
    date: match.date,
    time: match.time,
    home_team: match.home_team,
    away_team: match.away_team,
    home_score: match.home_score || match.homeScore || null,
    away_score: match.away_score || match.awayScore || null,
    category: match.category,
    status: match.status,
    location: match.location,
    round: match.round,
    championship_id: match.championship_id || match.championshipId || null,
    
    // For frontend compatibility
    homeTeam: match.homeTeam || match.home_team,
    awayTeam: match.awayTeam || match.away_team,
    homeScore: match.homeScore || match.home_score,
    awayScore: match.awayScore || match.away_score,
    championshipId: match.championshipId || match.championship_id,
    
    // Add team name and logo properties
    home_team_name: match.home_team_name || match.homeTeamName || null,
    away_team_name: match.away_team_name || match.awayTeamName || null,
    home_team_logo: match.home_team_logo || match.homeTeamLogo || null,
    away_team_logo: match.away_team_logo || match.awayTeamLogo || null,
    
    homeTeamName: match.homeTeamName || match.home_team_name || null,
    awayTeamName: match.awayTeamName || match.away_team_name || null,
    homeTeamLogo: match.homeTeamLogo || match.home_team_logo || null,
    awayTeamLogo: match.awayTeamLogo || match.away_team_logo || null,
  };
};

// Function to convert a TopScorer object
export const convertToTopScorer = (scorer: any): TopScorer => {
  return {
    id: scorer.id,
    player_id: scorer.player_id || scorer.playerId,
    playerId: scorer.playerId || scorer.player_id,
    team_id: scorer.team_id || scorer.teamId,
    teamId: scorer.teamId || scorer.team_id,
    goals: scorer.goals,
    category: scorer.category,
    championship_id: scorer.championship_id || scorer.championshipId,
    championshipId: scorer.championshipId || scorer.championship_id,
    player_name: scorer.player_name || scorer.playerName || scorer.name,
    playerName: scorer.playerName || scorer.player_name || scorer.name,
    team_name: scorer.team_name || scorer.teamName,
    teamName: scorer.teamName || scorer.team_name,
    team_logo: scorer.team_logo || scorer.teamLogo,
    teamLogo: scorer.teamLogo || scorer.team_logo,
    name: scorer.name || scorer.player_name || scorer.playerName,
    team: scorer.team
  };
};

// Function to convert a YellowCardLeader object
export const convertToYellowCardLeader = (leader: any): YellowCardLeader => {
  return {
    id: leader.id,
    player_id: leader.player_id || leader.playerId,
    playerId: leader.playerId || leader.player_id,
    team_id: leader.team_id || leader.teamId,
    teamId: leader.teamId || leader.team_id,
    yellow_cards: leader.yellow_cards || leader.yellowCards || 0,
    yellowCards: leader.yellowCards || leader.yellow_cards || 0,
    category: leader.category,
    championship_id: leader.championship_id || leader.championshipId,
    championshipId: leader.championshipId || leader.championship_id,
    player_name: leader.player_name || leader.playerName || leader.name,
    playerName: leader.playerName || leader.player_name || leader.name,
    team_name: leader.team_name || leader.teamName,
    teamName: leader.teamName || leader.team_name,
    team_logo: leader.team_logo || leader.teamLogo,
    teamLogo: leader.teamLogo || leader.team_logo,
    name: leader.name || leader.player_name || leader.playerName,
    team: leader.team
  };
};
