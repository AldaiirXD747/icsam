
import { supabase } from '@/integrations/supabase/client';
import { showErrorToast } from './errorHandler';

interface UploadOptions {
  bucket: string;
  path?: string;
  fileSizeLimit?: number; // in bytes
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
}

interface UploadResult {
  success: boolean;
  path?: string;
  publicUrl?: string;
  error?: string;
}

const defaultOptions: UploadOptions = {
  bucket: 'public',
  path: '',
  fileSizeLimit: 10 * 1024 * 1024, // 10MB
  allowedTypes: [], // Empty array means all types allowed
};

/**
 * Upload a file to Supabase Storage
 */
export const uploadFile = async (
  file: File,
  customOptions?: Partial<UploadOptions>
): Promise<UploadResult> => {
  const options = { ...defaultOptions, ...customOptions };
  
  try {
    // Validate file size
    if (options.fileSizeLimit && file.size > options.fileSizeLimit) {
      const sizeInMB = options.fileSizeLimit / (1024 * 1024);
      throw new Error(`O arquivo é muito grande. Tamanho máximo permitido: ${sizeInMB}MB`);
    }
    
    // Validate file type
    if (options.allowedTypes && options.allowedTypes.length > 0) {
      const fileType = file.type;
      if (!options.allowedTypes.includes(fileType)) {
        throw new Error(`Tipo de arquivo não permitido. Tipos permitidos: ${options.allowedTypes.join(', ')}`);
      }
    }
    
    // Generate file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = options.path ? `${options.path}/${fileName}` : fileName;
    
    // Upload file to Supabase
    const { data, error } = await supabase.storage
      .from(options.bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(options.bucket)
      .getPublicUrl(data.path);
    
    return {
      success: true,
      path: data.path,
      publicUrl: urlData.publicUrl,
    };
  } catch (error: any) {
    console.error('File upload error:', error);
    
    const errorMessage = error.message || 'Erro ao fazer upload do arquivo';
    showErrorToast(errorMessage);
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Upload multiple files to Supabase Storage
 */
export const uploadMultipleFiles = async (
  files: File[],
  customOptions?: Partial<UploadOptions>
): Promise<UploadResult[]> => {
  const results: UploadResult[] = [];
  
  for (const file of files) {
    const result = await uploadFile(file, customOptions);
    results.push(result);
    
    // If any upload fails and there's a custom error handler, call it
    if (!result.success && customOptions?.onProgress) {
      customOptions.onProgress((results.length / files.length) * 100);
    }
  }
  
  return results;
};

/**
 * Delete a file from Supabase Storage
 */
export const deleteFile = async (
  path: string,
  bucket: string = defaultOptions.bucket
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('File delete error:', error);
    return {
      success: false,
      error: error.message || 'Erro ao excluir o arquivo',
    };
  }
};
