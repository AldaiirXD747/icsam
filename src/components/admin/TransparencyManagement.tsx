
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { PlusCircle, Pencil, Trash2, FileText, Upload, Eye, FileUp, ArrowDownToLine, Link as LinkIcon, Download } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock type for transparency documents
interface TransparencyDocument {
  id: string;
  title: string;
  category: string;
  description?: string;
  file_url: string;
  published_date: string;
  size?: string;
  type?: string;
}

const mockDocuments: TransparencyDocument[] = [
  {
    id: '1',
    title: 'Relatório Financeiro 2023',
    category: 'financial',
    description: 'Relatório anual de prestação de contas e transparência financeira do Instituto.',
    file_url: 'https://example.com/relatorio-financeiro-2023.pdf',
    published_date: '2023-12-20',
    size: '2.4 MB',
    type: 'PDF'
  },
  {
    id: '2',
    title: 'Balanço Patrimonial 2023',
    category: 'financial',
    description: 'Balanço patrimonial completo do Instituto referente ao ano de 2023.',
    file_url: 'https://example.com/balanco-patrimonial-2023.pdf',
    published_date: '2023-12-15',
    size: '1.8 MB',
    type: 'PDF'
  },
  {
    id: '3',
    title: 'Estatuto Social',
    category: 'legal',
    description: 'Estatuto social e regimento interno do Instituto Criança Santa Maria.',
    file_url: 'https://example.com/estatuto-social.pdf',
    published_date: '2020-03-10',
    size: '3.2 MB',
    type: 'PDF'
  },
  {
    id: '4',
    title: 'Relatório de Atividades 2023',
    category: 'activities',
    description: 'Relatório detalhado das atividades e projetos realizados durante o ano de 2023.',
    file_url: 'https://example.com/relatorio-atividades-2023.pdf',
    published_date: '2023-12-22',
    size: '5.1 MB',
    type: 'PDF'
  }
];

const categoryOptions = [
  { value: 'financial', label: 'Financeiro' },
  { value: 'legal', label: 'Jurídico/Legal' },
  { value: 'activities', label: 'Atividades e Projetos' },
  { value: 'partnerships', label: 'Parcerias e Convênios' },
  { value: 'other', label: 'Outros Documentos' }
];

const TransparencyManagement = () => {
  const [documents, setDocuments] = useState<TransparencyDocument[]>(mockDocuments);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isUploading, setIsUploading] = useState(false);
  const [editingDocument, setEditingDocument] = useState<TransparencyDocument | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'financial',
    description: '',
    file: null as File | null,
    file_url: ''
  });
  
  const { toast } = useToast();
  
  // Handle filtering documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select change
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };
  
  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, file }));
    }
  };
  
  // Reset form data
  const resetFormData = () => {
    setFormData({
      title: '',
      category: 'financial',
      description: '',
      file: null,
      file_url: ''
    });
  };
  
  // Open edit dialog
  const handleEditDocument = (document: TransparencyDocument) => {
    setEditingDocument(document);
    setFormData({
      title: document.title,
      category: document.category,
      description: document.description || '',
      file: null,
      file_url: document.file_url
    });
    setIsEditDialogOpen(true);
  };
  
  // Handle document deletion
  const handleDeleteDocument = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este documento?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
      toast({
        title: "Documento excluído",
        description: "O documento foi excluído com sucesso."
      });
    }
  };
  
  // Handle document submission
  const handleSubmitDocument = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const newDocument: TransparencyDocument = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title,
        category: formData.category,
        description: formData.description,
        file_url: formData.file ? URL.createObjectURL(formData.file) : formData.file_url,
        published_date: new Date().toISOString().split('T')[0],
        size: formData.file ? `${(formData.file.size / (1024 * 1024)).toFixed(1)} MB` : '1.0 MB',
        type: formData.file ? formData.file.type.split('/')[1].toUpperCase() : 'PDF'
      };
      
      setDocuments([newDocument, ...documents]);
      resetFormData();
      setIsUploading(false);
      setIsAddDialogOpen(false);
      
      toast({
        title: "Documento adicionado",
        description: "O documento foi adicionado com sucesso."
      });
    }, 1500);
  };
  
  // Handle document update
  const handleUpdateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDocument) return;
    
    setIsUploading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const updatedDocuments = documents.map(doc => {
        if (doc.id === editingDocument.id) {
          return {
            ...doc,
            title: formData.title,
            category: formData.category,
            description: formData.description,
            file_url: formData.file ? URL.createObjectURL(formData.file) : formData.file_url,
            // Only update these if a new file was uploaded
            ...(formData.file && {
              size: `${(formData.file.size / (1024 * 1024)).toFixed(1)} MB`,
              type: formData.file.type.split('/')[1].toUpperCase()
            })
          };
        }
        return doc;
      });
      
      setDocuments(updatedDocuments);
      resetFormData();
      setIsUploading(false);
      setIsEditDialogOpen(false);
      setEditingDocument(null);
      
      toast({
        title: "Documento atualizado",
        description: "O documento foi atualizado com sucesso."
      });
    }, 1500);
  };
  
  // Format document category
  const formatCategory = (category: string) => {
    const found = categoryOptions.find(c => c.value === category);
    return found ? found.label : category;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a237e]">Gerenciamento de Transparência</h2>
          <p className="text-gray-500">Gerencie documentos de transparência, relatórios financeiros e outras informações públicas</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                resetFormData();
                setIsAddDialogOpen(true);
              }}
              className="flex items-center gap-2 bg-[#1a237e] text-white hover:bg-blue-800"
            >
              <PlusCircle size={16} />
              Adicionar Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Documento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitDocument} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Documento*</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleInputChange} 
                  placeholder="Ex: Relatório Financeiro 2023" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoria*</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  placeholder="Descreva o conteúdo do documento" 
                  rows={3} 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Arquivo*</Label>
                <div className="flex flex-col gap-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Input 
                      id="file" 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileChange} 
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                    />
                    <Label htmlFor="file" className="flex flex-col items-center cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm font-medium">Clique para selecionar um arquivo</span>
                      <span className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, XLS, XLSX (max. 10MB)</span>
                    </Label>
                  </div>
                  
                  {formData.file && (
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-blue-600 mr-2" />
                        <div>
                          <p className="text-sm font-medium">{formData.file.name}</p>
                          <p className="text-xs text-gray-500">{`${(formData.file.size / (1024 * 1024)).toFixed(2)} MB`}</p>
                        </div>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500"
                        onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="mx-4 text-xs text-gray-500">OU</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="file_url">Link para o documento</Label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="file_url" 
                        name="file_url" 
                        value={formData.file_url} 
                        onChange={handleInputChange} 
                        placeholder="https://exemplo.com/documento.pdf" 
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#1a237e] text-white hover:bg-blue-800"
                  disabled={isUploading || (!formData.file && !formData.file_url) || !formData.title}
                >
                  {isUploading ? 'Enviando...' : 'Adicionar Documento'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex-grow">
                <Input
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Select 
                  value={selectedCategory} 
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="financial">Financeiro</TabsTrigger>
                <TabsTrigger value="legal">Jurídico</TabsTrigger>
                <TabsTrigger value="activities">Atividades</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {filteredDocuments.length === 0 ? (
              <div className="text-center py-12 border rounded-md">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-1">Nenhum documento encontrado</h3>
                <p className="text-gray-500">Não há documentos correspondentes aos filtros aplicados.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start gap-3 mb-3 sm:mb-0">
                      <div className="bg-blue-50 p-2 rounded">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{doc.title}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          <span className="text-xs text-gray-500">
                            {formatCategory(doc.category)}
                          </span>
                          <span className="text-xs text-gray-500">
                            Publicado em: {new Date(doc.published_date).toLocaleDateString('pt-BR')}
                          </span>
                          {doc.size && (
                            <span className="text-xs text-gray-500">
                              Tamanho: {doc.size}
                            </span>
                          )}
                          {doc.type && (
                            <span className="text-xs text-gray-500">
                              Tipo: {doc.type}
                            </span>
                          )}
                        </div>
                        {doc.description && (
                          <p className="text-sm text-gray-600 mt-1 pr-4 line-clamp-2">{doc.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          <Eye className="h-4 w-4 mr-1" />
                          Visualizar
                        </Button>
                      </a>
                      <a href={doc.file_url} download className="w-full sm:w-auto">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          <ArrowDownToLine className="h-4 w-4 mr-1" />
                          Baixar
                        </Button>
                      </a>
                      <Button variant="ghost" size="sm" onClick={() => handleEditDocument(doc)}>
                        <Pencil className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(doc.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Edit Document Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Editar Documento</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateDocument} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Título do Documento*</Label>
              <Input 
                id="edit-title" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                placeholder="Ex: Relatório Financeiro 2023" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-category">Categoria*</Label>
              <Select 
                value={formData.category} 
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea 
                id="edit-description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                placeholder="Descreva o conteúdo do documento" 
                rows={3} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Arquivo</Label>
              <div className="flex flex-col gap-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Input 
                    id="edit-file" 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange} 
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                  />
                  <Label htmlFor="edit-file" className="flex flex-col items-center cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium">Clique para trocar o arquivo</span>
                    <span className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, XLS, XLSX (max. 10MB)</span>
                  </Label>
                </div>
                
                {formData.file && (
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium">{formData.file.name}</p>
                        <p className="text-xs text-gray-500">{`${(formData.file.size / (1024 * 1024)).toFixed(2)} MB`}</p>
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500"
                      onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                )}
                
                {!formData.file && formData.file_url && (
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium">Arquivo atual</p>
                        <p className="text-xs text-gray-500 truncate max-w-[300px]">{formData.file_url}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="mx-4 text-xs text-gray-500">OU</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-file_url">Link para o documento</Label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="edit-file_url" 
                      name="file_url" 
                      value={formData.file_url} 
                      onChange={handleInputChange} 
                      placeholder="https://exemplo.com/documento.pdf" 
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingDocument(null);
                }}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-[#1a237e] text-white hover:bg-blue-800"
                disabled={isUploading || (!formData.file && !formData.file_url) || !formData.title}
              >
                {isUploading ? 'Atualizando...' : 'Atualizar Documento'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransparencyManagement;
