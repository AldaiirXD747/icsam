
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { TeamAccountType } from '@/types/database';

// This utility file handles all team account API interactions
export async function getTeamAccount(teamId: string) {
  try {
    // First, we need to retrieve the team account
    const { data, error } = await supabase
      .from('team_accounts')
      .select('*')
      .eq('team_id', teamId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching team account:', error);
      return null;
    }

    return data as TeamAccountType | null;
  } catch (error) {
    console.error('Error in getTeamAccount:', error);
    return null;
  }
}

export async function createTeamAccount(teamId: string, email: string, password: string) {
  try {
    // First, create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          team_id: teamId,
          role: 'team'
        }
      }
    });
    
    if (authError) {
      throw authError;
    }
    
    if (!authData.user) {
      throw new Error('No user returned from auth signup');
    }
    
    // Now create the team_account record
    const { data, error } = await supabase
      .from('team_accounts')
      .insert({
        team_id: teamId,
        user_id: authData.user.id,
        email: email
      })
      .select()
      .single();
      
    if (error) {
      // If there was an error creating the team_account record,
      // we should try to delete the auth user to clean up
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating team account:', error);
    throw error;
  }
}

export async function updateTeamAccount(accountId: string, email: string, password: string | null = null) {
  try {
    // First, get the current account to retrieve user_id
    const { data: currentAccount, error: accountError } = await supabase
      .from('team_accounts')
      .select('user_id, email')
      .eq('id', accountId)
      .single();
      
    if (accountError) {
      throw accountError;
    }
    
    // Update the team_account record with the new email
    const { error: updateError } = await supabase
      .from('team_accounts')
      .update({ email })
      .eq('id', accountId);
      
    if (updateError) {
      throw updateError;
    }
    
    // If a password was provided, update the auth user
    if (password) {
      // We need admin privilege to update user password
      // This would normally be done through an edge function
      // This is a placeholder for now
      console.log('Password update would be handled through admin API');
    }
    
    return true;
  } catch (error) {
    console.error('Error updating team account:', error);
    throw error;
  }
}

export async function deleteTeamAccount(accountId: string) {
  try {
    // First, get the current account to retrieve user_id
    const { data: currentAccount, error: accountError } = await supabase
      .from('team_accounts')
      .select('user_id')
      .eq('id', accountId)
      .single();
      
    if (accountError) {
      throw accountError;
    }
    
    // Delete the team_account record
    const { error: deleteError } = await supabase
      .from('team_accounts')
      .delete()
      .eq('id', accountId);
      
    if (deleteError) {
      throw deleteError;
    }
    
    // Delete the auth user (would require admin privileges)
    // This is a placeholder for now
    console.log('Auth user deletion would be handled through admin API');
    
    return true;
  } catch (error) {
    console.error('Error deleting team account:', error);
    throw error;
  }
}
