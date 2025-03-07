
import { supabase } from "@/integrations/supabase/client";

// Helper function to create standings table
export const createStandingsTable = async () => {
  try {
    // Use the RPC function to check if the standings table exists
    const { data: tableExists, error: checkError } = await supabase.rpc('get_standings_table_exists');
    
    if (checkError) {
      console.error("Erro ao verificar existência da tabela standings:", checkError);
      return;
    }

    // If the table doesn't exist, create it
    if (!tableExists) {
      console.log("Criando tabela de classificação (standings)...");
      const { error: createError } = await supabase.rpc('create_standings_table');
      
      if (createError) {
        console.error("Erro ao criar tabela standings:", createError);
        return;
      }
      
      console.log("Tabela de classificação criada com sucesso!");
    } else {
      console.log("Tabela de classificação já existe.");
    }
  } catch (error) {
    console.error("Erro ao verificar/criar tabela standings:", error);
  }
};

// Main function to migrate statistics
export const migrateStatistics = async (statistics: any, playersMap: Map<string, string>, teamsMap: Map<string, string>) => {
  try {
    console.log(`Migrando ${statistics?.topScorers?.length || 0} artilheiros e ${statistics?.yellowCardLeaders?.length || 0} líderes de cartões amarelos...`);

    // Migrate top scorers
    if (statistics?.topScorers && statistics.topScorers.length > 0) {
      for (const scorer of statistics.topScorers) {
        if (!scorer || !scorer.player_id) continue;
        
        // Map old IDs to new ones
        const newPlayerId = playersMap.get(scorer.player_id);
        const newTeamId = teamsMap.get(scorer.team_id);
        
        if (!newPlayerId || !newTeamId) {
          console.log(`Pulando artilheiro sem mapeamento de ID: Player ${scorer.player_id}, Team ${scorer.team_id}`);
          continue;
        }
        
        const category = scorer.category || "SUB-15";
        
        // Check if top scorer already exists
        const { data: existingScorer } = await supabase
          .from("top_scorers")
          .select("id")
          .eq("player_id", newPlayerId)
          .eq("category", category)
          .maybeSingle();
        
        if (existingScorer) {
          // Update existing record
          const { error } = await supabase
            .from("top_scorers")
            .update({ 
              goals: scorer.goals,
              team_id: newTeamId,
              championship_id: scorer.championship_id || null
            })
            .eq("id", existingScorer.id);
          
          if (!error) {
            console.log(`Top scorer for player ${newPlayerId} updated successfully`);
          }
        } else {
          // Insert new record
          const { error } = await supabase
            .from("top_scorers")
            .insert({
              player_id: newPlayerId,
              team_id: newTeamId,
              goals: scorer.goals || 0,
              category: category,
              championship_id: scorer.championship_id || null
            });
          
          if (!error) {
            console.log(`Top scorer for player ${newPlayerId} migrated successfully`);
          }
        }
      }
    }
    
    // Migrate yellow card leaders
    if (statistics?.yellowCardLeaders && statistics.yellowCardLeaders.length > 0) {
      for (const leader of statistics.yellowCardLeaders) {
        if (!leader || !leader.player_id) continue;
        
        // Map old IDs to new ones
        const newPlayerId = playersMap.get(leader.player_id);
        const newTeamId = teamsMap.get(leader.team_id);
        
        if (!newPlayerId || !newTeamId) {
          console.log(`Pulando líder de cartões sem mapeamento de ID: Player ${leader.player_id}, Team ${leader.team_id}`);
          continue;
        }
        
        const category = leader.category || "SUB-15";
        
        // Check if yellow card leader already exists
        const { data: existingLeader } = await supabase
          .from("yellow_card_leaders")
          .select("id")
          .eq("player_id", newPlayerId)
          .eq("category", category)
          .maybeSingle();
        
        if (existingLeader) {
          // Update existing record
          const { error } = await supabase
            .from("yellow_card_leaders")
            .update({ 
              yellow_cards: leader.yellow_cards,
              team_id: newTeamId,
              championship_id: leader.championship_id || null
            })
            .eq("id", existingLeader.id);
          
          if (!error) {
            console.log(`Yellow card leader for player ${newPlayerId} updated successfully`);
          }
        } else {
          // Insert new record
          const { error } = await supabase
            .from("yellow_card_leaders")
            .insert({
              player_id: newPlayerId,
              team_id: newTeamId,
              yellow_cards: leader.yellow_cards || 0,
              category: category,
              championship_id: leader.championship_id || null
            });
          
          if (!error) {
            console.log(`Yellow card leader for player ${newPlayerId} migrated successfully`);
          }
        }
      }
    }

    console.log("Migração de estatísticas concluída com sucesso!");
    return true;
  } catch (error) {
    console.error("Erro ao migrar estatísticas:", error);
    return false;
  }
};
