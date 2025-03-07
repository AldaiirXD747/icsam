
import { supabase } from "@/integrations/supabase/client";

/**
 * Migrate players data to Supabase
 * Returns a map of old player IDs to new Supabase IDs
 */
export const migratePlayers = async (players: any[], teamsMap: Map<string, string>) => {
  try {
    console.log(`Migrando ${players.length} jogadores...`);
    const playersMap = new Map();
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    // Primeiro, vamos buscar os times e suas categorias para referência
    const { data: teams } = await supabase
      .from("teams")
      .select("id, name, category");
    
    const teamCategoryMap = new Map();
    if (teams) {
      teams.forEach(team => {
        teamCategoryMap.set(team.id, {
          name: team.name,
          category: team.category
        });
      });
    }
    
    for (const player of players) {
      // Skip if player is undefined or doesn't have required fields
      if (!player || !player.name) {
        console.log(`Pulando jogador indefinido ou sem nome`);
        skippedCount++;
        continue;
      }
      
      // Get the mapped team ID
      const teamId = teamsMap.get(player.teamId);
      
      if (!teamId) {
        console.error(`Time com ID ${player.teamId} não encontrado para o jogador ${player.name}`);
        skippedCount++;
        continue;
      }
      
      // Obter a categoria do time para o jogador
      const teamInfo = teamCategoryMap.get(teamId);
      
      // Map public data fields to admin panel fields
      const playerData = {
        name: player.name,
        position: player.position || "Não especificado",
        number: player.number || null,
        photo: player.photo || null,
        team_id: teamId,
        category: player.category || (teamInfo ? teamInfo.category : "SUB-15")
      };
      
      // Check if player already exists by name and team
      const { data: existingPlayer } = await supabase
        .from("players")
        .select("id, category")
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
          skippedCount++;
        } else {
          console.log(`Jogador ${playerData.name} migrado com sucesso na categoria ${playerData.category}`);
          migratedCount++;
          // Store mapping between old ID and new ID
          playersMap.set(player.id, data[0].id);
        }
      } else {
        console.log(`Jogador ${playerData.name} já existe no Supabase (id: ${existingPlayer.id}, categoria: ${existingPlayer.category})`);
        
        // Se a categoria estiver errada, atualizar
        if (existingPlayer.category !== playerData.category) {
          const { error: updateError } = await supabase
            .from("players")
            .update({ category: playerData.category })
            .eq("id", existingPlayer.id);
          
          if (!updateError) {
            console.log(`Categoria atualizada para o jogador ${playerData.name}: ${playerData.category}`);
          }
        }
        
        skippedCount++;
        // Store mapping between old ID and existing ID
        playersMap.set(player.id, existingPlayer.id);
      }
    }
    
    console.log(`Migração de jogadores concluída: ${migratedCount} migrados, ${skippedCount} pulados`);
    return playersMap;
  } catch (error) {
    console.error("Erro ao migrar jogadores:", error);
    return new Map();
  }
};
