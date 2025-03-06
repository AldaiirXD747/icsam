
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 animate-fade-in-up">
            <div className="inline-block bg-lime-primary bg-opacity-20 px-4 py-1.5 rounded-full mb-6">
              <span className="text-blue-primary font-medium text-sm">Campeonato Base Forte – 2025</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="heading-gradient">Instituto Criança</span> <br />
              <span className="text-blue-primary">Santa Maria</span>
            </h1>
            <p className="text-gray-700 text-lg mb-8 max-w-xl">
              Transformando vidas através do esporte e educação. Conheça o campeonato Base Forte 2025, 
              nossa principal iniciativa esportiva para revelar talentos e promover a inclusão social.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/teams" className="btn-primary flex items-center">
                Ver Times <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link to="/matches" className="btn-secondary flex items-center">
                Calendário <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center animate-fade-in">
            <img 
              src="https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/WhatsApp-Image-2025-01-30-at-16.19.31.jpeg" 
              alt="Campeonato Base Forte 2025" 
              className="w-full max-w-md rounded-2xl shadow-xl transform transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
        
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <img 
              src="https://institutocriancasantamaria.com.br/wp-content/uploads/2025/01/ASSINATURAS_ESPORTE__PRINCIPAL-scaled.jpg" 
              alt="Ministério do Esporte" 
              className="h-16 object-contain mb-4"
            />
            <h3 className="text-lg font-semibold text-blue-primary mb-2">Patrocinador Oficial</h3>
            <p className="text-gray-600">Ministério do Esporte</p>
          </div>
          
          <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="h-16 flex items-center justify-center mb-4">
              <span className="text-blue-primary font-semibold">Secretaria de Esporte e Lazer</span>
            </div>
            <h3 className="text-lg font-semibold text-blue-primary mb-2">Patrocinador Oficial</h3>
            <p className="text-gray-600">Secretaria de Esporte e Lazer</p>
          </div>
          
          <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center h-16 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-primary text-white flex items-center justify-center mr-2">
                <span className="font-bold">11</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-primary text-white flex items-center justify-center mr-2">
                <span className="font-bold">13</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-primary text-white flex items-center justify-center">
                <span className="font-bold">15</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-blue-primary mb-2">Categorias</h3>
            <p className="text-gray-600">SUB-11, SUB-13, SUB-15, SUB-17</p>
          </div>
          
          <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="h-16 flex items-center mb-4">
              <div className="p-3 rounded-lg bg-blue-primary text-white">
                <span className="font-bold text-lg">9 Fev - 22 Mar</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-blue-primary mb-2">Duração</h3>
            <p className="text-gray-600">9 de Fevereiro até 22 de Março</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
