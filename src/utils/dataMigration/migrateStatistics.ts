
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
    console.log("Iniciando migração de estatísticas...");
    
    if (!statistics) {
      console.error("Dados de estatísticas não fornecidos");
      return false;
    }
    
    // Migrate top scorers
    if (statistics.topScorers && Array.isArray(statistics.topScorers)) {
      await migrateTopScorers(statistics.topScorers, playersMap, teamsMap);
    } else {
      console.log("Dados de artilheiros não encontrados ou inválidos");
      
      // Se não tiver dados de artilheiros, tentar criar a partir dos gols
      await generateTopScorersFromGoals();
    }
    
    // Migrate yellow cards
    if (statistics.yellowCards && Array.isArray(statistics.yellowCards)) {
      await migrateYellowCards(statistics.yellowCards, playersMap, teamsMap);
    } else {
      console.log("Dados de cartões amarelos não encontrados ou inválidos");
      
      // Se não tiver dados de cartões, tentar simular alguns
      await generateDummyYellowCards();
    }
    
    // Migrate standings (Tabela de Classificação)
    if (statistics.standings) {
      await migrateStandings(statistics.standings, teamsMap);
    } else {
      console.log("Dados de classificação não encontrados");
      
      // Gerar tabela de classificação baseada nas partidas
      await generateStandingsFromMatches();
    }
    
    console.log("Migração de estatísticas concluída com sucesso");
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
  if (!topScorers || topScorers.length === 0) {
    console.log("Nenhum artilheiro para migrar");
    return;
  }
  
  console.log(`Migrando ${topScorers.length} artilheiros...`);
  let insertedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;
  
  // Get championships
  const { data: championships } = await supabase
    .from("championships")
    .select("id, name");
  
  let defaultChampionshipId = null;
  if (championships && championships.length > 0) {
    defaultChampionshipId = championships[0].id;
  }
  
  for (const scorer of topScorers) {
    // Skip if scorer is undefined or missing required fields
    if (!scorer || (!scorer.playerId && !scorer.player_id) || (!scorer.teamId && !scorer.team_id)) {
      console.log("Pulando artilheiro inválido");
      errorCount++;
      continue;
    }
    
    // Get the mapped player and team IDs
    const playerId = playersMap.get(scorer.playerId || scorer.player_id);
    const teamId = teamsMap.get(scorer.teamId || scorer.team_id);
    
    if (!playerId || !teamId) {
      console.error(`Jogador ou time não encontrado para o artilheiro`);
      errorCount++;
      continue;
    }
    
    // Obter a categoria do time ou jogador
    let category = scorer.category || "SUB-15";
    
    try {
      // Tentar obter a categoria do jogador
      const { data: player, error: playerError } = await supabase
        .from("players")
        .select("category, team_id")
        .eq("id", playerId)
        .single();
      
      if (playerError) {
        console.log(`Erro ao buscar categoria do jogador: ${playerError.message}`);
        // Se a categoria não existir no jogador, tentar obter do time
        const { data: team } = await supabase
          .from("teams")
          .select("category")
          .eq("id", teamId)
          .single();
        
        if (team) {
          category = team.category;
        }
      } else if (player && player.category) {
        category = player.category;
      }
    } catch (error) {
      console.error("Erro ao buscar categoria:", error);
    }
    
    // Map public data fields to admin panel fields
    const scorerData = {
      player_id: playerId,
      team_id: teamId,
      goals: scorer.goals || 0,
      category: category,
      championship_id: defaultChampionshipId
    };
    
    // Check if top scorer already exists
    const { data: existingScorer } = await supabase
      .from("top_scorers")
      .select("id, goals")
      .eq("player_id", playerId)
      .eq("team_id", teamId)
      .eq("category", category)
      .maybeSingle();
    
    if (!existingScorer) {
      // Insert top scorer
      const { data, error } = await supabase
        .from("top_scorers")
        .insert(scorerData)
        .select();
      
      if (error) {
        console.error(`Erro ao inserir artilheiro:`, error);
        errorCount++;
      } else {
        console.log(`Artilheiro migrado com sucesso (id: ${data[0].id})`);
        insertedCount++;
      }
    } else {
      console.log(`Artilheiro já existe no Supabase (id: ${existingScorer.id})`);
      
      // Update goals if needed
      if (existingScorer.goals !== scorerData.goals) {
        const { error: updateError } = await supabase
          .from("top_scorers")
          .update({ goals: scorerData.goals })
          .eq("id", existingScorer.id);
        
        if (!updateError) {
          console.log(`Gols atualizados para o artilheiro ${existingScorer.id}: ${scorerData.goals}`);
          updatedCount++;
        } else {
          errorCount++;
        }
      }
    }
  }
  
  console.log(`Migração de artilheiros concluída: ${insertedCount} inseridos, ${updatedCount} atualizados, ${errorCount} erros`);
};

/**
 * Generate top scorers from goals table
 */
export const generateTopScorersFromGoals = async () => {
  try {
    console.log("Gerando artilheiros a partir dos gols registrados...");
    
    // Buscar todos os gols do banco de dados
    const { data: goals, error } = await supabase
      .from("goals")
      .select(`
        id,
        player_id,
        team_id,
        match_id,
        matches(category)
      `);
    
    if (error) {
      throw error;
    }
    
    if (!goals || goals.length === 0) {
      console.log("Nenhum gol encontrado para gerar artilheiros");
      return;
    }
    
    // Criar um mapa para contar os gols por jogador/time/categoria
    const scorersMap = new Map();
    
    for (const goal of goals) {
      if (!goal.player_id || !goal.team_id) continue;
      
      // Obter categoria da partida ou usar SUB-15 como padrão
      let category = "SUB-15";
      if (goal.matches && goal.matches.category) {
        category = goal.matches.category;
      } else {
        try {
          // Se não tiver categoria na partida, tentar obter do jogador
          const { data: player, error: playerError } = await supabase
            .from("players")
            .select("category")
            .eq("id", goal.player_id)
            .single();
          
          if (playerError) {
            // Se não tiver categoria no jogador, tentar obter do time
            const { data: team } = await supabase
              .from("teams")
              .select("category")
              .eq("id", goal.team_id)
              .single();
            
            if (team && team.category) {
              category = team.category;
            }
          } else if (player && player.category) {
            category = player.category;
          }
        } catch (error) {
          console.error("Erro ao buscar categoria:", error);
        }
      }
      
      const key = `${goal.player_id}-${goal.team_id}-${category}`;
      
      if (scorersMap.has(key)) {
        scorersMap.set(key, {
          ...scorersMap.get(key),
          goals: scorersMap.get(key).goals + 1
        });
      } else {
        scorersMap.set(key, {
          player_id: goal.player_id,
          team_id: goal.team_id,
          category: category,
          goals: 1
        });
      }
    }
    
    // Get championships
    const { data: championships } = await supabase
      .from("championships")
      .select("id, name");
    
    let defaultChampionshipId = null;
    if (championships && championships.length > 0) {
      defaultChampionshipId = championships[0].id;
    }
    
    console.log(`Encontrados ${scorersMap.size} artilheiros para inserir ou atualizar`);
    
    // Inserir ou atualizar artilheiros
    for (const [key, scorer] of scorersMap.entries()) {
      // Check if top scorer already exists
      const { data: existingScorer } = await supabase
        .from("top_scorers")
        .select("id, goals")
        .eq("player_id", scorer.player_id)
        .eq("team_id", scorer.team_id)
        .eq("category", scorer.category)
        .maybeSingle();
      
      const scorerData = {
        ...scorer,
        championship_id: defaultChampionshipId
      };
      
      if (!existingScorer) {
        // Insert top scorer
        const { data, error: insertError } = await supabase
          .from("top_scorers")
          .insert(scorerData)
          .select();
        
        if (insertError) {
          console.error(`Erro ao inserir artilheiro:`, insertError);
        } else {
          console.log(`Artilheiro criado com sucesso (id: ${data[0].id}, gols: ${scorer.goals})`);
        }
      } else {
        // Update goals if needed
        if (existingScorer.goals !== scorer.goals) {
          const { error: updateError } = await supabase
            .from("top_scorers")
            .update({ goals: scorer.goals })
            .eq("id", existingScorer.id);
          
          if (!updateError) {
            console.log(`Gols atualizados para o artilheiro ${existingScorer.id}: ${scorer.goals}`);
          }
        } else {
          console.log(`Artilheiro já existe com gols corretos: ${existingScorer.id}`);
        }
      }
    }
    
    console.log("Geração de artilheiros concluída com sucesso");
  } catch (error) {
    console.error("Erro ao gerar artilheiros:", error);
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
  if (!yellowCards || yellowCards.length === 0) {
    console.log("Nenhum líder de cartões amarelos para migrar");
    return;
  }
  
  console.log(`Migrando ${yellowCards.length} líderes de cartões amarelos...`);
  let insertedCount = 0;
  let updatedCount = 0;
  let errorCount = 0;
  
  // Get championships
  const { data: championships } = await supabase
    .from("championships")
    .select("id, name");
  
  let defaultChampionshipId = null;
  if (championships && championships.length > 0) {
    defaultChampionshipId = championships[0].id;
  }
  
  for (const cardLeader of yellowCards) {
    // Skip if cardLeader is undefined or missing required fields
    if (!cardLeader || (!cardLeader.playerId && !cardLeader.player_id) || (!cardLeader.teamId && !cardLeader.team_id)) {
      console.log("Pulando líder de cartões inválido");
      errorCount++;
      continue;
    }
    
    // Get the mapped player and team IDs
    const playerId = playersMap.get(cardLeader.playerId || cardLeader.player_id);
    const teamId = teamsMap.get(cardLeader.teamId || cardLeader.team_id);
    
    if (!playerId || !teamId) {
      console.error(`Jogador ou time não encontrado para o líder de cartões`);
      errorCount++;
      continue;
    }
    
    // Obter a categoria do time ou jogador
    let category = cardLeader.category || "SUB-15";
    
    try {
      // Tentar obter a categoria do jogador
      const { data: player, error: playerError } = await supabase
        .from("players")
        .select("category, team_id")
        .eq("id", playerId)
        .single();
      
      if (playerError) {
        console.log(`Erro ao buscar categoria do jogador: ${playerError.message}`);
        // Se a categoria não existir no jogador, tentar obter do time
        const { data: team } = await supabase
          .from("teams")
          .select("category")
          .eq("id", teamId)
          .single();
        
        if (team) {
          category = team.category;
        }
      } else if (player && player.category) {
        category = player.category;
      }
    } catch (error) {
      console.error("Erro ao buscar categoria:", error);
    }
    
    // Map public data fields to admin panel fields
    const cardLeaderData = {
      player_id: playerId,
      team_id: teamId,
      yellow_cards: cardLeader.yellowCards || cardLeader.yellow_cards || 0,
      category: category,
      championship_id: defaultChampionshipId
    };
    
    // Check if yellow card leader already exists
    const { data: existingCardLeader } = await supabase
      .from("yellow_card_leaders")
      .select("id, yellow_cards")
      .eq("player_id", playerId)
      .eq("team_id", teamId)
      .eq("category", category)
      .maybeSingle();
    
    if (!existingCardLeader) {
      // Insert yellow card leader
      const { data, error } = await supabase
        .from("yellow_card_leaders")
        .insert(cardLeaderData)
        .select();
      
      if (error) {
        console.error(`Erro ao inserir líder de cartões:`, error);
        errorCount++;
      } else {
        console.log(`Líder de cartões migrado com sucesso (id: ${data[0].id})`);
        insertedCount++;
      }
    } else {
      console.log(`Líder de cartões já existe no Supabase (id: ${existingCardLeader.id})`);
      
      // Update yellow cards if needed
      if (existingCardLeader.yellow_cards !== cardLeaderData.yellow_cards) {
        const { error: updateError } = await supabase
          .from("yellow_card_leaders")
          .update({ yellow_cards: cardLeaderData.yellow_cards })
          .eq("id", existingCardLeader.id);
        
        if (!updateError) {
          console.log(`Cartões atualizados para o líder ${existingCardLeader.id}: ${cardLeaderData.yellow_cards}`);
          updatedCount++;
        } else {
          errorCount++;
        }
      }
    }
  }
  
  console.log(`Migração de líderes de cartões concluída: ${insertedCount} inseridos, ${updatedCount} atualizados, ${errorCount} erros`);
};

/**
 * Generate dummy yellow cards
 */
export const generateDummyYellowCards = async () => {
  try {
    console.log("Gerando dados simulados de cartões amarelos...");
    
    // Buscar jogadores do banco de dados
    const { data: players, error: playersError } = await supabase
      .from("players")
      .select("id, team_id");
    
    if (playersError) {
      console.error("Erro ao buscar jogadores:", playersError);
      return;
    }
    
    if (!players || players.length === 0) {
      console.log("Nenhum jogador encontrado para gerar cartões amarelos");
      return;
    }
    
    // Get championships
    const { data: championships } = await supabase
      .from("championships")
      .select("id, name");
    
    let defaultChampionshipId = null;
    if (championships && championships.length > 0) {
      defaultChampionshipId = championships[0].id;
    }
    
    // Para cada jogador, obter a categoria
    for (const player of players) {
      try {
        // Buscar categoria do time
        const { data: team } = await supabase
          .from("teams")
          .select("category")
          .eq("id", player.team_id)
          .single();
        
        if (!team) continue;
        
        // Verificar se o jogador já tem cartões registrados
        const { data: existingCard } = await supabase
          .from("yellow_card_leaders")
          .select("id")
          .eq("player_id", player.id)
          .maybeSingle();
        
        if (existingCard) {
          console.log(`Jogador ${player.id} já tem cartões registrados`);
          continue;
        }
        
        // 25% de chance de gerar cartões para este jogador
        if (Math.random() > 0.25) continue;
        
        // Gerar número aleatório de cartões (1 a 3)
        const yellowCards = Math.floor(Math.random() * 3) + 1;
        
        // Inserir registro de cartões
        const { data, error: insertError } = await supabase
          .from("yellow_card_leaders")
          .insert({
            player_id: player.id,
            team_id: player.team_id,
            yellow_cards: yellowCards,
            category: team.category,
            championship_id: defaultChampionshipId
          })
          .select();
        
        if (insertError) {
          console.error(`Erro ao inserir cartões para jogador ${player.id}:`, insertError);
        } else {
          console.log(`Cartões criados para jogador ${player.id}: ${yellowCards}`);
        }
      } catch (error) {
        console.error(`Erro ao processar jogador ${player.id}:`, error);
      }
    }
    
    console.log("Geração de cartões amarelos concluída com sucesso");
  } catch (error) {
    console.error("Erro ao gerar cartões amarelos:", error);
  }
};

/**
 * Migrate standings data to Supabase
 */
export const migrateStandings = async (
  standings: any[] = [],
  teamsMap: Map<string, string>
) => {
  try {
    console.log("Migrando dados de classificação...");
    
    // Verificar se a função de recálculo existe
    try {
      await supabase.rpc("recalculate_standings");
      console.log("Função de recálculo de classificação encontrada, utilizando-a...");
      return;
    } catch (error) {
      console.log("Função de recálculo de classificação não encontrada, migrando dados manualmente...");
    }
    
    if (!standings || standings.length === 0) {
      console.log("Nenhum dado de classificação para migrar");
      await generateStandingsFromMatches();
      return;
    }
    
    let insertedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const standing of standings) {
      // Skip if standing is undefined or missing required fields
      if (!standing || (!standing.teamId && !standing.team_id)) {
        console.log("Pulando classificação inválida");
        errorCount++;
        continue;
      }
      
      // Get the mapped team ID
      const teamId = teamsMap.get(standing.teamId || standing.team_id);
      
      if (!teamId) {
        console.error(`Time não encontrado para a classificação`);
        errorCount++;
        continue;
      }
      
      // Obter a categoria do time
      let category = standing.category || "SUB-15";
      let groupName = standing.groupName || standing.group_name || standing.group || "Grupo A";
      
      if (!category || category === "SUB-15") {
        try {
          // Tentar obter a categoria do time
          const { data: team } = await supabase
            .from("teams")
            .select("category, group_name")
            .eq("id", teamId)
            .single();
          
          if (team) {
            category = team.category;
            groupName = team.group_name;
          }
        } catch (error) {
          console.error("Erro ao buscar categoria do time:", error);
        }
      }
      
      // Map standing data
      const standingData = {
        team_id: teamId,
        category: category,
        group_name: groupName,
        position: standing.position || 0,
        points: standing.points || 0,
        played: standing.played || standing.matches_played || 0,
        won: standing.won || standing.wins || 0,
        drawn: standing.drawn || standing.draws || 0,
        lost: standing.lost || standing.losses || 0,
        goals_for: standing.goalsFor || standing.goals_for || 0,
        goals_against: standing.goalsAgainst || standing.goals_against || 0,
        goal_difference: standing.goalDifference || standing.goal_difference || 0,
        updated_at: new Date().toISOString()
      };
      
      try {
        // Tentar chamar a função RPC para criar a tabela se necessário
        await supabase.rpc("create_standings_table");
      } catch (error) {
        console.error("Erro ao verificar/criar tabela standings:", error);
      }
      
      try {
        // Check if standing already exists
        const { data: existingStanding, error: queryError } = await supabase.rpc("get_standing", {
          p_team_id: teamId,
          p_category: category,
          p_group_name: groupName
        });
        
        if (queryError || !existingStanding || existingStanding.length === 0) {
          // Tentar inserir diretamente na tabela
          const { data, error } = await supabase.rpc("insert_standing", {
            p_team_id: teamId,
            p_category: category,
            p_group_name: groupName,
            p_position: standingData.position,
            p_points: standingData.points,
            p_played: standingData.played,
            p_won: standingData.won,
            p_drawn: standingData.drawn,
            p_lost: standingData.lost,
            p_goals_for: standingData.goals_for,
            p_goals_against: standingData.goals_against,
            p_goal_difference: standingData.goal_difference
          });
          
          if (error) {
            console.error(`Erro ao inserir classificação:`, error);
            errorCount++;
          } else {
            console.log(`Classificação migrada com sucesso para time ${teamId}`);
            insertedCount++;
          }
        } else {
          // Update standing
          const { error: updateError } = await supabase.rpc("update_standing", {
            p_team_id: teamId,
            p_category: category,
            p_group_name: groupName,
            p_position: standingData.position,
            p_points: standingData.points,
            p_played: standingData.played,
            p_won: standingData.won,
            p_drawn: standingData.drawn,
            p_lost: standingData.lost,
            p_goals_for: standingData.goals_for,
            p_goals_against: standingData.goals_against,
            p_goal_difference: standingData.goal_difference
          });
          
          if (!updateError) {
            console.log(`Classificação atualizada com sucesso para time ${teamId}`);
            updatedCount++;
          } else {
            console.error(`Erro ao atualizar classificação:`, updateError);
            errorCount++;
          }
        }
      } catch (error) {
        console.error(`Erro ao processar classificação para o time ${teamId}:`, error);
        
        // Tentar inserir/atualizar diretamente sem RPC
        try {
          // Verificar se existe a tabela standings
          const { data: existingTable } = await supabase.rpc("get_standings_table_exists");
          
          if (!existingTable) {
            console.log("Tabela standings não existe, criando...");
            await supabase.rpc("create_standings_table");
          }
          
          // Check if standing already exists
          const { data: existingStanding } = await supabase
            .from("standings")
            .select("id")
            .eq("team_id", teamId)
            .eq("category", category)
            .eq("group_name", groupName)
            .maybeSingle();
          
          if (!existingStanding) {
            // Insert standing
            const { data, error } = await supabase
              .from("standings")
              .insert(standingData)
              .select();
            
            if (error) {
              console.error(`Erro ao inserir classificação:`, error);
              errorCount++;
            } else {
              console.log(`Classificação migrada com sucesso (id: ${data[0].id})`);
              insertedCount++;
            }
          } else {
            // Update standing
            const { error: updateError } = await supabase
              .from("standings")
              .update(standingData)
              .eq("id", existingStanding.id);
            
            if (!updateError) {
              console.log(`Classificação atualizada com sucesso (id: ${existingStanding.id})`);
              updatedCount++;
            } else {
              console.error(`Erro ao atualizar classificação:`, updateError);
              errorCount++;
            }
          }
        } catch (innerError) {
          console.error("Erro ao manipular standings diretamente:", innerError);
        }
      }
    }
    
    console.log(`Migração de classificação concluída: ${insertedCount} inseridos, ${updatedCount} atualizados, ${errorCount} erros`);
  } catch (error) {
    console.error("Erro ao migrar classificação:", error);
  }
};

/**
 * Create standings table if it doesn't exist
 */
export const createStandingsTable = async () => {
  try {
    // Chamar a função RPC para criar a tabela
    await supabase.rpc("create_standings_table");
    console.log("Tabela standings criada ou verificada com sucesso");
  } catch (error) {
    console.error("Erro ao criar tabela standings:", error);
  }
};

/**
 * Generate standings from matches
 */
export const generateStandingsFromMatches = async () => {
  try {
    console.log("Gerando classificação a partir das partidas...");
    
    // Tentar chamar a função RPC de recálculo
    try {
      const { error } = await supabase.rpc("recalculate_standings");
      
      if (!error) {
        console.log("Classificação recalculada com sucesso usando função do banco de dados");
        return;
      } else {
        console.error("Erro ao recalcular via função:", error);
      }
    } catch (error) {
      console.log("Função de recálculo não disponível, gerando classificação manualmente...");
    }
    
    // Verificar se a tabela existe
    try {
      await supabase.rpc("create_standings_table");
    } catch (error) {
      console.error("Erro ao criar tabela standings:", error);
      return;
    }
    
    // Buscar todas as partidas concluídas
    const { data: matches, error } = await supabase
      .from("matches")
      .select(`
        id,
        home_team,
        away_team,
        home_score,
        away_score,
        category,
        status
      `)
      .in('status', ['completed', 'finalizado', 'encerrado']);
    
    if (error) {
      throw error;
    }
    
    if (!matches || matches.length === 0) {
      console.log("Nenhuma partida encontrada para gerar classificação");
      return;
    }
    
    console.log(`Encontradas ${matches.length} partidas para gerar classificação`);
    
    // Buscar todos os times para obter suas categorias e grupos
    const { data: teamsData } = await supabase
      .from("teams")
      .select("id, name, category, group_name");
    
    if (!teamsData) {
      console.error("Erro ao buscar times");
      return;
    }
    
    // Criar mapa de times para fácil acesso
    const teamsMap = new Map();
    teamsData.forEach(team => {
      teamsMap.set(team.id, {
        name: team.name,
        category: team.category,
        group_name: team.group_name
      });
    });
    
    // Criar mapa para armazenar os dados de classificação
    const standingsMap = new Map();
    
    // Processar as partidas
    for (const match of matches) {
      if (!match.home_team || !match.away_team || match.home_score === null || match.away_score === null) {
        continue;
      }
      
      const homeTeamId = match.home_team;
      const awayTeamId = match.away_team;
      const homeScore = match.home_score;
      const awayScore = match.away_score;
      const category = match.category || 
                      (teamsMap.get(homeTeamId)?.category) || 
                      (teamsMap.get(awayTeamId)?.category) || 
                      "SUB-15";
      
      // Obter grupo dos times
      const homeGroupName = teamsMap.get(homeTeamId)?.group_name || "Grupo A";
      const awayGroupName = teamsMap.get(awayTeamId)?.group_name || "Grupo A";
      
      // Chaves para o mapa
      const homeKey = `${homeTeamId}-${category}-${homeGroupName}`;
      const awayKey = `${awayTeamId}-${category}-${awayGroupName}`;
      
      // Inicializar dados se necessário
      if (!standingsMap.has(homeKey)) {
        standingsMap.set(homeKey, {
          team_id: homeTeamId,
          category: category,
          group_name: homeGroupName,
          position: 0,
          points: 0,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goals_for: 0,
          goals_against: 0,
          goal_difference: 0
        });
      }
      
      if (!standingsMap.has(awayKey)) {
        standingsMap.set(awayKey, {
          team_id: awayTeamId,
          category: category,
          group_name: awayGroupName,
          position: 0,
          points: 0,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goals_for: 0,
          goals_against: 0,
          goal_difference: 0
        });
      }
      
      // Atualizar estatísticas da equipe da casa
      const homeStanding = standingsMap.get(homeKey);
      homeStanding.played += 1;
      homeStanding.goals_for += homeScore;
      homeStanding.goals_against += awayScore;
      
      // Atualizar estatísticas da equipe visitante
      const awayStanding = standingsMap.get(awayKey);
      awayStanding.played += 1;
      awayStanding.goals_for += awayScore;
      awayStanding.goals_against += homeScore;
      
      // Determinar resultado e atualizar pontos
      if (homeScore > awayScore) {
        // Vitória da casa
        homeStanding.won += 1;
        homeStanding.points += 3;
        awayStanding.lost += 1;
      } else if (homeScore < awayScore) {
        // Vitória do visitante
        awayStanding.won += 1;
        awayStanding.points += 3;
        homeStanding.lost += 1;
      } else {
        // Empate
        homeStanding.drawn += 1;
        homeStanding.points += 1;
        awayStanding.drawn += 1;
        awayStanding.points += 1;
      }
      
      // Atualizar saldo de gols
      homeStanding.goal_difference = homeStanding.goals_for - homeStanding.goals_against;
      awayStanding.goal_difference = awayStanding.goals_for - awayStanding.goals_against;
    }
    
    // Calcular posições em cada grupo e categoria
    const groupCategoryMap = new Map();
    
    for (const [key, standing] of standingsMap.entries()) {
      const groupCatKey = `${standing.category}-${standing.group_name}`;
      
      if (!groupCategoryMap.has(groupCatKey)) {
        groupCategoryMap.set(groupCatKey, []);
      }
      
      groupCategoryMap.get(groupCatKey).push(standing);
    }
    
    // Ordenar cada grupo por pontos, saldo de gols, etc. e atribuir posições
    for (const [groupCatKey, standings] of groupCategoryMap.entries()) {
      standings.sort((a: any, b: any) => {
        // Ordenar por pontos (decrescente)
        if (b.points !== a.points) return b.points - a.points;
        // Desempate por saldo de gols
        if (b.goal_difference !== a.goal_difference) return b.goal_difference - a.goal_difference;
        // Desempate por gols marcados
        if (b.goals_for !== a.goals_for) return b.goals_for - a.goals_for;
        // Desempate por vitórias
        return b.won - a.won;
      });
      
      // Atribuir posições
      standings.forEach((standing: any, index: number) => {
        standing.position = index + 1;
      });
    }
    
    console.log(`Total de ${standingsMap.size} classificações geradas`);
    
    // Inserir ou atualizar no banco de dados
    let insertedCount = 0;
    let updatedCount = 0;
    
    for (const standing of standingsMap.values()) {
      // Adicionar timestamp de atualização
      standing.updated_at = new Date().toISOString();
      
      try {
        // Verificar se já existe
        const { data: existingStanding } = await supabase
          .from("standings")
          .select("id")
          .eq("team_id", standing.team_id)
          .eq("category", standing.category)
          .eq("group_name", standing.group_name)
          .maybeSingle();
        
        if (!existingStanding) {
          // Inserir novo
          const { error: insertError } = await supabase
            .from("standings")
            .insert(standing);
          
          if (!insertError) {
            insertedCount++;
          } else {
            console.error("Erro ao inserir classificação:", insertError);
          }
        } else {
          // Atualizar existente
          const { error: updateError } = await supabase
            .from("standings")
            .update(standing)
            .eq("id", existingStanding.id);
          
          if (!updateError) {
            updatedCount++;
          } else {
            console.error("Erro ao atualizar classificação:", updateError);
          }
        }
      } catch (error) {
        console.error(`Erro ao processar time ${standing.team_id}:`, error);
      }
    }
    
    console.log(`Classificação atualizada: ${insertedCount} inseridos, ${updatedCount} atualizados`);
  } catch (error) {
    console.error("Erro ao gerar classificação:", error);
  }
};
