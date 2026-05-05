import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnnouncementsSection from './components/AnnouncementsSection';
import SportSection from '@/app/client/homepage/components/SportSection';
import HeaderSliderSection from './components/HeaderSliderSection';

export default function HomepagePage() {
  return (
    <main className="relative min-h-screen bg-background">
      <div className="grain-overlay" />
      <div className="grid-bg" />
      <Header />
      <HeaderSliderSection />
      <AnnouncementsSection />
      <SportSection />
      <Footer />
    </main>
  );
}