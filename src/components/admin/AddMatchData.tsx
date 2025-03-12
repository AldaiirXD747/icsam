
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addBatchMatches, MatchData } from '@/utils/matchDataManager';
import { useToast } from '@/components/ui/use-toast';

interface TeamInfo {
  id: string;
  name: string;
}

interface FormValues {
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  location: string;
  category: string;
  round: string;
  championshipId: string;
}

const AddMatchData = () => {
  const { toast } = useToast();
  const [teams, setTeams] = useState<TeamInfo[]>([
    { id: '1', name: 'Team A' },
    { id: '2', name: 'Team B' },
    { id: '3', name: 'Team C' },
    { id: '4', name: 'Team D' },
  ]);
  const [championships, setChampionships] = useState([
    { id: '1', name: 'Championship 1' },
    { id: '2', name: 'Championship 2' },
  ]);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      time: '15:00',
      homeTeam: '',
      awayTeam: '',
      location: 'Campo 1',
      category: 'Sub-17',
      round: '1',
      championshipId: '1',
    }
  });

  const addMatch = async (data: FormValues) => {
    setLoading(true);
    try {
      const homeTeamInfo = teams.find(t => t.id === data.homeTeam);
      const awayTeamInfo = teams.find(t => t.id === data.awayTeam);

      const matchData: MatchData = {
        date: data.date,
        time: data.time,
        home_team: data.homeTeam,
        away_team: data.awayTeam,
        location: data.location,
        category: data.category,
        championship_id: data.championshipId,
        round: data.round,
        homeTeamName: homeTeamInfo?.name,
        awayTeamName: awayTeamInfo?.name,
      };

      const response = await addBatchMatches([matchData]);

      if (response.success) {
        toast({
          title: 'Sucesso',
          description: 'Partida adicionada com sucesso',
        });
        reset();
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: response.error || 'Erro ao adicionar partida',
        });
      }
    } catch (error) {
      console.error('Error adding match:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao adicionar partida',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Adicionar Partida Manualmente</h2>
      <form onSubmit={handleSubmit(addMatch)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Data</label>
            <Controller
              name="date"
              control={control}
              rules={{ required: 'Data é obrigatória' }}
              render={({ field }) => (
                <Input type="date" {...field} />
              )}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Horário</label>
            <Controller
              name="time"
              control={control}
              rules={{ required: 'Horário é obrigatório' }}
              render={({ field }) => (
                <Input type="time" {...field} />
              )}
            />
            {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Time da Casa</label>
            <Controller
              name="homeTeam"
              control={control}
              rules={{ required: 'Time da casa é obrigatório' }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o time da casa" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.homeTeam && <p className="text-red-500 text-sm mt-1">{errors.homeTeam.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Time Visitante</label>
            <Controller
              name="awayTeam"
              control={control}
              rules={{ required: 'Time visitante é obrigatório' }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o time visitante" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.awayTeam && <p className="text-red-500 text-sm mt-1">{errors.awayTeam.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Local</label>
            <Controller
              name="location"
              control={control}
              rules={{ required: 'Local é obrigatório' }}
              render={({ field }) => (
                <Input {...field} />
              )}
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <Controller
              name="category"
              control={control}
              rules={{ required: 'Categoria é obrigatória' }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sub-15">Sub-15</SelectItem>
                    <SelectItem value="Sub-17">Sub-17</SelectItem>
                    <SelectItem value="Sub-20">Sub-20</SelectItem>
                    <SelectItem value="Adulto">Adulto</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rodada</label>
            <Controller
              name="round"
              control={control}
              render={({ field }) => (
                <Input {...field} />
              )}
            />
            {errors.round && <p className="text-red-500 text-sm mt-1">{errors.round.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Campeonato</label>
            <Controller
              name="championshipId"
              control={control}
              rules={{ required: 'Campeonato é obrigatório' }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o campeonato" />
                  </SelectTrigger>
                  <SelectContent>
                    {championships.map((championship) => (
                      <SelectItem key={championship.id} value={championship.id}>
                        {championship.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.championshipId && <p className="text-red-500 text-sm mt-1">{errors.championshipId.message}</p>}
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Adicionando...' : 'Adicionar Partida'}
        </Button>
      </form>
    </div>
  );
};

export default AddMatchData;
