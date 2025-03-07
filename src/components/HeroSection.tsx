
import { ArrowRight, Award, Calendar, Check, Download, Star, Users } from 'lucide-react';
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
    <section className="pt-32 pb-24 md:pt-40 md:pb-28 relative overflow-hidden bg-white">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-lime-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="shape-blob w-96 h-96 bg-blue-primary/5 top-40 left-[20%] animate-blob"></div>
        <div className="shape-blob w-80 h-80 bg-lime-primary/5 bottom-20 right-[10%] animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div 
            className="lg:w-1/2"
            initial="hidden"
            animate="show"
            variants={container}
          >
            <motion.div 
              variants={item}
              className="inline-block bg-gradient-to-r from-lime-primary/20 to-lime-primary/10 px-5 py-2 rounded-full mb-8"
            >
              <span className="text-blue-primary font-semibold text-sm flex items-center">
                <Check size={16} className="mr-2 text-lime-dark" />
                Transformando vidas através do esporte
              </span>
            </motion.div>
            
            <motion.h1 
              variants={item}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight"
            >
              <span className="text-blue-primary">Instituto</span> <br />
              <span className="gradient-text font-extrabold">Criança Santa Maria</span>
            </motion.h1>
            
            <motion.p 
              variants={item}
              className="text-gray-700 text-xl leading-relaxed mb-10 max-w-xl"
            >
              Desde 2021, promovemos desenvolvimento humano, educação e inclusão social 
              por meio do esporte, transformando a vida de crianças e adolescentes.
            </motion.p>
            
            <motion.div 
              variants={item}
              className="flex flex-wrap gap-5"
            >
              <Link to="/championships" className="btn-primary transform transition-transform duration-300 hover:scale-105">
                Campeonatos 
                <ArrowRight size={20} />
              </Link>
              <Link to="/teams" className="btn-secondary transform transition-transform duration-300 hover:scale-105">
                Times 
                <ArrowRight size={20} />
              </Link>
            </motion.div>
            
            <motion.div 
              variants={item}
              className="mt-10 flex items-center gap-3"
            >
              <a 
                href="https://drive.google.com/uc?export=download&id=1eaqEZwGixjWOsd-fd81lnu0j9EEiEqR0" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 text-blue-primary hover:text-blue-light transition-colors font-medium"
              >
                <Download size={20} /> 
                Faça o download do nosso estatuto
              </a>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2 flex justify-center relative"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="absolute -z-10 w-[400px] h-[400px] bg-gradient-to-br from-blue-primary/15 to-blue-light/10 rounded-full blur-3xl"></div>
            <div className="absolute -z-10 -bottom-10 -right-10 w-60 h-60 bg-lime-primary/15 rounded-full blur-3xl"></div>
            
            {/* Hero Image with decorative elements */}
            <div className="relative max-w-lg">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-lime-primary rounded-lg rotate-12 z-0 opacity-30 blur-sm"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-primary rounded-full z-0 opacity-20 blur-sm"></div>
              
              <img 
                src="/lovable-uploads/66e24167-a33f-4db3-826c-ee360c64652d.png" 
                alt="Equipe do Instituto Criança Santa Maria com troféus" 
                className="rounded-2xl shadow-2xl transform transition-transform duration-500 hover:scale-[1.02] relative z-10 w-full max-w-lg border-8 border-white"
              />
              
              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="absolute -top-10 -right-10 bg-white p-4 rounded-xl shadow-xl z-20 flex items-center gap-3"
              >
                <div className="bg-blue-primary/10 p-2 rounded-lg">
                  <Trophy className="text-blue-primary" />
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Campeonatos</span>
                  <p className="text-blue-primary font-bold text-lg">3+</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                className="absolute -bottom-10 -left-6 bg-white p-4 rounded-xl shadow-xl z-20 flex items-center gap-3"
              >
                <div className="bg-lime-primary/20 p-2 rounded-lg">
                  <Users className="text-blue-primary" />
                </div>
                <div>
                  <span className="text-gray-500 text-xs">Crianças e Jovens</span>
                  <p className="text-blue-primary font-bold text-lg">500+</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={statsContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          <StatCard 
            number="3+" 
            title="Anos de Atuação" 
            description="Fundado em 2021, o Instituto já impactou centenas de crianças e adolescentes."
            icon={<Calendar />}
            delay={0.1}
          />
          
          <StatCard 
            number="500+" 
            title="Jovens Beneficiados" 
            description="Crianças e adolescentes que participam de nossas atividades e projetos."
            icon={<Users />}
            delay={0.2}
          />
          
          <StatCard 
            number="3+" 
            title="Projetos" 
            description="Diversos projetos esportivos e educacionais realizados com sucesso."
            icon={<Award />}
            delay={0.3}
          />
          
          <StatCard 
            number="4" 
            title="Categorias" 
            description="Atividades específicas para diferentes faixas etárias: SUB-11, SUB-13, SUB-15 e SUB-17."
            icon={<Star />}
            delay={0.4}
          />
        </motion.div>
      </div>
    </section>
  );
};

// Trophy icon component
const Trophy = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

// StatCard component for statistics display
const StatCard = ({ 
  number, 
  title, 
  description, 
  icon,
  delay 
}: { 
  number: string; 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  delay: number 
}) => {
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
      className="modern-card p-8 group"
      variants={item}
      whileHover={{ y: -8 }}
    >
      <div className="flex items-start mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-primary to-blue-light text-white mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
          {icon}
        </div>
        <div>
          <span className="text-3xl font-bold text-blue-primary">{number}</span>
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        </div>
      </div>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default HeroSection;
