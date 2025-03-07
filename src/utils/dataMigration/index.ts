
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

// The old migrateDataToSupabase function is now disabled
// It's kept here for reference but no longer used
export const migrateDataToSupabase = async () => {
  console.log("A função de migração automática foi desativada.");
  console.log("Por favor, cadastre todos os dados através do Painel Administrativo.");
  return false;
};
