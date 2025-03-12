
import { supabase } from "@/integrations/supabase/client";

/**
 * This utility script helps manage data between public and admin interfaces
 */

// Function to clean all data from the database
export const cleanAllData = async () => {
  try {
    console.log("Iniciando limpeza de todos os dados...");
    
    // Delete all records from tables in the correct order to respect foreign key constraints
    const tables = [
      "goals",
      "match_events",
      "top_scorers",
      "yellow_card_leaders",
      "standings",
      "matches",
      "players",
      "team_accounts",
      "teams",
      "championships"
    ];
    
    for (const table of tables) {
      console.log(`Removendo registros da tabela ${table}...`);
      const { error } = await supabase
        .from(table as any)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (error) {
        console.error(`Erro ao limpar tabela ${table}:`, error);
      } else {
        console.log(`Tabela ${table} limpa com sucesso.`);
      }
    }
    
    console.log("Limpeza de dados concluída!");
    return true;
  } catch (error) {
    console.error("Erro durante a limpeza de dados:", error);
    return false;
  }
};

// Function to reset match results and standings
export const resetMatchResultsAndStandings = async () => {
  try {
    console.log("Iniciando reset completo de resultados de partidas e classificação...");
    
    // Step 1: Reset all match scores and status
    console.log("Resetando todos os resultados de partidas...");
    const { error: matchError } = await supabase
      .from('matches')
      .update({
        home_score: null,
        away_score: null,
        status: 'scheduled'
      });
    
    if (matchError) {
      console.error("Erro ao resetar resultados das partidas:", matchError);
      return { success: false, error: matchError.message };
    }
    
    // Step 2: Reset all standings to zero
    console.log("Resetando completamente a classificação...");
    const { error: standingsError } = await supabase
      .from('standings')
      .update({
        position: 0,
        points: 0,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goals_for: 0,
        goals_against: 0,
        goal_difference: 0
      });
    
    if (standingsError) {
      console.error("Erro ao resetar a classificação:", standingsError);
      return { success: false, error: standingsError.message };
    }
    
    // Step 3: Delete all goals
    console.log("Removendo todos os gols...");
    const { error: goalsError } = await supabase
      .from('goals')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (goalsError) {
      console.error("Erro ao apagar gols:", goalsError);
      return { success: false, error: goalsError.message };
    }
    
    // Step 4: Reset top scorers
    console.log("Resetando artilheiros...");
    const { error: scorersError } = await supabase
      .from('top_scorers')
      .update({
        goals: 0
      });
    
    if (scorersError) {
      console.error("Erro ao resetar artilheiros:", scorersError);
      return { success: false, error: scorersError.message };
    }
    
    // Step 5: Reset yellow cards
    console.log("Resetando cartões amarelos...");
    const { error: cardsError } = await supabase
      .from('yellow_card_leaders')
      .update({
        yellow_cards: 0
      });
    
    if (cardsError) {
      console.error("Erro ao resetar cartões amarelos:", cardsError);
      return { success: false, error: cardsError.message };
    }

    // Step 6: Delete all match events
    console.log("Removendo todos os eventos de partidas...");
    const { error: eventsError } = await supabase
      .from('match_events')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (eventsError) {
      console.error("Erro ao apagar eventos de partidas:", eventsError);
      return { success: false, error: eventsError.message };
    }

    // Step 7: Delete all match statistics
    console.log("Removendo todas as estatísticas de partidas...");
    const { error: statsError } = await supabase
      .from('match_statistics')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (statsError) {
      console.error("Erro ao apagar estatísticas de partidas:", statsError);
      return { success: false, error: statsError.message };
    }
    
    console.log("Reset de resultados e classificação concluído com sucesso!");
    return { success: true };
  } catch (error) {
    console.error("Erro inesperado durante o reset:", error);
    return { success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' };
  }
};

// The old migrateDataToSupabase function is now disabled
// It's kept here for reference but no longer used
export const migrateDataToSupabase = async () => {
  console.log("A função de migração automática foi desativada.");
  console.log("Por favor, cadastre todos os dados através do Painel Administrativo.");
  return false;
};
