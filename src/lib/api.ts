
import { supabase } from '../integrations/supabase/client';
import { Team, User } from '../types';

// Get teams with optional filtering
export const getTeams = async (filter?: any): Promise<Team[]> => {
  try {
    let query = supabase.from('teams').select('*');
    
    // Apply filters if provided
    if (filter) {
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        query = query.ilike('name', `%${searchLower}%`);
      }
      
      if (filter.active !== undefined) {
        // Note: There's no 'active' field in the teams table, 
        // so we'll need to add that column to the database or ignore this filter
        // For now, we'll return all teams regardless of active status
      }
      
      if (filter.category) {
        query = query.eq('category', filter.category);
      }
    }
    
    const { data, error } = await query.order('name');
    
    if (error) throw error;
    
    // Transform Supabase data to match Team interface
    return (data || []).map(team => ({
      id: team.id,
      name: team.name,
      description: undefined, // This field doesn't exist in the DB
      logoUrl: team.logo || undefined,
      active: true, // Default as active since we don't have this field in DB
    }));
  } catch (error) {
    console.error('Error fetching teams:', error);
    return [];
  }
};

// Get a single team by ID
export const getTeam = async (id: string): Promise<Team | undefined> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) return undefined;
    
    return {
      id: data.id,
      name: data.name,
      description: undefined, // This field doesn't exist in the DB
      logoUrl: data.logo || undefined,
      active: true, // Default as active
    };
  } catch (error) {
    console.error('Error fetching team:', error);
    return undefined;
  }
};

// Create a new team
export const createTeam = async (team: Omit<Team, 'id'>): Promise<Team> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .insert({
        name: team.name,
        // No description field in the DB, so we don't include it
        logo: team.logoUrl || null,
        category: 'SUB-15', // Default category
        group_name: 'Grupo A' // Default group
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: undefined, // This field doesn't exist in the DB
      logoUrl: data.logo || undefined,
      active: true,
    };
  } catch (error) {
    console.error('Error creating team:', error);
    throw error;
  }
};

// Update an existing team
export const updateTeam = async (team: Team): Promise<Team> => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .update({
        name: team.name,
        // No description field in the DB, so we don't include it
        logo: team.logoUrl || null
      })
      .eq('id', team.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: undefined, // This field doesn't exist in the DB
      logoUrl: data.logo || undefined,
      active: true,
    };
  } catch (error) {
    console.error('Error updating team:', error);
    throw error;
  }
};

// Delete a team
export const deleteTeam = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error deleting team:', error);
    throw error;
  }
};

// Get users
export const getUsers = async (): Promise<User[]> => {
  try {
    // In a real application, you might fetch team members or admins from Supabase
    const { data, error } = await supabase
      .from('team_accounts')
      .select(`
        id,
        email,
        team_id,
        teams:team_id (
          id,
          name
        )
      `);
    
    if (error) throw error;
    
    return (data || []).map(user => ({
      id: user.id,
      email: user.email,
      teamId: user.team_id
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Update user
export const updateUser = async (user: User): Promise<User> => {
  try {
    const { data, error } = await supabase
      .from('team_accounts')
      .update({
        email: user.email,
        team_id: user.teamId
      })
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      email: data.email,
      teamId: data.team_id
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
