import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

interface TeamCardProps {
  id: string;
  name: string;
  logo: string;
  categories: string[];
}

const TeamCard: React.FC<TeamCardProps> = ({ id, name, logo, categories }) => {
  return (
    <Link to={`/team/${id}`} className="block group">
      <div className="glass-card p-6 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-md flex flex-col items-center h-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out"></div>
        
        <div className="w-28 h-28 flex items-center justify-center mb-5 p-3 rounded-full bg-white shadow-sm border border-blue-50">
          {logo ? (
            <img 
              src={logo} 
              alt={name} 
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-100 rounded-full text-blue-primary text-xl font-bold">
              {name.charAt(0)}
            </div>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-blue-primary mb-3 text-center group-hover:text-blue-600 transition-colors">{name}</h3>
        
        <div className="flex items-center justify-center mb-3">
          <Trophy className="h-4 w-4 text-lime-primary mr-1" />
          <span className="text-sm text-gray-600">Categorias:</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 mb-2">
          {categories.map((category, index) => (
            <span 
              key={`${id}-${category}-${index}`}
              className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 rounded-full text-xs font-medium border border-blue-200 transition-all duration-200 hover:shadow-sm"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default TeamCard;
