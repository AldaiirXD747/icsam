
import React from 'react';
import { ListFilter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface StatisticsFiltersProps {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedChampionship: string;
  setSelectedChampionship: (value: string) => void;
  championships: {id: string, name: string}[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

const StatisticsFilters: React.FC<StatisticsFiltersProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedChampionship,
  setSelectedChampionship,
  championships,
  onRefresh,
  isLoading = false
}) => {
  const { toast } = useToast();

  return (
    <div className="flex items-center space-x-2">
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione uma categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas Categorias</SelectItem>
          <SelectItem value="SUB-11">SUB-11</SelectItem>
          <SelectItem value="SUB-13">SUB-13</SelectItem>
          <SelectItem value="SUB-15">SUB-15</SelectItem>
          <SelectItem value="SUB-17">SUB-17</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={selectedChampionship} onValueChange={setSelectedChampionship}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione um campeonato" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos Campeonatos</SelectItem>
          {championships.map(championship => (
            <SelectItem key={championship.id} value={championship.id}>
              {championship.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {onRefresh && (
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading}
          className="mr-2"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      )}
      
      <Button variant="outline" onClick={() => toast({
        title: "Recurso em desenvolvimento",
        description: "A exportação de estatísticas será implementada em breve."
      })}>
        <ListFilter className="mr-2 h-4 w-4" />
        Exportar
      </Button>
    </div>
  );
};

export default StatisticsFilters;
