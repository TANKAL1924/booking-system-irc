import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from './components/HeroSection';
import AboutBentoSection from './components/AboutBentoSection';
import EventsSection from './components/EventsSection';
import AnnouncementsSection from './components/AnnouncementsSection';
import BookingCTASection from './components/BookingCTASection';

export default function HomepagePage() {
  return (
    <main className="relative min-h-screen bg-background">
      <div className="grain-overlay" />
      <div className="grid-bg" />
      <Header />
      <AboutBentoSection />
      <AnnouncementsSection />
      <EventsSection />

      <Footer />
    </main>
  );
}