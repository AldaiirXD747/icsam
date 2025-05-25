
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
            
            // Redirect to admin if we're on login page
            if (window.location.pathname === '/login') {
              navigate('/admin', { replace: true });
            }
          } catch (e) {
            console.error('Error parsing custom session:', e);
            localStorage.removeItem('custom_auth_session');
          }
        } else {
          // Set session for any user
          if (data.session) {
            setSession(data.session);
            setUser(data.session.user);
            
            // Redirect to admin if we're on login page
            if (window.location.pathname === '/login') {
              navigate('/admin', { replace: true });
            }
          }
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
        
        // Allow any user
        if (newSession) {
          setSession(newSession);
          setUser(newSession.user);
        } else {
          setSession(null);
          setUser(null);
        }
        
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
  
  // Sign in function - accept any email and password
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting login with email:', email);
      
      // Allow any email, even empty password
      if (!email) {
        return { 
          success: false, 
          error: 'Por favor, informe um email.' 
        };
      }
      
      // Create a fake session for any email
      const sessionData = {
        user: {
          id: 'fake-user-' + Date.now(),
          email: email,
          user_metadata: {
            name: email.split('@')[0],
            role: 'admin'
          }
        }
      };
      
      // Store the session data in localStorage for persistence
      localStorage.setItem('custom_auth_session', JSON.stringify(sessionData));
      
      // Set the session in the context
      setUser(sessionData.user as unknown as User);
      
      // Redirect manually to ensure navigation happens
      setRedirecting(true);
      setTimeout(() => {
        navigate('/admin', { replace: true });
        setRedirecting(false);
      }, 100);
      
      return { success: true };
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
  
  // Allow all team access
  const checkTeamAccess = async () => {
    return true;
  };
  
  // Allow all admin access
  const checkAdminAccess = async () => {
    return true;
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
