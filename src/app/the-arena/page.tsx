import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArenaHeroSection from './components/ArenaHeroSection';
import FacilitiesGridSection from './components/FacilitiesGridSection';

export default function TheArenaPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <div className="grain-overlay" />
      <div className="grid-bg" />
      <Header />
      <ArenaHeroSection />
      <FacilitiesGridSection />
      <Footer />
    </main>
  );
}