
import { Team } from '@/types/championship';
import { supabase } from '@/integrations/supabase/client';

export const getAllTeams = async (): Promise<Team[]> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('id, name, logo, category, group_name')
      .order('name');

    if (error) {
      console.error("Error fetching teams:", error);
      throw error;
    }

    return data as Team[];
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};

export const getTeamById = async (id: string): Promise<Team | null> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('id, name, logo, category, group_name')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error("Error fetching team:", error);
      throw error;
    }

    return data as Team;
  } catch (error) {
    console.error("Error fetching team:", error);
    throw error;
  }
};
