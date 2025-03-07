import axios from "axios";

/**
 * Fetch all necessary data from public endpoints or static sources
 */
export const fetchPublicData = async () => {
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
        
        // Filter out championships without name
        const validChampionships = (champResponse.data || []).filter(c => c && c.name);
        if (validChampionships.length < (champResponse.data || []).length) {
          console.log(`Filtrados ${(champResponse.data || []).length - validChampionships.length} campeonatos inválidos dos dados da API`);
        }
        
        return {
          championships: validChampionships,
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
    const hardcodedChampionships = getHardcodedChampionships();
    const hardcodedTeams = getHardcodedTeams();
    const hardcodedPlayers = getHardcodedPlayers();
    const hardcodedMatches = getHardcodedMatches();
    const hardcodedStatistics = getHardcodedStatistics();
    
    return {
      championships: hardcodedChampionships.filter(c => c && c.name),
      teams: hardcodedTeams.filter(t => t && t.name),
      players: hardcodedPlayers.filter(p => p && p.name),
      matches: hardcodedMatches,
      statistics: hardcodedStatistics
    };
  } catch (error) {
    console.error("Erro ao buscar dados públicos:", error);
    throw error;
  }
};

/**
 * Get hardcoded championships data from the public area
 */
export const getHardcodedChampionships = () => {
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
export const getHardcodedTeams = () => {
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
export const getHardcodedPlayers = () => {
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
export const getHardcodedMatches = () => {
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
export const getHardcodedStatistics = () => {
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
