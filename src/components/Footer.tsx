import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Facebook, Instagram, Twitter, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-blue-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <div className="bg-white p-1.5 rounded-lg mr-3 transition-transform duration-300 hover:rotate-2">
                <img 
                  src="/lovable-uploads/a77367ed-485d-4364-b35e-3003be91a7cd.png" 
                  alt="Instituto Criança Santa Maria" 
                  className="h-16"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold">Instituto Criança</h2>
                <p className="text-sm text-lime-primary">Santa Maria</p>
              </div>
            </Link>
            <p className="text-gray-300 mb-4 max-w-md">
              O Instituto Criança Santa Maria (CNPJ 43.999.350/0001-16) tem como missão transformar vidas através do esporte e educação, promovendo inclusão social e desenvolvimento humano.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/share/1AAG7QWqqo/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-lime-primary transition-colors bg-blue-light p-2 rounded-full"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://www.instagram.com/institutocriancasanta/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-lime-primary transition-colors bg-blue-light p-2 rounded-full"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white hover:text-lime-primary transition-colors bg-blue-light p-2 rounded-full"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <span className="bg-lime-primary w-2 h-2 rounded-full mr-2"></span>
              Navegação
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-lime-primary transition-colors flex items-center">
                  <span className="w-1 h-1 bg-lime-primary rounded-full mr-2"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-gray-300 hover:text-lime-primary transition-colors flex items-center">
                  <span className="w-1 h-1 bg-lime-primary rounded-full mr-2"></span>
                  Sobre
                </Link>
              </li>
              <li>
                <Link to="/campeonatos" className="text-gray-300 hover:text-lime-primary transition-colors flex items-center">
                  <span className="w-1 h-1 bg-lime-primary rounded-full mr-2"></span>
                  Campeonatos
                </Link>
              </li>
              <li>
                <Link to="/times" className="text-gray-300 hover:text-lime-primary transition-colors flex items-center">
                  <span className="w-1 h-1 bg-lime-primary rounded-full mr-2"></span>
                  Times
                </Link>
              </li>
              <li>
                <Link to="/estatisticas" className="text-gray-300 hover:text-lime-primary transition-colors flex items-center">
                  <span className="w-1 h-1 bg-lime-primary rounded-full mr-2"></span>
                  Estatísticas
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-lime-primary transition-colors flex items-center">
                  <span className="w-1 h-1 bg-lime-primary rounded-full mr-2"></span>
                  Área Administrativa
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <span className="bg-lime-primary w-2 h-2 rounded-full mr-2"></span>
              Contato
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="text-lime-primary mr-2 h-5 w-5 shrink-0 mt-0.5" />
                <a href="mailto:contato@institutocriancasantamaria.com.br" className="text-gray-300 hover:text-lime-primary transition-colors">
                  contato@institutocriancasantamaria.com.br
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="text-lime-primary mr-2 h-5 w-5 shrink-0 mt-0.5" />
                <span className="text-gray-300">
                  (61) 99312-8187
                </span>
              </li>
              <li className="flex items-start">
                <MapPin className="text-lime-primary mr-2 h-5 w-5 shrink-0 mt-0.5" />
                <span className="text-gray-300">
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
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-blue-light flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <img 
              src="/lovable-uploads/f5090a5c-026d-4986-add2-b226f94961ed.png" 
              alt="GDF - Governo do Distrito Federal" 
              className="h-14 bg-white rounded p-1"
            />
          </div>
          <div className="text-center text-sm text-gray-300">
            <p>&copy; {currentYear} Instituto Criança Santa Maria (CNPJ: 43.999.350/0001-16). Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
