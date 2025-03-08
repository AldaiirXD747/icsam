
import { useState } from 'react';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { sendEmail, generateResetToken } from '@/services/emailService';

const Reset = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        variant: "destructive",
        title: "Email obrigatório",
        description: "Por favor, informe seu email para redefinir a senha.",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Use Supabase's password reset functionality
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
      
      // Generate our own reset token and send custom email
      const resetToken = generateResetToken(email);
      
      // Send our own custom password reset email
      try {
        await sendEmail({
          to: email,
          subject: "Redefinição de senha - Copa Sesc",
          type: "reset_password",
          resetToken: resetToken
        });
      } catch (emailError) {
        console.error('Error sending custom reset email:', emailError);
        // Continue even if our email fails, as Supabase should have sent one
      }
      
      // Show success message
      setSuccess(true);
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar email",
        description: error.message || "Ocorreu um erro ao tentar enviar o email de redefinição de senha.",
      });
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
              <h2 className="text-3xl font-bold text-blue-primary mb-2">Redefinir Senha</h2>
              <p className="text-sm sm:text-base text-gray-600">
                {!success 
                  ? "Informe seu email para receber as instruções de redefinição de senha" 
                  : "Verifique seu email para instruções de redefinição de senha"}
              </p>
            </div>
            
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail size={16} className="text-gray-400" />
                    </div>
                    <Input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="seu-email@exemplo.com"
                      required
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
                      Enviando...
                    </span>
                  ) : (
                    'Enviar instruções'
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center">
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">
                  <p>Um email de redefinição de senha foi enviado para:</p>
                  <p className="font-semibold mt-1">{email}</p>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Verifique sua caixa de entrada e pasta de spam para encontrar as instruções.
                </p>
              </div>
            )}
            
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

export default Reset;
