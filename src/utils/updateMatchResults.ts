
import { supabase } from '../integrations/supabase/client';

interface MatchResult {
  date: string;
  homeTeamName: string;
  awayTeamName: string;
  category: string;
  homeScore: number;
  awayScore: number;
  round?: string;
  status: string;
  location?: string;
  time?: string;
}

export const updateMatchResults = async (results: MatchResult[]) => {
  try {
    const updateResults = [];
    const errors = [];
    
    // Process each match result
    for (const result of results) {
      try {
        // First, get the team IDs
        const { data: homeTeamData, error: homeTeamError } = await supabase
          .from('teams')
          .select('id')
          .ilike('name', result.homeTeamName)
          .single();
        
        if (homeTeamError) {
          updateResults.push({
            success: false,
            message: `Time da casa "${result.homeTeamName}" não encontrado`
          });
          continue;
        }
        
        const { data: awayTeamData, error: awayTeamError } = await supabase
          .from('teams')
          .select('id')
          .ilike('name', result.awayTeamName)
          .single();
        
        if (awayTeamError) {
          updateResults.push({
            success: false,
            message: `Time visitante "${result.awayTeamName}" não encontrado`
          });
          continue;
        }
        
        // Find the match in database using team IDs, date and category
        const { data: matchData, error: matchError } = await supabase
          .from('matches')
          .select('*')
          .eq('home_team', homeTeamData.id)
          .eq('away_team', awayTeamData.id)
          .eq('category', result.category)
          .eq('date', result.date)
          .maybeSingle();
        
        if (matchError) {
          updateResults.push({
            success: false,
            message: `Erro ao buscar partida: ${matchError.message}`
          });
          continue;
        }
        
        // Determine if we need to create a new match or update existing
        if (!matchData) {
          // Create new match - calculate local time if not provided
          const matchTime = result.time || '15:00:00';
          const matchLocation = result.location || 'Local a definir';
          const matchRound = result.round || null;
          const matchStatus = result.status || 
            (result.homeScore !== null && result.awayScore !== null ? 'completed' : 'scheduled');
          
          // Insert new match
          const { data: newMatch, error: insertError } = await supabase
            .from('matches')
            .insert({
              date: result.date,
              time: matchTime,
              home_team: homeTeamData.id,
              away_team: awayTeamData.id,
              home_score: result.homeScore,
              away_score: result.awayScore,
              category: result.category,
              status: matchStatus,
              location: matchLocation,
              round: matchRound
            })
            .select()
            .single();
          
          if (insertError) {
            updateResults.push({
              success: false,
              message: `Erro ao criar nova partida: ${insertError.message}`
            });
          } else {
            updateResults.push({
              success: true,
              message: `Nova partida criada: ${result.homeTeamName} vs ${result.awayTeamName}`
            });
          }
        } else {
          // Update existing match
          const { error: updateError } = await supabase
            .from('matches')
            .update({
              home_score: result.homeScore,
              away_score: result.awayScore,
              status: result.status || 
                (result.homeScore !== null && result.awayScore !== null ? 'completed' : matchData.status),
              round: result.round || matchData.round
            })
            .eq('id', matchData.id);
          
          if (updateError) {
            updateResults.push({
              success: false,
              message: `Erro ao atualizar partida: ${updateError.message}`
            });
          } else {
            updateResults.push({
              success: true, 
              message: `Partida atualizada: ${result.homeTeamName} ${result.homeScore} x ${result.awayScore} ${result.awayTeamName}`
            });
          }
        }
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error));
        updateResults.push({
          success: false,
          message: `Erro inesperado: ${error instanceof Error ? error.message : 'Desconhecido'}`
        });
      }
    }
    
    // Recalculate the standings
    try {
      await supabase.rpc('recalculate_standings');
    } catch (error) {
      console.error('Erro ao recalcular classificação:', error);
      updateResults.push({
        success: false,
        message: `Erro ao recalcular classificação: ${error instanceof Error ? error.message : 'Desconhecido'}`
      });
    }
    
    // Determine overall success
    const overallSuccess = updateResults.every(result => result.success);
    
    return {
      success: overallSuccess,
      error: errors.length > 0 ? errors.join(', ') : undefined,
      updates: updateResults
    };
  } catch (error) {
    console.error('Erro ao atualizar resultados:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      updates: [{ success: false, message: `Erro inesperado: ${error instanceof Error ? error.message : 'Desconhecido'}` }]
    };
  }
};
