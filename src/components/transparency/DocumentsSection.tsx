
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import DocumentCard from './DocumentCard';
import DocumentSkeleton from './DocumentSkeleton';
import { TransparencyDocument, getIconComponent, fallbackDocuments } from './DocumentUtils';

const DocumentsSection = () => {
  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['transparency-documents'],
    queryFn: async () => {
      // Using type assertion to handle types correctly
      const { data, error } = await supabase
        .from('transparency_documents')
        .select('*')
        .order('published_date', { ascending: false }) as any;
      
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

  // Use documents if available, otherwise use fallback data
  const displayDocuments = documents || fallbackDocuments;

  return (
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
  );
};

export default DocumentsSection;
