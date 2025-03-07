
import { supabase } from '../integrations/supabase/client';
import { GalleryImage } from '../types';

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
    const { data, error } = await supabase
      .from('gallery_images')
      .insert({
        title: image.title,
        description: image.description || null,
        image_url: image.imageUrl,
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

export const updateGalleryImage = async (image: GalleryImage): Promise<GalleryImage> => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .update({
        title: image.title,
        description: image.description || null,
        image_url: image.imageUrl,
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
    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    throw error;
  }
};
