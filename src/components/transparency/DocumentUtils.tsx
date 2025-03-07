
import React from 'react';
import { FileText, File, FileBarChart, FilePieChart, Users, FileCheck, MapPin, Building } from 'lucide-react';

export interface TransparencyDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  icon_type: string;
  published_date: string;
}

export const getIconComponent = (iconType: string) => {
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

// Lista de documentos de fallback em caso de erro de carregamento
export const fallbackDocuments: TransparencyDocument[] = [
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
