
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Pencil, Trash2, Calendar, Tag, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TransparencyDocument } from '@/types';

interface TransparencyDocumentCardProps {
  document: TransparencyDocument;
  onEdit: (document: TransparencyDocument) => void;
  onDelete: (id: string) => void;
  categories: { value: string; label: string }[];
}

const TransparencyDocumentCard: React.FC<TransparencyDocumentCardProps> = ({ 
  document, onEdit, onDelete, categories 
}) => {
  const getCategoryName = (value: string) => {
    const category = categories.find(cat => cat.value === value);
    return category ? category.label : value;
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-full bg-blue-100 text-blue-primary">
            <FileText size={20} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-1">{document.title}</h3>
            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{document.description}</p>
            
            <div className="flex flex-wrap gap-2 mt-3">
              <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                <Tag size={12} className="mr-1" />
                {getCategoryName(document.category)}
              </div>
              
              <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                <Calendar size={12} className="mr-1" />
                {typeof document.published_date === 'string' 
                  ? format(new Date(document.published_date), 'dd/MM/yyyy', { locale: ptBR })
                  : format(document.published_date, 'dd/MM/yyyy', { locale: ptBR })}
              </div>
            </div>
            
            <div className="mt-3">
              <a 
                href={document.file_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-primary hover:underline"
              >
                {document.file_url}
              </a>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2 p-4 pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(document)}
        >
          <Pencil size={14} className="mr-1" /> Editar
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 size={14} className="mr-1" /> Excluir
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir documento</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(document.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default TransparencyDocumentCard;
