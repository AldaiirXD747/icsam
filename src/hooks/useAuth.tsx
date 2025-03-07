
import { useEffect, useState, useContext, createContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  checkTeamAccess: () => Promise<boolean>;
  checkAdminAccess: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
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
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
        
        // Handle sign in and sign out events
        if (event === 'SIGNED_IN') {
          toast({
            title: 'Login realizado com sucesso',
            variant: 'default',
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: 'Você foi desconectado',
            variant: 'default',
          });
          navigate('/login');
        }
      }
    );
    
    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, toast]);
  
  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Error signing in:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Unexpected error during sign in:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    }
  };
  
  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
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
    if (!user) return false;
    
    try {
      // Check for team_id in user metadata
      const teamId = user.user_metadata?.team_id;
      
      if (teamId) {
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
    if (!user) return false;
    
    try {
      // Check role from user metadata
      const role = user.user_metadata?.role;
      
      if (role === 'admin') {
        return true;
      }
      
      // Alternatively, check the app_users table
      const { data, error } = await supabase
        .rpc('verify_user_credentials', {
          p_email: user.email || '',
          p_password: '' // Password not needed for this check
        });
      
      if (error) {
        console.error('Error checking admin access:', error);
        return false;
      }
      
      return data.some(userData => userData.role === 'admin');
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// HOC for protected routes
export const withAuth = (Component: React.ComponentType, requiredRole?: 'admin' | 'team') => {
  return (props: any) => {
    const { session, loading, user, checkAdminAccess, checkTeamAccess } = useAuth();
    const navigate = useNavigate();
    const [hasAccess, setHasAccess] = useState(false);
    const [checking, setChecking] = useState(true);
    
    useEffect(() => {
      const checkAccess = async () => {
        if (loading) return;
        
        if (!session) {
          // Not authenticated
          navigate('/login');
          return;
        }
        
        if (requiredRole === 'admin') {
          const isAdmin = await checkAdminAccess();
          if (!isAdmin) {
            navigate('/');
            return;
          }
          setHasAccess(true);
        } else if (requiredRole === 'team') {
          const hasTeamAccess = await checkTeamAccess();
          if (!hasTeamAccess) {
            navigate('/team/login');
            return;
          }
          setHasAccess(true);
        } else {
          // No specific role required, just need to be authenticated
          setHasAccess(true);
        }
        
        setChecking(false);
      };
      
      checkAccess();
    }, [session, loading, navigate, checkAdminAccess, checkTeamAccess]);
    
    if (loading || checking) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    
    return hasAccess ? <Component {...props} /> : null;
  };
};

// Auth provider wrapper for the app
export const AuthProviderWrapper = ({ children }: { children: ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default useAuth;
