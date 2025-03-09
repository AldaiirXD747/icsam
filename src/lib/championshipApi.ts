
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
