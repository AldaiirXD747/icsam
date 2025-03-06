
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChampionshipType } from '@/types/database';
import GalleryGrid from '@/components/gallery/GalleryGrid';
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

const Gallery = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [activeChampionship, setActiveChampionship] = useState<string>("all");
  
  // In a real implementation, these would be actual API calls
  const { data: championships = mockChampionships, isLoading: isChampionshipsLoading } = useQuery({
    queryKey: ['championships'],
    queryFn: () => mockChampionships,
  });
  
  const { data: images = mockGalleryImages, isLoading: isImagesLoading } = useQuery({
    queryKey: ['galleryImages', activeChampionship],
    queryFn: () => {
      if (activeChampionship === "all") {
        return mockGalleryImages;
      }
      return mockGalleryImages.filter(img => img.championshipId === activeChampionship);
    },
  });
  
  const filteredImages = images.filter(
    img => img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (img.description && img.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1a237e] mb-2">Galeria de Fotos</h1>
            <p className="text-gray-600">Confira os melhores momentos dos nossos campeonatos</p>
          </div>
          
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="w-full sm:max-w-md">
              <Input
                type="text"
                placeholder="Buscar fotos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
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
          
          {isImagesLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Carregando imagens...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma imagem encontrada</h3>
              <p className="text-gray-500">Não há imagens correspondentes aos filtros selecionados.</p>
            </div>
          ) : (
            <GalleryGrid images={filteredImages} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;
