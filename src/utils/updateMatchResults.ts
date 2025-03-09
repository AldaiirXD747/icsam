
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface MatchResult {
  date: string;
  homeTeamName: string;
  awayTeamName: string;
  category: string;
  homeScore: number;
  awayScore: number;
}

export const updateMatchResults = async (results: MatchResult[]) => {
  const updates: {success: boolean, message: string}[] = [];
  
  try {
    for (const result of results) {
      // Step 1: Get team IDs from team names
      const homeTeamResponse = await supabase
        .from('teams')
        .select('id')
        .eq('name', result.homeTeamName)
        .single();
      
      if (homeTeamResponse.error) {
        updates.push({ 
          success: false, 
          message: `Erro ao buscar time da casa ${result.homeTeamName}: ${homeTeamResponse.error.message}` 
        });
        continue;
      }
      
      const awayTeamResponse = await supabase
        .from('teams')
        .select('id')
        .eq('name', result.awayTeamName)
        .single();
      
      if (awayTeamResponse.error) {
        updates.push({ 
          success: false, 
          message: `Erro ao buscar time visitante ${result.awayTeamName}: ${awayTeamResponse.error.message}` 
        });
        continue;
      }
      
      const homeTeamId = homeTeamResponse.data.id;
      const awayTeamId = awayTeamResponse.data.id;
      
      // Step 2: Find the match
      const matchResponse = await supabase
        .from('matches')
        .select('id, status')
        .eq('date', result.date)
        .eq('home_team', homeTeamId)
        .eq('away_team', awayTeamId)
        .eq('category', result.category);
      
      if (matchResponse.error) {
        updates.push({ 
          success: false, 
          message: `Erro ao buscar partida: ${matchResponse.error.message}` 
        });
        continue;
      }
      
      if (matchResponse.data.length === 0) {
        updates.push({ 
          success: false, 
          message: `Partida não encontrada: ${result.homeTeamName} vs ${result.awayTeamName} em ${result.date} (${result.category})` 
        });
        continue;
      }
      
      // Step 3: Update the match result
      const match = matchResponse.data[0];
      const updateResponse = await supabase
        .from('matches')
        .update({
          home_score: result.homeScore,
          away_score: result.awayScore,
          status: 'completed'
        })
        .eq('id', match.id);
      
      if (updateResponse.error) {
        updates.push({ 
          success: false, 
          message: `Erro ao atualizar partida ${result.homeTeamName} vs ${result.awayTeamName}: ${updateResponse.error.message}` 
        });
      } else {
        updates.push({ 
          success: true, 
          message: `Atualizado: ${result.homeTeamName} ${result.homeScore} x ${result.awayScore} ${result.awayTeamName} (${result.category})` 
        });
      }
    }
    
    // Trigger standings recalculation
    const { error: recalcError } = await supabase.rpc('recalculate_standings');
    if (recalcError) {
      updates.push({ 
        success: false, 
        message: `Erro ao recalcular classificação: ${recalcError.message}` 
      });
    } else {
      updates.push({ 
        success: true, 
        message: `Classificação recalculada com sucesso` 
      });
    }
    
    return {
      success: updates.every(update => update.success),
      updates
    };
  } catch (error) {
    console.error('Erro inesperado:', error);
    return {
      success: false,
      updates: [...updates, { success: false, message: `Erro inesperado: ${error.message || 'Desconhecido'}` }]
    };
  }
};

// Function to update results based on the provided list
export const updateBaseForteMatchResults = async () => {
  // February 22, 2025 matches
  const feb22Matches: MatchResult[] = [
    { date: '2025-02-22', homeTeamName: 'LYON', awayTeamName: 'BSA', category: 'SUB-13', homeScore: 0, awayScore: 0 },
    { date: '2025-02-22', homeTeamName: 'LYON', awayTeamName: 'BSA', category: 'SUB-11', homeScore: 3, awayScore: 1 },
    { date: '2025-02-22', homeTeamName: 'ATLÉTICO CITY', awayTeamName: 'GUERREIROS', category: 'SUB-13', homeScore: 7, awayScore: 0 },
    { date: '2025-02-22', homeTeamName: 'ATLÉTICO CITY', awayTeamName: 'GUERREIROS', category: 'SUB-11', homeScore: 2, awayScore: 0 },
    { date: '2025-02-22', homeTeamName: 'FEDERAL', awayTeamName: 'ESTRELA VERMELHA', category: 'SUB-13', homeScore: 5, awayScore: 1 },
    { date: '2025-02-22', homeTeamName: 'FEDERAL', awayTeamName: 'ESTRELA VERMELHA', category: 'SUB-11', homeScore: 2, awayScore: 0 },
    { date: '2025-02-22', homeTeamName: 'ALVINEGRO', awayTeamName: 'FURACÃO', category: 'SUB-11', homeScore: 0, awayScore: 8 },
    { date: '2025-02-22', homeTeamName: 'ALVINEGRO', awayTeamName: 'FURACÃO', category: 'SUB-13', homeScore: 0, awayScore: 9 }
  ];
  
  // March 8, 2025 matches
  const mar8Matches: MatchResult[] = [
    { date: '2025-03-08', homeTeamName: 'LYON', awayTeamName: 'GUERREIROS', category: 'SUB-13', homeScore: 5, awayScore: 0 },
    { date: '2025-03-08', homeTeamName: 'LYON', awayTeamName: 'GUERREIROS', category: 'SUB-11', homeScore: 1, awayScore: 2 },
    { date: '2025-03-08', homeTeamName: 'MONTE', awayTeamName: 'BSA', category: 'SUB-11', homeScore: 4, awayScore: 1 },
    { date: '2025-03-08', homeTeamName: 'MONTE', awayTeamName: 'BSA', category: 'SUB-13', homeScore: 1, awayScore: 0 },
    { date: '2025-03-08', homeTeamName: 'FURACÃO', awayTeamName: 'ESTRELA VERMELHA', category: 'SUB-11', homeScore: 12, awayScore: 0 },
    { date: '2025-03-08', homeTeamName: 'FURACÃO', awayTeamName: 'ESTRELA VERMELHA', category: 'SUB-13', homeScore: 3, awayScore: 1 },
    { date: '2025-03-08', homeTeamName: 'ALVINEGRO', awayTeamName: 'GRÊMIO OCIDENTAL', category: 'SUB-13', homeScore: 0, awayScore: 4 },
    { date: '2025-03-08', homeTeamName: 'ALVINEGRO', awayTeamName: 'GRÊMIO OCIDENTAL', category: 'SUB-11', homeScore: 1, awayScore: 4 }
  ];
  
  // Update both sets of matches
  const feb22Results = await updateMatchResults(feb22Matches);
  const mar8Results = await updateMatchResults(mar8Matches);
  
  // Combine the results
  return {
    success: feb22Results.success && mar8Results.success,
    updates: [...feb22Results.updates, ...mar8Results.updates]
  };
};
