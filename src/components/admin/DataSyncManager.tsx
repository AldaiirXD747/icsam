
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Database, RefreshCw } from 'lucide-react';
import { migrateDataToSupabase } from '@/utils/dataMigration';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const DataSyncManager = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [migrationSummary, setMigrationSummary] = useState<{
    championships: number;
    teams: number;
    players: number;
    matches: number;
    topScorers: number;
    yellowCards: number;
  }>({
    championships: 0,
    teams: 0,
    players: 0,
    matches: 0,
    topScorers: 0,
    yellowCards: 0
  });
  const { toast } = useToast();

  const handleMigration = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setLogs(["Iniciando processo de migração..."]);
    setMigrationSummary({
      championships: 0,
      teams: 0,
      players: 0,
      matches: 0,
      topScorers: 0,
      yellowCards: 0
    });
    
    // Capture console logs
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    
    console.log = (message) => {
      originalConsoleLog(message);
      setLogs(prev => [...prev, `INFO: ${message}`]);
      
      // Update summary counts based on log messages
      if (message.includes('Championship') && message.includes('migrated successfully')) {
        setMigrationSummary(prev => ({ ...prev, championships: prev.championships + 1 }));
      } else if (message.includes('Time') && message.includes('migrado com sucesso')) {
        setMigrationSummary(prev => ({ ...prev, teams: prev.teams + 1 }));
      } else if (message.includes('Player') && message.includes('migrated successfully')) {
        setMigrationSummary(prev => ({ ...prev, players: prev.players + 1 }));
      } else if (message.includes('Match') && message.includes('migrated successfully')) {
        setMigrationSummary(prev => ({ ...prev, matches: prev.matches + 1 }));
      } else if (message.includes('Top scorer') && message.includes('migrated successfully')) {
        setMigrationSummary(prev => ({ ...prev, topScorers: prev.topScorers + 1 }));
      } else if (message.includes('Yellow card leader') && message.includes('migrated successfully')) {
        setMigrationSummary(prev => ({ ...prev, yellowCards: prev.yellowCards + 1 }));
      }
    };
    
    console.error = (message) => {
      originalConsoleError(message);
      setLogs(prev => [...prev, `ERRO: ${message}`]);
    };
    
    try {
      await migrateDataToSupabase();
      
      toast({
        title: "Sincronização concluída",
        description: "Dados migrados com sucesso para o Supabase."
      });
    } catch (error) {
      console.error("Erro durante a migração:", error);
      
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
          
          {(migrationSummary.championships > 0 || 
            migrationSummary.teams > 0 || 
            migrationSummary.players > 0 || 
            migrationSummary.matches > 0 || 
            migrationSummary.topScorers > 0 || 
            migrationSummary.yellowCards > 0) && (
            <div className="mt-4 p-4 border rounded-md bg-blue-50">
              <h3 className="text-md font-medium mb-2">Resumo da Migração:</h3>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <li className="text-sm">Campeonatos: <span className="font-semibold">{migrationSummary.championships}</span></li>
                <li className="text-sm">Times: <span className="font-semibold">{migrationSummary.teams}</span></li>
                <li className="text-sm">Jogadores: <span className="font-semibold">{migrationSummary.players}</span></li>
                <li className="text-sm">Partidas: <span className="font-semibold">{migrationSummary.matches}</span></li>
                <li className="text-sm">Artilheiros: <span className="font-semibold">{migrationSummary.topScorers}</span></li>
                <li className="text-sm">Cartões: <span className="font-semibold">{migrationSummary.yellowCards}</span></li>
              </ul>
            </div>
          )}
          
          {logs.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="logs">
                <AccordionTrigger>Logs de Sincronização ({logs.length})</AccordionTrigger>
                <AccordionContent>
                  <div className="bg-gray-100 p-3 rounded-md max-h-60 overflow-y-auto">
                    {logs.map((log, index) => (
                      <div 
                        key={index} 
                        className={`text-xs mb-1 font-mono ${log.startsWith('ERRO') ? 'text-red-600' : 'text-gray-700'}`}
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSyncManager;
