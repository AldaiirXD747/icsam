
import { ChampionshipMatch } from '@/types/championship';
import { supabase } from '@/integrations/supabase/client';

export const getAllMatches = async (): Promise<ChampionshipMatch[]> => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        id, 
        date, 
        time, 
        home_team, 
        away_team, 
        home_score, 
        away_score, 
        location, 
        category, 
        status, 
        round, 
        championship_id,
        home_team_name:home_team(name),
        away_team_name:away_team(name),
        home_team_logo:home_team(logo),
        away_team_logo:away_team(logo)
      `)
      .order('date', { ascending: false });

    if (error) {
      console.error("Error fetching matches:", error);
      throw error;
    }

    // Transform the data to match our ChampionshipMatch interface
    const matches: ChampionshipMatch[] = data.map(match => {
      return {
        id: match.id,
        date: match.date,
        time: match.time,
        home_team: match.home_team,
        away_team: match.away_team,
        home_score: match.home_score,
        away_score: match.away_score,
        category: match.category,
        status: match.status,
        location: match.location,
        round: match.round,
        championship_id: match.championship_id,
        home_team_name: match.home_team_name?.name || '',
        away_team_name: match.away_team_name?.name || '',
        home_team_logo: match.home_team_logo?.logo || '',
        away_team_logo: match.away_team_logo?.logo || '',
        homeTeam: match.home_team,
        awayTeam: match.away_team,
        homeScore: match.home_score,
        awayScore: match.away_score,
        championshipId: match.championship_id,
        homeTeamName: match.home_team_name?.name || '',
        awayTeamName: match.away_team_name?.name || '',
        homeTeamLogo: match.home_team_logo?.logo || '',
        awayTeamLogo: match.away_team_logo?.logo || ''
      };
    });

    return matches;
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw error;
  }
};

export const getMatchById = async (id: string): Promise<ChampionshipMatch | null> => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        id, 
        date, 
        time, 
        home_team, 
        away_team, 
        home_score, 
        away_score, 
        location, 
        category, 
        status, 
        round, 
        championship_id,
        home_team_name:home_team(name),
        away_team_name:away_team(name),
        home_team_logo:home_team(logo),
        away_team_logo:away_team(logo)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error("Error fetching match:", error);
      throw error;
    }

    if (!data) return null;

    // Transform to match our interface
    return {
      id: data.id,
      date: data.date,
      time: data.time,
      home_team: data.home_team,
      away_team: data.away_team,
      home_score: data.home_score,
      away_score: data.away_score,
      category: data.category,
      status: data.status,
      location: data.location,
      round: data.round,
      championship_id: data.championship_id,
      home_team_name: data.home_team_name?.name || '',
      away_team_name: data.away_team_name?.name || '',
      home_team_logo: data.home_team_logo?.logo || '',
      away_team_logo: data.away_team_logo?.logo || '',
      homeTeam: data.home_team,
      awayTeam: data.away_team,
      homeScore: data.home_score,
      awayScore: data.away_score,
      championshipId: data.championship_id,
      homeTeamName: data.home_team_name?.name || '',
      awayTeamName: data.away_team_name?.name || '',
      homeTeamLogo: data.home_team_logo?.logo || '',
      awayTeamLogo: data.away_team_logo?.logo || ''
    };
  } catch (error) {
    console.error("Error fetching match:", error);
    throw error;
  }
};
