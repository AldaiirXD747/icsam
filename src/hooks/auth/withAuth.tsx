
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const withAuth = (Component: React.ComponentType, requiredRole?: 'admin' | 'team') => {
  return (props: any) => {
    const { session, user, loading, checkAdminAccess, checkTeamAccess } = useAuth();
    const navigate = useNavigate();
    const [hasAccess, setHasAccess] = useState(false);
    const [checking, setChecking] = useState(true);
    
    useEffect(() => {
      const checkAccess = async () => {
        if (loading) return;
        
        if (!session && !user) {
          // Not authenticated - neither via Supabase nor custom auth
          console.log('Not authenticated, redirecting to login');
          navigate('/login');
          return;
        }
        
        if (requiredRole === 'admin') {
          const isAdmin = await checkAdminAccess();
          console.log('Admin access check result:', isAdmin);
          
          if (!isAdmin) {
            console.log('Not an admin, redirecting to home');
            navigate('/');
            return;
          }
          setHasAccess(true);
        } else if (requiredRole === 'team') {
          const hasTeamAccess = await checkTeamAccess();
          console.log('Team access check result:', hasTeamAccess);
          
          if (!hasTeamAccess) {
            console.log('No team access, redirecting to team login');
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
    }, [session, user, loading, navigate, checkAdminAccess, checkTeamAccess]);
    
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
