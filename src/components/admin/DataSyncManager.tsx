
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, RefreshCw, AlertTriangle, Trash2, RotateCcw } from 'lucide-react';
import { cleanAllData, migrateDataToSupabase, resetMatchResultsAndStandings } from '@/utils/dataMigration';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const DataSyncManager = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [activeTab, setActiveTab] = useState('sync');
  const [migrationResult, setMigrationResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

  const handleMigration = async () => {
    try {
      setIsMigrating(true);
      setMigrationResult(null);
      
      const result = await migrateDataToSupabase();
      
      setMigrationResult({
        success: result,
        message: result 
          ? "Migração de dados concluída com sucesso!" 
          : "A migração automática foi desativada. Use o Painel Admin para cadastrar dados."
      });
      
      toast({
        title: result ? "Sucesso" : "Informação",
        description: result 
          ? "Dados migrados com sucesso!" 
          : "A migração automática foi desativada. Use o Painel Admin para cadastrar dados.",
        variant: result ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Erro durante a migração:", error);
      setMigrationResult({
        success: false,
        message: `Erro durante a migração: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      });
      
      toast({
        title: "Erro",
        description: "Houve um erro durante a migração de dados.",
        variant: "destructive",
      });
    } finally {
      setIsMigrating(false);
    }
  };

  const handleCleanData = async () => {
    if (!confirm("ATENÇÃO: Esta ação irá apagar TODOS os dados do sistema. Deseja continuar?")) {
      return;
    }
    
    try {
      setIsCleaning(true);
      setMigrationResult(null);
      
      const result = await cleanAllData();
      
      setMigrationResult({
        success: result,
        message: result 
          ? "Todos os dados foram apagados com sucesso!" 
          : "Houve um erro ao apagar os dados."
      });
      
      toast({
        title: result ? "Sucesso" : "Erro",
        description: result 
          ? "Todos os dados foram apagados. Você pode começar a cadastrar novos dados pelo Painel Admin." 
          : "Houve um erro ao apagar os dados.",
        variant: result ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Erro durante a limpeza de dados:", error);
      setMigrationResult({
        success: false,
        message: `Erro durante a limpeza: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      });
      
      toast({
        title: "Erro",
        description: "Houve um erro durante a limpeza de dados.",
        variant: "destructive",
      });
    } finally {
      setIsCleaning(false);
    }
  };

  const handleResetResults = async () => {
    if (!confirm("ATENÇÃO: Esta ação irá apagar TODOS os resultados de partidas e resetar a classificação. Deseja continuar?")) {
      return;
    }
    
    try {
      setIsResetting(true);
      setMigrationResult(null);
      
      const result = await resetMatchResultsAndStandings();
      
      if (result.success) {
        setMigrationResult({
          success: true,
          message: "Todos os resultados de partidas e classificações foram resetados com sucesso!"
        });
        
        toast({
          title: "Sucesso",
          description: "Todos os resultados e classificações foram resetados. Você pode inserir os novos resultados agora.",
        });
      } else {
        setMigrationResult({
          success: false,
          message: `Erro durante o reset: ${result.error || 'Erro desconhecido'}`
        });
        
        toast({
          title: "Erro",
          description: `Houve um erro durante o reset: ${result.error || 'Erro desconhecido'}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erro durante o reset de resultados:", error);
      setMigrationResult({
        success: false,
        message: `Erro durante o reset: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      });
      
      toast({
        title: "Erro",
        description: "Houve um erro durante o reset de resultados.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleRecalculateStandings = async () => {
    try {
      setIsMigrating(true);
      setMigrationResult(null);
      
      const { error } = await supabase.rpc("recalculate_standings");
      
      if (error) throw error;
      
      setMigrationResult({
        success: true,
        message: "Classificação recalculada com sucesso!"
      });
      
      toast({
        title: "Sucesso",
        description: "Classificação recalculada com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao recalcular classificação:", error);
      setMigrationResult({
        success: false,
        message: `Erro ao recalcular classificação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      });
      
      toast({
        title: "Erro",
        description: "Houve um erro ao recalcular a classificação.",
        variant: "destructive",
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-blue-primary flex items-center">
          <Database className="mr-2 h-5 w-5" />
          Gerenciamento de Dados
        </CardTitle>
        <CardDescription>
          Gerencie a sincronização de dados e outras operações do sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="sync">Sincronização</TabsTrigger>
            <TabsTrigger value="reset">Reset de Resultados</TabsTrigger>
            <TabsTrigger value="clean">Limpeza de Dados</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sync">
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Atenção</AlertTitle>
                <AlertDescription>
                  A sincronização automática está desativada. Por favor, cadastre todos os dados através do Painel Administrativo.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col gap-4">
                <Button 
                  variant="outline" 
                  onClick={handleRecalculateStandings}
                  disabled={isMigrating}
                  className="flex items-center"
                >
                  {isMigrating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Recalculando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Recalcular Classificação
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reset">
            <div className="space-y-4">
              <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Atenção: Reset de Resultados</AlertTitle>
                <AlertDescription>
                  Esta ação irá apagar todos os resultados de partidas e resetar a classificação.
                  Os times e partidas serão mantidos, mas os resultados e estatísticas serão zerados.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col gap-4">
                <Button 
                  variant="warning" 
                  onClick={handleResetResults}
                  disabled={isResetting}
                  className="flex items-center bg-amber-500 hover:bg-amber-600 text-white"
                >
                  {isResetting ? (
                    <>
                      <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                      Resetando Resultados...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Resetar Resultados e Classificação
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="clean">
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Atenção: Ação Destrutiva</AlertTitle>
                <AlertDescription>
                  Esta ação irá apagar TODOS os dados do sistema (times, campeonatos, jogadores, partidas, etc).
                  Esta ação não pode ser desfeita!
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col gap-4">
                <Button 
                  variant="destructive" 
                  onClick={handleCleanData}
                  disabled={isCleaning}
                  className="flex items-center"
                >
                  {isCleaning ? (
                    <>
                      <Trash2 className="mr-2 h-4 w-4 animate-spin" />
                      Limpando Dados...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Apagar Todos os Dados
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {migrationResult && (
          <Alert variant={migrationResult.success ? "default" : "destructive"} className="mt-4">
            <AlertTitle>{migrationResult.success ? "Sucesso" : "Erro"}</AlertTitle>
            <AlertDescription>
              {migrationResult.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        Última atualização: {new Date().toLocaleString()}
      </CardFooter>
    </Card>
  );
};

export default DataSyncManager;
