
import React from 'react';

const PartnersSection = () => {
  return (
    <section className="py-16 bg-white">
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
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* GDF Logo Box */}
          <div className="glass-card p-6 flex items-center justify-center h-32 animate-fade-in-up">
            <img 
              src="/lovable-uploads/f5090a5c-026d-4986-add2-b226f94961ed.png" 
              alt="Secretaria de Esporte - GDF" 
              className="max-h-16 object-contain"
            />
          </div>
          
          {/* Secretaria de Educação Logo Box */}
          <div className="glass-card p-6 flex items-center justify-center h-32 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <img 
              src="/lovable-uploads/d9479deb-326b-4848-89fb-ef3e3f4c9601.png" 
              alt="Secretaria de Educação - GDF" 
              className="max-h-16 object-contain"
            />
          </div>
          
          {/* Secretaria de Esporte e Lazer Box */}
          <div className="glass-card p-6 flex items-center justify-center h-32 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-center">
              <h3 className="font-semibold text-blue-primary">Secretaria de Esporte e Lazer</h3>
              <p className="text-sm text-gray-500 mt-1">Governo do Distrito Federal</p>
            </div>
          </div>
          
          {/* Administração Regional Box */}
          <div className="glass-card p-6 flex items-center justify-center h-32 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <h3 className="font-semibold text-blue-primary">Administração Regional</h3>
              <p className="text-sm text-gray-500 mt-1">Santa Maria - DF</p>
            </div>
          </div>
          
          {/* Ministério do Esporte Box */}
          <div className="glass-card p-6 flex items-center justify-center h-32 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <h3 className="font-semibold text-blue-primary">Ministério do Esporte</h3>
              <p className="text-sm text-gray-500 mt-1">Governo Federal</p>
            </div>
          </div>
          
          {/* Empresas Apoiadoras Box */}
          <div className="glass-card p-6 flex items-center justify-center h-32 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="text-center">
              <h3 className="font-semibold text-blue-primary">Empresas Apoiadoras</h3>
              <p className="text-sm text-gray-500 mt-1">Diversos Segmentos</p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <a href="/contato" className="btn-secondary inline-flex items-center">
            Torne-se um Apoiador
          </a>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
