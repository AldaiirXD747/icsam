
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter, ExternalLink, Heart, ChevronRight, Globe, Users, Trophy, BarChart2, Image, Star, Info, Calendar, Home } from 'lucide-react';
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
    <footer className="relative bg-gradient-to-br from-blue-dark via-blue-primary to-blue-light text-white overflow-hidden">
      {/* Background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-10 w-60 h-60 bg-lime-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-blue-light/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Top wave */}
      <div className="relative">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-background fill-current">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="opacity-20"></path>
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="opacity-10" transform="translate(0, 15)"></path>
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="opacity-5" transform="translate(0, 30)"></path>
        </svg>
      </div>
      
      <div className="container mx-auto px-6 py-16 relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={container}
        >
          {/* Column 1 - Logo and info */}
          <motion.div variants={item} className="lg:col-span-4">
            <Link to="/" className="flex items-center mb-8 group">
              <div className="bg-white p-2 rounded-xl shadow-md transition-all duration-300 group-hover:rotate-2 group-hover:shadow-xl mr-3">
                <img 
                  src="/lovable-uploads/a77367ed-485d-4364-b35e-3003be91a7cd.png" 
                  alt="Instituto Criança Santa Maria" 
                  className="h-16 w-auto"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-md">Instituto Criança</h2>
                <p className="text-sm text-lime-primary font-medium tracking-wider">Santa Maria</p>
              </div>
            </Link>
            
            <p className="text-gray-200 mb-6 text-base leading-relaxed">
              Transformando vidas através do esporte e educação, promovendo inclusão social e desenvolvimento humano desde 2021.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-8">
              <SocialLink href="https://www.facebook.com/share/1AAG7QWqqo/" icon={<Facebook />} label="Facebook" />
              <SocialLink href="https://www.instagram.com/institutocriancasanta/" icon={<Instagram />} label="Instagram" />
              <SocialLink href="https://twitter.com" icon={<Twitter />} label="Twitter" />
              <SocialLink href="https://institutocriancasantamaria.com.br" icon={<Globe />} label="Website" />
            </div>
          </motion.div>
          
          {/* Column 2 - Links */}
          <motion.div variants={item} className="lg:col-span-2">
            <FooterHeading>Navegação</FooterHeading>
            <ul className="space-y-4 mt-6">
              <FooterLink to="/" icon={<Home size={16} />}>Início</FooterLink>
              <FooterLink to="/sobre" icon={<Info size={16} />}>Sobre</FooterLink>
              <FooterLink to="/campeonatos" icon={<Trophy size={16} />}>Campeonatos</FooterLink>
              <FooterLink to="/times" icon={<Users size={16} />}>Times</FooterLink>
              <FooterLink to="/jogos" icon={<Calendar size={16} />}>Partidas</FooterLink>
            </ul>
          </motion.div>
          
          {/* Column 3 - More Links */}
          <motion.div variants={item} className="lg:col-span-2">
            <FooterHeading>Mais Links</FooterHeading>
            <ul className="space-y-4 mt-6">
              <FooterLink to="/estatisticas" icon={<BarChart2 size={16} />}>Estatísticas</FooterLink>
              <FooterLink to="/classificacao" icon={<Star size={16} />}>Classificação</FooterLink>
              <FooterLink to="/galeria" icon={<Image size={16} />}>Galeria</FooterLink>
              <FooterLink to="/transparencia" icon={<FileDocument />}>Transparência</FooterLink>
              <FooterLink to="/contato" icon={<Mail size={16} />}>Contato</FooterLink>
            </ul>
          </motion.div>
          
          {/* Column 4 - Contact */}
          <motion.div variants={item} className="lg:col-span-4">
            <FooterHeading>Contato</FooterHeading>
            <ul className="space-y-6 mt-6">
              <ContactItem icon={<Mail className="text-lime-primary h-6 w-6 shrink-0" />}>
                <div>
                  <h4 className="text-white font-medium mb-1">Email</h4>
                  <a href="mailto:contato@institutocriancasantamaria.com.br" className="text-gray-300 hover:text-lime-primary transition-colors text-sm">
                    contato@institutocriancasantamaria.com.br
                  </a>
                </div>
              </ContactItem>
              
              <ContactItem icon={<Phone className="text-lime-primary h-6 w-6 shrink-0" />}>
                <div>
                  <h4 className="text-white font-medium mb-1">Telefone</h4>
                  <span className="text-gray-300 text-sm">(61) 99312-8187</span>
                </div>
              </ContactItem>
              
              <ContactItem icon={<MapPin className="text-lime-primary h-6 w-6 shrink-0" />}>
                <div>
                  <h4 className="text-white font-medium mb-1">Endereço</h4>
                  <span className="text-gray-300 text-sm">
                    Quadra 309 Conjunto A - lote 12<br />
                    Santa Maria, Brasília - DF
                  </span>
                  <a 
                    href="https://maps.app.goo.gl/DCN2rJ3GmN2CwmXL7" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-lime-primary hover:text-lime-dark mt-2 text-sm font-medium"
                  >
                    Ver no Google Maps
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </ContactItem>
            </ul>
            
            <a 
              href="https://www.instagram.com/institutocriancasanta/" 
              className="bg-gradient-to-r from-lime-primary to-lime-dark text-blue-primary flex items-center mt-8 py-3 px-6 rounded-xl w-fit transition-all duration-300 group shadow-lg hover:shadow-xl hover:-translate-y-1 font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Heart className="h-5 w-5 mr-2 group-hover:text-red-500" />
              <span>Apoie nosso trabalho</span>
            </a>
          </motion.div>
        </motion.div>
        
        {/* Footer bottom */}
        <div className="mt-16 pt-8 border-t border-white/10 flex justify-center">
          <div className="text-center">
            <p className="text-gray-300 text-sm">CNPJ: 43.999.350/0001-16</p>
            <p className="mt-1 text-gray-300 text-sm">&copy; {currentYear} Instituto Criança Santa Maria. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// FileDocument icon component
const FileDocument = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

// Footer heading component
const FooterHeading = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xl font-semibold text-white border-b-2 border-lime-primary pb-2 inline-block">
    {children}
  </h3>
);

// Footer link component
const FooterLink = ({ to, children, icon }: { to: string; children: React.ReactNode; icon: React.ReactNode }) => (
  <li>
    <Link to={to} className="text-gray-300 hover:text-lime-primary transition-colors flex items-center group">
      <div className="mr-3 text-lime-primary">{icon}</div>
      <span className="relative overflow-hidden">
        {children}
        <span className="absolute left-0 bottom-0 w-full h-[1px] bg-lime-primary transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></span>
      </span>
    </Link>
  </li>
);

// Social media link component
const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="bg-white/10 hover:bg-white/20 transition-all duration-300 p-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1"
    aria-label={label}
  >
    {icon}
  </a>
);

// Contact item component
const ContactItem = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <li className="flex gap-4 items-start">
    {icon}
    {children}
  </li>
);

export default Footer;
