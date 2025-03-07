import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { TransparencyDocument } from '@/types';

// Import components
import TransparencyDocumentCard from './transparency/TransparencyDocumentCard';
import TransparencyDocumentForm from './transparency/TransparencyDocumentForm';
import TransparencyTemplates from './transparency/TransparencyTemplates';
import TransparencyFilters from './transparency/TransparencyFilters';
import EmptyState from './transparency/EmptyState';

const TransparencyManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for document management
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<TransparencyDocument | null>(null);
  const [formData, setFormData] = useState<Partial<TransparencyDocument>>({
    title: '',
    description: '',
    category: '',
    file_url: '',
    icon_type: '',
    published_date: new Date().toISOString().split('T')[0]
  });
  
  // State for filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Category options
  const categories = [
    { value: 'institutional', label: 'Institucional' },
    { value: 'financial', label: 'Financeiro' },
    { value: 'projects', label: 'Projetos' },
    { value: 'partnerships', label: 'Parcerias' },
    { value: 'legal', label: 'Jurídico' }
  ];
  
  // Icon type options
  const iconTypes = [
    { value: 'building', label: 'Prédio' },
    { value: 'file-pie-chart', label: 'Gráfico de Pizza' },
    { value: 'file-bar-chart', label: 'Gráfico de Barras' },
    { value: 'file-text', label: 'Documento de Texto' },
    { value: 'file', label: 'Arquivo' },
    { value: 'users', label: 'Usuários' },
    { value: 'file-check', label: 'Documento Verificado' },
    { value: 'map-pin', label: 'Localização' }
  ];

  // Fetch documents from Supabase
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['transparency-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transparency_documents')
        .select('*')
        .order('published_date', { ascending: false }) as any;
      
      if (error) {
        console.error('Error fetching transparency documents:', error);
        throw error;
      }
      
      return data as TransparencyDocument[];
    }
  });

  // Mutations for CRUD operations
  const addDocumentMutation = useMutation({
    mutationFn: async (document: Partial<TransparencyDocument>) => {
      // Verificar se todos os campos obrigatórios estão presentes
      if (!document.title || !document.category || !document.file_url || !document.icon_type) {
        throw new Error('Campos obrigatórios não preenchidos');
      }
      
      // Criar um objeto com apenas os campos necessários
      const documentToInsert = {
        title: document.title,
        description: document.description || '',
        category: document.category,
        file_url: document.file_url,
        icon_type: document.icon_type,
        published_date: document.published_date || new Date().toISOString().split('T')[0]
      };
      
      const { data, error } = await supabase
        .from('transparency_documents')
        .insert(documentToInsert)
        .select() as any;
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transparency-documents'] });
      toast({
        title: "Documento adicionado",
        description: "O documento foi adicionado com sucesso."
      });
      handleCloseAddDialog();
    },
    onError: (error) => {
      console.error('Error adding document:', error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar documento",
        description: "Não foi possível adicionar o documento."
      });
    }
  });
  
  const updateDocumentMutation = useMutation({
    mutationFn: async (document: TransparencyDocument) => {
      const { data, error } = await supabase
        .from('transparency_documents')
        .update(document)
        .eq('id', document.id)
        .select() as any;
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transparency-documents'] });
      toast({
        title: "Documento atualizado",
        description: "O documento foi atualizado com sucesso."
      });
      handleCloseEditDialog();
    },
    onError: (error) => {
      console.error('Error updating document:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar documento",
        description: "Não foi possível atualizar o documento."
      });
    }
  });
  
  const deleteDocumentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transparency_documents')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transparency-documents'] });
      toast({
        title: "Documento excluído",
        description: "O documento foi excluído com sucesso."
      });
    },
    onError: (error) => {
      console.error('Error deleting document:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir documento",
        description: "Não foi possível excluir o documento."
      });
    }
  });

  // Filter documents based on search term and category
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handlers
  const handleOpenAddDialog = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      file_url: '',
      icon_type: '',
      published_date: new Date().toISOString().split('T')[0]
    });
    setIsAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
    setFormData({
      title: '',
      description: '',
      category: '',
      file_url: '',
      icon_type: '',
      published_date: new Date().toISOString().split('T')[0]
    });
  };

  const handleOpenEditDialog = (document: TransparencyDocument) => {
    setSelectedDocument(document);
    setFormData({
      ...document,
      published_date: document.published_date.split('T')[0]
    });
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedDocument(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      file_url: '',
      icon_type: '',
      published_date: new Date().toISOString().split('T')[0]
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddDocument = () => {
    if (!formData.title || !formData.category || !formData.file_url || !formData.icon_type || !formData.published_date) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return;
    }

    addDocumentMutation.mutate(formData);
  };

  const handleUpdateDocument = () => {
    if (!selectedDocument) return;
    
    if (!formData.title || !formData.category || !formData.file_url || !formData.icon_type || !formData.published_date) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return;
    }

    updateDocumentMutation.mutate({
      ...selectedDocument,
      ...formData
    } as TransparencyDocument);
  };

  const handleDeleteDocument = (id: string) => {
    deleteDocumentMutation.mutate(id);
  };

  const handleSelectTemplate = (template: Partial<TransparencyDocument>) => {
    setFormData(prev => ({ ...prev, ...template }));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-primary">Gerenciamento de Transparência</h2>
        <Button onClick={handleOpenAddDialog}>
          <Plus size={16} className="mr-2" /> Adicionar Documento
        </Button>
      </div>
      
      <div className="mb-6">
        <TransparencyFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-primary" />
          <span className="ml-2 text-lg">Carregando...</span>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <EmptyState onAddNew={handleOpenAddDialog} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map(document => (
            <TransparencyDocumentCard
              key={document.id}
              document={document}
              onEdit={handleOpenEditDialog}
              onDelete={handleDeleteDocument}
              categories={categories}
            />
          ))}
        </div>
      )}
      
      {/* Add Document Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Documento</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TransparencyDocumentForm
                formData={formData}
                onChange={handleInputChange}
                onSubmit={handleAddDocument}
                isSubmitting={addDocumentMutation.isPending}
                isEditing={false}
                categories={categories}
                iconTypes={iconTypes}
                onCancel={handleCloseAddDialog}
              />
            </div>
            
            <div>
              <TransparencyTemplates
                onSelectTemplate={handleSelectTemplate}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit Document Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Documento</DialogTitle>
          </DialogHeader>
          
          <TransparencyDocumentForm
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleUpdateDocument}
            isSubmitting={updateDocumentMutation.isPending}
            isEditing={true}
            categories={categories}
            iconTypes={iconTypes}
            onCancel={handleCloseEditDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransparencyManagement;
