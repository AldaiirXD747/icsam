
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Database, RefreshCw, TableProperties } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { loadBaseForte2025Data } from '@/utils/dataLoader';
import { updateBaseForteResults } from '@/utils/baseForteUpdater';

const LoadBaseForteData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const { toast } = useToast();

  const handleLoadData = async () => {
    if (!confirm("ATENÇÃO: Esta operação irá remover TODOS os dados existentes de partidas e inserir novos dados para o Campeonato Base Forte 2025. Deseja continuar?")) {
      return;
    }
    
    try {
      setIsLoading(true);
      setResults([]);
      
      setResults(prev => [...prev, "Iniciando carregamento de dados do Campeonato Base Forte 2025..."]);
      
      const result = await loadBaseForte2025Data();
      
      if (result.success) {
        toast({
          title: "Operação concluída",
          description: "Dados do Campeonato Base Forte 2025 carregados com sucesso.",
        });
        
        setResults(result.results);
      } else {
        toast({
          variant: "destructive",
          title: "Erro na operação",
          description: result.error || "Ocorreu um erro durante o carregamento dos dados.",
        });
        
        setResults(result.results);
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro durante o carregamento dos dados.",
      });
      
      setResults(prev => [...prev, `❌ Erro inesperado: ${error.message || 'Desconhecido'}`]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateResults = async () => {
    if (!confirm("ATENÇÃO: Esta operação irá atualizar os resultados das partidas do Campeonato Base Forte 2025. Deseja continuar?")) {
      return;
    }
    
    try {
      setIsLoading(true);
      setResults([]);
      
      setResults(prev => [...prev, "Iniciando atualização de resultados do Campeonato Base Forte 2025..."]);
      
      const result = await updateBaseForteResults();
      
      if (result.success) {
        toast({
          title: "Operação concluída",
          description: "Resultados do Campeonato Base Forte 2025 atualizados com sucesso.",
        });
        
        setResults(result.results);
      } else {
        toast({
          variant: "destructive",
          title: "Erro na operação",
          description: result.error || "Ocorreu um erro durante a atualização dos resultados.",
        });
        
        setResults(result.results);
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro durante a atualização dos resultados.",
      });
      
      setResults(prev => [...prev, `❌ Erro inesperado: ${error.message || 'Desconhecido'}`]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 text-[#1a237e]">Carregar Dados do Campeonato Base Forte 2025</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-500" />
                Carregar Todos os Dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Esta operação irá remover TODOS os dados existentes de partidas, estatísticas e recalcular as classificações, inserindo todos os dados do Campeonato Base Forte 2025 conforme especificado.
                </p>
                
                <div className="flex flex-col space-y-2 text-sm text-red-600">
                  <p>⚠️ ATENÇÃO: Esta é uma operação destrutiva que não pode ser desfeita.</p>
                  <p>⚠️ Todos os dados anteriores de partidas serão removidos.</p>
                  <p>⚠️ As estatísticas serão recalculadas com base nos novos dados.</p>
                </div>
                
                <Button 
                  onClick={handleLoadData}
                  disabled={isLoading}
                  className="w-full bg-[#1a237e] hover:bg-[#0d1864]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Carregando dados...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Carregar Dados do Campeonato Base Forte 2025
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TableProperties className="h-5 w-5 text-green-500" />
                Atualizar Resultados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Esta operação irá atualizar apenas os resultados das partidas do Campeonato Base Forte 2025 conforme especificado, sem remover todos os dados existentes.
                </p>
                
                <div className="flex flex-col space-y-2 text-sm text-amber-600">
                  <p>⚠️ Esta operação atualiza apenas os resultados das partidas.</p>
                  <p>⚠️ As classificações serão recalculadas com base nos novos resultados.</p>
                </div>
                
                <Button 
                  onClick={handleUpdateResults}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Atualizando resultados...
                    </>
                  ) : (
                    <>
                      <TableProperties className="mr-2 h-4 w-4" />
                      Atualizar Resultados das Partidas
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <p className="text-sm text-gray-500">Os resultados da operação aparecerão aqui.</p>
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

export default LoadBaseForteData;
