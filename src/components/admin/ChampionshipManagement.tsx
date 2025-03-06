
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Trophy, Edit, Trash2, PlusCircle } from 'lucide-react';

type Championship = {
  id: number;
  name: string;
  year: string;
  categories: string[];
  logo?: string;
};

const ChampionshipManagement = () => {
  const { toast } = useToast();
  const [championships, setChampionships] = useState<Championship[]>([
    { id: 1, name: 'Base Forte', year: '2025', categories: ['SUB-11', 'SUB-13'] },
    { id: 2, name: 'Copa Primavera', year: '2024', categories: ['SUB-15'] },
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newChampionship, setNewChampionship] = useState<Omit<Championship, 'id'>>({
    name: '',
    year: '',
    categories: [],
  });

  const handleAddChampionship = () => {
    if (!newChampionship.name || !newChampionship.year || newChampionship.categories.length === 0) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    const newId = championships.length > 0 ? Math.max(...championships.map(c => c.id)) + 1 : 1;
    
    setChampionships([...championships, { id: newId, ...newChampionship }]);
    setNewChampionship({ name: '', year: '', categories: [] });
    setIsAddDialogOpen(false);
    
    toast({
      title: 'Campeonato Adicionado',
      description: `O campeonato ${newChampionship.name} foi adicionado com sucesso.`,
    });
  };

  const handleDeleteChampionship = (id: number) => {
    setChampionships(championships.filter(c => c.id !== id));
    
    toast({
      title: 'Campeonato Removido',
      description: 'O campeonato foi removido com sucesso.',
    });
  };

  const handleAddCategory = (category: string) => {
    if (!newChampionship.categories.includes(category)) {
      setNewChampionship({
        ...newChampionship,
        categories: [...newChampionship.categories, category],
      });
    }
  };

  const handleRemoveCategory = (category: string) => {
    setNewChampionship({
      ...newChampionship,
      categories: newChampionship.categories.filter(c => c !== category),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a237e]">Gerenciamento de Campeonatos</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1a237e] hover:bg-[#0d1642]">
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Campeonato
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Campeonato</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={newChampionship.name}
                  onChange={(e) => setNewChampionship({ ...newChampionship, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="year" className="text-right">
                  Ano
                </Label>
                <Input
                  id="year"
                  value={newChampionship.year}
                  onChange={(e) => setNewChampionship({ ...newChampionship, year: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Categoria
                </Label>
                <Select onValueChange={handleAddCategory}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUB-11">SUB-11</SelectItem>
                    <SelectItem value="SUB-13">SUB-13</SelectItem>
                    <SelectItem value="SUB-15">SUB-15</SelectItem>
                    <SelectItem value="SUB-17">SUB-17</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newChampionship.categories.length > 0 && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-right">Categorias:</div>
                  <div className="col-span-3 flex flex-wrap gap-2">
                    {newChampionship.categories.map((category) => (
                      <div key={category} className="bg-slate-100 px-2 py-1 rounded-md flex items-center">
                        {category}
                        <button 
                          onClick={() => handleRemoveCategory(category)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddChampionship}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {championships.map((championship) => (
          <Card key={championship.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">{championship.name}</CardTitle>
              <Trophy className="text-[#1a237e] h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-500 mb-4">Ano: {championship.year}</div>
              <div className="mb-4">
                <span className="text-sm font-medium">Categorias:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {championship.categories.map((category) => (
                    <span key={category} className="bg-slate-100 px-2 py-1 rounded-md text-xs">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteChampionship(championship.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChampionshipManagement;
