
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Database, RefreshCw } from 'lucide-react';
import { migrateDataToSupabase } from '@/utils/migrateDataToSupabase';

const DataSyncManager = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const { toast } = useToast();

  const handleMigration = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setLogs(["Starting migration process..."]);
    
    // Capture console logs
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    
    console.log = (message) => {
      originalConsoleLog(message);
      setLogs(prev => [...prev, `INFO: ${message}`]);
    };
    
    console.error = (message) => {
      originalConsoleError(message);
      setLogs(prev => [...prev, `ERROR: ${message}`]);
    };
    
    try {
      await migrateDataToSupabase();
      
      toast({
        title: "Sincronização concluída",
        description: "Dados migrados com sucesso para o Supabase."
      });
    } catch (error) {
      console.error("Error running migration:", error);
      
      toast({
        variant: "destructive",
        title: "Erro na sincronização",
        description: "Ocorreu um erro durante a migração dos dados."
      });
    } finally {
      // Restore original console functions
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      setIsRunning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-[#1a237e]">Sincronização de Dados</CardTitle>
        <CardDescription>
          Sincronize dados entre a área pública e o painel administrativo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Use esta ferramenta para migrar dados existentes para o banco de dados Supabase, 
            garantindo que a área pública e o painel administrativo utilizem a mesma fonte de dados.
          </p>
          
          <Button 
            onClick={handleMigration} 
            disabled={isRunning}
            className="bg-[#1a237e] text-white hover:bg-blue-800"
          >
            {isRunning ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sincronizando...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Iniciar Sincronização de Dados
              </>
            )}
          </Button>
          
          {logs.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Logs de Sincronização:</h3>
              <div className="bg-gray-100 p-3 rounded-md max-h-60 overflow-y-auto">
                {logs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`text-xs mb-1 font-mono ${log.startsWith('ERROR') ? 'text-red-600' : 'text-gray-700'}`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSyncManager;
