import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AboutBentoSection from './components/AboutBentoSection';
import EventsSection from './components/EventsSection';
import AnnouncementsSection from './components/AnnouncementsSection';

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