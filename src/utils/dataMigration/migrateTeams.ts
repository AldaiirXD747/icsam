
import { supabase } from "@/integrations/supabase/client";

/**
 * Migrate teams data to Supabase
 * Returns a map of old team IDs to new Supabase IDs
 */
export const migrateTeams = async (teams: any[]) => {
  try {
    console.log(`Migrando ${teams.length} times...`);
    const teamsMap = new Map();
    
    for (const team of teams) {
      // Map public data fields to admin panel fields
      const teamData = {
        name: team.name,
        logo: team.logo || team.logoUrl || null,
        category: team.category || "SUB-15",
        group_name: team.groupName || team.group_name || "Grupo A"
      };
      
      // Check if team already exists by name
      const { data: existingTeam } = await supabase
        .from("teams")
        .select("id")
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
          console.log(`Time ${teamData.name} migrado com sucesso`);
          // Store mapping between old ID and new ID
          teamsMap.set(team.id, data[0].id);
        }
      } else {
        console.log(`Time ${teamData.name} já existe no Supabase (id: ${existingTeam.id})`);
        // Store mapping between old ID and existing ID
        teamsMap.set(team.id, existingTeam.id);
      }
    }
    
    return teamsMap;
  } catch (error) {
    console.error("Erro ao migrar times:", error);
    return new Map();
  }
};
