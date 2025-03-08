
import React, { useState, useEffect } from 'react';
import { ChevronUp, HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar o botão quando o usuário rolar a página
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Função para rolar para o topo da página
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed bottom-10 right-5 z-40 flex flex-col gap-2">
      {/* Botão para voltar ao topo */}
      {isVisible && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="rounded-full bg-blue-primary hover:bg-blue-700 text-white shadow-lg transition-all duration-300"
          aria-label="Voltar ao topo"
        >
          <ChevronUp size={24} />
        </Button>
      )}
      
      {/* Botão para voltar à página inicial */}
      <Link to="/">
        <Button
          size="icon"
          className="rounded-full bg-lime-primary hover:bg-lime-600 text-blue-primary shadow-lg transition-all duration-300"
          aria-label="Voltar para a página inicial"
        >
          <HomeIcon size={24} />
        </Button>
      </Link>
    </div>
  );
};

export default BackToTopButton;
