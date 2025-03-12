
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Trash2, DatabaseIcon, AlertTriangle, CheckCircle } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { removeGhostMatches, removeSpecificMatches } from '@/utils/matchDataManager';
import { cleanMatchesOnly } from '@/utils/dataMigration';

const DatabaseCleanup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const { toast } = useToast();

  const handleRemoveGhostMatches = async () => {
    if (!confirm("Tem certeza que deseja remover todas as partidas fantasmas? Essa operação não pode ser desfeita.")) {
      return;
    }
    
    try {
      setIsLoading(true);
      setResults([]);
      
      setResults(prev => [...prev, "Iniciando remoção de partidas fantasmas..."]);
      
      const result = await removeGhostMatches();
      
      if (result.success) {
        toast({
          title: "Operação concluída",
          description: "Partidas fantasmas removidas com sucesso.",
        });
        
        setResults(prev => [...prev, `✅ ${result.message}`]);
      } else {
        toast({
          variant: "destructive",
          title: "Erro na operação",
          description: "Houve um erro durante a remoção das partidas fantasmas.",
        });
        
        setResults(prev => [...prev, `❌ Erro: ${result.error}`]);
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro durante a remoção das partidas fantasmas.",
      });
      
      setResults(prev => [...prev, `❌ Erro inesperado: ${error.message || 'Desconhecido'}`]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSpecificMatches = async () => {
    if (!confirm("Tem certeza que deseja remover as partidas específicas (22/02, 23/02, 08/03)? Essa operação não pode ser desfeita.")) {
      return;
    }
    
    try {
      setIsLoading(true);
      setResults([]);
      
      setResults(prev => [...prev, "Iniciando remoção de partidas específicas..."]);
      
      const result = await removeSpecificMatches();
      
      if (result.success) {
        toast({
          title: "Operação concluída",
          description: "Partidas específicas removidas com sucesso.",
        });
        
        setResults(prev => [...prev, `✅ ${result.message}`]);
      } else {
        toast({
          variant: "destructive",
          title: "Erro na operação",
          description: "Houve um erro durante a remoção das partidas específicas.",
        });
        
        setResults(prev => [...prev, `❌ Erro: ${result.error}`]);
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro durante a remoção das partidas específicas.",
      });
      
      setResults(prev => [...prev, `❌ Erro inesperado: ${error.message || 'Desconhecido'}`]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAllMatches = async () => {
    if (!confirm("Tem certeza que deseja remover TODAS as partidas? Essa operação não pode ser desfeita e removerá todas as estatísticas, classificações e resultados.")) {
      return;
    }
    
    try {
      setIsLoading(true);
      setResults([]);
      
      setResults(prev => [...prev, "Iniciando remoção de TODAS as partidas..."]);
      
      const result = await cleanMatchesOnly();
      
      if (result.success) {
        toast({
          title: "Operação concluída",
          description: "Todas as partidas removidas com sucesso.",
        });
        
        setResults(prev => [...prev, `✅ ${result.message}`]);
      } else {
        toast({
          variant: "destructive",
          title: "Erro na operação",
          description: "Houve um erro durante a remoção das partidas.",
        });
        
        setResults(prev => [...prev, `❌ Erro: ${result.error}`]);
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro durante a remoção das partidas.",
      });
      
      setResults(prev => [...prev, `❌ Erro inesperado: ${error.message || 'Desconhecido'}`]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 text-[#1a237e]">Limpeza de Banco de Dados</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-500" />
                Remover Partidas Fantasmas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Esta operação irá identificar e remover partidas que parecem ser "fantasmas" (sem times válidos ou placares suspeitos).
                </p>
                
                <div className="flex flex-col space-y-2 text-sm text-amber-600">
                  <p>⚠️ Essa operação não pode ser desfeita!</p>
                  <p>⚠️ As partidas removidas serão excluídas permanentemente do banco de dados.</p>
                  <p>⚠️ A classificação será recalculada automaticamente após a remoção.</p>
                </div>
                
                <Button 
                  onClick={handleRemoveGhostMatches}
                  disabled={isLoading}
                  variant="destructive"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removendo partidas...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remover Partidas Fantasmas
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-500" />
                Remover Partidas Específicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Esta operação irá remover partidas específicas de 22/02, 23/02 e 08/03 conforme listadas no código.
                </p>
                
                <div className="flex flex-col space-y-2 text-sm text-amber-600">
                  <p>⚠️ Essa operação não pode ser desfeita!</p>
                  <p>⚠️ As partidas removidas serão excluídas permanentemente do banco de dados.</p>
                  <p>⚠️ A classificação será recalculada automaticamente após a remoção.</p>
                </div>
                
                <Button 
                  onClick={handleRemoveSpecificMatches}
                  disabled={isLoading}
                  variant="destructive"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removendo partidas...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remover Partidas Específicas
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6 col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Remover TODAS as Partidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Esta operação irá remover <strong>TODAS</strong> as partidas do sistema, incluindo todas as estatísticas, 
                  gols, eventos, cartões e classificações. Use com extrema cautela!
                </p>
                
                <div className="flex flex-col space-y-2 text-sm text-red-600 border border-red-300 rounded-md p-3 bg-red-50">
                  <p className="font-bold">⚠️ ATENÇÃO! OPERAÇÃO DESTRUTIVA!</p>
                  <p>⚠️ Esta operação excluirá TODAS as partidas e dados relacionados!</p>
                  <p>⚠️ Esta operação NÃO PODE ser desfeita!</p>
                  <p>⚠️ Os times e campeonatos serão mantidos, mas todos os jogos e estatísticas serão removidos.</p>
                </div>
                
                <Button 
                  onClick={handleRemoveAllMatches}
                  disabled={isLoading}
                  variant="destructive"
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removendo todas as partidas...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      REMOVER TODAS AS PARTIDAS
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-6">
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

export default DatabaseCleanup;
