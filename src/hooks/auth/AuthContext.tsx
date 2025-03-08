import { createContext, ReactNode, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  checkTeamAccess: () => Promise<boolean>;
  checkAdminAccess: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Check active session
    const getSession = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
          return;
        }
        
        console.log('Initial session data:', data.session);
        
        // Check for custom session in localStorage
        const customSessionStr = localStorage.getItem('custom_auth_session');
        if (customSessionStr && !data.session) {
          try {
            console.log('Found custom session, setting user from localStorage');
            const customSession = JSON.parse(customSessionStr);
            setUser(customSession.user as unknown as User);
          } catch (e) {
            console.error('Error parsing custom session:', e);
            localStorage.removeItem('custom_auth_session');
          }
        } else {
          setSession(data.session);
          setUser(data.session?.user ?? null);
        }
      } catch (error) {
        console.error('Unexpected error during getSession:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getSession();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        
        // Prevent redirect loops by checking the redirecting state
        if (redirecting) return;
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
        
        // Handle sign in and sign out events
        if (event === 'SIGNED_IN') {
          setRedirecting(true);
          toast({
            title: 'Login realizado com sucesso',
            variant: 'default',
          });
          
          // Use setTimeout to avoid potential race conditions
          setTimeout(() => {
            navigate('/admin', { replace: true });
            setRedirecting(false);
          }, 100);
        } else if (event === 'SIGNED_OUT') {
          setRedirecting(true);
          toast({
            title: 'Você foi desconectado',
            variant: 'default',
          });
          
          // Use setTimeout to avoid potential race conditions
          setTimeout(() => {
            navigate('/login', { replace: true });
            setRedirecting(false);
          }, 100);
        }
      }
    );
    
    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, toast, redirecting]);
  
  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting login with email:', email);
      
      // First try with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!error) {
        console.log('Supabase Auth login successful:', data);
        localStorage.removeItem('custom_auth_session'); // Clear any custom session
        return { success: true };
      }
      
      console.log('Trying custom authentication after Supabase Auth failed with error:', error);
      
      // If Supabase Auth fails, try with custom authentication for app_users table
      const { data: userData, error: customError } = await supabase
        .rpc('verify_user_credentials', {
          p_email: email,
          p_password: password
        });
      
      if (customError) {
        console.error('Error in custom authentication:', customError);
        return { success: false, error: customError.message };
      }
      
      if (userData && userData.length > 0) {
        const user = userData[0];
        console.log('Custom auth login successful:', user);
        
        // Set user session manually since we're using custom auth
        const sessionData = {
          user: {
            id: user.id,
            email: user.email,
            user_metadata: {
              name: user.name,
              role: user.role
            }
          }
        };
        
        // Store the session data in localStorage for persistence
        localStorage.setItem('custom_auth_session', JSON.stringify(sessionData));
        
        // Set the session in the context
        setUser(sessionData.user as unknown as User);
        
        return { success: true };
      }
      
      console.error('Login failed: Invalid credentials');
      return { success: false, error: 'Credenciais inválidas.' };
    } catch (error: any) {
      console.error('Unexpected error during sign in:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };
  
  // Sign out function
  const signOut = async () => {
    try {
      // Clear custom auth session if it exists
      localStorage.removeItem('custom_auth_session');
      
      // Also sign out from Supabase Auth
      await supabase.auth.signOut();
      
      // Clear the user and session in the context
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Erro ao desconectar',
        description: 'Ocorreu um erro ao tentar desconectar.',
        variant: 'destructive',
      });
    }
  };
  
  // Check if user has team access
  const checkTeamAccess = async () => {
    if (!user) {
      // Check if there's a custom auth session
      const customSession = localStorage.getItem('custom_auth_session');
      if (!customSession) return false;
      
      try {
        const parsedSession = JSON.parse(customSession);
        if (parsedSession.user?.user_metadata?.role === 'team_manager') {
          return true;
        }
      } catch (e) {
        console.error('Error parsing custom session:', e);
        return false;
      }
      
      return false;
    }
    
    try {
      // Check for team_id in user metadata
      const role = user.user_metadata?.role;
      
      if (role === 'team_manager') {
        return true;
      }
      
      // Alternatively, check the team_accounts table
      const { data, error } = await supabase
        .from('team_accounts')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error checking team access:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error checking team access:', error);
      return false;
    }
  };
  
  // Check if user has admin access
  const checkAdminAccess = async () => {
    try {
      console.log('Checking admin access...');
      
      // First check custom authentication
      const customSession = localStorage.getItem('custom_auth_session');
      if (customSession) {
        try {
          const parsedSession = JSON.parse(customSession);
          console.log('Custom session found:', parsedSession);
          
          if (parsedSession.user?.user_metadata?.role === 'admin') {
            console.log('Admin access granted via custom session');
            return true;
          }
        } catch (e) {
          console.error('Error parsing custom session:', e);
        }
      }
      
      // Then check Supabase authentication
      if (!user) {
        console.log('No user found, denying admin access');
        return false;
      }
      
      // Check role from user metadata
      const role = user.user_metadata?.role;
      console.log('User role from metadata:', role);
      
      if (role === 'admin') {
        console.log('Admin access granted via user metadata');
        return true;
      }
      
      // Alternatively, check the app_users table
      console.log('Checking app_users table for admin access...');
      const { data, error } = await supabase
        .rpc('verify_user_credentials', {
          p_email: user.email || '',
          p_password: '' // Password not needed for this check
        });
      
      if (error) {
        console.error('Error checking admin access:', error);
        return false;
      }
      
      const isAdmin = data.some(userData => userData.role === 'admin');
      console.log('Admin access from app_users table:', isAdmin);
      return isAdmin;
    } catch (error) {
      console.error('Error checking admin access:', error);
      return false;
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        signIn,
        signOut,
        checkTeamAccess,
        checkAdminAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
