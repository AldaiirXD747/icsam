import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Calendar, ChevronRight, Clock, Database, FileCheck, Loader2, RefreshCw, Users2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { updateBaseForteResults } from '@/utils/baseForteUpdater';
import { correctAllMatchDates, removeDuplicateMatches, removeGhostMatches } from '@/utils/matchDataManager';

const LoadBaseForteData = () => {
  const [loading, setLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState<{
    success: boolean;
    message?: string;
    updates?: {success: boolean; message: string}[];
  } | null>(null);
  
  const { toast } = useToast();

  const handleUpdateBaseForteData = async () => {
    setLoading(true);
    setResultStatus(null);
    
    try {
      // First, clean up any problematic data
      await removeGhostMatches();
      
      // Update with the Base Forte results
      const result = await updateBaseForteResults();
      
      console.log("Update result:", result);
      
      if (result.success) {
        setResultStatus({
          success: true,
          message: "Dados do Campeonato Base Forte 2024 atualizados com sucesso!",
          updates: result.updates
        });
        
        toast({
          title: "Dados atualizados!",
          description: "Os dados do Base Forte 2024 foram carregados com sucesso.",
          variant: "default",
        });
      } else {
        setResultStatus({
          success: false,
          message: `Erro ao atualizar dados: ${result.error || 'Erro desconhecido'}`,
          updates: result.updates
        });
        
        toast({
          title: "Erro",
          description: `Não foi possível carregar todos os dados: ${result.error || 'Erro desconhecido'}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating Base Forte data:", error);
      
      setResultStatus({
        success: false,
        message: `Erro inesperado: ${error instanceof Error ? error.message : 'Desconhecido'}`,
      });
      
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar os dados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Carregar Dados do Base Forte 2024</h1>
      
      <Tabs defaultValue="load">
        <TabsList className="mb-4">
          <TabsTrigger value="load">Carregar Dados</TabsTrigger>
          <TabsTrigger value="info">Informações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="load">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Atualizar Base de Dados do Campeonato
              </CardTitle>
              <CardDescription>
                Carrega os resultados das partidas do campeonato Base Forte 2024.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Período:</span>
                    <span>08/02/2024 a 22/03/2024</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users2 className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Times:</span>
                    <span>10 equipes em 2 categorias (SUB-11 e SUB-13)</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Categorias:</span>
                    <span>SUB-11 e SUB-13</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <FileCheck className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">Dados carregados:</span>
                    <span>Partidas, placares, categorias e datas</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start space-y-4">
              <Button 
                disabled={loading} 
                onClick={handleUpdateBaseForteData} 
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Carregando dados...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Atualizar Dados do Base Forte 2024
                  </>
                )}
              </Button>
              
              {resultStatus && (
                <div className={`mt-4 w-full p-4 rounded-md ${resultStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  <p className="font-medium">{resultStatus.message}</p>
                  
                  {resultStatus.updates && resultStatus.updates.length > 0 && (
                    <div className="mt-2 max-h-64 overflow-y-auto">
                      <p className="font-medium">Detalhes da atualização:</p>
                      <ul className="list-disc pl-5 mt-1 space-y-1">
                        {resultStatus.updates.map((update, index) => (
                          <li key={index} className={`${update.success ? 'text-green-700' : 'text-red-700'}`}>
                            {update.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Sobre o Processo de Carga</CardTitle>
              <CardDescription>
                Informações sobre o campeonato Base Forte 2024
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Como os dados são carregados?</h3>
                <p className="text-gray-600 mt-1">
                  Este processo carrega os resultados das partidas do campeonato Base Forte 2024, atualiza as classificações e gera estatísticas.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Quais dados são carregados?</h3>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
                  <li>Times participantes (Grupo A e B)</li>
                  <li>Partidas da 1ª a 5ª rodada</li>
                  <li>Resultados dos jogos disputados</li>
                  <li>Datas, horários e locais das partidas</li>
                  <li>Categorias (SUB-11 e SUB-13)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Grupos do Campeonato</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="bg-blue-50 p-3 rounded-md">
                    <h4 className="font-medium text-blue-800">Grupo A:</h4>
                    <ul className="list-disc pl-5 mt-1 space-y-0.5 text-gray-700">
                      <li>Alvinegro</li>
                      <li>Estrela Vermelha</li>
                      <li>Federal</li>
                      <li>Furacão</li>
                      <li>Grêmio Ocidental</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-md">
                    <h4 className="font-medium text-blue-800">Grupo B:</h4>
                    <ul className="list-disc pl-5 mt-1 space-y-0.5 text-gray-700">
                      <li>Atlético City</li>
                      <li>BSA</li>
                      <li>Guerreiros</li>
                      <li>Lyon</li>
                      <li>Monte</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoadBaseForteData;
