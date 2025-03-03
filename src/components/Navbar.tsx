
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

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
            src="https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/cropped-LOGO-INSTITUTO-CORTADA-1.png" 
            alt="Instituto Criança Santa Maria" 
            className="h-12 mr-2"
          />
          <div className="hidden md:block">
            <h1 className="text-blue-primary text-lg font-semibold">Base Forte</h1>
            <p className="text-xs text-gray-600">2025</p>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-blue-primary hover:text-blue-light font-medium transition-colors">
            Home
          </Link>
          <Link to="/teams" className="text-blue-primary hover:text-blue-light font-medium transition-colors">
            Times
          </Link>
          <Link to="/matches" className="text-blue-primary hover:text-blue-light font-medium transition-colors">
            Jogos
          </Link>
          <Link to="/statistics" className="text-blue-primary hover:text-blue-light font-medium transition-colors">
            Estatísticas
          </Link>
          <div className="relative group">
            <button className="text-blue-primary hover:text-blue-light font-medium transition-colors flex items-center">
              Campeonatos <ChevronDown size={16} className="ml-1" />
            </button>
            <div className="absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <Link to="/championships/base-forte-2025" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50" role="menuitem">
                  Base Forte – 2025
                </Link>
              </div>
            </div>
          </div>
          <a 
            href="https://institutocriancasantamaria.com.br/"
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-primary hover:text-blue-light font-medium transition-colors"
          >
            Início
          </a>
          <Link to="/login" className="btn-primary">
            Login
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
              Home
            </Link>
            <Link to="/teams" className="text-blue-primary hover:text-blue-light font-medium transition-colors py-2 border-b">
              Times
            </Link>
            <Link to="/matches" className="text-blue-primary hover:text-blue-light font-medium transition-colors py-2 border-b">
              Jogos
            </Link>
            <Link to="/statistics" className="text-blue-primary hover:text-blue-light font-medium transition-colors py-2 border-b">
              Estatísticas
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
                <Link to="/championships/base-forte-2025" className="block py-2 text-blue-primary hover:text-blue-light transition-colors">
                  Base Forte – 2025
                </Link>
              </div>
            </div>
            <a 
              href="https://institutocriancasantamaria.com.br/"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-primary hover:text-blue-light font-medium transition-colors py-2 border-b"
            >
              Início
            </a>
            <Link to="/login" className="btn-primary text-center">
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
