
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

// Master admin email
const MASTER_ADMIN_EMAIL = 'contato@institutocriancasantamaria.com.br';

type AllowedRole = 'admin' | 'team' | 'team_manager' | string;

export const withAuth = (Component: React.ComponentType, requiredRole?: AllowedRole | AllowedRole[]) => {
  return (props: any) => {
    const { session, user, loading, checkAdminAccess } = useAuth();
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
        
        // Only allow access to master admin email
        const userEmail = user?.email || '';
        
        if (userEmail !== MASTER_ADMIN_EMAIL) {
          console.log('Not the master admin, redirecting to login');
          navigate('/login', { replace: true });
          setChecking(false);
          return;
        }
        
        // Support array of roles
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        
        if (roles.includes('admin')) {
          const isAdmin = await checkAdminAccess();
          console.log('Admin access check result:', isAdmin);
          
          if (!isAdmin) {
            console.log('Not an admin, redirecting to home');
            navigate('/', { replace: true });
            setChecking(false);
            return;
          }
          setHasAccess(true);
        } else if (roles.includes('team')) {
          // No more team access
          console.log('Team access is no longer available');
          navigate('/', { replace: true });
          setChecking(false);
          return;
        } else {
          // No specific role required, just need to be authenticated as master admin
          setHasAccess(true);
        }
        
        setChecking(false);
      };
      
      checkAccess();
    }, [session, user, loading, navigate, checkAdminAccess, checking, requiredRole]);
    
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
