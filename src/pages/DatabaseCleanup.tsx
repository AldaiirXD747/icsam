
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';
import { deleteAllMatchData, resetMatchResults } from '@/lib/matchApi';

const DatabaseCleanup = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleDeleteAllMatches = async () => {
    if (!window.confirm('Tem certeza que deseja apagar TODAS as partidas e estatísticas? Esta ação não pode ser desfeita.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const success = await deleteAllMatchData();
      if (success) {
        toast.success('Todas as partidas e estatísticas foram apagadas com sucesso');
      } else {
        toast.error('Erro ao apagar as partidas');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao apagar as partidas');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetResults = async () => {
    if (!window.confirm('Tem certeza que deseja resetar todos os resultados das partidas? Esta ação não pode ser desfeita.')) {
      return;
    }

    setIsResetting(true);
    try {
      const success = await resetMatchResults();
      if (success) {
        toast.success('Todos os resultados foram resetados com sucesso');
      } else {
        toast.error('Erro ao resetar os resultados');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao resetar os resultados');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 pt-20">
      <h1 className="text-3xl font-bold mb-6 text-blue-primary">Limpeza do Banco de Dados</h1>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Apagar Todas as Partidas</CardTitle>
            <CardDescription>
              Remove todas as partidas e suas estatísticas do sistema, mantendo times e campeonatos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAllMatches}
              disabled={isDeleting}
              className="w-full sm:w-auto"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Apagando...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Apagar Todas as Partidas
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resetar Resultados</CardTitle>
            <CardDescription>
              Limpa os resultados de todas as partidas (placar e status), mantendo as partidas agendadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              onClick={handleResetResults}
              disabled={isResetting}
              className="w-full sm:w-auto"
            >
              {isResetting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetando...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Resetar Todos os Resultados
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DatabaseCleanup;
