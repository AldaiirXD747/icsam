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

/**
 * Finds duplicate matches and removes them, keeping only the oldest entry
 */
export const removeDuplicateMatches = async () => {
  try {
    // Get all matches
    const { data: matches, error: fetchError } = await supabase
      .from('matches')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (fetchError) {
      console.error('Error fetching matches:', fetchError);
      return { success: false, error: fetchError.message };
    }
    
    if (!matches || matches.length === 0) {
      return { success: true, message: 'No matches found to check for duplicates' };
    }
    
    // Group matches by unique combination of home_team, away_team, category, and date
    const groupedMatches: Record<string, any[]> = {};
    
    matches.forEach(match => {
      const key = `${match.home_team}-${match.away_team}-${match.category}-${match.date}`;
      if (!groupedMatches[key]) {
        groupedMatches[key] = [];
      }
      groupedMatches[key].push(match);
    });
    
    // Find groups with more than one match (duplicates)
    const duplicateGroups = Object.values(groupedMatches).filter(group => group.length > 1);
    
    if (duplicateGroups.length === 0) {
      return { success: true, message: 'No duplicate matches found' };
    }
    
    // For each group with duplicates, keep the oldest record and delete the others
    let deletedCount = 0;
    for (const group of duplicateGroups) {
      // Sort by created_at to ensure we keep the oldest
      group.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      
      // Keep the oldest match (first in the sorted array)
      const keepMatch = group[0];
      
      // Delete the newer duplicates
      for (let i = 1; i < group.length; i++) {
        const deleteMatch = group[i];
        const { error: deleteError } = await supabase
          .from('matches')
          .delete()
          .eq('id', deleteMatch.id);
        
        if (deleteError) {
          console.error(`Error deleting duplicate match ${deleteMatch.id}:`, deleteError);
        } else {
          deletedCount++;
        }
      }
      
      // Update the kept match with the correct scores and status
      // This ensures the original match has the latest information
      const { error: updateError } = await supabase
        .from('matches')
        .update({
          home_score: group[group.length - 1].home_score,
          away_score: group[group.length - 1].away_score,
          status: 'completed',
          round: group[group.length - 1].round
        })
        .eq('id', keepMatch.id);
      
      if (updateError) {
        console.error(`Error updating kept match ${keepMatch.id}:`, updateError);
      }
    }
    
    // Trigger standings recalculation
    const { error: recalcError } = await supabase.rpc('recalculate_standings');
    if (recalcError) {
      console.error('Error recalculating standings:', recalcError);
      return { 
        success: true, 
        message: `Removed ${deletedCount} duplicate matches, but standings recalculation failed: ${recalcError.message}` 
      };
    }
    
    return { 
      success: true, 
      message: `Successfully removed ${deletedCount} duplicate matches and recalculated standings` 
    };
  } catch (error) {
    console.error('Unexpected error removing duplicate matches:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
};

/**
 * Updates match dates according to correction rules
 */
export const updateMatchDates = async () => {
  try {
    // First, get all matches with the old dates
    const { data: matches, error: fetchError } = await supabase
      .from('matches')
      .select('id, date');
    
    if (fetchError) {
      console.error('Error fetching matches:', fetchError);
      return { success: false, error: fetchError.message };
    }
    
    if (!matches || matches.length === 0) {
      return { success: true, message: 'No matches found to update dates' };
    }
    
    const updatePromises = matches.map(match => {
      const correctedDate = correctMatchDate(match.date);
      
      if (correctedDate !== match.date) {
        return supabase
          .from('matches')
          .update({ date: correctedDate })
          .eq('id', match.id);
      }
      
      // Return a resolved promise if no update is needed
      return Promise.resolve({ data: null, error: null });
    });
    
    await Promise.all(updatePromises);
    
    return { 
      success: true, 
      message: `Updated match dates according to correction rules` 
    };
  } catch (error) {
    console.error('Error updating match dates:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
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

/**
 * Removes specific matches from the database by their dates and team names
 */
export const removeSpecificMatches = async () => {
  try {
    // Define the dates and match combinations to remove
    const matchesToRemove = [
      // 22/02/2025 matches
      { date: '2025-02-22', home: 'LYON', away: 'BSA', category: 'SUB-13' },
      { date: '2025-02-22', home: 'LYON', away: 'BSA', category: 'SUB-11' },
      { date: '2025-02-22', home: 'ATLÉTICO CITY', away: 'GUERREIROS', category: 'SUB-13' },
      { date: '2025-02-22', home: 'ATLÉTICO CITY', away: 'GUERREIROS', category: 'SUB-11' },
      
      // 23/02/2025 matches
      { date: '2025-02-23', home: 'FEDERAL', away: 'ESTRELA VERMELHA', category: 'SUB-13' },
      { date: '2025-02-23', home: 'FEDERAL', away: 'ESTRELA VERMELHA', category: 'SUB-11' },
      { date: '2025-02-23', home: 'ALVINEGRO', away: 'FURACÃO', category: 'SUB-11' },
      { date: '2025-02-23', home: 'ALVINEGRO', away: 'FURACÃO', category: 'SUB-13' },
      
      // 08/03/2025 matches
      { date: '2025-03-08', home: 'LYON', away: 'GUERREIROS', category: 'SUB-13' },
      { date: '2025-03-08', home: 'LYON', away: 'GUERREIROS', category: 'SUB-11' },
      { date: '2025-03-08', home: 'MONTE', away: 'BSA', category: 'SUB-11' },
      { date: '2025-03-08', home: 'MONTE', away: 'BSA', category: 'SUB-13' },
      { date: '2025-03-08', home: 'FURACÃO', away: 'ESTRELA VERMELHA', category: 'SUB-11' },
      { date: '2025-03-08', home: 'FURACÃO', away: 'ESTRELA VERMELHA', category: 'SUB-13' },
      { date: '2025-03-08', home: 'ALVINEGRO', away: 'GRÊMIO OCIDENTAL', category: 'SUB-13' },
      { date: '2025-03-08', home: 'ALVINEGRO', away: 'GRÊMIO OCIDENTAL', category: 'SUB-11' }
    ];
    
    // Get all teams to map names to IDs
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('id, name');
    
    if (teamsError) {
      console.error('Error fetching teams:', teamsError);
      return { success: false, error: teamsError.message };
    }
    
    const teamNameToId: {[key: string]: string} = {};
    teams?.forEach(team => {
      teamNameToId[team.name.toUpperCase()] = team.id;
    });
    
    let deletedCount = 0;
    let failedCount = 0;
    
    // Process each match to remove
    for (const match of matchesToRemove) {
      const homeTeamId = teamNameToId[match.home];
      const awayTeamId = teamNameToId[match.away];
      
      if (!homeTeamId || !awayTeamId) {
        console.error(`Could not find team IDs for: ${match.home} vs ${match.away}`);
        failedCount++;
        continue;
      }
      
      // Find and delete the match
      const { data: matchToDelete, error: findError } = await supabase
        .from('matches')
        .select('id')
        .eq('date', match.date)
        .eq('home_team', homeTeamId)
        .eq('away_team', awayTeamId)
        .eq('category', match.category);
      
      if (findError) {
        console.error(`Error finding match: ${match.home} vs ${match.away} on ${match.date}`, findError);
        failedCount++;
        continue;
      }
      
      if (matchToDelete && matchToDelete.length > 0) {
        for (const m of matchToDelete) {
          const { error: deleteError } = await supabase
            .from('matches')
            .delete()
            .eq('id', m.id);
          
          if (deleteError) {
            console.error(`Error deleting match with ID ${m.id}:`, deleteError);
            failedCount++;
          } else {
            deletedCount++;
          }
        }
      } else {
        console.log(`No match found for: ${match.home} vs ${match.away} on ${match.date} in category ${match.category}`);
      }
    }
    
    // Recalculate standings after deletions
    const { error: recalcError } = await supabase.rpc('recalculate_standings');
    if (recalcError) {
      console.error('Error recalculating standings:', recalcError);
      return { 
        success: true, 
        message: `Removed ${deletedCount} matches, but standings recalculation failed: ${recalcError.message}. Failed to delete ${failedCount} matches.` 
      };
    }
    
    return { 
      success: true, 
      message: `Successfully removed ${deletedCount} matches and recalculated standings. Failed to delete ${failedCount} matches.` 
    };
  } catch (error) {
    console.error('Unexpected error removing specific matches:', error);
    return { success: false, error: 'Unexpected error occurred' };
  }
};
