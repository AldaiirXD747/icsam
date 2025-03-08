
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LoginForm from '@/components/auth/LoginForm';
import ResetSuccessMessage from '@/components/auth/ResetSuccessMessage';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const resetSuccess = searchParams.get('reset') === 'true';
  const { user } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Check if the user is already authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      // If the user is already logged in, redirect to admin panel
      if (user) {
        console.log('User already authenticated, redirecting to admin panel');
        setIsRedirecting(true);
        navigate('/admin');
      }
    };
    
    checkAuthStatus();
  }, [user, navigate]);

  // Show toast when reset=true parameter is present (after password reset)
  useEffect(() => {
    if (resetSuccess) {
      toast({
        title: "Senha redefinida com sucesso",
        description: "Você pode fazer login com sua nova senha agora.",
      });
    }
  }, [resetSuccess, toast]);

  const handleLoginSuccess = () => {
    console.log('Login successful, redirecting to admin panel');
    setIsRedirecting(true);
    // Force redirection to admin panel
    window.location.href = '/admin';
  };

  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-primary"></div>
        <p className="ml-3 text-blue-primary">Redirecionando para o painel administrativo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto glass-card p-8 animate-fade-in-up">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-blue-primary mb-2">Login</h2>
              <p className="text-sm sm:text-base text-gray-600">
                Entre para acessar o painel administrativo
              </p>
            </div>
            
            <ResetSuccessMessage show={resetSuccess} />
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
