import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ChampionshipDetails from '../components/ChampionshipDetails';
import Footer from '../components/Footer';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { ChampionshipType } from '@/types/database';

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
        
        if (!championshipId) {
          throw new Error("Championship ID is required");
        }
        
        const { data, error } = await supabase
          .from('championships')
          .select('*')
          .eq('id', championshipId)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const processedChampionship: ChampionshipType = {
            id: data.id,
            name: data.name,
            year: data.year,
            description: data.description || "",
            banner_image: data.banner_image || "",
            start_date: data.start_date,
            end_date: data.end_date,
            location: data.location,
            categories: Array.isArray(data.categories) 
              ? data.categories 
              : typeof data.categories === 'string' 
                ? JSON.parse(data.categories) 
                : data.categories || [],
            organizer: data.organizer || "",
            sponsors: Array.isArray(data.sponsors) 
              ? data.sponsors 
              : typeof data.sponsors === 'string' 
                ? JSON.parse(data.sponsors) 
                : data.sponsors || [],
            status: data.status as 'upcoming' | 'ongoing' | 'finished'
          };
          
          setChampionship(processedChampionship);
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
        {championship && <ChampionshipDetails {...championship} />}
      </div>
      <Footer />
    </div>
  );
};

export default Championship;
