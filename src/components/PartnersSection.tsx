
import React from 'react';
import { Award, Users, Building, ExternalLink, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PartnersSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-lime-primary bg-opacity-20 px-4 py-1.5 rounded-full mb-2">
            <span className="text-blue-primary font-medium text-sm">Nossos Parceiros</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-primary">Parceiros e Apoiadores</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Instituições e empresas que acreditam no nosso trabalho e apoiam nossa missão de transformar vidas através do esporte.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Government Partners */}
          <Card className="bg-white/70 backdrop-blur-sm border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-blue-50 p-3 rounded-full">
                  <Building className="h-6 w-6 text-blue-primary" />
                </div>
                <h3 className="text-xl font-semibold text-blue-primary">Órgãos Governamentais</h3>
                <p className="text-gray-600 text-sm">Apoio institucional de secretarias e órgãos públicos que fortalecem nossas iniciativas.</p>
              </div>
            </CardContent>
          </Card>

          {/* Educational Partners */}
          <Card className="bg-white/70 backdrop-blur-sm border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-lime-50 p-3 rounded-full">
                  <Award className="h-6 w-6 text-blue-primary" />
                </div>
                <h3 className="text-xl font-semibold text-blue-primary">Instituições Educacionais</h3>
                <p className="text-gray-600 text-sm">Parceiros educacionais que contribuem para o desenvolvimento integral dos nossos jovens.</p>
              </div>
            </CardContent>
          </Card>

          {/* Business Partners */}
          <Card className="bg-white/70 backdrop-blur-sm border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-blue-50 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-primary" />
                </div>
                <h3 className="text-xl font-semibold text-blue-primary">Empresas Apoiadoras</h3>
                <p className="text-gray-600 text-sm">Empresas de diversos segmentos que acreditam no poder transformador do esporte.</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <h3 className="text-2xl font-bold text-blue-primary text-center mb-8">Parceiros Oficiais</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {/* Secretaria de Educação Logo */}
          <div className="glass-card p-6 flex flex-col items-center justify-center h-40 group hover:-translate-y-1 transition-all duration-300">
            <img 
              src="/lovable-uploads/d9479deb-326b-4848-89fb-ef3e3f4c9601.png" 
              alt="Secretaria de Educação - GDF" 
              className="max-h-16 object-contain mb-3 group-hover:scale-105 transition-transform duration-300"
            />
            <p className="text-sm text-gray-600 text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Secretaria de Educação - GDF</p>
          </div>
          
          {/* Ministério do Esporte Logo */}
          <div className="glass-card p-6 flex flex-col items-center justify-center h-40 group hover:-translate-y-1 transition-all duration-300">
            <img 
              src="/lovable-uploads/0b71f7dd-5e7e-46d7-a9c6-7c4d93e26e31.png" 
              alt="Ministério do Esporte - Governo Federal" 
              className="max-h-16 object-contain mb-3 group-hover:scale-105 transition-transform duration-300"
            />
            <p className="text-sm text-gray-600 text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Ministério do Esporte</p>
          </div>
          
          {/* Administração Regional */}
          <div className="glass-card p-6 flex flex-col items-center justify-center h-40 group hover:-translate-y-1 transition-all duration-300">
            <div className="p-3 rounded-full bg-blue-50 mb-3">
              <Building className="h-8 w-8 text-blue-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="font-semibold text-blue-primary text-center">Administração Regional</h3>
            <p className="text-sm text-gray-500 mt-1 text-center">Santa Maria - DF</p>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Button 
            variant="default" 
            className="bg-lime-primary text-blue-primary hover:bg-lime-dark font-semibold px-6 py-6 h-auto rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            Torne-se um Apoiador
            <ArrowRight size={18} className="ml-2" />
          </Button>
          <p className="text-gray-500 text-sm mt-4">
            Junte-se a nós e faça parte desta transformação social através do esporte.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
