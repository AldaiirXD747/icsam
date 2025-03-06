
import React from 'react';
import { Trophy, Users, UserPlus, Heart, Flag, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProgramsSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-lime-primary bg-opacity-20 px-4 py-1.5 rounded-full mb-2">
            <span className="text-blue-primary font-medium text-sm">Nossos Programas</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-primary">Conheça Nossas Atividades</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Oferecemos diversos programas esportivos e educacionais para crianças e adolescentes,
            promovendo desenvolvimento integral através de atividades estruturadas.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 animate-fade-in-up">
            <div className="bg-blue-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Trophy className="text-blue-primary h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-blue-primary mb-2">Campeonatos</h3>
            <p className="text-gray-600 mb-4">
              Organizamos campeonatos em diversas modalidades esportivas para crianças e adolescentes de diferentes faixas etárias.
            </p>
            <Link to="/championships" className="text-blue-primary font-medium inline-flex items-center hover:underline">
              Ver Campeonatos <i className="ml-1">→</i>
            </Link>
          </div>
          
          <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-blue-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Users className="text-blue-primary h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-blue-primary mb-2">Times</h3>
            <p className="text-gray-600 mb-4">
              Conheça nossos times e categorias, com treinamentos regulares e participação em diversos campeonatos regionais.
            </p>
            <Link to="/teams" className="text-blue-primary font-medium inline-flex items-center hover:underline">
              Conhecer Times <i className="ml-1">→</i>
            </Link>
          </div>
          
          <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="bg-blue-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <UserPlus className="text-blue-primary h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-blue-primary mb-2">Desenvolvimento</h3>
            <p className="text-gray-600 mb-4">
              Programa focado no desenvolvimento técnico e tático de atletas com potencial para seguir carreira no esporte.
            </p>
            <Link to="/desenvolvimento" className="text-blue-primary font-medium inline-flex items-center hover:underline">
              Saiba Mais <i className="ml-1">→</i>
            </Link>
          </div>
          
          <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-blue-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Heart className="text-blue-primary h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-blue-primary mb-2">Saúde e Bem-Estar</h3>
            <p className="text-gray-600 mb-4">
              Atividades que promovem hábitos saudáveis, nutrição adequada e saúde mental para os participantes.
            </p>
            <Link to="/saude" className="text-blue-primary font-medium inline-flex items-center hover:underline">
              Ver Atividades <i className="ml-1">→</i>
            </Link>
          </div>
          
          <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="bg-blue-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Flag className="text-blue-primary h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-blue-primary mb-2">Competições</h3>
            <p className="text-gray-600 mb-4">
              Calendário de competições e eventos esportivos organizados pelo Instituto ao longo do ano.
            </p>
            <Link to="/matches" className="text-blue-primary font-medium inline-flex items-center hover:underline">
              Ver Calendário <i className="ml-1">→</i>
            </Link>
          </div>
          
          <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="bg-blue-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
              <Zap className="text-blue-primary h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold text-blue-primary mb-2">Estatísticas</h3>
            <p className="text-gray-600 mb-4">
              Dados e estatísticas sobre o desempenho dos atletas, times e artilheiros nos campeonatos.
            </p>
            <Link to="/statistics" className="text-blue-primary font-medium inline-flex items-center hover:underline">
              Ver Estatísticas <i className="ml-1">→</i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
