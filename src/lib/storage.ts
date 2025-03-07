
import { supabase } from '../integrations/supabase/client';

/**
 * Uploads an image file to the specified storage bucket
 * @param bucket The storage bucket name
 * @param folder The folder within the bucket
 * @param file The file to upload
 * @returns The URL of the uploaded file
 */
export const uploadImage = async (
  bucket: string,
  folder: string,
  file: File
): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);
    
    if (error) {
      throw error;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Deletes a file from storage
 * @param bucket The storage bucket name
 * @param filePath The path of the file to delete
 */
export const deleteFile = async (bucket: string, filePath: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Extracts the file path from a public URL
 * @param publicUrl The public URL of the file
 * @param bucket The storage bucket name
 * @returns The file path within the bucket
 */
export const getFilePathFromUrl = (publicUrl: string, bucket: string): string => {
  const url = new URL(publicUrl);
  const pathSegments = url.pathname.split('/');
  const bucketIndex = pathSegments.findIndex(segment => segment === bucket);
  
  if (bucketIndex === -1) {
    throw new Error(`Could not find bucket "${bucket}" in URL ${publicUrl}`);
  }
  
  return pathSegments.slice(bucketIndex + 1).join('/');
};
