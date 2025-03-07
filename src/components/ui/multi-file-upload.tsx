
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Image, Upload } from 'lucide-react';

export type FileWithPreview = {
  file: File;
  previewUrl: string;
  title: string;
  description: string;
};

interface MultiFileUploadProps {
  onFilesChange: (files: FileWithPreview[]) => void;
  maxFiles?: number;
}

export const MultiFileUpload = ({
  onFilesChange,
  maxFiles = 100,
}: MultiFileUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    const validFiles = newFiles.filter(file => file.type.startsWith('image/'));
    
    // Check if adding new files exceeds the max limit
    if (selectedFiles.length + validFiles.length > maxFiles) {
      alert(`Você pode selecionar no máximo ${maxFiles} imagens.`);
      return;
    }
    
    // Create preview URLs and initial metadata
    const filesWithPreviews = validFiles.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
      title: file.name.split('.')[0], // Default title is filename without extension
      description: '',
    }));
    
    const updatedFiles = [...selectedFiles, ...filesWithPreviews];
    setSelectedFiles(updatedFiles);
    onFilesChange(updatedFiles);
    
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(updatedFiles[index].previewUrl);
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handleMetadataChange = (index: number, field: 'title' | 'description', value: string) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles[index][field] = value;
    setSelectedFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input 
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="mr-2"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Button type="button" variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Selecionar Imagens
          </Button>
        </label>
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium">{selectedFiles.length}</span> de <span className="font-medium">{maxFiles}</span> imagens selecionadas
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {selectedFiles.map((file, index) => (
            <div key={index} className="relative border rounded-md p-3 bg-gray-50">
              <div className="absolute top-2 right-2 z-10">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="h-6 w-6 p-0 rounded-full"
                  onClick={() => handleRemoveFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="h-32 mb-3 overflow-hidden rounded-md bg-gray-100">
                <img
                  src={file.previewUrl}
                  alt={`Preview ${index}`}
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="space-y-2">
                <Input
                  value={file.title}
                  onChange={(e) => handleMetadataChange(index, 'title', e.target.value)}
                  placeholder="Título"
                  className="text-sm"
                />
                <Input
                  value={file.description}
                  onChange={(e) => handleMetadataChange(index, 'description', e.target.value)}
                  placeholder="Descrição (opcional)"
                  className="text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedFiles.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
          <Image className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            Nenhuma imagem selecionada
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Selecione imagens para upload (PNG, JPG, JPEG)
          </p>
        </div>
      )}
    </div>
  );
};
