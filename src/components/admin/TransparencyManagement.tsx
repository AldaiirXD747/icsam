
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, FilePieChart, FileBarChart, Users, File, FileCheck, MapPin, Building, Plus, Edit, Trash2, Search, FileUp, Download, Filter } from 'lucide-react';
import { toast } from 'sonner';

// Defining the interface for transparency documents
interface TransparencyDocument {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_url: string;
  icon_type: string;
  published_date: string;
  created_at?: string;
}

// Interface for the form data
interface DocumentFormData {
  id?: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  icon_type: string;
  published_date?: string;
}

// Templates for quick document creation
const documentTemplates = [
  { title: "ESTATUTO", description: "Documento que define missão, visão e valores do Instituto.", category: "legal", icon_type: "file" },
  { title: "RELATÓRIO ANUAL", description: "Relatório anual de atividades e resultados.", category: "financial", icon_type: "file-bar-chart" },
  { title: "CERTIFICAÇÕES", description: "Certificações e reconhecimentos obtidos pelo Instituto.", category: "legal", icon_type: "file-check" },
  { title: "TERMO DE PARCERIA", description: "Detalhamento do termo de parceria com entidades.", category: "partnerships", icon_type: "file-text" },
  { title: "PROJETOS", description: "Detalhamento dos projetos em andamento.", category: "projects", icon_type: "file-pie-chart" }
];

// Category options for documents
const categoryOptions = [
  { value: 'institutional', label: 'Institucional' },
  { value: 'legal', label: 'Documentos Legais' },
  { value: 'financial', label: 'Financeiro' },
  { value: 'partnerships', label: 'Parcerias' },
  { value: 'projects', label: 'Projetos' }
];

// Icon options for documents
const iconOptions = [
  { value: 'file', label: 'Arquivo', icon: <File size={16} /> },
  { value: 'file-text', label: 'Documento de Texto', icon: <FileText size={16} /> },
  { value: 'file-bar-chart', label: 'Gráfico de Barras', icon: <FileBarChart size={16} /> },
  { value: 'file-pie-chart', label: 'Gráfico de Pizza', icon: <FilePieChart size={16} /> },
  { value: 'file-check', label: 'Documento Verificado', icon: <FileCheck size={16} /> },
  { value: 'users', label: 'Usuários', icon: <Users size={16} /> },
  { value: 'building', label: 'Instituição', icon: <Building size={16} /> },
  { value: 'map-pin', label: 'Localização', icon: <MapPin size={16} /> }
];

// Get icon component by type
const getIconComponent = (iconType: string) => {
  const icon = iconOptions.find(i => i.value === iconType);
  return icon ? icon.icon : <File size={16} />;
};

const TransparencyManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<DocumentFormData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const queryClient = useQueryClient();

  // Default form data for new documents
  const emptyFormData: DocumentFormData = {
    title: '',
    description: '',
    category: 'institutional',
    file_url: '#',
    icon_type: 'file',
  };

  // Initialize form data
  const [formData, setFormData] = useState<DocumentFormData>(emptyFormData);

  // Query to get all documents
  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['transparency-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transparency_documents')
        .select('*')
        .order('published_date', { ascending: false }) as any;
      
      if (error) throw error;
      return data as TransparencyDocument[];
    }
  });

  // Mutation to add a new document
  const addDocumentMutation = useMutation({
    mutationFn: async (newDocument: Omit<TransparencyDocument, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('transparency_documents')
        .insert([newDocument]) as any;
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transparency-documents'] });
      toast.success('Documento adicionado com sucesso!');
      setIsAddDialogOpen(false);
      setFormData(emptyFormData);
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar documento: ${error.message}`);
    }
  });

  // Mutation to update a document
  const updateDocumentMutation = useMutation({
    mutationFn: async (updatedDocument: DocumentFormData) => {
      const { id, ...docData } = updatedDocument;
      const { data, error } = await supabase
        .from('transparency_documents')
        .update(docData)
        .eq('id', id) as any;
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transparency-documents'] });
      toast.success('Documento atualizado com sucesso!');
      setIsEditDialogOpen(false);
      setCurrentDocument(null);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar documento: ${error.message}`);
    }
  });

  // Mutation to delete a document
  const deleteDocumentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('transparency_documents')
        .delete()
        .eq('id', id) as any;
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transparency-documents'] });
      toast.success('Documento excluído com sucesso!');
      setIsDeleteDialogOpen(false);
      setCurrentDocument(null);
    },
    onError: (error) => {
      toast.error(`Erro ao excluir documento: ${error.message}`);
    }
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open edit dialog with document data
  const handleEditClick = (doc: TransparencyDocument) => {
    setCurrentDocument({
      id: doc.id,
      title: doc.title,
      description: doc.description || '',
      category: doc.category,
      file_url: doc.file_url,
      icon_type: doc.icon_type,
    });
    setFormData({
      id: doc.id,
      title: doc.title,
      description: doc.description || '',
      category: doc.category,
      file_url: doc.file_url,
      icon_type: doc.icon_type,
    });
    setIsEditDialogOpen(true);
  };

  // Open delete dialog with document data
  const handleDeleteClick = (doc: TransparencyDocument) => {
    setCurrentDocument({
      id: doc.id,
      title: doc.title,
      description: doc.description || '',
      category: doc.category,
      file_url: doc.file_url,
      icon_type: doc.icon_type,
    });
    setIsDeleteDialogOpen(true);
  };

  // Handle add document
  const handleAddDocument = () => {
    addDocumentMutation.mutate({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      file_url: formData.file_url,
      icon_type: formData.icon_type,
      published_date: new Date().toISOString(),
    });
  };

  // Handle update document
  const handleUpdateDocument = () => {
    if (formData.id) {
      updateDocumentMutation.mutate(formData);
    }
  };

  // Handle delete document
  const handleDeleteDocument = () => {
    if (currentDocument?.id) {
      deleteDocumentMutation.mutate(currentDocument.id);
    }
  };

  // Use template for quick document creation
  const useTemplate = (template: typeof documentTemplates[0]) => {
    setFormData(prev => ({
      ...prev,
      title: template.title,
      description: template.description,
      category: template.category,
      icon_type: template.icon_type,
    }));
  };

  // Filter documents based on search query and category
  const filteredDocuments = documents?.filter(doc => {
    const matchesSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === '' || doc.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Get documents for the active tab
  const getTabDocuments = () => {
    if (activeTab === 'all') {
      return filteredDocuments;
    }
    return filteredDocuments?.filter(doc => doc.category === activeTab);
  };

  const tabDocuments = getTabDocuments();

  // Handle file upload (mock functionality for now)
  const handleFileUpload = () => {
    toast.info('Funcionalidade de upload em desenvolvimento');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <h2 className="text-2xl font-bold">Gestão de Documentos de Transparência</h2>
          <div className="flex items-center bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
            <span className="block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Online
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-blue-primary hover:bg-blue-600"
          >
            <Plus size={16} className="mr-1" /> Adicionar Documento
          </Button>
          <Button variant="outline" onClick={handleFileUpload}>
            <FileUp size={16} className="mr-1" /> Upload
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Pesquisar documentos..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64 flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as categorias</SelectItem>
                {categoryOptions.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="institutional">Institucional</TabsTrigger>
            <TabsTrigger value="legal">Documentos Legais</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="partnerships">Parcerias</TabsTrigger>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Carregando documentos...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                Erro ao carregar documentos. Por favor, tente novamente.
              </div>
            ) : tabDocuments && tabDocuments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tabDocuments.map(doc => (
                  <Card key={doc.id} className="overflow-hidden">
                    <CardHeader className="pb-0 pt-3 px-4 flex flex-row justify-between items-start">
                      <div className="flex items-start gap-2">
                        <div className="p-2 rounded-md bg-blue-50 text-blue-primary">
                          {getIconComponent(doc.icon_type)}
                        </div>
                        <div>
                          <CardTitle className="text-base">{doc.title}</CardTitle>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(doc.published_date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(doc)}>
                          <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(doc)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-3 pb-4 px-4">
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{doc.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs">
                          {categoryOptions.find(c => c.value === doc.category)?.label || doc.category}
                        </span>
                        <a 
                          href={doc.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center text-blue-primary hover:text-blue-600 text-xs"
                        >
                          <Download size={12} className="mr-1" />
                          Baixar
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhum documento encontrado para esta categoria.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Document Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Documento</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para adicionar um novo documento ao portal de transparência.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h4 className="text-sm font-medium mb-3">Templates rápidos</h4>
              <div className="flex flex-wrap gap-2">
                {documentTemplates.map((template, idx) => (
                  <Button 
                    key={idx} 
                    variant="outline" 
                    size="sm" 
                    onClick={() => useTemplate(template)}
                    className="text-xs h-8"
                  >
                    {getIconComponent(template.icon_type)}
                    <span className="ml-1">{template.title}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="title">Título do Documento</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Ex: Estatuto Social"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="file_url">URL do Arquivo</Label>
                  <Input
                    id="file_url"
                    name="file_url"
                    value={formData.file_url}
                    onChange={handleInputChange}
                    placeholder="Ex: https://example.com/document.pdf"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Selecionar categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Breve descrição do documento"
                    className="h-24"
                  />
                </div>
                
                <div>
                  <Label htmlFor="icon_type">Ícone</Label>
                  <Select
                    value={formData.icon_type}
                    onValueChange={(value) => handleSelectChange('icon_type', value)}
                  >
                    <SelectTrigger id="icon_type">
                      <SelectValue placeholder="Selecionar ícone" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map(icon => (
                        <SelectItem key={icon.value} value={icon.value}>
                          <div className="flex items-center">
                            {icon.icon}
                            <span className="ml-2">{icon.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddDocument} disabled={!formData.title || !formData.file_url}>
              Adicionar Documento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Documento</DialogTitle>
            <DialogDescription>
              Edite os campos abaixo para atualizar o documento.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="edit-title">Título do Documento</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Ex: Estatuto Social"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-file_url">URL do Arquivo</Label>
                  <Input
                    id="edit-file_url"
                    name="file_url"
                    value={formData.file_url}
                    onChange={handleInputChange}
                    placeholder="Ex: https://example.com/document.pdf"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-category">Categoria</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Selecionar categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor="edit-description">Descrição</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Breve descrição do documento"
                    className="h-24"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-icon_type">Ícone</Label>
                  <Select
                    value={formData.icon_type}
                    onValueChange={(value) => handleSelectChange('icon_type', value)}
                  >
                    <SelectTrigger id="edit-icon_type">
                      <SelectValue placeholder="Selecionar ícone" />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map(icon => (
                        <SelectItem key={icon.value} value={icon.value}>
                          <div className="flex items-center">
                            {icon.icon}
                            <span className="ml-2">{icon.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateDocument} disabled={!formData.title || !formData.file_url}>
              Atualizar Documento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Document Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Documento</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o documento "{currentDocument?.title}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteDocument}>
              Excluir Documento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransparencyManagement;
