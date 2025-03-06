
import { supabase } from "@/integrations/supabase/client";

/**
 * Migrate players data to Supabase
 * Returns a map of old player IDs to new Supabase IDs
 */
export const migratePlayers = async (players: any[], teamsMap: Map<string, string>) => {
  try {
    console.log(`Migrando ${players.length} jogadores...`);
    const playersMap = new Map();
    
    for (const player of players) {
      // Get the mapped team ID
      const teamId = teamsMap.get(player.teamId);
      
      if (!teamId) {
        console.error(`Time com ID ${player.teamId} não encontrado para o jogador ${player.name}`);
        continue;
      }
      
      // Map public data fields to admin panel fields
      const playerData = {
        name: player.name,
        position: player.position || "Não especificado",
        number: player.number || null,
        photo: player.photo || null,
        team_id: teamId
      };
      
      // Check if player already exists by name and team
      const { data: existingPlayer } = await supabase
        .from("players")
        .select("id")
        .eq("name", playerData.name)
        .eq("team_id", teamId)
        .maybeSingle();
      
      if (!existingPlayer) {
        // Insert player
        const { data, error } = await supabase
          .from("players")
          .insert(playerData)
          .select();
        
        if (error) {
          console.error(`Erro ao inserir jogador ${playerData.name}:`, error);
        } else {
          console.log(`Jogador ${playerData.name} migrado com sucesso`);
          // Store mapping between old ID and new ID
          playersMap.set(player.id, data[0].id);
        }
      } else {
        console.log(`Jogador ${playerData.name} já existe no Supabase (id: ${existingPlayer.id})`);
        // Store mapping between old ID and existing ID
        playersMap.set(player.id, existingPlayer.id);
      }
    }
    
    return playersMap;
  } catch (error) {
    console.error("Erro ao migrar jogadores:", error);
    return new Map();
  }
};
