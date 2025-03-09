
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileCheck, Loader2, RefreshCw, Table } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { updateMatchResults } from '@/utils/updateMatchResults';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const UpdateMatchResults = () => {
  const [loading, setLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState<{
    success: boolean;
    message?: string;
    updates?: {success: boolean; message: string}[];
  } | null>(null);
  
  const [jsonData, setJsonData] = useState<string>('');
  
  const { toast } = useToast();

  const handleUpdateResults = async () => {
    if (!jsonData.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira os dados dos resultados.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    setResultStatus(null);
    
    try {
      // Parse the JSON data
      const matchResults = JSON.parse(jsonData);
      
      if (!Array.isArray(matchResults)) {
        throw new Error('Os dados devem ser um array de partidas.');
      }
      
      const result = await updateMatchResults(matchResults);
      
      if (result.success) {
        setResultStatus({
          success: true,
          message: "Resultados atualizados com sucesso!",
          updates: result.updates
        });
        
        toast({
          title: "Dados atualizados!",
          description: "Os resultados das partidas foram atualizados com sucesso.",
          variant: "default",
        });
      } else {
        setResultStatus({
          success: false,
          message: `Erro ao atualizar resultados: ${result.error || 'Erro desconhecido'}`,
          updates: result.updates
        });
        
        toast({
          title: "Erro",
          description: `Não foi possível atualizar todos os resultados: ${result.error || 'Erro desconhecido'}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating match results:", error);
      
      setResultStatus({
        success: false,
        message: `Erro no processamento: ${error instanceof Error ? error.message : 'Desconhecido'}`,
      });
      
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar os dados. Verifique o formato do JSON.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exampleData = [
    {
      date: "2024-05-01",
      homeTeamName: "Time A",
      awayTeamName: "Time B",
      category: "SUB-11",
      homeScore: 2,
      awayScore: 1,
      round: "Rodada 1",
      status: "completed"
    },
    {
      date: "2024-05-01",
      homeTeamName: "Time C",
      awayTeamName: "Time D",
      category: "SUB-13",
      homeScore: 0,
      awayScore: 0,
      round: "Rodada 1",
      status: "scheduled"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Atualizar Resultados de Partidas</h1>
      
      <Tabs defaultValue="update">
        <TabsList className="mb-4">
          <TabsTrigger value="update">Atualizar Resultados</TabsTrigger>
          <TabsTrigger value="info">Informações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="update">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Table className="mr-2 h-5 w-5" />
                Atualizar Resultados das Partidas
              </CardTitle>
              <CardDescription>
                Insira os dados das partidas em formato JSON para atualizar os resultados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="jsonInput">Dados JSON</Label>
                  <Textarea
                    id="jsonInput"
                    placeholder="Cole aqui o JSON com os dados das partidas..."
                    rows={10}
                    className="font-mono text-sm"
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Formato esperado: Array de objetos com date, homeTeamName, awayTeamName, category, homeScore, awayScore, etc.
                  </p>
                  <details className="mt-2">
                    <summary className="text-sm text-blue-600 cursor-pointer">
                      Ver exemplo de dados
                    </summary>
                    <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(exampleData, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start space-y-4">
              <Button 
                disabled={loading} 
                onClick={handleUpdateResults} 
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando dados...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Atualizar Resultados
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
              <CardTitle>Sobre a Atualização de Resultados</CardTitle>
              <CardDescription>
                Informações sobre como atualizar resultados de partidas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Como funciona?</h3>
                <p className="text-gray-600 mt-1">
                  Esta ferramenta permite atualizar os resultados de múltiplas partidas de uma só vez, usando dados em formato JSON.
                  O sistema tentará encontrar cada partida no banco de dados e atualizará os placares e status.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Campos disponíveis</h3>
                <div className="mt-2 border rounded overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campo</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Obrigatório</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-sm">
                      <tr>
                        <td className="px-4 py-2 font-medium">date</td>
                        <td className="px-4 py-2">Data da partida (YYYY-MM-DD)</td>
                        <td className="px-4 py-2">Sim</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium">homeTeamName</td>
                        <td className="px-4 py-2">Nome do time da casa</td>
                        <td className="px-4 py-2">Sim</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium">awayTeamName</td>
                        <td className="px-4 py-2">Nome do time visitante</td>
                        <td className="px-4 py-2">Sim</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium">category</td>
                        <td className="px-4 py-2">Categoria (SUB-11, SUB-13, etc)</td>
                        <td className="px-4 py-2">Sim</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium">homeScore</td>
                        <td className="px-4 py-2">Placar do time da casa</td>
                        <td className="px-4 py-2">Sim</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium">awayScore</td>
                        <td className="px-4 py-2">Placar do time visitante</td>
                        <td className="px-4 py-2">Sim</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium">round</td>
                        <td className="px-4 py-2">Rodada ou fase da partida</td>
                        <td className="px-4 py-2">Não</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 font-medium">status</td>
                        <td className="px-4 py-2">Status da partida (scheduled, in_progress, completed, etc)</td>
                        <td className="px-4 py-2">Não</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Observações importantes</h3>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
                  <li>O sistema tentará encontrar a partida pelo time da casa, time visitante, categoria e data</li>
                  <li>Se a partida não for encontrada, ela será criada automaticamente</li>
                  <li>A classificação é recalculada automaticamente após as atualizações</li>
                  <li>Times que não existem no sistema serão ignorados com mensagens de erro</li>
                  <li>Se o status não for informado, será definido como "completed" para partidas com placar</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UpdateMatchResults;
