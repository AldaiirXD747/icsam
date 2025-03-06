
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllYellowCards } from '@/services/yellowCardService';
import StatisticsChart from './StatisticsChart';
import { YellowCardLeader } from '@/types';

interface YellowCard {
  id: string;
  name: string;
  cartões: number;
  time: string;
}

interface YellowCardManagementProps {
  isLoading?: boolean;
  yellowCardLeaders?: YellowCardLeader[];
  setYellowCardLeaders?: React.Dispatch<React.SetStateAction<YellowCardLeader[]>>;
  filteredYellowCardLeaders?: YellowCardLeader[];
  selectedCategory?: string;
  teams?: { id: string, name: string }[];
  players?: { id: string, name: string, team_id: string }[];
  championships?: { id: string, name: string }[];
}

const YellowCardManagement: React.FC<YellowCardManagementProps> = ({
  isLoading,
  yellowCardLeaders,
  setYellowCardLeaders,
  filteredYellowCardLeaders,
  selectedCategory,
  teams,
  players,
  championships
}) => {
  const [yellowCards, setYellowCards] = useState<YellowCard[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("all");
  const [filteredYellowCards, setFilteredYellowCards] = useState<YellowCard[]>([]);

  useEffect(() => {
    const fetchYellowCards = async () => {
      try {
        const data = await getAllYellowCards();
        setYellowCards(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchYellowCards();
  }, []);

  useEffect(() => {
    // Filter yellowCards based on selectedTime
    if (selectedTime === "all") {
      setFilteredYellowCards(yellowCards);
    } else {
      const filtered = yellowCards.filter(card => card.time === selectedTime);
      setFilteredYellowCards(filtered);
    }
  }, [yellowCards, selectedTime]);

  // Extract unique times for the select
  const times = [...new Set(yellowCards.map(card => card.time))];

  // Fix the chart data format to properly match the StatisticsChart component requirements
  const chartData = yellowCards.map(card => ({
    name: card.name,
    value: card.cartões, // Changed from 'gols' to 'value' as required by StatisticsChart
    time: card.time
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Cartões Amarelos</CardTitle>
        <CardDescription>Visualize e gerencie os líderes de cartões amarelos.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecionar Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Times</SelectItem>
                {times.map(time => (
                  <SelectItem key={time} value={time}>{time}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[400px] w-full rounded-md border">
            <div className="p-4">
              {filteredYellowCards.map(card => (
                <div key={card.id} className="mb-2 p-2 border rounded-md">
                  <p className="text-sm font-medium">Nome: {card.name}</p>
                  <p className="text-sm">Cartões: {card.cartões}</p>
                  <p className="text-xs text-gray-500">Time: {card.time}</p>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div>
            <h2>Estatísticas de Cartões Amarelos</h2>
            <StatisticsChart 
              data={chartData} 
              dataKey="value" 
              name="Cartões Amarelos" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default YellowCardManagement;
