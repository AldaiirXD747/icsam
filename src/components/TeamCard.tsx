
import { Link } from 'react-router-dom';

interface TeamCardProps {
  id: number;
  name: string;
  logo: string;
  categories: string[];
  group: string;
}

const TeamCard: React.FC<TeamCardProps> = ({ id, name, logo, categories, group }) => {
  return (
    <Link to={`/teams/${id}`} className="block">
      <div className="glass-card p-6 flex flex-col items-center h-full transition-all duration-300 hover:translate-y-[-5px]">
        <div className="w-24 h-24 flex items-center justify-center mb-4">
          <img 
            src={logo} 
            alt={name} 
            className="w-full h-full object-contain"
          />
        </div>
        
        <h3 className="text-xl font-bold text-blue-primary mb-3 text-center">{name}</h3>
        
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {categories.map((category, index) => (
            <span 
              key={index}
              className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
            >
              {category}
            </span>
          ))}
        </div>
        
        <div className="text-sm font-medium text-gray-500">
          Grupo {group}
        </div>
      </div>
    </Link>
  );
};

export default TeamCard;
