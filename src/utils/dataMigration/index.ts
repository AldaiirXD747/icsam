
import { supabase } from "@/integrations/supabase/client";

export const cleanMatchesOnly = async () => {
  try {
    console.log("Iniciando limpeza de partidas, estatísticas e classificações...");
    
    // Define tables to clean with proper typing
    const tablesToClean = [
      "goals",
      "match_events",
      "match_statistics",
      "top_scorers",
      "yellow_card_leaders",
      "standings",
      "matches"
    ] as const; // Make this a readonly tuple to preserve literal types
    
    // Delete data from each table
    for (const table of tablesToClean) {
      console.log(`Removendo registros da tabela ${table}...`);
      // Now 'table' has the correct literal type that supabase.from() expects
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (error) {
        console.error(`Erro ao limpar tabela ${table}:`, error);
        return { success: false, error: error.message };
      } else {
        console.log(`Tabela ${table} limpa com sucesso.`);
      }
    }
    
    return { 
      success: true, 
      message: "Todos os dados de partidas, estatísticas e classificações foram removidos com sucesso. Times e campeonatos foram mantidos." 
    };
  } catch (error) {
    console.error("Erro durante a limpeza de dados:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
};

// Add missing exports needed by other files
export const cleanAllData = async () => {
  try {
    console.log("Iniciando limpeza completa de dados...");
    
    // Define tables to clean with proper typing
    const tablesToClean = [
      "goals",
      "match_events",
      "match_statistics",
      "top_scorers",
      "yellow_card_leaders",
      "standings",
      "matches",
      "players",
      "teams",
      "championships"
    ] as const; // Make this a readonly tuple to preserve literal types
    
    // Delete data from each table
    for (const table of tablesToClean) {
      console.log(`Removendo registros da tabela ${table}...`);
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (error) {
        console.error(`Erro ao limpar tabela ${table}:`, error);
        return false;
      } else {
        console.log(`Tabela ${table} limpa com sucesso.`);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Erro durante a limpeza completa de dados:", error);
    return false;
  }
};

export const resetMatchResultsAndStandings = async () => {
  try {
    console.log("Resetando resultados de partidas e classificações...");
    
    // Reset match scores and status
    const { error: matchError } = await supabase
      .from("matches")
      .update({
        home_score: null,
        away_score: null,
        status: 'scheduled'
      })
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (matchError) {
      console.error("Erro ao resetar partidas:", matchError);
      return { success: false, error: matchError.message };
    }
    
    // Clear match-related tables with proper typing
    const relatedTables = [
      "goals",
      "match_events",
      "match_statistics",
      "top_scorers",
      "yellow_card_leaders",
      "standings"
    ] as const; // Make this a readonly tuple to preserve literal types
    
    for (const table of relatedTables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (error) {
        console.error(`Erro ao limpar tabela ${table}:`, error);
        return { success: false, error: error.message };
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("Erro durante o reset de partidas e classificações:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro desconhecido' 
    };
  }
};

// Add a placeholder for the migrateDataToSupabase function that's being imported elsewhere
export const migrateDataToSupabase = async () => {
  console.log("Migração automática desativada.");
  return false;
};
