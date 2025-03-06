
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Users, Save } from 'lucide-react';

type Team = {
  id: string;
  name: string;
  category: string;
  group_name: string;
  logo: string | null;
};

const TeamProfile = ({ teamId }: { teamId: string }) => {
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    logo: ''
  });
  const { toast } = useToast();
  
  useEffect(() => {
    fetchTeamProfile();
  }, [teamId]);
  
  const fetchTeamProfile = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();
        
      if (error) throw error;
      
      setTeam(data);
      setFormData({
        logo: data.logo || ''
      });
    } catch (error) {
      console.error('Error fetching team profile:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar perfil",
        description: "Não foi possível carregar os dados do time."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleUpdateLogo = async () => {
    if (!team) return;
    
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('teams')
        .update({ logo: formData.logo })
        .eq('id', team.id);
        
      if (error) throw error;
      
      // Update local state
      setTeam({
        ...team,
        logo: formData.logo
      });
      
      toast({
        title: "Perfil atualizado",
        description: "O logo do time foi atualizado com sucesso."
      });
    } catch (error) {
      console.error('Error updating team logo:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar perfil",
        description: "Não foi possível atualizar o logo do time."
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Carregando perfil do time...</p>
      </div>
    );
  }
  
  if (!team) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Time não encontrado.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1a237e]">Perfil do Time</h2>
        <p className="text-gray-500 mt-1">Visualize e edite informações do seu time</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-36 h-36 flex items-center justify-center bg-gray-100 rounded overflow-hidden border-2 border-dashed border-gray-300">
                {team.logo ? (
                  <img src={team.logo} alt={team.name} className="w-full h-full object-contain" />
                ) : (
                  <Users size={48} className="text-gray-400" />
                )}
              </div>
            </div>
            
            <div className="flex-grow space-y-4">
              <div>
                <h3 className="text-xl font-bold text-[#1a237e]">{team.name}</h3>
                <div className="mt-2 space-y-1">
                  <p><span className="font-semibold">Categoria:</span> {team.category}</p>
                  <p><span className="font-semibold">Grupo:</span> {team.group_name}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-semibold text-[#1a237e] mb-3">Atualizar Logo</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="logoUrl">URL do Logo</Label>
                    <Input 
                      id="logoUrl"
                      name="logo"
                      value={formData.logo}
                      onChange={handleInputChange}
                      placeholder="https://exemplo.com/logo.png"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Insira a URL de uma imagem para o logo do seu time
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleUpdateLogo} 
                      disabled={isSaving}
                      className="bg-[#1a237e] text-white hover:bg-blue-800 flex items-center gap-2"
                    >
                      <Save size={16} />
                      {isSaving ? 'Salvando...' : 'Salvar Logo'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamProfile;
