
import { supabase } from "@/integrations/supabase/client";
import { getTeams } from "@/lib/api"; // Import data from current API

/**
 * This utility script migrates existing hardcoded data to Supabase
 * It should be executed once to populate the database
 */
export const migrateDataToSupabase = async () => {
  try {
    console.log("Starting data migration to Supabase...");
    
    // Migrate teams data
    const teams = await getTeams();
    
    if (teams.length > 0) {
      for (const team of teams) {
        // Check if team already exists
        const { data: existingTeam } = await supabase
          .from("teams")
          .select("id")
          .eq("name", team.name)
          .single();
          
        if (!existingTeam) {
          // Insert team
          const { data, error } = await supabase
            .from("teams")
            .insert({
              name: team.name,
              description: team.description || "",
              logo: team.logoUrl || null,
              category: "SUB-15", // Default category if not available
              group_name: "Grupo A" // Default group if not available
            })
            .select();
            
          if (error) {
            console.error("Error inserting team:", error);
          } else {
            console.log(`Team ${team.name} migrated successfully`);
          }
        } else {
          console.log(`Team ${team.name} already exists in Supabase`);
        }
      }
    }
    
    // Add migration for championships
    const championships = [
      {
        name: "Campeonato Base Forte 2024",
        year: "2024",
        description: "Campeonato de futebol para categorias de base",
        location: "Brasília, DF",
        categories: ["SUB-11", "SUB-13", "SUB-15", "SUB-17"],
        status: "ongoing",
        start_date: "2024-01-15",
        end_date: "2024-12-10"
      },
      {
        name: "Copa Santa Maria",
        year: "2024",
        description: "Torneio regional de futebol de base",
        location: "Santa Maria, DF",
        categories: ["SUB-13", "SUB-15"],
        status: "upcoming",
        start_date: "2024-07-10",
        end_date: "2024-08-30"
      }
    ];
    
    for (const championship of championships) {
      // Check if championship already exists
      const { data: existingChampionship } = await supabase
        .from("championships")
        .select("id")
        .eq("name", championship.name)
        .eq("year", championship.year)
        .single();
        
      if (!existingChampionship) {
        // Insert championship
        const { data, error } = await supabase
          .from("championships")
          .insert({
            name: championship.name,
            year: championship.year,
            description: championship.description,
            location: championship.location,
            categories: championship.categories,
            status: championship.status,
            start_date: championship.start_date,
            end_date: championship.end_date
          })
          .select();
          
        if (error) {
          console.error("Error inserting championship:", error);
        } else {
          console.log(`Championship ${championship.name} migrated successfully`);
        }
      } else {
        console.log(`Championship ${championship.name} already exists in Supabase`);
      }
    }
    
    // Add migration for sample players
    const samplePlayers = [
      {
        name: "Pedro Silva",
        position: "Atacante",
        number: 10,
        team_name: "Time 1"
      },
      {
        name: "Lucas Oliveira",
        position: "Goleiro",
        number: 1,
        team_name: "Time 1"
      },
      {
        name: "João Santos",
        position: "Zagueiro",
        number: 4,
        team_name: "Time 2"
      }
    ];
    
    for (const player of samplePlayers) {
      // Find team ID
      const { data: teamData } = await supabase
        .from("teams")
        .select("id")
        .eq("name", player.team_name)
        .single();
        
      if (teamData) {
        // Check if player already exists
        const { data: existingPlayer } = await supabase
          .from("players")
          .select("id")
          .eq("name", player.name)
          .eq("team_id", teamData.id)
          .single();
          
        if (!existingPlayer) {
          // Insert player
          const { data, error } = await supabase
            .from("players")
            .insert({
              name: player.name,
              position: player.position,
              number: player.number,
              team_id: teamData.id
            })
            .select();
            
          if (error) {
            console.error("Error inserting player:", error);
          } else {
            console.log(`Player ${player.name} migrated successfully`);
          }
        } else {
          console.log(`Player ${player.name} already exists in Supabase`);
        }
      }
    }
    
    // Add sample matches
    const sampleMatches = [
      {
        date: "2024-06-15",
        time: "14:00:00",
        location: "Estádio Santa Maria",
        category: "SUB-15",
        status: "scheduled",
        championship_name: "Campeonato Base Forte 2024",
        home_team_name: "Time 1",
        away_team_name: "Time 2",
        round: "Fase de Grupos"
      },
      {
        date: "2024-06-22",
        time: "16:00:00",
        location: "Campo do Instituto",
        category: "SUB-13",
        status: "scheduled",
        championship_name: "Campeonato Base Forte 2024",
        home_team_name: "Time 2",
        away_team_name: "Time 1",
        round: "Fase de Grupos"
      }
    ];
    
    for (const match of sampleMatches) {
      // Find championship ID
      let championshipId = null;
      if (match.championship_name) {
        const { data: championshipData } = await supabase
          .from("championships")
          .select("id")
          .eq("name", match.championship_name)
          .single();
          
        if (championshipData) {
          championshipId = championshipData.id;
        }
      }
      
      // Find home team ID
      const { data: homeTeamData } = await supabase
        .from("teams")
        .select("id")
        .eq("name", match.home_team_name)
        .single();
        
      // Find away team ID
      const { data: awayTeamData } = await supabase
        .from("teams")
        .select("id")
        .eq("name", match.away_team_name)
        .single();
        
      if (homeTeamData && awayTeamData) {
        // Check if match already exists
        const { data: existingMatch } = await supabase
          .from("matches")
          .select("id")
          .eq("date", match.date)
          .eq("home_team", homeTeamData.id)
          .eq("away_team", awayTeamData.id)
          .single();
          
        if (!existingMatch) {
          // Insert match
          const { data, error } = await supabase
            .from("matches")
            .insert({
              date: match.date,
              time: match.time,
              location: match.location,
              category: match.category,
              status: match.status,
              championship_id: championshipId,
              home_team: homeTeamData.id,
              away_team: awayTeamData.id,
              round: match.round,
              home_score: null,
              away_score: null
            })
            .select();
            
          if (error) {
            console.error("Error inserting match:", error);
          } else {
            console.log(`Match between ${match.home_team_name} and ${match.away_team_name} migrated successfully`);
          }
        } else {
          console.log(`Match between ${match.home_team_name} and ${match.away_team_name} already exists in Supabase`);
        }
      }
    }
    
    // Add sample statistics - top scorers
    await migrateTopScorers();
    
    // Add sample statistics - yellow card leaders
    await migrateYellowCardLeaders();
    
    console.log("Data migration completed!");
  } catch (error) {
    console.error("Error during data migration:", error);
  }
};

// Helper function to migrate top scorers
const migrateTopScorers = async () => {
  try {
    const sampleTopScorers = [
      {
        player_name: "Pedro Silva",
        team_name: "Time 1",
        goals: 10,
        category: "SUB-15",
        championship_name: "Campeonato Base Forte 2024"
      },
      {
        player_name: "João Santos",
        team_name: "Time 2",
        goals: 7,
        category: "SUB-15",
        championship_name: "Campeonato Base Forte 2024"
      }
    ];
    
    for (const scorer of sampleTopScorers) {
      // Find championship ID
      let championshipId = null;
      if (scorer.championship_name) {
        const { data: championshipData } = await supabase
          .from("championships")
          .select("id")
          .eq("name", scorer.championship_name)
          .single();
          
        if (championshipData) {
          championshipId = championshipData.id;
        }
      }
      
      // Find team ID
      const { data: teamData } = await supabase
        .from("teams")
        .select("id")
        .eq("name", scorer.team_name)
        .single();
        
      if (teamData) {
        // Find player ID
        const { data: playerData } = await supabase
          .from("players")
          .select("id")
          .eq("name", scorer.player_name)
          .eq("team_id", teamData.id)
          .single();
          
        if (playerData) {
          // Check if top scorer record already exists
          const { data: existingScorer } = await supabase
            .from("top_scorers")
            .select("id")
            .eq("player_id", playerData.id)
            .eq("team_id", teamData.id)
            .eq("championship_id", championshipId)
            .single();
            
          if (!existingScorer) {
            // Insert top scorer
            const { data, error } = await supabase
              .from("top_scorers")
              .insert({
                player_id: playerData.id,
                team_id: teamData.id,
                goals: scorer.goals,
                category: scorer.category,
                championship_id: championshipId
              })
              .select();
              
            if (error) {
              console.error("Error inserting top scorer:", error);
            } else {
              console.log(`Top scorer ${scorer.player_name} migrated successfully`);
            }
          } else {
            console.log(`Top scorer ${scorer.player_name} already exists in Supabase`);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error migrating top scorers:", error);
  }
};

// Helper function to migrate yellow card leaders
const migrateYellowCardLeaders = async () => {
  try {
    const sampleCardLeaders = [
      {
        player_name: "Lucas Oliveira",
        team_name: "Time 1",
        yellow_cards: 3,
        category: "SUB-15",
        championship_name: "Campeonato Base Forte 2024"
      },
      {
        player_name: "João Santos",
        team_name: "Time 2",
        yellow_cards: 2,
        category: "SUB-15",
        championship_name: "Campeonato Base Forte 2024"
      }
    ];
    
    for (const cardLeader of sampleCardLeaders) {
      // Find championship ID
      let championshipId = null;
      if (cardLeader.championship_name) {
        const { data: championshipData } = await supabase
          .from("championships")
          .select("id")
          .eq("name", cardLeader.championship_name)
          .single();
          
        if (championshipData) {
          championshipId = championshipData.id;
        }
      }
      
      // Find team ID
      const { data: teamData } = await supabase
        .from("teams")
        .select("id")
        .eq("name", cardLeader.team_name)
        .single();
        
      if (teamData) {
        // Find player ID
        const { data: playerData } = await supabase
          .from("players")
          .select("id")
          .eq("name", cardLeader.player_name)
          .eq("team_id", teamData.id)
          .single();
          
        if (playerData) {
          // Check if yellow card leader record already exists
          const { data: existingCardLeader } = await supabase
            .from("yellow_card_leaders")
            .select("id")
            .eq("player_id", playerData.id)
            .eq("team_id", teamData.id)
            .eq("championship_id", championshipId)
            .single();
            
          if (!existingCardLeader) {
            // Insert yellow card leader
            const { data, error } = await supabase
              .from("yellow_card_leaders")
              .insert({
                player_id: playerData.id,
                team_id: teamData.id,
                yellow_cards: cardLeader.yellow_cards,
                category: cardLeader.category,
                championship_id: championshipId
              })
              .select();
              
            if (error) {
              console.error("Error inserting yellow card leader:", error);
            } else {
              console.log(`Yellow card leader ${cardLeader.player_name} migrated successfully`);
            }
          } else {
            console.log(`Yellow card leader ${cardLeader.player_name} already exists in Supabase`);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error migrating yellow card leaders:", error);
  }
};
