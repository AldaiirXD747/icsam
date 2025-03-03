
import { useState } from 'react';

interface Scorer {
  id: number;
  name: string;
  teamName: string;
  teamLogo: string;
  goals: number;
  category: 'SUB-11' | 'SUB-13';
  position?: number;
  image?: string;
}

const mockScorers: Scorer[] = [
  {
    id: 1,
    name: 'Lucas Silva',
    teamName: 'Federal',
    teamLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/6.png',
    goals: 7,
    category: 'SUB-11',
    position: 1,
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 2,
    name: 'Pedro Alves',
    teamName: 'Furacão',
    teamLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/8.png',
    goals: 5,
    category: 'SUB-11',
    position: 2,
    image: 'https://images.unsplash.com/photo-1534308143481-c55f00be8bd7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 3,
    name: 'João Costa',
    teamName: 'Atlético City',
    teamLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/7.png',
    goals: 4,
    category: 'SUB-11',
    position: 3,
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 4,
    name: 'Matheus Oliveira',
    teamName: 'Grêmio',
    teamLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/Captura-de-tela-2025-02-13-112406.png',
    goals: 8,
    category: 'SUB-13',
    position: 1,
    image: 'https://images.unsplash.com/photo-1508341591423-4347099e1f19?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 5,
    name: 'Gabriel Santos',
    teamName: 'BSA',
    teamLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/4.png',
    goals: 6,
    category: 'SUB-13',
    position: 2,
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 6,
    name: 'Rafael Lima',
    teamName: 'Lyon',
    teamLogo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/lion.png',
    goals: 5,
    category: 'SUB-13',
    position: 3,
    image: 'https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60'
  },
];

const TopScorers = () => {
  const [selectedCategory, setSelectedCategory] = useState<'SUB-11' | 'SUB-13'>('SUB-11');
  
  const filteredScorers = mockScorers.filter(scorer => scorer.category === selectedCategory);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-lime-primary bg-opacity-20 px-4 py-1.5 rounded-full mb-2">
            <span className="text-blue-primary font-medium text-sm">Destaque</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-primary">Top Artilharia</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conheça os artilheiros de cada categoria do Campeonato Base Forte 2025.
          </p>
          
          <div className="flex justify-center mt-6 mb-8">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setSelectedCategory('SUB-11')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                  selectedCategory === 'SUB-11'
                    ? 'bg-blue-primary text-white'
                    : 'bg-white text-blue-primary border border-blue-primary hover:bg-blue-50'
                }`}
              >
                SUB-11
              </button>
              <button
                onClick={() => setSelectedCategory('SUB-13')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                  selectedCategory === 'SUB-13'
                    ? 'bg-blue-primary text-white'
                    : 'bg-white text-blue-primary border border-blue-primary hover:bg-blue-50'
                }`}
              >
                SUB-13
              </button>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredScorers.map((scorer) => {
              let medalClass = '';
              let medalText = '';
              
              if (scorer.position === 1) {
                medalClass = 'medal-gold';
                medalText = '1º Lugar';
              } else if (scorer.position === 2) {
                medalClass = 'medal-silver';
                medalText = '2º Lugar';
              } else if (scorer.position === 3) {
                medalClass = 'medal-bronze';
                medalText = '3º Lugar';
              }
              
              return (
                <div 
                  key={scorer.id} 
                  className={`glass-card p-6 relative overflow-hidden animate-fade-in-up`}
                  style={{ animationDelay: `${0.1 * scorer.position}s` }}
                >
                  {medalClass && (
                    <div className={`absolute top-0 right-0 w-24 h-24 transform rotate-45 translate-x-8 -translate-y-8 ${medalClass}`}></div>
                  )}
                  
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-blue-primary">
                      {scorer.image ? (
                        <img 
                          src={scorer.image} 
                          alt={scorer.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                          Sem foto
                        </div>
                      )}
                    </div>
                    
                    {medalText && (
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full mb-2 text-white ${medalClass}`}>
                        {medalText}
                      </span>
                    )}
                    
                    <h3 className="text-xl font-bold text-blue-primary mb-1">{scorer.name}</h3>
                    
                    <div className="flex items-center mb-3">
                      <img 
                        src={scorer.teamLogo} 
                        alt={scorer.teamName} 
                        className="w-6 h-6 object-contain mr-2"
                      />
                      <span className="text-sm text-gray-600">{scorer.teamName}</span>
                    </div>
                    
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                      <div 
                        className="bg-blue-primary h-1.5 rounded-full" 
                        style={{ width: `${(scorer.goals / 10) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="font-bold text-2xl text-blue-primary">
                      {scorer.goals} <span className="text-sm text-gray-500">gols</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopScorers;
