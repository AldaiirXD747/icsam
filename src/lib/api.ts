import { supabase } from '../integrations/supabase/client';
import { Team, User, Championship, Player } from '../types';

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
      logo: team.logo || undefined,
      category: team.category,
      group_name: team.group_name,
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
      logo: data.logo || undefined,
      category: data.category,
      group_name: data.group_name,
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
    // Ensure required fields have default values
    const teamData = {
      name: team.name,
      // No description field in the DB, so we don't include it
      logo: team.logoUrl || team.logo || null,
      category: team.category || 'SUB-15', // Default category
      group_name: team.group_name || 'Grupo A' // Default group
    };
    
    const { data, error } = await supabase
      .from('teams')
      .insert(teamData)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: undefined, // This field doesn't exist in the DB
      logoUrl: data.logo || undefined,
      logo: data.logo || undefined,
      category: data.category,
      group_name: data.group_name,
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
        logo: team.logoUrl || team.logo || null,
        category: team.category,
        group_name: team.group_name
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
      logo: data.logo || undefined,
      category: data.category,
      group_name: data.group_name,
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

// Get championships
export const getChampionships = async (): Promise<Championship[]> => {
  try {
    const { data, error } = await supabase
      .from('championships')
      .select('*')
      .order('year', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(championship => {
      // Parse categories if it's a string, otherwise use as is or default to empty array
      let parsedCategories;
      try {
        parsedCategories = typeof championship.categories === 'string' 
          ? JSON.parse(championship.categories) 
          : championship.categories || [];
      } catch (e) {
        parsedCategories = [];
      }
      
      // Parse sponsors if it's a string, otherwise use as is or default to empty array
      let parsedSponsors;
      try {
        parsedSponsors = typeof championship.sponsors === 'string' 
          ? JSON.parse(championship.sponsors) 
          : championship.sponsors || [];
      } catch (e) {
        parsedSponsors = [];
      }
      
      // Ensure status is one of the expected values
      const validStatus = ['upcoming', 'ongoing', 'finished'];
      const status = validStatus.includes(championship.status) 
        ? championship.status as 'upcoming' | 'ongoing' | 'finished'
        : 'upcoming';
        
      return {
        id: championship.id,
        name: championship.name,
        year: championship.year,
        description: championship.description,
        banner_image: championship.banner_image,
        start_date: championship.start_date,
        end_date: championship.end_date,
        location: championship.location,
        categories: parsedCategories,
        organizer: championship.organizer,
        sponsors: parsedSponsors,
        status: status
      };
    });
  } catch (error) {
    console.error('Error fetching championships:', error);
    return [];
  }
};

// Get players for a team
export const getTeamPlayers = async (teamId: string): Promise<Player[]> => {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('team_id', teamId)
      .order('name');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching team players:', error);
    return [];
  }
};

// Upload player photo
export const uploadPlayerPhoto = async (file: File): Promise<string | null> => {
  try {
    // Check if storage bucket exists, if not create it
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'player-photos');
    
    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket('player-photos', {
        public: true
      });
      
      if (createError) throw createError;
    }
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('player-photos')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data } = supabase.storage
      .from('player-photos')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading player photo:', error);
    return null;
  }
};

// Create or update player
export const savePlayer = async (player: Partial<Player>): Promise<Player | null> => {
  try {
    if (player.id) {
      // Update existing player
      const { data, error } = await supabase
        .from('players')
        .update({
          name: player.name,
          number: player.number,
          position: player.position,
          photo: player.photo,
          team_id: player.teamId || player.team_id
        })
        .eq('id', player.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new player
      const { data, error } = await supabase
        .from('players')
        .insert({
          name: player.name,
          number: player.number,
          position: player.position,
          photo: player.photo,
          team_id: player.teamId || player.team_id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error saving player:', error);
    return null;
  }
};

// Delete player
export const deletePlayer = async (playerId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', playerId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting player:', error);
    return false;
  }
};
