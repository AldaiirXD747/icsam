import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-primary fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/a77367ed-485d-4364-b35e-3003be91a7cd.png" 
            alt="Base Forte" 
            className="h-8 mr-2 bg-white p-1 rounded" 
          />
          <span className="text-white font-bold text-lg">Base Forte</span>
        </Link>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden text-white focus:outline-none">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-lime-primary transition">
            Início
          </Link>
          <Link to="/sobre" className="text-white hover:text-lime-primary transition">
            Sobre
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white hover:text-lime-primary transition px-0 font-normal">
                Campeonato <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem>
                <Link to="/times" className="w-full">Times</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/jogos" className="w-full">Partidas</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/estatisticas" className="w-full">Estatísticas</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/classificacao" className="w-full">Classificação</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/campeonatos" className="w-full">Todos os Campeonatos</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/galeria" className="text-white hover:text-lime-primary transition">
            Galeria
          </Link>
          <Link to="/transparencia" className="text-white hover:text-lime-primary transition">
            Transparência
          </Link>
          <Link to="/contato" className="text-white hover:text-lime-primary transition">
            Contato
          </Link>
          <Link to="/login">
            <Button variant="outline" size="sm" className="bg-lime-primary text-blue-primary font-medium hover:bg-lime-dark border-none">
              <User className="mr-2 h-4 w-4" />
              Login
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-blue-primary py-4`}>
        <div className="flex flex-col items-center space-y-4">
          <Link to="/" className="text-white hover:text-lime-primary transition block">
            Início
          </Link>
          <Link to="/sobre" className="text-white hover:text-lime-primary transition block">
            Sobre
          </Link>
          <div className="w-full px-4">
            <div className="bg-blue-light rounded p-2">
              <h3 className="text-lime-primary font-medium text-sm mb-2 text-center">Campeonato</h3>
              <div className="space-y-2">
                <Link to="/times" className="text-white hover:text-lime-primary transition block text-sm pl-2">
                  Times
                </Link>
                <Link to="/jogos" className="text-white hover:text-lime-primary transition block text-sm pl-2">
                  Partidas
                </Link>
                <Link to="/estatisticas" className="text-white hover:text-lime-primary transition block text-sm pl-2">
                  Estatísticas
                </Link>
                <Link to="/classificacao" className="text-white hover:text-lime-primary transition block text-sm pl-2">
                  Classificação
                </Link>
                <Link to="/campeonatos" className="text-white hover:text-lime-primary transition block text-sm pl-2">
                  Todos os Campeonatos
                </Link>
              </div>
            </div>
          </div>
          <Link to="/galeria" className="text-white hover:text-lime-primary transition block">
            Galeria
          </Link>
          <Link to="/transparencia" className="text-white hover:text-lime-primary transition block">
            Transparência
          </Link>
          <Link to="/contato" className="text-white hover:text-lime-primary transition block">
            Contato
          </Link>
          <Link to="/login" className="w-full px-4">
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

export default Navbar;
