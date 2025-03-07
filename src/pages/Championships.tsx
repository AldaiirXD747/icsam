
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Trophy, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Championship {
  id: string;
  name: string;
  year: string;
  description: string;
  location: string;
  banner_image: string | null;
  start_date: string;
  end_date: string;
  status: string;
  categories: string[];
}

const Championships = () => {
  const [championships, setChampionships] = useState<Championship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChampionships = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('championships')
          .select('*')
          .order('year', { ascending: false });
        
        if (error) throw error;
        
        setChampionships(data || []);
      } catch (err) {
        console.error('Erro ao carregar campeonatos:', err);
        setError('Não foi possível carregar os campeonatos. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchChampionships();
  }, []);

  // Function to get the appropriate status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
      case 'próximo':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
      case 'em andamento':
        return 'bg-green-100 text-green-800';
      case 'completed':
      case 'concluído':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'Próximo';
      case 'ongoing':
        return 'Em Andamento';
      case 'completed':
        return 'Concluído';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-primary mb-4">Nossos Campeonatos</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Conheça os campeonatos organizados pela Base Forte. Clique em cada campeonato para ver mais detalhes, times participantes e tabelas.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">{error}</p>
            </div>
          ) : championships.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Nenhum campeonato cadastrado</h3>
              <p className="text-gray-500">
                Novos campeonatos serão exibidos aqui quando forem cadastrados pelo Painel Administrativo.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {championships.map((championship) => (
                <Card key={championship.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {championship.banner_image && (
                    <div className="w-full h-48 overflow-hidden">
                      <img 
                        src={championship.banner_image} 
                        alt={championship.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-blue-primary">{championship.name}</CardTitle>
                        <CardDescription>{championship.year}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(championship.status)}>
                        {getStatusText(championship.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {championship.description && (
                      <p className="text-gray-600 line-clamp-2">{championship.description}</p>
                    )}
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{championship.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {new Date(championship.start_date).toLocaleDateString('pt-BR')} a {new Date(championship.end_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {championship.categories && championship.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {Array.isArray(championship.categories) ? championship.categories.map((category, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50">
                            {category}
                          </Badge>
                        )) : (
                          <Badge variant="outline" className="bg-gray-50">
                            {championship.categories.toString()}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link to={`/campeonatos/${championship.id}`}>Ver Detalhes</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Championships;
