
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Users, Trophy, BarChart3, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#0f1c4d] text-white p-4 hidden md:block">
        <h2 className="text-xl font-bold mb-6">Admin</h2>
        <nav className="space-y-2">
          <Link to="/admin" className="block py-2 px-4 rounded hover:bg-blue-800 transition-colors">
            <div className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </div>
          </Link>
          <Link to="/admin/teams" className="block py-2 px-4 rounded hover:bg-blue-800 transition-colors">
            <div className="flex items-center">
              <Trophy className="mr-2 h-4 w-4" />
              Times
            </div>
          </Link>
          <Link to="/admin/players" className="block py-2 px-4 rounded hover:bg-blue-800 transition-colors">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Jogadores
            </div>
          </Link>
          <Link to="/admin/batch-player-registration" className="block py-2 px-4 rounded hover:bg-blue-800 transition-colors">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Cadastro em Lote
            </div>
          </Link>
          <Link to="/admin/matches" className="block py-2 px-4 rounded hover:bg-blue-800 transition-colors">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Partidas
            </div>
          </Link>
          <Link to="/admin/add-match-data" className="block py-2 px-4 rounded hover:bg-blue-800 transition-colors">
            <div className="flex items-center">
              <Database className="mr-2 h-4 w-4" />
              Resultados em Lote
            </div>
          </Link>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1">
        <div className="bg-[#1a237e] text-white p-4 shadow-md">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold">Painel de Administração</h1>
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="text-white hover:bg-blue-800">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Dashboard
              </Button>
            </Link>
          </div>
        </div>
        <main className="container mx-auto py-6 px-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
