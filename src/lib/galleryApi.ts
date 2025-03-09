
import { supabase } from '../integrations/supabase/client';
import { GalleryImage } from '../types';

export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Convert data to GalleryImage with proper field mapping
    return (data || []).map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      imageUrl: item.image_url, // Provide camelCase version
      championship_id: item.championship_id,
      championshipId: item.championship_id, // Provide camelCase version
      created_at: item.created_at,
      createdAt: item.created_at, // Provide camelCase version
      featured: item.featured || false
    }));
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
};

// Add a new gallery image
export const addGalleryImage = async (image: Omit<GalleryImage, 'id' | 'created_at' | 'createdAt'>): Promise<GalleryImage | null> => {
  try {
    // Prepare data for insertion with snake_case keys
    const imageData = {
      title: image.title,
      description: image.description,
      image_url: image.image_url || image.imageUrl, // Accept both formats but use snake_case for DB
      championship_id: image.championship_id || image.championshipId,
      featured: image.featured
    };
    
    const { data, error } = await supabase
      .from('gallery_images')
      .insert(imageData)
      .select()
      .single();
    
    if (error) throw error;
    
    // Return with both formats for compatibility
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      image_url: data.image_url,
      imageUrl: data.image_url,
      championship_id: data.championship_id,
      championshipId: data.championship_id,
      created_at: data.created_at,
      createdAt: data.created_at,
      featured: data.featured
    };
  } catch (error) {
    console.error('Error adding gallery image:', error);
    return null;
  }
};

// Add multiple gallery images (a new function for batch uploads)
export const addMultipleGalleryImages = async (championshipId: string, images: any[]): Promise<boolean> => {
  try {
    // For simplicity, we'll assume each image has a file and a URL
    const imageData = images.map(image => ({
      title: image.name || 'Gallery Image',
      description: '',
      image_url: image.preview || '',
      championship_id: championshipId,
      featured: false
    }));
    
    const { error } = await supabase
      .from('gallery_images')
      .insert(imageData);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error adding multiple gallery images:', error);
    return false;
  }
};

// Update an existing gallery image
export const updateGalleryImage = async (image: GalleryImage): Promise<GalleryImage | null> => {
  try {
    // Prepare data for update with snake_case keys
    const imageData = {
      title: image.title,
      description: image.description,
      image_url: image.image_url || image.imageUrl,
      championship_id: image.championship_id || image.championshipId,
      featured: image.featured
    };
    
    const { data, error } = await supabase
      .from('gallery_images')
      .update(imageData)
      .eq('id', image.id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Return with both formats for compatibility
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      image_url: data.image_url,
      imageUrl: data.image_url,
      championship_id: data.championship_id,
      championshipId: data.championship_id,
      created_at: data.created_at,
      createdAt: data.created_at,
      featured: data.featured
    };
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return null;
  }
};

// Delete a gallery image
export const deleteGalleryImage = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return false;
  }
};
