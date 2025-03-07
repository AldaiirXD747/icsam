
import { supabase } from '../integrations/supabase/client';
import { GalleryImage } from '../types';
import { FileWithPreview } from '@/components/ui/multi-file-upload';

export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching gallery images:', error);
      return [];
    }
    
    return (data || []).map(image => ({
      id: image.id,
      title: image.title,
      description: image.description,
      imageUrl: image.image_url,
      championshipId: image.championship_id,
      createdAt: image.created_at,
      featured: image.featured || false
    }));
  } catch (error) {
    console.error('Error in getGalleryImages:', error);
    return [];
  }
};

export const addGalleryImage = async (image: Omit<GalleryImage, 'id' | 'createdAt'>): Promise<GalleryImage> => {
  try {
    // If image.imageUrl is a local blob URL, we need to upload the file first
    let finalImageUrl = image.imageUrl;
    
    if (image.imageUrl.startsWith('blob:')) {
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();
      const fileExt = blob.type.split('/')[1];
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(`images/${fileName}`, blob);
      
      if (uploadError) throw uploadError;
      
      // Get public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(`images/${fileName}`);
      
      finalImageUrl = publicUrlData.publicUrl;
    }
    
    const { data, error } = await supabase
      .from('gallery_images')
      .insert({
        title: image.title,
        description: image.description || null,
        image_url: finalImageUrl,
        championship_id: image.championshipId,
        featured: image.featured || false
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      imageUrl: data.image_url,
      championshipId: data.championship_id,
      createdAt: data.created_at,
      featured: data.featured || false
    };
  } catch (error) {
    console.error('Error adding gallery image:', error);
    throw error;
  }
};

export const addMultipleGalleryImages = async (
  championshipId: string, 
  images: FileWithPreview[]
): Promise<GalleryImage[]> => {
  try {
    const results: GalleryImage[] = [];
    
    // Upload images one by one
    for (const image of images) {
      const file = image.file;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      // Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(`images/${fileName}`, file);
      
      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        continue;
      }
      
      // Get public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(`images/${fileName}`);
      
      const imageUrl = publicUrlData.publicUrl;
      
      // Add record to database
      const { data, error } = await supabase
        .from('gallery_images')
        .insert({
          title: image.title,
          description: image.description || null,
          image_url: imageUrl,
          championship_id: championshipId,
          featured: false
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error adding image record:', error);
        continue;
      }
      
      results.push({
        id: data.id,
        title: data.title,
        description: data.description,
        imageUrl: data.image_url,
        championshipId: data.championship_id,
        createdAt: data.created_at,
        featured: data.featured || false
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error adding multiple gallery images:', error);
    throw error;
  }
};

export const updateGalleryImage = async (image: GalleryImage): Promise<GalleryImage> => {
  try {
    // If image.imageUrl is a local blob URL, we need to upload the file first
    let finalImageUrl = image.imageUrl;
    
    if (image.imageUrl.startsWith('blob:')) {
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();
      const fileExt = blob.type.split('/')[1];
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(`images/${fileName}`, blob);
      
      if (uploadError) throw uploadError;
      
      // Get public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('gallery')
        .getPublicUrl(`images/${fileName}`);
      
      finalImageUrl = publicUrlData.publicUrl;
    }
    
    const { data, error } = await supabase
      .from('gallery_images')
      .update({
        title: image.title,
        description: image.description || null,
        image_url: finalImageUrl,
        championship_id: image.championshipId,
        featured: image.featured || false
      })
      .eq('id', image.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      imageUrl: data.image_url,
      championshipId: data.championship_id,
      createdAt: data.created_at,
      featured: data.featured || false
    };
  } catch (error) {
    console.error('Error updating gallery image:', error);
    throw error;
  }
};

export const deleteGalleryImage = async (id: string): Promise<void> => {
  try {
    // First, get the image record to find the image URL
    const { data: imageData, error: fetchError } = await supabase
      .from('gallery_images')
      .select('image_url')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Delete the image from the database
    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    // Optionally, we could also delete the file from storage
    // This would require extracting the file path from the image_url
    // const filePath = imageData.image_url.split('/').slice(-2).join('/');
    // await supabase.storage.from('gallery').remove([filePath]);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    throw error;
  }
};
