
import React from 'react';
import { Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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

export default DocumentCard;
