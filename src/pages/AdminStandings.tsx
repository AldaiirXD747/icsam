
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import StandingsManagement from "@/components/admin/StandingsManagement";

const AdminStandings = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-center text-[#1a237e]">Gerenciamento de Classificação</h1>
        <div className="w-24"></div> {/* Espaçador para manter o título centralizado */}
      </div>

      <div className="mb-8">
        <StandingsManagement />
      </div>
    </div>
  );
};

export default AdminStandings;
