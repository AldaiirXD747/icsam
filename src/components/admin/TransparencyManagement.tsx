
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus, Pencil, Trash2, Upload } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { MultiFileUpload, FileWithPreview } from "@/components/ui/multi-file-upload";
import { supabase } from '@/integrations/supabase/client';

interface Document {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  icon: string;
  createdAt: string;
}

const TransparencyManagement = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      title: "DADOS DO INSTITUTO",
      description: "CNPJ: 43.999.350/0001-16 | Data de Abertura: 14/10/2021",
      url: "#",
      category: "institucional",
      icon: "Building",
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      title: "PROJETOS APROVADOS",
      description: "Lista completa de emendas parlamentares executadas pelo Instituto.",
      url: "#",
      category: "projetos",
      icon: "FilePieChart",
      createdAt: new Date().toISOString()
    },
    {
      id: "3",
      title: "RELATÓRIO ANUAL DE GASTOS",
      description: "Detalhamento da aplicação de recursos financeiros.",
      url: "#",
      category: "financeiro",
      icon: "FileBarChart",
      createdAt: new Date().toISOString()
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);

  const iconOptions = [
    { value: "FileText", label: "Documento" },
    { value: "FileBarChart", label: "Gráfico" },
    { value: "FilePieChart", label: "Relatório" },
    { value: "Users", label: "Pessoas" },
    { value: "File", label: "Arquivo" },
    { value: "FileCheck", label: "Documento Verificado" },
    { value: "MapPin", label: "Localização" },
    { value: "Building", label: "Prédio" }
  ];

  const categoryOptions = [
    { value: "institucional", label: "Institucional" },
    { value: "financeiro", label: "Financeiro" },
    { value: "projetos", label: "Projetos" },
    { value: "legal", label: "Legal" },
    { value: "outros", label: "Outros" }
  ];

  const handleFilesChange = (files: FileWithPreview[]) => {
    setSelectedFiles(files);
  };

  const handleSaveDocument = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const icon = formData.get('icon') as string;
    
    try {
      let fileUrl = "#";
      
      // Upload file to Supabase Storage if we have one
      if (selectedFiles.length > 0) {
        const file = selectedFiles[0].file;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).slice(2)}_${Date.now()}.${fileExt}`;
        const filePath = `transparency/${fileName}`;
        
        const { data, error } = await supabase.storage
          .from('documents')
          .upload(filePath, file);
          
        if (error) throw error;
        
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);
          
        fileUrl = urlData.publicUrl;
      }
      
      if (editingDocument) {
        // Update existing document
        const updatedDocuments = documents.map(doc => 
          doc.id === editingDocument.id 
            ? { 
                ...doc, 
                title, 
                description, 
                category, 
                icon,
                url: selectedFiles.length > 0 ? fileUrl : doc.url
              } 
            : doc
        );
        setDocuments(updatedDocuments);
        toast({
          title: "Documento atualizado",
          description: `${title} foi atualizado com sucesso.`
        });
      } else {
        // Add new document
        const newDocument: Document = {
          id: Math.random().toString(36).slice(2),
          title,
          description,
          category,
          icon,
          url: fileUrl,
          createdAt: new Date().toISOString()
        };
        
        setDocuments([...documents, newDocument]);
        toast({
          title: "Documento adicionado",
          description: `${title} foi adicionado com sucesso.`
        });
      }
      
      // Reset form state
      setEditingDocument(null);
      setSelectedFiles([]);
      
    } catch (error) {
      console.error('Error saving document:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o documento.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocument = (id: string) => {
    // In a real application, you would call your API to delete
    setDocuments(documents.filter(doc => doc.id !== id));
    toast({
      title: "Documento removido",
      description: "O documento foi removido com sucesso."
    });
  };

  const openEditDialog = (document: Document) => {
    setEditingDocument(document);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-primary">Gestão de Documentos - Transparência</h2>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingDocument(null);
                setSelectedFiles([]);
              }}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Adicionar Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingDocument ? "Editar Documento" : "Novo Documento"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSaveDocument} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium">Título</label>
                <Input 
                  id="title" 
                  name="title" 
                  defaultValue={editingDocument?.title || ""} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium">Descrição</label>
                <Textarea 
                  id="description" 
                  name="description" 
                  defaultValue={editingDocument?.description || ""} 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="category" className="block text-sm font-medium">Categoria</label>
                  <select 
                    id="category" 
                    name="category" 
                    defaultValue={editingDocument?.category || "institucional"} 
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="icon" className="block text-sm font-medium">Ícone</label>
                  <select 
                    id="icon" 
                    name="icon" 
                    defaultValue={editingDocument?.icon || "FileText"} 
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    {iconOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">Arquivo</label>
                <MultiFileUpload 
                  onFilesChange={handleFilesChange}
                  maxFiles={1}
                />
                {editingDocument && !selectedFiles.length && (
                  <p className="text-xs text-gray-500 mt-1">
                    {editingDocument.url !== "#" 
                      ? "Documento atual será mantido se nenhum novo for enviado." 
                      : "Nenhum documento atual. Faça upload de um novo."}
                  </p>
                )}
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancelar</Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Salvando...
                    </>
                  ) : (
                    editingDocument ? "Atualizar" : "Adicionar"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map(document => (
          <Card key={document.id} className="overflow-hidden border-blue-100">
            <CardContent className="p-0">
              <div className="flex">
                <div className="bg-blue-50 p-6 flex items-center justify-center">
                  <FileText className="h-10 w-10 text-blue-primary" />
                </div>
                
                <div className="p-4 flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-blue-primary">{document.title}</h3>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => openEditDialog(document)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                      
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDeleteDocument(document.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-1">{document.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {categoryOptions.find(c => c.value === document.category)?.label || document.category}
                    </span>
                    <a 
                      href={document.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-blue-primary hover:underline flex items-center"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      {document.url === "#" ? "Sem arquivo" : "Baixar"}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {documents.length === 0 && (
        <div className="text-center py-12 border rounded-md bg-gray-50">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">Nenhum documento encontrado</h3>
          <p className="text-gray-500 text-sm">Adicione documentos para exibi-los no Portal da Transparência.</p>
        </div>
      )}
    </div>
  );
};

export default TransparencyManagement;
