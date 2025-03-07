
import React from 'react';
import { Award, Users, Building, ExternalLink, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const PartnersSection = () => {
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
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-10 left-0 w-96 h-96 bg-blue-primary/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-20 right-0 w-96 h-96 bg-lime-primary/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block bg-lime-primary bg-opacity-20 px-4 py-1.5 rounded-full mb-2 shadow-sm">
            <span className="text-blue-primary font-medium text-sm">Nossos Parceiros</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-primary">Parceiros e Apoiadores</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Instituições e empresas que acreditam no nosso trabalho e apoiam nossa missão de transformar vidas através do esporte.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Government Partners */}
          <PartnerCard 
            icon={<Building className="h-6 w-6 text-blue-primary" />} 
            title="Órgãos Governamentais" 
            description="Apoio institucional de secretarias e órgãos públicos que fortalecem nossas iniciativas." 
            delay={0}
          />

          {/* Educational Partners */}
          <PartnerCard 
            icon={<Award className="h-6 w-6 text-blue-primary" />} 
            title="Instituições Educacionais" 
            description="Parceiros educacionais que contribuem para o desenvolvimento integral dos nossos jovens." 
            delay={0.1}
          />

          {/* Business Partners */}
          <PartnerCard 
            icon={<Users className="h-6 w-6 text-blue-primary" />} 
            title="Empresas Apoiadoras" 
            description="Empresas de diversos segmentos que acreditam no poder transformador do esporte." 
            delay={0.2}
          />
        </motion.div>
        
        <motion.h3 
          className="text-2xl font-bold text-blue-primary text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Parceiros Oficiais
        </motion.h3>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Secretaria de Educação Logo */}
          <PartnerLogo 
            src="/lovable-uploads/d9479deb-326b-4848-89fb-ef3e3f4c9601.png" 
            alt="Secretaria de Educação - GDF" 
            name="Secretaria de Educação - GDF"
            delay={0}
          />
          
          {/* Ministério do Esporte Logo */}
          <PartnerLogo 
            src="/lovable-uploads/0b71f7dd-5e7e-46d7-a9c6-7c4d93e26e31.png" 
            alt="Ministério do Esporte - Governo Federal" 
            name="Ministério do Esporte"
            delay={0.1}
          />
          
          {/* Administração Regional */}
          <motion.div 
            className="glass-card p-6 flex flex-col items-center justify-center h-40 group hover:-translate-y-1 transition-all duration-300 border border-gray-100"
            variants={item}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-3 rounded-full bg-blue-50 mb-3 shadow-sm">
              <Building className="h-8 w-8 text-blue-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="font-semibold text-blue-primary text-center">Administração Regional</h3>
            <p className="text-sm text-gray-500 mt-1 text-center">Santa Maria - DF</p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button 
            variant="default" 
            className="bg-lime-primary text-blue-primary hover:bg-lime-dark font-semibold px-6 py-6 h-auto rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            Torne-se um Apoiador
            <ArrowRight size={18} className="ml-2" />
          </Button>
          <p className="text-gray-500 text-sm mt-4">
            Junte-se a nós e faça parte desta transformação social através do esporte.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Partner Card Component
const PartnerCard = ({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) => {
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
      variants={item}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <Card className="bg-white/70 backdrop-blur-sm border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 h-full">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-blue-50 p-3 rounded-full shadow-sm">
              {icon}
            </div>
            <h3 className="text-xl font-semibold text-blue-primary">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Partner Logo Component
const PartnerLogo = ({ src, alt, name, delay }: { src: string; alt: string; name: string; delay: number }) => {
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
      className="glass-card p-6 flex flex-col items-center justify-center h-40 group hover:-translate-y-1 transition-all duration-300 border border-gray-100"
      variants={item}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <img 
        src={src} 
        alt={alt} 
        className="max-h-16 object-contain mb-3 group-hover:scale-105 transition-transform duration-300"
      />
      <p className="text-sm text-gray-600 text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{name}</p>
    </motion.div>
  );
};

export default PartnersSection;
