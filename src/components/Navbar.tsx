
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
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-300",
      scrolled ? "bg-blue-primary/95 backdrop-blur-md shadow-md" : "bg-blue-primary"
    )}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center group transition-transform duration-300 hover:scale-105">
            <div className="bg-white p-1 rounded-lg shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:rotate-2">
              <img 
                src="/lovable-uploads/a77367ed-485d-4364-b35e-3003be91a7cd.png" 
                alt="Instituto Criança Santa Maria" 
                className="h-10 w-auto"
              />
            </div>
            <div className="flex flex-col ml-2">
              <span className="text-white font-bold text-lg leading-tight">Instituto Criança</span>
              <span className="text-lime-primary text-xs font-medium">Santa Maria</span>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden text-white focus:outline-none"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" isActive={isActive('/')}>
              Início
            </NavLink>
            <NavLink to="/sobre" isActive={isActive('/sobre')}>
              Sobre
            </NavLink>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:text-lime-primary transition px-3 py-2 rounded-md font-normal">
                  Campeonato <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 animate-fade-in-down bg-white/95 backdrop-blur-sm border border-gray-200">
                <DropdownMenuItem className="hover:bg-gray-100">
                  <Link to="/times" className="w-full">Times</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100">
                  <Link to="/jogos" className="w-full">Partidas</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100">
                  <Link to="/estatisticas" className="w-full">Estatísticas</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-100">
                  <Link to="/classificacao" className="w-full">Classificação</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-gray-100">
                  <Link to="/campeonatos" className="w-full">Todos os Campeonatos</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <NavLink to="/galeria" isActive={isActive('/galeria')}>
              Galeria
            </NavLink>
            <NavLink to="/transparencia" isActive={isActive('/transparencia')}>
              Transparência
            </NavLink>
            <NavLink to="/contato" isActive={isActive('/contato')}>
              Contato
            </NavLink>
            <Link to="/login">
              <Button variant="outline" size="sm" className="bg-lime-primary text-blue-primary font-medium hover:bg-lime-dark border-none shadow-md hover:shadow-lg transition-all duration-300 ml-2">
                <User className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div 
        className={cn(
          "md:hidden max-h-0 overflow-hidden transition-all duration-500 ease-in-out",
          isMenuOpen && "max-h-[500px]"
        )}
      >
        <div className="bg-blue-primary/95 backdrop-blur-md py-4 px-4 shadow-lg space-y-4">
          <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>
            Início
          </MobileNavLink>
          <MobileNavLink to="/sobre" onClick={() => setIsMenuOpen(false)}>
            Sobre
          </MobileNavLink>
          <div className="bg-blue-light/40 rounded-lg p-3">
            <h3 className="text-lime-primary font-medium text-sm mb-2 text-center">Campeonato</h3>
            <div className="space-y-2">
              <MobileSubLink to="/times" onClick={() => setIsMenuOpen(false)}>
                Times
              </MobileSubLink>
              <MobileSubLink to="/jogos" onClick={() => setIsMenuOpen(false)}>
                Partidas
              </MobileSubLink>
              <MobileSubLink to="/estatisticas" onClick={() => setIsMenuOpen(false)}>
                Estatísticas
              </MobileSubLink>
              <MobileSubLink to="/classificacao" onClick={() => setIsMenuOpen(false)}>
                Classificação
              </MobileSubLink>
              <MobileSubLink to="/campeonatos" onClick={() => setIsMenuOpen(false)}>
                Todos os Campeonatos
              </MobileSubLink>
            </div>
          </div>
          <MobileNavLink to="/galeria" onClick={() => setIsMenuOpen(false)}>
            Galeria
          </MobileNavLink>
          <MobileNavLink to="/transparencia" onClick={() => setIsMenuOpen(false)}>
            Transparência
          </MobileNavLink>
          <MobileNavLink to="/contato" onClick={() => setIsMenuOpen(false)}>
            Contato
          </MobileNavLink>
          <Link to="/login" className="block" onClick={() => setIsMenuOpen(false)}>
            <Button variant="outline" className="w-full bg-lime-primary text-blue-primary font-medium hover:bg-lime-dark border-none shadow-md hover:shadow-lg mt-2">
              <User className="mr-2 h-4 w-4" />
              Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

// Desktop Navigation Link component
const NavLink = ({ to, children, isActive }: { to: string; children: React.ReactNode; isActive: boolean }) => (
  <Link
    to={to}
    className={cn(
      "relative px-3 py-2 rounded-md transition-all duration-300 hover:text-lime-primary",
      isActive 
        ? "text-lime-primary font-medium" 
        : "text-white"
    )}
  >
    {children}
    <span className={cn(
      "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-lime-primary rounded-full transition-all duration-300",
      isActive ? "w-2/3" : "w-0 group-hover:w-2/3"
    )}></span>
  </Link>
);

// Mobile Navigation Link component
const MobileNavLink = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link
    to={to}
    className="text-white hover:text-lime-primary transition-colors duration-300 block text-center font-medium py-2 rounded-md hover:bg-blue-light/30"
    onClick={onClick}
  >
    {children}
  </Link>
);

// Mobile Sub Navigation Link component
const MobileSubLink = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link
    to={to}
    className="text-white hover:text-lime-primary transition-colors duration-300 block text-sm pl-2 py-1.5 rounded hover:bg-blue-light/20"
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Navbar;
