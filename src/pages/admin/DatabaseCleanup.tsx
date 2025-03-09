
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Trash2, RefreshCw, CalendarClock, FileX } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { removeDuplicateMatches, updateMatchDates, removeSpecificMatches } from '@/utils/matchDataManager';

const DatabaseCleanup = () => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemovingSpecific, setIsRemovingSpecific] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const { toast } = useToast();

  const handleRemoveDuplicates = async () => {
    try {
      setIsRemoving(true);
      setResults(prev => [...prev, "Iniciando remoção de partidas duplicadas..."]);
      
      const result = await removeDuplicateMatches();
      
      if (result.success) {
        toast({
          title: "Operação concluída",
          description: result.message,
        });
        setResults(prev => [...prev, `✅ ${result.message}`]);
      } else {
        toast({
          variant: "destructive",
          title: "Erro na operação",
          description: result.error,
        });
        setResults(prev => [...prev, `❌ Erro: ${result.error}`]);
      }
    } catch (error) {
      console.error('Error removing duplicates:', error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro ao remover duplicatas.",
      });
      setResults(prev => [...prev, "❌ Erro inesperado ao remover duplicatas."]);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleUpdateDates = async () => {
    try {
      setIsUpdating(true);
      setResults(prev => [...prev, "Iniciando atualização de datas..."]);
      
      const result = await updateMatchDates();
      
      if (result.success) {
        toast({
          title: "Operação concluída",
          description: result.message,
        });
        setResults(prev => [...prev, `✅ ${result.message}`]);
      } else {
        toast({
          variant: "destructive",
          title: "Erro na operação",
          description: result.error,
        });
        setResults(prev => [...prev, `❌ Erro: ${result.error}`]);
      }
    } catch (error) {
      console.error('Error updating match dates:', error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro ao atualizar as datas.",
      });
      setResults(prev => [...prev, "❌ Erro inesperado ao atualizar datas."]);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveSpecificMatches = async () => {
    try {
      setIsRemovingSpecific(true);
      setResults(prev => [...prev, "Iniciando remoção de partidas específicas..."]);
      
      const result = await removeSpecificMatches();
      
      if (result.success) {
        toast({
          title: "Operação concluída",
          description: result.message,
        });
        setResults(prev => [...prev, `✅ ${result.message}`]);
      } else {
        toast({
          variant: "destructive",
          title: "Erro na operação",
          description: result.error,
        });
        setResults(prev => [...prev, `❌ Erro: ${result.error}`]);
      }
    } catch (error) {
      console.error('Error removing specific matches:', error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro ao remover as partidas específicas.",
      });
      setResults(prev => [...prev, "❌ Erro inesperado ao remover partidas específicas."]);
    } finally {
      setIsRemovingSpecific(false);
    }
  };

  const executeFullCleanup = async () => {
    // First remove duplicates
    await handleRemoveDuplicates();
    
    // Then update dates
    await handleUpdateDates();
    
    toast({
      title: "Limpeza concluída",
      description: "O processo de limpeza do banco de dados foi concluído.",
    });
    
    setResults(prev => [...prev, "✅ Processo de limpeza completo finalizado."]);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 text-[#1a237e]">Manutenção do Banco de Dados</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-500" />
                Remover Partidas Duplicadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Esta operação identifica e remove partidas duplicadas do banco de dados, 
                mantendo apenas o registro original para cada partida.
              </p>
              <Button 
                variant="destructive" 
                onClick={handleRemoveDuplicates}
                disabled={isRemoving || isUpdating || isRemovingSpecific}
                className="w-full"
              >
                {isRemoving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Removendo...
                  </>
                ) : (
                  'Remover Duplicatas'
                )}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-blue-500" />
                Atualizar Datas das Partidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Esta operação atualiza as datas das partidas de acordo com o mapeamento definido
                (21/02 → 22/02, 22/02 → 23/02, 07/03 → 08/03, 08/03 → 09/03).
              </p>
              <Button 
                variant="outline" 
                onClick={handleUpdateDates}
                disabled={isRemoving || isUpdating || isRemovingSpecific}
                className="w-full"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  'Atualizar Datas'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileX className="h-5 w-5 text-red-500" />
              Remover Partidas Específicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Esta operação remove as partidas específicas listadas nas datas 22/02/2025, 23/02/2025 e 08/03/2025, 
              incluindo todos os jogos das categorias SUB-11 e SUB-13.
            </p>
            <Button 
              variant="destructive"
              onClick={handleRemoveSpecificMatches}
              disabled={isRemoving || isUpdating || isRemovingSpecific}
              className="w-full"
            >
              {isRemovingSpecific ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removendo partidas específicas...
                </>
              ) : (
                'Remover Partidas Específicas'
              )}
            </Button>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-green-500" />
              Executar Limpeza Completa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Esta operação executa todos os processos de limpeza em sequência:
              remove duplicatas e atualiza as datas das partidas restantes.
            </p>
            <Button 
              onClick={executeFullCleanup}
              disabled={isRemoving || isUpdating || isRemovingSpecific}
              className="w-full bg-[#1a237e] hover:bg-[#0d1864]"
            >
              {(isRemoving || isUpdating || isRemovingSpecific) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                'Executar Limpeza Completa'
              )}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <p className="text-sm text-gray-500">Os resultados das operações aparecerão aqui.</p>
            ) : (
              <div className="bg-gray-50 p-4 rounded-md font-mono text-sm max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="mb-1">{result}</div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DatabaseCleanup;
