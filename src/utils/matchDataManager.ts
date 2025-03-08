
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface MatchData {
  date: string;
  time: string;
  location: string;
  category: string;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  status: string;
  round: string;
}

export const addMatch = async (matchData: MatchData) => {
  try {
    // First, get the team IDs
    const { data: homeTeamData, error: homeTeamError } = await supabase
      .from('teams')
      .select('id')
      .eq('name', matchData.homeTeamName)
      .limit(1);
    
    if (homeTeamError || !homeTeamData || homeTeamData.length === 0) {
      console.error('Error finding home team:', homeTeamError || 'Team not found');
      return { success: false, error: `Home team "${matchData.homeTeamName}" not found` };
    }
    
    const { data: awayTeamData, error: awayTeamError } = await supabase
      .from('teams')
      .select('id')
      .eq('name', matchData.awayTeamName)
      .limit(1);
    
    if (awayTeamError || !awayTeamData || awayTeamData.length === 0) {
      console.error('Error finding away team:', awayTeamError || 'Team not found');
      return { success: false, error: `Away team "${matchData.awayTeamName}" not found` };
    }
    
    const homeTeamId = homeTeamData[0].id;
    const awayTeamId = awayTeamData[0].id;
    
    // Insert the match
    const { data: insertedMatch, error: insertError } = await supabase
      .from('matches')
      .insert({
        date: matchData.date,
        time: matchData.time,
        location: matchData.location,
        category: matchData.category,
        home_team: homeTeamId,
        away_team: awayTeamId,
        home_score: matchData.homeScore,
        away_score: matchData.awayScore,
        status: matchData.status,
        round: matchData.round
      })
      .select();
    
    if (insertError) {
      console.error('Error inserting match:', insertError);
      return { success: false, error: insertError.message };
    }
    
    // Trigger standings recalculation
    if (matchData.status === 'completed') {
      const { error: recalcError } = await supabase.rpc('recalculate_standings');
      if (recalcError) {
        console.error('Error recalculating standings:', recalcError);
        return { 
          success: true, 
          match: insertedMatch,
          warning: 'Match added but standings recalculation failed: ' + recalcError.message 
        };
      }
    }
    
    return { success: true, match: insertedMatch };
  } catch (error) {
    console.error('Unexpected error adding match:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
};

export const addBatchMatches = async (matches: MatchData[]) => {
  const results = [];
  let hasErrors = false;
  
  for (const match of matches) {
    const result = await addMatch(match);
    results.push(result);
    
    if (!result.success) {
      hasErrors = true;
    }
  }
  
  // Final standings recalculation after all matches
  try {
    const { error: recalcError } = await supabase.rpc('recalculate_standings');
    if (recalcError) {
      console.error('Error in final standings recalculation:', recalcError);
      results.push({ 
        success: false, 
        error: 'Final standings recalculation failed: ' + recalcError.message 
      });
      hasErrors = true;
    }
  } catch (error) {
    console.error('Unexpected error in final recalculation:', error);
    results.push({
      success: false,
      error: 'Final standings recalculation failed unexpectedly'
    });
    hasErrors = true;
  }
  
  return {
    success: !hasErrors,
    results: results
  };
};
