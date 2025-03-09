
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const AboutSection = () => {
  return <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 order-2 lg:order-1 animate-fade-in-up">
            <div className="inline-block bg-lime-primary bg-opacity-20 px-4 py-1.5 rounded-full mb-6">
              <span className="text-blue-primary font-medium text-sm">Conheça Nossa História</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-blue-primary">
              Instituto Criança Santa Maria
            </h2>
            <p className="text-gray-700 mb-4">
              Fundado em 14 de outubro de 2021, o Instituto Criança Santa Maria (CNPJ: 43.999.350/0001-16) nasceu com a missão de transformar a vida de crianças e adolescentes através do esporte, cultura e educação, proporcionando oportunidades de desenvolvimento integral.
            </p>
            <p className="text-gray-700 mb-6">
              Nossa visão é ser referência em projetos sociais que utilizam o esporte como ferramenta de inclusão e desenvolvimento humano, formando não apenas atletas, mas cidadãos conscientes e preparados para enfrentar os desafios da vida.
            </p>
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-blue-primary flex items-center justify-center text-white font-bold text-xl">
                  3+
                </div>
                <div>
                  <p className="text-sm text-gray-500">Anos de</p>
                  <p className="font-semibold text-blue-primary">Experiência</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-blue-primary flex items-center justify-center text-white font-bold text-xl">
                  +500
                </div>
                <div>
                  <p className="text-sm text-gray-500">Crianças</p>
                  <p className="font-semibold text-blue-primary">Beneficiadas</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-blue-primary flex items-center justify-center text-white font-bold text-xl">
                  15
                </div>
                <div>
                  <p className="text-sm text-gray-500">Projetos</p>
                  <p className="font-semibold text-blue-primary">Realizados</p>
                </div>
              </div>
            </div>
            <Link to="/sobre" className="btn-primary inline-flex items-center">
              Saiba Mais <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
          <div className="lg:w-1/2 order-1 lg:order-2 animate-fade-in">
            <div className="relative">
              <img alt="Instituto Criança Santa Maria" src="https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/LOGO-INSTITUTO-CORTADA-1.png" className="w-full h-auto rounded-xl shadow-lg object-contain" />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-lime-primary flex items-center justify-center">
                    <span className="text-blue-primary font-bold text-2xl">3</span>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Anos de</p>
                    <p className="text-blue-primary font-bold">Atuação formal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default AboutSection;
