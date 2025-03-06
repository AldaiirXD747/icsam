
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, Pencil, Trash2, Trophy, Calendar } from 'lucide-react';
import { format, parse } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";

type ChampionshipStatus = 'upcoming' | 'ongoing' | 'finished';

type Championship = {
  id: string;
  name: string;
  year: string;
  description: string;
  banner_image: string;
  start_date: string;
  end_date: string;
  location: string;
  categories: string[];
  organizer: string;
  sponsors: { name: string; logo: string }[];
  status: ChampionshipStatus;
};

// Form data type
type ChampionshipFormData = {
  name: string;
  year: string;
  description: string;
  banner_image: string;
  start_date: string;
  end_date: string;
  location: string;
  categories: string;
  organizer: string;
  status: ChampionshipStatus;
  sponsors: { name: string; logo: string }[];
};

const ChampionshipManagement = () => {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');
  const [selectedChampionship, setSelectedChampionship] = useState<Championship | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("all");
  const { toast } = useToast();

  // Form states
  const [formData, setFormData] = useState<ChampionshipFormData>({
    name: '',
    year: '',
    description: '',
    banner_image: '',
    start_date: '',
    end_date: '',
    location: '',
    categories: '',
    organizer: '',
    status: 'upcoming',
    sponsors: [{name: '', logo: ''}]
  });

  // Fetch championships data from Supabase
  useEffect(() => {
    fetchChampionships();
  }, []);

  const fetchChampionships = async () => {
    setIsLoading(true);
    try {
      // Use a direct SQL query since the ORM might not be correctly typed
      const { data, error } = await supabase
        .from('championships')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      
      // Parse categories and sponsors from JSONB if needed
      const processedData = data?.map(championship => {
        return {
          ...championship,
          categories: Array.isArray(championship.categories) 
            ? championship.categories 
            : typeof championship.categories === 'string' 
              ? JSON.parse(championship.categories) 
              : championship.categories || [],
          sponsors: Array.isArray(championship.sponsors) 
            ? championship.sponsors 
            : typeof championship.sponsors === 'string' 
              ? JSON.parse(championship.sponsors) 
              : championship.sponsors || []
        } as Championship;
      }) || [];
      
      setChampionships(processedData);
    } catch (error) {
      console.error('Error fetching championships:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar campeonatos",
        description: "Não foi possível carregar os campeonatos."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      categories: value 
    }));
  };

  const handleSponsorChange = (index: number, field: 'name' | 'logo', value: string) => {
    const updatedSponsors = [...formData.sponsors];
    updatedSponsors[index] = { ...updatedSponsors[index], [field]: value };
    setFormData(prev => ({ ...prev, sponsors: updatedSponsors }));
  };

  const addSponsor = () => {
    setFormData(prev => ({
      ...prev,
      sponsors: [...prev.sponsors, { name: '', logo: '' }]
    }));
  };

  const removeSponsor = (index: number) => {
    const updatedSponsors = formData.sponsors.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, sponsors: updatedSponsors }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      year: '',
      description: '',
      banner_image: '',
      start_date: '',
      end_date: '',
      location: '',
      categories: '',
      organizer: '',
      status: 'upcoming',
      sponsors: [{name: '', logo: ''}]
    });
  };

  const handleAddChampionship = async () => {
    if (!validateForm()) return;

    try {
      // Convert categories string to array
      const categoriesArray = formData.categories.split(',').map(category => category.trim());
      
      // Use direct SQL query for insertion
      const { data, error } = await supabase
        .from('championships')
        .insert({
          name: formData.name,
          year: formData.year,
          description: formData.description,
          banner_image: formData.banner_image,
          start_date: formData.start_date,
          end_date: formData.end_date,
          location: formData.location,
          categories: categoriesArray,
          organizer: formData.organizer,
          status: formData.status,
          sponsors: formData.sponsors.filter(sponsor => sponsor.name.trim() !== '' || sponsor.logo.trim() !== '')
        })
        .select();

      if (error) throw error;

      if (data) {
        // Process the returned data to match our Championship type
        const newChampionship = {
          ...data[0],
          categories: Array.isArray(data[0].categories) 
            ? data[0].categories 
            : typeof data[0].categories === 'string' 
              ? JSON.parse(data[0].categories) 
              : data[0].categories || [],
          sponsors: Array.isArray(data[0].sponsors) 
            ? data[0].sponsors 
            : typeof data[0].sponsors === 'string' 
              ? JSON.parse(data[0].sponsors) 
              : data[0].sponsors || []
        } as Championship;
        
        setChampionships([newChampionship, ...championships]);
        
        toast({
          title: "Campeonato adicionado",
          description: "O campeonato foi adicionado com sucesso."
        });
        
        resetForm();
        setActiveTab('list');
      }
    } catch (error) {
      console.error('Error adding championship:', error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar campeonato",
        description: "Não foi possível adicionar o campeonato."
      });
    }
  };

  const handleUpdateChampionship = async () => {
    if (!selectedChampionship || !validateForm()) return;
    
    try {
      // Convert categories string to array
      const categoriesArray = formData.categories.split(',').map(category => category.trim());
      
      // Use direct SQL query for update
      const { data, error } = await supabase
        .from('championships')
        .update({
          name: formData.name,
          year: formData.year,
          description: formData.description,
          banner_image: formData.banner_image,
          start_date: formData.start_date,
          end_date: formData.end_date,
          location: formData.location,
          categories: categoriesArray,
          organizer: formData.organizer,
          status: formData.status,
          sponsors: formData.sponsors.filter(sponsor => sponsor.name.trim() !== '' || sponsor.logo.trim() !== '')
        })
        .eq('id', selectedChampionship.id)
        .select();

      if (error) throw error;

      if (data) {
        // Process the returned data to match our Championship type
        const updatedChampionship = {
          ...data[0],
          categories: Array.isArray(data[0].categories) 
            ? data[0].categories 
            : typeof data[0].categories === 'string' 
              ? JSON.parse(data[0].categories) 
              : data[0].categories || [],
          sponsors: Array.isArray(data[0].sponsors) 
            ? data[0].sponsors 
            : typeof data[0].sponsors === 'string' 
              ? JSON.parse(data[0].sponsors) 
              : data[0].sponsors || []
        } as Championship;
        
        setChampionships(championships.map(championship => 
          championship.id === selectedChampionship.id ? updatedChampionship : championship
        ));
        
        toast({
          title: "Campeonato atualizado",
          description: "O campeonato foi atualizado com sucesso."
        });
        
        resetForm();
        setSelectedChampionship(null);
        setActiveTab('list');
      }
    } catch (error) {
      console.error('Error updating championship:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar campeonato",
        description: "Não foi possível atualizar o campeonato."
      });
    }
  };

  const handleDeleteChampionship = async (championshipId: string) => {
    if (!confirm("Tem certeza que deseja excluir este campeonato?")) return;

    try {
      // Use a direct SQL query for deletion
      const { error } = await supabase
        .from('championships')
        .delete()
        .eq('id', championshipId);

      if (error) throw error;

      // Remove the championship from the list
      setChampionships(championships.filter(championship => championship.id !== championshipId));
      
      toast({
        title: "Campeonato removido",
        description: "O campeonato foi removido com sucesso."
      });
    } catch (error) {
      console.error('Error deleting championship:', error);
      toast({
        variant: "destructive",
        title: "Erro ao remover campeonato",
        description: "Não foi possível remover o campeonato."
      });
    }
  };

  const handleEditChampionship = (championship: Championship) => {
    setSelectedChampionship(championship);
    
    // Prepare categories string from array for the form
    const categoriesString = Array.isArray(championship.categories) 
      ? championship.categories.join(', ') 
      : typeof championship.categories === 'string'
        ? championship.categories
        : '';
    
    setFormData({
      name: championship.name,
      year: championship.year,
      description: championship.description,
      banner_image: championship.banner_image,
      start_date: championship.start_date,
      end_date: championship.end_date,
      location: championship.location,
      categories: categoriesString,
      organizer: championship.organizer,
      status: championship.status,
      sponsors: championship.sponsors && championship.sponsors.length > 0 
        ? championship.sponsors 
        : [{name: '', logo: ''}]
    });
    
    setActiveTab('edit');
  };

  const validateForm = () => {
    const requiredFields = ['name', 'year', 'start_date', 'end_date', 'location', 'status'] as const;
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: `Por favor, preencha os campos: ${missingFields.join(', ')}.`
      });
      return false;
    }
    
    // Validate dates
    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      toast({
        variant: "destructive",
        title: "Datas inválidas",
        description: "A data de término deve ser posterior à data de início."
      });
      return false;
    }
    
    return true;
  };

  // Filter championships based on search and year
  const filteredChampionships = championships.filter(championship => {
    const matchesSearch = championship.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = filterYear === "all" || championship.year === filterYear;
    return matchesSearch && matchesYear;
  });

  // Get unique years for filter dropdown
  const years = [...new Set(championships.map(championship => championship.year))];

  const formatStatus = (status: ChampionshipStatus) => {
    switch (status) {
      case 'upcoming':
        return 'Próximo';
      case 'ongoing':
        return 'Em andamento';
      case 'finished':
        return 'Finalizado';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a237e]">Gerenciamento de Campeonatos</h2>
        {activeTab === 'list' && (
          <Button 
            onClick={() => setActiveTab('add')}
            className="flex items-center gap-2 bg-[#1a237e] text-white hover:bg-blue-800"
          >
            <PlusCircle size={16} />
            Adicionar Novo Campeonato
          </Button>
        )}
      </div>
      
      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex-1">
              <Input
                placeholder="Buscar campeonatos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="rounded-md border border-input px-3 py-2 text-sm"
              >
                <option value="all">Todos os Anos</option>
                {years.map((year, index) => (
                  <option key={index} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Carregando campeonatos...</p>
            </div>
          ) : filteredChampionships.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum campeonato encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChampionships.map(championship => (
                <Card key={championship.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-40">
                      <img 
                        src={championship.banner_image || '/placeholder.svg'} 
                        alt={championship.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                        <h3 className="text-xl font-bold text-white">{championship.name}</h3>
                        <p className="text-white/80">{championship.year}</p>
                      </div>
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                          onClick={() => handleEditChampionship(championship)}
                        >
                          <Pencil size={16} className="text-blue-800" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                          onClick={() => handleDeleteChampionship(championship.id)}
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="font-semibold">Status:</p>
                          <p>{formatStatus(championship.status)}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Local:</p>
                          <p>{championship.location}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Início:</p>
                          <p>{new Date(championship.start_date).toLocaleDateString('pt-BR')}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Término:</p>
                          <p>{new Date(championship.end_date).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="font-semibold">Categorias:</p>
                        <p>{Array.isArray(championship.categories) ? championship.categories.join(', ') : championship.categories}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
      
      {(activeTab === 'add' || activeTab === 'edit') && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-4 text-[#1a237e]">
              {activeTab === 'add' ? 'Adicionar Novo Campeonato' : 'Editar Campeonato'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Campeonato *</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Ex: Campeonato Base Forte"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Ano *</Label>
                <Input 
                  id="year" 
                  name="year" 
                  value={formData.year} 
                  onChange={handleInputChange} 
                  placeholder="Ex: 2025"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  placeholder="Descrição do campeonato"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="banner_image">URL da Imagem de Banner</Label>
                <Input 
                  id="banner_image" 
                  name="banner_image" 
                  value={formData.banner_image} 
                  onChange={handleInputChange} 
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="start_date">Data de Início *</Label>
                <Input 
                  id="start_date" 
                  name="start_date" 
                  type="date"
                  value={formData.start_date} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end_date">Data de Término *</Label>
                <Input 
                  id="end_date" 
                  name="end_date" 
                  type="date"
                  value={formData.end_date} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Local *</Label>
                <Input 
                  id="location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleInputChange} 
                  placeholder="Ex: Campo do Instituto - Santa Maria, DF"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-input px-3 py-2"
                >
                  <option value="upcoming">Próximo</option>
                  <option value="ongoing">Em andamento</option>
                  <option value="finished">Finalizado</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categories">Categorias (separadas por vírgula)</Label>
                <Input 
                  id="categories" 
                  name="categories" 
                  value={formData.categories} 
                  onChange={handleCategoriesChange} 
                  placeholder="Ex: SUB-11, SUB-13, SUB-15, SUB-17"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="organizer">Organizador</Label>
                <Input 
                  id="organizer" 
                  name="organizer" 
                  value={formData.organizer} 
                  onChange={handleInputChange} 
                  placeholder="Ex: Instituto Criança Santa Maria"
                />
              </div>
              
              <div className="space-y-4 md:col-span-2 mt-4">
                <div className="flex justify-between items-center">
                  <Label>Patrocinadores</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addSponsor}
                    className="text-blue-600"
                  >
                    Adicionar Patrocinador
                  </Button>
                </div>
                
                {formData.sponsors.map((sponsor, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md relative">
                    <div className="space-y-2">
                      <Label>Nome do Patrocinador</Label>
                      <Input 
                        value={sponsor.name} 
                        onChange={(e) => handleSponsorChange(index, 'name', e.target.value)} 
                        placeholder="Nome do Patrocinador"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>URL do Logo</Label>
                      <Input 
                        value={sponsor.logo} 
                        onChange={(e) => handleSponsorChange(index, 'logo', e.target.value)} 
                        placeholder="https://exemplo.com/logo.png"
                      />
                    </div>
                    {formData.sponsors.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeSponsor(index)}
                        className="absolute top-2 right-2 h-8 w-8 p-0 text-red-500"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  resetForm();
                  setSelectedChampionship(null);
                  setActiveTab('list');
                }}
              >
                Cancelar
              </Button>
              <Button 
                className="bg-[#1a237e] text-white hover:bg-blue-800"
                onClick={activeTab === 'add' ? handleAddChampionship : handleUpdateChampionship}
              >
                {activeTab === 'add' ? 'Adicionar Campeonato' : 'Atualizar Campeonato'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChampionshipManagement;
