
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 animate-fade-in-up">
            <div className="inline-block bg-lime-primary bg-opacity-20 px-4 py-1.5 rounded-full mb-6">
              <span className="text-blue-primary font-medium text-sm">Transformando vidas através do esporte</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="heading-gradient">Instituto Criança</span> <br />
              <span className="text-blue-primary">Santa Maria</span>
            </h1>
            <p className="text-gray-700 text-lg mb-8 max-w-xl">
              Desde 2021, promovemos desenvolvimento humano, educação e inclusão social 
              por meio do esporte, transformando a vida de crianças e adolescentes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/championships" className="btn-primary flex items-center">
                Campeonatos <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link to="/teams" className="btn-secondary flex items-center">
                Times <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center animate-fade-in">
            <img 
              src="/lovable-uploads/66e24167-a33f-4db3-826c-ee360c64652d.png" 
              alt="Equipe do Instituto Criança Santa Maria com troféus" 
              className="w-full max-w-md rounded-2xl shadow-xl transform transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
        
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-16 h-16 rounded-full bg-blue-primary flex items-center justify-center text-white mb-4">
              <span className="text-xl font-bold">3+</span>
            </div>
            <h3 className="text-lg font-semibold text-blue-primary mb-2">Anos de Atuação</h3>
            <p className="text-gray-600">Fundado em 2021, o Instituto já impactou centenas de crianças e adolescentes.</p>
          </div>
          
          <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="w-16 h-16 rounded-full bg-blue-primary flex items-center justify-center text-white mb-4">
              <span className="text-xl font-bold">500+</span>
            </div>
            <h3 className="text-lg font-semibold text-blue-primary mb-2">Jovens Beneficiados</h3>
            <p className="text-gray-600">Crianças e adolescentes que participam de nossas atividades e projetos.</p>
          </div>
          
          <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="w-16 h-16 rounded-full bg-blue-primary flex items-center justify-center text-white mb-4">
              <span className="text-xl font-bold">15+</span>
            </div>
            <h3 className="text-lg font-semibold text-blue-primary mb-2">Projetos</h3>
            <p className="text-gray-600">Diversos projetos esportivos e educacionais realizados com sucesso.</p>
          </div>
          
          <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="w-16 h-16 rounded-full bg-blue-primary flex items-center justify-center text-white mb-4">
              <span className="text-xl font-bold">4</span>
            </div>
            <h3 className="text-lg font-semibold text-blue-primary mb-2">Categorias</h3>
            <p className="text-gray-600">Atividades específicas para diferentes faixas etárias: SUB-11, SUB-13, SUB-15 e SUB-17.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
