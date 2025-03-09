
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, DatabaseIcon } from 'lucide-react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { updateBaseForteMatchResults } from '@/utils/updateMatchResults';

const UpdateMatchResults = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const { toast } = useToast();

  const handleUpdateResults = async () => {
    if (!confirm("Tem certeza que deseja atualizar os resultados das partidas? Isso substituirá os dados existentes.")) {
      return;
    }
    
    try {
      setIsLoading(true);
      setResults([]);
      
      setResults(prev => [...prev, "Iniciando atualização dos resultados das partidas..."]);
      
      const result = await updateBaseForteMatchResults();
      
      if (result.success) {
        toast({
          title: "Operação concluída",
          description: "Resultados das partidas atualizados com sucesso.",
        });
        
        // Convert the update results to strings for display
        const updateMessages = result.updates.map(update => 
          update.success ? `✅ ${update.message}` : `❌ ${update.message}`
        );
        
        setResults(updateMessages);
      } else {
        toast({
          variant: "destructive",
          title: "Erros na operação",
          description: "Houve erros durante a atualização dos resultados.",
        });
        
        // Convert the update results to strings for display
        const updateMessages = result.updates.map(update => 
          update.success ? `✅ ${update.message}` : `❌ ${update.message}`
        );
        
        setResults(updateMessages);
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
        <h1 className="text-2xl font-bold mb-6 text-[#1a237e]">Atualizar Resultados das Partidas</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DatabaseIcon className="h-5 w-5 text-blue-500" />
              Atualizar Resultados das Partidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Esta operação irá atualizar os resultados das partidas do Campeonato Base Forte 2025 conforme especificado.
              </p>
              
              <div className="flex flex-col space-y-2 text-sm text-amber-600">
                <p>⚠️ Esta operação não removará as partidas existentes, apenas atualizará seus resultados.</p>
                <p>⚠️ As classificações serão recalculadas com base nos novos resultados.</p>
              </div>
              
              <Button 
                onClick={handleUpdateResults}
                disabled={isLoading}
                className="w-full bg-[#1a237e] hover:bg-[#0d1864]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Atualizando resultados...
                  </>
                ) : (
                  <>
                    <DatabaseIcon className="mr-2 h-4 w-4" />
                    Atualizar Resultados das Partidas
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
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

export default UpdateMatchResults;
