
import { supabase } from "@/integrations/supabase/client";

/**
 * Migrate championships data to Supabase
 */
export const migrateChampionships = async (championships: any[]) => {
  try {
    console.log(`Migrando ${championships.length} campeonatos...`);
    
    for (const championship of championships) {
      // Map public data fields to admin panel fields
      const championshipData = {
        name: championship.name,
        year: championship.year || new Date().getFullYear().toString(),
        description: championship.description || "",
        location: championship.location || "Não especificado",
        categories: championship.categories || [],
        status: championship.status || "upcoming",
        start_date: championship.startDate || championship.start_date,
        end_date: championship.endDate || championship.end_date,
        banner_image: championship.bannerImage || championship.banner_image || null,
        organizer: championship.organizer || "Base Forte"
      };
      
      // Check if championship already exists by name and year
      const { data: existingChampionship } = await supabase
        .from("championships")
        .select("id")
        .eq("name", championshipData.name)
        .eq("year", championshipData.year)
        .maybeSingle();
      
      if (!existingChampionship) {
        // Insert championship
        const { data, error } = await supabase
          .from("championships")
          .insert(championshipData)
          .select();
        
        if (error) {
          console.error(`Erro ao inserir campeonato ${championshipData.name}:`, error);
        } else {
          console.log(`Campeonato ${championshipData.name} migrado com sucesso`);
        }
      } else {
        console.log(`Campeonato ${championshipData.name} já existe no Supabase (id: ${existingChampionship.id})`);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao migrar campeonatos:", error);
    return false;
  }
};
