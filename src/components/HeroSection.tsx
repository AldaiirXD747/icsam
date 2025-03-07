
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  const statsContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.9,
      }
    }
  };

  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div 
            className="lg:w-1/2"
            initial="hidden"
            animate="show"
            variants={container}
          >
            <motion.div 
              variants={item}
              className="inline-block bg-lime-primary bg-opacity-20 px-4 py-1.5 rounded-full mb-6 shadow-sm"
            >
              <span className="text-blue-primary font-medium text-sm">Transformando vidas através do esporte</span>
            </motion.div>
            
            <motion.h1 
              variants={item}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              <span className="heading-gradient">Instituto Criança</span> <br />
              <span className="text-blue-primary">Santa Maria</span>
            </motion.h1>
            
            <motion.p 
              variants={item}
              className="text-gray-700 text-lg mb-8 max-w-xl"
            >
              Desde 2021, promovemos desenvolvimento humano, educação e inclusão social 
              por meio do esporte, transformando a vida de crianças e adolescentes.
            </motion.p>
            
            <motion.div 
              variants={item}
              className="flex flex-wrap gap-4"
            >
              <Link to="/championships" className="btn-primary flex items-center transform transition-transform duration-300 hover:scale-105">
                Campeonatos <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link to="/teams" className="btn-secondary flex items-center transform transition-transform duration-300 hover:scale-105">
                Times <ArrowRight size={18} className="ml-2" />
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2 flex justify-center relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="absolute -z-10 w-80 h-80 bg-blue-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute -z-10 -bottom-10 -right-10 w-60 h-60 bg-lime-primary/10 rounded-full blur-3xl"></div>
            
            <img 
              src="/lovable-uploads/66e24167-a33f-4db3-826c-ee360c64652d.png" 
              alt="Equipe do Instituto Criança Santa Maria com troféus" 
              className="w-full max-w-md rounded-2xl shadow-xl transform transition-transform duration-300 hover:scale-[1.02] relative z-10"
            />
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-20 md:mt-24 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
          variants={statsContainer}
          initial="hidden"
          animate="show"
        >
          <StatCard 
            number="3+" 
            title="Anos de Atuação" 
            description="Fundado em 2021, o Instituto já impactou centenas de crianças e adolescentes."
            delay={0.1}
          />
          
          <StatCard 
            number="500+" 
            title="Jovens Beneficiados" 
            description="Crianças e adolescentes que participam de nossas atividades e projetos."
            delay={0.2}
          />
          
          <StatCard 
            number="15+" 
            title="Projetos" 
            description="Diversos projetos esportivos e educacionais realizados com sucesso."
            delay={0.3}
          />
          
          <StatCard 
            number="4" 
            title="Categorias" 
            description="Atividades específicas para diferentes faixas etárias: SUB-11, SUB-13, SUB-15 e SUB-17."
            delay={0.4}
          />
        </motion.div>
      </div>
    </section>
  );
};

// StatCard component for statistics display
const StatCard = ({ number, title, description, delay }: { number: string; title: string; description: string; delay: number }) => {
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 100,
        delay 
      } 
    }
  };

  return (
    <motion.div 
      className="glass-card group p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-100"
      variants={item}
      whileHover={{ y: -5 }}
    >
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-primary to-blue-light flex items-center justify-center text-white mb-4 shadow-md group-hover:shadow-lg transition-transform duration-300 group-hover:scale-110">
        <span className="text-xl font-bold">{number}</span>
      </div>
      <h3 className="text-lg font-semibold text-blue-primary mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default HeroSection;
