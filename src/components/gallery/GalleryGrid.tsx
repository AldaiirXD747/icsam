
import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GalleryImage } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star, Calendar, Info, X } from 'lucide-react';

interface GalleryGridProps {
  images: GalleryImage[];
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ images }) => {
  const [viewingImage, setViewingImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const openLightbox = (image: GalleryImage, index: number) => {
    setViewingImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setViewingImage(null);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setViewingImage(images[currentIndex === 0 ? images.length - 1 : currentIndex - 1]);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setViewingImage(images[currentIndex === images.length - 1 ? 0 : currentIndex + 1]);
  };

  // Sort images with featured ones first
  const sortedImages = [...images].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedImages.map((image, index) => (
          <div 
            key={image.id} 
            className={`relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group ${image.featured ? 'col-span-1 sm:col-span-2 row-span-2' : ''}`}
            onClick={() => openLightbox(image, index)}
          >
            <div className="aspect-square">
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h3 className="font-medium text-white truncate">{image.title}</h3>
                {image.description && (
                  <p className="text-sm text-gray-200 line-clamp-1">{image.description}</p>
                )}
                <div className="flex items-center text-xs mt-1 text-gray-300">
                  <Calendar className="h-3 w-3 mr-1" />
                  {typeof image.createdAt === 'string' 
                    ? format(new Date(image.createdAt), 'dd/MM/yyyy', { locale: ptBR })
                    : format(image.createdAt, 'dd/MM/yyyy', { locale: ptBR })}
                </div>
              </div>
            </div>
            
            {image.featured && (
              <div className="absolute top-2 right-2 bg-lime-primary text-blue-primary text-xs px-2 py-1 rounded-full flex items-center">
                <Star className="h-3 w-3 mr-1" /> Destaque
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={!!viewingImage} onOpenChange={(open) => !open && closeLightbox()}>
        <DialogContent className="max-w-4xl p-0 bg-black/90 border-0 rounded-lg overflow-hidden">
          <div className="relative h-[80vh] w-full flex flex-col">
            <div className="absolute top-2 right-2 z-50">
              <Button variant="ghost" size="icon" onClick={closeLightbox} className="text-white hover:bg-black/20 rounded-full">
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            {viewingImage && (
              <>
                <div className="flex-1 flex items-center justify-center p-2">
                  <img
                    src={viewingImage.imageUrl}
                    alt={viewingImage.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                
                <div className="p-4 bg-black/80 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold">{viewingImage.title}</h2>
                      {viewingImage.description && (
                        <p className="text-gray-300 mt-1">{viewingImage.description}</p>
                      )}
                      <div className="flex items-center text-xs mt-2 text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {typeof viewingImage.createdAt === 'string' 
                          ? format(new Date(viewingImage.createdAt), 'dd/MM/yyyy', { locale: ptBR })
                          : format(viewingImage.createdAt, 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    </div>
                    
                    {viewingImage.featured && (
                      <div className="bg-lime-primary text-blue-primary text-xs px-2 py-1 rounded-full flex items-center">
                        <Star className="h-3 w-3 mr-1" /> Destaque
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={goToPrevious}
                    className="text-white hover:bg-black/20 rounded-full h-12 w-12"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                </div>
                
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={goToNext}
                    className="text-white hover:bg-black/20 rounded-full h-12 w-12"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryGrid;
