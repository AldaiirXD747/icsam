
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface YellowCard {
  id: string;
  player_id: string;
  team_id: string;
  yellow_cards: number;
  championship_id: string | null;
  name?: string;
  team?: string;
  category: string;
}

interface DataTableProps {
  items: YellowCard[];
  onEdit: (item: YellowCard) => void;
  onDelete: (id: string) => void;
}

function DataTable({ items, onEdit, onDelete }: DataTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Jogador</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Cartões Amarelos</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.team}</TableCell>
              <TableCell>{item.yellow_cards}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => onEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => onDelete(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

interface YellowCardManagementProps {
  yellowCards: YellowCard[];
  teams: { id: string; name: string }[];
  players: { id: string; name: string }[];
  onCreate: (yellowCard: Omit<YellowCard, 'id'>) => void;
  onUpdate: (yellowCard: YellowCard) => void;
  onDelete: (id: string) => void;
  categories: string[];
  isLoading?: boolean;
}

const YellowCardManagement: React.FC<YellowCardManagementProps> = ({ 
  yellowCards, 
  teams, 
  players, 
  onCreate, 
  onUpdate, 
  onDelete, 
  categories,
  isLoading = false
}) => {
  const [playerId, setPlayerId] = useState('');
  const [teamId, setTeamId] = useState('');
  const [yellowCardsCount, setYellowCardsCount] = useState(0);
  const [category, setCategory] = useState(categories[0] || '');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0]);
    }
  }, [categories, category]);

  const handleCreate = async () => {
    if (!playerId || !teamId || !category) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    }

    setIsCreating(true);
    try {
      await onCreate({
        player_id: playerId,
        team_id: teamId,
        yellow_cards: yellowCardsCount,
        championship_id: null,
        category: category,
      });
      toast.success('Cartão amarelo criado com sucesso!');
    } catch (error) {
      console.error("Error creating yellow card:", error);
      toast.error('Erro ao criar cartão amarelo.');
    } finally {
      setIsCreating(false);
      setPlayerId('');
      setTeamId('');
      setYellowCardsCount(0);
    }
  };

  const handleEdit = (yellowCard: YellowCard) => {
    // Implement edit functionality
    onUpdate(yellowCard);
  };

  const handleDelete = (id: string) => {
    // Implement delete functionality
    onDelete(id);
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Gerenciar Cartões Amarelos</h2>
        <p className="text-gray-500">Adicione, edite ou remova cartões amarelos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Jogador</label>
          <Select onValueChange={setPlayerId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um jogador" />
            </SelectTrigger>
            <SelectContent>
              {players.map(player => (
                <SelectItem key={player.id} value={player.id}>{player.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
          <Select onValueChange={setTeamId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um time" />
            </SelectTrigger>
            <SelectContent>
              {teams.map(team => (
                <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Número de Cartões</label>
          <Input
            type="number"
            value={yellowCardsCount}
            onChange={(e) => setYellowCardsCount(Number(e.target.value))}
          />
        </div>
      </div>

      <Button onClick={handleCreate} disabled={isCreating}>
        {isCreating ? 'Criando...' : 'Adicionar Cartão Amarelo'}
      </Button>

      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-primary"></div>
          </div>
        ) : (
          <DataTable
            items={yellowCards}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default YellowCardManagement;
