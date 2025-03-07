
import { supabase } from "@/integrations/supabase/client";
import { fetchPublicData } from "./fetchPublicData";
import { migrateChampionships } from "./migrateChampionships";
import { migrateTeams } from "./migrateTeams";
import { migratePlayers } from "./migratePlayers";
import { migrateMatches } from "./migrateMatches";
import { migrateStatistics, createStandingsTable } from "./migrateStatistics";

/**
 * This utility script migrates existing data to Supabase
 * It fetches data from public endpoints and harmonizes it with the admin panel's data structure
 */
export const migrateDataToSupabase = async () => {
  try {
    console.log("Iniciando migração de dados para o Supabase...");
    
    // Verificar se a coluna category existe na tabela players, se não, criar
    const { data: playersCategoryExists } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'players')
      .eq('column_name', 'category')
      .eq('table_schema', 'public');
    
    if (!playersCategoryExists || playersCategoryExists.length === 0) {
      console.log("Adicionando coluna 'category' à tabela players...");
      await supabase.rpc('add_category_to_players');
    }
    
    // Verificar se a tabela standings existe, se não, criar
    await createStandingsTable();
    
    // Fetch data from public endpoints
    const publicDataSources = await fetchPublicData();
    
    // Migrate championships
    await migrateChampionships(publicDataSources.championships);
    
    // Migrate teams
    const teamsMap = await migrateTeams(publicDataSources.teams);
    
    // Migrate players
    const playersMap = await migratePlayers(publicDataSources.players, teamsMap);
    
    // Migrate matches
    await migrateMatches(publicDataSources.matches, teamsMap);
    
    // Migrate statistics
    await migrateStatistics(publicDataSources.statistics, playersMap, teamsMap);
    
    console.log("Migração de dados concluída!");
    
    // Recalcular estatísticas após migração
    try {
      await supabase.rpc("recalculate_standings");
      console.log("Classificação recalculada com sucesso!");
    } catch (error) {
      console.error("Erro ao recalcular classificação:", error);
    }
    
    return true;
  } catch (error) {
    console.error("Erro durante a migração de dados:", error);
    return false;
  }
};
