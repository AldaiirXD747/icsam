
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
          <div className="glass-card p-6 flex items-center justify-center h-32 animate-fade-in-up">
            <img 
              src="https://institutocriancasantamaria.com.br/wp-content/uploads/2025/01/ASSINATURAS_ESPORTE__PRINCIPAL-scaled.jpg" 
              alt="Ministério do Esporte" 
              className="max-h-16 object-contain"
            />
          </div>
          
          <div className="glass-card p-6 flex items-center justify-center h-32 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-center">
              <h3 className="font-semibold text-blue-primary">Secretaria de Esporte e Lazer</h3>
              <p className="text-sm text-gray-500 mt-1">Governo do Distrito Federal</p>
            </div>
          </div>
          
          <div className="glass-card p-6 flex items-center justify-center h-32 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-center">
              <h3 className="font-semibold text-blue-primary">Administração Regional</h3>
              <p className="text-sm text-gray-500 mt-1">Santa Maria - DF</p>
            </div>
          </div>
          
          <div className="glass-card p-6 flex items-center justify-center h-32 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
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
