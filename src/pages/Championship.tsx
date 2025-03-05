
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ChampionshipDetails from '../components/ChampionshipDetails';
import Footer from '../components/Footer';

// Mock data for the championship
const championshipData = {
  id: 'base-forte-2025',
  name: 'Campeonato Base Forte',
  year: '2025',
  description: 'Campeonato de futebol de base organizado pelo Instituto Criança Santa Maria, revelando talentos e promovendo o esporte entre as categorias SUB-11, SUB-13, SUB-15 e SUB-17.',
  bannerImage: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/02/WhatsApp-Image-2025-01-30-at-16.19.31.jpeg',
  startDate: '09 Fev 2025',
  endDate: '22 Mar 2025',
  location: 'Campo do Instituto - Santa Maria, DF',
  categories: ['SUB-11', 'SUB-13', 'SUB-15', 'SUB-17'],
  organizer: 'Instituto Criança Santa Maria',
  sponsors: [
    {
      name: 'Ministério do Esporte',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2025/01/ASSINATURAS_ESPORTE__PRINCIPAL-scaled.jpg'
    },
    {
      name: 'Secretaria de Esporte e Lazer',
      logo: 'https://institutocriancasantamaria.com.br/wp-content/uploads/2024/11/cropped-LOGO-INSTITUTO-CORTADA-1.png'
    }
  ]
};

const Championship = () => {
  const { championshipId } = useParams<{ championshipId: string }>();
  
  // In a real app, you would fetch the championship data based on the ID
  // For now, we'll just use our mock data
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20 flex-grow">
        <ChampionshipDetails {...championshipData} />
      </div>
      <Footer />
    </div>
  );
};

export default Championship;
