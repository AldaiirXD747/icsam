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

/**
 * Corrects dates based on the mapping:
 * 21/02/2025 -> 22/02/2025
 * 22/02/2025 -> 23/02/2025
 * 07/03/2025 -> 08/03/2025
 * 08/03/2025 -> 09/03/2025
 */
export const correctMatchDate = (dateStr: string): string => {
  if (dateStr === '2025-02-21') return '2025-02-22';
  if (dateStr === '2025-02-22') return '2025-02-23';
  if (dateStr === '2025-03-07') return '2025-03-08';
  if (dateStr === '2025-03-08') return '2025-03-09';
  return dateStr;
};

export const addMatch = async (matchData: MatchData) => {
  try {
    // Apply date correction
    const correctedDate = correctMatchDate(matchData.date);
    
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
    
    // Check if a match already exists between these teams on this date with this category
    const { data: existingMatches, error: checkError } = await supabase
      .from('matches')
      .select('id')
      .eq('home_team', homeTeamId)
      .eq('away_team', awayTeamId)
      .eq('category', matchData.category)
      .eq('date', correctedDate);
      
    if (checkError) {
      console.error('Error checking for existing match:', checkError);
      return { success: false, error: checkError.message };
    }
    
    // If match exists, update it instead of inserting a new one
    if (existingMatches && existingMatches.length > 0) {
      const { data: updatedMatch, error: updateError } = await supabase
        .from('matches')
        .update({
          home_score: matchData.homeScore,
          away_score: matchData.awayScore,
          status: matchData.status,
          round: matchData.round
        })
        .eq('id', existingMatches[0].id)
        .select();
      
      if (updateError) {
        console.error('Error updating match:', updateError);
        return { success: false, error: updateError.message };
      }
      
      // Trigger standings recalculation
      if (matchData.status === 'completed') {
        const { error: recalcError } = await supabase.rpc('recalculate_standings');
        if (recalcError) {
          console.error('Error recalculating standings:', recalcError);
          return { 
            success: true, 
            match: updatedMatch,
            warning: 'Match updated but standings recalculation failed: ' + recalcError.message 
          };
        }
      }
      
      return { success: true, match: updatedMatch, updated: true };
    } 
    // Otherwise insert a new match
    else {
      const { data: insertedMatch, error: insertError } = await supabase
        .from('matches')
        .insert({
          date: correctedDate,
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
      
      return { success: true, match: insertedMatch, updated: false };
    }
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

/**
 * Updates existing match dates in the database according to the mapping
 */
export const correctAllMatchDates = async () => {
  try {
    // First, get all matches with the old dates
    const { data: matches, error: fetchError } = await supabase
      .from('matches')
      .select('id, date')
      .or('date.eq.2025-02-21,date.eq.2025-02-22,date.eq.2025-03-07,date.eq.2025-03-08');
    
    if (fetchError) {
      console.error('Error fetching matches:', fetchError);
      return { success: false, error: fetchError.message };
    }
    
    if (!matches || matches.length === 0) {
      return { success: true, message: 'No matches found with dates that need correction' };
    }
    
    const updatePromises = matches.map(match => {
      const correctedDate = correctMatchDate(match.date);
      
      return supabase
        .from('matches')
        .update({ date: correctedDate })
        .eq('id', match.id);
    });
    
    await Promise.all(updatePromises);
    
    return { 
      success: true, 
      message: `Updated ${matches.length} matches with corrected dates` 
    };
  } catch (error) {
    console.error('Error correcting match dates:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
};
