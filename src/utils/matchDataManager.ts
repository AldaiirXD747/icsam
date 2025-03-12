
import { supabase } from "@/integrations/supabase/client";

export const removeGhostMatches = async () => {
  try {
    console.log("Iniciando remoção de partidas fantasmas...");
    
    // Find matches that have issues
    const { data: potentialGhostMatches, error: findError } = await supabase
      .from('matches')
      .select('id, home_team, away_team, home_score, away_score')
      .or('home_team.is.null,away_team.is.null');
    
    if (findError) {
      console.error("Erro ao buscar partidas potencialmente fantasmas:", findError);
      return { success: false, error: findError.message };
    }
    
    console.log(`Encontradas ${potentialGhostMatches?.length || 0} partidas suspeitas.`);
    
    if (!potentialGhostMatches || potentialGhostMatches.length === 0) {
      return { success: true, message: "Nenhuma partida fantasma encontrada." };
    }
    
    // IDs of matches to remove
    const matchIdsToRemove = potentialGhostMatches.map(match => match.id);
    
    // Step 1: Delete related data
    // Delete goals
    const { error: goalsError } = await supabase
      .from('goals')
      .delete()
      .in('match_id', matchIdsToRemove);
    
    if (goalsError) {
      console.error("Erro ao remover gols:", goalsError);
    }
    
    // Delete match events
    const { error: eventsError } = await supabase
      .from('match_events')
      .delete()
      .in('match_id', matchIdsToRemove);
    
    if (eventsError) {
      console.error("Erro ao remover eventos:", eventsError);
    }
    
    // Delete match statistics
    const { error: statsError } = await supabase
      .from('match_statistics')
      .delete()
      .in('match_id', matchIdsToRemove);
    
    if (statsError) {
      console.error("Erro ao remover estatísticas:", statsError);
    }
    
    // Step 2: Delete the matches
    const { error: matchesError } = await supabase
      .from('matches')
      .delete()
      .in('id', matchIdsToRemove);
    
    if (matchesError) {
      console.error("Erro ao remover partidas fantasmas:", matchesError);
      return { success: false, error: matchesError.message };
    }
    
    // Step 3: Recalculate standings
    const { error: recalcError } = await supabase.rpc("recalculate_standings");
    
    if (recalcError) {
      console.error("Erro ao recalcular classificação:", recalcError);
      return { 
        success: true, 
        message: `${matchIdsToRemove.length} partidas fantasmas removidas, mas erro ao recalcular classificação.` 
      };
    }
    
    return { 
      success: true, 
      message: `${matchIdsToRemove.length} partidas fantasmas foram removidas e a classificação foi recalculada.` 
    };
  } catch (error) {
    console.error("Erro inesperado ao remover partidas fantasmas:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro desconhecido" 
    };
  }
};

export const removeSpecificMatches = async () => {
  try {
    console.log("Iniciando remoção de partidas específicas...");
    
    // Define dates to remove (22/02, 23/02 and 08/03)
    const datesToRemove = ['2023-02-22', '2023-02-23', '2023-03-08', '2024-02-22', '2024-02-23', '2024-03-08'];
    
    // Find matches on these dates
    const { data: matchesToRemove, error: findError } = await supabase
      .from('matches')
      .select('id')
      .in('date', datesToRemove);
    
    if (findError) {
      console.error("Erro ao buscar partidas específicas:", findError);
      return { success: false, error: findError.message };
    }
    
    console.log(`Encontradas ${matchesToRemove?.length || 0} partidas nas datas especificadas.`);
    
    if (!matchesToRemove || matchesToRemove.length === 0) {
      return { success: true, message: "Nenhuma partida encontrada nas datas especificadas." };
    }
    
    // IDs of matches to remove
    const matchIdsToRemove = matchesToRemove.map(match => match.id);
    
    // Step 1: Delete related data
    // Delete goals
    const { error: goalsError } = await supabase
      .from('goals')
      .delete()
      .in('match_id', matchIdsToRemove);
    
    if (goalsError) {
      console.error("Erro ao remover gols:", goalsError);
    }
    
    // Delete match events
    const { error: eventsError } = await supabase
      .from('match_events')
      .delete()
      .in('match_id', matchIdsToRemove);
    
    if (eventsError) {
      console.error("Erro ao remover eventos:", eventsError);
    }
    
    // Delete match statistics
    const { error: statsError } = await supabase
      .from('match_statistics')
      .delete()
      .in('match_id', matchIdsToRemove);
    
    if (statsError) {
      console.error("Erro ao remover estatísticas:", statsError);
    }
    
    // Step 2: Delete the matches
    const { error: matchesError } = await supabase
      .from('matches')
      .delete()
      .in('id', matchIdsToRemove);
    
    if (matchesError) {
      console.error("Erro ao remover partidas específicas:", matchesError);
      return { success: false, error: matchesError.message };
    }
    
    // Step 3: Recalculate standings
    const { error: recalcError } = await supabase.rpc("recalculate_standings");
    
    if (recalcError) {
      console.error("Erro ao recalcular classificação:", recalcError);
      return { 
        success: true, 
        message: `${matchIdsToRemove.length} partidas específicas removidas, mas erro ao recalcular classificação.` 
      };
    }
    
    return { 
      success: true, 
      message: `${matchIdsToRemove.length} partidas específicas foram removidas e a classificação foi recalculada.` 
    };
  } catch (error) {
    console.error("Erro inesperado ao remover partidas específicas:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro desconhecido" 
    };
  }
};
