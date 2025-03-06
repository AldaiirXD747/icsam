importtypescript
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.svg';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-primary fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Base Forte" className="h-8 mr-2" />
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
          <Link to="/teams" className="text-white hover:text-lime-primary transition">
            Times
          </Link>
          <Link to="/matches" className="text-white hover:text-lime-primary transition">
            Partidas
          </Link>
          <Link to="/statistics" className="text-white hover:text-lime-primary transition">
            Estatísticas
          </Link>
          <Link to="/standings" className="text-white hover:text-lime-primary transition">
            Classificação
          </Link>
          <Link to="/championships" className="text-white hover:text-lime-primary transition">
            Campeonatos
          </Link>
          <Link to="/sobre" className="text-white hover:text-lime-primary transition">
            Sobre
          </Link>
          <Link to="/transparencia" className="text-white hover:text-lime-primary transition">
            Transparência
          </Link>
          <Link to="/contato" className="text-white hover:text-lime-primary transition">
            Contato
          </Link>
        </div>
      </div>

      {/* Mobile Menu Content */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'none'} bg-blue-primary py-4`}>
        <div className="flex flex-col items-center space-y-4">
          <Link to="/" className="text-white hover:text-lime-primary transition block">
            Início
          </Link>
          <Link to="/teams" className="text-white hover:text-lime-primary transition block">
            Times
          </Link>
          <Link to="/matches" className="text-white hover:text-lime-primary transition block">
            Partidas
          </Link>
          <Link to="/statistics" className="text-white hover:text-lime-primary transition block">
            Estatísticas
          </Link>
          <Link to="/standings" className="text-white hover:text-lime-primary transition block">
            Classificação
          </Link>
          <Link to="/championships" className="text-white hover:text-lime-primary transition block">
            Campeonatos
          </Link>
          <Link to="/sobre" className="text-white hover:text-lime-primary transition block">
            Sobre
          </Link>
          <Link to="/transparencia" className="text-white hover:text-lime-primary transition block">
            Transparência
          </Link>
          <Link to="/contato" className="text-white hover:text-lime-primary transition block">
            Contato
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
