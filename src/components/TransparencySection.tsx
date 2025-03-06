
import React from 'react';
import { FileText, Download, ExternalLink, FileBarChart, FilePieChart, Users, File, FileCheck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DocumentCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string;
}

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

const TransparencySection = () => {
  // Data for transparency documents based on the provided image
  const documents: DocumentCardProps[] = [
    {
      title: 'PROJETOS APROVADOS',
      description: 'Lista completa de emendas parlamentares executadas pelo Instituto.',
      icon: <FilePieChart size={24} />,
      url: '#'
    },
    {
      title: 'RELATÓRIO ANUAL DE GASTOS',
      description: 'Detalhamento da aplicação de recursos financeiros.',
      icon: <FileBarChart size={24} />,
      url: '#'
    },
    {
      title: 'TERMO DE FOMENTO - MINISTÉRIO DO ESPORTE',
      description: 'Detalhamento do termo de fomento firmado com o Ministério de Esporte.',
      icon: <FileText size={24} />,
      url: '#'
    },
    {
      title: 'EDITAIS',
      description: 'Oportunidades para empresas participarem de projetos.',
      icon: <File size={24} />,
      url: '#'
    },
    {
      title: 'RELAÇÃO NOMINAL DIRIGENTES',
      description: 'Lista dos dirigentes do Instituto.',
      icon: <Users size={24} />,
      url: '#'
    },
    {
      title: 'TERMO DE FOMENTO - SECRETARIA DE ESPORTE E LAZER',
      description: 'Detalhamento do termo de fomento firmado com a Secretaria de Esporte e Lazer - GDF.',
      icon: <FileText size={24} />,
      url: '#'
    },
    {
      title: 'ATESTADO DE CAPACIDADE',
      description: 'Documento que comprova a capacidade técnica do Instituto.',
      icon: <FileCheck size={24} />,
      url: '#'
    },
    {
      title: 'ESTATUTO',
      description: 'Documento que define missão, visão e valores do Instituto.',
      icon: <File size={24} />,
      url: '#'
    },
    {
      title: 'REGISTRO DE LOCALIZAÇÃO',
      description: 'Áreas de atuação do Instituto com destaque para a QR 116.',
      icon: <MapPin size={24} />,
      url: '#'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-teal-600 text-white px-6 py-2 rounded-full mb-4">
            <span className="font-medium text-lg">PORTAL TRANSPARÊNCIA</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-primary">
            Documentos e Relatórios
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Acesso a todos os documentos oficiais, prestação de contas e relatórios de atividades 
            do Instituto Criança Santa Maria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc, index) => (
            <DocumentCard 
              key={index}
              {...doc}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link 
            to="/transparencia" 
            className="inline-flex items-center font-medium text-blue-primary hover:text-blue-light"
          >
            Ver todos os documentos <ExternalLink size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TransparencySection;
