
import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { validateResetToken } from '@/services/emailService';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [validToken, setValidToken] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Validate token from URL
    if (token) {
      const { valid, email } = validateResetToken(token);
      setValidToken(valid);
      if (valid && email) {
        setEmail(email);
      }
    } else {
      // Try to get email from session (Supabase way)
      const checkSession = async () => {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user?.email) {
          setEmail(data.session.user.email);
          setValidToken(true);
        }
      };
      checkSession();
    }
  }, [token]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "As senhas não coincidem",
        description: "Por favor, verifique se as senhas informadas são idênticas.",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Update password through Supabase auth
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      toast({
        title: "Senha atualizada com sucesso",
        description: "Sua senha foi alterada. Você será redirecionado para o login.",
      });
      
      // Redirect to login
      setTimeout(() => {
        navigate('/login?reset=true');
      }, 1500);
      
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar senha",
        description: error.message || "Ocorreu um erro ao tentar atualizar sua senha.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (!validToken) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 flex items-center justify-center py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto glass-card p-8 animate-fade-in-up">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-blue-primary mb-2">Link Inválido</h2>
                <p className="text-sm sm:text-base text-gray-600">
                  O link de redefinição de senha é inválido ou expirou.
                </p>
              </div>
              
              <div className="mt-6 text-center">
                <Link 
                  to="/reset" 
                  className="text-blue-primary hover:text-blue-700 flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} />
                  <span>Solicitar novo link</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
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
              <h2 className="text-3xl font-bold text-blue-primary mb-2">Nova Senha</h2>
              <p className="text-sm sm:text-base text-gray-600">
                {email && `Para: ${email}`}
              </p>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Digite sua nova senha
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Nova Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full btn-primary py-3 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Atualizando...
                  </span>
                ) : (
                  'Atualizar Senha'
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="text-blue-primary hover:text-blue-700 flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                <span>Voltar para o login</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
