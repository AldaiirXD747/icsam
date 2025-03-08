
import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn } = useAuth();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Usar o método signIn do hook useAuth em vez da chamada direta
      const result = await signIn(formData.email, formData.password);
      
      if (result.success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Você será redirecionado para o painel administrativo."
        });
        
        // Redirecionar após um pequeno delay para garantir que a autenticação foi processada
        setTimeout(() => {
          navigate('/admin');
        }, 500);
      } else {
        setError(result.error || 'Credenciais inválidas. Tente novamente.');
      }
    } catch (error: any) {
      console.error('Erro de login:', error);
      setError(error.message || 'Ocorreu um erro durante o login. Tente novamente.');
    } finally {
      setLoading(false);
    }
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
            
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}
            
            {resetSuccess && (
              <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-6">
                Sua senha foi redefinida com sucesso. Por favor, faça login com sua nova senha.
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-primary"
                  placeholder="seu-email@exemplo.com"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-primary"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={20} className="text-gray-500" /> : <Eye size={20} className="text-gray-500" />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-primary"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                    Lembrar-me
                  </label>
                </div>
                
                <Link to="/reset" className="text-sm text-blue-primary hover:text-blue-light">
                  Esqueceu a senha?
                </Link>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full btn-primary py-3 flex items-center justify-center ${
                  loading ? 'opacity-70 cursor-wait' : ''
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Entrando...
                  </span>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
