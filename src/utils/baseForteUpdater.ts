
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface MatchResult {
  date: string;
  homeTeam: string;
  awayTeam: string;
  category: string;
  homeScore: number;
  awayScore: number;
  round: string;
  time: string;
  location: string;
  status: 'scheduled' | 'completed';
}

export const updateBaseForteResults = async () => {
  try {
    // Rodada 1 - 08/02/2025
    const round1Matches: MatchResult[] = [
      { date: '2025-02-08', homeTeam: 'Federal', awayTeam: 'Furacão', category: 'SUB-11', homeScore: 0, awayScore: 6, round: 'Primeira Rodada', time: '14:00', location: 'Campo Base Forte', status: 'completed' },
      { date: '2025-02-08', homeTeam: 'Federal', awayTeam: 'Furacão', category: 'SUB-13', homeScore: 0, awayScore: 1, round: 'Primeira Rodada', time: '15:00', location: 'Campo Base Forte', status: 'completed' },
      { date: '2025-02-08', homeTeam: 'Atlético City', awayTeam: 'BSA', category: 'SUB-11', homeScore: 5, awayScore: 0, round: 'Primeira Rodada', time: '16:00', location: 'Campo Base Forte', status: 'completed' },
      { date: '2025-02-08', homeTeam: 'Atlético City', awayTeam: 'BSA', category: 'SUB-13', homeScore: 2, awayScore: 1, round: 'Primeira Rodada', time: '17:00', location: 'Campo Base Forte', status: 'completed' },
      { date: '2025-02-08', homeTeam: 'Grêmio Ocidental', awayTeam: 'Estrela Vermelha', category: 'SUB-11', homeScore: 2, awayScore: 1, round: 'Primeira Rodada', time: '14:00', location: 'Campo Sintético', status: 'completed' },
      { date: '2025-02-08', homeTeam: 'Grêmio Ocidental', awayTeam: 'Estrela Vermelha', category: 'SUB-13', homeScore: 4, awayScore: 0, round: 'Primeira Rodada', time: '15:00', location: 'Campo Sintético', status: 'completed' },
      { date: '2025-02-08', homeTeam: 'Lyon', awayTeam: 'Monte', category: 'SUB-11', homeScore: 0, awayScore: 3, round: 'Primeira Rodada', time: '16:00', location: 'Campo Sintético', status: 'completed' },
      { date: '2025-02-08', homeTeam: 'Lyon', awayTeam: 'Monte', category: 'SUB-13', homeScore: 0, awayScore: 2, round: 'Primeira Rodada', time: '17:00', location: 'Campo Sintético', status: 'completed' },
    ];

    // Rodada 2 - 14/02 e 15/02/2025
    const round2Matches: MatchResult[] = [
      { date: '2025-02-14', homeTeam: 'Monte', awayTeam: 'Guerreiros', category: 'SUB-11', homeScore: 3, awayScore: 0, round: 'Segunda Rodada', time: '14:00', location: 'Campo Base Forte', status: 'completed' },
      { date: '2025-02-14', homeTeam: 'Monte', awayTeam: 'Guerreiros', category: 'SUB-13', homeScore: 8, awayScore: 0, round: 'Segunda Rodada', time: '15:00', location: 'Campo Base Forte', status: 'completed' },
      { date: '2025-02-14', homeTeam: 'Atlético City', awayTeam: 'Lyon', category: 'SUB-11', homeScore: 1, awayScore: 0, round: 'Segunda Rodada', time: '16:00', location: 'Campo Base Forte', status: 'completed' },
      { date: '2025-02-14', homeTeam: 'Atlético City', awayTeam: 'Lyon', category: 'SUB-13', homeScore: 3, awayScore: 3, round: 'Segunda Rodada', time: '17:00', location: 'Campo Base Forte', status: 'completed' },
      { date: '2025-02-15', homeTeam: 'Federal', awayTeam: 'Grêmio Ocidental', category: 'SUB-11', homeScore: 2, awayScore: 1, round: 'Segunda Rodada', time: '14:00', location: 'Campo Sintético', status: 'completed' },
      { date: '2025-02-15', homeTeam: 'Federal', awayTeam: 'Grêmio Ocidental', category: 'SUB-13', homeScore: 1, awayScore: 3, round: 'Segunda Rodada', time: '15:00', location: 'Campo Sintético', status: 'completed' },
      { date: '2025-02-15', homeTeam: 'Estrela Vermelha', awayTeam: 'Alvinegro', category: 'SUB-11', homeScore: 3, awayScore: 1, round: 'Segunda Rodada', time: '16:00', location: 'Campo Sintético', status: 'completed' },
      { date: '2025-02-15', homeTeam: 'Estrela Vermelha', awayTeam: 'Alvinegro', category: 'SUB-13', homeScore: 0, awayScore: 2, round: 'Segunda Rodada', time: '17:00', location: 'Campo Sintético', status: 'completed' },
    ];

    // Rodada 3 - 22/02 e 23/02/2025
    const round3Matches: MatchResult[] = [
      { date: '2025-02-22', homeTeam: 'Lyon', awayTeam: 'BSA', category: 'SUB-13', homeScore: 0, awayScore: 0, round: 'Terceira Rodada', time: '14:00', location: 'Campo Base Forte', status: 'completed' },
      { date: '2025-02-22', homeTeam: 'Lyon', awayTeam: 'BSA', category: 'SUB-11', homeScore: 3, awayScore: 1, round: 'Terceira Rodada', time: '15:00', location: 'Campo Base Forte', status: 'completed' },
      { date: '2025-02-22', homeTeam: 'Atlético City', awayTeam: 'Guerreiros', category: 'SUB-13', homeScore: 7, awayScore: 0, round: 'Terceira Rodada', time: '16:00', location: 'Campo Base Forte', status: 'completed' },
      { date: '2025-02-22', homeTeam: 'Atlético City', awayTeam: 'Guerreiros', category: 'SUB-11', homeScore: 2, awayScore: 0, round: 'Terceira Rodada', time: '17:00', location: 'Campo Base Forte', status: 'completed' },
      { date: '2025-02-23', homeTeam: 'Federal', awayTeam: 'Estrela Vermelha', category: 'SUB-13', homeScore: 5, awayScore: 1, round: 'Terceira Rodada', time: '14:00', location: 'Campo Sintético', status: 'completed' },
      { date: '2025-02-23', homeTeam: 'Federal', awayTeam: 'Estrela Vermelha', category: 'SUB-11', homeScore: 2, awayScore: 0, round: 'Terceira Rodada', time: '15:00', location: 'Campo Sintético', status: 'completed' },
      { date: '2025-02-23', homeTeam: 'Alvinegro', awayTeam: 'Furacão', category: 'SUB-11', homeScore: 0, awayScore: 8, round: 'Terceira Rodada', time: '16:00', location: 'Campo Sintético', status: 'completed' },
      { date: '2025-02-23', homeTeam: 'Alvinegro', awayTeam: 'Furacão', category: 'SUB-13', homeScore: 0, awayScore: 9, round: 'Terceira Rodada', time: '17:00', location: 'Campo Sintético', status: 'completed' },
    ];

    // Rodada 4 - 08/03/2025
    const round4Matches: MatchResult[] = [
      { date: '2025-03-08', homeTeam: 'Lyon', awayTeam: 'Guerreiros', category: 'SUB-13', homeScore: 5, awayScore: 0, round: 'Quarta Rodada', time: '14:00', location: 'Campo Base Forte', status: 'completed' },
      { date: '2025-03-08', homeTeam: 'Lyon', awayTeam: 'Guerreiros', category: 'SUB-11', homeScore: 1, awayScore: 2, round: 'Quarta Rodada', time: '15:00', location: 'Campo Base Forte', status: 'completed' },
      { date: '2025-03-08', homeTeam: 'Monte', awayTeam: 'BSA', category: 'SUB-11', homeScore: 4, awayScore: 1, round: 'Quarta Rodada', time: '14:00', location: 'Campo Sintético', status: 'completed' },
      { date: '2025-03-08', homeTeam: 'Monte', awayTeam: 'BSA', category: 'SUB-13', homeScore: 1, awayScore: 0, round: 'Quarta Rodada', time: '15:00', location: 'Campo Sintético', status: 'completed' },
      { date: '2025-03-08', homeTeam: 'Furacão', awayTeam: 'Estrela Vermelha', category: 'SUB-11', homeScore: 12, awayScore: 0, round: 'Quarta Rodada', time: '16:00', location: 'Campo Base Forte', status: 'completed' },
      { date: '2025-03-08', homeTeam: 'Furacão', awayTeam: 'Estrela Vermelha', category: 'SUB-13', homeScore: 3, awayScore: 1, round: 'Quarta Rodada', time: '17:00', location: 'Campo Base Forte', status: 'completed' },
      { date: '2025-03-08', homeTeam: 'Alvinegro', awayTeam: 'Grêmio Ocidental', category: 'SUB-13', homeScore: 0, awayScore: 4, round: 'Quarta Rodada', time: '16:00', location: 'Campo Sintético', status: 'completed' },
      { date: '2025-03-08', homeTeam: 'Alvinegro', awayTeam: 'Grêmio Ocidental', category: 'SUB-11', homeScore: 1, awayScore: 4, round: 'Quarta Rodada', time: '17:00', location: 'Campo Sintético', status: 'completed' },
    ];

    // Rodada 5 - 09/03/2025 (Agendado)
    const round5Matches: MatchResult[] = [
      { date: '2025-03-09', homeTeam: 'Furacão', awayTeam: 'Grêmio Ocidental', category: 'SUB-13', homeScore: null, awayScore: null, round: 'Quinta Rodada', time: '14:00', location: 'Campo Base Forte', status: 'scheduled' },
      { date: '2025-03-09', homeTeam: 'Furacão', awayTeam: 'Grêmio Ocidental', category: 'SUB-11', homeScore: null, awayScore: null, round: 'Quinta Rodada', time: '15:00', location: 'Campo Base Forte', status: 'scheduled' },
      { date: '2025-03-09', homeTeam: 'Federal', awayTeam: 'Alvinegro', category: 'SUB-13', homeScore: null, awayScore: null, round: 'Quinta Rodada', time: '16:00', location: 'Campo Base Forte', status: 'scheduled' },
      { date: '2025-03-09', homeTeam: 'Federal', awayTeam: 'Alvinegro', category: 'SUB-11', homeScore: null, awayScore: null, round: 'Quinta Rodada', time: '17:00', location: 'Campo Base Forte', status: 'scheduled' },
      { date: '2025-03-09', homeTeam: 'BSA', awayTeam: 'Guerreiros', category: 'SUB-13', homeScore: null, awayScore: null, round: 'Quinta Rodada', time: '14:00', location: 'Campo Sintético', status: 'scheduled' },
      { date: '2025-03-09', homeTeam: 'BSA', awayTeam: 'Guerreiros', category: 'SUB-11', homeScore: null, awayScore: null, round: 'Quinta Rodada', time: '15:00', location: 'Campo Sintético', status: 'scheduled' },
      { date: '2025-03-09', homeTeam: 'Atlético City', awayTeam: 'Monte', category: 'SUB-13', homeScore: null, awayScore: null, round: 'Quinta Rodada', time: '16:00', location: 'Campo Sintético', status: 'scheduled' },
      { date: '2025-03-09', homeTeam: 'Atlético City', awayTeam: 'Monte', category: 'SUB-11', homeScore: null, awayScore: null, round: 'Quinta Rodada', time: '17:00', location: 'Campo Sintético', status: 'scheduled' },
    ];

    // Semifinais - 15/03/2025
    const semifinalMatches: MatchResult[] = [
      { date: '2025-03-15', homeTeam: '1º Grupo A', awayTeam: '2º Grupo B', category: 'SUB-11', homeScore: null, awayScore: null, round: 'Semifinal', time: '14:00', location: 'Campo Base Forte', status: 'scheduled' },
      { date: '2025-03-15', homeTeam: '1º Grupo B', awayTeam: '2º Grupo A', category: 'SUB-11', homeScore: null, awayScore: null, round: 'Semifinal', time: '15:00', location: 'Campo Base Forte', status: 'scheduled' },
      { date: '2025-03-15', homeTeam: '1º Grupo A', awayTeam: '2º Grupo B', category: 'SUB-13', homeScore: null, awayScore: null, round: 'Semifinal', time: '16:00', location: 'Campo Base Forte', status: 'scheduled' },
      { date: '2025-03-15', homeTeam: '1º Grupo B', awayTeam: '2º Grupo A', category: 'SUB-13', homeScore: null, awayScore: null, round: 'Semifinal', time: '17:00', location: 'Campo Base Forte', status: 'scheduled' },
    ];

    // Finais - 22/03/2025
    const finalMatches: MatchResult[] = [
      { date: '2025-03-22', homeTeam: 'Vencedor SF1', awayTeam: 'Vencedor SF2', category: 'SUB-11', homeScore: null, awayScore: null, round: 'Final', time: '14:00', location: 'Campo Base Forte', status: 'scheduled' },
      { date: '2025-03-22', homeTeam: 'Vencedor SF1', awayTeam: 'Vencedor SF2', category: 'SUB-13', homeScore: null, awayScore: null, round: 'Final', time: '16:00', location: 'Campo Base Forte', status: 'scheduled' },
    ];

    // Juntar todas as partidas
    const allMatches = [
      ...round1Matches,
      ...round2Matches,
      ...round3Matches,
      ...round4Matches,
      ...round5Matches,
      ...semifinalMatches,
      ...finalMatches
    ];

    // Primeiro vamos remover partidas antigas para evitar duplicatas
    const { error: deleteError } = await supabase
      .from('matches')
      .delete()
      .in('round', ['Primeira Rodada', 'Segunda Rodada', 'Terceira Rodada', 'Quarta Rodada', 'Quinta Rodada', 'Semifinal', 'Final'])
      .in('category', ['SUB-11', 'SUB-13']);

    if (deleteError) {
      console.error('Erro ao remover partidas antigas:', deleteError);
      return { 
        success: false, 
        error: 'Erro ao remover partidas antigas', 
        results: [`❌ Erro ao remover partidas antigas: ${deleteError.message}`]
      };
    }

    // Array para armazenar os resultados da operação
    const results: string[] = [];
    let successCount = 0;
    let errorCount = 0;

    // Inserir as novas partidas
    for (const match of allMatches) {
      // Buscar os IDs dos times
      const { data: homeTeamData, error: homeTeamError } = await supabase
        .from('teams')
        .select('id')
        .eq('name', match.homeTeam)
        .eq('category', match.category)
        .single();

      if (homeTeamError) {
        console.error(`Erro ao buscar time da casa '${match.homeTeam}':`, homeTeamError);
        results.push(`❌ Erro ao buscar time da casa '${match.homeTeam}': ${homeTeamError.message}`);
        errorCount++;
        continue;
      }

      // Para times especiais usados nas semifinais e finais, não precisamos buscar IDs
      let awayTeamId = null;
      if (!match.awayTeam.includes('Grupo') && !match.awayTeam.includes('Vencedor')) {
        const { data: awayTeamData, error: awayTeamError } = await supabase
          .from('teams')
          .select('id')
          .eq('name', match.awayTeam)
          .eq('category', match.category)
          .single();

        if (awayTeamError) {
          console.error(`Erro ao buscar time visitante '${match.awayTeam}':`, awayTeamError);
          results.push(`❌ Erro ao buscar time visitante '${match.awayTeam}': ${awayTeamError.message}`);
          errorCount++;
          continue;
        }
        
        awayTeamId = awayTeamData.id;
      }

      // Inserir a partida
      const { data: insertedMatch, error: insertError } = await supabase
        .from('matches')
        .insert({
          date: match.date,
          time: match.time,
          location: match.location,
          category: match.category,
          home_team: homeTeamData ? homeTeamData.id : null,
          away_team: awayTeamId,
          home_score: match.homeScore,
          away_score: match.awayScore,
          status: match.status,
          round: match.round,
          championship_id: 'base-forte-2025' // ID fixo para o campeonato Base Forte 2025
        });

      if (insertError) {
        console.error(`Erro ao inserir partida ${match.homeTeam} vs ${match.awayTeam}:`, insertError);
        results.push(`❌ Erro ao inserir partida ${match.homeTeam} vs ${match.awayTeam}: ${insertError.message}`);
        errorCount++;
      } else {
        results.push(`✅ Partida inserida: ${match.homeTeam} vs ${match.awayTeam} (${match.category}) - ${match.date} - ${match.round}`);
        successCount++;
      }
    }

    // Recalcular as classificações
    const { error: recalcError } = await supabase.rpc('recalculate_standings');
    if (recalcError) {
      console.error('Erro ao recalcular classificações:', recalcError);
      results.push(`❌ Erro ao recalcular classificações: ${recalcError.message}`);
      return { 
        success: false, 
        error: 'Erro ao recalcular classificações', 
        results 
      };
    } else {
      results.push('✅ Classificações recalculadas com sucesso');
    }

    results.unshift(`📊 Resumo: ${successCount} partidas inseridas, ${errorCount} erros`);

    return {
      success: errorCount === 0,
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

// Adicione outros tipos de estatísticas aqui conforme necessário
