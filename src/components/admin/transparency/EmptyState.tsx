
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddNew: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddNew }) => {
  return (
    <div className="text-center p-8 bg-gray-50 rounded-lg">
      <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900">Nenhum documento encontrado</h3>
      <p className="mt-1 text-sm text-gray-500">
        Adicione documentos para exibir no Portal de Transparência ou ajuste seus filtros de busca.
      </p>
      <Button 
        className="mt-4" 
        onClick={onAddNew}
      >
        Adicionar Documento
      </Button>
    </div>
  );
};

export default EmptyState;
