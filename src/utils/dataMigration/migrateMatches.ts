
import { supabase } from "@/integrations/supabase/client";

/**
 * Migrate matches data to Supabase
 */
export const migrateMatches = async (matches: any[], teamsMap: Map<string, string>) => {
  try {
    console.log(`Migrando ${matches.length} partidas...`);
    let migratedCount = 0;
    let skippedCount = 0;
    let updatedCount = 0;
    
    // Get championships
    const { data: championships } = await supabase
      .from("championships")
      .select("id, name");
    
    const championshipsMap = new Map();
    if (championships) {
      championships.forEach(champ => {
        championshipsMap.set(champ.name, champ.id);
      });
    }
    
    for (const match of matches) {
      // Skip if match is undefined or doesn't have required fields
      if (!match || (!match.homeTeamId && !match.home_team_id) || (!match.awayTeamId && !match.away_team_id)) {
        console.log(`Pulando partida indefinida ou sem times`);
        skippedCount++;
        continue;
      }
      
      // Get the mapped team IDs
      const homeTeamId = teamsMap.get(match.homeTeamId || match.home_team_id);
      const awayTeamId = teamsMap.get(match.awayTeamId || match.away_team_id);
      
      if (!homeTeamId || !awayTeamId) {
        console.error(`Times não encontrados para a partida entre ${match.homeTeamId || match.home_team_id} e ${match.awayTeamId || match.away_team_id}`);
        skippedCount++;
        continue;
      }
      
      // Find championship ID
      let championshipId = null;
      if (match.championshipId || match.championship_id || match.championshipName || match.championship_name) {
        const champKey = match.championshipId || match.championship_id || match.championshipName || match.championship_name;
        // Try to use the mapped ID first
        if (championshipsMap.has(champKey)) {
          championshipId = championshipsMap.get(champKey);
        } else {
          // If can't find by ID or name, get the first championship ID as fallback
          championshipId = championships && championships.length > 0 ? championships[0].id : null;
        }
      }
      
      // Determinar a categoria a partir dos times
      let category = match.category || "SUB-15";
      
      // Se não tiver categoria, tentar inferir dos times
      if (!category || category === "SUB-15") {
        // Buscar informações dos times para inferir a categoria
        const { data: homeTeam } = await supabase
          .from("teams")
          .select("category")
          .eq("id", homeTeamId)
          .single();
        
        if (homeTeam) {
          category = homeTeam.category;
        }
      }
      
      // Map public data fields to admin panel fields
      const matchData = {
        date: match.date || new Date().toISOString().split('T')[0],
        time: match.time || "15:00:00",
        location: match.location || match.place || "Não especificado",
        category: category,
        status: match.status || "scheduled",
        championship_id: championshipId,
        home_team: homeTeamId,
        away_team: awayTeamId,
        home_score: match.homeScore !== undefined ? match.homeScore : match.home_score,
        away_score: match.awayScore !== undefined ? match.awayScore : match.away_score,
        round: match.round || match.phase || "Fase de Grupos"
      };
      
      // Check if match already exists with same teams and date
      const { data: existingMatches } = await supabase
        .from("matches")
        .select("id, status, home_score, away_score")
        .eq("date", matchData.date)
        .eq("home_team", homeTeamId)
        .eq("away_team", awayTeamId);
      
      if (!existingMatches || existingMatches.length === 0) {
        // Insert match
        const { data, error } = await supabase
          .from("matches")
          .insert(matchData)
          .select();
        
        if (error) {
          console.error(`Erro ao inserir partida entre times ${homeTeamId} e ${awayTeamId}:`, error);
          skippedCount++;
        } else {
          console.log(`Partida entre times migrada com sucesso (id: ${data[0].id})`);
          migratedCount++;
          
          // If match has scores, add goals too
          if ((matchData.home_score > 0 || matchData.away_score > 0) && matchData.status === "completed") {
            await addDummyGoals(data[0].id, homeTeamId, awayTeamId, matchData.home_score, matchData.away_score);
          }
        }
      } else {
        console.log(`Partida já existe no Supabase (id: ${existingMatches[0].id})`);
        
        // Update scores if match exists and scores or status changed
        const existingMatch = existingMatches[0];
        if (matchData.home_score !== existingMatch.home_score || 
            matchData.away_score !== existingMatch.away_score ||
            matchData.status !== existingMatch.status) {
          
          const { error: updateError } = await supabase
            .from("matches")
            .update({
              home_score: matchData.home_score,
              away_score: matchData.away_score,
              status: matchData.status
            })
            .eq("id", existingMatch.id);
          
          if (!updateError) {
            console.log(`Placar atualizado para a partida ${existingMatch.id}`);
            updatedCount++;
          }
        } else {
          skippedCount++;
        }
      }
    }
    
    console.log(`Migração de partidas concluída: ${migratedCount} migradas, ${updatedCount} atualizadas, ${skippedCount} puladas`);
    return true;
  } catch (error) {
    console.error("Erro ao migrar partidas:", error);
    return false;
  }
};

/**
 * Add dummy goals for matches with scores
 */
export const addDummyGoals = async (matchId: string, homeTeamId: string, awayTeamId: string, homeScore: number, awayScore: number) => {
  try {
    // Primeiro, verificar se já existem gols para esta partida
    const { data: existingGoals } = await supabase
      .from("goals")
      .select("id")
      .eq("match_id", matchId);
    
    if (existingGoals && existingGoals.length > 0) {
      console.log(`Já existem ${existingGoals.length} gols registrados para a partida ${matchId}`);
      return;
    }
    
    // Get players from each team
    const { data: homePlayers } = await supabase
      .from("players")
      .select("id")
      .eq("team_id", homeTeamId);
    
    const { data: awayPlayers } = await supabase
      .from("players")
      .select("id")
      .eq("team_id", awayTeamId);
    
    if (!homePlayers || !awayPlayers) return;
    
    // Add home team goals
    if (homeScore > 0 && homePlayers.length > 0) {
      for (let i = 0; i < homeScore; i++) {
        const randomPlayer = homePlayers[Math.floor(Math.random() * homePlayers.length)];
        
        const { error } = await supabase.from("goals").insert({
          match_id: matchId,
          team_id: homeTeamId,
          player_id: randomPlayer.id,
          minute: Math.floor(Math.random() * 90) + 1,
          half: Math.random() > 0.5 ? "first" : "second"
        });
        
        if (error) {
          console.error(`Erro ao adicionar gol para o time da casa:`, error);
        }
      }
    }
    
    // Add away team goals
    if (awayScore > 0 && awayPlayers.length > 0) {
      for (let i = 0; i < awayScore; i++) {
        const randomPlayer = awayPlayers[Math.floor(Math.random() * awayPlayers.length)];
        
        const { error } = await supabase.from("goals").insert({
          match_id: matchId,
          team_id: awayTeamId,
          player_id: randomPlayer.id,
          minute: Math.floor(Math.random() * 90) + 1,
          half: Math.random() > 0.5 ? "first" : "second"
        });
        
        if (error) {
          console.error(`Erro ao adicionar gol para o time visitante:`, error);
        }
      }
    }
    
    console.log(`Gols simulados adicionados com sucesso: ${homeScore} para casa, ${awayScore} para visitante`);
  } catch (error) {
    console.error("Erro ao adicionar gols:", error);
  }
};
