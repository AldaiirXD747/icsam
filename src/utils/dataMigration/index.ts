
import { supabase } from "@/integrations/supabase/client";
import { fetchPublicData } from "./fetchPublicData";
import { migrateChampionships } from "./migrateChampionships";
import { migrateTeams } from "./migrateTeams";
import { migratePlayers } from "./migratePlayers";
import { migrateMatches } from "./migrateMatches";
import { migrateStatistics } from "./migrateStatistics";

/**
 * This utility script migrates existing data to Supabase
 * It fetches data from public endpoints and harmonizes it with the admin panel's data structure
 */
export const migrateDataToSupabase = async () => {
  try {
    console.log("Iniciando migração de dados para o Supabase...");
    
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
    return true;
  } catch (error) {
    console.error("Erro durante a migração de dados:", error);
    return false;
  }
};
