
import React from 'react';
import { Trophy, Users, UserPlus, Heart, Flag, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProgramsSection = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-lime-primary/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block bg-lime-primary bg-opacity-20 px-4 py-1.5 rounded-full mb-2 shadow-sm">
            <span className="text-blue-primary font-medium text-sm">Nossos Programas</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-primary">Conheça Nossas Atividades</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Oferecemos diversos programas esportivos e educacionais para crianças e adolescentes,
            promovendo desenvolvimento integral através de atividades estruturadas.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          <ProgramCard 
            icon={<Trophy className="text-blue-primary h-7 w-7" />}
            title="Campeonatos"
            description="Organizamos campeonatos em diversas modalidades esportivas para crianças e adolescentes de diferentes faixas etárias."
            link="/championships"
            linkText="Ver Campeonatos"
            delay={0}
          />
          
          <ProgramCard 
            icon={<Users className="text-blue-primary h-7 w-7" />}
            title="Times"
            description="Conheça nossos times e categorias, com treinamentos regulares e participação em diversos campeonatos regionais."
            link="/teams"
            linkText="Conhecer Times"
            delay={0.1}
          />
          
          <ProgramCard 
            icon={<UserPlus className="text-blue-primary h-7 w-7" />}
            title="Desenvolvimento"
            description="Programa focado no desenvolvimento técnico e tático de atletas com potencial para seguir carreira no esporte."
            link="/desenvolvimento"
            linkText="Saiba Mais"
            delay={0.2}
          />
          
          <ProgramCard 
            icon={<Heart className="text-blue-primary h-7 w-7" />}
            title="Saúde e Bem-Estar"
            description="Atividades que promovem hábitos saudáveis, nutrição adequada e saúde mental para os participantes."
            link="/saude"
            linkText="Ver Atividades"
            delay={0.3}
          />
          
          <ProgramCard 
            icon={<Flag className="text-blue-primary h-7 w-7" />}
            title="Competições"
            description="Calendário de competições e eventos esportivos organizados pelo Instituto ao longo do ano."
            link="/matches"
            linkText="Ver Calendário"
            delay={0.4}
          />
          
          <ProgramCard 
            icon={<Zap className="text-blue-primary h-7 w-7" />}
            title="Estatísticas"
            description="Dados e estatísticas sobre o desempenho dos atletas, times e artilheiros nos campeonatos."
            link="/statistics"
            linkText="Ver Estatísticas"
            delay={0.5}
          />
        </motion.div>
      </div>
    </section>
  );
};

// Program Card Component
const ProgramCard = ({ 
  icon, 
  title, 
  description, 
  link, 
  linkText,
  delay 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  link: string; 
  linkText: string;
  delay: number;
}) => {
  const item = {
    hidden: { y: 30, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 50,
        delay 
      } 
    }
  };

  return (
    <motion.div 
      className="glass-card p-6 hover-card border border-gray-100"
      variants={item}
      whileHover={{ y: -10 }}
    >
      <div className="bg-blue-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-blue-primary mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">
        {description}
      </p>
      <Link to={link} className="text-blue-primary font-medium inline-flex items-center hover-link">
        {linkText} <i className="ml-1">→</i>
      </Link>
    </motion.div>
  );
};

export default ProgramsSection;
