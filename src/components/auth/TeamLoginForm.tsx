
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Lock, LogIn } from 'lucide-react';

interface FormData {
  email: string;
  password: string;
}

interface TeamLoginFormProps {
  onLoginSuccess: () => void;
}

const TeamLoginForm: React.FC<TeamLoginFormProps> = ({ onLoginSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  
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
        
        // Notify parent component of successful login
        onLoginSuccess();
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
  );
};

export default TeamLoginForm;
