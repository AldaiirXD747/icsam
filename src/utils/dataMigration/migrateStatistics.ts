
import { supabase } from "@/integrations/supabase/client";

/**
 * Migrate statistics data to Supabase
 */
export const migrateStatistics = async (
  statistics: any, 
  playersMap: Map<string, string>, 
  teamsMap: Map<string, string>
) => {
  try {
    // Migrate top scorers
    await migrateTopScorers(statistics.topScorers, playersMap, teamsMap);
    
    // Migrate yellow cards
    await migrateYellowCards(statistics.yellowCards, playersMap, teamsMap);
    
    return true;
  } catch (error) {
    console.error("Erro ao migrar estatísticas:", error);
    return false;
  }
};

/**
 * Migrate top scorers data to Supabase
 */
export const migrateTopScorers = async (
  topScorers: any[] = [], 
  playersMap: Map<string, string>, 
  teamsMap: Map<string, string>
) => {
  if (!topScorers || topScorers.length === 0) return;
  
  console.log(`Migrando ${topScorers.length} artilheiros...`);
  
  // Get championships
  const { data: championships } = await supabase
    .from("championships")
    .select("id, name");
  
  let defaultChampionshipId = null;
  if (championships && championships.length > 0) {
    defaultChampionshipId = championships[0].id;
  }
  
  for (const scorer of topScorers) {
    // Get the mapped player and team IDs
    const playerId = playersMap.get(scorer.playerId);
    const teamId = teamsMap.get(scorer.teamId);
    
    if (!playerId || !teamId) {
      console.error(`Jogador ou time não encontrado para o artilheiro com ID ${scorer.id}`);
      continue;
    }
    
    // Map public data fields to admin panel fields
    const scorerData = {
      player_id: playerId,
      team_id: teamId,
      goals: scorer.goals || 0,
      category: scorer.category || "SUB-15",
      championship_id: defaultChampionshipId
    };
    
    // Check if top scorer already exists
    const { data: existingScorer } = await supabase
      .from("top_scorers")
      .select("id")
      .eq("player_id", playerId)
      .eq("team_id", teamId)
      .maybeSingle();
    
    if (!existingScorer) {
      // Insert top scorer
      const { data, error } = await supabase
        .from("top_scorers")
        .insert(scorerData)
        .select();
      
      if (error) {
        console.error(`Erro ao inserir artilheiro:`, error);
      } else {
        console.log(`Artilheiro migrado com sucesso (id: ${data[0].id})`);
      }
    } else {
      console.log(`Artilheiro já existe no Supabase (id: ${existingScorer.id})`);
      
      // Update goals if needed
      const { error: updateError } = await supabase
        .from("top_scorers")
        .update({ goals: scorerData.goals })
        .eq("id", existingScorer.id);
      
      if (!updateError) {
        console.log(`Gols atualizados para o artilheiro ${existingScorer.id}`);
      }
    }
  }
};

/**
 * Migrate yellow cards data to Supabase
 */
export const migrateYellowCards = async (
  yellowCards: any[] = [], 
  playersMap: Map<string, string>, 
  teamsMap: Map<string, string>
) => {
  if (!yellowCards || yellowCards.length === 0) return;
  
  console.log(`Migrando ${yellowCards.length} líderes de cartões amarelos...`);
  
  // Get championships
  const { data: championships } = await supabase
    .from("championships")
    .select("id, name");
  
  let defaultChampionshipId = null;
  if (championships && championships.length > 0) {
    defaultChampionshipId = championships[0].id;
  }
  
  for (const cardLeader of yellowCards) {
    // Get the mapped player and team IDs
    const playerId = playersMap.get(cardLeader.playerId);
    const teamId = teamsMap.get(cardLeader.teamId);
    
    if (!playerId || !teamId) {
      console.error(`Jogador ou time não encontrado para o líder de cartões com ID ${cardLeader.id}`);
      continue;
    }
    
    // Map public data fields to admin panel fields
    const cardLeaderData = {
      player_id: playerId,
      team_id: teamId,
      yellow_cards: cardLeader.yellowCards || 0,
      category: cardLeader.category || "SUB-15",
      championship_id: defaultChampionshipId
    };
    
    // Check if yellow card leader already exists
    const { data: existingCardLeader } = await supabase
      .from("yellow_card_leaders")
      .select("id")
      .eq("player_id", playerId)
      .eq("team_id", teamId)
      .maybeSingle();
    
    if (!existingCardLeader) {
      // Insert yellow card leader
      const { data, error } = await supabase
        .from("yellow_card_leaders")
        .insert(cardLeaderData)
        .select();
      
      if (error) {
        console.error(`Erro ao inserir líder de cartões:`, error);
      } else {
        console.log(`Líder de cartões migrado com sucesso (id: ${data[0].id})`);
      }
    } else {
      console.log(`Líder de cartões já existe no Supabase (id: ${existingCardLeader.id})`);
      
      // Update yellow cards if needed
      const { error: updateError } = await supabase
        .from("yellow_card_leaders")
        .update({ yellow_cards: cardLeaderData.yellow_cards })
        .eq("id", existingCardLeader.id);
      
      if (!updateError) {
        console.log(`Cartões atualizados para o líder ${existingCardLeader.id}`);
      }
    }
  }
};
