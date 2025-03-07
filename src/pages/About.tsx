
import React from 'react';
import Navbar from '@/components/Navbar';
import { ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-r from-blue-primary to-blue-light relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-60 h-60 bg-lime-primary/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Sobre Nós
              </motion.h1>
              <motion.p 
                className="text-white/90 max-w-2xl mx-auto text-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Conheça a história e a missão do Instituto Criança Santa Maria
              </motion.p>
            </div>
          </div>
        </section>
        
        {/* Founder Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <motion.div 
                className="lg:w-1/2"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-lime-primary/30 rounded-lg rotate-12 z-0 blur-sm"></div>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-primary/20 rounded-full z-0 blur-sm"></div>
                  
                  <img 
                    src="/lovable-uploads/b57c03b4-f522-4117-86e8-8ecb86f62697.png" 
                    alt="Cesar da Conceição - Fundador e Presidente" 
                    className="rounded-2xl shadow-xl w-full h-auto relative z-10 border-8 border-white"
                  />
                </div>
              </motion.div>
              
              <motion.div 
                className="lg:w-1/2"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-block bg-lime-primary/20 px-5 py-2 rounded-full mb-6">
                  <span className="text-blue-primary font-semibold text-sm">Fundador e Presidente</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-blue-primary">
                  Cesar da Conceição
                </h2>
                <div className="text-gray-700 space-y-5 text-lg">
                  <p>
                    O Instituto Criança Santa Maria (ICSAM) foi criado em 2004 pelo visionário Cesar da Conceição, com o sonho de transformar a vida de crianças e jovens da comunidade de Santa Maria, Distrito Federal, através do esporte.
                  </p>
                  <p>
                    Desde o início, Cesar teve como objetivo utilizar o futebol e outras atividades esportivas como ferramentas para inclusão social e desenvolvimento pessoal. Inicialmente, o Instituto começou como um projeto voluntário, oferecendo oportunidades para crianças em situação de vulnerabilidade.
                  </p>
                  <p>
                    Foi em 14 de outubro de 2021 que o ICSAM foi formalmente registrado sob o CNPJ 43.999.350/0001-16, consolidando-se como uma organização sem fins lucrativos dedicada ao bem-estar e ao crescimento dos jovens da região.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* History Section */}
        <section className="py-20 bg-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="shape-blob w-[500px] h-[500px] bg-blue-primary/5 top-0 right-0"></div>
            <div className="shape-blob w-[400px] h-[400px] bg-lime-primary/5 bottom-0 left-0 animation-delay-2000"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
              <motion.h3 
                className="text-3xl md:text-4xl font-bold mb-10 text-blue-primary text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Nossa História
              </motion.h3>
              
              <motion.div 
                className="text-gray-700 space-y-6 text-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p>
                  Ao longo dos anos, o Instituto passou a realizar grandes eventos anuais, como a Copa Furacão e o Torneio Aniversário Santa Maria – DF. A Copa Furacão, por exemplo, reúne cerca de 300 jovens atletas, enquanto o Torneio Aniversário envolve mais de 450 participantes, promovendo não apenas a prática esportiva, mas também valores como disciplina, respeito e trabalho em equipe.
                </p>
                <p>
                  Sob a liderança de Cesar da Conceição, o ICSAM ganhou força e credibilidade na comunidade, tornando-se um símbolo de esperança e mudança. Cesar sempre acreditou que o esporte vai além da atividade física, sendo uma forma de educação, inclusão e desenvolvimento de habilidades emocionais. Seu trabalho incansável e a paixão pelo projeto trouxeram grandes conquistas para o Instituto e para todos os jovens que passaram pelos seus programas.
                </p>
                <p>
                  Essas iniciativas demonstram a capacidade do ICSAM de planejar e executar projetos com excelência, gerindo recursos de forma eficiente e impactando positivamente a vida de centenas de crianças e adolescentes. Com uma equipe comprometida e uma visão clara de futuro, o Instituto continua a crescer, sempre mantendo o foco no uso do esporte como uma poderosa ferramenta de transformação social e pessoal.
                </p>
              </motion.div>
              
              <motion.div 
                className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="modern-card p-8 text-center">
                  <div className="text-blue-primary font-bold text-5xl mb-4">2004</div>
                  <p className="text-gray-600">Início das atividades por Cesar da Conceição</p>
                </div>
                <div className="modern-card p-8 text-center">
                  <div className="text-blue-primary font-bold text-5xl mb-4">2021</div>
                  <p className="text-gray-600">Registro formal como organização em 14/10/2021</p>
                </div>
                <div className="modern-card p-8 text-center">
                  <div className="text-blue-primary font-bold text-5xl mb-4">450+</div>
                  <p className="text-gray-600">Jovens participantes anualmente nos torneios</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Mission and Values Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <motion.h3 
                className="text-3xl md:text-4xl font-bold mb-10 text-blue-primary text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Nossa Missão e Valores
              </motion.h3>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="glassmorphism p-8 rounded-2xl bg-gradient-to-br from-blue-primary/5 to-blue-light/10 border-l-8 border-blue-primary">
                  <h4 className="text-2xl font-bold text-blue-primary mb-4">Missão</h4>
                  <p className="text-gray-700 text-lg">
                    Promover a inclusão social e o desenvolvimento pessoal de crianças e jovens através do esporte, oferecendo oportunidades de crescimento, educação e cidadania.
                  </p>
                </div>
                
                <div className="glassmorphism p-8 rounded-2xl bg-gradient-to-br from-lime-primary/5 to-lime-dark/10 border-l-8 border-lime-primary">
                  <h4 className="text-2xl font-bold text-blue-primary mb-4">Visão</h4>
                  <p className="text-gray-700 text-lg">
                    Ser referência em projetos sociais que utilizam o esporte como ferramenta de transformação, formando não apenas atletas, mas cidadãos conscientes e preparados.
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <ValueCard title="Inclusão" description="Acolhemos a todos, independente de origem ou habilidade." />
                <ValueCard title="Disciplina" description="Cultivamos hábitos saudáveis e comprometimento." />
                <ValueCard title="Respeito" description="Valorizamos a diversidade e a consideração mútua." />
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Link to="/contato" className="btn-primary inline-flex group">
                  <span>Entre em Contato</span> 
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

const ValueCard = ({ title, description }: { title: string; description: string }) => (
  <div className="modern-card p-8 text-center hover:-translate-y-2">
    <h5 className="font-bold text-xl text-blue-primary mb-4">{title}</h5>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default About;
