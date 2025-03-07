
import { supabase } from '../integrations/supabase/client';
import type { ChampionshipFull, ChampionshipTeam, ChampionshipMatch, ChampionshipStanding } from '@/types/championship';

// Get championship by ID
export const getChampionshipById = async (id: string): Promise<ChampionshipFull | null> => {
  try {
    const { data, error } = await supabase
      .from('championships')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    // Parse categories if it's a string, otherwise use as is or default to empty array
    let parsedCategories;
    try {
      parsedCategories = typeof data.categories === 'string' 
        ? JSON.parse(data.categories) 
        : data.categories || [];
    } catch (e) {
      parsedCategories = [];
    }
    
    // Parse sponsors if it's a string, otherwise use as is or default to empty array
    let parsedSponsors;
    try {
      parsedSponsors = typeof data.sponsors === 'string' 
        ? JSON.parse(data.sponsors) 
        : data.sponsors || [];
    } catch (e) {
      parsedSponsors = [];
    }
    
    // Ensure status is one of the expected values
    const validStatus = ['upcoming', 'ongoing', 'finished'];
    const status = validStatus.includes(data.status) 
      ? data.status as 'upcoming' | 'ongoing' | 'finished'
      : 'upcoming';
      
    return {
      id: data.id,
      name: data.name,
      year: data.year,
      description: data.description,
      banner_image: data.banner_image,
      start_date: data.start_date,
      end_date: data.end_date,
      location: data.location,
      categories: parsedCategories,
      organizer: data.organizer,
      sponsors: parsedSponsors,
      status: status
    };
  } catch (error) {
    console.error('Error fetching championship:', error);
    return null;
  }
};

// Get teams participating in a championship
export const getChampionshipTeams = async (championshipId: string, category?: string): Promise<ChampionshipTeam[]> => {
  try {
    // For now, we'll return all teams since there's no direct link between championships and teams
    // In a real implementation, this would be filtered by championships_teams join table
    let query = supabase
      .from('teams')
      .select('*')
      .order('name');
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []).map(team => ({
      id: team.id,
      name: team.name,
      logo: team.logo,
      category: team.category,
      group_name: team.group_name
    }));
  } catch (error) {
    console.error('Error fetching championship teams:', error);
    return [];
  }
};

// Get matches for a championship
export const getChampionshipMatches = async (
  championshipId: string, 
  filters?: { status?: string, category?: string }
): Promise<ChampionshipMatch[]> => {
  try {
    let query = supabase
      .from('matches')
      .select(`
        id,
        date,
        time,
        location,
        category,
        home_team,
        away_team,
        home_score,
        away_score,
        status,
        round,
        championship_id,
        home_team:home_team(id, name, logo),
        away_team:away_team(id, name, logo)
      `)
      .eq('championship_id', championshipId)
      .order('date', { ascending: true })
      .order('time', { ascending: true });
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []).map(match => {
      // Safely access nested data
      const homeTeam = match.home_team as any;
      const awayTeam = match.away_team as any;
      
      return {
        id: match.id,
        date: match.date,
        time: match.time,
        location: match.location,
        category: match.category,
        home_team: match.home_team,
        away_team: match.away_team,
        home_score: match.home_score,
        away_score: match.away_score,
        status: match.status,
        round: match.round,
        home_team_name: homeTeam ? homeTeam.name : 'Unknown',
        away_team_name: awayTeam ? awayTeam.name : 'Unknown',
        home_team_logo: homeTeam ? homeTeam.logo : null,
        away_team_logo: awayTeam ? awayTeam.logo : null
      };
    });
  } catch (error) {
    console.error('Error fetching championship matches:', error);
    return [];
  }
};

// Get standings for a championship
export const getChampionshipStandings = async (championshipId: string, category: string, groupName?: string): Promise<ChampionshipStanding[]> => {
  try {
    const { data: standings, error: standingsError } = await supabase
      .from('standings')
      .select(`
        *,
        team:team_id(id, name, logo)
      `)
      .eq('category', category)
      .order('position', { ascending: true });
    
    if (standingsError) throw standingsError;
    
    if (groupName) {
      return standings
        .filter(standing => standing.group_name === groupName)
        .map(standing => ({
          position: standing.position,
          team_id: standing.team_id,
          team_name: standing.team?.name || 'Desconhecido',
          team_logo: standing.team?.logo || null,
          points: standing.points,
          played: standing.played,
          won: standing.won,
          drawn: standing.drawn,
          lost: standing.lost,
          goals_for: standing.goals_for,
          goals_against: standing.goals_against,
          goal_difference: standing.goal_difference
        }));
    }
    
    return standings.map(standing => ({
      position: standing.position,
      team_id: standing.team_id,
      team_name: standing.team?.name || 'Desconhecido',
      team_logo: standing.team?.logo || null,
      points: standing.points,
      played: standing.played,
      won: standing.won,
      drawn: standing.drawn,
      lost: standing.lost,
      goals_for: standing.goals_for,
      goals_against: standing.goals_against,
      goal_difference: standing.goal_difference
    }));
  } catch (error) {
    console.error('Error fetching championship standings:', error);
    return [];
  }
};

// Get top scorers for a championship
export const getChampionshipTopScorers = async (championshipId: string, category?: string, limit: number = 10): Promise<any[]> => {
  try {
    let query = supabase
      .from('top_scorers')
      .select(`
        *,
        player:player_id(id, name, number, position, photo),
        team:team_id(id, name, logo)
      `)
      .eq('championship_id', championshipId)
      .order('goals', { ascending: false })
      .limit(limit);
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching championship top scorers:', error);
    return [];
  }
};

// Get yellow card leaders for a championship
export const getChampionshipYellowCards = async (championshipId: string, category?: string, limit: number = 10): Promise<any[]> => {
  try {
    let query = supabase
      .from('yellow_card_leaders')
      .select(`
        *,
        player:player_id(id, name, number, position, photo),
        team:team_id(id, name, logo)
      `)
      .eq('championship_id', championshipId)
      .order('yellow_cards', { ascending: false })
      .limit(limit);
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching championship yellow cards:', error);
    return [];
  }
};
