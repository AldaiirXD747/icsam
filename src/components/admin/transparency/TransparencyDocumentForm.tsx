
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { TransparencyDocument } from '@/types';

interface TransparencyDocumentFormProps {
  formData: Partial<TransparencyDocument>;
  onChange: (field: string, value: any) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isEditing: boolean;
  categories: { value: string; label: string }[];
  iconTypes: { value: string; label: string }[];
  onCancel: () => void;
}

const TransparencyDocumentForm: React.FC<TransparencyDocumentFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isSubmitting,
  isEditing,
  categories,
  iconTypes,
  onCancel
}) => {
  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
      <div className="space-y-2">
        <Label htmlFor="title">Título do Documento *</Label>
        <Input
          id="title"
          value={formData.title || ''}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="Ex: Relatório Anual de Gastos"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          placeholder="Breve descrição do documento"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Categoria *</Label>
          <Select
            value={formData.category || ''}
            onValueChange={(value) => onChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="icon_type">Ícone *</Label>
          <Select
            value={formData.icon_type || ''}
            onValueChange={(value) => onChange('icon_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o ícone" />
            </SelectTrigger>
            <SelectContent>
              {iconTypes.map((iconType) => (
                <SelectItem key={iconType.value} value={iconType.value}>
                  {iconType.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="file_url">URL do Arquivo *</Label>
          <Input
            id="file_url"
            value={formData.file_url || ''}
            onChange={(e) => onChange('file_url', e.target.value)}
            placeholder="https://exemplo.com/documento.pdf"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="published_date">Data de Publicação *</Label>
          <Input
            id="published_date"
            type="date"
            value={formData.published_date ? (typeof formData.published_date === 'string' ? formData.published_date.split('T')[0] : '') : ''}
            onChange={(e) => onChange('published_date', e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              {isEditing ? 'Salvando...' : 'Adicionando...'}
            </>
          ) : (
            isEditing ? 'Salvar Alterações' : 'Adicionar Documento'
          )}
        </Button>
      </div>
    </form>
  );
};

export default TransparencyDocumentForm;
