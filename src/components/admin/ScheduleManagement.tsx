
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Match = {
  id: number;
  date: string;
  time: string;
  location: string;
  homeTeam: string;
  awayTeam: string;
  category: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
};

const ScheduleManagement = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Mock data for scheduled matches
  const [matches, setMatches] = useState<Match[]>([
    {
      id: 1,
      date: '2025-03-15',
      time: '14:00',
      location: 'Estádio Municipal',
      homeTeam: 'Águias FC',
      awayTeam: 'Leões FC',
      category: 'SUB-13',
      status: 'scheduled',
    },
    {
      id: 2,
      date: '2025-03-15',
      time: '16:00',
      location: 'Estádio Municipal',
      homeTeam: 'Tubarões FC',
      awayTeam: 'Tigres FC',
      category: 'SUB-11',
      status: 'scheduled',
    },
    {
      id: 3,
      date: '2025-03-20',
      time: '15:00',
      location: 'Campo da Vila',
      homeTeam: 'Águias FC',
      awayTeam: 'Tigres FC',
      category: 'SUB-13',
      status: 'scheduled',
    },
  ]);

  const filteredMatches = matches.filter(match => {
    // Filter by selected date
    const matchDate = new Date(match.date);
    const selectedDateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
    const matchDateString = format(matchDate, 'yyyy-MM-dd');
    
    const dateMatches = selectedDateString === matchDateString;
    
    // Filter by category if a specific one is selected
    const categoryMatches = selectedCategory === 'all' || match.category === selectedCategory;
    
    return dateMatches && categoryMatches;
  });

  const datesWithMatches = matches.map(match => new Date(match.date));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Data</label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              locale={ptBR}
              showOutsideDays={false}
              disabled={(date) => date < new Date()}
              modifiers={{
                booked: datesWithMatches,
              }}
              modifiersClassNames={{
                booked: 'bg-blue-100',
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Categoria</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="SUB-11">SUB-11</SelectItem>
                <SelectItem value="SUB-13">SUB-13</SelectItem>
                <SelectItem value="SUB-15">SUB-15</SelectItem>
                <SelectItem value="SUB-17">SUB-17</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate 
                ? `Jogos Agendados - ${format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}`
                : 'Jogos Agendados'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredMatches.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                Não há jogos agendados para esta data e categoria.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMatches.map((match) => (
                  <div key={match.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {match.category}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {match.status === 'scheduled' ? 'Agendado' : 
                         match.status === 'in_progress' ? 'Em andamento' : 
                         match.status === 'completed' ? 'Concluído' : 'Cancelado'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg font-bold">{match.homeTeam}</span>
                      <span className="text-sm text-gray-400">vs</span>
                      <span className="text-lg font-bold">{match.awayTeam}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {match.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {match.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-center">
          <Button 
            className="bg-[#1a237e] hover:bg-[#0d1642]"
            onClick={() => toast({
              title: "Recurso em desenvolvimento",
              description: "A criação e edição de jogos na agenda será implementada em breve."
            })}
          >
            Gerenciar Agenda
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagement;
