
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Mail, ArrowLeft } from 'lucide-react';

const TeamLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if already logged in
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (!error && data.session) {
        // Already logged in, redirect to team dashboard
        navigate('/team/dashboard');
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha e-mail e senha."
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Check if this is a team user
        const { data: teamAccount, error: teamError } = await supabase
          .from('team_accounts')
          .select('team_id')
          .eq('user_id', data.user.id)
          .single();
          
        if (teamError) {
          // Not a team account
          await supabase.auth.signOut();
          
          toast({
            variant: "destructive",
            title: "Acesso negado",
            description: "Esta conta não está associada a um time."
          });
          
          return;
        }
        
        // Login successful, redirect to team dashboard
        toast({
          title: "Login realizado",
          description: "Você foi conectado com sucesso."
        });
        
        navigate('/team/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = "Ocorreu um erro ao tentar entrar.";
      
      if (error.message.includes("Invalid login")) {
        errorMessage = "E-mail ou senha incorretos.";
      }
      
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <Button 
        variant="outline" 
        onClick={() => navigate('/')} 
        className="absolute top-4 left-4 flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Voltar ao site
      </Button>
      
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="flex flex-col items-center">
            <div className="bg-[#1a237e] text-white p-3 rounded-full mb-2">
              <Trophy size={32} />
            </div>
            <h1 className="text-2xl font-bold text-[#1a237e]">Acesso do Time</h1>
            <p className="text-gray-500 text-center mt-1">
              Portal exclusivo para times cadastrados.
            </p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Entrar</CardTitle>
            <CardDescription>
              Entre com as credenciais fornecidas pelo administrador do campeonato.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu-time@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#1a237e] text-white hover:bg-blue-800"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-gray-500 text-center">
              Caso não tenha acesso, entre em contato com o administrador do campeonato.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TeamLogin;
