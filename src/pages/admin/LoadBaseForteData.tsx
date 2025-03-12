
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AdminNav from '@/components/admin/AdminNav';
import AdminLayout from '@/components/admin/AdminLayout';
import { populateBaseForteMatches } from '@/utils/baseForteMatches';
import { correctAllMatchDates, removeDuplicateMatches, removeGhostMatches } from '@/utils/matchDataManager';

const LoadBaseForteData = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ step: string; success: boolean; message: string }[]>([]);

  const handleLoadBaseForteMatches = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      const result = await populateBaseForteMatches();
      
      if (result.success) {
        setResults([{ step: 'Carga de partidas Base Forte', success: true, message: result.message || 'Partidas carregadas com sucesso!' }]);
        toast({
          title: "Sucesso!",
          description: "Dados do Base Forte carregados com sucesso.",
          variant: "default",
        });
      } else {
        setResults([{ step: 'Carga de partidas Base Forte', success: false, message: result.error || 'Erro ao carregar partidas.' }]);
        toast({
          title: "Erro!",
          description: result.error || "Erro desconhecido ao carregar dados.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading Base Forte data:", error);
      setResults([{ step: 'Carga de partidas Base Forte', success: false, message: error instanceof Error ? error.message : 'Erro desconhecido' }]);
      toast({
        title: "Erro!",
        description: "Erro ao carregar dados do Base Forte.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDataCleanup = async () => {
    setLoading(true);
    
    const results = [];
    
    // Step 1: Remove ghost matches
    try {
      const resultGhost = await removeGhostMatches();
      results.push({
        step: "Remoção de partidas fantasmas",
        success: resultGhost.success,
        message: resultGhost.message || resultGhost.error || ""
      });
    } catch (error) {
      results.push({
        step: "Remoção de partidas fantasmas", 
        success: false, 
        message: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
    
    // Step 2: Remove duplicate matches
    try {
      const resultDuplicates = await removeDuplicateMatches();
      results.push({
        step: "Remoção de partidas duplicadas",
        success: resultDuplicates.success,
        message: resultDuplicates.message || resultDuplicates.error || ""
      });
    } catch (error) {
      results.push({
        step: "Remoção de partidas duplicadas", 
        success: false, 
        message: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
    
    // Step 3: Correct all match dates
    try {
      const resultDates = await correctAllMatchDates();
      results.push({
        step: "Correção de datas",
        success: resultDates.success,
        message: resultDates.message || resultDates.error || ""
      });
    } catch (error) {
      results.push({
        step: "Correção de datas", 
        success: false, 
        message: error instanceof Error ? error.message : "Erro desconhecido"
      });
    }
    
    setResults(results);
    setLoading(false);
    
    const allSuccess = results.every(r => r.success);
    
    toast({
      title: allSuccess ? "Limpeza concluída!" : "Limpeza parcial",
      description: allSuccess 
        ? "Todas as etapas de limpeza foram concluídas com sucesso." 
        : "Algumas etapas de limpeza não foram concluídas com sucesso.",
      variant: allSuccess ? "default" : "destructive",
    });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Carregar Dados Base Forte</h2>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Carregar Partidas</CardTitle>
            <CardDescription>
              Carrega todas as partidas do campeonato Base Forte 2025 conforme especificação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Esta operação irá carregar todas as partidas do campeonato Base Forte 2025, incluindo resultados das partidas já realizadas e jogos agendados.
              Os dados inseridos são:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-600 mb-4 space-y-1">
              <li>Primeira Rodada (08/02/2025)</li>
              <li>Segunda Rodada (14-15/02/2025)</li>
              <li>Terceira Rodada (22-23/02/2025)</li>
              <li>Quarta Rodada (08/03/2025)</li>
              <li>Quinta Rodada (09/03/2025) - Agendada</li>
              <li>Placeholders para semifinais e finais</li>
            </ul>
            <p className="text-sm text-yellow-600 mb-4">
              <AlertTriangle className="inline-block h-4 w-4 mr-1" />
              A tabela de classificação será recalculada automaticamente após a inserção dos dados.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="default" 
              onClick={handleLoadBaseForteMatches}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Carregando...
                </>
              ) : (
                "Carregar Partidas Base Forte"
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDataCleanup}
              disabled={loading}
            >
              Executar limpeza de dados
            </Button>
          </CardFooter>
        </Card>
        
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Resultados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-md ${
                      result.success ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
                    }`}
                  >
                    <div className="flex items-start">
                      {result.success ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      )}
                      <div>
                        <h3 className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                          {result.step}
                        </h3>
                        <p className={`text-sm mt-1 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                          {result.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default LoadBaseForteData;
