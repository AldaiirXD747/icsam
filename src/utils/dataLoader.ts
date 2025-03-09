
import { supabase } from '@/integrations/supabase/client';
import { addMatch, removeDuplicateMatches } from './matchDataManager';

interface TeamInfo {
  id: string;
  name: string;
  logo: string;
  category: string;
  group_name: string;
}

/**
 * Loads the Base Forte 2025 Championship data
 */
export const loadBaseForte2025Data = async () => {
  const results: string[] = [];
  try {
    results.push("Iniciando carregamento de dados do Campeonato Base Forte 2025...");
    
    // Step 1: Clean up existing data
    results.push("Removendo partidas existentes...");
    
    // Delete all matches
    const { error: deleteMatchesError } = await supabase
      .from('matches')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteMatchesError) {
      results.push(`❌ Erro ao remover partidas: ${deleteMatchesError.message}`);
      throw deleteMatchesError;
    }
    
    // Delete top scorers
    const { error: deleteTopScorersError } = await supabase
      .from('top_scorers')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteTopScorersError) {
      results.push(`❌ Erro ao remover artilheiros: ${deleteTopScorersError.message}`);
    }
    
    // Delete yellow card leaders
    const { error: deleteYellowCardsError } = await supabase
      .from('yellow_card_leaders')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteYellowCardsError) {
      results.push(`❌ Erro ao remover cartões amarelos: ${deleteYellowCardsError.message}`);
    }
    
    // Clear standings table
    const { error: clearStandingsError } = await supabase
      .from('standings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (clearStandingsError) {
      results.push(`❌ Erro ao limpar tabela de classificação: ${clearStandingsError.message}`);
    }
    
    // Step 2: Create or update championship
    results.push("Criando/atualizando campeonato...");
    
    // Check if championship already exists
    const { data: existingChampionship, error: championshipCheckError } = await supabase
      .from('championships')
      .select('id')
      .eq('name', 'Campeonato Base Forte')
      .eq('year', '2025')
      .limit(1);
    
    if (championshipCheckError) {
      results.push(`❌ Erro ao verificar campeonato existente: ${championshipCheckError.message}`);
      throw championshipCheckError;
    }
    
    let championshipId;
    
    if (existingChampionship && existingChampionship.length > 0) {
      // Update existing championship
      championshipId = existingChampionship[0].id;
      
      const { error: updateChampionshipError } = await supabase
        .from('championships')
        .update({
          description: 'Campeonato Base Forte - Edição 2025',
          start_date: '2025-02-08',
          end_date: '2025-03-21',
          categories: ['SUB-11', 'SUB-13'],
          status: 'ongoing',
          location: 'Santa Maria, DF',
          organizer: 'Instituto Base Forte'
        })
        .eq('id', championshipId);
      
      if (updateChampionshipError) {
        results.push(`❌ Erro ao atualizar campeonato: ${updateChampionshipError.message}`);
        throw updateChampionshipError;
      }
      
      results.push(`✅ Campeonato atualizado com ID: ${championshipId}`);
    } else {
      // Create new championship
      const { data: newChampionship, error: createChampionshipError } = await supabase
        .from('championships')
        .insert({
          name: 'Campeonato Base Forte',
          year: '2025',
          description: 'Campeonato Base Forte - Edição 2025',
          start_date: '2025-02-08',
          end_date: '2025-03-21',
          categories: ['SUB-11', 'SUB-13'],
          status: 'ongoing',
          location: 'Santa Maria, DF',
          organizer: 'Instituto Base Forte',
          banner_image: '/lovable-uploads/d9479deb-326b-4848-89fb-ef3e3f4c9601.png'
        })
        .select('id');
      
      if (createChampionshipError) {
        results.push(`❌ Erro ao criar campeonato: ${createChampionshipError.message}`);
        throw createChampionshipError;
      }
      
      championshipId = newChampionship[0].id;
      results.push(`✅ Novo campeonato criado com ID: ${championshipId}`);
    }
    
    // Step 3: Update teams with correct group assignments
    results.push("Atualizando times com grupos corretos...");
    
    // Fetch existing teams
    const { data: existingTeams, error: teamsError } = await supabase
      .from('teams')
      .select('id, name, logo, category');
    
    if (teamsError) {
      results.push(`❌ Erro ao buscar times existentes: ${teamsError.message}`);
      throw teamsError;
    }
    
    // Map team names to their standard format
    const teamNameMapping: {[key: string]: string} = {
      'FURACÃO': 'Furacão',
      'ESTRELA': 'Estrela Vermelha',
      'ESTRELA VERMELHA': 'Estrela Vermelha',
      'GRÊMIO OCIDENTAL': 'Grêmio Ocidental',
      'FEDERAL': 'Federal',
      'ALVINEGRO': 'Alvinegro',
      'ATLÉTICO CITY': 'Atlético City',
      'MONTE': 'Monte',
      'GUERREIROS': 'Guerreiros',
      'LYON': 'Lyon',
      'BSA': 'BSA'
    };
    
    // Define groups
    const teamGroups: {[key: string]: string} = {
      'Furacão': 'A',
      'Estrela Vermelha': 'A',
      'Grêmio Ocidental': 'A',
      'Federal': 'A',
      'Alvinegro': 'A',
      'Atlético City': 'B',
      'Monte': 'B',
      'Guerreiros': 'B',
      'Lyon': 'B',
      'BSA': 'B'
    };
    
    // Map to hold team info by standardized name
    const teamMap: {[key: string]: TeamInfo} = {};
    
    // Update team groups
    for (const team of existingTeams) {
      const standardName = team.name;
      
      // Check if team needs group update
      if (teamGroups[standardName]) {
        // Update team's group
        const { error: updateTeamError } = await supabase
          .from('teams')
          .update({ group_name: teamGroups[standardName] })
          .eq('id', team.id);
        
        if (updateTeamError) {
          results.push(`❌ Erro ao atualizar grupo do time ${standardName}: ${updateTeamError.message}`);
        } else {
          results.push(`✅ Grupo do time ${standardName} atualizado para ${teamGroups[standardName]}`);
        }
      }
      
      // Store team info for each category
      if (team.category === 'SUB-11' || team.category === 'SUB-13') {
        teamMap[`${standardName}-${team.category}`] = {
          id: team.id,
          name: standardName,
          logo: team.logo,
          category: team.category,
          group_name: teamGroups[standardName] || 'N/A'
        };
      }
    }
    
    // Log team mapping for debugging
    results.push(`Mapeamento de times carregado com ${Object.keys(teamMap).length} entradas`);
    
    // Step 4: Insert match data
    results.push("Inserindo dados de partidas...");
    
    // Helper function to get team ID from name and category
    const getTeamId = (name: string, category: string): string => {
      const standardName = teamNameMapping[name] || name;
      const key = `${standardName}-${category}`;
      
      if (!teamMap[key]) {
        results.push(`⚠️ Time não encontrado: ${name} (${category})`);
        return '';
      }
      
      return teamMap[key].id;
    };
    
    // Function to add match data
    const addMatchData = async (
      date: string,
      homeTeam: string,
      awayTeam: string,
      homeScore: number,
      awayScore: number,
      category: string
    ) => {
      const homeTeamId = getTeamId(homeTeam, category);
      const awayTeamId = getTeamId(awayTeam, category);
      
      if (!homeTeamId || !awayTeamId) {
        results.push(`❌ Não foi possível adicionar partida ${homeTeam} x ${awayTeam} (${category}): Times não encontrados`);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('matches')
          .insert({
            date: date,
            time: '15:00:00',
            location: 'Campo Sintético - Base Forte',
            category: category,
            home_team: homeTeamId,
            away_team: awayTeamId,
            home_score: homeScore,
            away_score: awayScore,
            status: 'completed',
            round: 'Fase de Grupos',
            championship_id: championshipId
          })
          .select();
        
        if (error) {
          results.push(`❌ Erro ao adicionar partida ${homeTeam} x ${awayTeam}: ${error.message}`);
        } else {
          results.push(`✅ Partida adicionada: ${homeTeam} ${homeScore} x ${awayScore} ${awayTeam} (${category})`);
        }
      } catch (e) {
        results.push(`❌ Exceção ao adicionar partida ${homeTeam} x ${awayTeam}: ${e.message}`);
      }
    };
    
    // Add all matches from the provided data
    
    // 08/02/25
    await addMatchData('2025-02-08', 'FEDERAL', 'FURACÃO', 0, 6, 'SUB-11');
    await addMatchData('2025-02-08', 'FEDERAL', 'FURACÃO', 0, 1, 'SUB-13');
    await addMatchData('2025-02-08', 'ATLÉTICO CITY', 'BSA', 5, 0, 'SUB-11');
    await addMatchData('2025-02-08', 'ATLÉTICO CITY', 'BSA', 2, 1, 'SUB-13');
    await addMatchData('2025-02-08', 'GRÊMIO OCIDENTAL', 'ESTRELA', 2, 1, 'SUB-11');
    await addMatchData('2025-02-08', 'GRÊMIO OCIDENTAL', 'ESTRELA', 4, 0, 'SUB-13');
    await addMatchData('2025-02-08', 'LYON', 'MONTE', 0, 3, 'SUB-11');
    await addMatchData('2025-02-08', 'LYON', 'MONTE', 0, 2, 'SUB-13');
    
    // 14/02/25
    await addMatchData('2025-02-14', 'ATLÉTICO CITY', 'LYON', 1, 0, 'SUB-11');
    await addMatchData('2025-02-14', 'ATLÉTICO CITY', 'LYON', 3, 3, 'SUB-13');
    await addMatchData('2025-02-14', 'MONTE', 'GUERREIROS', 3, 0, 'SUB-11');
    await addMatchData('2025-02-14', 'MONTE', 'GUERREIROS', 8, 0, 'SUB-13');
    
    // 15/02/25
    await addMatchData('2025-02-15', 'FEDERAL', 'GRÊMIO OCIDENTAL', 2, 1, 'SUB-11');
    await addMatchData('2025-02-15', 'FEDERAL', 'GRÊMIO OCIDENTAL', 1, 3, 'SUB-13');
    await addMatchData('2025-02-15', 'ESTRELA', 'ALVINEGRO', 3, 1, 'SUB-11');
    await addMatchData('2025-02-15', 'ESTRELA', 'ALVINEGRO', 0, 2, 'SUB-13');
    
    // 22/02/25
    await addMatchData('2025-02-22', 'LYON', 'BSA', 3, 1, 'SUB-11');
    await addMatchData('2025-02-22', 'LYON', 'BSA', 0, 0, 'SUB-13');
    await addMatchData('2025-02-22', 'ATLÉTICO CITY', 'GUERREIROS', 2, 0, 'SUB-11');
    await addMatchData('2025-02-22', 'ATLÉTICO CITY', 'GUERREIROS', 7, 0, 'SUB-13');
    
    // 23/02/25
    await addMatchData('2025-02-23', 'FEDERAL', 'ESTRELA VERMELHA', 2, 0, 'SUB-11');
    await addMatchData('2025-02-23', 'FEDERAL', 'ESTRELA VERMELHA', 5, 1, 'SUB-13');
    await addMatchData('2025-02-23', 'ALVINEGRO', 'FURACÃO', 0, 8, 'SUB-11');
    await addMatchData('2025-02-23', 'ALVINEGRO', 'FURACÃO', 0, 9, 'SUB-13');
    
    // 08/03/25
    await addMatchData('2025-03-08', 'LYON', 'GUERREIROS', 1, 2, 'SUB-11');
    await addMatchData('2025-03-08', 'LYON', 'GUERREIROS', 5, 0, 'SUB-13');
    await addMatchData('2025-03-08', 'MONTE', 'BSA', 4, 1, 'SUB-11');
    await addMatchData('2025-03-08', 'MONTE', 'BSA', 1, 0, 'SUB-13');
    await addMatchData('2025-03-08', 'FURACÃO', 'ESTRELA VERMELHA', 12, 0, 'SUB-11');
    await addMatchData('2025-03-08', 'FURACÃO', 'ESTRELA VERMELHA', 3, 1, 'SUB-13');
    await addMatchData('2025-03-08', 'ALVINEGRO', 'GRÊMIO OCIDENTAL', 1, 4, 'SUB-11');
    await addMatchData('2025-03-08', 'ALVINEGRO', 'GRÊMIO OCIDENTAL', 0, 4, 'SUB-13');
    
    // Add semifinal matches (TBD)
    // SUB-11 Semifinal (14/03/25)
    await addMatchData('2025-03-14', 'FURACÃO', 'ATLÉTICO CITY', 0, 0, 'SUB-11');
    await addMatchData('2025-03-14', 'GRÊMIO OCIDENTAL', 'MONTE', 0, 0, 'SUB-11');
    
    // SUB-13 Semifinal (14/03/25)
    await addMatchData('2025-03-14', 'FURACÃO', 'MONTE', 0, 0, 'SUB-13');
    await addMatchData('2025-03-14', 'GRÊMIO OCIDENTAL', 'ATLÉTICO CITY', 0, 0, 'SUB-13');
    
    // Update semifinal matches with 'semifinal' round and 'scheduled' status
    const { error: updateSemifinalsError } = await supabase
      .from('matches')
      .update({ 
        round: 'Semifinal',
        status: 'scheduled',
        home_score: null,
        away_score: null
      })
      .eq('date', '2025-03-14');
    
    if (updateSemifinalsError) {
      results.push(`❌ Erro ao atualizar partidas da semifinal: ${updateSemifinalsError.message}`);
    } else {
      results.push(`✅ Partidas da semifinal atualizadas para status 'agendado'`);
    }
    
    // Add final matches (TBD)
    // SUB-11 Final (21/03/25)
    await addMatchData('2025-03-21', 'FURACÃO', 'MONTE', 0, 0, 'SUB-11');
    
    // SUB-13 Final (21/03/25)
    await addMatchData('2025-03-21', 'FURACÃO', 'GRÊMIO OCIDENTAL', 0, 0, 'SUB-13');
    
    // Update final matches with 'final' round and 'scheduled' status
    const { error: updateFinalsError } = await supabase
      .from('matches')
      .update({ 
        round: 'Final',
        status: 'scheduled',
        home_score: null,
        away_score: null
      })
      .eq('date', '2025-03-21');
    
    if (updateFinalsError) {
      results.push(`❌ Erro ao atualizar partidas da final: ${updateFinalsError.message}`);
    } else {
      results.push(`✅ Partidas da final atualizadas para status 'agendado'`);
    }
    
    // Step 5: Recalculate standings
    results.push("Recalculando tabela de classificação...");
    
    const { error: recalcError } = await supabase.rpc('recalculate_standings');
    
    if (recalcError) {
      results.push(`❌ Erro ao recalcular classificação: ${recalcError.message}`);
    } else {
      results.push(`✅ Tabela de classificação recalculada com sucesso`);
    }
    
    results.push("✅ Processo de carregamento de dados concluído com sucesso!");
    
    return {
      success: true,
      results: results
    };
  } catch (error) {
    console.error('Erro durante o carregamento de dados:', error);
    results.push(`❌ Erro inesperado: ${error.message}`);
    
    return {
      success: false,
      results: results,
      error: error.message
    };
  }
};
