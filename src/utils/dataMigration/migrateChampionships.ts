
import { supabase } from "@/integrations/supabase/client";

/**
 * Migrate championships data to Supabase
 */
export const migrateChampionships = async (championships: any[]) => {
  try {
    console.log(`Migrando ${championships.length} campeonatos...`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const championship of championships) {
      // Skip if championship is undefined or doesn't have required fields
      if (!championship || !championship.name) {
        console.log(`Pulando campeonato indefinido ou sem nome`);
        skippedCount++;
        continue;
      }
      
      // Map public data fields to admin panel fields
      const championshipData = {
        name: championship.name,
        year: championship.year || new Date().getFullYear().toString(),
        description: championship.description || "",
        location: championship.location || "Não especificado",
        categories: championship.categories || [],
        status: championship.status || "upcoming",
        start_date: championship.startDate || championship.start_date || new Date().toISOString().split('T')[0],
        end_date: championship.endDate || championship.end_date || new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
        banner_image: championship.bannerImage || championship.banner_image || null,
        organizer: championship.organizer || "Base Forte"
      };
      
      // Validate required fields
      if (!championshipData.name || !championshipData.start_date || !championshipData.end_date || !championshipData.location) {
        console.log(`Pulando campeonato com dados incompletos: ${championshipData.name || 'Sem nome'}`);
        skippedCount++;
        continue;
      }
      
      try {
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
            migratedCount++;
          }
        } else {
          console.log(`Campeonato ${championshipData.name} já existe no Supabase (id: ${existingChampionship.id})`);
          skippedCount++;
        }
      } catch (error) {
        console.error(`Erro ao processar campeonato ${championshipData.name || 'Sem nome'}:`, error);
      }
    }
    
    console.log(`Migração de campeonatos concluída: ${migratedCount} migrados, ${skippedCount} pulados`);
    return true;
  } catch (error) {
    console.error("Erro ao migrar campeonatos:", error);
    return false;
  }
};
