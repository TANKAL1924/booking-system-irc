import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FacilitiesGridSection from './components/FacilitiesGridSection';
import AmenitiesSection from './components/AmenitiesSection';
import PastEventsSection from './components/PastEventsSection';
import AboutBentoSection from './components/AboutBentoSection';

export default function TheArenaPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <div className="grain-overlay" />
      <div className="grid-bg" />
      <Header />
      <AboutBentoSection/>
      <FacilitiesGridSection />
      <AmenitiesSection />
      <PastEventsSection />
      <Footer />
    </main>
  );
}