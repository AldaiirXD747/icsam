
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LoginForm from '@/components/auth/LoginForm';
import ResetSuccessMessage from '@/components/auth/ResetSuccessMessage';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const resetSuccess = searchParams.get('reset') === 'true';

  // Verificar se o usuário já está autenticado
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Se já estiver autenticado, redirecionar para o painel admin
        navigate('/admin');
      }
    };
    
    checkSession();
  }, [navigate]);

  // Mostrar toast quando o parâmetro reset=true estiver presente (após redefinição de senha)
  useEffect(() => {
    if (resetSuccess) {
      toast({
        title: "Senha redefinida com sucesso",
        description: "Você pode fazer login com sua nova senha agora.",
      });
    }
  }, [resetSuccess, toast]);

  const handleLoginSuccess = () => {
    // Redirecionar após um pequeno delay para garantir que a autenticação foi processada
    setTimeout(() => {
      navigate('/admin');
    }, 500);
  };

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
