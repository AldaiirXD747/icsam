
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ChampionshipDetails from '../components/ChampionshipDetails';
import Footer from '../components/Footer';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type ChampionshipType = {
  id: string;
  name: string;
  year: string;
  description: string;
  banner_image: string;
  start_date: string;
  end_date: string;
  location: string;
  categories: string[];
  organizer: string;
  sponsors: { name: string; logo: string }[];
  status: 'upcoming' | 'ongoing' | 'finished';
};

const Championship = () => {
  const { championshipId } = useParams<{ championshipId: string }>();
  const [championship, setChampionship] = useState<ChampionshipType | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchChampionship = async () => {
      try {
        setLoading(true);
        
        // Use a raw SQL query instead of the ORM
        const { data, error } = await supabase
          .rpc('get_championship_by_id', { championship_id: championshipId });
        
        if (error) {
          // If the RPC doesn't exist, fall back to direct SQL query
          const { data: directData, error: directError } = await supabase
            .from('championships')
            .select('*')
            .eq('id', championshipId)
            .single();
          
          if (directError) {
            throw directError;
          }
          
          if (directData) {
            // Parse JSONB fields if needed
            const processedData = {
              ...directData,
              categories: Array.isArray(directData.categories) 
                ? directData.categories 
                : typeof directData.categories === 'string' 
                  ? JSON.parse(directData.categories) 
                  : directData.categories || [],
              sponsors: Array.isArray(directData.sponsors) 
                ? directData.sponsors 
                : typeof directData.sponsors === 'string' 
                  ? JSON.parse(directData.sponsors) 
                  : directData.sponsors || []
            };
            
            setChampionship(processedData);
          } else {
            toast({
              variant: "destructive",
              title: "Campeonato não encontrado",
              description: "O campeonato solicitado não existe."
            });
            navigate('/');
          }
        } else if (data) {
          setChampionship(data);
        } else {
          toast({
            variant: "destructive",
            title: "Campeonato não encontrado",
            description: "O campeonato solicitado não existe."
          });
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching championship:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar campeonato",
          description: "Não foi possível carregar os dados do campeonato."
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (championshipId) {
      fetchChampionship();
    }
  }, [championshipId, navigate, toast]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-20 flex-grow flex items-center justify-center">
          <p className="text-gray-500">Carregando dados do campeonato...</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!championship) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-20 flex-grow flex items-center justify-center">
          <p className="text-gray-500">Campeonato não encontrado.</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 flex-grow">
        <ChampionshipDetails {...championship} />
      </div>
      <Footer />
    </div>
  );
};

export default Championship;
