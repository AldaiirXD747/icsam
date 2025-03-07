
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TransparencyDocument } from '@/types';

interface TemplateProps {
  onSelectTemplate: (template: Partial<TransparencyDocument>) => void;
}

const TransparencyTemplates: React.FC<TemplateProps> = ({ onSelectTemplate }) => {
  const templates = [
    {
      title: 'DADOS DO INSTITUTO',
      description: 'CNPJ: 43.999.350/0001-16 | Data de Abertura: 14/10/2021',
      category: 'institutional',
      icon_type: 'building',
    },
    {
      title: 'PROJETOS APROVADOS',
      description: 'Lista completa de emendas parlamentares executadas pelo Instituto.',
      category: 'projects',
      icon_type: 'file-pie-chart',
    },
    {
      title: 'RELATÓRIO ANUAL DE GASTOS',
      description: 'Detalhamento da aplicação de recursos financeiros.',
      category: 'financial',
      icon_type: 'file-bar-chart',
    },
    {
      title: 'TERMO DE FOMENTO',
      description: 'Detalhamento do termo de fomento firmado com órgão governamental.',
      category: 'partnerships',
      icon_type: 'file-text',
    },
    {
      title: 'EDITAIS',
      description: 'Oportunidades para empresas participarem de projetos.',
      category: 'legal',
      icon_type: 'file',
    },
    {
      title: 'RELAÇÃO NOMINAL DIRIGENTES',
      description: 'Lista dos dirigentes do Instituto.',
      category: 'institutional',
      icon_type: 'users',
    },
    {
      title: 'ESTATUTO',
      description: 'Documento que define missão, visão e valores do Instituto.',
      category: 'legal',
      icon_type: 'file',
    },
    {
      title: 'ATESTADO DE CAPACIDADE',
      description: 'Documento que comprova a capacidade técnica do Instituto.',
      category: 'legal',
      icon_type: 'file-check',
    }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Modelos de Documentos</CardTitle>
          <CardDescription>
            Selecione um modelo para preencher o formulário automaticamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {templates.map((template, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-left h-auto py-3 px-4"
                onClick={() => onSelectTemplate({
                  ...template,
                  file_url: '',
                  published_date: new Date().toISOString().split('T')[0]
                })}
              >
                <div>
                  <div className="font-semibold">{template.title}</div>
                  <div className="text-xs text-gray-500 mt-1 line-clamp-2">{template.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransparencyTemplates;
