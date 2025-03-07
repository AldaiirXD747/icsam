
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EnhancedHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Check if we're on an admin page
  const isAdminPage = location.pathname.includes('/admin');
  const isTeamPage = location.pathname.includes('/team');

  // Handle scrolling effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`bg-blue-primary fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'shadow-md py-2' : 'py-3'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <div className={`relative overflow-hidden transition-all duration-300 ${isScrolled ? 'h-9 w-9' : 'h-12 w-12'} bg-white rounded-lg p-1 group-hover:shadow-lg`}>
            <img 
              src="/lovable-uploads/a77367ed-485d-4364-b35e-3003be91a7cd.png" 
              alt="Base Forte" 
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </div>
          <div className="ml-3">
            <span className="font-display text-white font-bold text-xl transition-all duration-300">Base Forte</span>
            <span className="block text-xs text-lime-primary font-medium">Instituto Criança Santa Maria</span>
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {!isAdminPage && !isTeamPage && (
            <>
              <Link to="/" className={`text-white hover:text-lime-primary transition px-2 py-1 ${location.pathname === '/' ? 'border-b-2 border-lime-primary' : ''}`}>
                Início
              </Link>
              <Link to="/sobre" className={`text-white hover:text-lime-primary transition px-2 py-1 ${location.pathname === '/sobre' ? 'border-b-2 border-lime-primary' : ''}`}>
                Sobre
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={`text-white hover:text-lime-primary transition px-2 py-1 h-auto font-normal ${location.pathname.includes('/campeonatos') || location.pathname.includes('/times') || location.pathname.includes('/classificacao') ? 'border-b-2 border-lime-primary' : ''}`}>
                    Campeonato <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-blue-light border-blue-primary">
                  <DropdownMenuItem className="focus:bg-blue-primary focus:text-white">
                    <Link to="/times" className="w-full">Times</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-blue-primary focus:text-white">
                    <Link to="/jogos" className="w-full">Partidas</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-blue-primary focus:text-white">
                    <Link to="/estatisticas" className="w-full">Estatísticas</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-blue-primary focus:text-white">
                    <Link to="/classificacao" className="w-full">Classificação</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-blue-primary/20" />
                  <DropdownMenuItem className="focus:bg-blue-primary focus:text-white">
                    <Link to="/campeonatos" className="w-full">Todos os Campeonatos</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link to="/galeria" className={`text-white hover:text-lime-primary transition px-2 py-1 ${location.pathname === '/galeria' ? 'border-b-2 border-lime-primary' : ''}`}>
                Galeria
              </Link>
              <Link to="/transparencia" className={`text-white hover:text-lime-primary transition px-2 py-1 ${location.pathname === '/transparencia' ? 'border-b-2 border-lime-primary' : ''}`}>
                Transparência
              </Link>
              <Link to="/contato" className={`text-white hover:text-lime-primary transition px-2 py-1 ${location.pathname === '/contato' ? 'border-b-2 border-lime-primary' : ''}`}>
                Contato
              </Link>
              <Link to="/login">
                <Button variant="outline" size="sm" className="bg-lime-primary text-blue-primary font-medium hover:bg-lime-dark border-none ml-2">
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
            </>
          )}
          
          {(isAdminPage || isTeamPage) && (
            <div className="text-white font-semibold">
              {isAdminPage ? "Painel Administrativo" : "Área do Time"}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-blue-primary py-4`}>
        <div className="flex flex-col items-center space-y-4">
          <Link to="/" className="text-white hover:text-lime-primary transition block" onClick={() => setIsMenuOpen(false)}>
            Início
          </Link>
          <Link to="/sobre" className="text-white hover:text-lime-primary transition block" onClick={() => setIsMenuOpen(false)}>
            Sobre
          </Link>
          <div className="w-full px-4">
            <div className="bg-blue-light rounded p-2">
              <h3 className="text-lime-primary font-medium text-sm mb-2 text-center">Campeonato</h3>
              <div className="space-y-2">
                <Link to="/times" className="text-white hover:text-lime-primary transition block text-sm pl-2" onClick={() => setIsMenuOpen(false)}>
                  Times
                </Link>
                <Link to="/jogos" className="text-white hover:text-lime-primary transition block text-sm pl-2" onClick={() => setIsMenuOpen(false)}>
                  Partidas
                </Link>
                <Link to="/estatisticas" className="text-white hover:text-lime-primary transition block text-sm pl-2" onClick={() => setIsMenuOpen(false)}>
                  Estatísticas
                </Link>
                <Link to="/classificacao" className="text-white hover:text-lime-primary transition block text-sm pl-2" onClick={() => setIsMenuOpen(false)}>
                  Classificação
                </Link>
                <Link to="/campeonatos" className="text-white hover:text-lime-primary transition block text-sm pl-2" onClick={() => setIsMenuOpen(false)}>
                  Todos os Campeonatos
                </Link>
              </div>
            </div>
          </div>
          <Link to="/galeria" className="text-white hover:text-lime-primary transition block" onClick={() => setIsMenuOpen(false)}>
            Galeria
          </Link>
          <Link to="/transparencia" className="text-white hover:text-lime-primary transition block" onClick={() => setIsMenuOpen(false)}>
            Transparência
          </Link>
          <Link to="/contato" className="text-white hover:text-lime-primary transition block" onClick={() => setIsMenuOpen(false)}>
            Contato
          </Link>
          <Link to="/login" className="w-full px-4" onClick={() => setIsMenuOpen(false)}>
            <Button variant="outline" className="w-full bg-lime-primary text-blue-primary font-medium hover:bg-lime-dark border-none">
              <User className="mr-2 h-4 w-4" />
              Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default EnhancedHeader;
