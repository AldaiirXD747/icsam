
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FileText, Download, FileBarChart, FilePieChart, Users, File, FileCheck, MapPin, Building } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface TransparencyDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  icon_type: string;
  published_date: string;
}

interface DocumentCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string;
}

const getIconComponent = (iconType: string) => {
  switch (iconType) {
    case 'building':
      return <Building size={24} />;
    case 'file-pie-chart':
      return <FilePieChart size={24} />;
    case 'file-bar-chart':
      return <FileBarChart size={24} />;
    case 'file-text':
      return <FileText size={24} />;
    case 'file':
      return <File size={24} />;
    case 'users':
      return <Users size={24} />;
    case 'file-check':
      return <FileCheck size={24} />;
    case 'map-pin':
      return <MapPin size={24} />;
    default:
      return <File size={24} />;
  }
};

const DocumentCard: React.FC<DocumentCardProps> = ({ title, description, icon, url }) => {
  return (
    <Card className="bg-white bg-opacity-70 backdrop-blur-md border border-white border-opacity-20 rounded-xl shadow-glass transition-all duration-300 h-full">
      <CardContent className="p-6 flex flex-col items-center text-center h-full">
        <div className="p-4 rounded-full bg-teal-600 text-white mb-4">
          {icon}
        </div>
        <h3 className="font-semibold text-lg text-blue-primary mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-primary inline-flex items-center text-sm"
        >
          Baixar Arquivo <Download size={14} className="ml-1" />
        </a>
      </CardContent>
    </Card>
  );
};

const DocumentSkeleton = () => (
  <div className="h-full">
    <Card className="bg-white bg-opacity-70 backdrop-blur-md border border-white border-opacity-20 rounded-xl shadow-glass h-full">
      <CardContent className="p-6 flex flex-col items-center text-center h-full">
        <Skeleton className="h-14 w-14 rounded-full mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-4 flex-grow" />
        <Skeleton className="h-9 w-32" />
      </CardContent>
    </Card>
  </div>
);

const Transparencia = () => {
  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['transparency-documents'],
    queryFn: async () => {
      // Dynamically cast the response to the correct type
      const { data, error } = await supabase
        .from('transparency_documents')
        .select('*')
        .order('published_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching transparency documents:', error);
        throw error;
      }
      
      return data as TransparencyDocument[];
    }
  });

  // Handle errors gracefully
  if (error) {
    console.error('Error in transparency query:', error);
  }

  // Fallback data if query fails
  const fallbackDocuments: TransparencyDocument[] = [
    {
      id: '1',
      title: 'DADOS DO INSTITUTO',
      description: 'CNPJ: 43.999.350/0001-16 | Data de Abertura: 14/10/2021',
      category: 'institutional',
      file_url: '#',
      icon_type: 'building',
      published_date: '2023-01-01'
    },
    {
      id: '2',
      title: 'PROJETOS APROVADOS',
      description: 'Lista completa de emendas parlamentares executadas pelo Instituto.',
      category: 'projects',
      file_url: '#',
      icon_type: 'file-pie-chart',
      published_date: '2023-01-02'
    },
    {
      id: '3',
      title: 'RELATÓRIO ANUAL DE GASTOS',
      description: 'Detalhamento da aplicação de recursos financeiros.',
      category: 'financial',
      file_url: '#',
      icon_type: 'file-bar-chart',
      published_date: '2023-01-03'
    },
    {
      id: '4',
      title: 'TERMO DE FOMENTO - MINISTÉRIO DO ESPORTE',
      description: 'Detalhamento do termo de fomento firmado com o Ministério de Esporte.',
      category: 'partnerships',
      file_url: '#',
      icon_type: 'file-text',
      published_date: '2023-01-04'
    },
    {
      id: '5',
      title: 'EDITAIS',
      description: 'Oportunidades para empresas participarem de projetos.',
      category: 'legal',
      file_url: '#',
      icon_type: 'file',
      published_date: '2023-01-05'
    },
    {
      id: '6',
      title: 'RELAÇÃO NOMINAL DIRIGENTES',
      description: 'Lista dos dirigentes do Instituto.',
      category: 'institutional',
      file_url: '#',
      icon_type: 'users',
      published_date: '2023-01-06'
    },
    {
      id: '7',
      title: 'TERMO DE FOMENTO - SECRETARIA DE ESPORTE E LAZER',
      description: 'Detalhamento do termo de fomento firmado com a Secretaria de Esporte e Lazer - GDF.',
      category: 'partnerships',
      file_url: '#',
      icon_type: 'file-text',
      published_date: '2023-01-07'
    },
    {
      id: '8',
      title: 'ATESTADO DE CAPACIDADE',
      description: 'Documento que comprova a capacidade técnica do Instituto.',
      category: 'legal',
      file_url: '#',
      icon_type: 'file-check',
      published_date: '2023-01-08'
    },
    {
      id: '9',
      title: 'ESTATUTO',
      description: 'Documento que define missão, visão e valores do Instituto.',
      category: 'legal',
      file_url: '#',
      icon_type: 'file',
      published_date: '2023-01-09'
    },
    {
      id: '10',
      title: 'REGISTRO DE LOCALIZAÇÃO',
      description: 'Áreas de atuação do Instituto com destaque para a QR 116.',
      category: 'institutional',
      file_url: '#',
      icon_type: 'map-pin',
      published_date: '2023-01-10'
    }
  ];

  // Use documents if available, otherwise use fallback data
  const displayDocuments = documents || fallbackDocuments;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-r from-blue-primary to-blue-light">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="inline-block bg-white text-blue-primary px-6 py-2 rounded-full mb-4">
                <span className="font-medium text-lg">PORTAL TRANSPARÊNCIA</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Transparência e Prestação de Contas</h1>
              <p className="text-white/80 max-w-2xl mx-auto">
                Acesso à informação e documentos oficiais do Instituto Criança Santa Maria (CNPJ: 43.999.350/0001-16)
              </p>
            </div>
          </div>
        </section>
        
        {/* Documents Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                // Show skeletons when loading
                Array(9).fill(0).map((_, index) => (
                  <DocumentSkeleton key={index} />
                ))
              ) : (
                // Show documents when loaded
                displayDocuments.map((doc) => (
                  <DocumentCard 
                    key={doc.id}
                    title={doc.title}
                    description={doc.description}
                    icon={getIconComponent(doc.icon_type)}
                    url={doc.file_url}
                  />
                ))
              )}
            </div>
          </div>
        </section>
        
        {/* Additional Info Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-blue-primary mb-8 text-center">Compromisso com a Transparência</h2>
              
              <div className="text-gray-700 space-y-4 mb-8">
                <p>
                  O Instituto Criança Santa Maria tem um compromisso inabalável com a transparência e a prestação de contas. Acreditamos que é nosso dever disponibilizar todas as informações relevantes sobre nossas atividades, projetos e uso de recursos para a sociedade.
                </p>
                <p>
                  Todos os documentos aqui disponibilizados são de acesso público e podem ser baixados livremente. Nossa gestão é comprometida com a ética, a responsabilidade social e o uso eficiente dos recursos que nos são confiados.
                </p>
                <p>
                  Para mais informações ou esclarecimentos sobre qualquer documento, entre em contato através dos nossos canais oficiais.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="font-bold text-blue-primary mb-2">Atualização</h4>
                  <p className="text-gray-600 text-sm">
                    Os documentos são atualizados regularmente conforme novas informações são disponibilizadas.
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="font-bold text-blue-primary mb-2">Acessibilidade</h4>
                  <p className="text-gray-600 text-sm">
                    Trabalhamos para garantir que todas as informações sejam facilmente acessíveis a qualquer cidadão.
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="font-bold text-blue-primary mb-2">Integridade</h4>
                  <p className="text-gray-600 text-sm">
                    Todas as informações divulgadas passam por rigoroso processo de verificação e validação.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Transparencia;
