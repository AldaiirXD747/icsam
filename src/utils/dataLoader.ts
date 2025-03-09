
import { supabase } from '@/integrations/supabase/client';
import { updateBaseForteResults } from './baseForteUpdater';

export const loadBaseForte2025Data = async () => {
  try {
    const results: string[] = [];
    
    // Passo 1: Verificar se o campeonato já existe
    results.push("🔍 Verificando se o campeonato Base Forte 2025 já existe...");
    
    const { data: existingChampionship, error: championshipError } = await supabase
      .from('championships')
      .select('id')
      .eq('name', 'Campeonato Base Forte')
      .eq('year', '2025')
      .single();
    
    if (championshipError && championshipError.code !== 'PGRST116') {
      console.error('Erro ao verificar campeonato:', championshipError);
      results.push(`❌ Erro ao verificar campeonato: ${championshipError.message}`);
      return { 
        success: false, 
        error: 'Erro ao verificar campeonato', 
        results 
      };
    }
    
    let championshipId = '';
    
    // Se o campeonato não existir, criar um novo
    if (!existingChampionship) {
      results.push("📝 Campeonato não encontrado. Criando novo campeonato...");
      
      const { data: newChampionship, error: createError } = await supabase
        .from('championships')
        .insert({
          name: 'Campeonato Base Forte',
          year: '2025',
          description: 'Campeonato organizado pelo Instituto Criança Santa Maria',
          banner_image: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/banner-campeonato.jpg',
          start_date: '2025-02-08',
          end_date: '2025-03-22',
          location: 'São Paulo',
          categories: ['SUB-11', 'SUB-13'],
          organizer: 'Instituto Criança Santa Maria',
          sponsors: ['Patrocinador 1', 'Patrocinador 2'],
          status: 'ongoing'
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Erro ao criar campeonato:', createError);
        results.push(`❌ Erro ao criar campeonato: ${createError.message}`);
        return { 
          success: false, 
          error: 'Erro ao criar campeonato', 
          results 
        };
      }
      
      championshipId = newChampionship.id;
      results.push(`✅ Campeonato criado com ID: ${championshipId}`);
    } else {
      championshipId = existingChampionship.id;
      results.push(`✅ Campeonato existente encontrado com ID: ${championshipId}`);
    }
    
    // Passo 2: Verificar se os times já estão cadastrados
    results.push("🔍 Verificando times cadastrados...");
    
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('name, category')
      .in('category', ['SUB-11', 'SUB-13']);
    
    if (teamsError) {
      console.error('Erro ao verificar times:', teamsError);
      results.push(`❌ Erro ao verificar times: ${teamsError.message}`);
      return { 
        success: false, 
        error: 'Erro ao verificar times', 
        results 
      };
    }
    
    // Mapear os times existentes
    const existingTeams = new Set();
    teams?.forEach(team => {
      existingTeams.add(`${team.name}-${team.category}`);
    });
    
    const requiredTeams = [
      { name: 'Furacão', logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png', group: 'A' },
      { name: 'Estrela Vermelha', logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/5.png', group: 'A' },
      { name: 'Grêmio Ocidental', logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/Captura-de-tela-2025-02-13-112406.png', group: 'A' },
      { name: 'Federal', logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/6.png', group: 'A' },
      { name: 'Alvinegro', logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/1.png', group: 'A' },
      { name: 'Atlético City', logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/7.png', group: 'B' },
      { name: 'Monte', logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/2.png', group: 'B' },
      { name: 'Guerreiros', logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/9.png', group: 'B' },
      { name: 'Lyon', logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/lion.png', group: 'B' },
      { name: 'BSA', logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/4.png', group: 'B' }
    ];
    
    // Passo 3: Inserir times que não existem
    for (const team of requiredTeams) {
      for (const category of ['SUB-11', 'SUB-13']) {
        if (!existingTeams.has(`${team.name}-${category}`)) {
          results.push(`📝 Inserindo time ${team.name} (${category}) no grupo ${team.group}...`);
          
          const { error: insertTeamError } = await supabase
            .from('teams')
            .insert({
              name: team.name,
              logo: team.logo,
              category: category,
              group_name: team.group
            });
          
          if (insertTeamError) {
            console.error(`Erro ao inserir time ${team.name}:`, insertTeamError);
            results.push(`❌ Erro ao inserir time ${team.name}: ${insertTeamError.message}`);
          } else {
            results.push(`✅ Time ${team.name} (${category}) inserido no grupo ${team.group}`);
          }
        } else {
          results.push(`✅ Time ${team.name} (${category}) já existe no sistema`);
        }
      }
    }
    
    // Passo 4: Atualizar as partidas e resultados
    results.push("🔄 Atualizando partidas e resultados...");
    
    const updateResult = await updateBaseForteResults();
    results.push(...updateResult.results);
    
    if (!updateResult.success) {
      return { 
        success: false, 
        error: 'Erro ao atualizar partidas e resultados', 
        results 
      };
    }
    
    // Passo 5: Verificar tabela de classificação
    results.push("🔍 Verificando tabela de classificação...");
    
    const { error: standingsError } = await supabase.rpc('recalculate_standings');
    if (standingsError) {
      console.error('Erro ao recalcular classificações:', standingsError);
      results.push(`❌ Erro ao recalcular classificações: ${standingsError.message}`);
      return { 
        success: false, 
        error: 'Erro ao recalcular classificações', 
        results 
      };
    }
    
    results.push("✅ Classificações recalculadas com sucesso");
    
    // Concluir a operação
    results.push("🎉 Operação concluída! Todos os dados do Campeonato Base Forte 2025 foram carregados com sucesso.");
    
    return {
      success: true,
      results
    };
  } catch (error) {
    console.error('Erro inesperado ao carregar dados:', error);
    return {
      success: false,
      error: 'Erro inesperado ao carregar dados',
      results: [`❌ Erro inesperado: ${error.message || error}`]
    };
  }
};
