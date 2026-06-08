import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnnouncementsSection from './components/AnnouncementsSection';
import SportSection from '@/app/client/homepage/components/SportSection';
import HeaderSliderSection from './components/HeaderSliderSection';
import SEOHead from '@/components/SEOHead';

export default function HomepagePage() {
  return (
    <main className="relative min-h-screen bg-background">
      <SEOHead
        title="Home"
        description="Arena IRC — Malaysia's premier sports facility. Book badminton courts, futsal fields, and more online. Flexible memberships and exclusive promos available."
        url="https://arena-irc.com.my/"
      />
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