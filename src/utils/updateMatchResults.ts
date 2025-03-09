
import { supabase } from '@/integrations/supabase/client';

interface MatchResult {
  date: string;
  homeTeamName: string;
  awayTeamName: string;
  category: string;
  homeScore: number;
  awayScore: number;
  round?: string;
  status?: string;
}

export const updateMatchResults = async (results: MatchResult[]) => {
  const updates: { success: boolean; message: string }[] = [];
  let hasErrors = false;

  try {
    // First, get all teams to map names to IDs
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('id, name, category');
    
    if (teamsError) {
      console.error('Error fetching teams:', teamsError);
      return { 
        success: false, 
        error: teamsError.message, 
        updates: [{ success: false, message: `Erro ao buscar times: ${teamsError.message}` }] 
      };
    }
    
    // Group teams by name and category
    const teamMap: Record<string, Record<string, string>> = {};
    
    teams?.forEach(team => {
      if (!teamMap[team.name.toUpperCase()]) {
        teamMap[team.name.toUpperCase()] = {};
      }
      teamMap[team.name.toUpperCase()][team.category] = team.id;
    });
    
    // Process each match result
    for (const result of results) {
      try {
        const homeTeamName = result.homeTeamName.toUpperCase();
        const awayTeamName = result.awayTeamName.toUpperCase();
        
        // Check if teams exist in the database
        if (!teamMap[homeTeamName] || !teamMap[homeTeamName][result.category]) {
          const message = `Time ${result.homeTeamName} não encontrado para categoria ${result.category}`;
          console.error(message);
          updates.push({ success: false, message });
          hasErrors = true;
          continue;
        }
        
        if (!teamMap[awayTeamName] || !teamMap[awayTeamName][result.category]) {
          const message = `Time ${result.awayTeamName} não encontrado para categoria ${result.category}`;
          console.error(message);
          updates.push({ success: false, message });
          hasErrors = true;
          continue;
        }
        
        const homeTeamId = teamMap[homeTeamName][result.category];
        const awayTeamId = teamMap[awayTeamName][result.category];
        
        // Check if match already exists
        const { data: existingMatch, error: checkError } = await supabase
          .from('matches')
          .select('id')
          .eq('home_team', homeTeamId)
          .eq('away_team', awayTeamId)
          .eq('category', result.category)
          .eq('date', result.date);
        
        if (checkError) {
          console.error('Error checking for existing match:', checkError);
          updates.push({ success: false, message: `Erro ao verificar partida: ${checkError.message}` });
          hasErrors = true;
          continue;
        }
        
        // Update or insert match
        if (existingMatch && existingMatch.length > 0) {
          // Update existing match
          const { error: updateError } = await supabase
            .from('matches')
            .update({
              home_score: result.homeScore,
              away_score: result.awayScore,
              status: result.status || (result.homeScore !== null ? 'completed' : 'scheduled'),
              round: result.round || null
            })
            .eq('id', existingMatch[0].id);
          
          if (updateError) {
            console.error('Error updating match:', updateError);
            updates.push({ success: false, message: `Erro ao atualizar partida: ${updateError.message}` });
            hasErrors = true;
          } else {
            updates.push({ 
              success: true, 
              message: `Placar atualizado: ${result.homeTeamName} ${result.homeScore} x ${result.awayScore} ${result.awayTeamName}` 
            });
          }
        } else {
          // Insert new match
          const { error: insertError } = await supabase
            .from('matches')
            .insert({
              date: result.date,
              time: '14:00',  // Default time if not provided
              location: 'São Paulo',  // Default location if not provided
              category: result.category,
              home_team: homeTeamId,
              away_team: awayTeamId,
              home_score: result.homeScore,
              away_score: result.awayScore,
              status: result.status || (result.homeScore !== null ? 'completed' : 'scheduled'),
              round: result.round || null
            });
          
          if (insertError) {
            console.error('Error inserting match:', insertError);
            updates.push({ success: false, message: `Erro ao inserir partida: ${insertError.message}` });
            hasErrors = true;
          } else {
            updates.push({ 
              success: true, 
              message: `Partida inserida: ${result.homeTeamName} ${result.homeScore} x ${result.awayScore} ${result.awayTeamName}` 
            });
          }
        }
      } catch (error) {
        console.error('Error processing match:', error);
        updates.push({ success: false, message: `Erro inesperado: ${error instanceof Error ? error.message : 'Desconhecido'}` });
        hasErrors = true;
      }
    }
    
    // Recalculate standings
    try {
      const { error: recalcError } = await supabase.rpc('recalculate_standings');
      if (recalcError) {
        console.error('Error recalculating standings:', recalcError);
        updates.push({ success: false, message: `Erro ao recalcular classificações: ${recalcError.message}` });
        hasErrors = true;
      } else {
        updates.push({ success: true, message: 'Classificações recalculadas com sucesso' });
      }
    } catch (error) {
      console.error('Error calling recalculate_standings:', error);
      updates.push({ success: false, message: `Erro ao recalcular classificações: ${error instanceof Error ? error.message : 'Desconhecido'}` });
      hasErrors = true;
    }
    
    return {
      success: !hasErrors,
      updates: updates
    };
  } catch (error) {
    console.error('Unexpected error in updateMatchResults:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      updates: [{ success: false, message: `Erro inesperado: ${error instanceof Error ? error.message : 'Desconhecido'}` }]
    };
  }
};
