
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/transparency/HeroSection';
import DocumentsSection from '@/components/transparency/DocumentsSection';
import InfoSection from '@/components/transparency/InfoSection';

const Transparencia = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <HeroSection />
        <DocumentsSection />
        <InfoSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Transparencia;
