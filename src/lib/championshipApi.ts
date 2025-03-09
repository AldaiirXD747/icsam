
export const getChampionshipStandings = async (championshipId: string, category: string) => {
  try {
    // Construct the URL with query parameters
    let url = `${process.env.NEXT_PUBLIC_API_URL}/championships/${championshipId}/standings`;
    const queryParams = new URLSearchParams();
    queryParams.append('category', category === 'all' ? 'SUB-11' : category); // Default to SUB-11 if 'all' is selected

    // Append query parameters to the URL
    const queryString = queryParams.toString();
    if (queryString) {
        url += `?${queryString}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch standings: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching championship standings:", error);
    return [];
  }
};

export const getChampionshipStatistics = async (
  championshipId: string, 
  category: string, 
  type: 'scorers' | 'cards' | 'teams'
) => {
  try {
    // Base URL for the Supabase API
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vhyghnawrfjoosgrmsyw.supabase.co';
    const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoeWdobmF3cmZqb29zZ3Jtc3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyODA0NzgsImV4cCI6MjA1Njg1NjQ3OH0.BibbDZ6WrWvYfR0ok94QXnwUFfjXtxT4s0xmWFyCX4A';
    
    // Build the URL based on the type of statistics
    let url = `${baseUrl}/rest/v1/`;
    let headers = {
      'apikey': apiKey,
      'Content-Type': 'application/json'
    };
    
    // Filter by category if not 'all'
    const categoryFilter = category !== 'all' ? `&category=eq.${category}` : '';
    
    if (type === 'scorers') {
      // For now, return mock scorer data
      // In production this would fetch from top_scorers table
      return [
        {
          player_id: "p1",
          player_name: "João Silva",
          team_name: "Furacão",
          team_logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png",
          goals: 7
        },
        {
          player_id: "p2",
          player_name: "Pedro Oliveira",
          team_name: "Grêmio Ocidental",
          team_logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/Captura-de-tela-2025-02-13-112406.png",
          goals: 5
        },
        {
          player_id: "p3",
          player_name: "Rafael Santos",
          team_name: "Atlético City",
          team_logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/7.png",
          goals: 4
        }
      ];
    }
    
    if (type === 'cards') {
      // For now, return mock card statistics
      // In production this would fetch from yellow_card_leaders table
      return [
        {
          player_id: "p4",
          player_name: "Carlos Ferreira",
          team_name: "Monte",
          team_logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/2.png",
          yellow_cards: 3,
          red_cards: 1
        },
        {
          player_id: "p5",
          player_name: "Lucas Mendes",
          team_name: "Lyon",
          team_logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/lion.png",
          yellow_cards: 2,
          red_cards: 0
        },
        {
          player_id: "p6",
          player_name: "Gabriel Costa",
          team_name: "Estrela Vermelha",
          team_logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/5.png",
          yellow_cards: 2,
          red_cards: 0
        }
      ];
    }
    
    if (type === 'teams') {
      // For now, return mock team statistics
      // In production this would be calculated from matches
      return [
        {
          team_id: "t1",
          team_name: "Furacão",
          team_logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png",
          total_goals: 15,
          matches_played: 5,
          goals_per_match: 3.0
        },
        {
          team_id: "t2",
          team_name: "Grêmio Ocidental",
          team_logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/Captura-de-tela-2025-02-13-112406.png",
          total_goals: 10,
          matches_played: 5,
          goals_per_match: 2.0
        },
        {
          team_id: "t3",
          team_name: "Atlético City",
          team_logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/7.png",
          total_goals: 8,
          matches_played: 5,
          goals_per_match: 1.6
        }
      ];
    }
    
    return [];
  } catch (error) {
    console.error(`Error fetching ${type} statistics:`, error);
    return [];
  }
};

// Adicionar funções para o campeonato
export const getChampionshipById = async (id: string) => {
  try {
    // Em um sistema real, isso faria uma chamada para a API para obter o campeonato por ID
    return {
      id,
      name: "Campeonato Base Forte 2025", 
      description: "Campeonato organizado pelo Instituto Criança Santa Maria",
      start_date: "2025-02-08",
      end_date: "2025-03-22",
      location: "São Paulo",
      categories: ["SUB-11", "SUB-13"],
      status: "ongoing"
    };
  } catch (error) {
    console.error("Error fetching championship:", error);
    return null;
  }
};

export const getChampionshipTeams = async (id: string, category?: string) => {
  try {
    // Em um sistema real, isso faria uma chamada para a API para obter os times do campeonato
    // Aqui estamos apenas retornando dados mock para o campeonato Base Forte 2025
    const teamsGrupoA = [
      {
        id: "1",
        name: "Furacão",
        logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png",
        group_name: "A"
      },
      {
        id: "2",
        name: "Estrela Vermelha",
        logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/5.png",
        group_name: "A"
      },
      {
        id: "3",
        name: "Grêmio Ocidental",
        logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/Captura-de-tela-2025-02-13-112406.png",
        group_name: "A"
      },
      {
        id: "4",
        name: "Federal",
        logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/6.png",
        group_name: "A"
      },
      {
        id: "5",
        name: "Alvinegro",
        logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/1.png",
        group_name: "A"
      }
    ];

    const teamsGrupoB = [
      {
        id: "6",
        name: "Atlético City",
        logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/7.png",
        group_name: "B"
      },
      {
        id: "7",
        name: "Monte",
        logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/2.png",
        group_name: "B"
      },
      {
        id: "8",
        name: "Guerreiros",
        logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/9.png",
        group_name: "B"
      },
      {
        id: "9",
        name: "Lyon",
        logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/lion.png",
        group_name: "B"
      },
      {
        id: "10",
        name: "BSA",
        logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/4.png",
        group_name: "B"
      }
    ];

    return [...teamsGrupoA, ...teamsGrupoB];
  } catch (error) {
    console.error("Error fetching championship teams:", error);
    return [];
  }
};

export const getChampionshipMatches = async (
  id: string,
  { 
    category, 
    status, 
    team 
  }: { 
    category?: string; 
    status?: string; 
    team?: string;
  } = {}
) => {
  try {
    // Esta função retornaria partidas do campeonato em um sistema real
    // Vamos simular dados para o campeonato Base Forte 2025
    const matches = [
      // Primeira Rodada - 08/02/2025
      {
        id: "1",
        date: "2025-02-08",
        time: "14:00",
        home_team: "Federal",
        away_team: "Furacão",
        home_score: 0,
        away_score: 6,
        category: "SUB-11",
        status: "completed",
        round: "Primeira Rodada"
      },
      {
        id: "2",
        date: "2025-02-08",
        time: "15:00",
        home_team: "Federal",
        away_team: "Furacão",
        home_score: 0,
        away_score: 1,
        category: "SUB-13",
        status: "completed",
        round: "Primeira Rodada"
      },
      {
        id: "3",
        date: "2025-02-08",
        time: "16:00",
        home_team: "Atlético City",
        away_team: "BSA",
        home_score: 5,
        away_score: 0,
        category: "SUB-11",
        status: "completed",
        round: "Primeira Rodada"
      },
      {
        id: "4",
        date: "2025-02-08",
        time: "17:00",
        home_team: "Atlético City",
        away_team: "BSA",
        home_score: 2,
        away_score: 1,
        category: "SUB-13",
        status: "completed",
        round: "Primeira Rodada"
      },
      // ...continuar com todas as partidas do campeonato

      // Semifinais
      {
        id: "100",
        date: "2025-03-15",
        time: "14:00",
        home_team: "1º Grupo A",
        away_team: "2º Grupo B",
        home_score: null,
        away_score: null,
        category: "SUB-11",
        status: "scheduled",
        round: "Semifinal"
      },
      {
        id: "101",
        date: "2025-03-15",
        time: "15:00",
        home_team: "1º Grupo B",
        away_team: "2º Grupo A",
        home_score: null,
        away_score: null,
        category: "SUB-11",
        status: "scheduled",
        round: "Semifinal"
      },
      {
        id: "102",
        date: "2025-03-15",
        time: "16:00",
        home_team: "1º Grupo A",
        away_team: "2º Grupo B",
        home_score: null,
        away_score: null,
        category: "SUB-13",
        status: "scheduled",
        round: "Semifinal"
      },
      {
        id: "103",
        date: "2025-03-15",
        time: "17:00",
        home_team: "1º Grupo B",
        away_team: "2º Grupo A",
        home_score: null,
        away_score: null,
        category: "SUB-13",
        status: "scheduled",
        round: "Semifinal"
      },
      
      // Finais
      {
        id: "104",
        date: "2025-03-22",
        time: "14:00",
        home_team: "Vencedor SF1",
        away_team: "Vencedor SF2",
        home_score: null,
        away_score: null,
        category: "SUB-11",
        status: "scheduled",
        round: "Final"
      },
      {
        id: "105",
        date: "2025-03-22",
        time: "16:00",
        home_team: "Vencedor SF1",
        away_team: "Vencedor SF2",
        home_score: null,
        away_score: null,
        category: "SUB-13",
        status: "scheduled",
        round: "Final"
      }
    ];

    // Filtrar resultados se necessário
    let filteredMatches = [...matches];
    
    if (category) {
      filteredMatches = filteredMatches.filter(m => m.category === category);
    }
    
    if (status) {
      filteredMatches = filteredMatches.filter(m => m.status === status);
    }
    
    if (team) {
      filteredMatches = filteredMatches.filter(m => 
        m.home_team === team || m.away_team === team
      );
    }
    
    return filteredMatches;
  } catch (error) {
    console.error("Error fetching championship matches:", error);
    return [];
  }
};

export const getChampionshipTopScorers = async (id: string, category?: string) => {
  try {
    // Mock data para artilheiros
    const scorers = [
      {
        player_id: "s1",
        player_name: "Lucas Silva",
        team_name: "Furacão",
        team_logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png",
        goals: 12,
        category: "SUB-11"
      },
      {
        player_id: "s2",
        player_name: "Ricardo Gomes",
        team_name: "Monte",
        team_logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/2.png",
        goals: 8,
        category: "SUB-11"
      },
      {
        player_id: "s3",
        player_name: "Carlos Oliveira",
        team_name: "Atlético City",
        team_logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/7.png",
        goals: 7,
        category: "SUB-13"
      }
    ];
    
    if (category) {
      return scorers.filter(s => s.category === category);
    }
    
    return scorers;
  } catch (error) {
    console.error("Error fetching championship top scorers:", error);
    return [];
  }
};

export const getChampionshipYellowCards = async (id: string, category?: string) => {
  try {
    // Mock data para cartões
    const cards = [
      {
        player_id: "c1",
        player_name: "Marcos Lima",
        team_name: "Estrela Vermelha",
        team_logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/5.png",
        yellow_cards: 3,
        red_cards: 0,
        category: "SUB-13"
      },
      {
        player_id: "c2",
        player_name: "Pedro Santos",
        team_name: "Grêmio Ocidental",
        team_logo: "https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/Captura-de-tela-2025-02-13-112406.png",
        yellow_cards: 2,
        red_cards: 1,
        category: "SUB-11"
      }
    ];
    
    if (category) {
      return cards.filter(c => c.category === category);
    }
    
    return cards;
  } catch (error) {
    console.error("Error fetching championship yellow cards:", error);
    return [];
  }
};
