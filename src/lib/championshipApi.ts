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
    // For now, we'll return mock data
    // In a real implementation, this would fetch from your database
    
    // Mock data for development
    if (type === 'scorers') {
      return [
        {
          player_id: "p1",
          player_name: "João Silva",
          team_name: "Flamengo Sub-15",
          team_logo: "/placeholder.svg",
          goals: 7
        },
        {
          player_id: "p2",
          player_name: "Pedro Oliveira",
          team_name: "Vasco Sub-15",
          team_logo: "/placeholder.svg",
          goals: 5
        },
        {
          player_id: "p3",
          player_name: "Rafael Santos",
          team_name: "Fluminense Sub-15",
          team_logo: "/placeholder.svg",
          goals: 4
        }
      ];
    }
    
    if (type === 'cards') {
      return [
        {
          player_id: "p4",
          player_name: "Carlos Ferreira",
          team_name: "Botafogo Sub-15",
          team_logo: "/placeholder.svg",
          yellow_cards: 3,
          red_cards: 1
        },
        {
          player_id: "p5",
          player_name: "Lucas Mendes",
          team_name: "Flamengo Sub-15",
          team_logo: "/placeholder.svg",
          yellow_cards: 2,
          red_cards: 0
        },
        {
          player_id: "p6",
          player_name: "Gabriel Costa",
          team_name: "Vasco Sub-15",
          team_logo: "/placeholder.svg",
          yellow_cards: 2,
          red_cards: 0
        }
      ];
    }
    
    if (type === 'teams') {
      return [
        {
          team_id: "t1",
          team_name: "Flamengo Sub-15",
          team_logo: "/placeholder.svg",
          total_goals: 15,
          matches_played: 5,
          goals_per_match: 3.0
        },
        {
          team_id: "t2",
          team_name: "Vasco Sub-15",
          team_logo: "/placeholder.svg",
          total_goals: 10,
          matches_played: 5,
          goals_per_match: 2.0
        },
        {
          team_id: "t3",
          team_name: "Fluminense Sub-15",
          team_logo: "/placeholder.svg",
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
