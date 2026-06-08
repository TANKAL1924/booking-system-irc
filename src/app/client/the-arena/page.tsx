import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FacilitiesGridSection from './components/FacilitiesGridSection';
import AmenitiesSection from './components/AmenitiesSection';
import AboutBentoSection from './components/AboutBentoSection';
import PastEventsSection from './components/PastEventsSection';
import SEOHead from '@/components/SEOHead';

export default function TheArenaPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <SEOHead
        title="The Arena"
        description="Explore Arena IRC's world-class facilities including badminton courts, futsal fields, amenities, and past events. A premier sports hub in Malaysia."
        url="https://arena-irc.com.my/the-arena"
      />
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