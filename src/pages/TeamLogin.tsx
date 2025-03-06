
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Lock, LogIn } from 'lucide-react';

const TeamLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  useEffect(() => {
    checkExistingSession();
  }, []);
  
  const checkExistingSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Check if it's a team account
        const teamId = session.user?.user_metadata?.team_id;
        
        if (teamId) {
          // Already logged in, redirect to dashboard
          navigate('/team/dashboard');
        }
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha o e-mail e a senha."
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Sign in with email/password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Check if it's a team account
        const teamId = data.user.user_metadata?.team_id;
        
        if (!teamId) {
          // Not a team account
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Acesso negado",
            description: "Esta conta não está associada a nenhum time."
          });
          return;
        }
        
        toast({
          title: "Login bem-sucedido",
          description: "Você será redirecionado para o painel do time."
        });
        
        // Redirect to team dashboard
        navigate('/team/dashboard');
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      
      let errorMessage = "Ocorreu um erro ao tentar fazer login.";
      
      if (error.message === "Invalid login credentials") {
        errorMessage = "E-mail ou senha incorretos.";
      }
      
      toast({
        variant: "destructive",
        title: "Erro de login",
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-[#1a237e]">Login de Time</h1>
              <p className="text-gray-500 mt-1">
                Acesse o painel exclusivo do seu time
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="time@exemplo.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#1a237e] text-white hover:bg-blue-800 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>Entrando...</>
                ) : (
                  <>
                    <LogIn size={16} />
                    Entrar
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                As credenciais são fornecidas pelo administrador do campeonato.
              </p>
              <p className="mt-1">
                Se você é um administrador, acesse o{' '}
                <a href="/admin" className="text-[#1a237e] hover:underline">
                  Painel Administrativo
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default TeamLogin;
