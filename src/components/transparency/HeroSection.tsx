
import React from 'react';

const HeroSection = () => {
  return (
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
  );
};

export default HeroSection;
