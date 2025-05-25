
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

type AllowedRole = 'admin' | 'team' | 'team_manager' | string;

export const withAuth = (Component: React.ComponentType, requiredRole?: AllowedRole | AllowedRole[]) => {
  return (props: any) => {
    const { session, user, loading } = useAuth();
    const navigate = useNavigate();
    const [hasAccess, setHasAccess] = useState(false);
    const [checking, setChecking] = useState(true);
    
    useEffect(() => {
      // Avoid multiple checkAccess calls
      if (!checking) return;
      
      const checkAccess = async () => {
        if (loading) return;
        
        console.log('withAuth: Checking access', { session, user, requiredRole });
        
        if (!session && !user) {
          // Not authenticated - neither via Supabase nor custom auth
          console.log('Not authenticated, redirecting to login');
          navigate('/login', { replace: true });
          setChecking(false);
          return;
        }
        
        // Allow access to anyone who is logged in
        setHasAccess(true);
        setChecking(false);
      };
      
      checkAccess();
    }, [session, user, loading, navigate, checking, requiredRole]);
    
    if (loading || checking) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-blue-500">Carregando...</p>
        </div>
      );
    }
    
    return hasAccess ? <Component {...props} /> : null;
  };
};

export default withAuth;
