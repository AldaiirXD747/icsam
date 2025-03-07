
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-blue-primary">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Página não encontrada</p>
        <p className="text-gray-500 mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="space-x-4">
          <Button asChild className="bg-blue-primary hover:bg-blue-dark">
            <Link to="/">Voltar para Home</Link>
          </Button>
          <Button asChild variant="outline" className="border-blue-primary text-blue-primary hover:bg-blue-50">
            <Link to="/contato">Contato</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
