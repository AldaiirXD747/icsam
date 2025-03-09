
import { supabase } from '@/integrations/supabase/client';
import { correctAllMatchDates, removeDuplicateMatches, removeSpecificMatches } from './matchDataManager';

interface MatchResult {
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  category: string;
}

/**
 * Updates the Base Forte 2025 Championship data with the latest match results
 */
export const updateBaseForteResults = async () => {
  const results: string[] = [];
  
  try {
    results.push("Iniciando atualização dos resultados do Campeonato Base Forte 2025...");
    
    // Step 1: Clean up existing data
    results.push("Removendo partidas desatualizadas...");
    
    const { message: removeMessage } = await removeSpecificMatches();
    results.push(`✅ ${removeMessage}`);
    
    // Step 2: Remove any duplicates that might have been created
    const { message: duplicatesMessage } = await removeDuplicateMatches();
    results.push(`✅ ${duplicatesMessage}`);
    
    // Step 3: Correct dates if needed
    const { message: datesMessage } = await correctAllMatchDates();
    results.push(`✅ ${datesMessage}`);
    
    // Step 4: Get championship ID
    results.push("Obtendo ID do campeonato Base Forte 2025...");
    
    const { data: championshipData, error: championshipError } = await supabase
      .from('championships')
      .select('id')
      .eq('name', 'Campeonato Base Forte')
      .eq('year', '2025')
      .limit(1);
    
    if (championshipError) {
      results.push(`❌ Erro ao buscar campeonato: ${championshipError.message}`);
      throw championshipError;
    }
    
    if (!championshipData || championshipData.length === 0) {
      results.push(`❌ Campeonato Base Forte 2025 não encontrado`);
      throw new Error('Campeonato não encontrado');
    }
    
    const championshipId = championshipData[0].id;
    results.push(`✅ ID do campeonato recuperado: ${championshipId}`);
    
    // Step 5: Get team info for mapping team names to IDs
    results.push("Obtendo informações dos times...");
    
    const { data: teamsData, error: teamsError } = await supabase
      .from('teams')
      .select('id, name, category')
      .order('name');
    
    if (teamsError) {
      results.push(`❌ Erro ao buscar times: ${teamsError.message}`);
      throw teamsError;
    }
    
    // Create a map to easily find team IDs
    const teamIdMap: Record<string, string> = {};
    
    teamsData?.forEach(team => {
      const key = `${team.name.toUpperCase()}-${team.category}`;
      teamIdMap[key] = team.id;
      
      // Also add a version without hyphens
      const normalizedName = team.name.toUpperCase().replace(/[^A-Z0-9]/g, '');
      const normalizedKey = `${normalizedName}-${team.category}`;
      teamIdMap[normalizedKey] = team.id;
      
      // Support for "Estrela Vermelha" which might be "ESTRELA" in some places
      if (team.name.toUpperCase().includes('ESTRELA')) {
        teamIdMap[`ESTRELA-${team.category}`] = team.id;
        teamIdMap[`ESTRELAVERMELHA-${team.category}`] = team.id;
      }
    });
    
    results.push(`✅ ${Object.keys(teamIdMap).length} combinações de time/categoria mapeadas`);
    
    // Step 6: Update match results
    const matchesToUpdate: MatchResult[] = [
      // 08/02/25
      { date: '2025-02-08', homeTeam: 'FEDERAL', awayTeam: 'FURACÃO', homeScore: 0, awayScore: 6, category: 'SUB-11' },
      { date: '2025-02-08', homeTeam: 'FEDERAL', awayTeam: 'FURACÃO', homeScore: 0, awayScore: 1, category: 'SUB-13' },
      { date: '2025-02-08', homeTeam: 'ATLÉTICO CITY', awayTeam: 'BSA', homeScore: 5, awayScore: 0, category: 'SUB-11' },
      { date: '2025-02-08', homeTeam: 'ATLÉTICO CITY', awayTeam: 'BSA', homeScore: 2, awayScore: 1, category: 'SUB-13' },
      { date: '2025-02-08', homeTeam: 'GRÊMIO OCIDENTAL', awayTeam: 'ESTRELA', homeScore: 2, awayScore: 1, category: 'SUB-11' },
      { date: '2025-02-08', homeTeam: 'GRÊMIO OCIDENTAL', awayTeam: 'ESTRELA', homeScore: 4, awayScore: 0, category: 'SUB-13' },
      { date: '2025-02-08', homeTeam: 'LYON', awayTeam: 'MONTE', homeScore: 0, awayScore: 3, category: 'SUB-11' },
      { date: '2025-02-08', homeTeam: 'LYON', awayTeam: 'MONTE', homeScore: 0, awayScore: 2, category: 'SUB-13' },
      
      // 14/02/25
      { date: '2025-02-14', homeTeam: 'MONTE', awayTeam: 'GUERREIROS', homeScore: 3, awayScore: 0, category: 'SUB-11' },
      { date: '2025-02-14', homeTeam: 'MONTE', awayTeam: 'GUERREIROS', homeScore: 8, awayScore: 0, category: 'SUB-13' },
      { date: '2025-02-14', homeTeam: 'ATLÉTICO CITY', awayTeam: 'LYON', homeScore: 1, awayScore: 0, category: 'SUB-11' },
      { date: '2025-02-14', homeTeam: 'ATLÉTICO CITY', awayTeam: 'LYON', homeScore: 3, awayScore: 3, category: 'SUB-13' },
      
      // 15/02/25
      { date: '2025-02-15', homeTeam: 'FEDERAL', awayTeam: 'GRÊMIO OCIDENTAL', homeScore: 2, awayScore: 1, category: 'SUB-11' },
      { date: '2025-02-15', homeTeam: 'FEDERAL', awayTeam: 'GRÊMIO OCIDENTAL', homeScore: 1, awayScore: 3, category: 'SUB-13' },
      { date: '2025-02-15', homeTeam: 'ESTRELA', awayTeam: 'ALVINEGRO', homeScore: 3, awayScore: 1, category: 'SUB-11' },
      { date: '2025-02-15', homeTeam: 'ESTRELA', awayTeam: 'ALVINEGRO', homeScore: 0, awayScore: 2, category: 'SUB-13' },
      
      // 22/02/25
      { date: '2025-02-22', homeTeam: 'LYON', awayTeam: 'BSA', homeScore: 3, awayScore: 1, category: 'SUB-11' },
      { date: '2025-02-22', homeTeam: 'LYON', awayTeam: 'BSA', homeScore: 0, awayScore: 0, category: 'SUB-13' },
      { date: '2025-02-22', homeTeam: 'ATLÉTICO CITY', awayTeam: 'GUERREIROS', homeScore: 2, awayScore: 0, category: 'SUB-11' },
      { date: '2025-02-22', homeTeam: 'ATLÉTICO CITY', awayTeam: 'GUERREIROS', homeScore: 7, awayScore: 0, category: 'SUB-13' },
      
      // 23/02/25
      { date: '2025-02-23', homeTeam: 'FEDERAL', awayTeam: 'ESTRELA', homeScore: 2, awayScore: 0, category: 'SUB-11' },
      { date: '2025-02-23', homeTeam: 'FEDERAL', awayTeam: 'ESTRELA', homeScore: 5, awayScore: 1, category: 'SUB-13' },
      { date: '2025-02-23', homeTeam: 'ALVINEGRO', awayTeam: 'FURACÃO', homeScore: 0, awayScore: 8, category: 'SUB-11' },
      { date: '2025-02-23', homeTeam: 'ALVINEGRO', awayTeam: 'FURACÃO', homeScore: 0, awayScore: 9, category: 'SUB-13' },
      
      // 08/03/25
      { date: '2025-03-08', homeTeam: 'LYON', awayTeam: 'GUERREIROS', homeScore: 1, awayScore: 2, category: 'SUB-11' },
      { date: '2025-03-08', homeTeam: 'LYON', awayTeam: 'GUERREIROS', homeScore: 5, awayScore: 0, category: 'SUB-13' },
      { date: '2025-03-08', homeTeam: 'MONTE', awayTeam: 'BSA', homeScore: 4, awayScore: 1, category: 'SUB-11' },
      { date: '2025-03-08', homeTeam: 'MONTE', awayTeam: 'BSA', homeScore: 1, awayScore: 0, category: 'SUB-13' },
      { date: '2025-03-08', homeTeam: 'FURACÃO', awayTeam: 'ESTRELA', homeScore: 12, awayScore: 0, category: 'SUB-11' },
      { date: '2025-03-08', homeTeam: 'FURACÃO', awayTeam: 'ESTRELA', homeScore: 3, awayScore: 1, category: 'SUB-13' },
      { date: '2025-03-08', homeTeam: 'ALVINEGRO', awayTeam: 'GRÊMIO OCIDENTAL', homeScore: 1, awayScore: 4, category: 'SUB-11' },
      { date: '2025-03-08', homeTeam: 'ALVINEGRO', awayTeam: 'GRÊMIO OCIDENTAL', homeScore: 0, awayScore: 4, category: 'SUB-13' }
    ];
    
    results.push(`Atualizando ${matchesToUpdate.length} resultados de partidas...`);
    
    // For each match, find it in the database and update the score
    for (const match of matchesToUpdate) {
      const homeTeamId = teamIdMap[`${match.homeTeam.toUpperCase().replace(/[^A-Z0-9]/g, '')}-${match.category}`];
      const awayTeamId = teamIdMap[`${match.awayTeam.toUpperCase().replace(/[^A-Z0-9]/g, '')}-${match.category}`];
      
      if (!homeTeamId || !awayTeamId) {
        results.push(`⚠️ Não foi possível encontrar IDs para: ${match.homeTeam} vs ${match.awayTeam} (${match.category})`);
        continue;
      }
      
      // Find the match in the database
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .select('id')
        .eq('date', match.date)
        .eq('home_team', homeTeamId)
        .eq('away_team', awayTeamId)
        .eq('category', match.category);
      
      if (matchError) {
        results.push(`❌ Erro ao buscar partida: ${matchError.message}`);
        continue;
      }
      
      if (matchData && matchData.length > 0) {
        // Update the match with the new score
        const { error: updateError } = await supabase
          .from('matches')
          .update({
            home_score: match.homeScore,
            away_score: match.awayScore,
            status: 'completed'
          })
          .eq('id', matchData[0].id);
        
        if (updateError) {
          results.push(`❌ Erro ao atualizar partida: ${updateError.message}`);
        } else {
          results.push(`✅ Partida atualizada: ${match.homeTeam} ${match.homeScore} x ${match.awayScore} ${match.awayTeam} (${match.category})`);
        }
      } else {
        // Add the match
        const { error: insertError } = await supabase
          .from('matches')
          .insert({
            date: match.date,
            time: '15:00:00',
            location: 'Campo Sintético - Base Forte',
            home_team: homeTeamId,
            away_team: awayTeamId,
            home_score: match.homeScore,
            away_score: match.awayScore,
            status: 'completed',
            category: match.category,
            round: 'Fase de Grupos',
            championship_id: championshipId
          });
        
        if (insertError) {
          results.push(`❌ Erro ao inserir partida: ${insertError.message}`);
        } else {
          results.push(`✅ Partida inserida: ${match.homeTeam} ${match.homeScore} x ${match.awayScore} ${match.awayTeam} (${match.category})`);
        }
      }
    }
    
    // Step 7: Set up semifinal matches
    const semifinalMatches = [
      // SUB-11 Semifinal
      { date: '2025-03-14', homeTeam: 'FURACÃO', awayTeam: 'ATLÉTICO CITY', category: 'SUB-11', round: 'Semifinal' },
      { date: '2025-03-14', homeTeam: 'GRÊMIO OCIDENTAL', awayTeam: 'MONTE', category: 'SUB-11', round: 'Semifinal' },
      // SUB-13 Semifinal
      { date: '2025-03-14', homeTeam: 'FURACÃO', awayTeam: 'MONTE', category: 'SUB-13', round: 'Semifinal' },
      { date: '2025-03-14', homeTeam: 'GRÊMIO OCIDENTAL', awayTeam: 'ATLÉTICO CITY', category: 'SUB-13', round: 'Semifinal' }
    ];
    
    results.push(`Configurando ${semifinalMatches.length} partidas de semifinal...`);
    
    for (const match of semifinalMatches) {
      const homeTeamId = teamIdMap[`${match.homeTeam.toUpperCase().replace(/[^A-Z0-9]/g, '')}-${match.category}`];
      const awayTeamId = teamIdMap[`${match.awayTeam.toUpperCase().replace(/[^A-Z0-9]/g, '')}-${match.category}`];
      
      if (!homeTeamId || !awayTeamId) {
        results.push(`⚠️ Não foi possível encontrar IDs para: ${match.homeTeam} vs ${match.awayTeam} (${match.category})`);
        continue;
      }
      
      // Check if semifinal already exists
      const { data: existingMatch, error: existingMatchError } = await supabase
        .from('matches')
        .select('id')
        .eq('date', match.date)
        .eq('category', match.category)
        .eq('round', match.round)
        .eq('home_team', homeTeamId)
        .eq('away_team', awayTeamId);
      
      if (existingMatchError) {
        results.push(`❌ Erro ao verificar semifinal existente: ${existingMatchError.message}`);
        continue;
      }
      
      if (existingMatch && existingMatch.length > 0) {
        // Update the existing semifinal
        const { error: updateError } = await supabase
          .from('matches')
          .update({
            status: 'scheduled',
            home_score: null,
            away_score: null
          })
          .eq('id', existingMatch[0].id);
        
        if (updateError) {
          results.push(`❌ Erro ao atualizar semifinal: ${updateError.message}`);
        } else {
          results.push(`✅ Semifinal atualizada: ${match.homeTeam} vs ${match.awayTeam} (${match.category})`);
        }
      } else {
        // Create new semifinal
        const { error: insertError } = await supabase
          .from('matches')
          .insert({
            date: match.date,
            time: '15:00:00',
            location: 'Campo Sintético - Base Forte',
            home_team: homeTeamId,
            away_team: awayTeamId,
            status: 'scheduled',
            category: match.category,
            round: match.round,
            championship_id: championshipId
          });
        
        if (insertError) {
          results.push(`❌ Erro ao inserir semifinal: ${insertError.message}`);
        } else {
          results.push(`✅ Semifinal inserida: ${match.homeTeam} vs ${match.awayTeam} (${match.category})`);
        }
      }
    }
    
    // Step 8: Set up final matches
    const finalMatches = [
      // SUB-11 Final
      { date: '2025-03-21', homeTeam: 'FURACÃO', awayTeam: 'MONTE', category: 'SUB-11', round: 'Final' },
      // SUB-13 Final
      { date: '2025-03-21', homeTeam: 'FURACÃO', awayTeam: 'GRÊMIO OCIDENTAL', category: 'SUB-13', round: 'Final' }
    ];
    
    results.push(`Configurando ${finalMatches.length} partidas de final...`);
    
    for (const match of finalMatches) {
      const homeTeamId = teamIdMap[`${match.homeTeam.toUpperCase().replace(/[^A-Z0-9]/g, '')}-${match.category}`];
      const awayTeamId = teamIdMap[`${match.awayTeam.toUpperCase().replace(/[^A-Z0-9]/g, '')}-${match.category}`];
      
      if (!homeTeamId || !awayTeamId) {
        results.push(`⚠️ Não foi possível encontrar IDs para: ${match.homeTeam} vs ${match.awayTeam} (${match.category})`);
        continue;
      }
      
      // Check if final already exists
      const { data: existingMatch, error: existingMatchError } = await supabase
        .from('matches')
        .select('id')
        .eq('date', match.date)
        .eq('category', match.category)
        .eq('round', match.round);
      
      if (existingMatchError) {
        results.push(`❌ Erro ao verificar final existente: ${existingMatchError.message}`);
        continue;
      }
      
      if (existingMatch && existingMatch.length > 0) {
        // Update the existing final
        const { error: updateError } = await supabase
          .from('matches')
          .update({
            home_team: homeTeamId,
            away_team: awayTeamId,
            status: 'scheduled',
            home_score: null,
            away_score: null
          })
          .eq('id', existingMatch[0].id);
        
        if (updateError) {
          results.push(`❌ Erro ao atualizar final: ${updateError.message}`);
        } else {
          results.push(`✅ Final atualizada: ${match.homeTeam} vs ${match.awayTeam} (${match.category})`);
        }
      } else {
        // Create new final
        const { error: insertError } = await supabase
          .from('matches')
          .insert({
            date: match.date,
            time: '15:00:00',
            location: 'Campo Sintético - Base Forte',
            home_team: homeTeamId,
            away_team: awayTeamId,
            status: 'scheduled',
            category: match.category,
            round: match.round,
            championship_id: championshipId
          });
        
        if (insertError) {
          results.push(`❌ Erro ao inserir final: ${insertError.message}`);
        } else {
          results.push(`✅ Final inserida: ${match.homeTeam} vs ${match.awayTeam} (${match.category})`);
        }
      }
    }
    
    // Step 9: Recalculate standings
    results.push("Recalculando tabela de classificação...");
    
    const { error: recalcError } = await supabase.rpc('recalculate_standings');
    
    if (recalcError) {
      results.push(`❌ Erro ao recalcular classificação: ${recalcError.message}`);
    } else {
      results.push(`✅ Tabela de classificação recalculada com sucesso`);
    }
    
    results.push("✅ Processo de atualização de resultados concluído com sucesso!");
    
    return {
      success: true,
      results: results
    };
  } catch (error) {
    console.error('Erro durante a atualização de resultados:', error);
    results.push(`❌ Erro inesperado: ${error.message}`);
    
    return {
      success: false,
      results: results,
      error: error.message
    };
  }
};
