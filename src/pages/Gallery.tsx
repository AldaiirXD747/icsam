
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Loader2, Image, Search } from 'lucide-react';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import { getGalleryImages } from '@/lib/galleryApi';
import { getChampionships } from '@/lib/api';
import { Championship } from '@/types';

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [activeChampionship, setActiveChampionship] = useState<string>("all");
  
  // Get all championships
  const { data: championships = [], isLoading: isChampionshipsLoading } = useQuery({
    queryKey: ['championships'],
    queryFn: getChampionships,
  });
  
  // Get all gallery images
  const { data: allImages = [], isLoading: isImagesLoading } = useQuery({
    queryKey: ['galleryImages'],
    queryFn: getGalleryImages,
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao carregar imagens",
        description: "Não foi possível carregar as imagens da galeria.",
      });
      console.error("Error fetching gallery images:", error);
    }
  });
  
  // Filter images based on active championship and search term
  const filteredImages = allImages.filter(img => {
    const matchesChampionship = activeChampionship === "all" || img.championshipId === activeChampionship;
    const matchesSearch = img.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (img.description && img.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesChampionship && matchesSearch;
  });

  // Featured images for the top section
  const featuredImages = allImages.filter(img => img.featured).slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1a237e] mb-2">Galeria de Fotos</h1>
            <p className="text-gray-600">Confira os melhores momentos dos nossos campeonatos</p>
          </div>
          
          {/* Featured Images Section */}
          {featuredImages.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-[#1a237e] mb-4 flex items-center">
                <Image className="mr-2 h-5 w-5 text-lime-primary" /> Destaques
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuredImages.slice(0, 1).map(image => (
                  <div key={image.id} className="col-span-1 md:col-span-2 row-span-2 relative rounded-lg overflow-hidden shadow-md h-96">
                    <img 
                      src={image.imageUrl} 
                      alt={image.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                      <div className="absolute bottom-0 p-4 text-white">
                        <h3 className="text-xl font-semibold">{image.title}</h3>
                        {image.description && <p className="text-gray-300">{image.description}</p>}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="grid grid-cols-1 gap-4">
                  {featuredImages.slice(1, 3).map(image => (
                    <div key={image.id} className="relative rounded-lg overflow-hidden shadow-md h-44">
                      <img 
                        src={image.imageUrl} 
                        alt={image.title} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                        <div className="absolute bottom-0 p-3 text-white">
                          <h3 className="text-sm font-medium">{image.title}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="w-full sm:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar fotos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10"
                />
              </div>
            </div>
            
            <Tabs defaultValue="all" value={activeChampionship} onValueChange={setActiveChampionship} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-2 sm:grid-cols-3 w-full sm:w-auto">
                <TabsTrigger value="all">Todos</TabsTrigger>
                {championships.map(championship => (
                  <TabsTrigger key={championship.id} value={championship.id}>
                    {championship.year}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          {isImagesLoading || isChampionshipsLoading ? (
            <div className="text-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-blue-primary mx-auto" />
              <p className="text-gray-500 mt-2">Carregando imagens...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <Image className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma imagem encontrada</h3>
              <p className="text-gray-500">Não há imagens correspondentes aos filtros selecionados.</p>
            </div>
          ) : (
            <GalleryGrid images={filteredImages} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Gallery;
