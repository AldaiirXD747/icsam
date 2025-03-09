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
   * Maps specific dates according to the defined mapping rules:
   * 21/02/2025 -> 22/02/2025
   * 22/02/2025 -> 23/02/2025
   * 07/03/2025 -> 08/03/2025
   * 08/03/2025 -> 09/03/2025
   */
  const adjustToWeekend = (dateStr: string): string => {
    // First check if the date is already in correct format
    const date = new Date(dateStr);
    
    // Apply the specific date mappings
    // Format in the database is YYYY-MM-DD
    if (dateStr === '2025-02-21') {
      return '2025-02-22';
    } else if (dateStr === '2025-02-22') {
      return '2025-02-23'; 
    } else if (dateStr === '2025-03-07') {
      return '2025-03-08';
    } else if (dateStr === '2025-03-08') {
      return '2025-03-09';
    }
    
    // Special handling for March 2025 dates
    const month = date.getMonth(); // 0-indexed, so 2 = March
    const year = date.getFullYear();
    
    if (month === 2 && year === 2025) {
      // Map weekday dates to the specific weekend (8-9 March 2025)
      const day = date.getDate();
      
      if (day <= 7) {
        // First week of March - map to Saturday March 8
        return '2025-03-08';
      } else if (day > 9 && day <= 14) {
        // Second week of March - map to Sunday March 9
        return '2025-03-09';
      } else if (day > 14) {
        // For later dates in March, use the nearest weekend
        const daysUntilSaturday = (6 - date.getDay()) % 7;
        date.setDate(date.getDate() + daysUntilSaturday);
        return date.toISOString().split('T')[0];
      }
    }
    
    // For February 2025 dates
    if (month === 1 && year === 2025) {
      const day = date.getDate();
      
      if (day <= 21) {
        // Map to Saturday February 22
        return '2025-02-22';
      } else {
        // Map to Sunday February 23
        return '2025-02-23';
      }
    }
    
    // If not a special case and not on weekend, move to nearest weekend
    if (!isWeekend(dateStr)) {
      const daysToSaturday = (6 - date.getDay()) % 7;
      date.setDate(date.getDate() + daysToSaturday);
      return date.toISOString().split('T')[0];
    }
    
    // Already a weekend date and not in our mapping rules, return as is
    return dateStr;
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
          
          // Apply date mapping to ensure correct dates
          formattedDate = adjustToWeekend(formattedDate);
          
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
              placeholder="RODADA 3 08/03/2025&#10;Federal 3x1 Estrela Vermelha - SUB-13&#10;Federal 2x0 Estrela Vermelha - SUB-11"
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
