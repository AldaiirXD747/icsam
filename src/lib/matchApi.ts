
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
        home_team_info:teams!home_team(id, name, logo),
        away_team_info:teams!away_team(id, name, logo)
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
        home_team: match.home_team || '',
        away_team: match.away_team || '',
        home_score: match.home_score,
        away_score: match.away_score,
        category: match.category,
        status: match.status as any, // Convert to MatchStatus
        location: match.location,
        round: match.round,
        championship_id: match.championship_id,
        home_team_name: match.home_team_info?.name || '',
        away_team_name: match.away_team_info?.name || '',
        home_team_logo: match.home_team_info?.logo || '',
        away_team_logo: match.away_team_info?.logo || '',
        homeTeam: match.home_team_info,
        awayTeam: match.away_team_info,
        homeScore: match.home_score,
        awayScore: match.away_score,
        championshipId: match.championship_id,
        homeTeamName: match.home_team_info?.name || '',
        awayTeamName: match.away_team_info?.name || '',
        homeTeamLogo: match.home_team_info?.logo || '',
        awayTeamLogo: match.away_team_info?.logo || ''
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
        home_team_info:teams!home_team(id, name, logo),
        away_team_info:teams!away_team(id, name, logo)
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
      home_team: data.home_team || '',
      away_team: data.away_team || '',
      home_score: data.home_score,
      away_score: data.away_score,
      category: data.category,
      status: data.status as any, // Convert to MatchStatus
      location: data.location,
      round: data.round,
      championship_id: data.championship_id,
      home_team_name: data.home_team_info?.name || '',
      away_team_name: data.away_team_info?.name || '',
      home_team_logo: data.home_team_info?.logo || '',
      away_team_logo: data.away_team_info?.logo || '',
      homeTeam: data.home_team_info,
      awayTeam: data.away_team_info,
      homeScore: data.home_score,
      awayScore: data.away_score,
      championshipId: data.championship_id,
      homeTeamName: data.home_team_info?.name || '',
      awayTeamName: data.away_team_info?.name || '',
      homeTeamLogo: data.home_team_info?.logo || '',
      awayTeamLogo: data.away_team_info?.logo || ''
    };
  } catch (error) {
    console.error("Error fetching match:", error);
    throw error;
  }
};

export const updateMatch = async (id: string, matchData: Partial<ChampionshipMatch>): Promise<boolean> => {
  try {
    // Convert form values to match the database schema
    const matchToUpdate = {
      ...(matchData.date ? { date: matchData.date } : {}),
      ...(matchData.time ? { time: matchData.time } : {}),
      ...(matchData.home_team ? { home_team: matchData.home_team } : {}),
      ...(matchData.away_team ? { away_team: matchData.away_team } : {}),
      ...(matchData.home_score !== undefined ? { home_score: matchData.home_score } : {}),
      ...(matchData.away_score !== undefined ? { away_score: matchData.away_score } : {}),
      ...(matchData.category ? { category: matchData.category } : {}),
      ...(matchData.status ? { status: matchData.status } : {}),
      ...(matchData.location ? { location: matchData.location } : {}),
      ...(matchData.round ? { round: matchData.round } : {}),
      ...(matchData.championship_id ? { championship_id: matchData.championship_id } : {})
    };

    const { error } = await supabase
      .from('matches')
      .update(matchToUpdate)
      .eq('id', id);

    if (error) {
      console.error('Error updating match:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating match:', error);
    return false;
  }
};

export const deleteMatch = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting match:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting match:', error);
    return false;
  }
};

export const deleteAllMatchData = async (): Promise<boolean> => {
  try {
    console.log("Starting deletion of all match data...");
    
    // Delete match statistics first (foreign key constraint)
    const { error: statsError } = await supabase
      .from('match_statistics')
      .delete()
      .neq('id', '');

    if (statsError) {
      console.error('Error deleting match statistics:', statsError);
      throw statsError;
    }
    
    // Delete all goals
    const { error: goalsError } = await supabase
      .from('goals')
      .delete()
      .neq('id', '');
      
    if (goalsError) {
      console.error('Error deleting goals:', goalsError);
      throw goalsError;
    }
    
    // Delete all match events
    const { error: eventsError } = await supabase
      .from('match_events')
      .delete()
      .neq('id', '');
      
    if (eventsError) {
      console.error('Error deleting match events:', eventsError);
      throw eventsError;
    }
    
    // Reset top scorers
    const { error: scorersError } = await supabase
      .from('top_scorers')
      .delete()
      .neq('id', '');
      
    if (scorersError) {
      console.error('Error deleting top scorers:', scorersError);
      throw scorersError;
    }
    
    // Reset yellow cards
    const { error: cardsError } = await supabase
      .from('yellow_card_leaders')
      .delete()
      .neq('id', '');
      
    if (cardsError) {
      console.error('Error deleting yellow card leaders:', cardsError);
      throw cardsError;
    }
    
    // Reset standings
    const { error: standingsError } = await supabase
      .from('standings')
      .delete()
      .neq('id', '');
      
    if (standingsError) {
      console.error('Error deleting standings:', standingsError);
      throw standingsError;
    }
    
    // Delete all matches
    const { error: matchError } = await supabase
      .from('matches')
      .delete()
      .neq('id', '');

    if (matchError) {
      console.error('Error deleting matches:', matchError);
      throw matchError;
    }

    console.log("All match data successfully deleted!");
    return true;
  } catch (error) {
    console.error('Error deleting match data:', error);
    return false;
  }
};

export const resetMatchResults = async (): Promise<boolean> => {
  try {
    // Reset match scores and status
    const { error } = await supabase
      .from('matches')
      .update({
        home_score: null,
        away_score: null,
        status: 'scheduled'
      })
      .neq('id', '');

    if (error) {
      console.error('Error resetting match results:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error resetting match results:', error);
    return false;
  }
};
