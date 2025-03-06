
import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DocumentCardProps {
  title: string;
  description: string;
  date: string;
  type: 'pdf' | 'doc' | 'xls';
  url: string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ title, description, date, type, url }) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'pdf':
        return <FileText className="text-red-500" />;
      case 'doc':
        return <FileText className="text-blue-500" />;
      case 'xls':
        return <FileText className="text-green-500" />;
      default:
        return <FileText />;
    }
  };

  return (
    <div className="glass-card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gray-100 rounded-lg">
          {getTypeIcon()}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-blue-primary mb-1">{title}</h3>
          <p className="text-gray-600 text-sm mb-3">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{date}</span>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center text-blue-primary hover:text-blue-light text-sm font-medium"
            >
              Baixar <Download size={14} className="ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const TransparencySection = () => {
  // Mock data for transparency documents
  const documents: DocumentCardProps[] = [
    {
      title: 'Relatório Anual de Atividades',
      description: 'Relatório completo das atividades realizadas em 2024',
      date: 'Janeiro 2025',
      type: 'pdf',
      url: '#'
    },
    {
      title: 'Prestação de Contas',
      description: 'Documento oficial de prestação de contas do ano fiscal',
      date: 'Dezembro 2024',
      type: 'xls',
      url: '#'
    },
    {
      title: 'Termo de Fomento',
      description: 'Acordo de cooperação com a Secretaria de Esportes',
      date: 'Março 2024',
      type: 'doc',
      url: '#'
    },
    {
      title: 'Estatuto Social',
      description: 'Estatuto atualizado do Instituto Criança Santa Maria',
      date: 'Outubro 2023',
      type: 'pdf',
      url: '#'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-lime-primary bg-opacity-20 px-4 py-1.5 rounded-full mb-2">
            <span className="text-blue-primary font-medium text-sm">Transparência</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-primary">
            Documentos e Relatórios
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Acesso a todos os documentos oficiais, prestação de contas e relatórios de atividades 
            do Instituto Criança Santa Maria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
