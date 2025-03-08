
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useTeamAuth = () => {
  const [loading, setLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkExistingSession();
  }, []);
  
  const checkExistingSession = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Check if it's a team account
        const teamId = session.user?.user_metadata?.team_id;
        
        if (teamId) {
          setHasSession(true);
          // Already logged in, redirect to dashboard
          navigate('/team/dashboard');
        } else {
          setHasSession(false);
        }
      } else {
        setHasSession(false);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setHasSession(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    // Redirect to team dashboard with a small delay
    setTimeout(() => {
      navigate('/team/dashboard');
    }, 500);
  };

  return {
    loading,
    hasSession,
    handleLoginSuccess
  };
};

export default useTeamAuth;
