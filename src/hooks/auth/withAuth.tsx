
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const withAuth = (Component: React.ComponentType, requiredRole?: 'admin' | 'team') => {
  return (props: any) => {
    const { session, loading, checkAdminAccess, checkTeamAccess } = useAuth();
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

export default withAuth;
