
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-r from-blue-primary to-blue-light">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Sobre Nós</h1>
              <p className="text-white/80 max-w-2xl mx-auto">
                Conheça a história e a missão do Instituto Criança Santa Maria
              </p>
            </div>
          </div>
        </section>
        
        {/* Founder Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <img 
                  src="/lovable-uploads/b57c03b4-f522-4117-86e8-8ecb86f62697.png" 
                  alt="Cesar da Conceição - Fundador e Presidente" 
                  className="rounded-xl shadow-lg w-full h-auto"
                />
              </div>
              
              <div className="lg:w-1/2">
                <div className="inline-block bg-lime-primary bg-opacity-20 px-4 py-1.5 rounded-full mb-4">
                  <span className="text-blue-primary font-medium text-sm">Fundador e Presidente</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-primary">
                  Cesar da Conceição
                </h2>
                <div className="text-gray-700 space-y-4">
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
              </div>
            </div>
          </div>
        </section>
        
        {/* History Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold mb-8 text-blue-primary">Nossa História</h3>
              <div className="text-gray-700 space-y-6">
                <p>
                  Ao longo dos anos, o Instituto passou a realizar grandes eventos anuais, como a Copa Furacão e o Torneio Aniversário Santa Maria – DF. A Copa Furacão, por exemplo, reúne cerca de 300 jovens atletas, enquanto o Torneio Aniversário envolve mais de 450 participantes, promovendo não apenas a prática esportiva, mas também valores como disciplina, respeito e trabalho em equipe.
                </p>
                <p>
                  Sob a liderança de Cesar da Conceição, o ICSAM ganhou força e credibilidade na comunidade, tornando-se um símbolo de esperança e mudança. Cesar sempre acreditou que o esporte vai além da atividade física, sendo uma forma de educação, inclusão e desenvolvimento de habilidades emocionais. Seu trabalho incansável e a paixão pelo projeto trouxeram grandes conquistas para o Instituto e para todos os jovens que passaram pelos seus programas.
                </p>
                <p>
                  Essas iniciativas demonstram a capacidade do ICSAM de planejar e executar projetos com excelência, gerindo recursos de forma eficiente e impactando positivamente a vida de centenas de crianças e adolescentes. Com uma equipe comprometida e uma visão clara de futuro, o Instituto continua a crescer, sempre mantendo o foco no uso do esporte como uma poderosa ferramenta de transformação social e pessoal.
                </p>
              </div>
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="text-blue-primary font-bold text-5xl mb-2">2004</div>
                  <p className="text-gray-600">Início das atividades por Cesar da Conceição</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="text-blue-primary font-bold text-5xl mb-2">2021</div>
                  <p className="text-gray-600">Registro formal como organização em 14/10/2021</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="text-blue-primary font-bold text-5xl mb-2">450+</div>
                  <p className="text-gray-600">Jovens participantes anualmente nos torneios</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission and Values Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold mb-8 text-blue-primary">Nossa Missão e Valores</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-primary">
                  <h4 className="text-xl font-bold text-blue-primary mb-4">Missão</h4>
                  <p className="text-gray-700">
                    Promover a inclusão social e o desenvolvimento pessoal de crianças e jovens através do esporte, oferecendo oportunidades de crescimento, educação e cidadania.
                  </p>
                </div>
                
                <div className="bg-lime-50 p-6 rounded-xl border-l-4 border-lime-primary">
                  <h4 className="text-xl font-bold text-blue-primary mb-4">Visão</h4>
                  <p className="text-gray-700">
                    Ser referência em projetos sociais que utilizam o esporte como ferramenta de transformação, formando não apenas atletas, mas cidadãos conscientes e preparados.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4">
                  <h5 className="font-bold text-blue-primary mb-2">Inclusão</h5>
                  <p className="text-gray-600 text-sm">Acolhemos a todos, independente de origem ou habilidade.</p>
                </div>
                <div className="p-4">
                  <h5 className="font-bold text-blue-primary mb-2">Disciplina</h5>
                  <p className="text-gray-600 text-sm">Cultivamos hábitos saudáveis e comprometimento.</p>
                </div>
                <div className="p-4">
                  <h5 className="font-bold text-blue-primary mb-2">Respeito</h5>
                  <p className="text-gray-600 text-sm">Valorizamos a diversidade e a consideração mútua.</p>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <a href="/contato" className="btn-primary inline-flex items-center">
                  Entre em Contato <ArrowRight size={18} className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
