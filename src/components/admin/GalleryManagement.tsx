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
import { Pencil, Trash2, Plus, Image, Star, Loader2 } from 'lucide-react';
import { Championship, GalleryImage } from '@/types';
import { getChampionships } from '@/lib/api';
import { getGalleryImages, addGalleryImage, updateGalleryImage, deleteGalleryImage } from '@/lib/galleryApi';
import { MultiFileUpload, FileWithPreview } from '@/components/ui/multi-file-upload';
import { Tabs as TabsUI, TabsList as TabsListUI, TabsTrigger as TabsTriggerUI, TabsContent as TabsContentUI } from "@/components/ui/tabs";

const addMultipleGalleryImages = async (championshipId: string, images: FileWithPreview[]): Promise<boolean> => {
  try {
    const promises = images.map(image => 
      addGalleryImage({
        title: image.name || 'Gallery Image',
        description: '',
        image_url: image.preview || '',
        championship_id: championshipId,
        featured: false
      })
    );
    
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error('Error adding multiple gallery images:', error);
    return false;
  }
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
  const [multipleFiles, setMultipleFiles] = useState<FileWithPreview[]>([]);
  const [uploadMode, setUploadMode] = useState<'single' | 'multiple'>('single');
  
  const { data: images = [], isLoading: isImagesLoading } = useQuery({
    queryKey: ['galleryImages'],
    queryFn: getGalleryImages,
  });
  
  const { data: championships = [], isLoading: isChampionshipsLoading } = useQuery({
    queryKey: ['championships'],
    queryFn: getChampionships,
  });
  
  const addImageMutation = useMutation({
    mutationFn: (data: any) => {
      return addGalleryImage({
        title: data.title,
        description: data.description,
        championship_id: data.championshipId,
        image_url: data.imageUrl,
        featured: data.featured
      });
    },
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
  
  const addMultipleImagesMutation = useMutation({
    mutationFn: (data: { championshipId: string, images: FileWithPreview[] }) => 
      addMultipleGalleryImages(data.championshipId, data.images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleryImages'] });
      toast({
        title: "Sucesso",
        description: `${multipleFiles.length} imagens adicionadas com sucesso.`,
      });
      resetForm();
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Erro ao adicionar imagens: ${error}`,
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
  
  const filteredImages = images.filter(img => 
    (activeTab === "all" || img.championshipId === activeTab) &&
    (img.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     (img.description && img.description.toLowerCase().includes(searchTerm.toLowerCase())))
  );
  
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
      setFormData(prev => ({ 
        ...prev, 
        imageUrl: URL.createObjectURL(e.target.files[0])
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
    
    if (uploadMode === 'multiple' && multipleFiles.length > 0) {
      addMultipleImagesMutation.mutate({
        championshipId: formData.championshipId,
        images: multipleFiles
      });
    } else {
      addImageMutation.mutate({
        ...formData,
        image_url: formData.imageUrl
      });
    }
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
    setMultipleFiles([]);
    setUploadMode('single');
  };

  const handleMultipleFilesChange = (files: FileWithPreview[]) => {
    setMultipleFiles(files);
  };
  
  if (isImagesLoading || isChampionshipsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-primary" />
        <span className="ml-2 text-lg">Carregando...</span>
      </div>
    );
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Imagem</DialogTitle>
              <DialogDescription>
                Preencha os campos para adicionar uma nova imagem à galeria.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddSubmit} className="space-y-4 mt-4">
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
              
              <TabsUI defaultValue="single" className="w-full" onValueChange={(val) => setUploadMode(val as 'single' | 'multiple')}>
                <TabsListUI className="grid grid-cols-2">
                  <TabsTriggerUI value="single">Upload Único</TabsTriggerUI>
                  <TabsTriggerUI value="multiple">Upload Múltiplo</TabsTriggerUI>
                </TabsListUI>
                
                <TabsContentUI value="single" className="pt-4">
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
                      <Label htmlFor="image">Imagem</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                      />
                      {formData.imageUrl && (
                        <div className="mt-2 border rounded overflow-hidden h-40">
                          <img 
                            src={formData.imageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
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
                </TabsContentUI>
                
                <TabsContentUI value="multiple" className="pt-4">
                  <div className="space-y-4">
                    <Label>Selecione Múltiplas Imagens</Label>
                    <MultiFileUpload 
                      onFilesChange={handleMultipleFilesChange}
                      maxFiles={10}
                    />
                    
                    <div className="pt-2 text-sm text-gray-500">
                      {multipleFiles.length > 0 ? (
                        <p>{multipleFiles.length} imagens selecionadas</p>
                      ) : (
                        <p>Nenhuma imagem selecionada</p>
                      )}
                    </div>
                  </div>
                </TabsContentUI>
              </TabsUI>
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={
                    (uploadMode === 'single' && addImageMutation.isPending) ||
                    (uploadMode === 'multiple' && addMultipleImagesMutation.isPending) ||
                    (uploadMode === 'multiple' && multipleFiles.length === 0) ||
                    !formData.championshipId
                  }
                >
                  {addImageMutation.isPending || addMultipleImagesMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adicionando...
                    </>
                  ) : (
                    "Adicionar"
                  )}
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
            <Card key={image.id} className="overflow-hidden hover:shadow-md transition-shadow">
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
                <CardTitle className="text-lg line-clamp-1">{image.title}</CardTitle>
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
                {updateImageMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryManagement;
