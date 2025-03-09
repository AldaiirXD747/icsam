
import { supabase } from '@/integrations/supabase/client';
import { updateMatchResults } from './updateMatchResults';

export const updateBaseForteResults = async () => {
  try {
    // Define all results from Base Forte 2024
    const results = [
      // Primeira Rodada (08/02/2024)
      { date: '2024-02-08', homeTeamName: 'Federal', awayTeamName: 'Furacão', category: 'SUB-11', homeScore: 0, awayScore: 6, round: 'Primeira Rodada', status: 'completed' },
      { date: '2024-02-08', homeTeamName: 'Federal', awayTeamName: 'Furacão', category: 'SUB-13', homeScore: 0, awayScore: 1, round: 'Primeira Rodada', status: 'completed' },
      { date: '2024-02-08', homeTeamName: 'Atlético City', awayTeamName: 'BSA', category: 'SUB-11', homeScore: 5, awayScore: 0, round: 'Primeira Rodada', status: 'completed' },
      { date: '2024-02-08', homeTeamName: 'Atlético City', awayTeamName: 'BSA', category: 'SUB-13', homeScore: 2, awayScore: 1, round: 'Primeira Rodada', status: 'completed' },
      { date: '2024-02-08', homeTeamName: 'Grêmio Ocidental', awayTeamName: 'Estrela Vermelha', category: 'SUB-11', homeScore: 2, awayScore: 1, round: 'Primeira Rodada', status: 'completed' },
      { date: '2024-02-08', homeTeamName: 'Grêmio Ocidental', awayTeamName: 'Estrela Vermelha', category: 'SUB-13', homeScore: 4, awayScore: 0, round: 'Primeira Rodada', status: 'completed' },
      { date: '2024-02-08', homeTeamName: 'Lyon', awayTeamName: 'Monte', category: 'SUB-11', homeScore: 0, awayScore: 3, round: 'Primeira Rodada', status: 'completed' },
      { date: '2024-02-08', homeTeamName: 'Lyon', awayTeamName: 'Monte', category: 'SUB-13', homeScore: 0, awayScore: 2, round: 'Primeira Rodada', status: 'completed' },
      
      // Segunda Rodada (14-15/02/2024)
      { date: '2024-02-14', homeTeamName: 'Monte', awayTeamName: 'Guerreiros', category: 'SUB-11', homeScore: 3, awayScore: 0, round: 'Segunda Rodada', status: 'completed' },
      { date: '2024-02-14', homeTeamName: 'Monte', awayTeamName: 'Guerreiros', category: 'SUB-13', homeScore: 8, awayScore: 0, round: 'Segunda Rodada', status: 'completed' },
      { date: '2024-02-14', homeTeamName: 'Atlético City', awayTeamName: 'Lyon', category: 'SUB-11', homeScore: 1, awayScore: 0, round: 'Segunda Rodada', status: 'completed' },
      { date: '2024-02-14', homeTeamName: 'Atlético City', awayTeamName: 'Lyon', category: 'SUB-13', homeScore: 3, awayScore: 3, round: 'Segunda Rodada', status: 'completed' },
      { date: '2024-02-15', homeTeamName: 'Federal', awayTeamName: 'Grêmio Ocidental', category: 'SUB-11', homeScore: 2, awayScore: 1, round: 'Segunda Rodada', status: 'completed' },
      { date: '2024-02-15', homeTeamName: 'Federal', awayTeamName: 'Grêmio Ocidental', category: 'SUB-13', homeScore: 1, awayScore: 3, round: 'Segunda Rodada', status: 'completed' },
      { date: '2024-02-15', homeTeamName: 'Estrela Vermelha', awayTeamName: 'Alvinegro', category: 'SUB-11', homeScore: 3, awayScore: 1, round: 'Segunda Rodada', status: 'completed' },
      { date: '2024-02-15', homeTeamName: 'Estrela Vermelha', awayTeamName: 'Alvinegro', category: 'SUB-13', homeScore: 0, awayScore: 2, round: 'Segunda Rodada', status: 'completed' },
      
      // Terceira Rodada (22-23/02/2024)
      { date: '2024-02-22', homeTeamName: 'Lyon', awayTeamName: 'BSA', category: 'SUB-13', homeScore: 0, awayScore: 0, round: 'Terceira Rodada', status: 'completed' },
      { date: '2024-02-22', homeTeamName: 'Lyon', awayTeamName: 'BSA', category: 'SUB-11', homeScore: 3, awayScore: 1, round: 'Terceira Rodada', status: 'completed' },
      { date: '2024-02-22', homeTeamName: 'Atlético City', awayTeamName: 'Guerreiros', category: 'SUB-13', homeScore: 7, awayScore: 0, round: 'Terceira Rodada', status: 'completed' },
      { date: '2024-02-22', homeTeamName: 'Atlético City', awayTeamName: 'Guerreiros', category: 'SUB-11', homeScore: 2, awayScore: 0, round: 'Terceira Rodada', status: 'completed' },
      { date: '2024-02-23', homeTeamName: 'Federal', awayTeamName: 'Estrela Vermelha', category: 'SUB-13', homeScore: 5, awayScore: 1, round: 'Terceira Rodada', status: 'completed' },
      { date: '2024-02-23', homeTeamName: 'Federal', awayTeamName: 'Estrela Vermelha', category: 'SUB-11', homeScore: 2, awayScore: 0, round: 'Terceira Rodada', status: 'completed' },
      { date: '2024-02-23', homeTeamName: 'Alvinegro', awayTeamName: 'Furacão', category: 'SUB-11', homeScore: 0, awayScore: 8, round: 'Terceira Rodada', status: 'completed' },
      { date: '2024-02-23', homeTeamName: 'Alvinegro', awayTeamName: 'Furacão', category: 'SUB-13', homeScore: 0, awayScore: 9, round: 'Terceira Rodada', status: 'completed' },
      
      // Quarta Rodada (08/03/2024)
      { date: '2024-03-08', homeTeamName: 'Lyon', awayTeamName: 'Guerreiros', category: 'SUB-13', homeScore: 5, awayScore: 0, round: 'Quarta Rodada', status: 'completed' },
      { date: '2024-03-08', homeTeamName: 'Lyon', awayTeamName: 'Guerreiros', category: 'SUB-11', homeScore: 1, awayScore: 2, round: 'Quarta Rodada', status: 'completed' },
      { date: '2024-03-08', homeTeamName: 'Monte', awayTeamName: 'BSA', category: 'SUB-11', homeScore: 4, awayScore: 1, round: 'Quarta Rodada', status: 'completed' },
      { date: '2024-03-08', homeTeamName: 'Monte', awayTeamName: 'BSA', category: 'SUB-13', homeScore: 1, awayScore: 0, round: 'Quarta Rodada', status: 'completed' },
      { date: '2024-03-08', homeTeamName: 'Furacão', awayTeamName: 'Estrela Vermelha', category: 'SUB-11', homeScore: 12, awayScore: 0, round: 'Quarta Rodada', status: 'completed' },
      { date: '2024-03-08', homeTeamName: 'Furacão', awayTeamName: 'Estrela Vermelha', category: 'SUB-13', homeScore: 3, awayScore: 1, round: 'Quarta Rodada', status: 'completed' },
      { date: '2024-03-08', homeTeamName: 'Alvinegro', awayTeamName: 'Grêmio Ocidental', category: 'SUB-13', homeScore: 0, awayScore: 4, round: 'Quarta Rodada', status: 'completed' },
      { date: '2024-03-08', homeTeamName: 'Alvinegro', awayTeamName: 'Grêmio Ocidental', category: 'SUB-11', homeScore: 1, awayScore: 4, round: 'Quarta Rodada', status: 'completed' },
      
      // Quinta Rodada (09/03/2024) - Agendadas
      { date: '2024-03-09', homeTeamName: 'Furacão', awayTeamName: 'Grêmio Ocidental', category: 'SUB-13', homeScore: 0, awayScore: 0, round: 'Quinta Rodada', status: 'scheduled' },
      { date: '2024-03-09', homeTeamName: 'Furacão', awayTeamName: 'Grêmio Ocidental', category: 'SUB-11', homeScore: 0, awayScore: 0, round: 'Quinta Rodada', status: 'scheduled' },
      { date: '2024-03-09', homeTeamName: 'Federal', awayTeamName: 'Alvinegro', category: 'SUB-13', homeScore: 0, awayScore: 0, round: 'Quinta Rodada', status: 'scheduled' },
      { date: '2024-03-09', homeTeamName: 'Federal', awayTeamName: 'Alvinegro', category: 'SUB-11', homeScore: 0, awayScore: 0, round: 'Quinta Rodada', status: 'scheduled' },
      { date: '2024-03-09', homeTeamName: 'BSA', awayTeamName: 'Guerreiros', category: 'SUB-13', homeScore: 0, awayScore: 0, round: 'Quinta Rodada', status: 'scheduled' },
      { date: '2024-03-09', homeTeamName: 'BSA', awayTeamName: 'Guerreiros', category: 'SUB-11', homeScore: 0, awayScore: 0, round: 'Quinta Rodada', status: 'scheduled' },
      { date: '2024-03-09', homeTeamName: 'Atlético City', awayTeamName: 'Monte', category: 'SUB-13', homeScore: 0, awayScore: 0, round: 'Quinta Rodada', status: 'scheduled' },
      { date: '2024-03-09', homeTeamName: 'Atlético City', awayTeamName: 'Monte', category: 'SUB-11', homeScore: 0, awayScore: 0, round: 'Quinta Rodada', status: 'scheduled' }
    ];
    
    const result = await updateMatchResults(results);
    return result;
  } catch (error) {
    console.error('Erro ao atualizar resultados:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      updates: [{ success: false, message: `Erro inesperado: ${error instanceof Error ? error.message : 'Desconhecido'}` }]
    };
  }
};
