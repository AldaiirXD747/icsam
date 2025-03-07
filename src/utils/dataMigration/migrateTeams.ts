
import { supabase } from "@/integrations/supabase/client";

/**
 * Migrate teams data to Supabase
 * Returns a map of old team IDs to new Supabase IDs
 */
export const migrateTeams = async (teams: any[]) => {
  try {
    console.log(`Migrando ${teams.length} times...`);
    const teamsMap = new Map();
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const team of teams) {
      // Skip if team is undefined or doesn't have required fields
      if (!team || !team.name) {
        console.log(`Pulando time indefinido ou sem nome`);
        skippedCount++;
        continue;
      }
      
      // Normalizar a categoria para o formato esperado
      let category = team.category || "SUB-15";
      // Se vier no formato de array, usar o primeiro item
      if (Array.isArray(team.category)) {
        category = team.category[0] || "SUB-15";
      }
      
      // Map public data fields to admin panel fields
      const teamData = {
        name: team.name,
        logo: team.logo || team.logoUrl || null,
        category: category,
        group_name: team.groupName || team.group_name || team.group || "Grupo A"
      };
      
      // Check if team already exists by name
      const { data: existingTeam } = await supabase
        .from("teams")
        .select("id, category")
        .eq("name", teamData.name)
        .maybeSingle();
      
      if (!existingTeam) {
        // Insert team
        const { data, error } = await supabase
          .from("teams")
          .insert(teamData)
          .select();
        
        if (error) {
          console.error(`Erro ao inserir time ${teamData.name}:`, error);
        } else {
          console.log(`Time ${teamData.name} (${teamData.category}) migrado com sucesso`);
          migratedCount++;
          // Store mapping between old ID and new ID
          teamsMap.set(team.id, data[0].id);
        }
      } else {
        console.log(`Time ${teamData.name} já existe no Supabase (id: ${existingTeam.id}, categoria: ${existingTeam.category})`);
        skippedCount++;
        // Store mapping between old ID and existing ID
        teamsMap.set(team.id, existingTeam.id);
        
        // Atualizar categoria e grupo se necessário
        if (existingTeam.category !== teamData.category) {
          const { error: updateError } = await supabase
            .from("teams")
            .update({
              category: teamData.category,
              group_name: teamData.group_name
            })
            .eq("id", existingTeam.id);
          
          if (!updateError) {
            console.log(`Categoria atualizada para o time ${teamData.name}: ${teamData.category}`);
          }
        }
      }
    }
    
    console.log(`Migração de times concluída: ${migratedCount} migrados, ${skippedCount} pulados`);
    return teamsMap;
  } catch (error) {
    console.error("Erro ao migrar times:", error);
    return new Map();
  }
};
