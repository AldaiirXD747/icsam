
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import TeamLoginForm from '@/components/auth/TeamLoginForm';
import { useTeamAuth } from '@/hooks/auth/useTeamAuth';

const TeamLogin = () => {
  const { loading, handleLoginSuccess } = useTeamAuth();
  
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
            
            <TeamLoginForm onLoginSuccess={handleLoginSuccess} />
            
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
