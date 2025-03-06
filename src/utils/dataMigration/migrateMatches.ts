
import { supabase } from "@/integrations/supabase/client";

/**
 * Migrate matches data to Supabase
 */
export const migrateMatches = async (matches: any[], teamsMap: Map<string, string>) => {
  try {
    console.log(`Migrando ${matches.length} partidas...`);
    
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
      // Get the mapped team IDs
      const homeTeamId = teamsMap.get(match.homeTeamId);
      const awayTeamId = teamsMap.get(match.awayTeamId);
      
      if (!homeTeamId || !awayTeamId) {
        console.error(`Times não encontrados para a partida entre ${match.homeTeamId} e ${match.awayTeamId}`);
        continue;
      }
      
      // Find championship ID
      let championshipId = null;
      if (match.championshipId) {
        // Try to use the mapped ID first
        if (championshipsMap.has(match.championshipId)) {
          championshipId = championshipsMap.get(match.championshipId);
        } else if (championshipsMap.has(match.championshipName)) {
          // Try by name if ID doesn't work
          championshipId = championshipsMap.get(match.championshipName);
        } else {
          // If can't find by ID or name, get the first championship ID as fallback
          championshipId = championships && championships.length > 0 ? championships[0].id : null;
        }
      }
      
      // Map public data fields to admin panel fields
      const matchData = {
        date: match.date || new Date().toISOString().split('T')[0],
        time: match.time || "15:00:00",
        location: match.location || "Não especificado",
        category: match.category || "SUB-15",
        status: match.status || "scheduled",
        championship_id: championshipId,
        home_team: homeTeamId,
        away_team: awayTeamId,
        home_score: match.homeScore !== undefined ? match.homeScore : match.home_score,
        away_score: match.awayScore !== undefined ? match.awayScore : match.away_score,
        round: match.round || "Fase de Grupos"
      };
      
      // Check if match already exists with same teams and date
      const { data: existingMatch } = await supabase
        .from("matches")
        .select("id")
        .eq("date", matchData.date)
        .eq("home_team", homeTeamId)
        .eq("away_team", awayTeamId)
        .maybeSingle();
      
      if (!existingMatch) {
        // Insert match
        const { data, error } = await supabase
          .from("matches")
          .insert(matchData)
          .select();
        
        if (error) {
          console.error(`Erro ao inserir partida entre times ${homeTeamId} e ${awayTeamId}:`, error);
        } else {
          console.log(`Partida entre times migrada com sucesso (id: ${data[0].id})`);
          
          // If match has scores, add goals too
          if (matchData.home_score > 0 || matchData.away_score > 0) {
            await addDummyGoals(data[0].id, homeTeamId, awayTeamId, matchData.home_score, matchData.away_score);
          }
        }
      } else {
        console.log(`Partida já existe no Supabase (id: ${existingMatch.id})`);
        
        // Update scores if match exists
        if (matchData.home_score !== null || matchData.away_score !== null) {
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
          }
        }
      }
    }
    
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
        
        await supabase.from("goals").insert({
          match_id: matchId,
          team_id: homeTeamId,
          player_id: randomPlayer.id,
          minute: Math.floor(Math.random() * 90) + 1,
          half: Math.random() > 0.5 ? "first" : "second"
        });
      }
    }
    
    // Add away team goals
    if (awayScore > 0 && awayPlayers.length > 0) {
      for (let i = 0; i < awayScore; i++) {
        const randomPlayer = awayPlayers[Math.floor(Math.random() * awayPlayers.length)];
        
        await supabase.from("goals").insert({
          match_id: matchId,
          team_id: awayTeamId,
          player_id: randomPlayer.id,
          minute: Math.floor(Math.random() * 90) + 1,
          half: Math.random() > 0.5 ? "first" : "second"
        });
      }
    }
  } catch (error) {
    console.error("Erro ao adicionar gols:", error);
  }
};
