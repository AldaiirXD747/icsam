import { supabase } from "@/integrations/supabase/client";

export const cleanMatchesOnly = async () => {
  try {
    console.log("Iniciando limpeza de partidas, estatísticas e classificações...");
    
    // Delete in the right order to respect foreign key constraints
    const tables = [
      "goals",
      "match_events",
      "match_statistics",
      "top_scorers",
      "yellow_card_leaders",
      "standings",
      "matches"
    ];
    
    for (const table of tables) {
      console.log(`Removendo registros da tabela ${table}...`);
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
