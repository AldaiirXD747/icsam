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
    console.log("Iniciando reset de resultados de partidas e classificação...");
    
    // Reset match scores and status
    const { error: matchError } = await supabase
      .from('matches')
      .update({
        home_score: null,
        away_score: null,
        status: 'scheduled'
      })
      .eq('status', 'completed');
    
    if (matchError) {
      console.error("Erro ao resetar resultados das partidas:", matchError);
      return { success: false, error: matchError.message };
    }
    
    // Reset standings data but keep team entries
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
    
    // Clear goals table
    const { error: goalsError } = await supabase
      .from('goals')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (goalsError) {
      console.error("Erro ao apagar gols:", goalsError);
      return { success: false, error: goalsError.message };
    }
    
    // Reset top scorers
    const { error: scorersError } = await supabase
      .from('top_scorers')
      .update({
        goals: 0
      });
    
    if (scorersError) {
      console.error("Erro ao resetar artilheiros:", scorersError);
      return { success: false, error: scorersError.message };
    }
    
    // Reset yellow cards
    const { error: cardsError } = await supabase
      .from('yellow_card_leaders')
      .update({
        yellow_cards: 0
      });
    
    if (cardsError) {
      console.error("Erro ao resetar cartões amarelos:", cardsError);
      return { success: false, error: cardsError.message };
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
