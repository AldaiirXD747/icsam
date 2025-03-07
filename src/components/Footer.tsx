
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter, ExternalLink, Heart, ChevronRight, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
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
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 50 } }
  };
  
  return (
    <footer className="bg-gradient-to-r from-blue-dark via-blue-primary to-blue-light text-white relative">
      {/* Ondas decorativas no topo do footer */}
      <div className="w-full overflow-hidden">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-8 text-background fill-current">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".3"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" opacity=".6"></path>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
        >
          {/* Primeira coluna - Logo e informações */}
          <motion.div variants={item} className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center mb-6 group">
              <div className="bg-white p-1.5 rounded-lg mr-3 transition-all duration-300 group-hover:rotate-2 group-hover:shadow-lg">
                <img 
                  src="/lovable-uploads/a77367ed-485d-4364-b35e-3003be91a7cd.png" 
                  alt="Instituto Criança Santa Maria" 
                  className="h-14 w-auto"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white drop-shadow-md">Instituto Criança</h2>
                <p className="text-sm text-lime-primary font-medium tracking-wider">Santa Maria</p>
              </div>
            </Link>
            <p className="text-gray-200 mb-4 text-sm">
              Transformando vidas através do esporte e educação, promovendo inclusão social e desenvolvimento humano.
            </p>
            <div className="flex space-x-3 mt-6">
              <SocialLink href="https://www.facebook.com/share/1AAG7QWqqo/" icon={<Facebook size={18} />} label="Facebook" />
              <SocialLink href="https://www.instagram.com/institutocriancasanta/" icon={<Instagram size={18} />} label="Instagram" />
              <SocialLink href="https://twitter.com" icon={<Twitter size={18} />} label="Twitter" />
              <SocialLink href="https://institutocriancasantamaria.com.br" icon={<Globe size={18} />} label="Website" />
            </div>
          </motion.div>
          
          {/* Segunda coluna - Links rápidos */}
          <motion.div variants={item} className="col-span-1">
            <FooterHeading>Links Rápidos</FooterHeading>
            <ul className="space-y-3">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/sobre">Sobre</FooterLink>
              <FooterLink to="/campeonatos">Campeonatos</FooterLink>
              <FooterLink to="/times">Times</FooterLink>
              <FooterLink to="/estatisticas">Estatísticas</FooterLink>
              <FooterLink to="/galeria">Galeria</FooterLink>
            </ul>
          </motion.div>
          
          {/* Terceira coluna - Links administrativos */}
          <motion.div variants={item} className="col-span-1">
            <FooterHeading>Institucional</FooterHeading>
            <ul className="space-y-3">
              <FooterLink to="/transparencia">Transparência</FooterLink>
              <FooterLink to="/contato">Contato</FooterLink>
              <FooterLink to="/login">Área Administrativa</FooterLink>
              <li>
                <a 
                  href="https://www.instagram.com/institutocriancasanta/" 
                  className="bg-lime-primary text-blue-primary hover:bg-lime-dark flex items-center mt-6 py-2 px-4 rounded-md w-fit transition-all duration-300 group shadow-md hover:shadow-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Heart className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                  <span className="font-medium">Apoie nosso trabalho</span>
                </a>
              </li>
            </ul>
          </motion.div>
          
          {/* Quarta coluna - Contato */}
          <motion.div variants={item} className="col-span-1">
            <FooterHeading>Contato</FooterHeading>
            <ul className="space-y-4">
              <ContactItem icon={<Mail className="text-lime-primary mr-3 h-5 w-5 shrink-0 mt-0.5" />}>
                <a href="mailto:contato@institutocriancasantamaria.com.br" className="text-gray-200 hover:text-lime-primary transition-colors">
                  contato@institutocriancasantamaria.com.br
                </a>
              </ContactItem>
              <ContactItem icon={<Phone className="text-lime-primary mr-3 h-5 w-5 shrink-0 mt-0.5" />}>
                <span className="text-gray-200">(61) 99312-8187</span>
              </ContactItem>
              <ContactItem icon={<MapPin className="text-lime-primary mr-3 h-5 w-5 shrink-0 mt-0.5" />}>
                <span className="text-gray-200">
                  Quadra 309 Conjunto A - lote 12<br />
                  Santa Maria, Brasília - DF
                  <a 
                    href="https://maps.app.goo.gl/DCN2rJ3GmN2CwmXL7" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-lime-primary hover:underline mt-1 text-sm"
                  >
                    Ver no Google Maps
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </span>
              </ContactItem>
            </ul>
          </motion.div>
        </motion.div>
        
        {/* Rodapé com copyright e logotipo do GDF */}
        <div className="mt-12 pt-8 border-t border-blue-light/30 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 flex items-center">
            <img 
              src="/lovable-uploads/f5090a5c-026d-4986-add2-b226f94961ed.png" 
              alt="GDF - Governo do Distrito Federal" 
              className="h-12 bg-white rounded p-1 shadow-sm"
            />
            <span className="ml-3 text-xs text-gray-300 hidden md:block">
              Apoio: Governo do Distrito Federal
            </span>
          </div>
          <div className="text-center md:text-right text-xs text-gray-300">
            <p>CNPJ: 43.999.350/0001-16</p>
            <p className="mt-1">&copy; {currentYear} Instituto Criança Santa Maria. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Footer heading component
const FooterHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-lg font-bold mb-5 flex items-center text-white">
    <span className="bg-lime-primary w-2 h-6 rounded-sm mr-2"></span>
    {children}
  </h3>
);

// Footer link component
const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <li>
    <Link to={to} className="text-gray-200 hover:text-lime-primary transition-colors flex items-center group">
      <ChevronRight className="h-4 w-4 text-lime-primary opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-5 group-hover:ml-0 mr-1" />
      {children}
    </Link>
  </li>
);

// Social media link component
const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="bg-blue-light/30 hover:bg-blue-light hover:scale-105 transition-all duration-300 p-2.5 rounded-full shadow-sm hover:shadow-md"
    aria-label={label}
  >
    {icon}
  </a>
);

// Contact item component
const ContactItem = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <li className="flex">
    {icon}
    {children}
  </li>
);

export default Footer;
