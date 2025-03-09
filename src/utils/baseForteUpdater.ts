
import { supabase } from '@/integrations/supabase/client';
import { MatchData, addBatchMatches } from './matchDataManager';

export const updateBaseForteResults = async () => {
  try {
    const results: string[] = [];
    
    // Define todas as partidas do campeonato Base Forte 2024
    const matchesData: MatchData[] = [
      // Primeira Rodada (08/02/2024)
      { date: '2024-02-08', time: '14:00', location: 'Campo Principal', category: 'SUB-11', homeTeamName: 'Federal', awayTeamName: 'Furacão', homeScore: 0, awayScore: 6, status: 'completed', round: 'Primeira Rodada' },
      { date: '2024-02-08', time: '15:00', location: 'Campo Principal', category: 'SUB-13', homeTeamName: 'Federal', awayTeamName: 'Furacão', homeScore: 0, awayScore: 1, status: 'completed', round: 'Primeira Rodada' },
      { date: '2024-02-08', time: '16:00', location: 'Campo Principal', category: 'SUB-11', homeTeamName: 'Atlético City', awayTeamName: 'BSA', homeScore: 5, awayScore: 0, status: 'completed', round: 'Primeira Rodada' },
      { date: '2024-02-08', time: '17:00', location: 'Campo Principal', category: 'SUB-13', homeTeamName: 'Atlético City', awayTeamName: 'BSA', homeScore: 2, awayScore: 1, status: 'completed', round: 'Primeira Rodada' },
      { date: '2024-02-08', time: '14:00', location: 'Campo Secundário', category: 'SUB-11', homeTeamName: 'Grêmio Ocidental', awayTeamName: 'Estrela', homeScore: 2, awayScore: 1, status: 'completed', round: 'Primeira Rodada' },
      { date: '2024-02-08', time: '15:00', location: 'Campo Secundário', category: 'SUB-13', homeTeamName: 'Grêmio Ocidental', awayTeamName: 'Estrela', homeScore: 4, awayScore: 0, status: 'completed', round: 'Primeira Rodada' },
      { date: '2024-02-08', time: '16:00', location: 'Campo Secundário', category: 'SUB-11', homeTeamName: 'Lyon', awayTeamName: 'Monte', homeScore: 0, awayScore: 3, status: 'completed', round: 'Primeira Rodada' },
      { date: '2024-02-08', time: '17:00', location: 'Campo Secundário', category: 'SUB-13', homeTeamName: 'Lyon', awayTeamName: 'Monte', homeScore: 0, awayScore: 2, status: 'completed', round: 'Primeira Rodada' },
      
      // Segunda Rodada (14/02/2024)
      { date: '2024-02-14', time: '14:00', location: 'Campo Principal', category: 'SUB-11', homeTeamName: 'Monte', awayTeamName: 'Guerreiros', homeScore: 3, awayScore: 0, status: 'completed', round: 'Segunda Rodada' },
      { date: '2024-02-14', time: '15:00', location: 'Campo Principal', category: 'SUB-13', homeTeamName: 'Monte', awayTeamName: 'Guerreiros', homeScore: 8, awayScore: 0, status: 'completed', round: 'Segunda Rodada' },
      { date: '2024-02-14', time: '16:00', location: 'Campo Principal', category: 'SUB-11', homeTeamName: 'Atlético City', awayTeamName: 'Lyon', homeScore: 1, awayScore: 0, status: 'completed', round: 'Segunda Rodada' },
      { date: '2024-02-14', time: '17:00', location: 'Campo Principal', category: 'SUB-13', homeTeamName: 'Atlético City', awayTeamName: 'Lyon', homeScore: 3, awayScore: 3, status: 'completed', round: 'Segunda Rodada' },
      
      // Segunda Rodada (15/02/2024)
      { date: '2024-02-15', time: '14:00', location: 'Campo Principal', category: 'SUB-11', homeTeamName: 'Federal', awayTeamName: 'Grêmio Ocidental', homeScore: 2, awayScore: 1, status: 'completed', round: 'Segunda Rodada' },
      { date: '2024-02-15', time: '15:00', location: 'Campo Principal', category: 'SUB-13', homeTeamName: 'Federal', awayTeamName: 'Grêmio Ocidental', homeScore: 1, awayScore: 3, status: 'completed', round: 'Segunda Rodada' },
      { date: '2024-02-15', time: '16:00', location: 'Campo Principal', category: 'SUB-11', homeTeamName: 'Estrela', awayTeamName: 'Alvinegro', homeScore: 3, awayScore: 1, status: 'completed', round: 'Segunda Rodada' },
      { date: '2024-02-15', time: '17:00', location: 'Campo Principal', category: 'SUB-13', homeTeamName: 'Estrela', awayTeamName: 'Alvinegro', homeScore: 0, awayScore: 2, status: 'completed', round: 'Segunda Rodada' },
      
      // Terceira Rodada (22/02/2024)
      { date: '2024-02-22', time: '14:00', location: 'Campo Principal', category: 'SUB-13', homeTeamName: 'Lyon', awayTeamName: 'BSA', homeScore: 0, awayScore: 0, status: 'completed', round: 'Terceira Rodada' },
      { date: '2024-02-22', time: '15:00', location: 'Campo Principal', category: 'SUB-11', homeTeamName: 'Lyon', awayTeamName: 'BSA', homeScore: 3, awayScore: 1, status: 'completed', round: 'Terceira Rodada' },
      { date: '2024-02-22', time: '16:00', location: 'Campo Principal', category: 'SUB-13', homeTeamName: 'Atlético City', awayTeamName: 'Guerreiros', homeScore: 7, awayScore: 0, status: 'completed', round: 'Terceira Rodada' },
      { date: '2024-02-22', time: '17:00', location: 'Campo Principal', category: 'SUB-11', homeTeamName: 'Atlético City', awayTeamName: 'Guerreiros', homeScore: 2, awayScore: 0, status: 'completed', round: 'Terceira Rodada' },
      
      // Terceira Rodada (23/02/2024)
      { date: '2024-02-23', time: '14:00', location: 'Campo Principal', category: 'SUB-13', homeTeamName: 'Federal', awayTeamName: 'Estrela Vermelha', homeScore: 5, awayScore: 1, status: 'completed', round: 'Terceira Rodada' },
      { date: '2024-02-23', time: '15:00', location: 'Campo Principal', category: 'SUB-11', homeTeamName: 'Federal', awayTeamName: 'Estrela Vermelha', homeScore: 2, awayScore: 0, status: 'completed', round: 'Terceira Rodada' },
      { date: '2024-02-23', time: '16:00', location: 'Campo Principal', category: 'SUB-11', homeTeamName: 'Alvinegro', awayTeamName: 'Furacão', homeScore: 0, awayScore: 8, status: 'completed', round: 'Terceira Rodada' },
      { date: '2024-02-23', time: '17:00', location: 'Campo Principal', category: 'SUB-13', homeTeamName: 'Alvinegro', awayTeamName: 'Furacão', homeScore: 0, awayScore: 9, status: 'completed', round: 'Terceira Rodada' },
      
      // Quarta Rodada (08/03/2024)
      { date: '2024-03-08', time: '14:00', location: 'Campo Principal', category: 'SUB-13', homeTeamName: 'Lyon', awayTeamName: 'Guerreiros', homeScore: 5, awayScore: 0, status: 'completed', round: 'Quarta Rodada' },
      { date: '2024-03-08', time: '15:00', location: 'Campo Principal', category: 'SUB-11', homeTeamName: 'Lyon', awayTeamName: 'Guerreiros', homeScore: 1, awayScore: 2, status: 'completed', round: 'Quarta Rodada' },
      { date: '2024-03-08', time: '16:00', location: 'Campo Principal', category: 'SUB-11', homeTeamName: 'Monte', awayTeamName: 'BSA', homeScore: 4, awayScore: 1, status: 'completed', round: 'Quarta Rodada' },
      { date: '2024-03-08', time: '17:00', location: 'Campo Principal', category: 'SUB-13', homeTeamName: 'Monte', awayTeamName: 'BSA', homeScore: 1, awayScore: 0, status: 'completed', round: 'Quarta Rodada' },
      { date: '2024-03-08', time: '14:00', location: 'Campo Secundário', category: 'SUB-11', homeTeamName: 'Furacão', awayTeamName: 'Estrela Vermelha', homeScore: 12, awayScore: 0, status: 'completed', round: 'Quarta Rodada' },
      { date: '2024-03-08', time: '15:00', location: 'Campo Secundário', category: 'SUB-13', homeTeamName: 'Furacão', awayTeamName: 'Estrela Vermelha', homeScore: 3, awayScore: 1, status: 'completed', round: 'Quarta Rodada' },
      { date: '2024-03-08', time: '16:00', location: 'Campo Secundário', category: 'SUB-13', homeTeamName: 'Alvinegro', awayTeamName: 'Grêmio Ocidental', homeScore: 0, awayScore: 4, status: 'completed', round: 'Quarta Rodada' },
      { date: '2024-03-08', time: '17:00', location: 'Campo Secundário', category: 'SUB-11', homeTeamName: 'Alvinegro', awayTeamName: 'Grêmio Ocidental', homeScore: 1, awayScore: 4, status: 'completed', round: 'Quarta Rodada' },
      
      // Quinta Rodada (09/03/2024) - Agendado
      { date: '2024-03-09', time: '14:00', location: 'Sintético da 116', category: 'SUB-13', homeTeamName: 'Furacão', awayTeamName: 'Grêmio Ocidental', homeScore: null, awayScore: null, status: 'scheduled', round: 'Quinta Rodada' },
      { date: '2024-03-09', time: '15:00', location: 'Sintético da 116', category: 'SUB-11', homeTeamName: 'Furacão', awayTeamName: 'Grêmio Ocidental', homeScore: null, awayScore: null, status: 'scheduled', round: 'Quinta Rodada' },
      { date: '2024-03-09', time: '16:00', location: 'Sintético da 116', category: 'SUB-13', homeTeamName: 'Federal', awayTeamName: 'Alvinegro', homeScore: null, awayScore: null, status: 'scheduled', round: 'Quinta Rodada' },
      { date: '2024-03-09', time: '17:00', location: 'Sintético da 116', category: 'SUB-11', homeTeamName: 'Federal', awayTeamName: 'Alvinegro', homeScore: null, awayScore: null, status: 'scheduled', round: 'Quinta Rodada' },
      { date: '2024-03-09', time: '14:00', location: 'Sintético 409', category: 'SUB-13', homeTeamName: 'BSA', awayTeamName: 'Guerreiros', homeScore: null, awayScore: null, status: 'scheduled', round: 'Quinta Rodada' },
      { date: '2024-03-09', time: '15:00', location: 'Sintético 409', category: 'SUB-11', homeTeamName: 'BSA', awayTeamName: 'Guerreiros', homeScore: null, awayScore: null, status: 'scheduled', round: 'Quinta Rodada' },
      { date: '2024-03-09', time: '16:00', location: 'Sintético 409', category: 'SUB-13', homeTeamName: 'Atlético City', awayTeamName: 'Monte', homeScore: null, awayScore: null, status: 'scheduled', round: 'Quinta Rodada' },
      { date: '2024-03-09', time: '17:00', location: 'Sintético 409', category: 'SUB-11', homeTeamName: 'Atlético City', awayTeamName: 'Monte', homeScore: null, awayScore: null, status: 'scheduled', round: 'Quinta Rodada' },
      
      // Semifinais (15/03/2024) - Agendado
      { date: '2024-03-15', time: '14:00', location: 'Estádio Principal', category: 'SUB-11', homeTeamName: '1º Grupo A', awayTeamName: '2º Grupo B', homeScore: null, awayScore: null, status: 'scheduled', round: 'Semifinal' },
      { date: '2024-03-15', time: '15:30', location: 'Estádio Principal', category: 'SUB-11', homeTeamName: '1º Grupo B', awayTeamName: '2º Grupo A', homeScore: null, awayScore: null, status: 'scheduled', round: 'Semifinal' },
      { date: '2024-03-15', time: '17:00', location: 'Estádio Principal', category: 'SUB-13', homeTeamName: '1º Grupo A', awayTeamName: '2º Grupo B', homeScore: null, awayScore: null, status: 'scheduled', round: 'Semifinal' },
      { date: '2024-03-15', time: '18:30', location: 'Estádio Principal', category: 'SUB-13', homeTeamName: '1º Grupo B', awayTeamName: '2º Grupo A', homeScore: null, awayScore: null, status: 'scheduled', round: 'Semifinal' },
      
      // Finais (22/03/2024) - Agendado
      { date: '2024-03-22', time: '14:00', location: 'Estádio Principal', category: 'SUB-11', homeTeamName: 'Vencedor SF1', awayTeamName: 'Vencedor SF2', homeScore: null, awayScore: null, status: 'scheduled', round: 'Final' },
      { date: '2024-03-22', time: '16:00', location: 'Estádio Principal', category: 'SUB-13', homeTeamName: 'Vencedor SF1', awayTeamName: 'Vencedor SF2', homeScore: null, awayScore: null, status: 'scheduled', round: 'Final' }
    ];
    
    results.push("🔄 Iniciando inclusão de todas as partidas do campeonato Base Forte 2024...");
    
    // Limpar dados existentes primeiro
    const { error: deleteMatchesError } = await supabase
      .from('matches')
      .delete()
      .not('id', 'is', null);
    
    if (deleteMatchesError) {
      console.error('Erro ao limpar dados de partidas:', deleteMatchesError);
      results.push(`❌ Erro ao limpar partidas existentes: ${deleteMatchesError.message}`);
      return { success: false, error: 'Erro ao limpar partidas existentes', results };
    }
    
    results.push("✅ Partidas existentes removidas com sucesso");
    
    // Inserir as novas partidas em lote
    const matchResult = await addBatchMatches(matchesData);
    
    if (!matchResult.success) {
      results.push(`❌ Erro ao inserir novas partidas: ${JSON.stringify(matchResult.results)}`);
      return { success: false, error: 'Erro ao inserir novas partidas', results };
    }
    
    results.push(`✅ ${matchesData.length} partidas do campeonato Base Forte 2024 inseridas com sucesso`);
    results.push("✅ Classificação recalculada com sucesso");
    
    return {
      success: true,
      results
    };
  } catch (error) {
    console.error('Erro inesperado ao atualizar resultados:', error);
    return {
      success: false,
      error: 'Erro inesperado ao atualizar resultados',
      results: [`❌ Erro inesperado: ${error.message || error}`]
    };
  }
};
