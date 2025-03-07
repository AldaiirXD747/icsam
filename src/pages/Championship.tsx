
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { ChampionshipType } from '@/types/database';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  Calendar, MapPin, Trophy, Users, ClipboardList, 
  BarChart, ArrowLeft, Edit, Share, ChevronDown, ChevronUp
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import TeamCard from '@/components/TeamCard';
import MatchCard from '@/components/MatchCard';
import StandingsTable from '@/components/StandingsTable';

const mockChampionships: ChampionshipType[] = [
  {
    id: "1",
    name: "Campeonato Base Forte 2023",
    year: "2023",
    description: "Campeonato anual com todas as categorias de base, promovendo o desenvolvimento de jovens atletas e descobrindo novos talentos. Esta edição conta com times de todo o Distrito Federal e entorno, ampliando a competitividade e integração entre as equipes participantes.",
    banner_image: "https://example.com/banner1.jpg",
    start_date: "2023-03-15",
    end_date: "2023-11-20",
    location: "Campo do Instituto - Santa Maria, DF",
    categories: ["SUB-09", "SUB-11", "SUB-13", "SUB-15", "SUB-17"],
    organizer: "Instituto Criança Santa Maria",
    sponsors: [
      { name: "Patrocinador 1", logo: "https://example.com/logo1.png" },
      { name: "Patrocinador 2", logo: "https://example.com/logo2.png" }
    ],
    status: "finished"
  },
  {
    id: "2",
    name: "Campeonato Base Forte 2024",
    year: "2024",
    description: "Edição 2024 do tradicional campeonato que promove o esporte e a inclusão social através do futebol. Com partidas emocionantes e revelando grandes talentos, o campeonato já se tornou uma referência na região.",
    banner_image: "https://example.com/banner2.jpg",
    start_date: "2024-03-10",
    end_date: "2024-11-25",
    location: "Campo do Instituto - Santa Maria, DF",
    categories: ["SUB-09", "SUB-11", "SUB-13", "SUB-15", "SUB-17"],
    organizer: "Instituto Criança Santa Maria",
    sponsors: [
      { name: "Patrocinador 1", logo: "https://example.com/logo1.png" },
      { name: "Patrocinador 3", logo: "https://example.com/logo3.png" }
    ],
    status: "ongoing"
  },
  {
    id: "3",
    name: "Copa Revelação 2025",
    year: "2025",
    description: "Novo torneio focado em revelar talentos das categorias sub-13 e sub-15, com um formato inovador e dinâmico que proporciona mais tempo de jogo para todos os participantes.",
    banner_image: "https://example.com/banner3.jpg",
    start_date: "2025-01-15",
    end_date: "2025-06-30",
    location: "Estádio Municipal - Brasília, DF",
    categories: ["SUB-09", "SUB-13", "SUB-15"],
    organizer: "Instituto Criança Santa Maria",
    sponsors: [
      { name: "Patrocinador 2", logo: "https://example.com/logo2.png" },
      { name: "Patrocinador 4", logo: "https://example.com/logo4.png" }
    ],
    status: "upcoming"
  }
];

const Championship = () => {
  const { championshipId } = useParams<{ championshipId: string }>();
  const [championship, setChampionship] = useState<ChampionshipType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchChampionship = async () => {
      setLoading(true);
      try {
        const found = mockChampionships.find(c => c.id === championshipId);
        
        if (found) {
          setChampionship(found);
        } else {
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Campeonato não encontrado"
          });
          navigate('/championships');
        }
      } catch (error) {
        console.error('Error fetching championship:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os dados do campeonato"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChampionship();
  }, [championshipId, navigate, toast]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  const formatStatus = (status: 'upcoming' | 'ongoing' | 'finished') => {
    switch (status) {
      case 'upcoming': return { text: 'Próximo', color: 'bg-blue-100 text-blue-800' };
      case 'ongoing': return { text: 'Em andamento', color: 'bg-green-100 text-green-800' };
      case 'finished': return { text: 'Finalizado', color: 'bg-gray-100 text-gray-800' };
      default: return { text: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-20 flex-grow flex items-center justify-center">
          <p className="text-gray-500">Carregando detalhes do campeonato...</p>
        </div>
      </div>
    );
  }

  if (!championship) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="pt-20 flex-grow flex items-center justify-center">
          <div className="text-center">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Campeonato não encontrado</h2>
            <p className="text-gray-500 mb-6">O campeonato que você está procurando não existe ou foi removido.</p>
            <Button onClick={() => navigate('/championships')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para lista de campeonatos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = formatStatus(championship.status);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 flex-grow">
        <div className="relative">
          <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-300 relative">
            <img 
              src={championship.banner_image || '/placeholder.svg'} 
              alt={championship.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
          
          <div className="container mx-auto px-4">
            <div className="relative -mt-24 bg-white rounded-t-lg shadow-lg p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <div className="flex items-center mb-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                    <span className="ml-3 text-gray-500">{championship.year}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a237e]">{championship.name}</h1>
                </div>
                <div className="mt-4 md:mt-0 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate('/championships')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="mr-2 h-4 w-4" />
                    Compartilhar
                  </Button>
                  <Button size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-[#1a237e] mt-1" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Período</h3>
                    <p className="font-medium">{formatDate(championship.start_date)} - {formatDate(championship.end_date)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#1a237e] mt-1" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Local</h3>
                    <p className="font-medium">{championship.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Trophy className="h-5 w-5 text-[#1a237e] mt-1" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Organizador</h3>
                    <p className="font-medium">{championship.organizer}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="font-semibold text-xl mb-3">Descrição</h2>
                <div className="relative">
                  <p className={`text-gray-600 ${showFullDescription ? '' : 'line-clamp-3'}`}>
                    {championship.description}
                  </p>
                  {championship.description && championship.description.length > 150 && (
                    <button 
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-[#1a237e] font-medium flex items-center mt-2"
                    >
                      {showFullDescription ? (
                        <>
                          Mostrar menos <ChevronUp className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Mostrar mais <ChevronDown className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="font-semibold text-xl mb-3">Categorias</h2>
                <div className="flex flex-wrap gap-2">
                  {championship.categories.map((category, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 text-[#1a237e] px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              
              {championship.sponsors.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-semibold text-xl mb-3">Patrocinadores</h2>
                  <div className="flex flex-wrap gap-6 items-center">
                    {championship.sponsors.map((sponsor, index) => (
                      <div key={index} className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
                        {sponsor.logo ? (
                          <img 
                            src={sponsor.logo} 
                            alt={sponsor.name} 
                            className="h-8 mr-2" 
                          />
                        ) : null}
                        <span className="font-medium">{sponsor.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="overview" className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    <span className="hidden sm:inline">Visão Geral</span>
                  </TabsTrigger>
                  <TabsTrigger value="teams" className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:inline">Times</span>
                  </TabsTrigger>
                  <TabsTrigger value="matches" className="flex items-center gap-1">
                    <ClipboardList className="h-4 w-4" />
                    <span className="hidden sm:inline">Partidas</span>
                  </TabsTrigger>
                  <TabsTrigger value="standings" className="flex items-center gap-1">
                    <BarChart className="h-4 w-4" />
                    <span className="hidden sm:inline">Classificação</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="py-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-[#1a237e] mb-4">Sobre o Campeonato</h3>
                      <p className="text-gray-600 mb-4">{championship.description}</p>
                      <div className="space-y-2">
                        <p><strong>Início:</strong> {formatDate(championship.start_date)}</p>
                        <p><strong>Término:</strong> {formatDate(championship.end_date)}</p>
                        <p><strong>Local:</strong> {championship.location}</p>
                        <p><strong>Organizador:</strong> {championship.organizer}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#1a237e] mb-4">Próximos Jogos</h3>
                      <div className="space-y-4">
                        <p className="text-gray-500">Nenhum jogo programado no momento.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="teams" className="py-6">
                  <h3 className="text-xl font-semibold text-[#1a237e] mb-4">Times Participantes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
                      <Users className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                      Nenhum time cadastrado neste campeonato ainda.
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="matches" className="py-6">
                  <h3 className="text-xl font-semibold text-[#1a237e] mb-4">Partidas</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
                      <ClipboardList className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                      Nenhuma partida cadastrada neste campeonato ainda.
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="standings" className="py-6">
                  <h3 className="text-xl font-semibold text-[#1a237e] mb-4">Classificação</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
                      <BarChart className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                      Classificação não disponível neste momento.
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Championship;
