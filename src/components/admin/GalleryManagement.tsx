
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Plus, Image, Star } from 'lucide-react';
import { ChampionshipType } from '@/types/database';
import { GalleryImage } from '@/types';

// Mock data for championships - this would be replaced by an API call in production
const mockChampionships: ChampionshipType[] = [
  {
    id: "1",
    name: "Campeonato Base Forte 2023",
    year: "2023",
    description: "Campeonato anual com todas as categorias",
    banner_image: "https://example.com/banner1.jpg",
    start_date: "2023-03-15",
    end_date: "2023-11-20",
    location: "Campo do Instituto - Santa Maria, DF",
    categories: ["SUB-11", "SUB-13", "SUB-15", "SUB-17"],
    organizer: "Instituto Criança Santa Maria",
    sponsors: [
      { name: "Patrocinador 1", logo: "https://example.com/logo1.png" },
      { name: "Patrocinador 2", logo: "https://example.com/logo2.png" }
    ],
    status: "finished"
  },
  {
    id: "2",
    name: "Campeonato Base Forte 2024",
    year: "2024",
    description: "Edição 2024 do tradicional campeonato",
    banner_image: "https://example.com/banner2.jpg",
    start_date: "2024-03-10",
    end_date: "2024-11-25",
    location: "Campo do Instituto - Santa Maria, DF",
    categories: ["SUB-11", "SUB-13", "SUB-15", "SUB-17"],
    organizer: "Instituto Criança Santa Maria",
    sponsors: [
      { name: "Patrocinador 1", logo: "https://example.com/logo1.png" },
      { name: "Patrocinador 3", logo: "https://example.com/logo3.png" }
    ],
    status: "ongoing"
  }
];

// Mock gallery images
const mockGalleryImages: GalleryImage[] = [
  {
    id: "1",
    title: "Final do Campeonato 2023",
    description: "Momento da premiação dos campeões",
    imageUrl: "/lovable-uploads/71480ca7-a47e-49be-bcbf-3fdc06bdfcde.png",
    championshipId: "1",
    createdAt: "2023-11-20",
    featured: true
  },
  {
    id: "2",
    title: "Abertura do Campeonato 2024",
    description: "Cerimônia de abertura com todos os times",
    imageUrl: "/lovable-uploads/9ed392b8-8a39-4ee2-99c1-74b33ce2b4d5.png",
    championshipId: "2",
    createdAt: "2024-03-10"
  },
  {
    id: "3",
    title: "Treino preparatório",
    description: "Treino antes do início do campeonato",
    imageUrl: "/lovable-uploads/b57c03b4-f522-4117-86e8-8ecb86f62697.png",
    championshipId: "2",
    createdAt: "2024-03-05"
  },
  {
    id: "4",
    title: "Entrega de medalhas",
    description: "Cerimônia de premiação dos destaques",
    imageUrl: "/lovable-uploads/d9479deb-326b-4848-89fb-ef3e3f4c9601.png",
    championshipId: "1",
    createdAt: "2023-11-18"
  }
];

// Mock API functions
const getGalleryImages = async (): Promise<GalleryImage[]> => {
  return mockGalleryImages;
};

const addGalleryImage = async (image: Omit<GalleryImage, 'id' | 'createdAt'>): Promise<GalleryImage> => {
  const newImage: GalleryImage = {
    ...image,
    id: `${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  return newImage;
};

const updateGalleryImage = async (image: GalleryImage): Promise<GalleryImage> => {
  return image;
};

const deleteGalleryImage = async (id: string): Promise<void> => {
  return;
};

const GalleryManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    championshipId: "",
    imageUrl: "",
    featured: false
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Queries
  const { data: images = [], isLoading: isImagesLoading } = useQuery({
    queryKey: ['galleryImages'],
    queryFn: getGalleryImages,
  });
  
  const { data: championships = [], isLoading: isChampionshipsLoading } = useQuery({
    queryKey: ['championships'],
    queryFn: () => mockChampionships,
  });
  
  // Mutations
  const addImageMutation = useMutation({
    mutationFn: addGalleryImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      toast({
        title: "Sucesso",
        description: "Imagem adicionada com sucesso.",
      });
      resetForm();
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Erro ao adicionar imagem: ${error}`,
      });
    }
  });
  
  const updateImageMutation = useMutation({
    mutationFn: updateGalleryImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      toast({
        title: "Sucesso",
        description: "Imagem atualizada com sucesso.",
      });
      resetForm();
      setIsEditDialogOpen(false);
      setSelectedImage(null);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Erro ao atualizar imagem: ${error}`,
      });
    }
  });
  
  const deleteImageMutation = useMutation({
    mutationFn: deleteGalleryImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      toast({
        title: "Sucesso",
        description: "Imagem removida com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Erro ao remover imagem: ${error}`,
      });
    }
  });
  
  // Filters
  const filteredImages = images.filter(img => 
    (activeTab === "all" || img.championshipId === activeTab) &&
    (img.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     (img.description && img.description.toLowerCase().includes(searchTerm.toLowerCase())))
  );
  
  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, featured: checked }));
  };
  
  const handleChampionshipChange = (value: string) => {
    setFormData(prev => ({ ...prev, championshipId: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      // In a real implementation, you would upload this file to your server/storage
      // and then set the returned URL to the imageUrl field
      // For this mock, we'll just set a placeholder
      setFormData(prev => ({ 
        ...prev, 
        imageUrl: "/lovable-uploads/placeholder.jpg" 
      }));
    }
  };
  
  const handleEditImage = (image: GalleryImage) => {
    setSelectedImage(image);
    setFormData({
      title: image.title,
      description: image.description || "",
      championshipId: image.championshipId,
      imageUrl: image.imageUrl,
      featured: image.featured || false
    });
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteImage = (id: string) => {
    deleteImageMutation.mutate(id);
  };
  
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would handle file upload separately
    addImageMutation.mutate(formData);
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImage) {
      const updatedImage: GalleryImage = {
        ...selectedImage,
        title: formData.title,
        description: formData.description,
        championshipId: formData.championshipId,
        imageUrl: formData.imageUrl,
        featured: formData.featured
      };
      updateImageMutation.mutate(updatedImage);
    }
  };
  
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      championshipId: "",
      imageUrl: "",
      featured: false
    });
    setImageFile(null);
  };
  
  if (isImagesLoading || isChampionshipsLoading) {
    return <div className="p-4">Carregando...</div>;
  }
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-primary">Gerenciamento de Galeria</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-primary hover:bg-blue-light">
              <Plus className="mr-2 h-4 w-4" /> Adicionar Imagem
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Imagem</DialogTitle>
              <DialogDescription>
                Preencha os campos para adicionar uma nova imagem à galeria.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddSubmit} className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="championshipId">Campeonato</Label>
                  <Select
                    value={formData.championshipId}
                    onValueChange={handleChampionshipChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um campeonato" />
                    </SelectTrigger>
                    <SelectContent>
                      {championships.map(championship => (
                        <SelectItem key={championship.id} value={championship.id}>
                          {championship.name} ({championship.year})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Imagem</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    {imageFile ? `Arquivo selecionado: ${imageFile.name}` : "Nenhum arquivo selecionado"}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Label htmlFor="featured">Destacada</Label>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={addImageMutation.isPending}>
                  {addImageMutation.isPending ? "Adicionando..." : "Adicionar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input
            placeholder="Buscar imagens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3"
          />
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full md:w-2/3"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full">
              <TabsTrigger value="all">Todos</TabsTrigger>
              {championships.map(championship => (
                <TabsTrigger key={championship.id} value={championship.id}>
                  {championship.year}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {filteredImages.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Nenhuma imagem encontrada</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tente ajustar seus filtros ou adicione novas imagens.
          </p>
          <Button 
            className="mt-4" 
            variant="outline" 
            onClick={() => setIsAddDialogOpen(true)}
          >
            Adicionar Imagem
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map(image => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative h-48">
                <img 
                  src={image.imageUrl} 
                  alt={image.title} 
                  className="w-full h-full object-cover"
                />
                {image.featured && (
                  <div className="absolute top-2 right-2 bg-lime-primary text-blue-primary text-xs px-2 py-1 rounded-full flex items-center">
                    <Star className="h-3 w-3 mr-1" /> Destaque
                  </div>
                )}
              </div>
              
              <CardHeader className="pb-0">
                <CardTitle className="text-lg">{image.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="pt-2">
                <p className="text-sm text-gray-500 line-clamp-2">
                  {image.description || "Sem descrição"}
                </p>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <span className="font-medium">Campeonato:</span> 
                  <span className="ml-1">
                    {championships.find(c => c.id === image.championshipId)?.name || "Desconhecido"}
                  </span>
                </div>
                <div className="mt-1 flex items-center text-xs text-gray-500">
                  <span className="font-medium">Data:</span> 
                  <span className="ml-1">
                    {typeof image.createdAt === 'string' 
                      ? format(new Date(image.createdAt), 'dd/MM/yyyy', { locale: ptBR })
                      : format(image.createdAt, 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEditImage(image)}
                >
                  <Pencil className="h-4 w-4 mr-1" /> Editar
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" /> Excluir
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir imagem</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir esta imagem? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteImage(image.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Imagem</DialogTitle>
            <DialogDescription>
              Edite os dados da imagem selecionada.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Título</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-championshipId">Campeonato</Label>
                <Select
                  value={formData.championshipId}
                  onValueChange={handleChampionshipChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um campeonato" />
                  </SelectTrigger>
                  <SelectContent>
                    {championships.map(championship => (
                      <SelectItem key={championship.id} value={championship.id}>
                        {championship.name} ({championship.year})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Imagem Atual</Label>
                <div className="h-40 border rounded overflow-hidden">
                  <img 
                    src={formData.imageUrl} 
                    alt="Imagem atual" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-image">Alterar Imagem (opcional)</Label>
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <p className="text-sm text-gray-500">
                  {imageFile ? `Novo arquivo: ${imageFile.name}` : "Manter imagem atual"}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Label htmlFor="edit-featured">Destacada</Label>
                <Switch
                  id="edit-featured"
                  checked={formData.featured}
                  onCheckedChange={handleSwitchChange}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setSelectedImage(null);
                  resetForm();
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={updateImageMutation.isPending}>
                {updateImageMutation.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryManagement;
