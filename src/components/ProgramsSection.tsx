
import React from 'react';
import { Trophy, Users, Flag, Zap, ArrowRight } from 'lucide-react';
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
    hidden: { y: 40, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gray-50 z-0"></div>
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white to-gray-50 z-0"></div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-gray-50 z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="shape-blob w-[500px] h-[500px] bg-blue-primary/5 top-0 right-0"></div>
        <div className="shape-blob w-[400px] h-[400px] bg-lime-primary/5 bottom-0 left-0 animation-delay-2000"></div>
        <div className="absolute left-1/2 top-1/4 w-10 h-10 rounded-full bg-lime-primary/40 blur-sm"></div>
        <div className="absolute left-1/4 bottom-1/3 w-6 h-6 rounded-full bg-blue-primary/30 blur-sm"></div>
        <div className="absolute right-1/3 bottom-1/4 w-8 h-8 rounded-full bg-blue-light/20 blur-sm"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block bg-gradient-to-r from-lime-primary/20 to-lime-primary/10 px-5 py-2 rounded-full mb-4">
            <span className="text-blue-primary font-semibold text-sm">Nossos Programas</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-blue-primary">Conheça Nossas Atividades</h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Oferecemos diversos programas esportivos e educacionais para crianças e adolescentes,
            promovendo desenvolvimento integral através de atividades estruturadas.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          <ProgramCard 
            icon={<Trophy className="text-white h-7 w-7" />}
            iconBg="bg-gradient-to-br from-blue-primary to-blue-light"
            title="Campeonatos"
            description="Organizamos campeonatos em diversas modalidades esportivas para crianças e adolescentes de diferentes faixas etárias."
            link="/championships"
            linkText="Ver Campeonatos"
            delay={0}
          />
          
          <ProgramCard 
            icon={<Users className="text-white h-7 w-7" />}
            iconBg="bg-gradient-to-br from-lime-primary to-lime-dark"
            title="Times"
            description="Conheça nossos times e categorias, com treinamentos regulares e participação em diversos campeonatos regionais."
            link="/teams"
            linkText="Conhecer Times"
            delay={0.1}
          />
          
          <ProgramCard 
            icon={<Flag className="text-white h-7 w-7" />}
            iconBg="bg-gradient-to-br from-blue-primary to-indigo-700"
            title="Competições"
            description="Calendário de competições e eventos esportivos organizados pelo Instituto ao longo do ano."
            link="/matches"
            linkText="Ver Calendário"
            delay={0.2}
          />
          
          <ProgramCard 
            icon={<Zap className="text-white h-7 w-7" />}
            iconBg="bg-gradient-to-br from-amber-500 to-orange-600"
            title="Estatísticas"
            description="Dados e estatísticas sobre o desempenho dos atletas, times e artilheiros nos campeonatos."
            link="/statistics"
            linkText="Ver Estatísticas"
            delay={0.3}
          />
        </motion.div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link to="/sobre" className="btn-outline inline-flex group">
            <span>Conheça Nossa História</span>
            <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// Program Card Component
const ProgramCard = ({ 
  icon, 
  iconBg,
  title, 
  description, 
  link, 
  linkText,
  delay 
}: { 
  icon: React.ReactNode; 
  iconBg: string;
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
      className="gradient-card group hover:translate-y-[-8px] p-6 md:p-8"
      variants={item}
    >
      <div className={`${iconBg} p-4 rounded-xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center mb-5 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
        {icon}
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-blue-primary mb-3">{title}</h3>
      <p className="text-gray-600 mb-5 leading-relaxed min-h-[80px] md:min-h-[100px]">
        {description}
      </p>
      <Link to={link} className="text-blue-primary font-semibold inline-flex items-center group relative overflow-hidden">
        <span className="relative z-10">{linkText}</span>
        <span className="relative z-10 ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-primary transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
      </Link>
    </motion.div>
  );
};

export default ProgramsSection;
