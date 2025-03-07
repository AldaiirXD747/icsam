
import { useEffect, useState } from 'react';
import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import ProgramsSection from '@/components/ProgramsSection';
import PartnersSection from '@/components/PartnersSection';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />
        
        {/* About Section */}
        <AboutSection />
        
        {/* Programs/Activities Section */}
        <ProgramsSection />
        
        {/* Partners Section */}
        <PartnersSection />
        
        {/* Contact Section */}
        <ContactSection />
      </main>
      
      {/* Só um rodapé */}
      <Footer />
    </div>
  );
};

export default Index;
