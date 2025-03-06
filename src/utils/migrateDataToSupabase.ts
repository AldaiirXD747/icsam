
import { supabase } from "@/integrations/supabase/client";
import axios from "axios";

/**
 * This utility script migrates existing data to Supabase
 * It fetches data from public endpoints and harmonizes it with the admin panel's data structure
 */
export const migrateDataToSupabase = async () => {
  try {
    console.log("Iniciando migração de dados para o Supabase...");
    
    // Fetch data from public endpoints
    const publicDataSources = await fetchPublicData();
    
    // Migrate championships
    await migrateChampionships(publicDataSources.championships);
    
    // Migrate teams
    const teamsMap = await migrateTeams(publicDataSources.teams);
    
    // Migrate players
    const playersMap = await migratePlayers(publicDataSources.players, teamsMap);
    
    // Migrate matches
    await migrateMatches(publicDataSources.matches, teamsMap);
    
    // Migrate statistics
    await migrateStatistics(publicDataSources.statistics, playersMap, teamsMap);
    
    console.log("Migração de dados concluída!");
    return true;
  } catch (error) {
    console.error("Erro durante a migração de dados:", error);
    return false;
  }
};

/**
 * Fetch all necessary data from public endpoints or static sources
 */
const fetchPublicData = async () => {
  try {
    console.log("Buscando dados da área pública...");
    
    // Attempt to fetch data from API endpoints first
    try {
      const champResponse = await axios.get('/api/championships');
      const teamsResponse = await axios.get('/api/teams');
      const playersResponse = await axios.get('/api/players');
      const matchesResponse = await axios.get('/api/matches');
      const statisticsResponse = await axios.get('/api/statistics');
      
      if (champResponse.data?.length > 0) {
        console.log("Dados encontrados nas APIs públicas");
        return {
          championships: champResponse.data || [],
          teams: teamsResponse.data || [],
          players: playersResponse.data || [],
          matches: matchesResponse.data || [],
          statistics: statisticsResponse.data || []
        };
      }
    } catch (e) {
      console.log("APIs públicas não disponíveis, buscando dados estáticos...");
    }
    
    // Fallback to hardcoded data in the public area
    return {
      championships: getHardcodedChampionships(),
      teams: getHardcodedTeams(),
      players: getHardcodedPlayers(),
      matches: getHardcodedMatches(),
      statistics: getHardcodedStatistics()
    };
  } catch (error) {
    console.error("Erro ao buscar dados públicos:", error);
    throw error;
  }
};

/**
 * Get hardcoded championships data from the public area
 */
const getHardcodedChampionships = () => {
  return [
    {
      id: "champ-2024",
      name: "Campeonato Base Forte 2024",
      year: "2024",
      description: "Campeonato de futebol para categorias de base",
      location: "Brasília, DF",
      categories: ["SUB-11", "SUB-13", "SUB-15", "SUB-17"],
      status: "ongoing",
      startDate: "2024-01-15",
      endDate: "2024-12-10"
    },
    {
      id: "copa-santa-maria",
      name: "Copa Santa Maria",
      year: "2024",
      description: "Torneio regional de futebol de base",
      location: "Santa Maria, DF",
      categories: ["SUB-13", "SUB-15"],
      status: "upcoming",
      startDate: "2024-07-10",
      endDate: "2024-08-30"
    },
    {
      id: "liga-futsal-df",
      name: "Liga Futsal DF",
      year: "2024",
      description: "Principal competição de futsal do Distrito Federal",
      location: "Diversas, DF",
      categories: ["SUB-13", "SUB-15", "SUB-17"],
      status: "upcoming",
      startDate: "2024-08-05",
      endDate: "2024-11-20"
    }
  ];
};

/**
 * Get hardcoded teams data from the public area
 */
const getHardcodedTeams = () => {
  return [
    {
      id: "time-1",
      name: "Leões da Base",
      description: "Equipe de formação de atletas",
      logo: "/lovable-uploads/f1f2ae6a-22d0-4a9b-89ac-d11a3e1db81b.png",
      category: "SUB-15",
      groupName: "Grupo A",
      active: true
    },
    {
      id: "time-2",
      name: "Águias FC",
      description: "Time tradicional da região",
      logo: "/lovable-uploads/a77367ed-485d-4364-b35e-3003be91a7cd.png",
      category: "SUB-15",
      groupName: "Grupo A",
      active: true
    },
    {
      id: "time-3",
      name: "Gama Jovem",
      description: "Base do Gama",
      logo: "/lovable-uploads/f6948c38-54be-49e9-9699-59f65b3d9ad6.png",
      category: "SUB-15",
      groupName: "Grupo B",
      active: true
    },
    {
      id: "time-4",
      name: "Formação Brasília",
      description: "Instituto de formação de atletas",
      logo: "/lovable-uploads/0b71f7dd-5e7e-46d7-a9c6-7c4d93e26e31.png", 
      category: "SUB-15",
      groupName: "Grupo B",
      active: true
    }
  ];
};

/**
 * Get hardcoded players data from the public area
 */
const getHardcodedPlayers = () => {
  return [
    {
      id: "player-1",
      name: "Pedro Silva",
      teamId: "time-1",
      position: "Atacante",
      number: 10,
      photo: null
    },
    {
      id: "player-2",
      name: "Lucas Oliveira",
      teamId: "time-1",
      position: "Goleiro",
      number: 1,
      photo: null
    },
    {
      id: "player-3",
      name: "João Santos",
      teamId: "time-2",
      position: "Zagueiro",
      number: 4,
      photo: null
    },
    {
      id: "player-4",
      name: "Matheus Lima",
      teamId: "time-2",
      position: "Meio-Campo",
      number: 8,
      photo: null
    },
    {
      id: "player-5",
      name: "Rafael Costa",
      teamId: "time-3",
      position: "Atacante",
      number: 9,
      photo: null
    },
    {
      id: "player-6",
      name: "Bruno Alves",
      teamId: "time-4",
      position: "Lateral",
      number: 2,
      photo: null
    }
  ];
};

/**
 * Get hardcoded matches data from the public area
 */
const getHardcodedMatches = () => {
  return [
    {
      id: "match-1",
      date: "2024-06-15",
      time: "14:00:00",
      location: "Estádio Santa Maria",
      category: "SUB-15",
      status: "scheduled",
      championshipId: "champ-2024",
      homeTeamId: "time-1",
      awayTeamId: "time-2",
      homeScore: null,
      awayScore: null,
      round: "Fase de Grupos"
    },
    {
      id: "match-2",
      date: "2024-06-22",
      time: "16:00:00",
      location: "Campo do Instituto",
      category: "SUB-13",
      status: "scheduled",
      championshipId: "champ-2024",
      homeTeamId: "time-3",
      awayTeamId: "time-4",
      homeScore: null,
      awayScore: null,
      round: "Fase de Grupos"
    },
    {
      id: "match-3",
      date: "2024-07-01",
      time: "15:30:00",
      location: "Estádio Santa Maria",
      category: "SUB-15",
      status: "completed",
      championshipId: "champ-2024",
      homeTeamId: "time-1",
      awayTeamId: "time-3",
      homeScore: 2,
      awayScore: 1,
      round: "Fase de Grupos"
    }
  ];
};

/**
 * Get hardcoded statistics data from the public area
 */
const getHardcodedStatistics = () => {
  return {
    topScorers: [
      {
        id: "ts-1",
        playerId: "player-1",
        teamId: "time-1",
        goals: 10,
        category: "SUB-15",
        championshipId: "champ-2024"
      },
      {
        id: "ts-2",
        playerId: "player-5",
        teamId: "time-3",
        goals: 7,
        category: "SUB-15",
        championshipId: "champ-2024"
      },
      {
        id: "ts-3",
        playerId: "player-4",
        teamId: "time-2",
        goals: 5,
        category: "SUB-15",
        championshipId: "champ-2024"
      }
    ],
    yellowCards: [
      {
        id: "yc-1",
        playerId: "player-3",
        teamId: "time-2",
        yellowCards: 3,
        category: "SUB-15",
        championshipId: "champ-2024"
      },
      {
        id: "yc-2",
        playerId: "player-2",
        teamId: "time-1",
        yellowCards: 2,
        category: "SUB-15",
        championshipId: "champ-2024"
      }
    ]
  };
};

/**
 * Migrate championships data to Supabase
 */
const migrateChampionships = async (championships) => {
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

/**
 * Migrate teams data to Supabase
 * Returns a map of old team IDs to new Supabase IDs
 */
const migrateTeams = async (teams) => {
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

/**
 * Migrate players data to Supabase
 * Returns a map of old player IDs to new Supabase IDs
 */
const migratePlayers = async (players, teamsMap) => {
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

/**
 * Migrate matches data to Supabase
 */
const migrateMatches = async (matches, teamsMap) => {
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
const addDummyGoals = async (matchId, homeTeamId, awayTeamId, homeScore, awayScore) => {
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

/**
 * Migrate statistics data to Supabase
 */
const migrateStatistics = async (statistics, playersMap, teamsMap) => {
  try {
    // Migrate top scorers
    if (statistics.topScorers && statistics.topScorers.length > 0) {
      console.log(`Migrando ${statistics.topScorers.length} artilheiros...`);
      
      // Get championships
      const { data: championships } = await supabase
        .from("championships")
        .select("id, name");
      
      let defaultChampionshipId = null;
      if (championships && championships.length > 0) {
        defaultChampionshipId = championships[0].id;
      }
      
      for (const scorer of statistics.topScorers) {
        // Get the mapped player and team IDs
        const playerId = playersMap.get(scorer.playerId);
        const teamId = teamsMap.get(scorer.teamId);
        
        if (!playerId || !teamId) {
          console.error(`Jogador ou time não encontrado para o artilheiro com ID ${scorer.id}`);
          continue;
        }
        
        // Map public data fields to admin panel fields
        const scorerData = {
          player_id: playerId,
          team_id: teamId,
          goals: scorer.goals || 0,
          category: scorer.category || "SUB-15",
          championship_id: defaultChampionshipId
        };
        
        // Check if top scorer already exists
        const { data: existingScorer } = await supabase
          .from("top_scorers")
          .select("id")
          .eq("player_id", playerId)
          .eq("team_id", teamId)
          .maybeSingle();
        
        if (!existingScorer) {
          // Insert top scorer
          const { data, error } = await supabase
            .from("top_scorers")
            .insert(scorerData)
            .select();
          
          if (error) {
            console.error(`Erro ao inserir artilheiro:`, error);
          } else {
            console.log(`Artilheiro migrado com sucesso (id: ${data[0].id})`);
          }
        } else {
          console.log(`Artilheiro já existe no Supabase (id: ${existingScorer.id})`);
          
          // Update goals if needed
          const { error: updateError } = await supabase
            .from("top_scorers")
            .update({ goals: scorerData.goals })
            .eq("id", existingScorer.id);
          
          if (!updateError) {
            console.log(`Gols atualizados para o artilheiro ${existingScorer.id}`);
          }
        }
      }
    }
    
    // Migrate yellow cards
    if (statistics.yellowCards && statistics.yellowCards.length > 0) {
      console.log(`Migrando ${statistics.yellowCards.length} líderes de cartões amarelos...`);
      
      // Get championships
      const { data: championships } = await supabase
        .from("championships")
        .select("id, name");
      
      let defaultChampionshipId = null;
      if (championships && championships.length > 0) {
        defaultChampionshipId = championships[0].id;
      }
      
      for (const cardLeader of statistics.yellowCards) {
        // Get the mapped player and team IDs
        const playerId = playersMap.get(cardLeader.playerId);
        const teamId = teamsMap.get(cardLeader.teamId);
        
        if (!playerId || !teamId) {
          console.error(`Jogador ou time não encontrado para o líder de cartões com ID ${cardLeader.id}`);
          continue;
        }
        
        // Map public data fields to admin panel fields
        const cardLeaderData = {
          player_id: playerId,
          team_id: teamId,
          yellow_cards: cardLeader.yellowCards || 0,
          category: cardLeader.category || "SUB-15",
          championship_id: defaultChampionshipId
        };
        
        // Check if yellow card leader already exists
        const { data: existingCardLeader } = await supabase
          .from("yellow_card_leaders")
          .select("id")
          .eq("player_id", playerId)
          .eq("team_id", teamId)
          .maybeSingle();
        
        if (!existingCardLeader) {
          // Insert yellow card leader
          const { data, error } = await supabase
            .from("yellow_card_leaders")
            .insert(cardLeaderData)
            .select();
          
          if (error) {
            console.error(`Erro ao inserir líder de cartões:`, error);
          } else {
            console.log(`Líder de cartões migrado com sucesso (id: ${data[0].id})`);
          }
        } else {
          console.log(`Líder de cartões já existe no Supabase (id: ${existingCardLeader.id})`);
          
          // Update yellow cards if needed
          const { error: updateError } = await supabase
            .from("yellow_card_leaders")
            .update({ yellow_cards: cardLeaderData.yellow_cards })
            .eq("id", existingCardLeader.id);
          
          if (!updateError) {
            console.log(`Cartões atualizados para o líder ${existingCardLeader.id}`);
          }
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao migrar estatísticas:", error);
    return false;
  }
};
