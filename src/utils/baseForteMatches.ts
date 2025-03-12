
import { supabase } from '@/integrations/supabase/client';

// Function to populate Base Forte matches
export const populateBaseForteMatches = async () => {
  try {
    console.log("Starting Base Forte match population...");
    
    // Fetch all teams first to get their IDs
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('id, name, group_name')
      .order('name');
      
    if (teamsError) {
      console.error("Error fetching teams:", teamsError);
      return { success: false, error: teamsError.message };
    }
    
    if (!teams || teams.length === 0) {
      return { success: false, error: "No teams found in the database" };
    }
    
    // Helper function to find team ID by name (case insensitive)
    const findTeamId = (name: string) => {
      const team = teams.find(t => 
        t.name.toLowerCase() === name.toLowerCase()
      );
      if (!team) {
        console.error(`Team not found: ${name}`);
      }
      return team?.id;
    };
    
    // Define matches by round data
    const matchesData = [
      // --- PRIMEIRA RODADA (08/02/25) ---
      {
        date: '2025-02-08',
        time: '14:00',
        home_team: findTeamId('Federal'),
        away_team: findTeamId('Furacão'),
        category: 'SUB-11',
        home_score: 0,
        away_score: 6,
        location: 'Estádio Municipal',
        status: 'completed',
        round: 'primeira-rodada'
      },
      {
        date: '2025-02-08',
        time: '15:00',
        home_team: findTeamId('Federal'),
        away_team: findTeamId('Furacão'),
        category: 'SUB-13',
        home_score: 0,
        away_score: 1,
        location: 'Estádio Municipal',
        status: 'completed',
        round: 'primeira-rodada'
      },
      {
        date: '2025-02-08',
        time: '14:00',
        home_team: findTeamId('Atlético City'),
        away_team: findTeamId('BSA'),
        category: 'SUB-11',
        home_score: 5,
        away_score: 0,
        location: 'Campo do Atlético',
        status: 'completed',
        round: 'primeira-rodada'
      },
      {
        date: '2025-02-08',
        time: '15:00',
        home_team: findTeamId('Atlético City'),
        away_team: findTeamId('BSA'),
        category: 'SUB-13',
        home_score: 2,
        away_score: 1,
        location: 'Campo do Atlético',
        status: 'completed',
        round: 'primeira-rodada'
      },
      {
        date: '2025-02-08',
        time: '16:00',
        home_team: findTeamId('Grêmio Ocidental'),
        away_team: findTeamId('Estrela Vermelha'),
        category: 'SUB-11',
        home_score: 2,
        away_score: 1,
        location: 'Estádio Ocidental',
        status: 'completed',
        round: 'primeira-rodada'
      },
      {
        date: '2025-02-08',
        time: '17:00',
        home_team: findTeamId('Grêmio Ocidental'),
        away_team: findTeamId('Estrela Vermelha'),
        category: 'SUB-13',
        home_score: 4,
        away_score: 0,
        location: 'Estádio Ocidental',
        status: 'completed',
        round: 'primeira-rodada'
      },
      {
        date: '2025-02-08',
        time: '16:00',
        home_team: findTeamId('Lyon'),
        away_team: findTeamId('Monte'),
        category: 'SUB-11',
        home_score: 0,
        away_score: 3,
        location: 'Campo do Lyon',
        status: 'completed',
        round: 'primeira-rodada'
      },
      {
        date: '2025-02-08',
        time: '17:00',
        home_team: findTeamId('Lyon'),
        away_team: findTeamId('Monte'),
        category: 'SUB-13',
        home_score: 0,
        away_score: 2,
        location: 'Campo do Lyon',
        status: 'completed',
        round: 'primeira-rodada'
      },
      
      // --- SEGUNDA RODADA (14-15/02/25) ---
      {
        date: '2025-02-14',
        time: '14:00',
        home_team: findTeamId('Monte'),
        away_team: findTeamId('Guerreiros'),
        category: 'SUB-11',
        home_score: 3,
        away_score: 0,
        location: 'Estádio do Monte',
        status: 'completed',
        round: 'segunda-rodada'
      },
      {
        date: '2025-02-14',
        time: '15:00',
        home_team: findTeamId('Monte'),
        away_team: findTeamId('Guerreiros'),
        category: 'SUB-13',
        home_score: 8,
        away_score: 0,
        location: 'Estádio do Monte',
        status: 'completed',
        round: 'segunda-rodada'
      },
      {
        date: '2025-02-14',
        time: '16:00',
        home_team: findTeamId('Atlético City'),
        away_team: findTeamId('Lyon'),
        category: 'SUB-11',
        home_score: 1,
        away_score: 0,
        location: 'Campo do Atlético',
        status: 'completed',
        round: 'segunda-rodada'
      },
      {
        date: '2025-02-14',
        time: '17:00',
        home_team: findTeamId('Atlético City'),
        away_team: findTeamId('Lyon'),
        category: 'SUB-13',
        home_score: 3,
        away_score: 3,
        location: 'Campo do Atlético',
        status: 'completed',
        round: 'segunda-rodada'
      },
      {
        date: '2025-02-15',
        time: '14:00',
        home_team: findTeamId('Federal'),
        away_team: findTeamId('Grêmio Ocidental'),
        category: 'SUB-11',
        home_score: 2,
        away_score: 1,
        location: 'Estádio Federal',
        status: 'completed',
        round: 'segunda-rodada'
      },
      {
        date: '2025-02-15',
        time: '15:00',
        home_team: findTeamId('Federal'),
        away_team: findTeamId('Grêmio Ocidental'),
        category: 'SUB-13',
        home_score: 1,
        away_score: 3,
        location: 'Estádio Federal',
        status: 'completed',
        round: 'segunda-rodada'
      },
      {
        date: '2025-02-15',
        time: '16:00',
        home_team: findTeamId('Estrela Vermelha'),
        away_team: findTeamId('Alvinegro'),
        category: 'SUB-11',
        home_score: 3,
        away_score: 1,
        location: 'Campo da Estrela',
        status: 'completed',
        round: 'segunda-rodada'
      },
      {
        date: '2025-02-15',
        time: '17:00',
        home_team: findTeamId('Estrela Vermelha'),
        away_team: findTeamId('Alvinegro'),
        category: 'SUB-13',
        home_score: 0,
        away_score: 2,
        location: 'Campo da Estrela',
        status: 'completed',
        round: 'segunda-rodada'
      },
      
      // --- TERCEIRA RODADA (22-23/02/25) ---
      {
        date: '2025-02-22',
        time: '14:00',
        home_team: findTeamId('Lyon'),
        away_team: findTeamId('BSA'),
        category: 'SUB-13',
        home_score: 0,
        away_score: 0,
        location: 'Campo do Lyon',
        status: 'completed',
        round: 'terceira-rodada'
      },
      {
        date: '2025-02-22',
        time: '15:00',
        home_team: findTeamId('Lyon'),
        away_team: findTeamId('BSA'),
        category: 'SUB-11',
        home_score: 3,
        away_score: 1,
        location: 'Campo do Lyon',
        status: 'completed',
        round: 'terceira-rodada'
      },
      {
        date: '2025-02-22',
        time: '16:00',
        home_team: findTeamId('Atlético City'),
        away_team: findTeamId('Guerreiros'),
        category: 'SUB-13',
        home_score: 7,
        away_score: 0,
        location: 'Campo do Atlético',
        status: 'completed',
        round: 'terceira-rodada'
      },
      {
        date: '2025-02-22',
        time: '17:00',
        home_team: findTeamId('Atlético City'),
        away_team: findTeamId('Guerreiros'),
        category: 'SUB-11',
        home_score: 2,
        away_score: 0,
        location: 'Campo do Atlético',
        status: 'completed',
        round: 'terceira-rodada'
      },
      {
        date: '2025-02-23',
        time: '14:00',
        home_team: findTeamId('Federal'),
        away_team: findTeamId('Estrela Vermelha'),
        category: 'SUB-13',
        home_score: 5,
        away_score: 1,
        location: 'Estádio Federal',
        status: 'completed',
        round: 'terceira-rodada'
      },
      {
        date: '2025-02-23',
        time: '15:00',
        home_team: findTeamId('Federal'),
        away_team: findTeamId('Estrela Vermelha'),
        category: 'SUB-11',
        home_score: 2,
        away_score: 0,
        location: 'Estádio Federal',
        status: 'completed',
        round: 'terceira-rodada'
      },
      {
        date: '2025-02-23',
        time: '16:00',
        home_team: findTeamId('Alvinegro'),
        away_team: findTeamId('Furacão'),
        category: 'SUB-11',
        home_score: 0,
        away_score: 8,
        location: 'Campo Alvinegro',
        status: 'completed',
        round: 'terceira-rodada'
      },
      {
        date: '2025-02-23',
        time: '17:00',
        home_team: findTeamId('Alvinegro'),
        away_team: findTeamId('Furacão'),
        category: 'SUB-13',
        home_score: 0,
        away_score: 9,
        location: 'Campo Alvinegro',
        status: 'completed',
        round: 'terceira-rodada'
      },
      
      // --- QUARTA RODADA (08/03/25) ---
      {
        date: '2025-03-08',
        time: '14:00',
        home_team: findTeamId('Lyon'),
        away_team: findTeamId('Guerreiros'),
        category: 'SUB-13',
        home_score: 5,
        away_score: 0,
        location: 'Campo do Lyon',
        status: 'completed',
        round: 'quarta-rodada'
      },
      {
        date: '2025-03-08',
        time: '15:00',
        home_team: findTeamId('Lyon'),
        away_team: findTeamId('Guerreiros'),
        category: 'SUB-11',
        home_score: 1,
        away_score: 2,
        location: 'Campo do Lyon',
        status: 'completed',
        round: 'quarta-rodada'
      },
      {
        date: '2025-03-08',
        time: '14:00',
        home_team: findTeamId('Monte'),
        away_team: findTeamId('BSA'),
        category: 'SUB-11',
        home_score: 4,
        away_score: 1,
        location: 'Estádio do Monte',
        status: 'completed',
        round: 'quarta-rodada'
      },
      {
        date: '2025-03-08',
        time: '15:00',
        home_team: findTeamId('Monte'),
        away_team: findTeamId('BSA'),
        category: 'SUB-13',
        home_score: 1,
        away_score: 0,
        location: 'Estádio do Monte',
        status: 'completed',
        round: 'quarta-rodada'
      },
      {
        date: '2025-03-08',
        time: '16:00',
        home_team: findTeamId('Furacão'),
        away_team: findTeamId('Estrela Vermelha'),
        category: 'SUB-11',
        home_score: 12,
        away_score: 0,
        location: 'Campo do Furacão',
        status: 'completed',
        round: 'quarta-rodada'
      },
      {
        date: '2025-03-08',
        time: '17:00',
        home_team: findTeamId('Furacão'),
        away_team: findTeamId('Estrela Vermelha'),
        category: 'SUB-13',
        home_score: 3,
        away_score: 1,
        location: 'Campo do Furacão',
        status: 'completed',
        round: 'quarta-rodada'
      },
      {
        date: '2025-03-08',
        time: '16:00',
        home_team: findTeamId('Alvinegro'),
        away_team: findTeamId('Grêmio Ocidental'),
        category: 'SUB-13',
        home_score: 0,
        away_score: 4,
        location: 'Campo Alvinegro',
        status: 'completed',
        round: 'quarta-rodada'
      },
      {
        date: '2025-03-08',
        time: '17:00',
        home_team: findTeamId('Alvinegro'),
        away_team: findTeamId('Grêmio Ocidental'),
        category: 'SUB-11',
        home_score: 1,
        away_score: 4,
        location: 'Campo Alvinegro',
        status: 'completed',
        round: 'quarta-rodada'
      },
      
      // --- QUINTA RODADA (09/03/25) - Agendadas ---
      {
        date: '2025-03-09',
        time: '14:00',
        home_team: findTeamId('Furacão'),
        away_team: findTeamId('Grêmio Ocidental'),
        category: 'SUB-13',
        home_score: null,
        away_score: null,
        location: 'Sintético da 116',
        status: 'scheduled',
        round: 'quinta-rodada'
      },
      {
        date: '2025-03-09',
        time: '15:00',
        home_team: findTeamId('Furacão'),
        away_team: findTeamId('Grêmio Ocidental'),
        category: 'SUB-11',
        home_score: null,
        away_score: null,
        location: 'Sintético da 116',
        status: 'scheduled',
        round: 'quinta-rodada'
      },
      {
        date: '2025-03-09',
        time: '16:00',
        home_team: findTeamId('Federal'),
        away_team: findTeamId('Alvinegro'),
        category: 'SUB-13',
        home_score: null,
        away_score: null,
        location: 'Sintético da 116',
        status: 'scheduled',
        round: 'quinta-rodada'
      },
      {
        date: '2025-03-09',
        time: '17:00',
        home_team: findTeamId('Federal'),
        away_team: findTeamId('Alvinegro'),
        category: 'SUB-11',
        home_score: null,
        away_score: null,
        location: 'Sintético da 116',
        status: 'scheduled',
        round: 'quinta-rodada'
      },
      {
        date: '2025-03-09',
        time: '14:00',
        home_team: findTeamId('BSA'),
        away_team: findTeamId('Guerreiros'),
        category: 'SUB-13',
        home_score: null,
        away_score: null,
        location: 'Sintético 409',
        status: 'scheduled',
        round: 'quinta-rodada'
      },
      {
        date: '2025-03-09',
        time: '15:00',
        home_team: findTeamId('BSA'),
        away_team: findTeamId('Guerreiros'),
        category: 'SUB-11',
        home_score: null,
        away_score: null,
        location: 'Sintético 409',
        status: 'scheduled',
        round: 'quinta-rodada'
      },
      {
        date: '2025-03-09',
        time: '16:00',
        home_team: findTeamId('Atlético City'),
        away_team: findTeamId('Monte'),
        category: 'SUB-13',
        home_score: null,
        away_score: null,
        location: 'Sintético 409',
        status: 'scheduled',
        round: 'quinta-rodada'
      },
      {
        date: '2025-03-09',
        time: '17:00',
        home_team: findTeamId('Atlético City'),
        away_team: findTeamId('Monte'),
        category: 'SUB-11',
        home_score: null,
        away_score: null,
        location: 'Sintético 409',
        status: 'scheduled',
        round: 'quinta-rodada'
      },
      
      // Add placeholder entries for semifinal and final rounds that are yet to be determined
      // Semifinals (15/03/2025)
      {
        date: '2025-03-15',
        time: '14:00',
        home_team: null,
        away_team: null,
        category: 'SUB-13',
        home_score: null,
        away_score: null,
        location: 'A definir',
        status: 'scheduled',
        round: 'semifinal'
      },
      {
        date: '2025-03-15',
        time: '15:00',
        home_team: null,
        away_team: null,
        category: 'SUB-11',
        home_score: null,
        away_score: null,
        location: 'A definir',
        status: 'scheduled',
        round: 'semifinal'
      },
      {
        date: '2025-03-15',
        time: '16:00',
        home_team: null,
        away_team: null,
        category: 'SUB-13',
        home_score: null,
        away_score: null,
        location: 'A definir',
        status: 'scheduled',
        round: 'semifinal'
      },
      {
        date: '2025-03-15',
        time: '17:00',
        home_team: null,
        away_team: null,
        category: 'SUB-11',
        home_score: null,
        away_score: null,
        location: 'A definir',
        status: 'scheduled',
        round: 'semifinal'
      },
      
      // Final (22/03/2025)
      {
        date: '2025-03-22',
        time: '14:00',
        home_team: null,
        away_team: null,
        category: 'SUB-13',
        home_score: null,
        away_score: null,
        location: 'Estádio Principal',
        status: 'scheduled',
        round: 'final'
      },
      {
        date: '2025-03-22',
        time: '16:00',
        home_team: null,
        away_team: null,
        category: 'SUB-11',
        home_score: null,
        away_score: null,
        location: 'Estádio Principal',
        status: 'scheduled',
        round: 'final'
      }
    ];
    
    // Insert all matches
    const validMatches = matchesData.filter(match => 
      match.home_team !== undefined || match.away_team !== undefined || 
      (match.round === 'semifinal' || match.round === 'final')
    );
    
    if (validMatches.length === 0) {
      return { success: false, error: "No valid matches to insert" };
    }
    
    const { data: insertedMatches, error: insertError } = await supabase
      .from('matches')
      .insert(validMatches)
      .select();
      
    if (insertError) {
      console.error("Error inserting matches:", insertError);
      return { success: false, error: insertError.message };
    }
    
    // Trigger standings recalculation
    const { error: recalcError } = await supabase.rpc("recalculate_standings");
    
    if (recalcError) {
      console.error("Error recalculating standings:", recalcError);
      return { 
        success: true, 
        message: `${insertedMatches?.length || 0} matches inserted, but error recalculating standings.`,
        error: recalcError.message
      };
    }
    
    return { 
      success: true, 
      message: `Successfully inserted ${insertedMatches?.length || 0} matches and recalculated standings.`
    };
  } catch (error) {
    console.error("Error in populateBaseForteMatches:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};
