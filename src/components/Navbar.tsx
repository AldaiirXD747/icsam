
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, LogIn } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white bg-opacity-90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/a77367ed-485d-4364-b35e-3003be91a7cd.png" 
            alt="Instituto Criança Santa Maria" 
            className="h-14 mr-2"
          />
          <div className="hidden md:block">
            <h1 className="text-blue-primary text-lg font-semibold">Instituto</h1>
            <p className="text-xs text-gray-600">Criança Santa Maria</p>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-blue-primary hover:text-blue-light font-medium transition-colors">
            Início
          </Link>
          <Link to="/sobre" className="text-blue-primary hover:text-blue-light font-medium transition-colors">
            Sobre
          </Link>
          <Link to="/transparencia" className="text-blue-primary hover:text-blue-light font-medium transition-colors">
            Transparência
          </Link>
          <div className="relative group">
            <button className="text-blue-primary hover:text-blue-light font-medium transition-colors flex items-center">
              Campeonatos <ChevronDown size={16} className="ml-1" />
            </button>
            <div className="absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <Link to="/championships" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50" role="menuitem">
                  Todos os Campeonatos
                </Link>
                <Link to="/teams" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50" role="menuitem">
                  Times
                </Link>
                <Link to="/matches" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50" role="menuitem">
                  Jogos
                </Link>
                <Link to="/statistics" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50" role="menuitem">
                  Estatísticas
                </Link>
                <Link to="/standings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50" role="menuitem">
                  Classificação
                </Link>
              </div>
            </div>
          </div>
          <Link to="/contato" className="text-blue-primary hover:text-blue-light font-medium transition-colors">
            Contato
          </Link>
          <Link 
            to="/login" 
            className="btn-primary flex items-center gap-2"
          >
            <LogIn size={18} /> Login
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <button 
          onClick={toggleMenu} 
          className="md:hidden text-blue-primary"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white bg-opacity-95 backdrop-blur-md shadow-md animate-slide-in-left">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link to="/" className="text-blue-primary hover:text-blue-light font-medium transition-colors py-2 border-b">
              Início
            </Link>
            <Link to="/sobre" className="text-blue-primary hover:text-blue-light font-medium transition-colors py-2 border-b">
              Sobre
            </Link>
            <Link to="/transparencia" className="text-blue-primary hover:text-blue-light font-medium transition-colors py-2 border-b">
              Transparência
            </Link>
            <div className="py-2 border-b">
              <button 
                onClick={() => {
                  const submenu = document.getElementById('campeonatos-submenu');
                  if (submenu) {
                    submenu.classList.toggle('hidden');
                  }
                }}
                className="text-blue-primary hover:text-blue-light font-medium transition-colors flex items-center"
              >
                Campeonatos <ChevronDown size={16} className="ml-1" />
              </button>
              <div id="campeonatos-submenu" className="hidden pl-4 mt-2">
                <Link to="/championships" className="block py-2 text-blue-primary hover:text-blue-light transition-colors">
                  Todos os Campeonatos
                </Link>
                <Link to="/teams" className="block py-2 text-blue-primary hover:text-blue-light transition-colors">
                  Times
                </Link>
                <Link to="/matches" className="block py-2 text-blue-primary hover:text-blue-light transition-colors">
                  Jogos
                </Link>
                <Link to="/statistics" className="block py-2 text-blue-primary hover:text-blue-light transition-colors">
                  Estatísticas
                </Link>
                <Link to="/standings" className="block py-2 text-blue-primary hover:text-blue-light transition-colors">
                  Classificação
                </Link>
              </div>
            </div>
            <Link to="/contato" className="text-blue-primary hover:text-blue-light font-medium transition-colors py-2 border-b">
              Contato
            </Link>
            <Link 
              to="/login" 
              className="btn-primary text-center flex items-center justify-center gap-2"
            >
              <LogIn size={18} /> Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
