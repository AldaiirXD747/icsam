
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TeamLogin = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-[#1a237e]">Login de Time</h1>
              <p className="text-gray-500 mt-1">
                Acesso ao painel do time
              </p>
            </div>
            
            <Alert variant="destructive" className="my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Acesso Indisponível</AlertTitle>
              <AlertDescription>
                O sistema foi revertido para uso exclusivo do administrador principal. 
                O acesso para times não está mais disponível.
              </AlertDescription>
            </Alert>
            
            <div className="mt-6 text-center">
              <Link to="/">
                <Button className="w-full bg-[#1a237e] hover:bg-[#0d1357]">
                  Voltar à Página Inicial
                </Button>
              </Link>
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                Para mais informações, entre em contato com o administrador do sistema.
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
