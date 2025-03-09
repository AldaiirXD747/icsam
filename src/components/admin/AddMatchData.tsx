
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { addBatchMatches, MatchData } from '@/utils/matchDataManager';
import { Loader2 } from 'lucide-react';

const AddMatchData = () => {
  const [inputData, setInputData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  /**
   * Verifies if a date falls on a weekend (Saturday or Sunday)
   */
  const isWeekend = (dateStr: string): boolean => {
    const date = new Date(dateStr);
    const day = date.getDay(); // 0 is Sunday, 6 is Saturday
    return day === 0 || day === 6;
  };

  /**
   * Adjusts a date to the nearest weekend if it's not already on a weekend
   */
  const adjustToWeekend = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = date.getDay(); // 0 is Sunday, 6 is Saturday
    
    if (day === 0 || day === 6) {
      // Already on a weekend
      return dateStr;
    }
    
    // Calculate days until Saturday (6 - day)
    const daysToSaturday = 6 - day;
    date.setDate(date.getDate() + daysToSaturday);
    
    // Format back to YYYY-MM-DD
    return date.toISOString().split('T')[0];
  };

  const parseMatchData = (input: string): MatchData[] => {
    const matches: MatchData[] = [];
    const lines = input.trim().split('\n');
    
    let currentDate = '';
    let currentRound = '';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) continue;
      
      // Check if line contains date and round information
      if (trimmedLine.includes('/')) {
        const parts = trimmedLine.split(' ');
        // Find date part (in format DD/MM/YYYY)
        const datePart = parts.find(part => /\d{2}\/\d{2}\/\d{4}/.test(part));
        if (datePart) {
          // Convert DD/MM/YYYY to YYYY-MM-DD
          const [day, month, year] = datePart.split('/');
          let formattedDate = `${year}-${month}-${day}`;
          
          // Ensure date is on a weekend
          if (!isWeekend(formattedDate)) {
            formattedDate = adjustToWeekend(formattedDate);
            console.log(`Date adjusted to weekend: ${formattedDate}`);
          }
          
          currentDate = formattedDate;
        }
        
        // Find round information
        const roundIndex = parts.findIndex(part => 
          part.toUpperCase().includes('RODADA') || 
          part.toUpperCase().includes('ROUND'));
        
        if (roundIndex !== -1 && roundIndex < parts.length - 1) {
          currentRound = `Rodada ${parts[roundIndex + 1]}`;
        } else if (roundIndex !== -1) {
          currentRound = parts[roundIndex];
        }
        
        continue;
      }
      
      // Improved match pattern to handle various spacing
      // Format examples: 
      // "Team A 1x0 Team B - CATEGORY"
      // "Team A 1x0 Team B -CATEGORY"
      // "Team A 1x0 Team B -   CATEGORY"
      // "Team A 1x0 Team B SUB - 13"
      const matchPattern = /^(.*?)\s+(\d+)x(\d+)\s+(.*?)(?:\s+-\s+|\s+-|\s+)(?:SUB\s*-\s*|\s*)((?:13|11)\b.*?)$/i;
      const match = trimmedLine.match(matchPattern);
      
      if (match) {
        const [, homeTeam, homeScore, awayScore, awayTeam, categoryPart] = match;
        const category = `SUB-${categoryPart.trim()}`;
        
        matches.push({
          date: currentDate,
          time: '12:00', // Default time
          location: 'Campo Central', // Default location
          category: category,
          homeTeamName: homeTeam.trim(),
          awayTeamName: awayTeam.trim(),
          homeScore: parseInt(homeScore),
          awayScore: parseInt(awayScore),
          status: 'completed',
          round: currentRound
        });
      }
    }
    
    return matches;
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      const matches = parseMatchData(inputData);
      
      if (matches.length === 0) {
        toast({
          variant: "destructive",
          title: "Formato inválido",
          description: "Não foi possível identificar partidas no formato esperado."
        });
        return;
      }
      
      // Confirm before proceeding
      if (!window.confirm(`Adicionar ${matches.length} partidas ao sistema?`)) {
        setIsLoading(false);
        return;
      }
      
      console.log('Matches to be added:', matches);
      const result = await addBatchMatches(matches);
      
      if (result.success) {
        toast({
          title: "Partidas adicionadas",
          description: `${matches.length} partidas foram adicionadas com sucesso.`
        });
        setInputData('');
      } else {
        const errorCount = result.results.filter(r => !r.success).length;
        toast({
          variant: "destructive",
          title: "Erro ao adicionar partidas",
          description: `${errorCount} de ${matches.length} partidas não puderam ser adicionadas. Verifique o console para detalhes.`
        });
      }
    } catch (error) {
      console.error('Error adding match data:', error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro ao processar as partidas."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Adicionar Resultados de Partidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-2">
              Cole os resultados das partidas no formato:<br />
              <code>RODADA X DD/MM/AAAA</code><br />
              <code>Time A 3x1 Time B - SUB-13</code><br />
              <code>Time A 2x0 Time B SUB-11</code>
            </p>
            <Textarea
              placeholder="RODADA 3 22/02/2025&#10;Federal 3x1 Estrela Vermelha - SUB-13&#10;Federal 2x0 Estrela Vermelha - SUB-11"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              rows={10}
              className="font-mono"
            />
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !inputData.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Adicionar Partidas'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddMatchData;
