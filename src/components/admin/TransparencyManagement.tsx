
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { FileText, Plus, Pencil, Trash, Search, FileCheck, FileBarChart, FilePieChart, Users, File, MapPin, Building } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Interface for transparency document
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

// Interface for form data
interface DocumentFormData {
  id?: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  icon_type: string;
  published_date: string;
}

// Initial form state
const initialFormState: DocumentFormData = {
  title: '',
  description: '',
  category: 'institutional',
  file_url: '#',
  icon_type: 'file',
  published_date: new Date().toISOString().split('T')[0],
};

// Categories for documents
const documentCategories = [
  { value: 'institutional', label: 'Institucional' },
  { value: 'projects', label: 'Projetos' },
  { value: 'financial', label: 'Financeiro' },
  { value: 'partnerships', label: 'Parcerias' },
  { value: 'legal', label: 'Documentos Legais' },
];

// Icons for documents
const documentIcons = [
  { value: 'file', label: 'Arquivo', icon: <File size={16} /> },
  { value: 'file-text', label: 'Documento', icon: <FileText size={16} /> },
  { value: 'file-check', label: 'Documento Verificado', icon: <FileCheck size={16} /> },
  { value: 'file-bar-chart', label: 'Relatório', icon: <FileBarChart size={16} /> },
  { value: 'file-pie-chart', label: 'Estatísticas', icon: <FilePieChart size={16} /> },
  { value: 'users', label: 'Pessoas', icon: <Users size={16} /> },
  { value: 'map-pin', label: 'Localização', icon: <MapPin size={16} /> },
  { value: 'building', label: 'Instituição', icon: <Building size={16} /> },
];

// Document templates
const documentTemplates = [
  {
    title: 'DADOS DO INSTITUTO',
    description: 'CNPJ: 43.999.350/0001-16 | Data de Abertura: 14/10/2021',
    category: 'institutional',
    icon_type: 'building',
  },
  {
    title: 'PROJETOS APROVADOS',
    description: 'Lista completa de emendas parlamentares executadas pelo Instituto.',
    category: 'projects',
    icon_type: 'file-pie-chart',
  },
  {
    title: 'RELATÓRIO ANUAL DE GASTOS',
    description: 'Detalhamento da aplicação de recursos financeiros.',
    category: 'financial',
    icon_type: 'file-bar-chart',
  },
  {
    title: 'TERMO DE FOMENTO',
    description: 'Detalhamento do termo de fomento firmado com o Ministério.',
    category: 'partnerships',
    icon_type: 'file-text',
  },
  {
    title: 'ESTATUTO',
    description: 'Documento que define missão, visão e valores do Instituto.',
    category: 'legal',
    icon_type: 'file',
  },
];

const TransparencyManagement: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<DocumentFormData>(initialFormState);
  const [selectedDocument, setSelectedDocument] = useState<TransparencyDocument | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Fetch documents
  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['transparency-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transparency_documents')
        .select('*')
        .order('published_date', { ascending: false });
      
      if (error) throw error;
      
      return data as TransparencyDocument[];
    },
  });

  // Create document mutation
  const createDocument = useMutation({
    mutationFn: async (document: Omit<TransparencyDocument, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('transparency_documents')
        .insert([document])
        .select();
      
      if (error) throw error;
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transparency-documents'] });
      toast({
        title: 'Documento criado',
        description: 'O documento foi criado com sucesso.',
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar documento',
        description: error.message,
      });
    },
  });

  // Update document mutation
  const updateDocument = useMutation({
    mutationFn: async (document: Partial<TransparencyDocument> & { id: string }) => {
      const { data, error } = await supabase
        .from('transparency_documents')
        .update({
          title: document.title,
          description: document.description,
          category: document.category,
          file_url: document.file_url,
          icon_type: document.icon_type,
          published_date: document.published_date,
        })
        .eq('id', document.id)
        .select();
      
      if (error) throw error;
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transparency-documents'] });
      toast({
        title: 'Documento atualizado',
        description: 'O documento foi atualizado com sucesso.',
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar documento',
        description: error.message,
      });
    },
  });

  // Delete document mutation
  const deleteDocument = useMutation({
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
        title: 'Documento excluído',
        description: 'O documento foi excluído com sucesso.',
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir documento',
        description: error.message,
      });
    },
  });

  // Filter documents based on active tab and search query
  const filteredDocuments = documents
    ? documents.filter((doc) => {
        const matchesTab = activeTab === 'all' || doc.category === activeTab;
        const matchesSearch = !searchQuery || 
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (doc.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
      })
    : [];

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && formData.id) {
      updateDocument.mutate({
        id: formData.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        file_url: formData.file_url,
        icon_type: formData.icon_type,
        published_date: formData.published_date,
      });
    } else {
      createDocument.mutate({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        file_url: formData.file_url,
        icon_type: formData.icon_type,
        published_date: formData.published_date,
      });
    }
    
    setIsOpen(false);
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialFormState);
    setIsEditing(false);
    setSelectedDocument(null);
  };

  // Open edit dialog
  const handleEdit = (document: TransparencyDocument) => {
    setIsEditing(true);
    setSelectedDocument(document);
    setFormData({
      id: document.id,
      title: document.title,
      description: document.description || '',
      category: document.category,
      file_url: document.file_url,
      icon_type: document.icon_type,
      published_date: document.published_date,
    });
    setIsOpen(true);
  };

  // Open delete dialog
  const handleDelete = (document: TransparencyDocument) => {
    setSelectedDocument(document);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (selectedDocument) {
      deleteDocument.mutate(selectedDocument.id);
    }
    setIsDeleteDialogOpen(false);
  };

  // Use template
  const useTemplate = (template: any) => {
    setFormData({
      ...formData,
      title: template.title,
      description: template.description,
      category: template.category,
      icon_type: template.icon_type,
    });
  };

  if (error) {
    console.error('Error in TransparencyManagement:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Documentos de Transparência</h2>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => { resetForm(); setIsOpen(true); }}
              className="flex items-center"
            >
              <Plus className="mr-2" size={16} /> Adicionar Documento
            </Button>
          </DialogTrigger>
          
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Editar Documento' : 'Adicionar Documento'}</DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? 'Edite os detalhes do documento de transparência existente.' 
                  : 'Adicione um novo documento de transparência ao portal.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Templates section (only shown when adding new document) */}
              {!isEditing && (
                <div className="border rounded-md p-4 mb-4">
                  <Label className="mb-2 block">Modelos de Documentos</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {documentTemplates.map((template, index) => (
                      <Button
                        key={index}
                        type="button" 
                        variant="outline"
                        className="h-auto py-2 flex flex-col items-start text-left"
                        onClick={() => useTemplate(template)}
                      >
                        <span className="font-semibold">{template.title}</span>
                        <span className="text-xs text-gray-500 mt-1">{template.category}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select
                      name="category"
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="icon_type">Ícone</Label>
                    <Select
                      name="icon_type"
                      value={formData.icon_type}
                      onValueChange={(value) => handleSelectChange('icon_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um ícone" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentIcons.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            <div className="flex items-center">
                              <span className="mr-2">{icon.icon}</span>
                              <span>{icon.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="file_url">URL do Arquivo</Label>
                  <Input
                    id="file_url"
                    name="file_url"
                    value={formData.file_url}
                    onChange={handleChange}
                    placeholder="https://exemplo.com/arquivo.pdf"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="published_date">Data de Publicação</Label>
                  <Input
                    id="published_date"
                    name="published_date"
                    type="date"
                    value={formData.published_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={createDocument.isPending || updateDocument.isPending}>
                  {isEditing ? 'Atualizar' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar documentos..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2 gap-2 mb-2">
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="institutional">Institucionais</TabsTrigger>
                  </TabsList>
                  <TabsList className="grid grid-cols-3 gap-2">
                    <TabsTrigger value="projects">Projetos</TabsTrigger>
                    <TabsTrigger value="financial">Financeiro</TabsTrigger>
                    <TabsTrigger value="legal">Legal</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Categorias Recomendadas</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {documentCategories.map((category) => (
                  <li 
                    key={category.value}
                    className={`px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${activeTab === category.value ? 'bg-gray-100' : ''}`}
                    onClick={() => setActiveTab(category.value)}
                  >
                    {category.label}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4">
                  <div className="grid gap-4">
                    {Array(5).fill(null).map((_, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Table>
                  <TableCaption>
                    {filteredDocuments.length === 0 
                      ? 'Nenhum documento encontrado.' 
                      : `Total de ${filteredDocuments.length} documento(s).`}
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Data de Publicação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  
                  <TableBody>
                    {filteredDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell className="font-medium">{document.title}</TableCell>
                        <TableCell>
                          {documentCategories.find(cat => cat.value === document.category)?.label || document.category}
                        </TableCell>
                        <TableCell>{new Date(document.published_date).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(document)}
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(document)}
                            >
                              <Trash size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o documento "{selectedDocument?.title}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteDocument.isPending}
            >
              {deleteDocument.isPending ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransparencyManagement;
