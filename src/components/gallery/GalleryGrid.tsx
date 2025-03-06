
import React from 'react';
import { GalleryImage } from '@/types';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Info } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface GalleryGridProps {
  images: GalleryImage[];
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {images.map((image) => (
        <Card key={image.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
          <div className="relative h-52 overflow-hidden">
            <img
              src={image.imageUrl}
              alt={image.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {image.featured && (
              <Badge className="absolute top-2 right-2 bg-lime-primary text-blue-primary">
                Destaque
              </Badge>
            )}
          </div>
          
          <CardContent className="flex-grow pt-4">
            <h3 className="text-lg font-semibold text-blue-primary mb-1 line-clamp-1">{image.title}</h3>
            {image.description && (
              <p className="text-gray-600 text-sm line-clamp-2">{image.description}</p>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between items-center pt-0 pb-4">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {typeof image.createdAt === 'string' 
                ? format(new Date(image.createdAt), 'dd MMM yyyy', { locale: ptBR })
                : format(image.createdAt, 'dd MMM yyyy', { locale: ptBR })}
            </div>
            
            <HoverCard>
              <HoverCardTrigger>
                <Info className="h-4 w-4 text-gray-400 hover:text-blue-primary cursor-pointer" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{image.title}</h4>
                    <p className="text-sm">
                      {image.description || "Sem descrição disponível"}
                    </p>
                    <div className="flex items-center pt-2">
                      <Calendar className="h-4 w-4 mr-1 opacity-70" />
                      <span className="text-xs text-muted-foreground">
                        {typeof image.createdAt === 'string' 
                          ? format(new Date(image.createdAt), 'dd MMMM yyyy', { locale: ptBR })
                          : format(image.createdAt, 'dd MMMM yyyy', { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default GalleryGrid;
