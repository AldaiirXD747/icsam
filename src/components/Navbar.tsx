
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  User, 
  ChevronDown, 
  Home, 
  Info, 
  Trophy, 
  Users, 
  Calendar, 
  BarChart2, 
  Image, 
  FileText, 
  Mail 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [isCampeonatoOpen, setIsCampeonatoOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Reset campeonato submenu when main menu is toggled
    setIsCampeonatoOpen(false);
  };

  const toggleCampeonato = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCampeonatoOpen(!isCampeonatoOpen);
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
    setIsCampeonatoOpen(false);
  }, [location]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Animation variants
  const navAnimation = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };
  
  const itemAnimation = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navAnimation}
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500",
        scrolled 
          ? "bg-gradient-to-r from-blue-primary to-blue-light shadow-lg backdrop-blur-lg py-3" 
          : "bg-gradient-to-r from-blue-primary/95 to-blue-light/95 py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div variants={itemAnimation}>
            <Link to="/" className="flex items-center group">
              <div className="bg-white p-2 rounded-xl shadow-md hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:rotate-3 mr-3">
                <img 
                  src="/lovable-uploads/a77367ed-485d-4364-b35e-3003be91a7cd.png" 
                  alt="Instituto Criança Santa Maria" 
                  className="h-10 w-auto"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-poppins font-bold text-lg leading-tight">Instituto Criança</span>
                <span className="text-lime-primary text-xs tracking-wider font-medium">Santa Maria</span>
              </div>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button 
            onClick={toggleMenu}
            variants={itemAnimation}
            className="md:hidden text-white focus:outline-none bg-white/10 p-2 rounded-lg hover:bg-white/20"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <motion.div variants={itemAnimation}>
              <NavLink to="/" isActive={isActive('/')} icon={<Home size={18} />}>
                Início
              </NavLink>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <NavLink to="/sobre" isActive={isActive('/sobre')} icon={<Info size={18} />}>
                Sobre
              </NavLink>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:bg-white/10 transition px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                  >
                    <Trophy size={18} />
                    Campeonato 
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 animate-fade-in-down bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl p-2 shadow-xl">
                  <DropdownMenuItem className="rounded-lg hover:bg-gray-100 py-2.5">
                    <Link to="/times" className="w-full flex items-center gap-2">
                      <Users size={16} className="text-blue-primary" />
                      <span>Times</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg hover:bg-gray-100 py-2.5">
                    <Link to="/jogos" className="w-full flex items-center gap-2">
                      <Calendar size={16} className="text-blue-primary" />
                      <span>Partidas</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg hover:bg-gray-100 py-2.5">
                    <Link to="/estatisticas" className="w-full flex items-center gap-2">
                      <BarChart2 size={16} className="text-blue-primary" />
                      <span>Estatísticas</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg hover:bg-gray-100 py-2.5">
                    <Link to="/classificacao" className="w-full flex items-center gap-2">
                      <Trophy size={16} className="text-blue-primary" />
                      <span>Classificação</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="rounded-lg hover:bg-gray-100 py-2.5">
                    <Link to="/campeonatos" className="w-full flex items-center gap-2">
                      <Trophy size={16} className="text-blue-primary" />
                      <span>Todos os Campeonatos</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <NavLink to="/galeria" isActive={isActive('/galeria')} icon={<Image size={18} />}>
                Galeria
              </NavLink>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <NavLink to="/transparencia" isActive={isActive('/transparencia')} icon={<FileText size={18} />}>
                Transparência
              </NavLink>
            </motion.div>
            
            <motion.div variants={itemAnimation}>
              <NavLink to="/contato" isActive={isActive('/contato')} icon={<Mail size={18} />}>
                Contato
              </NavLink>
            </motion.div>
            
            <motion.div variants={itemAnimation} className="ml-2">
              <Link to="/login">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-lime-primary text-blue-primary font-semibold hover:bg-lime-dark border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-xl"
                >
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div 
        className={cn(
          "md:hidden overflow-hidden transition-all duration-500 ease-in-out bg-gradient-to-b from-blue-light to-blue-primary",
          isMenuOpen ? "max-h-screen shadow-xl" : "max-h-0"
        )}
      >
        <div className="py-4 px-4 space-y-3 max-h-[calc(100vh-80px)] overflow-y-auto">
          <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)} icon={<Home size={18} />}>
            Início
          </MobileNavLink>
          
          <MobileNavLink to="/sobre" onClick={() => setIsMenuOpen(false)} icon={<Info size={18} />}>
            Sobre
          </MobileNavLink>
          
          {/* Campeonato Section with Toggle */}
          <div className="relative">
            <button 
              onClick={toggleCampeonato}
              className="text-white hover:text-lime-primary transition-colors duration-300 w-full font-semibold py-3 px-4 rounded-xl hover:bg-white/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Trophy size={18} />
                <span>Campeonato</span>
              </div>
              <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isCampeonatoOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <div 
              className={cn(
                "pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300",
                isCampeonatoOpen ? "max-h-60" : "max-h-0"
              )}
            >
              <MobileSubLink to="/times" onClick={() => setIsMenuOpen(false)} icon={<Users size={16} />}>
                Times
              </MobileSubLink>
              <MobileSubLink to="/jogos" onClick={() => setIsMenuOpen(false)} icon={<Calendar size={16} />}>
                Partidas
              </MobileSubLink>
              <MobileSubLink to="/estatisticas" onClick={() => setIsMenuOpen(false)} icon={<BarChart2 size={16} />}>
                Estatísticas
              </MobileSubLink>
              <MobileSubLink to="/classificacao" onClick={() => setIsMenuOpen(false)} icon={<Trophy size={16} />}>
                Classificação
              </MobileSubLink>
              <MobileSubLink to="/campeonatos" onClick={() => setIsMenuOpen(false)} icon={<Trophy size={16} />}>
                Todos os Campeonatos
              </MobileSubLink>
            </div>
          </div>
          
          <MobileNavLink to="/galeria" onClick={() => setIsMenuOpen(false)} icon={<Image size={18} />}>
            Galeria
          </MobileNavLink>
          
          <MobileNavLink to="/transparencia" onClick={() => setIsMenuOpen(false)} icon={<FileText size={18} />}>
            Transparência
          </MobileNavLink>
          
          <MobileNavLink to="/contato" onClick={() => setIsMenuOpen(false)} icon={<Mail size={18} />}>
            Contato
          </MobileNavLink>
          
          <Link to="/login" className="block mt-4" onClick={() => setIsMenuOpen(false)}>
            <Button 
              variant="outline" 
              className="w-full bg-lime-primary text-blue-primary font-semibold hover:bg-lime-dark border-none shadow-md hover:shadow-xl rounded-xl py-3"
            >
              <User className="mr-2 h-5 w-5" />
              Login
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

// Desktop Navigation Link component
const NavLink = ({ to, children, isActive, icon }: { to: string; children: React.ReactNode; isActive: boolean; icon: React.ReactNode }) => (
  <Link
    to={to}
    className={cn(
      "relative px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all duration-300 hover:bg-white/10",
      isActive 
        ? "text-lime-primary bg-white/10" 
        : "text-white"
    )}
  >
    {icon}
    {children}
    {isActive && (
      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-lime-primary rounded-full"></span>
    )}
  </Link>
);

// Mobile Navigation Link component
const MobileNavLink = ({ to, children, onClick, icon }: { to: string; children: React.ReactNode; onClick?: () => void; icon: React.ReactNode }) => (
  <Link
    to={to}
    className="text-white hover:text-lime-primary transition-colors duration-300 block font-semibold py-3 px-4 rounded-xl hover:bg-white/10 flex items-center gap-3"
    onClick={onClick}
  >
    {icon}
    {children}
  </Link>
);

// Mobile Sub Navigation Link component
const MobileSubLink = ({ to, children, onClick, icon }: { to: string; children: React.ReactNode; onClick?: () => void; icon: React.ReactNode }) => (
  <Link
    to={to}
    className="text-white hover:text-lime-primary transition-colors duration-300 block text-sm py-2.5 px-3 rounded-lg hover:bg-white/10 flex items-center gap-2"
    onClick={onClick}
  >
    {icon}
    {children}
  </Link>
);

export default Navbar;
