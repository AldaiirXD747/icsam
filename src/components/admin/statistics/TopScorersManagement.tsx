
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import StatisticsChart from './StatisticsChart';
import { TopScorer } from '@/types';

interface TopScorerDisplayItem {
  id: string;
  name: string;
  gols: number;
  time: string;
}

interface TopScorersManagementProps {
  isLoading?: boolean;
  topScorers?: TopScorer[];
  setTopScorers?: React.Dispatch<React.SetStateAction<TopScorer[]>>;
  filteredTopScorers?: TopScorer[];
  selectedCategory?: string;
  teams?: { id: string, name: string }[];
  players?: { id: string, name: string, team_id: string }[];
  championships?: { id: string, name: string }[];
}

const TopScorersManagement: React.FC<TopScorersManagementProps> = ({
  isLoading,
  topScorers,
  setTopScorers,
  filteredTopScorers,
  selectedCategory,
  teams,
  players,
  championships
}) => {
  const [category, setCategory] = useState<string>('Sub-15');
  const [search, setSearch] = useState<string>('');
  const [displayScorers, setDisplayScorers] = useState<TopScorerDisplayItem[]>([
    { id: '1', name: 'João Silva', gols: 20, time: 'Flamengo' },
    { id: '2', name: 'Pedro Santos', gols: 18, time: 'Vasco' },
    { id: '3', name: 'Lucas Oliveira', gols: 15, time: 'Botafogo' },
    { id: '4', name: 'Gabriel Souza', gols: 12, time: 'Fluminense' },
    { id: '5', name: 'Matheus Costa', gols: 10, time: 'Santos' },
    { id: '6', name: 'Rafael Almeida', gols: 8, time: 'Palmeiras' },
  ]);

  useEffect(() => {
    // Simulate fetching data from an API based on category and search
    const filteredTopScorers = [
        { id: '1', name: 'João Silva', gols: 20, time: 'Flamengo' },
        { id: '2', name: 'Pedro Santos', gols: 18, time: 'Vasco' },
        { id: '3', name: 'Lucas Oliveira', gols: 15, time: 'Botafogo' },
        { id: '4', name: 'Gabriel Souza', gols: 12, time: 'Fluminense' },
        { id: '5', name: 'Matheus Costa', gols: 10, time: 'Santos' },
        { id: '6', name: 'Rafael Almeida', gols: 8, time: 'Palmeiras' },
    ].filter(scorer =>
      scorer.name.toLowerCase().includes(search.toLowerCase()) &&
      scorer.time.toLowerCase().includes(category.toLowerCase())
    );
    setDisplayScorers(filteredTopScorers);
  }, [category, search]);

  // Fix the chart data format to properly match the StatisticsChart component requirements
  const chartData = displayScorers.map(scorer => ({
    name: scorer.name,
    value: scorer.gols, // Changed from 'gols' to 'value' as required by StatisticsChart
    time: scorer.time
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-[#1a237e]">Artilheiros</CardTitle>
        <CardDescription>Gerencie os artilheiros por categoria e visualize estatísticas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sub-11">Sub-11</SelectItem>
                <SelectItem value="Sub-13">Sub-13</SelectItem>
                <SelectItem value="Sub-15">Sub-15</SelectItem>
                <SelectItem value="Sub-17">Sub-17</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="search">Pesquisar</Label>
            <Input
              type="search"
              id="search"
              placeholder="Pesquisar por nome"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <StatisticsChart 
          data={chartData} 
          dataKey="value" 
          name="Gols" 
          fill="#4CAF50" 
        />

        <Table>
          <TableCaption>Lista de artilheiros</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Gols</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayScorers.map((scorer) => (
              <TableRow key={scorer.id}>
                <TableCell className="font-medium">{scorer.id}</TableCell>
                <TableCell>{scorer.name}</TableCell>
                <TableCell>{scorer.time}</TableCell>
                <TableCell>{scorer.gols}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TopScorersManagement;
